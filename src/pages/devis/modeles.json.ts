import type { APIRoute } from "astro";
import { FAMILLE_LABELS, getProducts, productUrl } from "@/data/products";

/**
 * /devis/modeles.json : le catalogue reduit a ce que le courriel de devis
 * affiche (nom du modele, famille, adresse de la fiche), par slug. Genere au
 * build ; la fonction functions/api/devis.ts le lit pour ecrire "Douceur" et
 * un lien plutot que le slug brut. Rien de prive : tout est deja sur le site.
 */
export const GET: APIRoute = async () => {
  const products = await getProducts();
  const catalogue = Object.fromEntries(
    products.map((product) => [
      product.slug,
      { nom: product.name, famille: FAMILLE_LABELS[product.famille], url: productUrl(product) },
    ]),
  );
  return new Response(JSON.stringify(catalogue), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
