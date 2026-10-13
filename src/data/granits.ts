/**
 * La liste des granits proposés.
 *
 * Source unique : `src/data/granits.json`. C'est le SEUL endroit où vivent les
 * granits : on peut corriger la liste (ajouter, retirer, renommer, marquer un
 * granit indisponible) dans ce fichier JSON, sans toucher au code. Chaque fiche
 * produit référence un granit par son `id` ; un `id` inconnu fait échouer le
 * build au lieu de passer inaperçu.
 *
 * Les noms sont des noms commerciaux courants, à confronter avec ce qui peut
 * réellement être fourni (liste définitive à venir). Aucune origine
 * géographique n'est publiée sur le site.
 */
import granitsData from "./granits.json";

/** Teintes retenues pour le filtre « couleur » du catalogue. */
export const TEINTES = ["noir", "gris", "blanc", "bleu", "rose", "rouge", "vert", "beige"] as const;

export type Teinte = (typeof TEINTES)[number];

export interface Granit {
  /** Identifiant stable, en minuscules sans accent. Utilisé par les fiches produit. */
  id: string;
  /** Nom commercial affiché sur le site. */
  nom: string;
  teinte: Teinte;
  /** `false` retire le granit des choix proposés sans perdre sa fiche. */
  disponible: boolean;
  /** Chemin d'une photo d'échantillon, `null` tant qu'il n'y en a pas. */
  photo: string | null;
}

function estTeinte(valeur: string): valeur is Teinte {
  return (TEINTES as readonly string[]).includes(valeur);
}

/** Relit le JSON en le validant, pour qu'une faute de frappe arrête le build. */
function lireGranits(): Granit[] {
  const vus = new Set<string>();

  return granitsData.map((entree) => {
    if (!estTeinte(entree.teinte)) {
      throw new Error(
        `src/data/granits.json : le granit "${entree.id}" a la teinte inconnue "${entree.teinte}". ` +
          `Teintes acceptées : ${TEINTES.join(", ")}.`,
      );
    }
    if (vus.has(entree.id)) {
      throw new Error(`src/data/granits.json : l'identifiant "${entree.id}" apparaît deux fois.`);
    }
    vus.add(entree.id);

    return { ...entree, teinte: entree.teinte, photo: entree.photo ?? null };
  });
}

export const granits: Granit[] = lireGranits();

/** Tous les identifiants connus, pour valider les fiches produit au build. */
export const granitIds: string[] = granits.map((granit) => granit.id);

export function getGranit(id: string): Granit | undefined {
  return granits.find((granit) => granit.id === id);
}

/** Nom affichable d'un granit ; retourne l'identifiant brut si l'id est inconnu. */
export function nomGranit(id: string): string {
  return getGranit(id)?.nom ?? id;
}

export function granitsDisponibles(): Granit[] {
  return granits.filter((granit) => granit.disponible);
}

/** Titre d'un groupe de granits de même teinte. */
export const TEINTE_PLURIEL: Record<Teinte, string> = {
  noir: "Granits noirs",
  gris: "Granits gris",
  blanc: "Granits blancs",
  bleu: "Granits bleus",
  rose: "Granits rosés",
  rouge: "Granits rouges",
  vert: "Granits verts",
  beige: "Granits beiges",
};

/**
 * Couleur de la pastille affichée à côté d'un groupe : un repère APPROXIMATIF
 * de la teinte, pas un échantillon. Les vraies nuances ne se voient que sur
 * une photo ou sur la pierre, ce que la page doit dire.
 */
export const TEINTE_PASTILLE: Record<Teinte, string> = {
  noir: "#1c1c1b",
  gris: "#8b8b86",
  blanc: "#e7e5df",
  bleu: "#4a5a6e",
  rose: "#c7a79d",
  rouge: "#8d3c33",
  vert: "#4b5a46",
  beige: "#cabda4",
};

/** Groupe de granits d'une même teinte, prêt à afficher. */
export interface GroupeTeinte {
  teinte: Teinte;
  titre: string;
  pastille: string;
  granits: Granit[];
}

/**
 * Les granits disponibles regroupés par teinte, dans l'ordre de `TEINTES`.
 * Les teintes sans granit disponible sont omises : la page "Nos granits" et
 * l'accueil se construisent ainsi depuis `src/data/granits.json` seul.
 */
export function granitsParTeinte(): GroupeTeinte[] {
  const disponibles = granitsDisponibles();

  return TEINTES.map((teinte) => ({
    teinte,
    titre: TEINTE_PLURIEL[teinte],
    pastille: TEINTE_PASTILLE[teinte],
    granits: disponibles.filter((granit) => granit.teinte === teinte),
  })).filter((groupe) => groupe.granits.length > 0);
}
