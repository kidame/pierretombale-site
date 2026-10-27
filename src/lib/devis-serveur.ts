/**
 * LE TRAITEMENT D'UNE DEMANDE DE DEVIS, COTE SERVEUR (etape E6).
 *
 * Code PUR : pas de reseau, pas de variable d'environnement, pas de
 * Cloudflare. La fonction `functions/api/devis.ts` lit la requete, appelle ces
 * fonctions, puis envoie les courriels par Resend. Tout ce qui decide (champs
 * obligatoires, robots, fichiers, reference, texte du courriel) est ici, donc
 * teste par `npm test` (tests/devis-serveur.test.ts).
 *
 * Contrat : docs/devis-contrat.md. Les listes autorisees (polices, hauteurs,
 * finitions, motifs, granits) sont IMPORTEES de leur source unique, jamais
 * recopiees ici. Une valeur inconnue ne fait jamais echouer la demande : elle
 * part telle quelle dans le courriel, avec un signalement.
 *
 * Imports relatifs (pas d'alias "@/") : ce fichier est aussi assemble par
 * Cloudflare Pages pour la fonction, en dehors d'Astro.
 */
import granitsData from "../data/granits.json";
import { fichiersDevis, referenceDevis, delaiMinimalMs } from "../config/devis";
import {
  LIGNE_LONGUEUR_MAX,
  finitions,
  hauteursLettresMm,
  motifs,
  polices,
} from "../data/personnalisation";

/* ------------------------------------------------------------------ Types */

export interface FichierJoint {
  nom: string;
  type: string;
  taille: number;
  /** Lecture differee : le contenu n'est lu qu'au moment de l'envoi. */
  fichier: Blob;
}

export interface LigneDemande {
  numero: number;
  texte: string;
  hauteur: string;
}

export interface Demande {
  nom: string;
  email: string;
  telephone: string;
  localite: string;
  recontact: "telephone" | "email";
  quandAppeler: string;
  typeDemande: string;
  cimetiere: string;
  communeCimetiere: string;
  datePoseSouhaitee: string;
  famille: string;
  modele: string;
  granit: string;
  police: string;
  lignes: LigneDemande[];
  finition: string;
  motif: string;
  gravurePrecisions: string;
  message: string;
  fichiers: FichierJoint[];
  apercu: FichierJoint | null;
  /** La scene du configurateur, brute (JSON en texte), ou vide. */
  scene: string;
  /** Ce que les associes doivent savoir avant de repondre. */
  signalements: string[];
}

export type Lecture =
  | { statut: "robot" }
  | { statut: "invalide"; code: 400 | 413; erreurs: Record<string, string> }
  | { statut: "ok"; demande: Demande };

/** Une fiche du catalogue, telle que `/devis/modeles.json` la publie au build. */
export interface FicheCatalogue {
  nom: string;
  famille: string;
  url: string;
}
export type Catalogue = Record<string, FicheCatalogue>;

/* ------------------------------------------------------------ Constantes */

export const TYPES_DEMANDE: Record<string, string> = {
  nouveau: "Nouveau monument",
  inscription: "Inscription sur un monument existant",
  autre: "Autre demande",
};

const FAMILLES: Record<string, string> = {
  monument: "Monument funéraire",
  cineraire: "Monument cinéraire",
};

/** Longueurs maximales acceptees (le maxlength du HTML ne protege de rien). */
const LONGUEURS = {
  court: 200,
  long: 5000,
  scene: 60000,
};

/** L'apercu du configurateur pese 50 a 150 Ko ; au-dela, ce n'est pas lui. */
export const APERCU_TAILLE_MAX = 1.5 * 1024 * 1024;

const MESSAGES = {
  nom: "Merci d'indiquer votre nom et votre prénom.",
  email: "Merci d'indiquer une adresse e-mail : c'est par là que nous répondons.",
  emailInvalide: "Cette adresse e-mail ne semble pas valide : merci de la vérifier.",
  localite: "Merci d'indiquer votre localité.",
  typeDemande: "Merci de choisir le type de demande.",
  consentement: "Merci de cocher cette case pour que nous puissions traiter votre demande.",
};

