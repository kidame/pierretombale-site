/**
 * Central theme configuration.
 *
 * Everything a new site normally needs to change lives here: the studio name,
 * navigation, footer, and which products are promoted on the homepage and in
 * the mobile menu. Components read from this file rather than hardcoding copy,
 * so renaming or re-scoping the theme does not mean editing markup.
 *
 * Deux choses ne sont PAS ici, pour qu'elles n'aient qu'une seule source :
 * - le domaine canonique : `site` dans astro.config.mjs ;
 * - les coordonnées de l'entreprise (téléphone, courriel, adresse) :
 *   `src/config/entreprise.ts`, à `null` tant que les associés ne les ont pas
 *   fournies. Les valeurs d'Atelier Kō ont été retirées d'ici (étape E3) ;
 *   le nom, la tagline et les descriptions anglaises restent à reprendre (E4).
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: NavItem[];
}

export const siteConfig = {
  /** Studio name. Used in the wordmark, metadata, JSON-LD and the footer. */
  name: "Atelier Kō",

  /**
   * One-line positioning statement. Plus émise dans les données structurées
   * depuis E3 : le texte est celui d'Atelier Kō, il sera réécrit en E4.
   */
  tagline: "Furniture, made by hand",

  /** Default meta description for pages that do not set their own. */
  description:
    "A small Swedish atelier crafting solid oak, ash and walnut furniture by hand. Made to order in Småland.",

  /** Default <title> for pages that do not set their own. */
  defaultTitle: "Atelier Kō — Hand-made furniture from the northern woods",

  /** Browser theme colour. Keep in step with `--canvas` in src/styles.css. */
  themeColor: "#f4f4f2",

  /**
   * Fallback social share card, served from public/. Used by any page that
   * does not pass its own `image` — product pages pass their photography, so
   * this covers the homepage, catalogue, studio, devis and 404.
   */
  socialImage: {
    src: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Monuments funéraires et monuments cinéraires en granit massif",
  },

  /**
   * Primary navigation, in order. Also drives the mobile menu.
   * The two family paths must stay in step with `FAMILLE_PATHS` in
   * src/data/products.ts, which is what every model link is built from.
   */
  navigation: [
    { label: "Monuments funéraires", href: "/monuments-funeraires/" },
    { label: "Monuments cinéraires", href: "/monuments-cineraires-cavurnes/" },
    { label: "L'atelier", href: "/about" },
    { label: "Demander un devis", href: "/devis" },
  ] satisfies NavItem[],

  /** Short paragraph in the first footer column. */
  footerBlurb:
    "Monuments funéraires et monuments cinéraires en granit massif, réalisés sur mesure pour la Suisse romande. Conseil, gravure et pose.",

  /** Footer link columns. Add or remove columns freely. */
  footerColumns: [
    {
      heading: "Catalogue",
      links: [
        { label: "Monuments funéraires", href: "/monuments-funeraires/" },
        { label: "Monuments cinéraires et cavurnes", href: "/monuments-cineraires-cavurnes/" },
        { label: "L'atelier", href: "/about" },
      ],
    },
    {
      heading: "Enquiries",
      links: [
        { label: "Custom orders", href: "/about#studio" },
        { label: "Trade portal", href: "/about#studio" },
        { label: "Studio visits", href: "/about#studio" },
      ],
    },
    /* Pas de colonne "Elsewhere" : le compte Instagram d'Atelier Kō pointait
       sur la racine du site, c'est-à-dire sur rien. Les réseaux de
       l'entreprise viendront quand ils existeront. */
  ] satisfies FooterColumn[],

  /**
   * Which products the theme promotes. Each value is a filename in
   * src/content/products without the .md extension. A slug that does not
   * resolve fails the build rather than rendering an empty section.
   */
  featured: {
    /** Three cards in the homepage "in the workshop" grid. */
    homepageGrid: ["stele-doucine-classique", "stele-arrondie", "stele-cineraire-droite"],
    /** The single large piece given its own homepage section. */
    homepageSolo: "monument-avec-jardiniere",
    /** The piece shown at the foot of the mobile menu. */
    mobileMenu: "stele-coeur",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Builds a page <title> in the theme's house format: "Page — Studio Name".
 * Change the separator here to restyle every title at once.
 */
export function pageTitle(page: string): string {
  return `${page} — ${siteConfig.name}`;
}
