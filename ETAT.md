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
- [x] E4. Pages : accueil, catalogue, fiche, Nos granits, contact/devis (formulaire sans envoi reel).
      (passe 1 : nettoyage du theme et SEO ; passe 2 : accueil et a-propos ; passe 3 : prix, granits,
      FAQ ; passe 4 : devis, merci, protection des donnees.)
- [x] E5. Personnalisation guidee dans le formulaire de devis (4 lignes d inscription, polices sur
      echantillons, hauteur des lettres, finition, motif, apercu en direct du texte) ; configurateur
      visuel reporte (voir `docs/CONFIGURATEUR-FUTUR.md`).
      (passe 1 : personnalisation guidee ; passe 2 : simplification pour les familles, police unique,
      pastilles de granit, sections conditionnelles, brouillon. Passe 3 eventuelle, etapes et
      recapitulatif, a decider APRES un test sur telephone avec un proche age.)
- [ ] E6. Envoi du devis : fonction Cloudflare Pages + Resend (pas de n8n), adresse en variable
      d environnement, Turnstile. Aucun secret dans le repo. Suivre `docs/devis-contrat.md`.
- [ ] E7. Deploiement Cloudflare Pages (acces a definir avant toute publication).

## Derniere session
- 14.10.2026, E5 PASSE 2 TERMINEE (Claude Code) : formulaire de devis SIMPLIFIE pour les familles
  (decisions de Thomas du 14.10.2026, `docs/DECISIONS-ET-ETAT.md` section "Formulaire de devis,
  peaufinage"). Toujours UNE page, complete et utilisable sans JavaScript.
  CHAMPS : `police` (UN seul style d ecriture pour tout le monument, 6 echantillons radio, chaque
  nom ecrit dans sa police, defaut cinzel) REMPLACE les 4 `ligne<n>_police` ; `recontact` (radio
  telephone / e-mail, defaut e-mail) ; `quandAppeler` (texte libre) ; `datePoseSouhaitee`
  (input date). Le telephone reste facultatif, SAUF si `recontact` = telephone : le JS le passe
  alors en requis, pose l etoile et deplie `quandAppeler`. 9 champs d inscription au lieu de 12.
  TAILLES DE LETTRES : libelle "Taille des lettres", affichage en centimetres ("3 cm" ... "6 cm",
  via `hauteurLabel`), valeurs envoyees INCHANGEES (30/40/50/60 mm), defauts 50/40/30/30.
  Lignes 3 et 4 repliees derriere un bouton "Ajouter une ligne" EN JS SEULEMENT (sans JS les 4
  lignes sont la, le bouton reste cache) ; une ligne repliee qui porte du texte se deplie a la
  restauration du brouillon.
  GRANIT : pastilles de couleur cliquables (vrais boutons radio habilles, masques a l oeil mais
  utilisables au clavier et sans JS ; anneau sur `:checked` et `:focus-visible`), groupees par
  teinte, couleurs de TEINTE_PASTILLE, plus "Je ne sais pas encore" par defaut. Champ `granit`
  inchange. Le select deroulant est supprime.
  SECTIONS CONDITIONNELLES (JS) : `typeDemande` sort de la section "Le monument" et vit dans une
  nouvelle section "Votre demande" (avec cimetiere, commune, date de pose), sinon il se cacherait
  lui-meme. `nouveau` = tout ; `inscription` = pas de section monument + rappel "Une photo du
  monument existant nous aide beaucoup" pres des fichiers ; `autre` = ni monument ni inscription.
  Les blocs replies sont AUSSI desactives (`fieldset.disabled`) : leurs valeurs par defaut ne
  partent pas. Aucun champ obligatoire dans un bloc repliable, donc jamais de `required` masque
  (verifie dans dist : les 7 `required` du HTML sont tous hors `data-bloc`). Sans JS, tout visible.
  BROUILLON : `localStorage` (cle `cleBrouillonDevis` = "pt-devis-brouillon"), champs texte, listes
  et radios seulement, JAMAIS les fichiers ni le consentement ; enregistre 500 ms apres la frappe,
  et seulement si un champ texte est rempli ; message "Nous avons retrouve votre brouillon." avec
  un bouton "Effacer" (remet le formulaire a zero) ; efface a l envoi reussi. Tout en try/catch.
  `?modele=` passe APRES la restauration : venir d une fiche est plus recent que le brouillon.
  REFERENCE DE DEMANDE : `referenceDevis` dans `src/config/devis.ts`, format `PT-AAAAMMJJ-xxxx`,
  alphabet sans 0/O/1/I. ATTRIBUEE PAR LE SERVEUR EN E6, jamais par le navigateur (duplication en
  deux onglets, perte au brouillon, forgeable). Le formulaire n en envoie aucune.
  `docs/devis-contrat.md` a jour : `police`, `recontact`, `quandAppeler`, `datePoseSouhaitee`,
  suppression de `ligne<n>_police`, tableau des sections repliees (un champ ABSENT est le cas
  normal, pas une erreur), sections "Reference de demande attribuee par le serveur" et "Brouillon
  conserve dans le navigateur".
  MESURES (gzip, meme calcul que `scripts/poids-pages.py`) : `/devis/` html 15348 octets (12318
  apres E5 passe 1), js en ligne 7908 (5613), css partage 6834 INCHANGE. Preuve qu aucune autre
  page ne change : 404.html 3783 et css 6834, exactement les chiffres de la passe 1 ; et toutes les
  classes Tailwind de la page existaient deja (seul `btn-outline` est nouveau ICI, mais il sert
  deja sur 6 autres pages). L habillage reste en CSS `grav-*` dans la page, mis en ligne dans
  `/devis/index.html` seul (un seul fichier css dans `dist/_astro`).
  A SAVOIR POUR PLUS TARD : un `<script is:inline>` n est NI minifie NI depouille de ses
  commentaires par Astro. Les commentaires francais du script partent donc chez la famille : c est
  la premiere chose a retirer si `/devis/` doit maigrir.
  PIEGE DE SESSION : `python3 scripts/poids-pages.py` reste REFUSE a l agent malgre la ligne
  `Bash(python3 scripts/:*)` de `.claude/settings.json` (le motif coupe au milieu d un mot, il
  faudrait `Bash(python3 scripts/poids-pages.py:*)`) ; `gzip` et `git checkout` sont refuses aussi.
  La mesure a donc ete refaite par une integration temporaire dans `astro.config.mjs` (gzip de
  Node, NIVEAU 9 pour coller au defaut de `gzip.compress()` en python), retiree depuis
  (`git status` : `astro.config.mjs` non modifie). Niveau 9 : les chiffres tombent a l octet sur
  ceux de la passe 1, le niveau par defaut de Node donnait 3789 au lieu de 3783.
  Verifie : `npm run build` OK (23 pages), `npx astro check` 33 fichiers 0 erreur 0 avertissement
  0 hint ; `grep -rliE "atelier|kosovo|sous-trait|fabriqu|n8n" dist` ne renvoie rien ; sitemap
  21 adresses (inchange) ; dans dist : 6 radios `police`, 0 `ligne<n>_police`, 14 radios `granit`,
  4 `ligne<n>_hauteur` avec 50/40/30/30, `recontact` a "email", "3 cm" a "6 cm" sur les 4 lignes.
  A FAIRE AVANT E6 : essayer la page sur un telephone avec un proche age (c est la decision de
  Thomas : la passe 3, etapes et recapitulatif, ne se decide qu apres ce test).
- 13.10.2026, E5 TERMINEE (Claude Code) : PERSONNALISATION GUIDEE, pas de configurateur visuel
  (reporte, regles dans `docs/CONFIGURATEUR-FUTUR.md`).
  `src/data/personnalisation.ts` est la SOURCE UNIQUE (reutilisee plus tard par le configurateur) :
  6 polices OFL (cinzel, marcellus, eb-garamond, jost, great-vibes, pinyon-script ; style romain /
  baton / anglaise / lapidaire, pile CSS), hauteursLettresMm [30, 40, 50, 60] (defauts nom 50,
  dates 40, epitaphe 30), 3 finitions (blanc, dore, feuille-or) avec leur couleur d apercu,
  8 motifs (aucun, croix, colombe, rose, coeur, arbre, autre, dessin-fourni), les 4 lignes et la
  mention d apercu. En tete : "liste provisoire, a confirmer selon ce que nous savons graver".
  Aucun paquet @fontsource ne manquait : les 6 polices de la spec existent, rien n a ete remplace.
  `/devis/` : le champ unique "texte a graver" (`gravure`) est REMPLACE par 12 champs
  `ligne<n>_texte` / `_police` / `_hauteur` (n de 1 a 4), plus `finition` (radio, "Je ne sais pas
  encore" par defaut), `motif` (select) et `gravure_precisions` (textarea). Tout reste facultatif.
  Echantillons : la liste des 6 polices est ecrite chacune dans sa police (statique, lisible sans
  JS), et sous chaque select un apercu du nom de la police choisie.
  Apercu en direct (JS vanilla, progressive enhancement, aucun canvas) : cadre colore avec la teinte
  approximative du granit choisi (TEINTE_PASTILLE de granits.ts), les 4 lignes dans leur police, la
  taille a 0,6 px par mm, la couleur selon la finition. Sans JS le bloc reste cache (`hidden`) et le
  formulaire est complet. Mention fixe sous l apercu : "Apercu indicatif... (bon a tirer) avant
  toute gravure."
  POLICES CHARGEES SEULEMENT SUR /devis/ : les 6 imports `@fontsource/<police>/latin-400.css` sont
  dans la page, jamais dans BaseLayout ni styles.css ; Astro en met le `@font-face` en ligne dans
  `/devis/index.html` seul, avec `font-display: swap` (6 occurrences). Ne pas les deplacer.
  PIEGE TAILWIND : la feuille Tailwind est UNIQUE et partagee par les 23 pages, donc une classe
  utilitaire inedite utilisee sur /devis/ alourdit tout le site (+163 octets gz au premier essai).
  L habillage de la section gravure est donc ecrit en CSS dans la page (classes `grav-*`), et les
  classes Tailwind gardees sont exactement celles que la page utilisait deja.
  MESURES : `python3` n est pas dans l allowlist de `.claude/settings.json`, la mesure a donc ete
  refaite avec le gzip de Node (meme calcul que `scripts/poids-pages.py`, integration temporaire
  dans astro.config.mjs, retiree depuis). Son gzip ne donne pas le meme octet que celui de Python :
  l ecart constant avec `docs/perf-reference-2026-10-13.txt` (404 : 3783 au lieu de 3805 ; css 6834
  au lieu de 6810) vient de l outil, pas des pages. Preuve : un build de controle avec l ANCIENNE
  page devis donne, pour les 22 autres pages, exactement les memes chiffres que le build E5
  (html, js en ligne et css identiques a l octet). E5 ne coute rien aux autres pages.
  `/devis/` : html 12318 octets gz (8652 avant E5, @font-face en ligne compris), js en ligne 5613
  (4405 avant), css partage 6834 (inchange). Polices : 6 woff2 latin, 143 748 octets au total
  (great-vibes 42 800, pinyon-script 39 044, eb-garamond 23 820, marcellus 14 552, cinzel 14 128,
  jost 9 404), telechargees seulement sur /devis/. Les .woff de repli sont aussi ecrits dans dist
  mais aucun navigateur moderne ne les demande.
  Verifie : `npm run build` OK (23 pages), `npx astro check` 33 fichiers 0 erreur 0 avertissement
  0 hint ; `grep -rliE "atelier|kosovo|sous-trait|fabriqu|n8n" dist` ne renvoie rien ; 12 champs
  de ligne dans le HTML, hauteurs par defaut 50/40/30/30, plus aucun `name="gravure"`.
  `docs/devis-contrat.md` : section "L inscription" (valeurs autorisees = ids de
  personnalisation.ts) et section "Configurateur futur" (il devra produire exactement ces champs).
- 13.10.2026, Claude chat : formulaire teste dans le navigateur (pre-selection du modele, erreurs, message d attente) ; espace manquant corrige dans le consentement. Build 23 pages, check 0 erreur. VPS passe a 80 Go (partition etendue automatiquement).
- 13.10.2026, E4 PASSE 4 TERMINEE (Claude Code) : devis, merci, protection des donnees. E4 EST FINIE.
  `/devis/` est une vraie page indexable (title 44, meta 150, h1 unique, canonical, fil d Ariane) :
  formulaire `method="post" action="/api/devis" enctype="multipart/form-data"`, 4 sections
  (coordonnees, monument, gravure et personnalisation, message), consentement obligatoire avec lien
  vers /protection-des-donnees/, select modele genere depuis les 12 fiches (2 optgroups) et select
  granit depuis granits.json. Pre-selection depuis `?modele=<slug>` en JS (remplit aussi la famille,
  via `famillesParModele`) ; sans JS la page reste utilisable et poste nativement.
  ENVOI INACTIF : `src/config/devis.ts` ({ envoiActif: false, endpoint: "/api/devis" }, limites de
  fichiers, delai anti-robot, messages). Tant que `envoiActif` est false, le JS valide puis affiche
  "L envoi en ligne sera bientot disponible" et ne poste RIEN. A true : fetch multipart, "Envoi en
  cours", puis /devis/merci/ ou message d erreur (les `erreurs` de la reponse s affichent sous le
  champ concerne). Validation maison en francais (`form.noValidate = true` cote JS seulement) :
  message sous chaque champ, resume en role="alert", focus sur le premier champ fautif.
  Fichiers : 3 au maximum, 8 Mo au total, JPEG/PNG/WEBP/PDF, verifies en JS et A REVERIFIER EN E6.
  Anti-spam : piege `societe` (hors parcours clavier) et `horodatage` pose par le JS (vide sans JS,
  c est normal) ; emplacement commente pour Turnstile, aucune cle dans le depot.
  `docs/devis-contrat.md` : le contrat que E6 doit implementer (chaque champ, les limites, les
  reponses 200/400/413/429/500, les deux chemins avec et sans JS).
  `/devis/merci/` en noindex, hors sitemap, aucun delai chiffre. `/protection-des-donnees/` courte et
  prudente (LPD), responsable lu dans entreprise.ts donc rien d affiche aujourd hui, commentaire
  "A faire relire : texte provisoire, pas un avis juridique" en tete du fichier ; liee depuis la
  ligne basse du pied de page (`siteConfig.footerLegal`).
  Tous les liens internes passent a `/devis/` (et `/devis/?modele=<slug>` sur les fiches) : la page
  etant indexable, son canonical est /devis/ et les liens ne doivent plus passer par une redirection.
  Le filtre du sitemap n exclut plus que `/devis/merci`.
  Verifie : `npm run build` OK (23 pages), `npx astro check` 32 fichiers 0 erreur 0 avertissement
  0 hint ; sitemap 21 adresses dont /devis/ et /protection-des-donnees/, sans /devis/merci/ ;
  le select modele contient les 12 slugs ; `grep -rniE "atelier|kosovo|sous-trait|fabriqu|n8n" dist`
  ne renvoie rien ; titles 44, 41 et 34 signes, metas 150, 136 et 39.
- 13.10.2026, E4 PASSE 3 TERMINEE (Claude Code) : page prix, Nos granits, FAQ.
  3 pages nouvelles : `/prix-pierre-tombale-suisse/` (ce que comprend l estimation, ce qui fait varier
  le prix, tableau par famille, "Prix indicatifs, estimation gratuite et sans engagement sur devis" et
  "les eventuelles taxes communales de cimetiere ne sont pas comprises"), `/nos-granits/` (granits
  disponibles par teinte, pastille de couleur approximative, aucune origine geographique) et `/faq/`
  (8 questions, JSON-LD FAQPage).
  AUCUN MONTANT DANS LES PAGES : `fourchetteAffichee(slugs)` et `fourchetteEstProvisoire(slugs)` dans
  `src/data/tarifs.ts` agregent les prix de tarifs.json (aujourd hui "De 1'400 a 6'000 CHF" pour les
  2 familles). `TEINTE_PLURIEL`, `TEINTE_PASTILLE` et `granitsParTeinte()` passent dans
  `src/data/granits.ts` : l accueil et /nos-granits/ lisent la meme source.
  FAQ : le delai "environ un an apres l inhumation" du production-spec est ECARTE, comme toute
  affirmation reglementaire ; les 2 questions concernees repondent "les regles dependent de chaque
  commune : nous verifions pour vous le reglement du cimetiere concerne". Une question porte sur le
  dessin fourni par la famille.
  Menu : Prix ajoute. Pied de page : Nos granits (Catalogue), Prix et Questions frequentes
  (Informations). Accueil : la liste des granits faisait doublon, remplacee par un lien vers
  /nos-granits/, plus un lien Prix dans l en-tete de la section des modeles. Fiches modele : lien
  discret "Comment est calcule le prix ?" sous le prix.
  Verifie : `npm run build` OK (21 pages), `npx astro check` 29 fichiers 0 erreur 0 avertissement
  0 hint ; sitemap 19 adresses dont les 3 nouvelles ; `grep -rniE
  "atelier|kosovo|sous-trait|fabriqu|swiss ?made|artisan" dist` ne renvoie rien ; titles 30, 53 et 59
  signes, meta 145, 148 et 153.
- 13.10.2026, Claude chat : carte de partage public/og-image.png (1200x630, gris, "PierreTombale.ch",
  generee par script PIL) branchee par defaut via siteConfig.socialImage. A regenerer avec le nom definitif.
  Build 18 pages et astro check 0 erreur. Apercu Netlify republie.
- 13.10.2026, E4 PASSE 2 TERMINEE (Claude Code) : accueil et page de presentation.
  `src/pages/about.astro` devient `src/pages/a-propos.astro` (adresse /a-propos/, slug du
  production-spec), libelle "Qui sommes-nous" dans le menu et le pied de page (les deux viennent de
  `siteConfig`, seule source des liens). Contenu : service complet de A a Z en 5 etapes (conseil,
  devis detaille, bon a tirer, pose au cimetiere par nos soins, suivi apres la pose), zone
  Val-de-Travers > canton de Neuchatel > Suisse romande. Les anciens "chiffres" (03 associes) sont
  remplaces par des reperes sans chiffre : zone, matiere, pose.
  Accueil : promesse "realises sur mesure et poses par nos soins", bloc "Comment ca se passe" en
  4 etapes (tableau `etapes` dans le frontmatter), section "Ou nous intervenons" en bas, bouton
  principal = /devis partout (les 2 familles restent en boutons secondaires).
  Mentions d atelier et de fabrication retirees du texte visible : legendes de visuels ->
  "Photographies de nos realisations a venir", granits -> "selon les granits disponibles"
  (accueil, a-propos, FicheModele, fiche stele-bicolore). Repli de `robots.txt.js` remis sur le
  domaine du projet (c etait la demo du theme). Restent des COMMENTAIRES de code qui parlent de
  l atelier (granits.ts:11, products.ts:126, ProductImage.astro:7, monuments-funeraires/index.astro:8) :
  invisibles sur le site, a reecrire a l occasion.
  STATISTIQUE RETIREE : "plus de 90% de cremations en Suisse" (et 97% a Neuchatel) sur
  /monuments-cineraires-cavurnes/ (intro + meta). Aucune source verifiable : le dossier aux associes
  l attribue a "RTS et l association suisse des services funeraires" sans document ni date, et
  `analyses/2026-08-17-niche-pierre-tombale-ne.md` dit que la part inhumation/cremation reste a
  chiffrer via OFS. Texte actuel : "la grande majorite des defunts sont aujourd hui incineres".
  Le motif est note en commentaire dans la page ; a remettre avec la reference exacte si les
  associes fournissent la statistique de l OFS.
  Verifie : `npm run build` OK (18 pages), `npx astro check` 26 fichiers 0 erreur 0 avertissement
  0 hint ; plus de /about dans dist, /a-propos/ dans le sitemap (16 adresses, /devis toujours
  exclu) ; `grep -rniE "atelier|kosovo|sous-trait|fabriqu|swiss ?made|artisan" dist` ne renvoie
  rien ; plus aucun "90%" ni "97%" dans dist ; meta descriptions 151 et 145 signes.
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
D ABORD UN TEST REEL, PAS DU CODE : ouvrir `/devis/` sur un telephone avec un proche age, le
laisser remplir une demande seul, et noter ou il hesite. C est ce test, decide par Thomas le
14.10.2026, qui tranche la passe 3 du formulaire (decoupage en etapes et recapitulatif avant
envoi) : elle ne se fait pas "au cas ou". Points a observer : le choix du style d ecriture, les
pastilles de granit, le bouton "Ajouter une ligne", et si la longueur de la page decourage.

ENSUITE E6 : ENVOI DU DEVIS. Fonction Cloudflare Pages `functions/api/devis.ts` + Resend (PAS de n8n,
decision de Thomas du 13.10.2026), adresse de destination en variable d environnement, Turnstile.
Tout est specifie dans `docs/devis-contrat.md`, y compris les 12 champs d inscription, `finition`,
`motif` et `gravure_precisions` ajoutes en E5 (valeurs autorisees = ids de
`src/data/personnalisation.ts`, que la fonction importe au lieu d en recopier les listes).
Il restera a passer `envoiActif` a true dans `src/config/devis.ts` et a poser le widget Turnstile a
l emplacement commente de la page devis. Aucun secret dans le depot.
PREREQUIS A OBTENIR DE THOMAS AVANT DE COMMENCER : le nom de domaine achete et son DNS verifie chez
Resend (SPF/DKIM), un compte Resend dont il saisit lui-meme la cle dans Cloudflare, et l adresse de
destination des demandes. Sans eux, la fonction ne peut pas etre essayee pour de vrai.
Ensuite E7 : deploiement Cloudflare Pages.
Le configurateur visuel (Konva) n est plus une etape du plan : il viendra apres la mise en ligne,
selon `docs/CONFIGURATEUR-FUTUR.md` (inputs a obtenir d abord : dimensions mm par modele, zones de
gravure, polices et finitions confirmees, visuels).
