# ETAT.md : relais entre sessions

Ce fichier permet de reprendre le travail avec Claude ou avec ChatGPT/Codex, sans perte.
Regle : chaque session le lit en premier et le met a jour en dernier, puis commit local.
`docs/DECISIONS-ET-ETAT.md` garde les decisions business ; ce fichier garde l avancement du build.

## Protocole de relais
Le travail se fait dans la copie locale du VPS : /home/kumo/atelier/repos/pierretombale-site.
GitHub n intervient pas dans le developpement ni dans le relais (push seulement comme sauvegarde, sur demande de Thomas).
Acces : Claude et ChatGPT passent chacun par leur connecteur VPS, prefixe kumo, meme dossier.
1. Debut : lire `AGENTS.md`, ce fichier, puis `git log --oneline -10` et `git status`.
2. Travail : un commit local par etape, message en francais, ASCII.
3. Fin : remplir "Derniere session" et "Prochaine etape", commit local.
4. Ne jamais laisser de travail non commite : l agent suivant ne saurait pas d ou il vient.

## Plan de build (option securisee, decidee le 13.10.2026)
- [x] E1. Importer Atelier Ko (copie unique, MIT, commit 348433f du 17.08.2026), retirer panier et paiement, bouton "Demander un devis".
- [x] E2. Adapter le schema produit : granit, type de monument, style, tradition. 3 modeles fictifs.
      (passe A : schema metier et 12 fiches ; passe B : adresses SEO par famille.)
- [ ] E3. `src/config/entreprise.ts` et `src/data/tarifs.json` a null, affichage "prix sur demande".
- [ ] E4. Pages : accueil, catalogue, fiche, Nos granits, contact/devis (formulaire sans envoi reel).
- [ ] E5. Configurateur Konva (ilot Preact) en prototype.
- [ ] E6. Envoi du devis vers webhook n8n + Turnstile (aucun secret dans le repo).
- [ ] E7. Deploiement Cloudflare Pages (acces a definir avant toute publication).

## Derniere session
- 13.10.2026, E2 passe B TERMINEE (Claude Code) : les adresses SEO.
  Nouvelles adresses : `/monuments-funeraires/` et `/monuments-cineraires-cavurnes/` (une page liste
  par famille, filtre gamme seulement, tri ordre du catalogue ou nom), `/monuments-funeraires/<slug>/`
  et `/monuments-cineraires-cavurnes/<slug>/` pour les fiches. Chaque `[slug].astro` ne genere que les
  modeles de sa famille : un modele n a qu une seule adresse.
  `src/pages/catalog.astro` et `src/pages/products/` supprimes (site pas en ligne, pas de redirection).
  Factorisation : `src/components/ListeModeles.astro` (filtre, tri, compteur, grille),
  `src/components/PageFamille.astro` (en-tete, intro en slot, fil d Ariane, liste) et
  `src/components/FicheModele.astro` (l ancienne fiche produit). `productUrl(product)` et
  `familleUrl(famille)` dans `src/data/products.ts` : tous les liens de modele passent par la, y compris
  ProductCard, SiteHeader, menu mobile, accueil, 404 et about. Le lien devis reste `/devis?modele=<slug>`.
  `FAMILLE_LABELS` devient "Monuments funeraires" et "Monuments cineraires et cavurnes" (fil d Ariane,
  pied de page, ligne Famille des fiches). Menu : Monuments funeraires, Monuments cineraires, L atelier,
  Demander un devis ; libelles accentues, chrome du menu et `lang="fr"` au passage.
  SEO : title unique par page (47 caracteres au plus) et meta description (154 au plus, coupee sur un mot
  entier par `tronque`), un seul h1 par page, canonical partout, JSON-LD BreadcrumbList
  (Accueil > famille > modele) et Product sans offre chiffree sur les fiches, alt sur toutes les images.
  Titres et descriptions des 2 pages liste raccourcis depuis `docs/production-spec-pierretombalech.json` :
  le marbre, les prix affiches et le telephone du production-spec sont ecartes (granit seul, tarifs en E3,
  coordonnees provisoires).
  `astro.config.mjs` : `site` pointait encore sur la demo d Atelier Ko ; remis sur
  **https://www.pierretombale.ch, provisoire, nom non definitif** (le nom de l entreprise et le domaine
  ne sont pas tranches, cf. `docs/DECISIONS-ET-ETAT.md`). A corriger des que le nom est choisi : c est la
  seule source des URL absolues (canonical, sitemap, JSON-LD). Le sitemap exclut desormais `/devis`,
  qui est en noindex.
  Verifie : `npm run build` OK, 18 pages (accueil, about, devis, 2 pages liste, 12 fiches, 404,
  robots.txt, sitemap) ; `npx astro check` : 24 fichiers, 0 erreur, 0 avertissement, 0 hint (le hint de
  la passe A a disparu avec l ancienne fiche) ; `grep -rl "/catalog\|/products/" dist` et le meme grep
  sur `src` ne renvoient rien ; le sitemap liste 16 adresses, dont les 2 pages liste et les 12 fiches.
  Visuels : Thomas generera des images par IA plus tard ; il suffira de les mettre dans `src/assets` et
  de les lister dans `images:` de la fiche.
