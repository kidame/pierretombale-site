import { getCollection, type CollectionEntry } from "astro:content";
import { granitsDisponibles, nomGranit, type Granit } from "@/data/granits";
import imagesModeles from "@/data/images-modeles.json";
import { enregistreFamilles, prixAffiche, verifieSlugsTarifs } from "@/data/tarifs";

type ProductEntry = CollectionEntry<"products">;
export type Product = ProductEntry["data"] & { slug: string; description: string };

export type Famille = Product["famille"];
export type Gamme = Product["gamme"];

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

/** Nom de la famille, tel qu il apparait dans le menu et le fil d Ariane. */
export const FAMILLE_LABELS: Record<Famille, string> = {
  monument: "Monuments funéraires",
  cineraire: "Monuments cinéraires et cavurnes",
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

/* Les tarifs ne sont verifies qu une fois : c est le premier appel qui connait
   la liste des fiches, et toutes les pages passent par `getProducts`. */
let tarifsVerifies = false;

export async function getProducts(): Promise<Product[]> {
  const entries = await getCollection("products");
  const products = entries
    .map((entry: ProductEntry) => ({
      slug: slugFromEntry(entry),
      description: descriptionFromEntry(entry),
      ...entry.data,
    }))
    .sort(byOrderThenName);

  if (!tarifsVerifies) {
    verifieSlugsTarifs(products.map((product) => product.slug));
    enregistreFamilles(products.map((product) => [product.slug, product.famille] as const));
    tarifsVerifies = true;
  }

  return products;
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
 * au fil des visuels disponibles), dans un ordre fixe.
 */
export const FAMILLES: Famille[] = ["monument", "cineraire"];

export const GAMMES: Gamme[] = ["classique", "contemporain", "prestige", "musulman"];

/* ------------------------------------------------------------- Les visuels */

/**
 * LES VISUELS NE PASSENT PAS PAR LE PIPELINE D IMAGES D ASTRO.
 *
 * Les 270 images (27 modeles x 10 matieres) sont deja derivees en trois
 * largeurs dans `public/images/modeles/<modeleId>/`, par
 * `scripts/images-modeles.py`. Astro les sert telles quelles : rien a
 * reencoder au build, et une image remplacee dans public/ n a pas besoin d un
 * nouveau build pour changer d aspect.
 *
 * `src/data/images-modeles.json` dit, pour chaque `modeleId`, quelles matieres
 * existent. C est la seule source : les chemins se construisent ici et nulle
 * part ailleurs.
 */
interface EntreeImages {
  famille: string;
  matieres: string[];
}

const indexImages = imagesModeles as Record<string, EntreeImages>;

/** Les largeurs derivees pour chaque visuel, en pixels. Images carrees. */
const LARGEURS_VISUEL = [320, 640, 1200] as const;

/** Largeur de l attribut `src` : le repli pour un navigateur sans `srcset`. */
const LARGEUR_VISUEL = 640;

export interface VisuelModele {
  src: string;
  /** Les trois largeurs en descripteurs `w`, pour que le navigateur choisisse. */
  srcset: string;
  width: number;
  height: number;
  alt: string;
  /** Id de la matiere montree. */
  matiere: string;
  /** Son nom commercial, tel qu il s affiche. */
  nomMatiere: string;
}

function cheminVisuel(modeleId: string, matiere: string, largeur: number): string {
  return `/images/modeles/${modeleId}/${modeleId}-${matiere}-${largeur}.webp`;
}

/**
 * Texte alternatif d un visuel. En francais, avec les accents, et toujours
 * dans le meme ordre : le modele, ce que c est, la matiere, le cadrage. C est
 * aussi ce que le script de la fiche reecrit quand on change de matiere.
 */
export function altVisuel(product: Product, matiere: string): string {
  return `${product.name}, ${FAMILLE_SINGULIER[product.famille]} en ${nomGranit(matiere)}, vue de face`;
}

/**
 * Le visuel d un modele dans une matiere donnee (par defaut celle que la fiche
 * presente). Une matiere qui n a pas d image pour ce modele arrete le build :
 * mieux vaut une erreur qu une image manquante sur le site.
 */
export function visuelModele(
  product: Product,
  matiere: string = product.granitPresente,
): VisuelModele {
  const matieres = indexImages[product.modeleId]?.matieres ?? [];

  if (!matieres.includes(matiere)) {
    throw new Error(
      `Aucune image pour le modele "${product.modeleId}" en "${matiere}". ` +
        `Matieres disponibles dans src/data/images-modeles.json : ${matieres.join(", ") || "aucune"}.`,
    );
  }

  return {
    src: cheminVisuel(product.modeleId, matiere, LARGEUR_VISUEL),
    srcset: LARGEURS_VISUEL.map(
      (largeur) => `${cheminVisuel(product.modeleId, matiere, largeur)} ${largeur}w`,
    ).join(", "),
    width: LARGEUR_VISUEL,
    height: LARGEUR_VISUEL,
    alt: altVisuel(product, matiere),
    matiere,
    nomMatiere: nomGranit(matiere),
  };
}

/**
 * Les matieres dans lesquelles ce modele a un visuel, dans l ordre de
 * `src/data/granits.json`. Croisement de l index des images et des granits
 * DISPONIBLES : retirer un granit du catalogue le retire aussitot des fiches,
 * sans toucher aux images.
 */
export function imagesDuModele(product: Product): Granit[] {
  const matieres = indexImages[product.modeleId]?.matieres ?? [];
  return granitsDisponibles().filter((granit) => matieres.includes(granit.id));
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
    prix: prixAffiche(product.slug),
  };
}
