/**
 * Les pages cimetiere (/cimetieres/). UNE SEULE SOURCE pour le hub, les fiches
 * et les liens vers le devis.
 *
 * ================= COMMENT AJOUTER OU CORRIGER UNE COMMUNE =================
 * 1. Corriger d abord le document de travail : docs/DIMENSIONS-MONUMENTS.md
 *    (regles, dimensions, articles, contacts), docs/REGLEMENTS-CIMETIERES-NE.md
 *    (details, tarifs officiels, rapports) et docs/CIMETIERES-PRATIQUE.md
 *    (adresse, acces, horaires, equipements, histoire).
 * 2. Une ligne du tableau du hub : ajouter un objet a `COMMUNES_NE`. Le champ
 *    `texte` porte le nom exact du reglement et sa date ; `url` seulement si le
 *    document est en ligne (jamais d adresse inventee).
 * 3. Une page complete : ajouter un objet a `CIMETIERES` et relier la commune
 *    du tableau par son `slug`. La page se construit toute seule
 *    (src/pages/cimetieres/[slug].astro, getStaticPaths).
 * 4. Mettre `verifieLe` a la date de la relecture.
 *
 * REGLE DE CONTENU (brief du 29.10.2026, docs/BRIEF-CIMETIERES-LOT2.md) :
 * rien ici qui ne figure pas dans les trois documents ci-dessus. Une valeur
 * absente n est PAS affichee : on omet le champ, ou on ecrit que la valeur est
 * a demander a l office. Chaque regle porte son article. Les seuls montants
 * cites sont des TAXES COMMUNALES datees et sourcees : aucun prix de
 * l entreprise (ceux-la vivent dans src/data/tarifs.json).
 *
 * `valide()` est appele au chargement du module : une fiche incomplete ou un
 * titre trop long arrete le build au lieu de publier une page bancale.
 */

import type { SourceId } from "@/data/cimetieres-ne";

/** Date de la derniere relecture des documents cites par ces pages. */
export const VERIFIE_LE = "29 octobre 2026";

/** Adresse de la page d index. */
export const CIMETIERES_URL = "/cimetieres/";

/**
 * Mention affichee en tete de chaque page. Meme role que celle des guides :
 * dire quand la page a ete verifiee et ce que nous faisons avant une pose.
 */
export function mentionVerification(date: string): string {
  return (
    `Informations vérifiées le ${date} dans les règlements communaux et sur les pages officielles ` +
    "des communes. Elles peuvent changer : nous vérifions toujours le règlement du cimetière " +
    "concerné avant la pose."
  );
}

/** Phrase fixe de la section « Poser un monument », identique sur chaque page. */
export const PHRASE_SUR_MESURE =
  "Nos monuments sont réalisés sur mesure, aux dimensions autorisées dans ce cimetière ; " +
  "nous vérifions le règlement et nous déposons la demande de pose.";

/** Le service communal a qui s adressent les demarches officielles. */
export interface Contact {
  /** Nom du service, tel qu il se presente. */
  service: string;
  adresse?: string;
  telephone?: string;
  /** Second numero publie (responsable, urgences). */
  telephoneSecondaire?: string;
  email?: string;
  /** Horaires du guichet, pas ceux du cimetiere. */
  horaires?: string;
  url?: string;
}

/** Une ligne du tableau des dimensions. */
export interface Dimension {
  /** Ex. « Tombe d'adulte, inhumation ». */
  type: string;
  /** Ex. « 70 x 130 cm de surface ». Jamais vide. */
  dimensions: string;
  /** Hauteur hors sol quand elle est publiee. */
  hauteurMax?: string;
  /** Ex. « art. 38 ». */
  article: string;
}

/** Les trois chiffres du bloc « L'essentiel ». */
export interface Chiffres {
  delai: string;
  tombeAdulte: string;
  hauteurMax: string;
}

export interface Regles {
  delaiPose: string;
  periodeInterdite?: string;
  tombes: Dimension[];
  bordure: string;
  materiaux?: string;
  autorisation?: string;
  taxePose?: string;
  /** Jalon, nom du marbrier, publicite, monument non conforme... */
  obligations: string[];
}

export interface LigneTarif {
  prestation: string;
  /** Montant pour une personne domiciliee dans la commune. */
  domicilie: string;
  /** Montant pour une personne non domiciliee, quand il est publie. */
  exterieur?: string;
}

export interface Tarifs {
  /** Ex. « arrêté du 15 novembre 2021, en vigueur depuis le 1er janvier 2022 ». */
  date: string;
  /** Document en ligne, quand il existe. */
  source?: SourceId;
  /** Nom du document quand il n est pas en ligne. */
  sourceLibelle?: string;
  lignes: LigneTarif[];
  note?: string;
}

export interface QuestionCimetiere {
  question: string;
  reponse: string;
}

export interface Cimetiere {
  /** Dernier segment de l adresse, sans barre oblique. */
  slug: string;
  /** Nom complet, celui du h1. Ex. « Cimetière de Beauregard ». */
  nom: string;
  /** Nom court, pour les listes et le pre-remplissage du devis. */
  nomCourt: string;
  /** Commune responsable du cimetiere (apres les fusions). */
  commune: string;
  /** Localites desservies, pour le chapo et la recherche. */
  localites: string[];
  /** <title> de la page, sans le nom du site. 65 signes au plus. */
  titreSeo: string;
  /** Meta description, 120 a 160 signes. */
  description: string;
  /** Deux phrases sous le h1. */
  chapo: string;
  adresse?: string;
  /** Horaires du cimetiere lui-meme. */
  horaires?: string;
  contact: Contact;
  acces?: string[];
  equipements: string[];
  /** Travaux et nouveaux quartiers annonces par la commune. */
  projets?: string[];
  histoire?: string[];
  regles: Regles;
  chiffres: Chiffres;
  /** Urnes, columbarium, jardin du souvenir. */
  cineraire: string[];
  tarifs?: Tarifs;
  /** Duree de la tombe et reprise du monument. */
  duree: string[];
  entretien?: string[];
  faq: QuestionCimetiere[];
  sources: SourceId[];
  verifieLe: string;
}

/* ======================================================================== */
/* Les fiches completes                                                      */
/* ======================================================================== */

