import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// MESURE TEMPORAIRE (E5) : meme calcul que scripts/poids-pages.py, mais lance
// pendant `npm run build` parce que `python3` n est pas dans l allowlist de
// .claude/settings.json. A RETIRER apres le releve.
import { gzipSync } from "node:zlib";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const poidsPages = () => ({
  name: "poids-pages",
  hooks: {
    "astro:build:done": ({ dir }) => {
      const root = dir.pathname;
      const gz = (buffer) => gzipSync(buffer, { level: 9 }).length;
      const html = [];
      const marche = (chemin) => {
        for (const entree of readdirSync(chemin)) {
          const complet = join(chemin, entree);
          if (statSync(complet).isDirectory()) marche(complet);
          else if (entree.endsWith(".html")) html.push(complet);
        }
      };
      marche(root);
      const lignes = html
        .map((chemin) => {
          const source = readFileSync(chemin, "utf8");
          const refs = new Set(
            [...source.matchAll(/(?:src|href)="(\/_astro\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]),
          );
          let js = 0;
          let css = 0;
          for (const ref of refs) {
            const taille = gz(readFileSync(join(root, ref.slice(1))));
            if (ref.endsWith(".js")) js += taille;
            else css += taille;
          }
          const enLigne = [...source.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].reduce(
            (somme, m) => somme + gz(Buffer.from(m[1])),
            0,
          );
          return [chemin.slice(root.length), gz(Buffer.from(source)), js, enLigne, css];
        })
        .sort((a, b) => String(a[0]).localeCompare(String(b[0])));
      console.log("page | html gz | js externe gz | js inline gz | css gz (octets)");
      for (const ligne of lignes) console.log(ligne.join(" | "));
    },
  },
});

export default defineConfig({
  // Domaine canonique, unique source des URL absolues (canonical, sitemap,
  // JSON-LD). provisoire, nom non definitif : les noms de domaine sont encore
  // libres au registre et le nom de l entreprise n est pas tranche.
  site: process.env.SITE ?? "https://www.pierretombale.ch",
  // /devis/ est une vraie page indexable depuis E4 passe 4 ; seule la page de
  // confirmation /devis/merci/ reste en noindex, donc hors du sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes("/devis/merci") }), poidsPages()],
  vite: {
    plugins: [tailwindcss()],
  },
});
