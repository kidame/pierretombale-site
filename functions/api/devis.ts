/**
 * POST /api/devis : la demande de devis part par courriel (etape E6).
 *
 * Cloudflare Pages Functions : ce fichier est a la RACINE du depot
 * (functions/), pas dans dist ; l'integration Git de Pages l'assemble seule.
 * Toute la logique pure est dans src/lib/devis-serveur.ts (testee) ; ici, on
 * ne fait que lire la requete, verifier Turnstile, envoyer par Resend et
 * repondre. Contrat : docs/devis-contrat.md.
 *
 * VARIABLES CLOUDFLARE (Settings > Variables and Secrets), jamais dans le depot :
 *   RESEND_API_KEY      secret : cle Resend "Sending access", domaine mail.pierretombale.ch
 *   DEVIS_DESTINATAIRE  texte : l'adresse qui recoit les demandes
 *   DEVIS_EXPEDITEUR    texte, facultatif : defaut "PierreTombale.ch <devis@mail.pierretombale.ch>"
 *   TURNSTILE_SECRET    secret, facultatif : sans lui, pas de controle Turnstile
 *
 * Deux chemins : le `fetch` de la page attend du JSON ; un envoi sans
 * JavaScript (navigation) recoit une redirection 303.
 */
import {
  courrielAccuse,
  courrielAssocies,
  creeReference,
  enBase64,
  lisDemande,
  type Catalogue,
  type FichierJoint,
} from "../../src/lib/devis-serveur";

interface Env {
  RESEND_API_KEY?: string;
  DEVIS_DESTINATAIRE?: string;
  DEVIS_EXPEDITEUR?: string;
  TURNSTILE_SECRET?: string;
  ASSETS?: { fetch: (requete: Request | string | URL) => Promise<Response> };
}

interface Contexte {
  request: Request;
  env: Env;
}

const EXPEDITEUR_DEFAUT = "PierreTombale.ch <devis@mail.pierretombale.ch>";
const SITE = "https://www.pierretombale.ch";
/** Au-dela, ce n'est pas un formulaire normal (8 Mo de fichiers + l'apercu). */
const CORPS_MAX = 12 * 1024 * 1024;
const MESSAGE_PANNE = "Votre demande n'a pas pu être transmise. Merci de réessayer dans un instant.";

const ENTETES = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(statut: number, corps: unknown): Response {
  return new Response(JSON.stringify(corps), {
    status: statut,
    headers: { ...ENTETES, "Content-Type": "application/json; charset=utf-8" },
  });
}

function redirige(chemin: string, requete: Request): Response {
  return new Response(null, { status: 303, headers: { ...ENTETES, Location: new URL(chemin, requete.url).href } });
}

/** Un envoi sans JavaScript est une navigation ; le `fetch` de la page n'en est pas une. */
function estNavigation(requete: Request): boolean {
  const mode = requete.headers.get("Sec-Fetch-Mode");
  if (mode) return mode === "navigate";
  const accept = requete.headers.get("Accept") ?? "";
  return accept.includes("text/html") && !accept.includes("application/json");
}