export const CIMETIERES: Cimetiere[] = [
  /* ----------------------------------------------------- Beauregard ------ */
  {
    slug: "beauregard-neuchatel",
    nom: "Cimetière de Beauregard",
    nomCourt: "Beauregard",
    commune: "Neuchâtel",
    localites: ["Neuchâtel"],
    titreSeo: "Cimetière de Beauregard à Neuchâtel : accès, horaires, monuments",
    description:
      "Cimetière de Beauregard à Neuchâtel : adresse, horaires, bus, crématoire, columbarium, dimensions des monuments autorisées et taxes communales.",
    chapo:
      "Le cimetière de Beauregard, à Neuchâtel, réunit le crématoire, la chapelle et l'Office des cimetières de la Ville. Voici ce qu'il faut savoir pour s'y rendre, organiser une cérémonie et y poser un monument.",
    adresse: "avenue Edouard-Dubois 28, 2000 Neuchâtel",
    horaires: "Ouvert 24 h sur 24.",
    contact: {
      service: "Office des cimetières de la Ville de Neuchâtel",
      adresse: "avenue Edouard-Dubois 28, 2000 Neuchâtel",
      telephone: "032 717 72 47",
      telephoneSecondaire: "032 717 72 48 (responsable)",
      email: "cimetiere.beauregard@ne.ch",
      horaires: "Guichet les jours ouvrables, 8 h-12 h et 13 h 30-17 h.",
      url: "https://www.neuchatelville.ch/vivre-a-neuchatel/habitant-e-s/cimetieres/cimetiere-de-beauregard",
    },
    acces: [
      "Bus 120 et 122, arrêts « Neuchâtel, Cimetière » et « Neuchâtel, Beauregard » ; la ligne 101 s'arrête aussi à Beauregard.",
      "Trois parkings payants selon la page de la Ville ; environ 60 places sont disponibles pour les cérémonies (rapport du Conseil communal 17-015, 2017).",
    ],
    equipements: [
      "Un crématoire, équipé d'un four électrique à filtres depuis septembre 2020.",
      "Une chapelle de 160 places, pour une cérémonie laïque ou religieuse, et des chambres mortuaires.",
      "Des cérémonies du lundi au vendredi à 9 h, 11 h, 14 h et 16 h ; elles peuvent aussi avoir lieu en plein air, au jardin du recueillement, ou en chambre mortuaire.",
      "Des inhumations de cendres du lundi au vendredi à 8 h, 10 h, 12 h et 15 h, sur rendez-vous.",
      "Un columbarium (niches de 2 ou 4 urnes, 40 ans au plus) et un jardin du souvenir, où les cendres sont déposées sans urne.",
      "La Tombe du souvenir, anonyme, ouverte en 1953, avec le monument de Paul Roethlisberger restauré en 2021.",
      "Le Quartier des quatre saisons, semi-anonyme : les cendres y sont déposées sans urne et le nom figure dix ans sur une rondelle de verre, parmi les sculptures de Fabien Jeanmaire.",
      "Un quartier des enfants, et le quartier G multiconfessionnel de longue durée (60 ans), ouvert en 2015 : il n'y a pas de carré réservé à une communauté, et une orientation vers La Mecque est possible sur arrangement préalable.",
      "Des visites gratuites « Que vais-je devenir après ma mort ? » un samedi par mois.",
    ],
    projets: [
      "Un nouveau quartier des enfants est prévu en 2026 et un nouveau quartier cinéraire en 2027-2028, où les cendres seront déposées en sac de lin ou de coton sous des dalles nominatives posées dans la pelouse (rapport du Conseil communal 26-012 du 1er avril 2026). Les formats de ces dalles ne sont pas encore publiés.",
    ],
    histoire: [
      "Le cimetière a été inauguré le 4 juin 1883 et couvre environ cinq hectares (rapport du Conseil communal 23-005 du 15 mai 2023).",
      "L'Atelier des musées y organise des balades géologiques consacrées aux pierres tombales et à l'origine de leurs roches.",
    ],
    regles: {
      delaiPose:
        "Un an au plus tôt après l'inhumation. Les plans sont approuvés par l'Office des cimetières, qui délivre le permis de pose (art. 39).",
      tombes: [
        {
          type: "Surface de la tombe, monument et fleurs compris (adulte, inhumation)",
          dimensions: "70 x 130 cm",
          article: "art. 38",
        },
        {
          type: "Surface de la tombe (crémation, et enfant de 0 à 10 ans)",
          dimensions: "60 x 100 cm",
          article: "art. 38",
        },
        {
          type: "Stèle, inhumation d'adulte",
          dimensions: "70 cm de large, épaisseur 30 cm en haut et 45 cm en bas",
          hauteurMax: "120 cm",
          article: "gabarits du 9 octobre 1990",
        },
        {
          type: "Stèle, incinération",
          dimensions: "60 cm de large, épaisseur 25 cm en haut et 40 cm en bas",
          hauteurMax: "80 cm",
          article: "gabarits du 9 octobre 1990",
        },
        {
          type: "Stèle, enfant de 0 à 10 ans",
          dimensions: "50 cm de large, épaisseur 25 cm en haut et 35 cm en bas",
          hauteurMax: "70 cm",
          article: "gabarits du 9 octobre 1990",
        },
        {
          type: "Dalle couchée, inhumation d'adulte",
          dimensions: "70 x 130 cm, épaisseur 15 cm à la tête et 10 cm au pied",
          article: "gabarits du 9 octobre 1990",
        },
        {
          type: "Dalle couchée, incinération ou enfant",
          dimensions: "60 x 100 cm, épaisseur 15 cm à la tête et 10 cm au pied",
          article: "gabarits du 9 octobre 1990",
        },
        {
          type: "Croix, inhumation d'adulte",
          dimensions: "69 cm de large, socle 60 x 30 cm, épaisseur 23 cm",
          hauteurMax: "140 cm",
          article: "gabarits du 9 octobre 1990",
        },
        {
          type: "Croix, incinération",
          dimensions: "60 cm de large, socle 50 x 25 cm, épaisseur 20 cm",
          hauteurMax: "110 cm",
          article: "gabarits du 9 octobre 1990",
        },
        {
          type: "Obélisque, inhumation d'adulte",
          dimensions: "30 cm de large en haut, 40 cm à la base",
          hauteurMax: "140 cm",
          article: "gabarits du 9 octobre 1990",
        },
        {
          type: "Jardinière dans une dalle couchée",
          dimensions: "50 x 40 cm pour une inhumation, 40 x 40 cm pour une incinération",
          article: "gabarits du 9 octobre 1990",
        },
      ],
      bordure:
        "Interdite. À Beauregard, le monument est posé à même le sol, sans bordure ni entourage, et il suit les gabarits communaux (art. 31). Les tombes sont engazonnées ou couvertes de plantes tapissantes, et le gravier est interdit (art. 33).",
      materiaux:
        "Pierre du pays (roc, pierre jaune, granit) ou pierre analogue, marbre, métal, bois et béton ; les tons extrêmes du polissage du marbre sont soumis à autorisation (art. 31).",
      autorisation:
        "Les plans du monument sont approuvés par l'Office des cimetières, qui délivre le permis de pose (art. 39). Le Conseil communal peut accorder des dérogations (art. 41).",
      taxePose:
        "CHF 60.- par mètre de pourtour du monument augmenté de sa hauteur (arrêté du Conseil communal du 15 novembre 2021, en vigueur depuis le 1er janvier 2022). La Ville a adopté un nouveau règlement des taxes le 17 novembre 2025, qui ne fixe aucun montant de cimetière : nous contrôlons le tarif en vigueur avant chaque pose.",
      obligations: [
        "L'entrepreneur répond seul de la conformité du monument, et un monument non conforme est enlevé à ses frais (art. 40).",
        "Les ornements provisoires sont enlevés à la pose du monument (art. 32) et les décorations de Noël ou de Pâques deux mois après les fêtes (art. 33).",
        "La publicité est interdite dans le cimetière et dans la zone de verdure qui l'entoure (art. 51).",
      ],
    },
    chiffres: {
      delai: "1 an après l'inhumation",
      tombeAdulte: "70 x 130 cm de surface",
      hauteurMax: "120 cm (stèle d'adulte)",
    },
    cineraire: [
      "Une urne peut être déposée dans une tombe, à 70 cm de profondeur, ou placée dans une niche ; les urnes biodégradables sont favorisées depuis 2017 (art. 17). Une tombe reçoit trois urnes au plus (art. 18).",
      "Les niches du columbarium se louent 10 ou 20 ans, renouvelables jusqu'à 40 ans au total, et contiennent 2 urnes, ou 4 dans les grandes niches (art. 22). La plaque de fermeture et sa gravure sont à la charge de la famille, « selon tarif du marbrier » selon l'arrêté communal.",
      "La surface d'une tombe de crémation est de 60 x 100 cm (art. 38) et la stèle mesure au plus 60 cm de large sur 80 cm de haut (gabarits du 9 octobre 1990) : c'est la hauteur à contrôler avant de choisir un modèle.",
      "Le jardin du souvenir reçoit les cendres sans urne et sans nom. La Tombe du souvenir est anonyme ; les cendres qui n'ont pas été retirées après deux ans y sont déposées (art. 19).",
      "Le Quartier des quatre saisons est semi-anonyme : une plaquette porte le prénom, le nom et les années pendant dix ans (art. 20).",
      "Une concession de famille pour des cendres se prend pour 50 ans, renouvelable 49 ans ; elle est annulée sans indemnité si elle n'est pas entretenue, après deux avertissements (art. 23).",
      "Une urne peut être remise aux proches sur demande : la garder chez soi est possible (art. 18).",
    ],
    tarifs: {
      date: "arrêté du Conseil communal du 15 novembre 2021, en vigueur depuis le 1er janvier 2022",
      source: "neuchatelTarifs",
      lignes: [
        { prestation: "Inhumation", domicilie: "gratuit", exterieur: "CHF 1500.-" },
        { prestation: "Crémation avec cérémonie", domicilie: "CHF 480.-", exterieur: "CHF 700.-" },
        { prestation: "Crémation sans cérémonie", domicilie: "CHF 385.-", exterieur: "CHF 600.-" },
        { prestation: "Niche du columbarium, 10 ans", domicilie: "CHF 300.-", exterieur: "CHF 400.-" },
        { prestation: "Niche du columbarium, 20 ans", domicilie: "CHF 510.-", exterieur: "CHF 750.-" },
        { prestation: "Tombe du Souvenir", domicilie: "gratuit", exterieur: "CHF 250.-" },
        {
          prestation: "Quartier des quatre saisons (plaquette comprise)",
          domicilie: "CHF 500.-",
          exterieur: "CHF 750.-",
        },
        {
          prestation: "Concession de famille, 50 ans",
          domicilie: "CHF 800.- par m2",
          exterieur: "CHF 1300.- par m2",
        },
        { prestation: "Chambre mortuaire", domicilie: "CHF 150.-", exterieur: "CHF 200.-" },
        { prestation: "Chapelle", domicilie: "CHF 150.-", exterieur: "CHF 210.-" },
        { prestation: "Taxe de pose d'un monument", domicilie: "CHF 60.- par mètre" },
      ],
      note: "Les plaques de fermeture des niches, leur dépose et leur repose ainsi que la gravure des inscriptions ne sont pas comprises dans ces montants : elles sont facturées « selon tarif du marbrier » (art. 57 du règlement).",
    },
    duree: [
      "La loi cantonale fixe la réouverture des fosses à 30 ans au moins (art. 6). À Neuchâtel, les tombes sont rouvertes après 40 ans au moins (art. 44 à 46).",
      "À la réouverture, les proches peuvent reprendre le monument dans le délai publié par la commune ; passé ce délai, il revient à l'Office des cimetières. Les ossements et les urnes restent en terre.",
      "Le quartier G multiconfessionnel est de longue durée : 60 ans.",
    ],
    entretien: [
      "L'entretien de la tombe est à la charge de la famille (art. 30). À Beauregard, elle peut le confier aux jardiniers de la Ville, l'Office des parcs et promenades, ou à une entreprise privée, qui doit alors suivre les normes d'entretien de l'Office.",
      "Forfaits annuels de l'Office des parcs : CHF 300.- pour une tombe d'inhumation, CHF 220.- pour une tombe d'incinération, CHF 150.- pour une tombe avec jardinière, plus CHF 100.- d'entretien et arrosage obligatoires, TVA en sus ; la résiliation se fait avant le 1er février.",
      "L'entretien des dalles et des monuments peut être confié à une entreprise privée (art. 33).",
    ],
    faq: [
      {
        question: "Quels sont les horaires du cimetière de Beauregard ?",
        reponse:
          "Le cimetière est ouvert 24 h sur 24. Le guichet de l'Office des cimetières, avenue Edouard-Dubois 28, est ouvert les jours ouvrables de 8 h à 12 h et de 13 h 30 à 17 h (032 717 72 47).",
      },
      {
        question: "Comment se rendre au cimetière de Beauregard en bus ?",
        reponse:
          "Les lignes 120 et 122 desservent les arrêts « Neuchâtel, Cimetière » et « Neuchâtel, Beauregard », où s'arrête aussi la ligne 101. La page de la Ville mentionne trois parkings payants à proximité.",
      },
      {
        question: "Quelle taille de pierre tombale est autorisée à Beauregard ?",
        reponse:
          "La surface de la tombe, monument et fleurs compris, est de 70 x 130 cm pour une inhumation et de 60 x 100 cm pour une crémation ou un enfant (art. 38). Les gabarits communaux du 9 octobre 1990 fixent les maximums du monument : stèle d'adulte 70 cm de large sur 120 cm de haut, dalle couchée 70 x 130 cm, croix 69 cm sur 140 cm. Les bordures et les entourages sont interdits : le monument est posé à même le sol.",
      },
      {
        question: "Quand peut-on poser le monument à Beauregard ?",
        reponse:
          "Un an au plus tôt après l'inhumation. Les plans passent par l'Office des cimetières, qui délivre le permis de pose (art. 39) ; la taxe communale de pose est de CHF 60.- par mètre de pourtour du monument augmenté de sa hauteur (arrêté du 15 novembre 2021).",
      },
      {
        question: "Combien coûte une niche au columbarium de Beauregard ?",
        reponse:
          "CHF 300.- pour dix ans et CHF 510.- pour vingt ans pour une personne domiciliée à Neuchâtel, CHF 400.- et CHF 750.- pour une personne de l'extérieur (arrêté du 15 novembre 2021). La durée totale va jusqu'à 40 ans. La plaque de fermeture et la gravure sont en plus, selon le tarif du marbrier.",
      },
      {
        question: "Y a-t-il un carré confessionnel au cimetière de Beauregard ?",
        reponse:
          "Il n'y a pas de carré réservé à une communauté. Le quartier G, ouvert en 2015, est multiconfessionnel et de longue durée (60 ans) ; une orientation de la tombe vers La Mecque est possible sur arrangement préalable.",
      },
    ],
    sources: [
      "neuchatelReglement",
      "neuchatelGabarits",
      "neuchatelTarifs",
      "neuchatelBeauregard",
      "loiSepultures",
    ],
    verifieLe: VERIFIE_LE,
  },

  /* ------------------------------------------- La Chaux-de-Fonds --------- */
  {
    slug: "la-chaux-de-fonds",
    nom: "Cimetière de La Chaux-de-Fonds",
    nomCourt: "La Charrière",
    commune: "La Chaux-de-Fonds",
    localites: ["La Chaux-de-Fonds", "Les Eplatures"],
    titreSeo: "Cimetière de La Chaux-de-Fonds : accès, crématoire, monuments",
    description:
      "Cimetière de la Charrière à La Chaux-de-Fonds : accès, centre funéraire, crématoire classé, règles de pose des monuments et taxes communales des niches.",
    chapo:
      "Le cimetière de la Charrière réunit le centre funéraire et le crématoire de La Chaux-de-Fonds, classé depuis 1988. C'est aussi la seule commune relevée du canton où la pose des monuments s'arrête tout l'hiver.",
    adresse: "rue de la Charrière 102, 2300 La Chaux-de-Fonds",
    contact: {
      service: "Cimetière et Centre funéraire de La Chaux-de-Fonds",
      adresse: "rue de la Charrière 102, 2300 La Chaux-de-Fonds",
      telephone: "032 967 64 57",
      email: "cimetiere.vch@ne.ch",
      url: "https://www.chaux-de-fonds.ch/demarches-officielles/cimetiere-et-centre-funeraire",
    },
    acces: [
      "Bus 302, arrêt « La Chaux-de-Fonds, Charrière ».",
      "Les véhicules privés ne circulent pas dans le cimetière, sauf cortège funèbre, artisans au travail ou autorisation de l'administration (art. 4).",
    ],
    equipements: [
      "Un centre funéraire avec des chambres mortuaires et des salles de cérémonie.",
      "Un crématoire, aujourd'hui classé monument historique.",
      "Un columbarium et un secteur réservé aux incinérés, avec des concessions cinéraires de vingt ans.",
      "Un secteur des enfants.",
      "Un massif de longue durée (60 ans) que des communautés religieuses peuvent réserver par lignes entières (art. 23) ; un carré musulman y a été ouvert en 2011, le premier du canton.",
      "La communauté israélite dispose de sa parcelle au cimetière des Eplatures (art. 67), où il n'y a plus d'inhumation depuis 2005 : toutes les inhumations de la commune ont lieu à la Charrière.",
    ],
    histoire: [
      "Le cimetière a été aménagé en 1851.",
      "Le crématoire est l'oeuvre des architectes Robert Belli et Henri Robert, avec un décor de Charles L'Eplattenier et des Ateliers d'art réunis. Mis en service en novembre 1909 et inauguré le 27 juin 1910, il est classé par arrêté du Conseil d'Etat du 20 juin 1988.",
      "Il se visite seul pendant les heures d'ouverture de l'administration, ou lors des visites guidées Art nouveau de Tourisme neuchâtelois (032 889 68 95).",
    ],
    regles: {
      delaiPose:
        "Six mois au plus tôt après l'inhumation (art. 56). Le monument doit être terminé avant d'entrer dans le cimetière (art. 57).",
      periodeInterdite:
        "Du 1er novembre au 30 avril, la pose des monuments est interdite (art. 56) : une demande déposée en automne se réalise au printemps suivant.",
      tombes: [
        {
          type: "Monument (toutes tombes)",
          dimensions:
            "Aucune dimension dans le règlement : elles sont définies par l'administration sur des plans d'aménagement consultables chez elle",
          article: "art. 51",
        },
        {
          type: "Fosse d'adulte (pour mémoire)",
          dimensions: "200 x 80 cm",
          article: "art. 21",
        },
        {
          type: "Jardin d'une tombe cinéraire",
          dimensions: "50 x 30 cm au moins, sans gravier ni dallage complet",
          article: "art. 64 à 66",
        },
      ],
      bordure:
        "Obligatoire pour une tombe d'inhumation : les bordures et les haies sont posées par la commune et facturées aux familles (art. 23). Il n'y a donc pas d'entourage à prévoir dans le monument.",
      materiaux:
        "La pierre artificielle est interdite (art. 55). Le nettoyage aux acides est interdit (art. 59). Les signes funéraires en bois ne paient pas de taxe (art. 54).",
      autorisation:
        "Autorisation écrite de l'administration, contre émolument. Pour un monument de tombe cinéraire, le dossier comprend un plan au 1:10 de face avec l'inscription et de profil, le matériau, les dimensions, la bordure, le nom de la marbrerie et le numéro de concession ; une maquette peut être exigée (art. 54).",
      taxePose:
        "CHF 50.- par monument, selon le règlement des taxes communal 41.101, état au 29 janvier 2025, art. 32 ; les signes en bois sont exonérés.",
      obligations: [
        "Le numéro du jalon doit rester visible sur le monument (art. 55).",
        "Un monument non conforme, ou laissé sans entretien, est enlevé après trois mois (art. 60).",
        "La vente et la publicité sont interdites dans l'enceinte du cimetière et aux abords (art. 7).",
      ],
    },
    chiffres: {
      delai: "6 mois, pas du 1er novembre au 30 avril",
      tombeAdulte: "Fixée par l'administration (fosse 200 x 80 cm)",
      hauteurMax: "Fixée par l'administration",
    },
    cineraire: [
      "Les concessions cinéraires se prennent pour vingt ans, renouvelables par dix ou vingt ans : terrain « à la suite » pour trois urnes, terrain « au choix », niches simples ou doubles, ouvertes ou fermées, et mur Nord (art. 40 à 42 et 47).",
      "Une tombe cinéraire comprend un jardin de 50 x 30 cm au moins ; le gravier et le dallage complet sont exclus (art. 64 à 66).",
      "Une urne mise en terre sans caveau doit être en matériau durable, sans quoi les cendres ne pourront pas être reprises (art. 37 al. 3).",
      "Sans instruction de la famille un mois après la crémation, l'administration la relance ; sans réponse dans les trente jours, les cendres sont déposées dans la tombe collective (art. 39).",
      "Une concession cinéraire est supprimée après deux ans de mauvais entretien (art. 66).",
    ],
    tarifs: {
      date: "règlement des taxes communal 41.101, état au 29 janvier 2025",
      sourceLibelle: "Règlement des taxes de La Chaux-de-Fonds 41.101, état au 29 janvier 2025",
      lignes: [
        { prestation: "Niche du columbarium, 20 ans", domicilie: "CHF 320.- (inscription en plus)" },
        { prestation: "Niche du mur, 20 ans", domicilie: "CHF 680.-" },
        { prestation: "Jardin du columbarium, 20 ans", domicilie: "CHF 990.-" },
        { prestation: "Massif des 10-Columbariums, 20 ans", domicilie: "CHF 1600.-" },
        { prestation: "Arbre du souvenir, 20 ans (plaque comprise)", domicilie: "CHF 610.-" },
        { prestation: "Taxe de pose d'un monument", domicilie: "CHF 50.-" },
      ],
      note: "Ce sont des taxes communales, pas des prix de monument. Le tarif des plaques et de leur gravure n'est pas publié dans un document officiel à jour : il est à demander au cimetière.",
    },
    duree: [
      "Les tombes sont désaffectées après trente ans, et les familles disposent de six mois pour enlever monuments et plantations (art. 25).",
      "Le massif de longue durée réservé aux communautés religieuses est concédé pour soixante ans (art. 23).",
      "La loi cantonale fixe la réouverture des fosses à trente ans au moins (art. 6).",
    ],
    entretien: [
      "Un monument laissé sans entretien est enlevé après trois mois (art. 60).",
      "Les couvercles de protection sont tolérés du 1er novembre au 31 mars (art. 58).",
      "Le nettoyage de la pierre aux acides est interdit (art. 59).",
    ],
    faq: [
      {
        question: "Comment se rendre au cimetière de la Charrière ?",
        reponse:
          "Le cimetière se trouve rue de la Charrière 102, à La Chaux-de-Fonds, et le bus 302 s'arrête à « La Chaux-de-Fonds, Charrière ». Les véhicules privés n'entrent pas dans le cimetière, sauf cortège funèbre, artisans au travail ou autorisation (art. 4).",
      },
      {
        question: "Quels sont les horaires du cimetière de La Chaux-de-Fonds ?",
        reponse:
          "Les heures d'ouverture du cimetière ne figurent pas dans les documents officiels que nous avons relevés : elles sont à demander au Cimetière et Centre funéraire, 032 967 64 57 ou cimetiere.vch@ne.ch.",
      },
      {
        question: "Peut-on poser une pierre tombale en hiver à La Chaux-de-Fonds ?",
        reponse:
          "Non. La pose des monuments est interdite du 1er novembre au 30 avril (art. 56), et elle n'a de toute façon pas lieu avant six mois après l'inhumation. Une demande préparée en hiver se réalise dès le mois de mai.",
      },
      {
        question: "Quelles dimensions de monument sont autorisées à La Chaux-de-Fonds ?",
        reponse:
          "Le règlement ne donne aucune dimension : elles sont définies par l'administration, sur des plans d'aménagement que l'on consulte chez elle (art. 51). La fosse d'un adulte mesure 200 x 80 cm (art. 21), et les bordures comme les haies sont posées par la commune et facturées aux familles (art. 23). Nous demandons le plan de l'emplacement avant de dessiner le monument.",
      },
      {
        question: "Quelle autorisation faut-il pour poser un monument ?",
        reponse:
          "Une autorisation écrite de l'administration, contre émolument. Pour une tombe cinéraire, le dossier comprend un plan au 1:10 de face avec l'inscription et de profil, le matériau, les dimensions, la bordure, le nom de la marbrerie et le numéro de concession ; une maquette peut être exigée (art. 54). La taxe de pose est de CHF 50.- (règlement des taxes 41.101, art. 32).",
      },
      {
        question: "Combien coûte une niche au columbarium de La Chaux-de-Fonds ?",
        reponse:
          "Pour vingt ans : CHF 320.- pour une niche du columbarium (inscription en plus), CHF 680.- pour une niche du mur, CHF 990.- pour le jardin du columbarium, CHF 1600.- pour le massif des 10-Columbariums et CHF 610.- pour l'arbre du souvenir, plaque comprise (règlement des taxes 41.101, état au 29 janvier 2025). Ce sont des taxes communales, sans la plaque ni sa gravure.",
      },
    ],
    sources: ["chauxDeFonds", "chauxDeFondsPage", "loiSepultures"],
    verifieLe: VERIFIE_LE,
  },

  /* ---------------------------------------------------------- Peseux ----- */
  {
    slug: "peseux",
    nom: "Cimetière de Peseux",
    nomCourt: "Peseux",
    commune: "Neuchâtel",
    localites: ["Peseux"],
    titreSeo: "Cimetière de Peseux : accès, columbarium, monuments",
    description:
      "Cimetière de Peseux : chemin des Tires, accès en bus, columbarium et jardin du souvenir, hauteur des monuments autorisée et tarifs communaux des niches.",
    chapo:
      "Le cimetière de Peseux appartient à la commune de Neuchâtel depuis la fusion de 2021 et suit son règlement de 2023. Les monuments y sont plus hauts qu'à Beauregard et les entourages y sont permis.",
    adresse: "chemin des Tires, 2034 Peseux",
    horaires: "Ouvert 24 h sur 24.",
    contact: {
      service: "Office des cimetières de la Ville de Neuchâtel",
      adresse: "avenue Edouard-Dubois 28, 2000 Neuchâtel",
      telephone: "032 717 72 47",
      horaires: "Guichet les jours ouvrables, 8 h-12 h et 13 h 30-17 h.",
      url: "https://www.neuchatelville.ch/vivre-a-neuchatel/habitant-e-s/cimetieres/cimetiere-de-peseux",
    },
    acces: ["Bus 120.", "Un parking se trouve à l'entrée du cimetière."],
    equipements: [
      "Un columbarium : niches familiales de trois urnes ou niches communes, plaques comprises dans le tarif communal.",
      "Un jardin du souvenir.",
      "Un quartier des enfants. Il n'y a pas de quartier confessionnel à Peseux.",
      "Des inhumations de cendres du lundi au vendredi à 8 h, 10 h, 12 h et 15 h, sur rendez-vous ; un seul cercueil est inhumé par jour.",
    ],
    projets: [
      "Le cimetière compte environ dix inhumations par an et deux allées ont été désaffectées au début de 2024.",
      "Un nouveau quartier M de 2200 m2, soit une centaine de tombes, s'ouvre dès l'automne 2026, avec un accès prévu pour les marbriers ; un nouveau parking et une nouvelle entrée sont annoncés pour 2028-2029 (rapport du Conseil communal 26-012 du 1er avril 2026).",
    ],
    histoire: [
      "Un monument rappelle la mémoire d'Adolphe Fornachon, donateur de l'ancienne commune de Peseux.",
    ],
    regles: {
      delaiPose:
        "Un an au plus tôt après l'inhumation, avec des plans approuvés par l'Office des cimetières et un permis de pose (art. 39).",
      tombes: [
        {
          type: "Monument d'adulte, inhumation",
          dimensions: "Largeur non fixée par le règlement",
          hauteurMax: "150 cm, socle compris",
          article: "art. 34 à 36",
        },
        {
          type: "Monument d'incinération",
          dimensions: "Largeur non fixée par le règlement",
          hauteurMax: "110 cm, socle compris",
          article: "art. 34 à 36",
        },
        {
          type: "Monument d'enfant",
          dimensions: "Largeur non fixée par le règlement",
          hauteurMax: "70 cm, socle compris",
          article: "art. 34 à 36",
        },
        {
          type: "Surface de la tombe, monument et fleurs compris (inhumation)",
          dimensions: "70 x 130 cm",
          article: "art. 38",
        },
        {
          type: "Surface de la tombe (crémation, et enfant de moins de 10 ans)",
          dimensions: "60 x 100 cm",
          article: "art. 38",
        },
      ],
      bordure:
        "Permise. Le règlement demande en revanche de ne pas dépareiller avec les monuments déjà en place : la commune apprécie l'uniformité de la ligne de tombes (art. 31).",
      materiaux:
        "Pierre du pays (roc, pierre jaune, granit) ou pierre analogue, marbre, métal, bois et béton ; les tons extrêmes du polissage du marbre sont soumis à autorisation (art. 31).",
      autorisation:
        "Permis de pose de l'Office des cimetières, sur la base des plans du monument (art. 39) ; le Conseil communal peut accorder une dérogation (art. 41).",
      taxePose:
        "CHF 60.- par mètre de pourtour du monument augmenté de sa hauteur (arrêté du Conseil communal du 15 novembre 2021, en vigueur depuis le 1er janvier 2022).",
      obligations: [
        "L'entrepreneur répond seul de la conformité du monument, et un monument non conforme est enlevé à ses frais (art. 40).",
        "La largeur n'est pas chiffrée dans le règlement : nous la faisons confirmer par l'Office des cimetières avant la commande, en même temps que le permis de pose.",
        "La publicité est interdite dans le cimetière et aux abords (art. 51).",
      ],
    },
    chiffres: {
      delai: "1 an après l'inhumation",
      tombeAdulte: "70 x 130 cm de surface",
      hauteurMax: "150 cm, socle compris",
    },
    cineraire: [
      "Les niches du columbarium de Peseux se prennent pour 10 ou 20 ans, renouvelables jusqu'à 40 ans au total (art. 22). À Peseux, la plaque est comprise dans le tarif communal.",
      "Une niche familiale de trois urnes coûte CHF 3170.10 pour une personne domiciliée dans la commune et CHF 6340.20 pour une personne de l'extérieur ; une niche commune CHF 1056.70 et CHF 2133.40 (arrêté du 15 novembre 2021).",
      "Le jardin du souvenir reçoit les cendres sans urne.",
      "Une urne peut aussi être déposée dans une tombe, à 70 cm de profondeur ; une tombe reçoit trois urnes au plus et les urnes biodégradables sont favorisées (art. 17 et 18).",
      "La surface d'une tombe de crémation est de 60 x 100 cm (art. 38) et le monument ne dépasse pas 110 cm de haut, socle compris (art. 34 à 36).",
      "Une concession de famille pour des cendres se prend pour 50 ans, renouvelable 49 ans, et elle est annulée sans indemnité si elle n'est pas entretenue (art. 23).",
    ],
    tarifs: {
      date: "arrêté du Conseil communal du 15 novembre 2021, en vigueur depuis le 1er janvier 2022",
      source: "neuchatelTarifs",
      lignes: [
        {
          prestation: "Niche familiale de 3 urnes, plaque comprise",
          domicilie: "CHF 3170.10",
          exterieur: "CHF 6340.20",
        },
        {
          prestation: "Niche commune, plaque comprise",
          domicilie: "CHF 1056.70",
          exterieur: "CHF 2133.40",
        },
        { prestation: "Inhumation", domicilie: "gratuit", exterieur: "CHF 1500.-" },
        { prestation: "Crémation avec cérémonie", domicilie: "CHF 480.-", exterieur: "CHF 700.-" },
        { prestation: "Taxe de pose d'un monument", domicilie: "CHF 60.- par mètre" },
      ],
      note: "Ce sont des taxes communales de la Ville de Neuchâtel, pas des prix de monument.",
    },
    duree: [
      "Les tombes de la commune de Neuchâtel sont rouvertes après 40 ans au moins, alors que la loi cantonale demande 30 ans au moins (art. 44 à 46 du règlement, art. 6 de la loi).",
      "À la réouverture, les proches peuvent reprendre le monument dans le délai publié ; passé ce délai, il revient à l'Office des cimetières.",
    ],
    entretien: [
      "L'entretien est à la charge de la famille (art. 30). À Peseux, elle peut le confier à une entreprise privée, qui doit suivre les normes d'entretien de l'Office des parcs et promenades.",
      "La Ville a délégué au privé l'entretien des cimetières de Peseux et de Corcelles-Cormondrèche pour environ CHF 80 000.- par an ; une reprise en interne est à l'étude (rapport 26-012 du 1er avril 2026).",
    ],
    faq: [
      {
        question: "Où se trouve le cimetière de Peseux et comment y aller ?",
        reponse:
          "Au chemin des Tires, à Peseux. Le cimetière est ouvert 24 h sur 24, le bus 120 le dessert et un parking se trouve à l'entrée. L'administration est celle de l'Office des cimetières de la Ville de Neuchâtel, 032 717 72 47.",
      },
      {
        question: "Quelle hauteur de monument est autorisée au cimetière de Peseux ?",
        reponse:
          "150 cm socle compris pour une tombe d'inhumation, 110 cm pour une tombe d'incinération et 70 cm pour un enfant (art. 34 à 36 du règlement du 26 juin 2023). La largeur n'est pas chiffrée : le règlement demande de ne pas dépareiller avec les monuments voisins (art. 31). La surface de la tombe est de 70 x 130 cm pour une inhumation (art. 38).",
      },
      {
        question: "Les entourages sont-ils permis à Peseux ?",
        reponse:
          "Oui, les bordures sont permises à Peseux, contrairement à Beauregard où le monument est posé à même le sol. Le règlement demande en revanche que le monument ne dépareille pas avec ceux qui l'entourent (art. 31).",
      },
      {
        question: "Quand peut-on poser le monument au cimetière de Peseux ?",
        reponse:
          "Un an au plus tôt après l'inhumation. Les plans sont approuvés par l'Office des cimetières, qui délivre le permis de pose (art. 39), et la taxe communale de pose est de CHF 60.- par mètre de pourtour du monument augmenté de sa hauteur.",
      },
      {
        question: "Combien coûte une niche au columbarium de Peseux ?",
        reponse:
          "CHF 3170.10 pour une niche familiale de trois urnes et CHF 1056.70 pour une niche commune, plaque comprise, pour une personne domiciliée dans la commune ; CHF 6340.20 et CHF 2133.40 pour une personne de l'extérieur (arrêté du 15 novembre 2021).",
      },
      {
        question: "Le cimetière de Peseux va-t-il s'agrandir ?",
        reponse:
          "Oui. Un nouveau quartier M de 2200 m2, soit une centaine de tombes, s'ouvre dès l'automne 2026, avec un accès prévu pour les marbriers ; un nouveau parking et une nouvelle entrée sont annoncés pour 2028-2029 (rapport du Conseil communal 26-012 du 1er avril 2026).",
      },
    ],
    sources: ["neuchatelReglement", "neuchatelTarifs", "neuchatelPeseuxPage", "loiSepultures"],
    verifieLe: VERIFIE_LE,
  },

  /* ------------------------------------------ Corcelles-Cormondreche ----- */
  {
    slug: "corcelles-cormondreche",
    nom: "Cimetière de Corcelles-Cormondrèche",
    nomCourt: "Corcelles-Cormondrèche",
    commune: "Neuchâtel",
    localites: ["Corcelles", "Cormondrèche"],
    titreSeo: "Cimetière de Corcelles-Cormondrèche : accès et monuments",
    description:
      "Cimetière de Corcelles-Cormondrèche, aux Niclaudes : accès, columbarium de la chapelle, hauteur des monuments autorisée et tarifs communaux des niches.",
    chapo:
      "Le cimetière de Corcelles-Cormondrèche se trouve aux Niclaudes et dépend de la commune de Neuchâtel depuis la fusion de 2021. Avec Valangin, c'est le cimetière de la Ville où les monuments peuvent être les plus hauts.",
    adresse: "Aux Niclaudes, 2036 Cormondrèche",
    horaires: "Ouvert 24 h sur 24.",
    contact: {
      service: "Office des cimetières de la Ville de Neuchâtel",
      adresse: "avenue Edouard-Dubois 28, 2000 Neuchâtel",
      telephone: "032 717 72 47",
      horaires: "Guichet les jours ouvrables, 8 h-12 h et 13 h 30-17 h.",
      url: "https://www.neuchatelville.ch/vivre-a-neuchatel/habitant-e-s/cimetieres/cimetiere-de-corcelles-cormondreche",
    },
    acces: ["Bus 101.", "Un parking se trouve à l'entrée du cimetière."],
    equipements: [
      "Un columbarium installé dans la chapelle : niches familiales de trois urnes ou niches communes, plaques comprises dans le tarif communal.",
      "Un jardin du souvenir.",
      "Un quartier des enfants. Il n'y a pas de quartier confessionnel à Corcelles-Cormondrèche.",
      "Des inhumations de cendres du lundi au vendredi à 8 h, 10 h, 12 h et 15 h.",
    ],
    projets: [
      "Un quartier de tombes doubles est aménagé en 2026-2027 : la concession y sera de 50 ans, renouvelable jusqu'à 99 ans (rapport du Conseil communal 26-012 du 1er avril 2026). Les formats de ces tombes ne sont pas encore publiés.",
    ],
    histoire: [
      "Le rapport du Conseil communal 23-005 du 15 mai 2023 relève que presque toutes les tombes du cimetière ont un entourage et du gravier : c'est l'aspect auquel un nouveau monument se compare.",
    ],
    regles: {
      delaiPose:
        "Un an au plus tôt après l'inhumation, avec des plans approuvés par l'Office des cimetières et un permis de pose (art. 39).",
      tombes: [
        {
          type: "Monument d'adulte, inhumation",
          dimensions: "Largeur non fixée par le règlement",
          hauteurMax: "160 cm, socle compris",
          article: "art. 34 à 36",
        },
        {
          type: "Monument d'incinération",
          dimensions: "Largeur non fixée par le règlement",
          hauteurMax: "110 cm, socle compris",
          article: "art. 34 à 36",
        },
        {
          type: "Monument d'enfant",
          dimensions: "Largeur non fixée par le règlement",
          hauteurMax: "70 cm, socle compris",
          article: "art. 34 à 36",
        },
        {
          type: "Surface de la tombe, monument et fleurs compris (inhumation)",
          dimensions: "70 x 130 cm",
          article: "art. 38",
        },
        {
          type: "Surface de la tombe (crémation, et enfant de moins de 10 ans)",
          dimensions: "60 x 100 cm",
          article: "art. 38",
        },
      ],
      bordure:
        "Permise, et c'est l'usage du lieu : presque toutes les tombes ont un entourage et du gravier. Le règlement demande de ne pas dépareiller avec les monuments déjà en place (art. 31).",
      materiaux:
        "Pierre du pays (roc, pierre jaune, granit) ou pierre analogue, marbre, métal, bois et béton ; les tons extrêmes du polissage du marbre sont soumis à autorisation (art. 31).",
      autorisation:
        "Permis de pose de l'Office des cimetières, sur la base des plans du monument (art. 39) ; le Conseil communal peut accorder une dérogation (art. 41).",
      taxePose:
        "CHF 60.- par mètre de pourtour du monument augmenté de sa hauteur (arrêté du Conseil communal du 15 novembre 2021, en vigueur depuis le 1er janvier 2022).",
      obligations: [
        "L'entrepreneur répond seul de la conformité du monument, et un monument non conforme est enlevé à ses frais (art. 40).",
        "La largeur du monument n'est pas chiffrée dans le règlement : nous la faisons confirmer par l'Office des cimetières avant la commande.",
        "La publicité est interdite dans le cimetière et aux abords (art. 51).",
      ],
    },
    chiffres: {
      delai: "1 an après l'inhumation",
      tombeAdulte: "70 x 130 cm de surface",
      hauteurMax: "160 cm, socle compris",
    },
    cineraire: [
      "Le columbarium se trouve dans la chapelle du cimetière. Les niches se prennent pour 10 ou 20 ans, renouvelables jusqu'à 40 ans au total (art. 22), et la plaque est comprise dans le tarif communal.",
      "Une niche familiale de trois urnes coûte CHF 4500.- pour une personne domiciliée dans la commune et CHF 13 500.- pour une personne de l'extérieur ; une niche commune d'une urne CHF 1500.- et CHF 4500.- (arrêté du 15 novembre 2021).",
      "Le jardin du souvenir reçoit les cendres sans urne.",
      "Une urne peut aussi être déposée dans une tombe, à 70 cm de profondeur ; une tombe reçoit trois urnes au plus (art. 17 et 18).",
      "La surface d'une tombe de crémation est de 60 x 100 cm (art. 38) et le monument ne dépasse pas 110 cm de haut, socle compris (art. 34 à 36).",
      "Le futur quartier de tombes doubles recevra des concessions de 50 ans, renouvelables jusqu'à 99 ans.",
    ],
    tarifs: {
      date: "arrêté du Conseil communal du 15 novembre 2021, en vigueur depuis le 1er janvier 2022",
      source: "neuchatelTarifs",
      lignes: [
        {
          prestation: "Niche familiale de 3 urnes au columbarium de la chapelle, plaque comprise",
          domicilie: "CHF 4500.-",
          exterieur: "CHF 13 500.-",
        },
        {
          prestation: "Niche commune d'une urne, plaque comprise",
          domicilie: "CHF 1500.-",
          exterieur: "CHF 4500.-",
        },
        { prestation: "Inhumation", domicilie: "gratuit", exterieur: "CHF 1500.-" },
        { prestation: "Crémation avec cérémonie", domicilie: "CHF 480.-", exterieur: "CHF 700.-" },
        { prestation: "Taxe de pose d'un monument", domicilie: "CHF 60.- par mètre" },
      ],
      note: "Ce sont des taxes communales de la Ville de Neuchâtel, pas des prix de monument.",
    },
    duree: [
      "Les tombes sont rouvertes après 40 ans au moins, alors que la loi cantonale demande 30 ans au moins (art. 44 à 46 du règlement, art. 6 de la loi).",
      "Les proches peuvent reprendre le monument dans le délai publié par la commune ; passé ce délai, il revient à l'Office des cimetières.",
      "Dans le futur quartier de tombes doubles, la concession ira jusqu'à 99 ans.",
    ],
    entretien: [
      "L'entretien est à la charge de la famille (art. 30), qui peut le confier à une entreprise privée tenue de suivre les normes de l'Office des parcs et promenades.",
      "Les familles de Corcelles-Cormondrèche font traditionnellement appel aux fleuristes et aux jardiniers privés du village (rapport 23-005 du 15 mai 2023).",
    ],
    faq: [
      {
        question: "Où se trouve le cimetière de Corcelles-Cormondrèche ?",
        reponse:
          "Aux Niclaudes, à Cormondrèche. Il est ouvert 24 h sur 24, le bus 101 le dessert et un parking se trouve à l'entrée. L'administration est celle de l'Office des cimetières de la Ville de Neuchâtel, 032 717 72 47.",
      },
      {
        question: "Quelle hauteur de monument est autorisée à Corcelles-Cormondrèche ?",
        reponse:
          "160 cm socle compris pour une tombe d'inhumation, 110 cm pour une tombe d'incinération et 70 cm pour un enfant (art. 34 à 36 du règlement du 26 juin 2023). Avec Valangin, c'est la hauteur la plus généreuse des quatre cimetières de la commune de Neuchâtel. La largeur n'est pas chiffrée dans le texte.",
      },
      {
        question: "Faut-il un entourage autour de la tombe ?",
        reponse:
          "Il n'est pas obligatoire, mais il est permis et c'est l'usage : presque toutes les tombes du cimetière ont un entourage et du gravier (rapport 23-005). Le règlement demande de ne pas dépareiller avec les monuments voisins (art. 31).",
      },
      {
        question: "Quand peut-on poser le monument ?",
        reponse:
          "Un an au plus tôt après l'inhumation, avec des plans approuvés par l'Office des cimetières et un permis de pose (art. 39). La taxe communale de pose est de CHF 60.- par mètre de pourtour du monument augmenté de sa hauteur.",
      },
      {
        question: "Combien coûte une niche au columbarium de la chapelle ?",
        reponse:
          "CHF 4500.- pour une niche familiale de trois urnes et CHF 1500.- pour une niche commune d'une urne, plaque comprise, pour une personne domiciliée dans la commune ; CHF 13 500.- et CHF 4500.- pour une personne de l'extérieur (arrêté du 15 novembre 2021).",
      },
      {
        question: "Qu'est-ce que le quartier de tombes doubles annoncé ?",
        reponse:
          "Un quartier aménagé en 2026-2027 pour répondre à la demande de tombes de couple : la concession y sera de 50 ans, renouvelable jusqu'à 99 ans (rapport du Conseil communal 26-012 du 1er avril 2026). Les dimensions de ces tombes ne sont pas encore publiées.",
      },
    ],
    sources: ["neuchatelReglement", "neuchatelTarifs", "neuchatelCorcellesPage", "loiSepultures"],
    verifieLe: VERIFIE_LE,
  },

  /* ----------------------------------------------------- Le Landeron ----- */
  {
    slug: "le-landeron",
    nom: "Cimetière du Landeron",
    nomCourt: "Le Landeron",
    commune: "Le Landeron",
    localites: ["Le Landeron"],
    titreSeo: "Cimetière du Landeron : démarches, délais et monuments",
    description:
      "Cimetière du Landeron : administration communale, délai de six mois avant la pose, dimensions des tombes autorisées et chapelle du Scapulaire.",
    chapo:
      "Le cimetière du Landeron est administré par la commune, rue du Centre 6. Les tombes y mesurent 180 x 80 cm au plus, bordure comprise, et le monument se pose six mois après l'inhumation.",
    contact: {
      service: "Administration communale du Landeron",
      adresse: "rue du Centre 6, 2525 Le Landeron",
      telephone: "032 886 48 60",
      horaires:
        "Guichet : lundi et mercredi 9 h-12 h et 14 h-16 h 30, mardi 9 h-12 h, jeudi 15 h-19 h, vendredi 7 h 30-13 h 30.",
    },
    equipements: ["Une tombe du souvenir, prévue par le règlement de police (art. 97)."],
    histoire: [
      "La chapelle du Scapulaire, au Landeron, est le dernier vestige de l'église Saint-Maurice de Nugerol, démolie en 1828, selon un communiqué de l'Etat de Neuchâtel.",
      "Sa clé de voûte porte la date de 1674 et un décor peint de 1683 y a été redécouvert en 2025. Elle a servi de chapelle funéraire jusqu'en 1922.",
    ],
    regles: {
      delaiPose:
        "Six mois au plus tôt après l'inhumation (art. 90 du règlement de police 1110, état au 21 mars 2024).",
      tombes: [
        {
          type: "Tombe d'adulte, bordure comprise",
          dimensions: "180 x 80 cm",
          article: "art. 90",
        },
        {
          type: "Tombe d'enfant jusqu'à 3 ans, bordure comprise",
          dimensions: "100 x 60 cm",
          article: "art. 90",
        },
        {
          type: "Tombe d'incinération, bordure comprise",
          dimensions: "100 x 70 cm",
          article: "art. 90",
        },
      ],
      bordure:
        "Permise, et comptée dans les dimensions : les 180 x 80 cm d'une tombe d'adulte comprennent la bordure (art. 90).",
      autorisation:
        "Le règlement relevé ne décrit pas de procédure d'autorisation écrite. Nous annonçons la pose à l'administration communale, rue du Centre 6 (032 886 48 60), et nous faisons confirmer les cotes avant la commande.",
      taxePose:
        "Aucune taxe de pose n'est publiée au Landeron. Dans le canton, seules Neuchâtel, La Chaux-de-Fonds et Le Locle en publient une.",
      obligations: [
        "La hauteur du monument et les matériaux ne sont pas fixés par le règlement : nous les faisons confirmer par la commune avant la commande.",
        "Les dimensions de l'article 90 comprennent la bordure : un entourage se compte dans la surface autorisée.",
      ],
    },
    chiffres: {
      delai: "6 mois après l'inhumation",
      tombeAdulte: "180 x 80 cm, bordure comprise",
      hauteurMax: "Non publiée, à demander à la commune",
    },
    cineraire: [
      "Une tombe d'incinération mesure 100 x 70 cm, bordure comprise (art. 90).",
      "Le règlement de police prévoit une tombe du souvenir (art. 97).",
      "Le règlement relevé ne publie ni columbarium, ni durée de niche, ni tarif : ces points sont à demander à l'administration communale.",
    ],
    duree: [
      "Les documents relevés au Landeron ne fixent pas de durée propre : c'est la loi cantonale qui s'applique, avec une réouverture des fosses après trente ans au moins (art. 6).",
      "Le délai pour reprendre le monument après la désaffectation n'est pas publié : il est à demander à l'administration communale.",
    ],
    faq: [
      {
        question: "À qui s'adresser pour le cimetière du Landeron ?",
        reponse:
          "À l'administration communale, rue du Centre 6 à 2525 Le Landeron, 032 886 48 60. Le guichet est ouvert le lundi et le mercredi de 9 h à 12 h et de 14 h à 16 h 30, le mardi de 9 h à 12 h, le jeudi de 15 h à 19 h et le vendredi de 7 h 30 à 13 h 30. L'adresse postale du cimetière ne figure pas dans les documents que nous avons relevés.",
      },
      {
        question: "Quelle taille de pierre tombale est autorisée au Landeron ?",
        reponse:
          "Une tombe d'adulte mesure 180 x 80 cm au plus, bordure comprise ; une tombe d'enfant jusqu'à trois ans 100 x 60 cm et une tombe d'incinération 100 x 70 cm (art. 90 du règlement de police 1110, état au 21 mars 2024). La hauteur n'est pas chiffrée dans le texte : nous la faisons confirmer par la commune.",
      },
      {
        question: "Quand peut-on poser le monument au Landeron ?",
        reponse:
          "Six mois au plus tôt après l'inhumation (art. 90). Nous annonçons la pose à l'administration communale et nous contrôlons les cotes de la tombe avant de lancer la commande.",
      },
      {
        question: "Y a-t-il une taxe communale de pose au Landeron ?",
        reponse:
          "Aucune taxe de pose n'est publiée par la commune. Dans le canton de Neuchâtel, seules Neuchâtel, La Chaux-de-Fonds et Le Locle en publient une.",
      },
      {
        question: "Que peut-on faire des cendres au Landeron ?",
        reponse:
          "Le règlement de police prévoit une tombe du souvenir (art. 97) et une tombe d'incinération de 100 x 70 cm, bordure comprise (art. 90). Les niches, leur durée et leur tarif ne figurent pas dans les documents relevés : ils sont à demander à l'administration communale.",
      },
    ],
    sources: ["loiSepultures"],
    verifieLe: VERIFIE_LE,
  },

  /* ---------------------------------------------------------- Boudry ----- */
  {
    slug: "boudry",
    nom: "Cimetière de Boudry",
    nomCourt: "Boudry",
    commune: "Boudry",
    localites: ["Boudry"],
    titreSeo: "Cimetière de Boudry : accès, délais et monuments",
    description:
      "Cimetière de Boudry, route de Grandson : stationnement, délai de six mois avant la pose, dimensions des tombes et emplacement cinéraire autorisés.",
    chapo:
      "Le cimetière de Boudry se trouve à la route de Grandson. Ses règles viennent du chapitre V du règlement général de police de 1987, toujours en vigueur : tombe d'adulte de 170 x 80 cm bordure comprise, et pose six mois après l'inhumation.",
    adresse: "route de Grandson, Boudry",
    contact: {
      service: "Contrôle des habitants de Boudry",
      adresse: "route des Addoz 68, 2017 Boudry",
      telephone: "032 886 47 20",
      telephoneSecondaire: "079 204 19 23 (urgences des travaux publics)",
      horaires:
        "Guichet : lundi et mercredi 13 h 30-16 h, mardi 8 h-11 h 30 et 13 h 30-17 h, jeudi 8 h-11 h 30 et 13 h 30-16 h, vendredi 8 h-11 h 30.",
      url: "https://www.boudry.ch/demarches-administratives/cimetiere",
    },
    acces: [
      "Quelques places de stationnement se trouvent à droite de l'entrée principale ; le parking du Château est une solution de repli.",
    ],
    equipements: [],
    regles: {
      delaiPose:
        "Six mois au plus tôt après l'inhumation, la tombe nivelée, avec des fondations proportionnées au poids du monument (art. 93 du règlement général de police du 21 mai 1987).",
      tombes: [
        {
          type: "Tombe d'adulte, bordure comprise",
          dimensions: "170 x 80 cm",
          article: "art. 93",
        },
        {
          type: "Tombe d'enfant de 3 à 10 ans, bordure comprise",
          dimensions: "120 x 60 cm",
          article: "art. 93",
        },
        {
          type: "Tombe d'enfant de moins de 3 ans, bordure comprise",
          dimensions: "80 x 50 cm",
          article: "art. 93",
        },
        {
          type: "Emplacement cinéraire",
          dimensions: "100 x 70 cm",
          article: "art. 95",
        },
      ],
      bordure:
        "Permise, et comptée dans les dimensions : les 170 x 80 cm d'une tombe d'adulte comprennent la bordure (art. 93).",
      materiaux: "Le signe funéraire est en bois, en métal ou en pierre (art. 92).",
      taxePose:
        "Aucune taxe de pose n'est publiée à Boudry : le règlement des taxes de 1994 ne fixe aucun montant de cimetière. Dans le canton, seules Neuchâtel, La Chaux-de-Fonds et Le Locle en publient une.",
      obligations: [
        "La hauteur du monument n'est pas fixée par le règlement : nous la faisons confirmer par la commune avant la commande.",
        "Il n'y a pas de concession perpétuelle à Boudry (art. 87).",
        "Les tombes abandonnées sont nivelées (art. 96).",
      ],
    },
    chiffres: {
      delai: "6 mois après l'inhumation",
      tombeAdulte: "170 x 80 cm, bordure comprise",
      hauteurMax: "Non publiée, à demander à la commune",
    },
    cineraire: [
      "Une urne peut être déposée sur la tombe d'un proche, à 70 cm de profondeur (art. 95).",
      "L'emplacement cinéraire mesure 100 x 70 cm (art. 95) ; le règlement prévoit aussi une fosse commune pour les cendres.",
      "La crémation a lieu au crématoire de Neuchâtel, et le transport est compris dans le service gratuit de la commune (art. 90).",
      "Le columbarium, sa durée et ses tarifs ne figurent pas dans les documents relevés : ils sont à demander au contrôle des habitants.",
    ],
    duree: [
      "Il n'y a pas de concession perpétuelle à Boudry (art. 87), et les tombes abandonnées sont nivelées (art. 96).",
      "La loi cantonale fixe la réouverture des fosses à trente ans au moins (art. 6) ; le règlement communal relevé ne publie pas de durée plus longue.",
      "Le délai pour reprendre le monument à la désaffectation n'est pas publié : il est à demander au contrôle des habitants.",
    ],
    faq: [
      {
        question: "Où se trouve le cimetière de Boudry et où se garer ?",
        reponse:
          "À la route de Grandson, à Boudry. Quelques places de stationnement sont aménagées à droite de l'entrée principale, et le parking du Château est une solution de repli. Les horaires d'ouverture du cimetière ne figurent pas dans les documents que nous avons relevés.",
      },
      {
        question: "Quelle taille de pierre tombale est autorisée à Boudry ?",
        reponse:
          "Une tombe d'adulte mesure 170 x 80 cm au plus, bordure comprise ; une tombe d'enfant de trois à dix ans 120 x 60 cm, et 80 x 50 cm avant trois ans (art. 93 du règlement général de police du 21 mai 1987). L'emplacement cinéraire mesure 100 x 70 cm (art. 95). La hauteur n'est pas chiffrée dans le texte.",
      },
      {
        question: "Quand peut-on poser le monument à Boudry ?",
        reponse:
          "Six mois au plus tôt après l'inhumation, la tombe nivelée, avec des fondations proportionnées au poids du monument (art. 93).",
      },
      {
        question: "Y a-t-il une taxe communale de pose à Boudry ?",
        reponse:
          "Non. Le règlement des taxes de 1994 ne fixe aucun montant de cimetière. Dans le canton de Neuchâtel, seules Neuchâtel, La Chaux-de-Fonds et Le Locle publient une taxe de pose.",
      },
      {
        question: "Que peut-on faire des cendres à Boudry ?",
        reponse:
          "Une urne peut être déposée sur la tombe d'un proche, à 70 cm de profondeur, dans un emplacement cinéraire de 100 x 70 cm, ou dans la fosse commune (art. 95). La crémation a lieu au crématoire de Neuchâtel et le transport est compris dans le service gratuit de la commune (art. 90).",
      },
      {
        question: "À qui s'adresser pour une tombe à Boudry ?",
        reponse:
          "Au contrôle des habitants, route des Addoz 68 à 2017 Boudry, 032 886 47 20. Le guichet est ouvert le lundi et le mercredi de 13 h 30 à 16 h, le mardi de 8 h à 11 h 30 et de 13 h 30 à 17 h, le jeudi de 8 h à 11 h 30 et de 13 h 30 à 16 h, et le vendredi de 8 h à 11 h 30. Les urgences des travaux publics répondent au 079 204 19 23.",
      },
    ],
    sources: ["boudry", "boudryPage", "loiSepultures"],
    verifieLe: VERIFIE_LE,
  },

  /* ------------------------------------------------------ Cortaillod ----- */
  {
    slug: "cortaillod",
    nom: "Cimetière de Cortaillod",
    nomCourt: "Cortaillod",
    commune: "Cortaillod",
    localites: ["Cortaillod"],
    titreSeo: "Cimetière de Cortaillod : columbarium et monuments",
    description:
      "Cimetière de Cortaillod : chambre mortuaire, columbarium de trente ans, délai de douze mois avant la pose et dimensions des monuments autorisées.",
    chapo:
      "Le cimetière de Cortaillod se trouve à l'est du chemin des Pièces-Chaperon. Le règlement de police chiffre à la fois la tombe et le monument : stèle de 130 cm de haut au plus, croix de 140 cm, douze mois après l'inhumation.",
    adresse: "à l'est du chemin des Pièces-Chaperon, Cortaillod",
    contact: {
      service: "Administration communale de Cortaillod",
      adresse: "chemin des Draizes 2, 2016 Cortaillod",
      telephone: "032 886 51 00",
      horaires: "Guichet le matin : lundi à jeudi 8 h 30-12 h, vendredi 7 h 30-12 h.",
      url: "https://www.cortaillod.ch/demarches-administratives/etat-civil/deces/cimetiere",
    },
    equipements: [
      "Une chambre mortuaire, dans un pavillon.",
      "Un columbarium, dont la niche est concédée pour trente ans.",
      "Un jardin du souvenir.",
    ],
    regles: {
      delaiPose:
        "Douze mois au plus tôt après l'inhumation, la tombe nivelée et les cheminements aménagés (art. 8.9 du règlement de police du 25 avril 2017, état au 24 juin 2020).",
      tombes: [
        {
          type: "Tombe d'adulte",
          dimensions: "160 x 80 cm",
          article: "art. 8.8",
        },
        {
          type: "Tombe d'enfant de moins de 10 ans",
          dimensions: "120 x 60 cm",
          article: "art. 8.8",
        },
        {
          type: "Tombe d'incinération",
          dimensions: "100 x 70 cm",
          article: "art. 8.8",
        },
        {
          type: "Dalle",
          dimensions: "À la taille de la tombe, épaisseur 20 cm",
          article: "art. 8.9",
        },
        {
          type: "Stèle ou obélisque",
          dimensions: "À la largeur de la tombe, épaisseur 45 cm (35 cm pour un enfant)",
          hauteurMax: "130 cm (70 cm pour un enfant)",
          article: "art. 8.9",
        },
        {
          type: "Croix",
          dimensions: "Épaisseur 30 cm",
          hauteurMax: "140 cm (70 cm pour un enfant)",
          article: "art. 8.9",
        },
      ],
      bordure:
        "Permise. Le règlement chiffre en revanche les maximums hors sol du monument : dalle à la taille de la tombe, stèle et obélisque 130 cm de haut, croix 140 cm (art. 8.9).",
      taxePose:
        "Aucune taxe de pose n'est publiée à Cortaillod. Dans le canton, seules Neuchâtel, La Chaux-de-Fonds et Le Locle en publient une.",
      obligations: [
        "Le monument se pose une fois la tombe nivelée et les cheminements aménagés (art. 8.9).",
        "La plaque du columbarium suit un modèle imposé et sa gravure passe par l'Administration communale (art. 8.18).",
      ],
    },
    chiffres: {
      delai: "12 mois après l'inhumation",
      tombeAdulte: "160 x 80 cm",
      hauteurMax: "130 cm (stèle), 140 cm (croix)",
    },
    cineraire: [
      "Les niches du columbarium sont concédées pour trente ans (art. 8.18).",
      "La plaque de la niche suit un modèle imposé et sa gravure passe par l'Administration communale (art. 8.18).",
      "Une tombe d'incinération mesure 100 x 70 cm (art. 8.8) ; le monument y est limité comme ailleurs dans le cimetière, à 130 cm pour une stèle et 140 cm pour une croix (art. 8.9).",
      "Le cimetière a un jardin du souvenir.",
    ],
    duree: [
      "Les niches du columbarium sont concédées pour trente ans (art. 8.18).",
      "La loi cantonale fixe la réouverture des fosses à trente ans au moins (art. 6) ; le règlement communal relevé ne publie pas de durée plus longue.",
      "Le délai pour reprendre le monument à la désaffectation n'est pas publié : il est à demander à l'Administration communale.",
    ],
    entretien: [
      "L'eau du cimetière est coupée d'octobre à mars, selon la page officielle de la commune : les plantations se choisissent en conséquence.",
    ],
    faq: [
      {
        question: "Où se trouve le cimetière de Cortaillod ?",
        reponse:
          "À l'est du chemin des Pièces-Chaperon, à Cortaillod. L'Administration communale se trouve au chemin des Draizes 2, 032 886 51 00, et son guichet est ouvert le matin, du lundi au jeudi de 8 h 30 à 12 h et le vendredi de 7 h 30 à 12 h. Les horaires d'ouverture du cimetière ne figurent pas dans les documents que nous avons relevés.",
      },
      {
        question: "Quelles dimensions de monument sont autorisées à Cortaillod ?",
        reponse:
          "La tombe d'un adulte mesure 160 x 80 cm, celle d'un enfant de moins de dix ans 120 x 60 cm et une tombe d'incinération 100 x 70 cm (art. 8.8). Hors sol, la dalle reprend la taille de la tombe avec 20 cm d'épaisseur ; la stèle et l'obélisque font la largeur de la tombe et 130 cm de haut au plus (70 cm pour un enfant) ; la croix monte à 140 cm (art. 8.9).",
      },
      {
        question: "Quand peut-on poser le monument à Cortaillod ?",
        reponse:
          "Douze mois au plus tôt après l'inhumation, la tombe nivelée et les cheminements aménagés (art. 8.9 du règlement de police du 25 avril 2017, état au 24 juin 2020).",
      },
      {
        question: "Qui grave la plaque du columbarium de Cortaillod ?",
        reponse:
          "La plaque suit un modèle imposé et sa gravure passe par l'Administration communale (art. 8.18) : la commande ne se fait pas directement auprès du marbrier.",
      },
      {
        question: "Combien de temps dure une niche au columbarium de Cortaillod ?",
        reponse:
          "Trente ans (art. 8.18). Le montant de la concession ne figure pas dans les documents que nous avons relevés : il est à demander à l'Administration communale, 032 886 51 00.",
      },
      {
        question: "Y a-t-il de l'eau au cimetière en hiver ?",
        reponse:
          "Non : la page officielle de la commune indique que l'eau est coupée d'octobre à mars. C'est à prendre en compte pour les plantations et l'entretien de la tombe.",
      },
    ],
    sources: ["cortaillodPage", "loiSepultures"],
    verifieLe: VERIFIE_LE,
  },

  /* -------------------------------------------------------- Le Locle ----- */
  {
    slug: "le-locle",
    nom: "Cimetière du Locle",
    nomCourt: "Le Locle",
    commune: "Le Locle",
    localites: ["Le Locle", "Les Brenets"],
    titreSeo: "Cimetière du Locle : murs cinéraires et monuments",
    description:
      "Cimetière du Locle : murs cinéraires, jardin du souvenir, stèles de 70 cm sur 110 cm, bordures interdites et taxes communales du cimetière.",
    chapo:
      "Le cimetière du Locle est administré avec celui des Brenets, depuis l'avenue de l'Hôtel-de-Ville 1. Les bordures et le gravillon y sont interdits : la stèle est posée sur un sommier communal et mesure 70 cm de large sur 110 cm de haut au plus, socle compris.",
    horaires: "Accès libre en tout temps. Les commodités sont limitées de novembre à avril (art. 3).",
    contact: {
      service: "Administration des cimetières du Locle et des Brenets",
      adresse: "avenue de l'Hôtel-de-Ville 1, 2400 Le Locle",
      telephone: "032 933 84 61",
      telephoneSecondaire: "032 933 84 62",
      email: "cdh.lelocle@ne.ch",
    },
    equipements: [
      "Des murs cinéraires : deux urnes par niche, avec une plaque en marbre obligatoire, à la charge de la famille.",
      "Un jardin du souvenir, anonyme.",
      "Un secteur des enfants.",
      "Un sous-secteur 9-B, dont les lignes sont réservées aux communautés islamiques (art. 2 du règlement d'application).",
      "Un centre funéraire communal, à l'hôpital du Locle : une salle de 25 places et trois salles de visite, ouvertes en 2011.",
      "Des inhumations du lundi au vendredi, de 10 h à 11 h et de 14 h à 15 h de mai au passage à l'heure d'hiver, puis de 10 h à 11 h en hiver.",
      "Des dépôts de cendres de mai à octobre, le mercredi et le vendredi de 14 h à 17 h.",
    ],
    regles: {
      delaiPose:
        "Lorsque la fosse est comblée, nivelée et le terrain stabilisé (règlement du cimetière du Locle du 4 juillet 2012 et son règlement d'application, état au 22 juin 2022). Il n'y a pas de nombre de mois dans le texte : la date se fixe avec l'administration.",
      tombes: [
        {
          type: "Stèle d'adulte, socle compris",
          dimensions: "70 cm de large",
          hauteurMax: "110 cm (130 cm pour une croix)",
          article: "art. 30",
        },
        {
          type: "Stèle d'enfant de 3 à 10 ans, socle compris",
          dimensions: "60 cm de large",
          hauteurMax: "80 cm (100 cm pour une croix)",
          article: "art. 30",
        },
        {
          type: "Stèle d'enfant de moins de 3 ans, socle compris",
          dimensions: "50 cm de large",
          hauteurMax: "60 cm (80 cm pour une croix)",
          article: "art. 30",
        },
        {
          type: "Monument d'une concession cinéraire A",
          dimensions: "60 x 80 cm",
          article: "art. 30",
        },
        {
          type: "Monument d'une concession cinéraire B",
          dimensions: "95 x 140 cm",
          article: "art. 30",
        },
      ],
      bordure:
        "Interdite, comme le gravillon. La stèle est posée sur un sommier communal et la tombe reçoit un jardinet de 50 cm de diamètre (art. 30).",
      materiaux:
        "Pierre, bronze ou inox. Les monuments couchés, les plaques émaillées et le fer forgé sont interdits (art. 29) ; le nettoyage aux produits chimiques l'est aussi (art. 31).",
      taxePose: "CHF 200.- pour la pose du monument sur le sommier communal (art. 30).",
      obligations: [
        "Le nom du marbrier est inscrit lisiblement sur le monument (art. 29).",
        "Les monuments couchés, les plaques émaillées et le fer forgé ne sont pas admis (art. 29).",
        "Les protections sont tolérées de novembre à la fin du mois d'avril (art. 31).",
      ],
    },
    chiffres: {
      delai: "Quand le terrain est stabilisé",
      tombeAdulte: "Stèle de 70 cm de large",
      hauteurMax: "110 cm, socle compris",
    },
    cineraire: [
      "Le mur cinéraire reçoit deux urnes par niche, pour vingt ans (CHF 1200.-) ; la plaque en marbre est obligatoire et à la charge de la famille (art. 23 et 24).",
      "La concession cinéraire A mesure 1,00 x 0,80 m, reçoit quatre urnes et dure vingt ans (CHF 200.-, renouvelable dix ans pour CHF 100.-) ; la concession B mesure 2,00 x 1,20 m, reçoit douze urnes et dure soixante ans (CHF 1500.-) (art. 23 et 24).",
      "Le monument d'une concession A ne dépasse pas 60 x 80 cm, celui d'une concession B 95 x 140 cm (art. 30).",
      "Le jardin du souvenir est anonyme.",
      "Les dépôts de cendres ont lieu du 1er mai au 31 octobre, le mercredi et le vendredi (art. 4 du règlement d'application) ; la commune indique des dépôts de 14 h à 17 h.",
    ],
    tarifs: {
      date: "règlement du cimetière du Locle du 4 juillet 2012 et son règlement d'application, état au 22 juin 2022",
      source: "leLocle",
      lignes: [
        { prestation: "Inhumation", domicilie: "gratuit", exterieur: "CHF 1200.-" },
        { prestation: "Concession cinéraire A, 4 urnes, 20 ans", domicilie: "CHF 200.-" },
        { prestation: "Renouvellement de la concession A, 10 ans", domicilie: "CHF 100.-" },
        { prestation: "Concession cinéraire B, 12 urnes, 60 ans", domicilie: "CHF 1500.-" },
        { prestation: "Niche du mur cinéraire, 2 urnes, 20 ans", domicilie: "CHF 1200.-" },
        { prestation: "Taxe de pose d'un monument", domicilie: "CHF 200.-" },
        { prestation: "Entretien de la tombe par la commune", domicilie: "CHF 80.- à 190.- par an" },
      ],
      note: "Ce sont des taxes communales, pas des prix de monument. La plaque en marbre du mur cinéraire et sa gravure restent à la charge de la famille.",
    },
    duree: [
      "Les fosses sont rouvertes après soixante ans au moins au Locle, alors que la loi cantonale demande trente ans au moins (art. 32 du règlement, art. 6 de la loi).",
      "La concession cinéraire A dure vingt ans, renouvelable par dix ans ; la concession B dure soixante ans (art. 23 et 24).",
      "Le délai pour reprendre le monument à la réouverture n'est pas publié : il est à demander à l'administration des cimetières.",
    ],
    entretien: [
      "L'entretien de la tombe peut être confié à la commune, de CHF 80.- à CHF 190.- par an.",
      "Le nettoyage aux produits chimiques est interdit (art. 31) et les protections sont tolérées de novembre à la fin du mois d'avril.",
    ],
    faq: [
      {
        question: "À qui s'adresser pour le cimetière du Locle ?",
        reponse:
          "À l'administration des cimetières du Locle et des Brenets, avenue de l'Hôtel-de-Ville 1 à 2400 Le Locle, 032 933 84 61 ou 032 933 84 62, cdh.lelocle@ne.ch. L'adresse postale du cimetière ne figure pas dans les documents que nous avons relevés ; l'accès est libre en tout temps, avec des commodités limitées de novembre à avril (art. 3).",
      },
      {
        question: "Quelle taille de pierre tombale est autorisée au Locle ?",
        reponse:
          "Une stèle d'adulte mesure 70 cm de large et 110 cm de haut au plus, socle compris, et une croix 130 cm. Pour un enfant de trois à dix ans : 60 cm de large sur 80 cm de haut (100 cm pour une croix) ; avant trois ans, 50 cm sur 60 cm (80 cm pour une croix). Le monument est posé sur un sommier communal (art. 30).",
      },
      {
        question: "Les bordures sont-elles permises au cimetière du Locle ?",
        reponse:
          "Non. Les bordures et le gravillon sont interdits : la stèle est posée sur un sommier communal et la tombe reçoit un jardinet de 50 cm de diamètre (art. 30). Les monuments couchés, les plaques émaillées et le fer forgé ne sont pas admis non plus (art. 29).",
      },
      {
        question: "Quand peut-on poser le monument au Locle ?",
        reponse:
          "Lorsque la fosse est comblée, nivelée et le terrain stabilisé : le règlement ne fixe pas de nombre de mois, la date se convient avec l'administration. La taxe communale de pose sur le sommier est de CHF 200.- (art. 30).",
      },
      {
        question: "Combien coûte une niche au mur cinéraire du Locle ?",
        reponse:
          "CHF 1200.- pour vingt ans et deux urnes (art. 23 et 24). La plaque en marbre est obligatoire et reste à la charge de la famille. La concession cinéraire A, de 1,00 x 0,80 m et quatre urnes, coûte CHF 200.- pour vingt ans ; la concession B, de 2,00 x 1,20 m et douze urnes, CHF 1500.- pour soixante ans.",
      },
      {
        question: "Y a-t-il un secteur confessionnel au cimetière du Locle ?",
        reponse:
          "Le sous-secteur 9-B comprend des lignes réservées aux communautés islamiques (art. 2 du règlement d'application, état au 22 juin 2022).",
      },
      {
        question: "Le cimetière des Brenets suit-il les mêmes règles ?",
        reponse:
          "Les Brenets ont fusionné avec Le Locle en 2021 et les deux cimetières ont la même administration. Les documents que nous avons relevés ne confirment pas le régime appliqué aux Brenets : nous le demandons à l'administration des cimetières (032 933 84 61) avant toute commande.",
      },
    ],
    sources: ["leLocle", "leLocleApplication", "loiSepultures"],
    verifieLe: VERIFIE_LE,
  },

  /* -------------------------------------------------- Val-de-Travers ----- */
  {
    slug: "val-de-travers",
    nom: "Cimetière de Val-de-Travers",
    nomCourt: "Val-de-Travers",
    commune: "Val-de-Travers",
    localites: ["Couvet", "Fleurier", "Travers", "Môtiers", "Buttes", "Boveresse"],
    titreSeo: "Cimetières de Val-de-Travers : délais et monuments",
    description:
      "Cimetières de Val-de-Travers : délai de quinze mois avant la pose, dimensions des tombes, niches du columbarium et plaquette du jardin du souvenir.",
    chapo:
      "Val-de-Travers administre les cimetières de Couvet, Fleurier, Travers, Môtiers, Buttes et Boveresse sous un seul règlement de police. Le monument y est posé quinze mois au plus tôt après l'inhumation ou le dépôt des cendres, sur une tombe de 180 x 80 cm au plus, bordure comprise.",
    contact: {
      service: "Contrôle des habitants de Val-de-Travers",
      adresse: "rue du Temple 8, 2114 Fleurier",
      telephone: "032 886 43 00",
      telephoneSecondaire: "032 886 43 56 (travaux publics, rue des Moulins 28, Fleurier)",
      horaires:
        "Guichet : lundi, mercredi et jeudi 8 h 30-12 h et 13 h 30-17 h, mardi 13 h 30-17 h, vendredi 7 h 30-15 h.",
      url: "https://www.val-de-travers.ch/portail-virtuel/deces",
    },
    equipements: [
      "Des jardins du souvenir à Couvet, Fleurier, Môtiers et Travers ; une plaquette nominative y est possible depuis mai 2024.",
      "Une chapelle, au cimetière de Fleurier.",
      "Un columbarium : la niche reçoit deux urnes au plus, pour vingt ans renouvelables par dix ans (art. 9.23).",
      "Des chambres mortuaires et une salle de cérémonie, gratuites pour les personnes domiciliées dans la commune, selon les disponibilités.",
      "Des cérémonies du lundi au vendredi, de 9 h à 12 h et de 14 h à 17 h (arrêté du 19 mai 2021).",
    ],
    regles: {
      delaiPose:
        "Quinze mois au plus tôt après l'inhumation ou le dépôt des cendres, la tombe nivelée (art. 9.17 du règlement de police 113.1 du 30 septembre 2019, modifié jusqu'au 11 décembre 2023). Les bordures suivent le même délai que le monument.",
      tombes: [
        {
          type: "Tombe d'adulte et d'enfant dès 3 ans, bordure comprise",
          dimensions: "180 x 80 cm",
          article: "art. 9.16",
        },
        {
          type: "Tombe d'enfant de moins de 3 ans, bordure comprise",
          dimensions: "100 x 60 cm",
          article: "art. 9.16",
        },
        {
          type: "Tombe cinéraire, bordure comprise",
          dimensions: "100 x 60 cm",
          article: "art. 9.16",
        },
        {
          type: "Hauteur du monument",
          dimensions:
            "Aucun chiffre dans le règlement : la grandeur est fixée par le Conseil communal sur les plans d'aménagement, qui ne sont pas publiés",
          article: "art. 9.12",
        },
      ],
      bordure:
        "Permise, et comptée dans les dimensions : les 180 x 80 cm d'une tombe d'adulte comprennent la bordure (art. 9.16). La bordure ne se pose pas avant quinze mois, comme le monument (art. 9.17).",
      materiaux:
        "Le règlement n'impose pas de matériau. Le nettoyage de la pierre aux solvants est interdit (art. 9.10).",
      taxePose:
        "Aucune taxe de pose n'est publiée à Val-de-Travers. Dans le canton, seules Neuchâtel, La Chaux-de-Fonds et Le Locle en publient une.",
      obligations: [
        "Le numéro du piquet reste visible sur la tombe (art. 9.13).",
        "La hauteur du monument est fixée par le Conseil communal sur les plans d'aménagement, qui ne sont pas publiés (art. 9.12) : nous la faisons confirmer avant la commande.",
        "Les plaques des niches et les plaquettes du jardin du souvenir sont gravées par une entreprise désignée par le Conseil communal (art. 9.21 et 9.26) ; son nom n'est pas publié.",
        "La publicité est interdite dans l'enceinte du cimetière et aux abords, sauf autorisation (art. 9.4).",
      ],
    },
    chiffres: {
      delai: "15 mois après l'inhumation",
      tombeAdulte: "180 x 80 cm, bordure comprise",
      hauteurMax: "Fixée par le Conseil communal",
    },
    cineraire: [
      "Une urne peut être déposée sur la tombe d'un proche, à 70 cm de profondeur, ou remise à la famille ; une urne mise en terre sans caveau doit être en matériau durable (art. 8.17).",
      "Une tombe cinéraire mesure 100 x 60 cm, bordure comprise (art. 9.16).",
      "Les niches du columbarium sont concédées pour vingt ans, renouvelables par dix ans, et reçoivent deux urnes au plus (art. 9.23). La plaque porte les noms, les dates et une photographie, avec un vase imposé (art. 9.26).",
      "Les jardins du souvenir de Couvet, Fleurier, Môtiers et Travers acceptent une plaquette nominative de 4 x 6 cm depuis mai 2024, pour CHF 80.- ; elle peut être retirée après vingt ans (art. 9.21 du règlement, art. 10.14a de l'arrêté des taxes 020.3).",
      "L'inhumation et le dépôt des cendres sont gratuits pour les personnes domiciliées dans la commune (art. 8.2 et 8.13).",
    ],
    tarifs: {
      date: "arrêté des taxes 020.3 et page officielle de la commune, relevés le 29 octobre 2026",
      sourceLibelle:
        "Arrêté des taxes de Val-de-Travers 020.3, art. 10.14a (plaquette du jardin du souvenir) ; montant de la niche relevé sur la page officielle de la commune",
      lignes: [
        { prestation: "Inhumation", domicilie: "gratuit" },
        { prestation: "Dépôt des cendres", domicilie: "gratuit" },
        { prestation: "Niche du columbarium, 20 ans", domicilie: "CHF 1500.-" },
        {
          prestation: "Plaquette du jardin du souvenir, 4 x 6 cm, 20 ans",
          domicilie: "CHF 80.-",
        },
      ],
      note: "Ce sont des taxes communales, pas des prix de monument. Le tarif de gravure des plaques ne figure pas dans un document officiel à jour : il est à demander à la commune, qui désigne l'entreprise chargée des gravures.",
    },
    duree: [
      "Les tombes sont désaffectées après trente ans, et les familles ont trois mois pour reprendre le monument (art. 9.19).",
      "La loi cantonale fixe la réouverture des fosses à trente ans au moins (art. 6).",
      "Les niches sont concédées pour vingt ans, renouvelables par dix ans (art. 9.23) ; la plaquette du jardin du souvenir peut être retirée après vingt ans (art. 9.21).",
    ],
    entretien: ["Le nettoyage de la pierre aux solvants est interdit (art. 9.10)."],
    faq: [
      {
        question: "À qui s'adresser pour un cimetière de Val-de-Travers ?",
        reponse:
          "Au contrôle des habitants, rue du Temple 8 à 2114 Fleurier, 032 886 43 00, qui gère les cimetières de la commune ; les travaux publics répondent au 032 886 43 56, rue des Moulins 28 à Fleurier. Les adresses des cimetières des villages ne figurent pas dans les documents que nous avons relevés.",
      },
      {
        question: "Quand peut-on poser une pierre tombale à Val-de-Travers ?",
        reponse:
          "Quinze mois au plus tôt après l'inhumation ou le dépôt des cendres, la tombe nivelée (art. 9.17). Les bordures suivent le même délai que le monument : une inhumation au printemps donne une pose l'été de l'année suivante.",
      },
      {
        question: "Quelle taille de tombe est autorisée à Val-de-Travers ?",
        reponse:
          "180 x 80 cm pour un adulte et pour un enfant dès trois ans, 100 x 60 cm avant trois ans, 100 x 60 cm pour une tombe cinéraire, bordure comprise dans chaque cas (art. 9.16). La hauteur n'est pas chiffrée : elle est fixée par le Conseil communal sur les plans d'aménagement, qui ne sont pas publiés (art. 9.12).",
      },
      {
        question: "Combien coûte une plaquette au jardin du souvenir ?",
        reponse:
          "CHF 80.- pour une plaquette de 4 x 6 cm, possible depuis mai 2024 dans les jardins du souvenir de Couvet, Fleurier, Môtiers et Travers ; elle peut être retirée après vingt ans (art. 9.21 du règlement, art. 10.14a de l'arrêté des taxes 020.3).",
      },
      {
        question: "Qui grave les plaques du columbarium à Val-de-Travers ?",
        reponse:
          "Une entreprise désignée par le Conseil communal (art. 9.21 et 9.26) ; son nom n'est pas publié. La plaque porte les noms, les dates et une photographie, avec un vase imposé. La niche est concédée pour vingt ans, renouvelables par dix ans, et reçoit deux urnes au plus (art. 9.23).",
      },
      {
        question: "Combien de temps dure une tombe à Val-de-Travers ?",
        reponse:
          "Trente ans : la tombe est ensuite désaffectée et les familles ont trois mois pour reprendre le monument (art. 9.19). La loi cantonale demande au moins trente ans (art. 6).",
      },
    ],
    sources: ["valDeTravers", "valDeTraversPage", "loiSepultures"],
    verifieLe: VERIFIE_LE,
  },
];

