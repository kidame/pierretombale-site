/**
 * Sources officielles des cimetieres du canton de Neuchatel.
 *
 * Les guides citent des reglements : chaque affirmation doit porter la
 * commune, l article et le lien vers le texte officiel. Les adresses vivent
 * ici pour qu une URL qui bouge ne se corrige qu une fois.
 *
 * Releve et lecture : docs/REGLEMENTS-CIMETIERES-NE.md (28.10.2026) et
 * docs/CIMETIERES-PRATIQUE.md (29.10.2026). Ne rien ajouter ici qui ne figure
 * pas dans ces fichiers avec sa source.
 *
 * Des textes cites par les pages n ont AUCUNE adresse dans le releve : le
 * reglement des taxes de La Chaux-de-Fonds (41.101) et les rapports du Conseil
 * communal de Neuchatel. Ils sont cites par leur nom et leur date dans le
 * texte, sans lien, plutot qu avec une URL inventee.
 */

export interface SourceOfficielle {
  /** Nom exact du texte, avec sa date d adoption. */
  libelle: string;
  /** Lien vers le document officiel. */
  url: string;
}

export const SOURCES = {
  loiSepultures: {
    libelle:
      "Loi neuchâteloise sur les sépultures du 10 juillet 1894 (RSN 565.1), état au 27 mai 2025",
    url: "https://rsn.ne.ch/DATA/program/books/rsne/pdf/565.1.pdf",
  },
  neuchatelReglement: {
    libelle: "Règlement des cimetières de la Ville de Neuchâtel du 26 juin 2023",
    url: "https://www.neuchatelville.ch/fileadmin/sites/ne_ville/fichiers/votre_commune/CG_NEO/CG_NEO_arretes_avispub/Public_230626_avec_arretes.pdf",
  },
  neuchatelGabarits: {
    libelle: "Gabarits des monuments funéraires de Beauregard, plans du 9 octobre 1990",
    url: "https://www.neuchatelville.ch/fileadmin/sites/ne_ville/fichiers/Vivre_a_Neuchatel/Cimetiere/Gabarits_des_monuments_funeraires.pdf",
  },
  neuchatelTarifs: {
    libelle:
      "Arrêté du Conseil communal de la Ville de Neuchâtel du 15 novembre 2021, tarifs en vigueur depuis le 1er janvier 2022",
    url: "https://www.neuchatelville.ch/fileadmin/sites/ne_ville/fichiers/Vivre_a_Neuchatel/Habitants/Arre__te___du_CC_du_15_novembre_2021_-_Tarifs_de__s_le_1er_janvier_2022.pdf",
  },
  neuchatelBeauregard: {
    libelle: "Page du cimetière de Beauregard, Ville de Neuchâtel",
    url: "https://www.neuchatelville.ch/vivre-a-neuchatel/habitant-e-s/cimetieres/cimetiere-de-beauregard",
  },
  neuchatelPeseuxPage: {
    libelle: "Page du cimetière de Peseux, Ville de Neuchâtel",
    url: "https://www.neuchatelville.ch/vivre-a-neuchatel/habitant-e-s/cimetieres/cimetiere-de-peseux",
  },
  neuchatelCorcellesPage: {
    libelle: "Page du cimetière de Corcelles-Cormondrèche, Ville de Neuchâtel",
    url: "https://www.neuchatelville.ch/vivre-a-neuchatel/habitant-e-s/cimetieres/cimetiere-de-corcelles-cormondreche",
  },
  chauxDeFonds: {
    libelle: "Règlement du cimetière de La Chaux-de-Fonds du 23 janvier 1995, état au 1er juillet 2010",
    url: "https://www.chaux-de-fonds.ch/demarches-officielles/cimetiere-et-centre-funeraire/Documents/ReglementCommunalCimetiere.pdf",
  },
  chauxDeFondsPage: {
    libelle: "Page du cimetière et du centre funéraire de La Chaux-de-Fonds",
    url: "https://www.chaux-de-fonds.ch/demarches-officielles/cimetiere-et-centre-funeraire",
  },
  leLocle: {
    libelle: "Règlement du cimetière du Locle du 4 juillet 2012",
    url: "https://www.lelocle.ch/wp-content/uploads/2020/12/61.01_Reglement_cimetiere_20129704.pdf",
  },
  leLocleApplication: {
    libelle: "Règlement d'application du cimetière du Locle, état au 22 juin 2022",
    url: "https://www.lelocle.ch/wp-content/uploads/2022/07/Reglement_CC_applic_Cimetiere_20220622.pdf",
  },
  boudry: {
    libelle: "Règlement général de police de Boudry du 21 mai 1987, chapitre V",
    url: "https://www.boudry.ch/fileadmin/SICO/Boudry/Documents/2022/Reglements_communaux/Reglement_de_police.pdf",
  },
  valDeTravers: {
    libelle: "Règlement de police de Val-de-Travers du 30 septembre 2019 (RSVDT 113.1), chapitres 8 et 9",
    url: "https://www.val-de-travers.ch/sites/default/files/reglements/113.1.pdf",
  },
} satisfies Record<string, SourceOfficielle>;

export type SourceId = keyof typeof SOURCES;

/** Loi cantonale, citee sans lien (aucune adresse officielle relevee). */
export const LOI_CANTONALE = "loi neuchâteloise sur les sépultures du 10 juillet 1894 (RSN 565.1)";
