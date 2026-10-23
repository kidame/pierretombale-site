/**
 * L'INSCRIPTION GUIDEE (decidee par Thomas le 23.10.2026, version audacieuse).
 *
 * La famille ne manipule plus des « zones » : elle remplit des champs (prenom,
 * nom, dates, phrase) et choisit une mise en page. Le configurateur compose
 * lui-meme l'inscription avec des tailles du metier, la plus grande qui tient
 * sur la stele (`src/scripts/configurateur/composition.ts`). La mise en page
 * libre (zones deplacables) reste accessible derriere un bouton.
 *
 * Tout ce qui se change souvent est ICI : mises en page, tailles essayees,
 * espaces, phrases proposees. Les tailles sont des hauteurs de MAJUSCULE en
 * millimetres (voir `capitale` dans `personnalisation.ts`).
 *
 * Reperes (recherche du 23.10.2026, a confirmer par le graveur) : 3 a 6 cm
 * pour les noms, 3 cm courant pour les chiffres, 1,5 a 3 cm pour une phrase ;
 * une epitaphe de 10 a 30 mots.
 */

export type MiseEnPageId = "classique" | "dedicace" | "couple";

export interface MiseEnPage {
  id: MiseEnPageId;
  nom: string;
  description: string;
  /** Nombre de personnes a saisir. */
  personnes: 1 | 2;
  /** `true` : la phrase passe au-dessus du nom (une dedicace). */
  phraseEnHaut: boolean;
}

export const misesEnPage: MiseEnPage[] = [
  {
    id: "classique",
    nom: "Classique",
    description: "Le nom, les dates, puis une phrase si vous le souhaitez.",
    personnes: 1,
    phraseEnHaut: false,
  },
  {
    id: "dedicace",
    nom: "Dédicace en haut",
    description: "Quelques mots au-dessus du nom, comme « À notre maman ».",
    personnes: 1,
    phraseEnHaut: true,
  },
  {
    id: "couple",
    nom: "Deux personnes",
    description: "Deux noms et leurs dates, l'un sous l'autre, puis une phrase.",
    personnes: 2,
    phraseEnHaut: false,
  },
];

export const MISE_EN_PAGE_DEFAUT: MiseEnPageId = "classique";

export type RoleTexte = "nom" | "dates" | "phrase";

/**
 * Les tailles essayees, de la plus grande a la plus petite (mm de majuscule).
 * La composition garde la premiere qui tient en largeur, puis descend d'un cran
 * (la phrase d'abord, puis les dates, puis le nom) tant que la hauteur deborde.
 */
export const taillesParRole: Record<"une" | "deux", Record<RoleTexte, number[]>> = {
  une: {
    nom: [50, 40, 30, 25, 20],
    dates: [40, 30, 25, 20, 15],
    phrase: [25, 20, 15],
  },
  deux: {
    nom: [40, 30, 25, 20],
    dates: [30, 25, 20, 15],
    phrase: [25, 20, 15],
  },
};

/** Les blancs entre les blocs, en cm de pierre. */
export const ESPACES_CM = {
  /** Entre le nom et les dates d'une meme personne. */
  dansPersonne: 1.5,
  /** Entre deux personnes, ou entre une personne et la phrase. */
  entreBlocs: 3.5,
};

/** Part de la largeur de la zone gravable qu'une ligne peut occuper. */
export const LARGEUR_UTILE = 0.95;

export const PHRASE_LONGUEUR_MAX = 200;
export const PHRASE_LIGNES_MAX = 5;

/** Separateur des dates : « 1948 - 2026 ». */
export const SEPARATEUR_DATES = " - ";

/** Devant le nom de jeune fille : « née DUPONT ». */
export const PREFIXE_NOM_DE_NAISSANCE = "née";

/**
 * Les phrases proposees, par theme. Un clic les recopie dans le champ, que la
 * famille modifie ensuite comme elle veut.
 */
export const phrasesSuggerees: Array<{ theme: string; phrases: string[] }> = [
  {
    theme: "Affection",
    phrases: [
      "Tu resteras toujours dans nos cœurs",
      "Ton souvenir restera à jamais gravé dans nos cœurs",
      "À jamais dans nos pensées",
      "Ceux que l'on aime ne meurent jamais",
    ],
  },
  {
    theme: "Dédicace",
    phrases: ["À notre maman", "À notre papa", "À nos parents", "À notre ami"],
  },
  {
    theme: "Foi",
    phrases: ["Repose en paix", "Dans la paix du Seigneur", "Que ton âme repose en paix"],
  },
  {
    theme: "Sobriété",
    phrases: ["Regrets éternels", "Le temps passe, le souvenir reste", "In memoriam"],
  },
];