/* ======================================================================== */
/* Le tableau du canton                                                      */
/* ======================================================================== */

/** Le texte officiel d ou viennent les regles d une commune. */
export interface TexteCommunal {
  /** Nom exact du reglement. */
  titre: string;
  /** Date d adoption ou etat du texte. */
  date: string;
  /** Adresse du document, seulement s il est en ligne. */
  url?: string;
}

export interface CommuneNE {
  commune: string;
  /** Cimetiere concerne, quand la commune en distingue plusieurs. */
  cimetiere?: string;
  delai: string;
  tombeAdulte: string;
  hauteurMax: string;
  bordure: string;
  cineraire: string;
  texte: TexteCommunal;
  /** Slug de la page de ce cimetiere, quand elle existe. */
  slug?: string;
  /** Precision qui ne tient pas dans les colonnes. */
  note?: string;
}

/**
 * Les 24 communes du canton (releve du 28.10.2026, tableau du point 4 de
 * docs/DIMENSIONS-MONUMENTS.md). Neuchatel occupe trois lignes parce que ses
 * quatre cimetieres n ont pas les memes maximums ; Brot-Plamboz n a pas de
 * cimetiere et inhume aux Ponts-de-Martel. « Non publiee » signifie : absente
 * du texte officiel, a demander a la commune.
 */
