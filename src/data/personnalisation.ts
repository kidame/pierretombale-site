/**
 * Les choix de personnalisation de la gravure : polices, hauteurs de lettres,
 * finitions, motifs.
 *
 * **Liste provisoire, à confirmer selon ce que nous savons graver.** Rien ici
 * n'est un engagement : les noms, les hauteurs et les finitions doivent être
 * confrontés à ce que l'atelier de gravure peut réellement produire. Tant que
 * ce n'est pas tranché, la page de devis présente ces choix comme des souhaits,
 * et le bon à tirer reste le seul document qui engage.
 *
 * SOURCE UNIQUE. Ce fichier est lu aujourd'hui par `src/pages/devis.astro`
 * (personnalisation guidée, étape E5) et sera lu demain par le configurateur
 * visuel (voir `docs/CONFIGURATEUR-FUTUR.md`). Les identifiants sont ceux du
 * contrat du formulaire (`docs/devis-contrat.md`) : les renommer oblige à les
 * renommer des deux côtés.
 *
 * Les polices viennent de paquets `@fontsource` (licence SIL OFL), sous-jeu
 * latin, chargées UNIQUEMENT sur `/devis/`. Voir l'en-tête de `devis.astro`.
 */

/* --------------------------------------------------------------- Polices */

/** Familles de dessin, dans le vocabulaire des graveurs. */
export type StylePolice = "romain" | "baton" | "anglaise" | "lapidaire";

export const STYLE_POLICE_LABELS: Record<StylePolice, string> = {
  romain: "Romain",
  baton: "Bâton",
  anglaise: "Anglaise",
  lapidaire: "Lapidaire",
};

export interface Police {
  /** Identifiant stable, envoyé par le formulaire. */
  id: string;
  /** Nom affiché à la famille. */
  nom: string;
  style: StylePolice;
  /** Pile CSS à appliquer. Le nom doit correspondre au `font-family` du paquet @fontsource. */
  famille: string;
}

/**
 * Les 6 polices retenues par `docs/SPEC-BUILD-SITE.md` (section 4), toutes
 * sous licence OFL et toutes disponibles en paquet `@fontsource` : aucune
 * n'a dû être remplacée par une approchante.
 */
export const polices: Police[] = [
  {
    id: "cinzel",
    nom: "Cinzel",
    style: "lapidaire",
    famille: '"Cinzel", Georgia, serif',
  },
  {
    id: "marcellus",
    nom: "Marcellus",
    style: "lapidaire",
    famille: '"Marcellus", Georgia, serif',
  },
  {
    id: "eb-garamond",
    nom: "EB Garamond",
    style: "romain",
    famille: '"EB Garamond", Georgia, serif',
  },
  {
    id: "jost",
    nom: "Jost",
    style: "baton",
    famille: '"Jost", Helvetica, Arial, sans-serif',
  },
  {
    id: "great-vibes",
    nom: "Great Vibes",
    style: "anglaise",
    famille: '"Great Vibes", cursive',
  },
  {
    id: "pinyon-script",
    nom: "Pinyon Script",
    style: "anglaise",
    famille: '"Pinyon Script", cursive',
  },
];

/** Police proposée par défaut sur chaque ligne. */
export const POLICE_DEFAUT = "cinzel";

export const policeIds: string[] = polices.map((police) => police.id);

export function getPolice(id: string): Police | undefined {
  return polices.find((police) => police.id === id);
}

/* ------------------------------------------------- Hauteurs de lettres */

/**
 * Hauteurs de lettres proposées, en millimètres. Presets du métier funéraire
 * (3 à 6 cm), repris de la spec : la gravure se facture à la lettre, et la
 * hauteur en est le premier critère.
 */
export const hauteursLettresMm = [30, 40, 50, 60] as const;

export type HauteurLettresMm = (typeof hauteursLettresMm)[number];

/** Hauteurs proposées par défaut selon le rôle de la ligne. */
export const hauteursParDefaut = {
  nom: 50,
  dates: 40,
  epitaphe: 30,
} as const;

/* ------------------------------------------------------------- Finitions */

