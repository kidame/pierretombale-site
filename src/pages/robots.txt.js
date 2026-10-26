export function GET({ site }) {
  // Repli si `site` manque dans astro.config.mjs : le domaine provisoire du
  // projet, jamais la demo du theme d origine.
  const baseUrl = site ?? new URL("https://www.pierretombale.ch");
  const sitemapUrl = new URL("/sitemap-index.xml", baseUrl);
  // Le sitemap des images (src/pages/sitemap-images.xml.ts) : les visuels de
  // chaque fiche et les photos de matieres, pour Google Images.
  const sitemapImages = new URL("/sitemap-images.xml", baseUrl);

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\nSitemap: ${sitemapImages.href}\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