export const COMMUNES_NE: CommuneNE[] = [
  {
    commune: "Neuchâtel",
    cimetiere: "Beauregard",
    delai: "1 an",
    tombeAdulte: "70 x 130 cm de surface",
    hauteurMax: "120 cm (stèle, gabarits)",
    bordure: "Interdite",
    cineraire: "60 x 100 cm, stèle 80 cm",
    texte: {
      titre: "Règlement des cimetières de la Ville de Neuchâtel",
      date: "26 juin 2023",
      url: "https://www.neuchatelville.ch/fileadmin/sites/ne_ville/fichiers/votre_commune/CG_NEO/CG_NEO_arretes_avispub/Public_230626_avec_arretes.pdf",
    },
    slug: "beauregard-neuchatel",
  },
  {
    commune: "Neuchâtel",
    cimetiere: "Peseux",
    delai: "1 an",
    tombeAdulte: "70 x 130 cm de surface",
    hauteurMax: "150 cm",
    bordure: "Permise",
    cineraire: "60 x 100 cm, monument 110 cm",
    texte: {
      titre: "Règlement des cimetières de la Ville de Neuchâtel",
      date: "26 juin 2023",
      url: "https://www.neuchatelville.ch/fileadmin/sites/ne_ville/fichiers/votre_commune/CG_NEO/CG_NEO_arretes_avispub/Public_230626_avec_arretes.pdf",
    },
    slug: "peseux",
  },
  {
    commune: "Neuchâtel",
    cimetiere: "Corcelles-Cormondrèche et Valangin",
    delai: "1 an",
    tombeAdulte: "70 x 130 cm de surface",
    hauteurMax: "160 cm",
    bordure: "Permise",
    cineraire: "60 x 100 cm, monument 110 cm",
    texte: {
      titre: "Règlement des cimetières de la Ville de Neuchâtel",
      date: "26 juin 2023",
      url: "https://www.neuchatelville.ch/fileadmin/sites/ne_ville/fichiers/votre_commune/CG_NEO/CG_NEO_arretes_avispub/Public_230626_avec_arretes.pdf",
    },
    slug: "corcelles-cormondreche",
  },
  {
    commune: "Milvignes",
    cimetiere: "Auvernier, Colombier, Bôle",
    delai: "1 an",
    tombeAdulte: "175 x 80 cm",
    hauteurMax: "120 cm, socle compris",
    bordure: "Permise pour une inhumation, interdite pour une tombe cinéraire",
    cineraire: "Espace 60 x 100 cm, monument 120 cm, ou dalle 100 x 60 cm",
    texte: { titre: "Règlement des cimetières de Milvignes", date: "10 septembre 2020" },
  },
  {
    commune: "Boudry",
    delai: "6 mois",
    tombeAdulte: "170 x 80 cm",
    hauteurMax: "Non publiée",
    bordure: "Permise",
    cineraire: "100 x 70 cm",
    texte: {
      titre: "Règlement général de police de Boudry, chapitre V",
      date: "21 mai 1987",
      url: "https://www.boudry.ch/fileadmin/SICO/Boudry/Documents/2022/Reglements_communaux/Reglement_de_police.pdf",
    },
    slug: "boudry",
  },
  {
    commune: "Cortaillod",
    delai: "12 mois",
    tombeAdulte: "160 x 80 cm",
    hauteurMax: "130 cm (stèle), 140 cm (croix)",
    bordure: "Permise",
    cineraire: "100 x 70 cm, monument 130 cm",
    texte: { titre: "Règlement de police de Cortaillod", date: "25 avril 2017, état au 24 juin 2020" },
    slug: "cortaillod",
  },
  {
    commune: "La Grande Béroche",
    cimetiere: "Bevaix, Vaumarcus ; Gorgier appartient à la paroisse",
    delai: "6 mois",
    tombeAdulte: "180 x 80 cm",
    hauteurMax: "Non publiée au règlement",
    bordure: "Permise",
    cineraire: "Non publiée au règlement",
    texte: { titre: "Règlement de police de La Grande Béroche, chapitres 8 et 9", date: "17 février 2020" },
    note: "Autorisation écrite du Conseil communal ; 12 mois pour enlever le monument à la désaffectation.",
  },
  {
    commune: "Laténa",
    cimetiere: "Saint-Blaise",
    delai: "4 mois",
    tombeAdulte: "180 x 80 cm",
    hauteurMax: "140 cm depuis le sol",
    bordure: "Sur autorisation, jamais en bois",
    cineraire: "100 x 60 cm, monument 110 cm",
    texte: { titre: "Règlement de police de Laténa 113.01", date: "20 mars 2025" },
    note: "Autorisation écrite du Conseil communal, « aucune dérogation » ; commune issue de la fusion de Hauterive, Saint-Blaise, La Tène et Enges.",
  },
  {
    commune: "Cornaux",
    cimetiere: "Cornaux, et Thielle-Wavre",
    delai: "12 mois",
    tombeAdulte: "180 x 80 cm",
    hauteurMax: "Non publiée",
    bordure: "Permise",
    cineraire: "100 x 60 cm, bordures comprises",
    texte: { titre: "Règlement du cimetière de Cornaux (RCIM)", date: "15 mars 2021" },
    note: "Matériaux naturels uniquement ; numéro du jalon visible.",
  },
  {
    commune: "Cressier",
    delai: "6 mois",
    tombeAdulte: "140 x 80 cm selon le texte, à confirmer",
    hauteurMax: "Non publiée",
    bordure: "Permise",
    cineraire: "100 x 60 cm",
    texte: { titre: "Règlement de police de Cressier, chapitre 6", date: "30 octobre 2008" },
    note: "Le texte indique 1,40 m de long alors que la fosse en mesure 2,00 m : à confirmer auprès de la commune avant toute commande.",
  },
  {
    commune: "Le Landeron",
    delai: "6 mois",
    tombeAdulte: "180 x 80 cm",
    hauteurMax: "Non publiée",
    bordure: "Permise",
    cineraire: "100 x 70 cm, bordures comprises",
    texte: { titre: "Règlement de police du Landeron 1110", date: "état au 21 mars 2024" },
    slug: "le-landeron",
  },
  {
    commune: "Lignières",
    delai: "10 mois",
    tombeAdulte: "180 x 80 cm",
    hauteurMax: "Non publiée",
    bordure: "Sur autorisation",
    cineraire: "100 x 70 cm",
    texte: { titre: "Règlement de police de Lignières", date: "30 juin 2022" },
    note: "Autorisation écrite du Conseil communal ; numéro du piquet visible.",
  },
  {
    commune: "La Chaux-de-Fonds",
    cimetiere: "La Charrière",
    delai: "6 mois, pose interdite du 1er novembre au 30 avril",
    tombeAdulte: "Fixée par l'administration sur ses plans",
    hauteurMax: "Fixée par l'administration",
    bordure: "Obligatoire pour une inhumation, posée par la commune",
    cineraire: "Jardin de 50 x 30 cm au moins, sans dallage complet",
    texte: {
      titre: "Règlement du cimetière de La Chaux-de-Fonds",
      date: "23 janvier 1995, état au 1er juillet 2010",
      url: "https://www.chaux-de-fonds.ch/demarches-officielles/cimetiere-et-centre-funeraire/Documents/ReglementCommunalCimetiere.pdf",
    },
    slug: "la-chaux-de-fonds",
  },
  {
    commune: "Le Locle",
    cimetiere: "Le Locle, et Les Brenets",
    delai: "Quand le terrain est stabilisé",
    tombeAdulte: "Stèle de 70 cm de large",
    hauteurMax: "110 cm socle compris, 130 cm pour une croix",
    bordure: "Interdite",
    cineraire: "Concession A 60 x 80 cm, concession B 95 x 140 cm",
    texte: {
      titre: "Règlement du cimetière du Locle et son règlement d'application",
      date: "4 juillet 2012, état au 22 juin 2022",
      url: "https://www.lelocle.ch/wp-content/uploads/2020/12/61.01_Reglement_cimetiere_20129704.pdf",
    },
    note: "Le monument est posé sur un sommier communal (taxe de pose CHF 200.-) et porte le nom du marbrier ; régime des Brenets à confirmer.",
    slug: "le-locle",
  },
  {
    commune: "Les Ponts-de-Martel",
    cimetiere: "Les Ponts-de-Martel, et Brot-Plamboz",
    delai: "12 mois",
    tombeAdulte: "Dalle ou bordure 140 x 80 x 20 cm, monument 130 x 70 cm",
    hauteurMax: "130 cm",
    bordure: "Permise, interdite dans les secteurs remaniés",
    cineraire: "Dalle 100 x 80 x 20 cm, monument 100 x 70 cm, hauteur 100 cm",
    texte: { titre: "Règlement de police des Ponts-de-Martel", date: "2009, modifié jusqu'au 11 décembre 2025" },
    note: "Dans les secteurs remaniés pour l'entretien mécanique : hauteur de 60 à 120 cm, largeur fixe de 70 cm, épaisseur de 20 cm au plus, bordures interdites.",
  },
  {
    commune: "Brot-Plamboz",
    delai: "12 mois",
    tombeAdulte: "Dalle ou bordure 140 x 80 x 20 cm, monument 130 x 70 cm",
    hauteurMax: "130 cm",
    bordure: "Permise, interdite dans les secteurs remaniés",
    cineraire: "Dalle 100 x 80 x 20 cm, monument 100 x 70 cm, hauteur 100 cm",
    texte: { titre: "Règlement de police des Ponts-de-Martel", date: "2009, modifié jusqu'au 11 décembre 2025" },
    note: "La commune n'a pas de cimetière : ses habitants sont inhumés aux Ponts-de-Martel.",
  },
  {
    commune: "La Sagne",
    delai: "6 mois",
    tombeAdulte: "160 x 80 cm, bordure comprise",
    hauteurMax: "120 cm",
    bordure: "Sur autorisation",
    cineraire: "100 x 60 cm, hauteur 100 cm",
    texte: { titre: "Règlement de police de La Sagne", date: "26 octobre 2015" },
    note: "Autorisation écrite ; le formulaire communal indique des dépôts de cendres en principe de mai à octobre.",
  },
  {
    commune: "Les Planchettes",
    delai: "6 mois",
    tombeAdulte: "175 x 80 cm",
    hauteurMax: "Non publiée",
    bordure: "Sur autorisation",
    cineraire: "Non publiée",
    texte: { titre: "Règlement de police des Planchettes", date: "11 décembre 2019" },
    note: "Autorisation écrite du Conseil communal ; concession de durée illimitée.",
  },
  {
    commune: "La Brévine",
    delai: "8 mois",
    tombeAdulte: "Entourage 160 x 80 cm",
    hauteurMax: "120 cm depuis le sol",
    bordure: "Permise",
    cineraire: "Emplacement 100 x 60 cm, monument 100 x 60 cm, hauteur 120 cm",
    texte: { titre: "Règlement de police de La Brévine", date: "1967, édition 1996" },
  },
  {
    commune: "La Chaux-du-Milieu",
    delai: "Non publié",
    tombeAdulte: "Non publiée",
    hauteurMax: "Non publiée",
    bordure: "Non publiée",
    cineraire: "Non publiée",
    texte: { titre: "Règlement de police de La Chaux-du-Milieu", date: "27 avril 1995" },
    note: "Le chapitre du cimetière ne fixe ni dimension ni délai de pose ; deux mois pour enlever un monument à la désaffectation.",
  },
  {
    commune: "Le Cerneux-Péquignot",
    delai: "Non publié",
    tombeAdulte: "Non publiée",
    hauteurMax: "Non publiée",
    bordure: "Non publiée",
    cineraire: "Non publiée",
    texte: { titre: "Règlement de police non publié", date: "non publié" },
    note: "Tout est à demander à la commune, 032 936 11 30.",
  },
  {
    commune: "Val-de-Travers",
    cimetiere: "Couvet, Fleurier, Travers, Môtiers, Buttes, Boveresse",
    delai: "15 mois",
    tombeAdulte: "180 x 80 cm, bordure comprise",
    hauteurMax: "Fixée par le Conseil communal sur ses plans",
    bordure: "Permise",
    cineraire: "100 x 60 cm, bordure comprise",
    texte: {
      titre: "Règlement de police de Val-de-Travers 113.1, chapitres 8 et 9",
      date: "30 septembre 2019, modifié jusqu'au 11 décembre 2023",
      url: "https://www.val-de-travers.ch/sites/default/files/reglements/113.1.pdf",
    },
    note: "Les plaques des niches et du jardin du souvenir sont gravées par une entreprise désignée par la commune.",
    slug: "val-de-travers",
  },
  {
    commune: "Les Verrières",
    delai: "Non publié",
    tombeAdulte: "Non publiée",
    hauteurMax: "Non publiée",
    bordure: "Non publiée",
    cineraire: "Non publiée",
    texte: { titre: "Aucun règlement publié", date: "non publié" },
    note: "À demander à la commune, 032 886 53 60.",
  },
  {
    commune: "La Côte-aux-Fées",
    delai: "Non publié",
    tombeAdulte: "Non publiée",
    hauteurMax: "Non publiée",
    bordure: "Non publiée",
    cineraire: "Non publiée",
    texte: { titre: "Aucun règlement publié", date: "non publié" },
  },
  {
    commune: "Val-de-Ruz",
    cimetiere: "Tous les villages",
    delai: "6 mois",
    tombeAdulte: "180 x 80 cm",
    hauteurMax: "Non publiée",
    bordure: "Permise",
    cineraire: "120 x 60 cm, bordure comprise",
    texte: { titre: "Règlement de police de Val-de-Ruz, chapitre 11", date: "version du 4 mai 2023" },
    note: "Accord du ou de la chef-fe du dicastère ; les anciennes normes restent appliquées jusqu'à la fin de chaque ligne de tombes, et des dérogations sont possibles.",
  },
  {
    commune: "Rochefort",
    cimetiere: "Rochefort, Brot-Dessous",
    delai: "Quand le terrain est stabilisé",
    tombeAdulte: "180 x 80 cm, bordure comprise",
    hauteurMax: "Non publiée",
    bordure: "Permise",
    cineraire: "180 x 80 cm, comme toutes les tombes",
    texte: { titre: "Règlement de police de Rochefort", date: "3 juin 2000, modifié en 2019 et 2021" },
  },
];

