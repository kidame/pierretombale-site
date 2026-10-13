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

## Apercu en ligne (demande de Thomas, 13.10.2026)
- Lien : https://pt-apercu-k7q2.netlify.app (projet Netlify "pt-apercu-k7q2", compte Netlify de Thomas,
  site id 4b456177-ffd3-42a8-bd14-bcc87aff0cb7). Public pour qui a le lien, non indexe.
- Ce n est PAS la production (prevue sur Cloudflare Pages en E7). On y publie une COPIE de dist :
  /home/kumo/atelier/tmp/apercu, a laquelle on ajoute `_headers` (X-Robots-Tag: noindex, nofollow),
  un robots.txt "Disallow: /" et un netlify.toml (publish = ".", pas de build). Ces 3 fichiers ne
  doivent jamais entrer dans le depot : ils bloqueraient l indexation du vrai site.
- Republier : build a jour, recopier dist dans tmp/apercu (+ les 3 fichiers), puis l outil Netlify
  "deploy-site" (connecteur Netlify) donne une commande npx a usage unique a lancer dans tmp/apercu.
  Ne jamais ecrire cette commande (elle contient un jeton temporaire) dans un fichier du depot.

## Plan de build (option securisee, decidee le 13.10.2026)
- [x] E1. Importer Atelier Ko (copie unique, MIT, commit 348433f du 17.08.2026), retirer panier et paiement, bouton "Demander un devis".
- [x] E2. Adapter le schema produit : granit, type de monument, style, tradition. 3 modeles fictifs.
      (passe A : schema metier et 12 fiches ; passe B : adresses SEO par famille.)
- [x] E3. `src/config/entreprise.ts` et `src/data/tarifs.json` a null, affichage "prix sur demande".
- [ ] E4. Pages : accueil, catalogue, fiche, Nos granits, contact/devis (formulaire sans envoi reel).
- [ ] E5. Configurateur Konva (ilot Preact) en prototype.
- [ ] E6. Envoi du devis vers webhook n8n + Turnstile (aucun secret dans le repo).
- [ ] E7. Deploiement Cloudflare Pages (acces a definir avant toute publication).

