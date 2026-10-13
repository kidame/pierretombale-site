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

export function getProductFilters(products: Product[]): {
  familles: Famille[];
  gammes: Gamme[];
} {
  return {
    familles: [...new Set(products.map((product) => product.famille))],
    gammes: [...new Set(products.map((product) => product.gamme))],
  };
}

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