export async function onRequestPost({ request, env }: Contexte): Promise<Response> {
  const navigation = estNavigation(request);
  const succes = () => (navigation ? redirige("/devis/merci/", request) : json(200, { ok: true }));
  const panne = () => (navigation ? redirige("/devis/", request) : json(500, { ok: false, message: MESSAGE_PANNE }));

  if (!env.RESEND_API_KEY || !env.DEVIS_DESTINATAIRE) {
    console.error("devis : RESEND_API_KEY ou DEVIS_DESTINATAIRE manquant");
    return panne();
  }

  const longueur = Number(request.headers.get("Content-Length") ?? "0");
  if (longueur > CORPS_MAX) {
    const erreurs = { fichiers: "Les fichiers joints sont trop lourds : 8 Mo au total au maximum." };
    return navigation ? redirige("/devis/", request) : json(413, { ok: false, erreurs });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return navigation ? redirige("/devis/", request) : json(400, { ok: false, message: MESSAGE_PANNE });
  }

  const lecture = lisDemande(form, Date.now());
  /* Un robot recoit la meme reponse qu'une famille : il n'apprend rien. */
  if (lecture.statut === "robot") return succes();
  if (lecture.statut === "invalide") {
    return navigation
      ? redirige("/devis/", request)
      : json(lecture.code, { ok: false, erreurs: lecture.erreurs });
  }
  const demande = lecture.demande;

  /* Turnstile, s'il est configure. Un echec ne perd pas la demande : elle part
     marquee "a verifier", mais sans accuse de reception (pas de courriel vers
     une adresse que personne n'a prouve tenir). */
  let suspecte = false;
  if (env.TURNSTILE_SECRET) {
    suspecte = !(await turnstileValide(env.TURNSTILE_SECRET, form, request));
  }

  const reference = creeReference(new Date());
  const catalogue = await lisCatalogue(env, request);

  /* Pieces jointes : les fichiers de la famille, l'apercu du configurateur et
     sa composition (JSON), qui sert a l'atelier pour relire les positions. */
  const pieces: Array<{ filename: string; content: string }> = [];
  const ajoute = async (fichier: FichierJoint, nom: string) => {
    pieces.push({ filename: nom, content: enBase64(await fichier.fichier.arrayBuffer()) });
  };
  try {
    for (const [index, fichier] of demande.fichiers.entries()) {
      await ajoute(fichier, `${reference}-${index + 1}-${fichier.nom}`);
    }
    if (demande.apercu) await ajoute(demande.apercu, `${reference}-apercu.jpg`);
    if (demande.scene) {
      pieces.push({
        filename: `${reference}-composition.json`,
        content: enBase64(new TextEncoder().encode(demande.scene).buffer as ArrayBuffer),
      });
    }
  } catch (erreur) {
    console.error("devis : lecture des fichiers impossible", erreur);
    return panne();
  }

  const expediteur = env.DEVIS_EXPEDITEUR || EXPEDITEUR_DEFAUT;
  const courriel = courrielAssocies(demande, reference, {
    catalogue,
    site: SITE,
    suspecte,
    piecesJointes: pieces.map((piece) => piece.filename),
  });

  const envoye = await envoieResend(env.RESEND_API_KEY, {
    from: expediteur,
    to: [env.DEVIS_DESTINATAIRE],
    reply_to: demande.email,
    subject: courriel.sujet,
    text: courriel.texte,
    html: courriel.html,
    attachments: pieces,
    idempotence: reference,
  });
  if (!envoye) return panne();

  /* L'accuse de reception est un plus : son echec ne fait pas echouer la
     demande, qui est deja chez les associes. */
  if (!suspecte) {
    const accuse = courrielAccuse(demande, reference);
    const ok = await envoieResend(env.RESEND_API_KEY, {
      from: expediteur,
      to: [demande.email],
      reply_to: env.DEVIS_DESTINATAIRE,
      subject: accuse.sujet,
      text: accuse.texte,
      html: accuse.html,
      idempotence: `${reference}-accuse`,
    });
    if (!ok) console.error(`devis ${reference} : accuse de reception non envoye`);
  }

  console.log(`devis ${reference} : transmis${suspecte ? " (a verifier)" : ""}`);
  return succes();
}

async function turnstileValide(secret: string, form: FormData, requete: Request): Promise<boolean> {
  const jeton = form.get("cf-turnstile-response");
  if (typeof jeton !== "string" || !jeton) return false;
  const corps = new FormData();
  corps.append("secret", secret);
  corps.append("response", jeton);
  const ip = requete.headers.get("CF-Connecting-IP");
  if (ip) corps.append("remoteip", ip);
  try {
    const reponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: corps,
    });
    const resultat = (await reponse.json()) as { success?: boolean };
    return resultat.success === true;
  } catch (erreur) {
    /* Turnstile injoignable : on ne bloque pas une famille pour autant. */
    console.error("devis : Turnstile injoignable", erreur);
    return true;
  }
}

/** Le catalogue publie au build (`/devis/modeles.json`), ou null s'il manque. */
async function lisCatalogue(env: Env, requete: Request): Promise<Catalogue | null> {
  if (!env.ASSETS) return null;
  try {
    const reponse = await env.ASSETS.fetch(new URL("/devis/modeles.json", requete.url));
    return reponse.ok ? ((await reponse.json()) as Catalogue) : null;
  } catch {
    return null;
  }
}

interface EnvoiResend {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: Array<{ filename: string; content: string }>;
  /** Cle d'idempotence : un double clic n'envoie pas deux courriels. */
  idempotence: string;
}

async function envoieResend(cle: string, envoi: EnvoiResend): Promise<boolean> {
  const { idempotence, ...corps } = envoi;
  try {
    const reponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cle}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotence,
      },
      body: JSON.stringify(corps),
    });
    if (!reponse.ok) {
      console.error(`devis : Resend a repondu ${reponse.status}`, (await reponse.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (erreur) {
    console.error("devis : Resend injoignable", erreur);
    return false;
  }
}