/* ======================================================================== */
/* Acces aux donnees                                                         */
/* ======================================================================== */

/** Seule source des liens vers une page cimetiere. */
export function cimetiereUrl(slug: string): string {
  return `${CIMETIERES_URL}${slug}/`;
}

/** Une fiche par son slug. Leve si le slug n existe pas : le build echoue au
 *  lieu de publier un lien mort. */
export function cimetiereParSlug(slug: string): Cimetiere {
  const fiche = CIMETIERES.find((item) => item.slug === slug);
  if (!fiche) throw new Error(`Cimetiere inconnu : ${slug}`);
  return fiche;
}

/** Les autres fiches, pour le maillage en bas de page. */
export function autresCimetieres(slug: string): Cimetiere[] {
  return CIMETIERES.filter((item) => item.slug !== slug);
}

/**
 * Lien vers le devis, commune et cimetiere deja remplis. Les deux valeurs sont
 * encodees : src/pages/devis.astro les relit dans l adresse.
 */
export function devisUrl(cimetiere: Cimetiere): string {
  const parametres = new URLSearchParams({
    commune: cimetiere.commune,
    cimetiere: cimetiere.nomCourt,
  });
  return `/devis/?${parametres.toString()}`;
}

/**
 * Lien d itineraire. Pas de carte integree sur le site : un lien vers la
 * recherche Google Maps, construit avec le nom du cimetiere et sa localite.
 */
