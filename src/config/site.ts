/**
 * Configuration centrale du site.
 *
 * Tout ce qui se reecrit quand le site change de nom ou de perimetre vit ici :
 * le nom affiche, la navigation, le pied de page et les modeles mis en avant
 * sur l accueil et dans le menu mobile. Les composants lisent ce fichier au
 * lieu d ecrire les textes en dur.
 *
 * ATTENTION : "PierreTombale.ch" est un nom PROVISOIRE (decision de Thomas du
 * 13.10.2026, le nom de l entreprise et le domaine ne sont pas tranches, cf.
 * `docs/DECISIONS-ET-ETAT.md`). Quand le nom sera choisi, deux endroits a
 * changer : `name` ci-dessous et `site` dans astro.config.mjs.
 *
 * Deux choses ne sont PAS ici, pour qu'elles n'aient qu'une seule source :
 * - le domaine canonique : `site` dans astro.config.mjs ;
 * - les coordonnées de l'entreprise (téléphone, courriel, adresse) :
 *   `src/config/entreprise.ts`, à `null` tant que les associés ne les ont pas
 *   fournies.
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
  /** Nom affiché : signature, métadonnées, JSON-LD et pied de page. Provisoire. */
  name: "PierreTombale.ch",

  /** Positionnement en une ligne. N'est plus émis dans les données structurées. */
  tagline: "Monuments funéraires et cinéraires en granit, Suisse romande",

  /** Meta description par défaut, pour une page qui n'en fournit pas. */
  description:
    "Monuments funéraires et monuments cinéraires en granit massif, réalisés sur mesure pour la Suisse romande. Conseil, gravure et pose compris dans le devis.",

  /** <title> par défaut, pour une page qui n'en fournit pas. */
  defaultTitle: "Pierres tombales et monuments en granit | PierreTombale.ch",

  /** Couleur de thème du navigateur. À garder en phase avec `--canvas` dans src/styles.css. */
  themeColor: "#f4f4f2",

  /* Pas de `socialImage` : la carte de partage du thème (public/og-image.png,
     un visuel de meubles) a été retirée en E4 passe 1 et rien ne la remplace
     encore. Il faut un PNG ou un JPEG de 1200x630 : les réseaux sociaux ne
     lisent pas les SVG. Tant qu'il n'existe pas, BaseLayout n'émet aucune
     balise og:image, plutôt qu'une balise qui pointe sur un fichier absent.
     Une fiche qui a une photographie, elle, emporte déjà son propre aperçu. */

  /**
   * Navigation principale, dans l'ordre. Pilote aussi le menu mobile.
   * Les deux chemins de famille doivent rester en phase avec `FAMILLE_PATHS`
   * dans src/data/products.ts, d'où vient chaque lien de modèle.
   */
  navigation: [
    { label: "Monuments funéraires", href: "/monuments-funeraires/" },
    { label: "Monuments cinéraires", href: "/monuments-cineraires-cavurnes/" },
    { label: "L'atelier", href: "/about" },
    { label: "Demander un devis", href: "/devis" },
  ] satisfies NavItem[],

  /** Court paragraphe de la première colonne du pied de page. */
  footerBlurb:
    "Monuments funéraires et monuments cinéraires en granit massif, réalisés sur mesure pour la Suisse romande. Conseil, gravure et pose.",

  /**
   * Colonnes de liens du pied de page. Seules des pages qui existent : pas de
   * lien mort ni de page annoncée mais pas écrite.
   */
  footerColumns: [
    {
      heading: "Catalogue",
      links: [
        { label: "Monuments funéraires", href: "/monuments-funeraires/" },
        { label: "Monuments cinéraires et cavurnes", href: "/monuments-cineraires-cavurnes/" },
      ],
    },
    {
      heading: "Informations",
      links: [
        { label: "L'atelier", href: "/about" },
        { label: "Demander un devis", href: "/devis" },
      ],
    },
  ] satisfies FooterColumn[],

  /**
   * Les modèles mis en avant. Chaque valeur est un nom de fichier de
   * src/content/products sans l'extension .md. Un slug qui ne se résout pas
   * fait échouer le build plutôt que d'afficher une section vide.
   */
  featured: {
    /** Les trois cartes de la grille de l'accueil. */
    homepageGrid: ["stele-doucine-classique", "stele-arrondie", "stele-cineraire-droite"],
    /** Le modèle qui a sa propre section sur l'accueil. */
    homepageSolo: "monument-avec-jardiniere",
    /** Le modèle montré au bas du menu mobile. */
    mobileMenu: "stele-coeur",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Titre de page au format maison : "Page | PierreTombale.ch". Changer le
 * séparateur ici change tous les titres d'un coup.
 */
export function pageTitle(page: string): string {
  return `${page} | ${siteConfig.name}`;
}

/**
 * Titre d'une fiche modèle : "<Nom> - <nature> en granit | PierreTombale.ch",
 * où la nature est "pierre tombale" ou "monument cinéraire".
 *
 * Google tronque au-delà de 60 signes, et le nom du modèle doit rester
 * lisible : passé cette limite on retire le nom du site, puis, si le nom du
 * modèle répète déjà la nature ("Stèle cinéraire courbe avec vase"), on ne la
 * redit pas.
 */
export function titreFiche(nom: string, nature: string): string {
  const base = `${nom} - ${nature} en granit`;
  const avecSite = `${base} | ${siteConfig.name}`;

  if (avecSite.length <= 60) return avecSite;
  if (base.length <= 60) return base;
  return `${nom} en granit`;
}
