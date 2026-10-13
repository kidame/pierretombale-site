import { getCollection, type CollectionEntry } from "astro:content";
import { nomGranit } from "@/data/granits";
import placeholderMonument from "@/assets/placeholder-monument.svg";
import placeholderCineraire from "@/assets/placeholder-cineraire.svg";

type ProductEntry = CollectionEntry<"products">;
export type Product = ProductEntry["data"] & { slug: string; description: string };

export type Famille = Product["famille"];
export type Gamme = Product["gamme"];

/** Aucun prix n est affiche tant que les tarifs ne sont pas connus (etape E3). */
export const PRIX_SUR_DEMANDE = "Prix sur demande";

/**
 * Adresse de la page liste de chaque famille, sans barre oblique finale.
 * Un modele n existe qu a l adresse de sa famille : il n a donc qu une seule
 * URL, et c est `productUrl` qui la donne.
 */
export const FAMILLE_PATHS: Record<Famille, string> = {
  monument: "/monuments-funeraires",
  cineraire: "/monuments-cineraires-cavurnes",
};

/** Adresse de la page liste d une famille. */
export function familleUrl(famille: Famille): string {
  return `${FAMILLE_PATHS[famille]}/`;
}

/** Seule source des liens vers une fiche modele. */
export function productUrl(product: Pick<Product, "famille" | "slug">): string {
  return `${FAMILLE_PATHS[product.famille]}/${product.slug}/`;
}

export const FAMILLE_LABELS: Record<Famille, string> = {
  monument: "Monuments",
  cineraire: "Cinéraires et cavurnes",
};

/** Au singulier, pour les phrases et les textes alternatifs. */
export const FAMILLE_SINGULIER: Record<Famille, string> = {
  monument: "monument funéraire",
  cineraire: "monument cinéraire",
};

export const GAMME_LABELS: Record<Gamme, string> = {
  classique: "Classique",
  contemporain: "Contemporain",
  prestige: "Prestige",
  musulman: "Musulman",
};

function slugFromEntry(entry: ProductEntry): string {
  return entry.id.replace(/\.(md|mdx)$/, "");
}

function descriptionFromEntry(entry: ProductEntry): string {
  return (entry.body ?? "").trim().replace(/\s+/g, " ");
}

function byOrderThenName(a: Product, b: Product): number {
  return a.order - b.order || a.name.localeCompare(b.name, "fr");
}

export async function getProducts(): Promise<Product[]> {
  const entries = await getCollection("products");
  return entries
    .map((entry: ProductEntry) => ({
      slug: slugFromEntry(entry),
      description: descriptionFromEntry(entry),
      ...entry.data,
    }))
    .sort(byOrderThenName);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

/** Les modeles d une famille, dans l ordre du catalogue. */
export async function getProductsByFamille(famille: Famille): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.famille === famille);
}

/**
 * Coupe un texte sur un mot entier, pour tenir dans une meta description
 * (155 caracteres) sans finir au milieu d un mot.
 */
export function tronque(texte: string, max: number): string {
  if (texte.length <= max) return texte;

  const coupe = texte.slice(0, max - 1);
  const espace = coupe.lastIndexOf(" ");
  return `${(espace > 0 ? coupe.slice(0, espace) : coupe).replace(/[\s,;:.–-]+$/, "")}…`;
}

export function getRelated(products: Product[], slug: string, limit = 3): Product[] {
  const current = products.find((product) => product.slug === slug);
  if (!current) return products.slice(0, limit);

  return products
    .filter((product) => product.slug !== slug)
    .sort((a, b) => {
      const aScore = a.famille === current.famille ? -1 : 1;
      const bScore = b.famille === current.famille ? -1 : 1;
      return aScore - bScore || byOrderThenName(a, b);
    })
    .slice(0, limit);
}

/**
 * Les filtres du catalogue viennent de la gamme annoncee, pas des fiches
 * presentes : une gamme sans modele reste proposee (le catalogue se remplit
 * au fil des visuels de l atelier), dans un ordre fixe.
 */
export const FAMILLES: Famille[] = ["monument", "cineraire"];

export const GAMMES: Gamme[] = ["classique", "contemporain", "prestige", "musulman"];

/**
 * Visuel a afficher pour un modele : sa premiere image si elle existe, sinon
 * le visuel provisoire de sa famille. Les placeholders sont des SVG, que l on
 * sert tels quels plutot que de les passer au pipeline d images.
 */
export function productVisuel(product: Product): {
  image: ImageMetadata;
  provisoire: boolean;
  alt: string;
} {
  const image = product.images[0];
  if (image) {
    return { image, provisoire: false, alt: `${product.name} — ${product.shortDescription}` };
  }

  return {
    image: product.famille === "cineraire" ? placeholderCineraire : placeholderMonument,
    provisoire: true,
    alt: `Visuel à venir : ${product.name}, ${FAMILLE_SINGULIER[product.famille]} en granit ${nomGranit(product.granitPresente)}`,
  };
}

/** Resout un slug de configuration, en faisant echouer le build s il n existe pas. */
export function requireProduct(products: Product[], slug: string): Product {
  const product = products.find((entry) => entry.slug === slug);
  if (!product) {
    throw new Error(
      `siteConfig.featured references "${slug}", but no such product exists in src/content/products.`,
    );
  }
  return product;
}

export function productForJson(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    famille: product.famille,
    gamme: product.gamme,
    shortDescription: product.shortDescription,
    description: product.description,
    dimensions: product.dimensions,
    stele: product.stele,
    bicolore: product.bicolore,
    lignes: product.lignes,
    motifs: product.motifs,
    options: product.options,
    granitPresente: product.granitPresente,
    granitsPossibles: product.granitsPossibles,
    prix: PRIX_SUR_DEMANDE,
  };
}