export function itineraireUrl(cimetiere: Cimetiere): string {
  const localite = cimetiere.localites[0] ?? cimetiere.commune;
  const requete = encodeURIComponent(`${cimetiere.nom} ${localite}`);
  return `https://www.google.com/maps/search/?api=1&query=${requete}`;
}

/* ======================================================================== */
/* Garde-fou de build                                                        */
/* ======================================================================== */

/**
 * Controles qui arretent le build plutot que de publier une page incomplete :
 * meme liste que tests/cimetieres.test.ts, pour que l erreur apparaisse aussi
 * quand les tests ne tournent pas.
 */
function valide(): void {
  const slugs = new Set<string>();
  for (const fiche of CIMETIERES) {
    const ou = `Cimetiere ${fiche.slug}`;
    if (!/^[a-z0-9-]+$/.test(fiche.slug)) throw new Error(`${ou} : slug invalide`);
    if (slugs.has(fiche.slug)) throw new Error(`${ou} : slug en double`);
    slugs.add(fiche.slug);

    if (fiche.titreSeo.length > 65) {
      throw new Error(`${ou} : titreSeo de ${fiche.titreSeo.length} signes (65 au plus)`);
    }
    if (fiche.description.length < 120 || fiche.description.length > 160) {
      throw new Error(`${ou} : description de ${fiche.description.length} signes (120 a 160)`);
    }
    if (fiche.faq.length < 4) throw new Error(`${ou} : ${fiche.faq.length} question(s), 4 au moins`);
    if (fiche.sources.length < 1) throw new Error(`${ou} : aucune source officielle`);
    if (!fiche.verifieLe) throw new Error(`${ou} : date de verification absente`);
    if (fiche.regles.tombes.length < 1) throw new Error(`${ou} : aucune dimension`);
    if (fiche.duree.length < 1) throw new Error(`${ou} : duree de la tombe absente`);
  }

  const titres = CIMETIERES.map((fiche) => fiche.titreSeo);
  if (new Set(titres).size !== titres.length) throw new Error("Deux cimetieres ont le meme titreSeo");

  const descriptions = CIMETIERES.map((fiche) => fiche.description);
  if (new Set(descriptions).size !== descriptions.length) {
    throw new Error("Deux cimetieres ont la meme description");
  }

  for (const commune of COMMUNES_NE) {
    if (commune.slug && !CIMETIERES.some((fiche) => fiche.slug === commune.slug)) {
      throw new Error(`Commune ${commune.commune} : slug ${commune.slug} sans fiche`);
    }
  }
}

valide();
