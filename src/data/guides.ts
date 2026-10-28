/**
 * Les guides du site (/guides/).
 *
 * Une seule liste : la page d index, les liens croises entre guides et le pied
 * de page la lisent. Ajouter un guide ici (et sa page dans src/pages/guides/)
 * suffit a le faire apparaitre partout.
 *
 * REGLE DE CONTENU (brief du 28.10.2026, docs/BRIEF-GUIDES-LOT1.md) : tout ce
 * qu un guide affirme d un reglement vient de docs/REGLEMENTS-CIMETIERES-NE.md
 * ou de docs/DIMENSIONS-MONUMENTS.md, avec la commune, l article et le lien
 * officiel (`SOURCES` dans src/data/cimetieres-ne.ts). Ce qui n y figure pas
 * n est pas ecrit. Aucun prix de l entreprise sur ces pages : les seuls
 * montants cites sont des taxes communales officielles, datees et sourcees.
 */

/** Adresse de la page d index des guides. */
export const GUIDES_URL = "/guides/";

/** Date de la derniere relecture des reglements cites par les guides. */
export const VERIFIE_LE = "28 octobre 2026";

/**
 * Mention affichee sur chaque guide. Un reglement communal change sans
 * prevenir : la page dit quand elle a ete verifiee et ce que nous faisons.
 */
export const MENTION_VERIFICATION =
  `Informations vérifiées le ${VERIFIE_LE} dans les règlements communaux. ` +
  "Elles peuvent changer : nous vérifions toujours le règlement du cimetière concerné avant la pose.";

export interface Guide {
  /** Dernier segment de l adresse, sans barre oblique. */
  slug: string;
  /** Titre complet, celui du h1 et du fil d Ariane. */
  titre: string;
  /** Titre court, pour les listes et les liens entre guides. */
  titreCourt: string;
  /** Une phrase qui dit a qui le guide sert. */
  resume: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "quand-poser-une-pierre-tombale",
    titre: "Quand poser une pierre tombale dans le canton de Neuchâtel ?",
    titreCourt: "Quand poser une pierre tombale",
    resume:
      "Le délai à respecter avant la pose, commune par commune, les périodes où la pose est interdite, les autorisations à déposer et les taxes communales.",
  },
  {
    slug: "columbarium-cavurne-jardin-du-souvenir",
    titre: "Columbarium, cavurne, jardin du souvenir : que faire des cendres à Neuchâtel ?",
    titreCourt: "Columbarium, cavurne et jardin du souvenir",
    resume:
      "Ce que recouvre chaque mot, ce que propose chaque commune du canton, les durées, le nombre d'urnes et les tarifs officiels publiés.",
  },
  {
    slug: "epitaphe",
    titre: "Épitaphe : idées de textes courts pour une pierre tombale",
    titreCourt: "Épitaphe : idées de textes",
    resume:
      "Ce qu'on grave sur un monument, combien de mots tiennent sur une stèle, et trente exemples de phrases courtes à reprendre ou à adapter.",
  },
];

/** Seule source des liens vers un guide. */
export function guideUrl(slug: string): string {
  return `${GUIDES_URL}${slug}/`;
}

/** Les autres guides, pour le maillage en bas de chaque page. */
export function autresGuides(slug: string): Guide[] {
  return GUIDES.filter((guide) => guide.slug !== slug);
}

/** Un guide par son slug. Leve si le slug n existe pas : le build echoue au
 *  lieu de publier un lien mort. */
export function guideParSlug(slug: string): Guide {
  const guide = GUIDES.find((item) => item.slug === slug);
  if (!guide) throw new Error(`Guide inconnu : ${slug}`);
  return guide;
}
