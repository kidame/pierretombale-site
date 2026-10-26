/**
 * LE SITEMAP DES IMAGES : /sitemap-images.xml (26.10.2026).
 *
 * Google n'indexe une image que s'il la relie a une page. Chaque fiche de
 * modele declare ici ses visuels (une image 1200 px par matiere, soit 10 par
 * modele), avec le meme texte que son `alt` en legende. Les photos de
 * matieres sont rattachees a la page « Nos granits ». Le fichier est annonce
 * dans robots.txt, a cote du sitemap des pages (`@astrojs/sitemap`).
 *
 * Tout vient des memes sources que les pages : `getProducts`, `imagesDuModele`,
 * `altVisuel`, `granitsDisponibles`. Ajouter un modele ou une matiere met ce
 * fichier a jour tout seul.
 */
import type { APIRoute } from "astro";
import { granitsDisponibles } from "@/data/granits";
import { altVisuel, getProducts, imagesDuModele, productUrl, visuelModele } from "@/data/products";

const echappe = (texte: string) =>
  texte.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://www.pierretombale.ch");
  const absolue = (chemin: string) => new URL(chemin, base).href;
  const products = await getProducts();

  const entrees: string[] = [];
  for (const product of products) {
    const images = imagesDuModele(product).map((granit) => {
      const visuel = visuelModele(product, granit.id);
      return (
        `    <image:image>\n` +
        `      <image:loc>${absolue(visuel.src.replace(/-640\.webp$/, "-1200.webp"))}</image:loc>\n` +
        `      <image:title>${echappe(`${product.name} en ${granit.nom}`)}</image:title>\n` +
        `      <image:caption>${echappe(altVisuel(product, granit.id))}</image:caption>\n` +
        `    </image:image>`
      );
    });
    if (images.length === 0) continue;
    entrees.push(`  <url>\n    <loc>${absolue(productUrl(product))}</loc>\n${images.join("\n")}\n  </url>`);
  }

  const matieres = granitsDisponibles()
    .filter((granit) => granit.photo)
    .map(
      (granit) =>
        `    <image:image>\n` +
        `      <image:loc>${absolue(granit.photo!)}</image:loc>\n` +
        `      <image:title>${echappe(`Granit ${granit.nom}`)}</image:title>\n` +
        `      <image:caption>${echappe(`${granit.nom} : ${granit.description}`)}</image:caption>\n` +
        `    </image:image>`,
    );
  if (matieres.length > 0) {
    entrees.push(`  <url>\n    <loc>${absolue("/nos-granits/")}</loc>\n${matieres.join("\n")}\n  </url>`);
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
    `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    `${entrees.join("\n")}\n</urlset>\n`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
