import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Domaine canonique, unique source des URL absolues (canonical, sitemap,
  // JSON-LD). provisoire, nom non definitif : les noms de domaine sont encore
  // libres au registre et le nom de l entreprise n est pas tranche.
  site: process.env.SITE ?? "https://www.pierretombale.ch",
  // La page devis est en noindex : elle n a rien a faire dans le sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes("/devis") })],
  vite: {
    plugins: [tailwindcss()],
  },
});
