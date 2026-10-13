/**
 * Les prix affichés : source unique.
 *
 * Tout vit dans `src/data/tarifs.json`, que les associés peuvent corriger sans
 * toucher au code (le JSON n'accepte pas de commentaires, d'où ce mode d'emploi
 * ici). Aucun prix ailleurs dans le site : les cartes, les fiches, le menu et
 * l'accueil passent tous par `prixAffiche(slug)`.
 *
 * MODE D'EMPLOI DE src/data/tarifs.json
 *
 *   "devise"               Toujours "CHF" aujourd'hui.
 *
 *   "fourchetteParDefaut"  Le prix affiché pour tout modèle qui n'a pas encore
 *                          le sien. Décision de Thomas du 13.10.2026 :
 *                          { "min": 1400, "max": 6000, "provisoire": true },
 *                          soit « De 1'400 à 6'000 CHF » en attendant les vrais
 *                          prix. Mettre `"provisoire": false` quand la
 *                          fourchette est validée, ou `null` à la place de tout
 *                          l'objet pour revenir à « Prix sur demande ».
 *
 *   "modeles"              Une entrée par fiche de src/content/products.
 *                          `null`                    = fourchette par défaut.
 *                          { "des": 2400 }           = « Dès 2'400 CHF ».
 *                          { "min": 2400,
 *                            "max": 3100 }           = « De 2'400 à 3'100 CHF ».
 *                          Un prix de modèle est considéré comme ferme : il
 *                          n'affiche pas la mention « prix indicatif » et il
 *                          produit une offre chiffrée dans les données
 *                          structurées (Google). Ne pas en mettre avant que le
 *                          coût de production soit connu.
 *                          Ajouter `"provisoire": true` à un prix de modèle le
 *                          traite comme indicatif (mention affichée, aucune
 *                          offre publiée).
 *
 * Un slug de "modeles" qui ne correspond à aucune fiche fait échouer le build
 * (faute de frappe) ; une fiche absente de "modeles" prend simplement la
 * fourchette par défaut.
 */
import tarifsData from "./tarifs.json";

/** Prix d'un modèle : une fourchette, ou un prix plancher « dès ». */
export type Prix = { min: number; max: number } | { des: number };

type PrixOuProvisoire = Prix & { provisoire?: boolean };

interface FichierTarifs {
  devise: string;
  fourchetteParDefaut: PrixOuProvisoire | null;
  modeles: Record<string, PrixOuProvisoire | null>;
}

/* Le JSON ne contient aujourd'hui que des `null` : TypeScript en déduirait que
   "modeles" ne peut contenir que `null`, et le premier vrai prix ajouté au
   fichier deviendrait une erreur de compilation. On relit donc le fichier à
   travers `FichierTarifs`, et `lireTarifs` le valide à l'exécution. */
const fichier = tarifsData as unknown as FichierTarifs;

export const devise: string = fichier.devise;

/** Mention affichée à côté d'un prix qui n'est pas encore ferme. */
export const MENTION_PRIX_PROVISOIRE = "Prix indicatif, devis personnalisé gratuit";

/** Affiché quand on n'a ni prix de modèle ni fourchette par défaut. */
export const PRIX_SUR_DEMANDE = "Prix sur demande";

function erreur(message: string): never {
  throw new Error(`src/data/tarifs.json : ${message}`);
}

function estMontant(valeur: unknown): valeur is number {
  return typeof valeur === "number" && Number.isFinite(valeur) && valeur > 0;
}

/** Valide une valeur de prix, pour qu'une faute de frappe arrête le build. */
function lirePrix(valeur: PrixOuProvisoire | null, ou: string): PrixOuProvisoire | null {
  if (valeur === null || valeur === undefined) return null;

  if ("des" in valeur) {
    if (!estMontant(valeur.des)) erreur(`${ou} : "des" doit être un montant positif.`);
    return valeur;
  }

  if ("min" in valeur || "max" in valeur) {
    if (!estMontant(valeur.min) || !estMontant(valeur.max)) {
      erreur(`${ou} : "min" et "max" doivent être des montants positifs.`);
    }
    if (valeur.min > valeur.max) erreur(`${ou} : "min" (${valeur.min}) dépasse "max" (${valeur.max}).`);
    return valeur;
  }

  erreur(`${ou} : prix attendu sous la forme { "des": n } ou { "min": n, "max": n }.`);
}

function lireTarifs() {
  if (!fichier.devise) erreur(`"devise" est obligatoire (ex. "CHF").`);

  const fourchetteParDefaut = lirePrix(fichier.fourchetteParDefaut, `"fourchetteParDefaut"`);
  const modeles = new Map<string, PrixOuProvisoire | null>();

  for (const [slug, valeur] of Object.entries(fichier.modeles ?? {})) {
    modeles.set(slug, lirePrix(valeur, `le modèle "${slug}"`));
  }

  return { fourchetteParDefaut, modeles };
}