## Derniere session
- 13.10.2026, E4 PASSE 1 TERMINEE (Claude Code) : nettoyage du theme, nom, titres.
  Nom PROVISOIRE "PierreTombale.ch" dans `src/config/site.ts` (name, tagline, description,
  defaultTitle, commentaires en francais). `pageTitle()` passe au separateur " | " :
  "Page | PierreTombale.ch". A changer quand le nom sera tranche : `name` ici et `site` dans
  astro.config.mjs.
  Fiches : `titreFiche(nom, nature)` dans site.ts donne "<Nom> - pierre tombale en granit |
  PierreTombale.ch" (ou "monument cineraire" pour un cineraire), retire le nom du site au-dela
  de 60 signes, et si le nom du modele repete deja la nature ("Stele cineraire courbe avec
  vase") ne la redit pas. Meta description = shortDescription + " Prix indicatif et devis
  gratuit.", tronquee a 155. h1 inchange. Verifie : 18 titres uniques, aucun au-dela de 60.
  Pied de page : newsletter supprimee entierement (section, script, styles `.newsletter-field`
  de src/styles.css) ; colonnes Catalogue (les 2 familles) et Informations (L atelier, Demander
  un devis), aucun faux lien ; mention basse "(c) 2026 PierreTombale.ch" ; `id="studio"` retire
  du pied de page, il doublait celui de la page L atelier.
  Visuels : `git rm` des 3 photos de meubles et de public/og-image.png. Remplacees par
  `src/assets/visuel-provisoire.svg` (aplat de granit gris, grain en filtre SVG) avec la legende
  "Visuel provisoire" sur l accueil et sur L atelier. `public/favicon.svg` : monogramme "PT"
  en rectangles, pas de police embarquee.
  PAS D OG:IMAGE pour l instant : le PNG 1200x630 n a pas pu etre genere dans la session,
  `node` n est pas dans l allowlist de `.claude/settings.json` et ni ce fichier ni
  /home/kumo/atelier/tmp ne sont ouverts en ecriture a l agent. `socialImage` a donc disparu de
  site.ts, et BaseLayout n emet og:image / twitter:image que si la page fournit son propre
  visuel (les fiches le feront des qu elles auront des photos).
  A FAIRE : creer `public/og-image.png` (1200x630, fond gris pierre, texte "PierreTombale.ch")
  puis remettre `socialImage` dans site.ts. Un SVG ne suffit pas : les reseaux ne le lisent pas.
  Anglais : `src/pages/about.astro` entierement traduite (principes, chiffres, appel a l action,
  aria-label) ; commentaires de site.ts, SiteFooter, BaseLayout et index.astro passes au
  francais. Restent 4 commentaires anglais NON visibles, a traduire a l occasion :
  SiteHeader.astro:8, ProductCard.astro:8, 12 et 54. Corrige au passage sur l accueil :
  "conseil, gravure et pose comprises" -> "compris".
  `.parallax` (src/styles.css) n est plus utilise : les visuels provisoires sont des aplats.
  A remettre sur les vraies photos, ou a supprimer.
  Verifie : `npm run build` OK (18 pages), `npx astro check` 26 fichiers, 0 erreur,
  0 avertissement, 0 hint ; `grep -rli "Atelier K" dist` vide ; aucun renvoi vers
  atelier-hero / atelier-hands / atelier-workshop / og-image dans dist.
  Piege de session : les 4 suppressions de fichiers avaient ete indexees avant le premier
  commit, elles sont donc dans "nom provisoire et format des titres" et pas dans le commit des
  visuels (git reset est interdit par les permissions, l historique n a pas ete repris).
- 13.10.2026, E3 TERMINEE (Claude Code, docs finies par Claude chat : l agent a atteint 80 tours).
  `src/config/entreprise.ts` : coordonnees toutes a null, rien d affiche tant qu elles manquent.
  `src/data/tarifs.json` + `src/data/tarifs.ts` : fourchette par defaut 1'400 - 6'000 CHF (provisoire),
  affichee via prixAffiche(slug) avec "Prix indicatif, devis personnalise gratuit" ; pas d offre chiffree
  dans le JSON-LD tant que c est provisoire ; un slug inconnu dans tarifs.json fait echouer le build.
  Verifie dans dist : fiches et listes affichent la fourchette, aucune Offer, aucune coordonnee inventee.
  Restes du theme reperes pour E4 : nom "Atelier Ko" partout ; formulaire newsletter en anglais dans
  `src/components/SiteFooter.astro` (factice, n envoie rien) a supprimer.
  Changer un prix : dans `src/data/tarifs.json`, remplacer `null` du modele par {"des": 2400} ou
  {"min": 2400, "max": 3100}. Changer la fourchette generale : `fourchetteParDefaut`.
  Changer une coordonnee : remplir le champ dans `src/config/entreprise.ts`. Puis rebuild.
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
  Piege : `npm run format` (prettier) reformate tout le depot, y compris les documents de `docs/`,
  `analyses/` et le production-spec JSON genere par W6. Le code de `src/` etait deja conforme ; le reste
  a ete remis dans l etat d origine. Ne lancer prettier que sur un chemin precis, par exemple
  `npx prettier --write src`.
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
E4 PASSE 2 : accueil et page "L atelier" (service complet : conseil, commande, pose,
apres-vente). La page L atelier est aujourd hui une traduction du theme, pas le vrai contenu.
Ensuite, toujours en passes courtes (l agent consomme vite ses 80 tours) :
- passe 3 : page prix-pierre-tombale-suisse et page Nos granits (depuis granits.json) ;
- passe 4 : contact/devis (formulaire sans envoi reel, E6 branchera n8n).
Source : docs/production-spec-pierretombalech.json (pages, meta, FAQ, maillage) et analyses/ (section 5).
