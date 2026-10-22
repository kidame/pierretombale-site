import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Domaine canonique, unique source des URL absolues (canonical, sitemap,
  // JSON-LD). provisoire, nom non definitif : les noms de domaine sont encore
  // libres au registre et le nom de l entreprise n est pas tranche.
  site: process.env.SITE ?? "https://www.pierretombale.ch",
  // /devis/ est une vraie page indexable depuis E4 passe 4 ; la page de
  // confirmation /devis/merci/ et les pages du configurateur /personnaliser/
  // sont en noindex, donc hors du sitemap. Le configurateur est une page mince
  // en v1 : son canonique renvoie vers la fiche du modele.
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/devis/merci") && !page.includes("/personnaliser/"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