- 13.10.2026, E2 passe A TERMINEE (Claude Code). Les trois derniers fichiers qui utilisaient les
  anciens champs d Atelier Ko (price, material, category, formatPrice) sont passes au schema metier :
  `SiteHeader.astro` (plus de prix : "Prix sur demande", visuel via ProductImage),
  `index.astro` (chiffres du catalogue, modele mis en avant par famille/gamme/granit presente,
  section granits regroupes par teinte, textes en francais), `catalog.astro` (filtres famille et
  gamme, tri ordre du catalogue ou nom, data-attributes et script adaptes).
  `getProductFilters` remplace par les listes fixes `FAMILLES` et `GAMMES` dans `src/data/products.ts`
  (une gamme sans modele reste proposee) ; `formatPrice` avait deja disparu en passe A precedente.
  `siteConfig.featured` pointait encore sur les modeles supprimes d Atelier Ko : remis sur
  stele-doucine-classique, stele-arrondie, stele-cineraire-droite (grille), monument-avec-jardiniere
  (solo), stele-coeur (menu mobile), sinon le build echouait.
  Verifie : `npm run build` OK, 17 pages (accueil, about, catalog, devis, 12 fiches produit, 404,
  robots.txt, sitemap) ; `npx astro check` : 18 fichiers, 0 erreur, 0 avertissement, 1 hint
  (interface `Props` de `products/[slug].astro`, utilisee par Astro : faux positif).
  L adresse /catalog est inchangee, les adresses SEO sont la passe B.
- 13.10.2026, Claude chat : inventaire des 27 captures produits de l associe (toutes de
  granitsmaffre.com) dans `docs/references/2026-10-13-captures-maffre-produits.md`. Images
  hors depot. Ne jamais publier les images ni les noms Maffre. 4 questions ouvertes aux associes.
- 13.10.2026, E1 TERMINEE. L import d Atelier Ko (MIT, commit 348433f) a ete fait par Claude chat
  via le connecteur VPS, l agent Claude Code n ayant pas acces a `/home/kumo/atelier/tmp/atelier-ko`.
  Panier retire entierement (CartDrawer, page cart, bloc localStorage, references) : `grep -riE
  "cart|checkout|AtelierCart" src public` ne renvoie plus rien. Fiche produit : bouton d achat
  remplace par un lien vers `/devis?modele=<slug>`, page `src/pages/devis.astro` provisoire (noindex).
  Verifie le 13.10.2026 : `npm ci` 316 paquets (9 vulnerabilites signalees, non traitees),
  `npm run build` OK, 11 pages generees (accueil, about, catalog, devis, 6 fiches produit, 404,
  robots.txt, sitemap), aucun avertissement ; `npx astro check` : 16 fichiers, 0 erreur, 0 avertissement, 0 hint.
  Permissions de l agent fixees dans `.claude/settings.json` (git local, npm, lecture autorises ;
  push, pull, fetch, changement de branche, reset interdits) et confiance du dossier accordee.
- 13.10.2026, Claude (1re session) : creation du relais (AGENTS.md commun, CLAUDE.md pointe dessus,
  ce fichier).
  Inspection d Atelier Ko : panier = `src/components/CartDrawer.astro`, `src/pages/cart.astro`,
  bloc localStorage "atelier-ko-cart" et tiroir dans `src/layouts/BaseLayout.astro`, references dans
  `SiteHeader.astro`, `src/pages/products/[slug].astro`, `src/config/site.ts`, `src/styles.css`.

## Prochaine etape
E3 : coordonnees et prix dans un seul fichier chacun.
- `src/config/entreprise.ts` : nom, telephone, adresse, NPA, email, horaires a `null` tant que les
  associes ne les ont pas fournis. Les valeurs du production-spec sont provisoires : ne pas les
  recopier. L affichage doit se taire proprement quand une valeur est `null`.
- `src/data/tarifs.json` : un prix par modele (cle = slug de la fiche), `null` partout au depart.
- L affichage "prix sur demande" doit etre pilote par `tarifs.json` : prix si connu, sinon
  `PRIX_SUR_DEMANDE` (aujourd hui en dur dans `src/data/products.ts`, utilise par ProductCard, les
  fiches, le menu mobile et l accueil). Aucun prix ailleurs dans le code.
- `src/config/site.ts` garde encore le nom, la tagline et les textes d Atelier Ko (en anglais) :
  c est la que `entreprise.ts` prendra le relais ; les titres de pages passent par `pageTitle`.
Rappels : la gamme prestige n a encore aucun modele (filtre propose, liste vide) ; le domaine
`https://www.pierretombale.ch` dans `astro.config.mjs` est provisoire, nom non definitif ; la page
`about` est encore le texte anglais d Atelier Ko (E4).
