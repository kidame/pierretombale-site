/**
 * Donnees structurees communes aux pages liste et aux fiches modele.
 * Le domaine canonique vient toujours d `Astro.site` (astro.config.mjs) :
 * il n est recopie nulle part ailleurs.
 */

export interface FilAriane {
  /** Libelle affiche, accents compris. */
  name: string;
  /** Chemin absolu depuis la racine, ex. "/monuments-funeraires/". */
  path: string;
}

/**
 * BreadcrumbList : Accueil > famille > modele. L ordre des elements donne les
 * positions, il n y a donc rien a numeroter a la main.
 */
export function breadcrumbSchema(items: FilAriane[], origin: URL | string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, origin).href,
    })),
  };
}