/* ------------------------------------------------------- Lecture du form */

function brut(form: FormData, nom: string): string {
  const valeur = form.get(nom);
  return typeof valeur === "string" ? valeur : "";
}

/** Texte d'un champ, sans espaces autour, coupe a `max` caracteres. */
function texte(form: FormData, nom: string, max: number = LONGUEURS.court): string {
  return brut(form, nom).trim().slice(0, max);
}

/** Un fichier reel (un champ fichier vide arrive comme un fichier de 0 octet). */
function estFichier(valeur: FormDataEntryValue | null): valeur is File {
  return typeof valeur === "object" && valeur !== null && "size" in valeur && valeur.size > 0;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Lit et verifie une demande. Ne leve jamais : un robot, une saisie a corriger
 * ou une demande a transmettre.
 */
export function lisDemande(form: FormData, maintenant: number): Lecture {
  /* Les robots : le piege rempli, ou un envoi plus rapide qu'un humain. Un
     horodatage VIDE est normal (envoi sans JavaScript). */
  if (texte(form, "societe") !== "") return { statut: "robot" };
  const horodatage = Number(texte(form, "horodatage"));
  if (texte(form, "horodatage") !== "" && Number.isFinite(horodatage) && maintenant - horodatage < delaiMinimalMs) {
    return { statut: "robot" };
  }

  const erreurs: Record<string, string> = {};
  const nom = texte(form, "nom");
  const email = texte(form, "email");
  const localite = texte(form, "localite");
  const typeDemande = texte(form, "typeDemande");

  if (!nom) erreurs.nom = MESSAGES.nom;
  if (!email) erreurs.email = MESSAGES.email;
  else if (!EMAIL.test(email)) erreurs.email = MESSAGES.emailInvalide;
  if (!localite) erreurs.localite = MESSAGES.localite;
  if (!(typeDemande in TYPES_DEMANDE)) erreurs.typeDemande = MESSAGES.typeDemande;
  if (brut(form, "consentement") !== "oui") erreurs.consentement = MESSAGES.consentement;

  /* Les fichiers de la famille : 3 au plus, 8 Mo au total, quatre types. */
  const fichiers: FichierJoint[] = form
    .getAll("fichiers")
    .filter(estFichier)
    .map((fichier) => ({ nom: nomDeFichier(fichier.name), type: fichier.type, taille: fichier.size, fichier }));
  const types: readonly string[] = fichiersDevis.typesAcceptes;
  const refuse = fichiers.find((fichier) => !types.includes(fichier.type));
  const total = fichiers.reduce((somme, fichier) => somme + fichier.taille, 0);
  let code: 400 | 413 = 400;
  if (fichiers.length > fichiersDevis.nombreMax) {
    erreurs.fichiers = `Vous pouvez joindre ${fichiersDevis.nombreMax} fichiers au plus.`;
    code = 413;
  } else if (total > fichiersDevis.tailleTotaleMaxOctets) {
    erreurs.fichiers = "Les fichiers joints sont trop lourds : 8 Mo au total au maximum.";
    code = 413;
  } else if (refuse) {
    erreurs.fichiers = `Le fichier « ${refuse.nom} » n'est pas dans un format accepté : JPEG, PNG, WEBP ou PDF.`;
  }

  if (Object.keys(erreurs).length > 0) return { statut: "invalide", code, erreurs };

  const signalements: string[] = [];
  const signaleInconnu = (valeur: string, connus: readonly string[], quoi: string) => {
    if (valeur && !connus.includes(valeur)) signalements.push(`${quoi} inconnu reçu : « ${valeur} » (transmis tel quel).`);
  };

  /* Preference de recontact : le telephone demande un numero. */
  const telephone = texte(form, "telephone");
  const recontact = texte(form, "recontact") === "telephone" ? "telephone" : "email";
  const quandAppeler = recontact === "telephone" ? texte(form, "quandAppeler") : "";
  if (recontact === "telephone" && !telephone) {
    signalements.push("La famille préfère être appelée, mais n'a pas laissé de numéro : répondre par e-mail.");
  }

  const famille = texte(form, "famille");
  signaleInconnu(famille, Object.keys(FAMILLES), "Famille");
  const granit = texte(form, "granit");
  signaleInconnu(
    granit,
    granitsData.map((entree) => entree.id),
    "Granit",
  );
  const police = texte(form, "police");
  signaleInconnu(
    police,
    polices.map((entree) => entree.id),
    "Police",
  );
  const finition = texte(form, "finition");
  signaleInconnu(
    finition,
    finitions.map((entree) => entree.id),
    "Finition",
  );
  const motif = texte(form, "motif");
  signaleInconnu(
    motif,
    motifs.map((entree) => entree.id),
    "Motif",
  );
  if (motif === "autre" || motif === "dessin-fourni") {
    signalements.push("Motif « autre » ou dessin fourni : rappeler la famille pour le motif.");
  }

  const hauteurs = hauteursLettresMm.map(String);
  const lignes: LigneDemande[] = [];
  for (let numero = 1; numero <= 4; numero += 1) {
    const ligne = brut(form, `ligne${numero}_texte`).trim();
    if (!ligne) continue;
    if (ligne.length > LIGNE_LONGUEUR_MAX) {
      signalements.push(`La ligne ${numero} dépasse ${LIGNE_LONGUEUR_MAX} caractères.`);
    }
    const hauteur = texte(form, `ligne${numero}_hauteur`);
    signaleInconnu(hauteur, hauteurs, `Hauteur de la ligne ${numero}`);
    lignes.push({ numero, texte: ligne.slice(0, LONGUEURS.court), hauteur });
  }

  /* Le configurateur : un apercu JPEG et la scene en JSON, tous deux
     facultatifs. Le texte des lignes fait foi. */
  const fichierApercu = form.get("configurateur_apercu");
  let apercu: FichierJoint | null = null;
  if (estFichier(fichierApercu)) {
    if (fichierApercu.type === "image/jpeg" && fichierApercu.size <= APERCU_TAILLE_MAX) {
      apercu = { nom: "apercu.jpg", type: "image/jpeg", taille: fichierApercu.size, fichier: fichierApercu };
    } else {
      signalements.push("L'aperçu du configurateur reçu n'était pas une image JPEG de taille normale : écarté.");
    }
  }
  const scene = brut(form, "configurateur_scene").trim().slice(0, LONGUEURS.scene);
  if (scene) {
    try {
      const lu = JSON.parse(scene) as { version?: unknown };
      if (typeof lu !== "object" || lu === null || !("version" in lu)) {
        signalements.push("La composition du configurateur n'a pas de version : à relire.");
      }
    } catch {
      signalements.push("La composition du configurateur est illisible (JSON) : transmise telle quelle.");
    }
  }

  return {
    statut: "ok",
    demande: {
      nom,
      email,
      telephone,
      localite,
      recontact,
      quandAppeler,
      typeDemande,
      cimetiere: texte(form, "cimetiere"),
      communeCimetiere: texte(form, "communeCimetiere"),
      datePoseSouhaitee: texte(form, "datePoseSouhaitee", 40),
      famille,
      modele: texte(form, "modele"),
      granit,
      police,
      lignes,
      finition,
      motif,
      gravurePrecisions: texte(form, "gravure_precisions", LONGUEURS.long),
      message: texte(form, "message", LONGUEURS.long),
      fichiers,
      apercu,
      scene,
      signalements,
    },
  };
}

/** Nom de fichier sans chemin ni caracteres de controle, 120 caracteres au plus. */
function nomDeFichier(nom: string): string {
  const propre = (nom.split(/[\\/]/).pop() ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 120);
  return propre || "fichier";
}

/* ------------------------------------------------------------- Reference */

/**
 * `PT-AAAAMMJJ-xxxx` : la date du jour a Zurich, puis quatre caracteres tires
 * au hasard dans un alphabet sans 0/O ni 1/I (une reference se dicte).
 */
export function creeReference(maintenant: Date, hasard: (n: number) => number = hasardCrypto): string {
  const parties = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zurich",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(maintenant);
  const part = (type: string) => parties.find((p) => p.type === type)?.value ?? "";
  const alphabet = referenceDevis.alphabetSuffixe;
  let suffixe = "";
  for (let i = 0; i < referenceDevis.longueurSuffixe; i += 1) suffixe += alphabet[hasard(alphabet.length)];
  return `${referenceDevis.prefixe}-${part("year")}${part("month")}${part("day")}-${suffixe}`;
}

function hasardCrypto(n: number): number {
  const tirage = new Uint32Array(1);
  crypto.getRandomValues(tirage);
  return tirage[0] % n;
}

/* -------------------------------------------------------------- Courriels */

export interface Courriel {
  sujet: string;
  texte: string;
  html: string;
}

function echappe(valeur: string): string {
  return valeur
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Rubrique = { titre: string; lignes: Array<[string, string]> };

function nomListe(liste: ReadonlyArray<{ id: string; nom: string }>, id: string): string {
  if (!id) return "";
  return liste.find((entree) => entree.id === id)?.nom ?? id;
}

/**
 * Le courriel aux associes : la fiche de travail. La preference de recontact
 * et les signalements viennent en tete ; viennent ensuite la demande, le
 * monument et l'inscription telle que la famille l'a ecrite.
 */
export function courrielAssocies(
  demande: Demande,
  reference: string,
  options: { catalogue?: Catalogue | null; site: string; suspecte?: boolean; piecesJointes: string[] },
): Courriel {
  const fiche = demande.modele ? options.catalogue?.[demande.modele] : undefined;
  const modele = demande.modele
    ? fiche
      ? `${fiche.nom} (${new URL(fiche.url, options.site).href})`
      : `${demande.modele} (introuvable dans le catalogue)`
    : demande.typeDemande === "nouveau"
      ? "Pas encore choisi : la famille attend un conseil"
      : "";

  const contact =
    demande.recontact === "telephone"
      ? `Par téléphone${demande.telephone ? ` au ${demande.telephone}` : ""}${demande.quandAppeler ? `, ${demande.quandAppeler}` : ""}`
      : "Par e-mail";

  const attention: Array<[string, string]> = demande.signalements.map((s) => ["Attention", s]);
  if (options.suspecte) {
    attention.push(["Attention", "Demande suspecte (contrôle anti-robot échoué) : vérifier avant de répondre."]);
  }

  const rubriques: Rubrique[] = [
    { titre: "À retenir", lignes: [["Recontacter", contact], ...attention] },
    {
      titre: "Coordonnées",
      lignes: [
        ["Nom", demande.nom],
        ["E-mail", demande.email],
        ["Téléphone", demande.telephone],
        ["Localité", demande.localite],
      ],
    },
    {
      titre: "La demande",
      lignes: [
        ["Type", TYPES_DEMANDE[demande.typeDemande] ?? demande.typeDemande],
        ["Cimetière", demande.cimetiere],
        ["Commune du cimetière", demande.communeCimetiere],
        ["Pose souhaitée", demande.datePoseSouhaitee],
      ],
    },
    {
      titre: "Le monument",
      lignes: [
        ["Famille", FAMILLES[demande.famille] ?? demande.famille],
        ["Modèle", modele],
        ["Granit", nomListe(granitsData, demande.granit)],
      ],
    },
    {
      titre: "L'inscription",
      lignes: [
        ["Écriture", nomListe(polices, demande.police)],
        ...demande.lignes.map((ligne): [string, string] => [
          `Ligne ${ligne.numero}`,
          `${ligne.texte}${ligne.hauteur ? `  (lettres de ${Number(ligne.hauteur) / 10} cm)` : ""}`,
        ]),
        ["Finition", nomListe(finitions, demande.finition) || (demande.lignes.length ? "Pas encore choisie" : "")],
        ["Motif", nomListe(motifs, demande.motif)],
        ["Précisions", demande.gravurePrecisions],
      ],
    },
    { titre: "Message", lignes: [["", demande.message]] },
    { titre: "Pièces jointes", lignes: options.piecesJointes.map((nom): [string, string] => ["", nom]) },
  ];

  /* Une ligne vide n'apporte rien : on ne garde que ce qui est rempli. */
  const pleines = rubriques
    .map((rubrique) => ({ ...rubrique, lignes: rubrique.lignes.filter(([, valeur]) => valeur.trim() !== "") }))
    .filter((rubrique) => rubrique.lignes.length > 0);

  const rappel = "Rien n'est gravé sans bon à tirer validé par la famille.";

  const texteBrut = [
    `Demande de devis ${reference}`,
    "",
    ...pleines.flatMap((rubrique) => [
      rubrique.titre.toUpperCase(),
      ...rubrique.lignes.map(([etiquette, valeur]) => (etiquette ? `${etiquette} : ${valeur}` : valeur)),
      "",
    ]),
    rappel,
    "Répondre à ce courriel écrit directement à la famille.",
  ].join("\n");

  const html = [
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1c1b19;max-width:640px">`,
    `<h1 style="font-size:20px;margin:0 0 16px">Demande de devis ${echappe(reference)}</h1>`,
    ...pleines.map(
      (rubrique) =>
        `<h2 style="font-size:16px;margin:24px 0 8px;border-bottom:1px solid #ccc">${echappe(rubrique.titre)}</h2>` +
        `<table style="border-collapse:collapse;width:100%">` +
        rubrique.lignes
          .map(
            ([etiquette, valeur]) =>
              `<tr><td style="vertical-align:top;padding:4px 12px 4px 0;color:#55524b;white-space:nowrap">${echappe(etiquette)}</td>` +
              `<td style="vertical-align:top;padding:4px 0;white-space:pre-wrap">${echappe(valeur)}</td></tr>`,
          )
          .join("") +
        `</table>`,
    ),
    `<p style="margin-top:24px;color:#55524b">${echappe(rappel)} Répondre à ce courriel écrit directement à la famille.</p>`,
    `</div>`,
  ].join("");

  const prefixe = options.suspecte ? "[A VERIFIER] " : "";
  return {
    sujet: `${prefixe}Devis ${reference} - ${demande.nom} - ${demande.localite}`,
    texte: texteBrut,
    html,
  };
}

/**
 * L'accuse de reception a la famille. Volontairement court, et SANS reprendre
 * ce qu'elle a ecrit (hors son nom) : le formulaire ne doit pas servir a faire
 * envoyer un texte choisi a une adresse choisie.
 */
export function courrielAccuse(demande: Demande, reference: string): Courriel {
  const voie = demande.recontact === "telephone" && demande.telephone ? "par téléphone" : "par e-mail";
  const paragraphes = [
    `Bonjour ${demande.nom.slice(0, 80)},`,
    "Nous avons bien reçu votre demande de devis, et nous vous en remercions.",
    `Elle porte la référence ${reference} : vous pouvez la citer si vous nous écrivez ou nous appelez.`,
    `Nous vous recontactons ${voie} pour affiner votre demande. Rien n'est engagé, et rien n'est gravé avant votre accord sur une épreuve (bon à tirer).`,
    "Avec nos sentiments respectueux,",
    "PierreTombale.ch",
  ];
  return {
    sujet: `Votre demande de devis ${reference} - PierreTombale.ch`,
    texte: paragraphes.join("\n\n"),
    html:
      `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1c1b19;max-width:560px">` +
      paragraphes.map((p) => `<p>${echappe(p)}</p>`).join("") +
      `</div>`,
  };
}

/* ------------------------------------------------------------ Utilitaires */

/** Base64 d'un contenu binaire, par tranches (sans depasser la pile). */
export function enBase64(contenu: ArrayBuffer): string {
  const octets = new Uint8Array(contenu);
  let binaire = "";
  for (let i = 0; i < octets.length; i += 0x8000) {
    binaire += String.fromCharCode(...octets.subarray(i, i + 0x8000));
  }
  return btoa(binaire);
}