const tarifs = lireTarifs();

/**
 * Format suisse des milliers, apostrophe droite : 1400 devient 1'400.
 * Fait à la main plutôt qu'avec Intl, dont l'apostrophe dépend de la version
 * d'ICU installée (droite ou typographique selon les machines).
 */
export function montantSuisse(montant: number): string {
  return Math.round(montant)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

function texte(prix: Prix): string {
  if ("des" in prix) return `Dès ${montantSuisse(prix.des)} ${devise}`;
  if (prix.min === prix.max) return `${montantSuisse(prix.min)} ${devise}`;
  return `De ${montantSuisse(prix.min)} à ${montantSuisse(prix.max)} ${devise}`;
}

/**
 * Le prix retenu pour un modèle : le sien s'il en a un, sinon la fourchette par
 * défaut, sinon rien. Un prix hérité de la fourchette par défaut garde son
 * caractère provisoire.
 */
function prixRetenu(slug: string): PrixOuProvisoire | null {
  return tarifs.modeles.get(slug) ?? tarifs.fourchetteParDefaut;
}

/** Le texte à afficher pour un modèle. Jamais vide. */
export function prixAffiche(slug: string): string {
  const prix = prixRetenu(slug);
  return prix === null ? PRIX_SUR_DEMANDE : texte(prix);
}

/** Vrai si le prix affiché est indicatif : il faut alors montrer la mention. */
export function prixEstProvisoire(slug: string): boolean {
  return prixRetenu(slug)?.provisoire === true;
}

/**
 * L'estimation affichée pour un ensemble de modèles : la page prix en montre
 * une par famille. Les bornes sont agrégées ici plutôt que recopiées dans la
 * page, pour que `src/data/tarifs.json` reste la seule source des montants.
 * Si un seul modèle du lot n'a qu'un prix plancher (« dès »), le lot n'a pas de
 * plafond connu et s'affiche lui aussi en « Dès n CHF ».
 */
export function fourchetteAffichee(slugs: readonly string[]): string {
  const prix = slugs.map(prixRetenu).filter((valeur): valeur is PrixOuProvisoire => valeur !== null);
  if (prix.length === 0) return PRIX_SUR_DEMANDE;

  const bas = Math.min(...prix.map((valeur) => ("des" in valeur ? valeur.des : valeur.min)));
  if (prix.some((valeur) => "des" in valeur)) return texte({ des: bas });

  const haut = Math.max(...prix.map((valeur) => ("des" in valeur ? valeur.des : valeur.max)));
  return texte({ min: bas, max: haut });
}

/** Vrai si l'un des modèles du lot n'a qu'un prix indicatif. */
export function fourchetteEstProvisoire(slugs: readonly string[]): boolean {
  return slugs.some((slug) => prixEstProvisoire(slug));
}

/**
 * L'offre à publier dans les données structurées, ou `null` : tant qu'un prix
 * est provisoire (ou inconnu), on ne chiffre rien pour Google. Un prix « dès »
 * donne une Offer, une fourchette donne un AggregateOffer.
 */
export function offreJsonLd(
  slug: string,
):
  | { "@type": "Offer"; price: number; priceCurrency: string }
  | { "@type": "AggregateOffer"; lowPrice: number; highPrice: number; priceCurrency: string }
  | null {
  const prix = prixRetenu(slug);
  if (prix === null || prix.provisoire === true) return null;

  if ("des" in prix) {
    return { "@type": "Offer", price: prix.des, priceCurrency: devise };
  }
  return {
    "@type": "AggregateOffer",
    lowPrice: prix.min,
    highPrice: prix.max,
    priceCurrency: devise,
  };
}

/**
 * Contrôle au build : tout slug de "modeles" doit correspondre à une fiche de
 * src/content/products. Une faute de frappe laisserait sinon un modèle au prix
 * par défaut sans que personne le remarque.
 */
export function verifieSlugsTarifs(slugsConnus: readonly string[]): void {
  const inconnus = [...tarifs.modeles.keys()].filter((slug) => !slugsConnus.includes(slug));
  if (inconnus.length === 0) return;

  erreur(
    `slug${inconnus.length > 1 ? "s" : ""} inconnu${inconnus.length > 1 ? "s" : ""} dans "modeles" : ` +
      `${inconnus.map((slug) => `"${slug}"`).join(", ")}. ` +
      `Fiches existantes dans src/content/products : ${slugsConnus.join(", ")}.`,
  );
}