export interface Finition {
  id: string;
  nom: string;
  /** Phrase courte affichée sous le choix. */
  aide: string;
  /** Couleur APPROXIMATIVE du texte dans l'aperçu. Jamais un échantillon. */
  couleurApercu: string;
}

export const finitions: Finition[] = [
  {
    id: "blanc",
    nom: "Peinture blanche",
    aide: "Le choix le plus courant, très lisible sur un granit foncé.",
    couleurApercu: "#f4f1ea",
  },
  {
    id: "dore",
    nom: "Peinture dorée",
    aide: "Un ton chaud, plus discret que la feuille d'or.",
    couleurApercu: "#d9b45c",
  },
  {
    id: "feuille-or",
    nom: "Feuille d'or",
    aide: "La finition la plus durable, et la plus coûteuse.",
    couleurApercu: "#d4af37",
  },
];

export const finitionIds: string[] = finitions.map((finition) => finition.id);

/** Finition servant de repère à l'aperçu tant que la famille n'a rien choisi. */
export const FINITION_APERCU_DEFAUT = "blanc";

export function getFinition(id: string): Finition | undefined {
  return finitions.find((finition) => finition.id === id);
}

/* ---------------------------------------------------------------- Motifs */

export interface Motif {
  id: string;
  nom: string;
  /** `true` quand le choix demande une explication ou un fichier de la famille. */
  demandePrecision: boolean;
}

export const motifs: Motif[] = [
  { id: "aucun", nom: "Aucun motif", demandePrecision: false },
  { id: "croix", nom: "Croix", demandePrecision: false },
  { id: "colombe", nom: "Colombe", demandePrecision: false },
  { id: "rose", nom: "Rose", demandePrecision: false },
  { id: "coeur", nom: "Cœur", demandePrecision: false },
  { id: "arbre", nom: "Arbre", demandePrecision: false },
  { id: "autre", nom: "Autre symbole (à préciser)", demandePrecision: true },
  { id: "dessin-fourni", nom: "Dessin fourni par la famille", demandePrecision: true },
];

export const motifIds: string[] = motifs.map((motif) => motif.id);

export const MOTIF_DEFAUT = "aucun";

export function getMotif(id: string): Motif | undefined {
  return motifs.find((motif) => motif.id === id);
}

/* --------------------------------------------------- Lignes d'inscription */

/**
 * Les lignes de l'inscription. Quatre lignes fixes : c'est ce qu'une stèle
 * reçoit le plus souvent (nom, dates, puis deux lignes libres), et cela évite
 * d'ajouter du JavaScript pour en créer d'autres. Une inscription plus longue
 * passe par le champ « Précisions sur la gravure ».
 */
export interface LigneInscription {
  /** Numéro de 1 à 4 ; sert à nommer les champs `ligne<n>_texte`, etc. */
  numero: 1 | 2 | 3 | 4;
  /** Libellé du champ. */
  label: string;
  /** Aide affichée sous le champ, ou `null`. */
  aide: string | null;
  hauteurParDefaut: number;
}

export const lignesInscription: LigneInscription[] = [
  {
    numero: 1,
    label: "Ligne 1",
    aide: "Le plus souvent le nom.",
    hauteurParDefaut: hauteursParDefaut.nom,
  },
  {
    numero: 2,
    label: "Ligne 2",
    aide: "Le plus souvent les dates.",
    hauteurParDefaut: hauteursParDefaut.dates,
  },
  { numero: 3, label: "Ligne 3", aide: null, hauteurParDefaut: hauteursParDefaut.epitaphe },
  { numero: 4, label: "Ligne 4", aide: null, hauteurParDefaut: hauteursParDefaut.epitaphe },
];

/** Longueur maximale d'une ligne, en caractères. */
export const LIGNE_LONGUEUR_MAX = 60;

/**
 * Mention obligatoire sous tout aperçu, ici comme dans le configurateur à
 * venir : un aperçu n'engage personne, seul le bon à tirer engage.
 */
export const MENTION_APERCU =
  "Aperçu indicatif. Vérifiez l'orthographe des noms et des dates : la maquette définitive vous sera soumise pour accord (bon à tirer) avant toute gravure.";
