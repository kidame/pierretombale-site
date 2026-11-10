# Audit Lighthouse des neuf fiches cimetiere - 10 novembre 2026

Premiere mesure Lighthouse reelle de ce site sur le VPS. Elle fait suite a la
generalisation de la composition V2 aux neuf fiches
(`docs/UX-CIMETIERES-GENERALISATION.md`, commits afbb11b et 0a91623), dont la
section performance disait : "Lighthouse n'est pas installe sur cette machine
et n'a pas ete installe : performance non mesuree par Lighthouse". Cette
limite est levee.

Rien n'a ete pousse ni mis en ligne par cette session : tout est local, sur
`main`.

## Conditions de mesure

- **Lighthouse 13.6.0**, installe hors depot dans
  `/home/kumo/atelier/outils/lighthouse` (189 Mo). **Aucune dependance
  ajoutee au site** : ni `package.json`, ni `node_modules` du depot.
- **Navigateur** : le Chrome deja isole de l'atelier
  (`chrome-headless-shell` 155.0.8059.39, unite systemd `kumo-browser`
  plafonnee a 850 Mo, domaines autorises `127.0.0.1,localhost`). Lighthouse
  s'y connecte par son port CDP existant (`lighthouse --port=<port>`) : il n'a
  pas lance son propre navigateur, et aucun navigateur externe n'a ete
  utilise.
- **Pages mesurees** : le build de production reel, pas l'apercu autonome
  `cimetieres-maquettes.html` (qui porte un `noindex,nofollow` propre a
  l'export et fausserait le SEO).
- **Build** : `SITE=https://www.pierretombale.ch npm run build`, 75 pages.
  L'export temporaire a disparu de `dist` par ce rebuild. Aucune variable de
  devis touchee.
- **Serveur** : `astro preview` sur `http://127.0.0.1:8731`, localhost
  seulement.
- **Profil mobile** (defaut Lighthouse) : Moto G Power (2022) emule, 412 x 823
  a 1,75x, bridage simule 1 638 kbit/s, RTT 150 ms, processeur divise par 4.
- **Profil ordinateur** (`--preset=desktop`) : 1 350 x 940, 10 240 kbit/s,
  RTT 40 ms, pas de bridage processeur.
- **Indice de reference de la machine** (benchmarkIndex) : 3 119. Les series
  ont ete lancees sequentiellement, une page a la fois.
- Categories mesurees : performance, accessibilite, bonnes pratiques, SEO.

## Resultats apres correction

Neuf fiches en mobile, trois variantes en ordinateur (Corcelles la page
validee, Beauregard la plus chargee, Val-de-Travers sans adresse ni vue de
hauteur).

### Mobile

| Fiche | Perf | A11y | BP | SEO | LCP | CLS | TBT | Poids |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Beauregard (Neuchatel) | 100 | 100 | 100 | 100 | 1,06 s | 0 | 0 ms | 103 Kio |
| La Chaux-de-Fonds | 100 | 100 | 100 | 100 | 1,06 s | 0 | 0 ms | 100 Kio |
| Peseux | 100 | 100 | 100 | 100 | 1,66 s | 0 | 0 ms | 101 Kio |
| Corcelles-Cormondreche | 100 | 100 | 100 | 100 | 1,05 s | 0 | 0 ms | 101 Kio |
| Le Landeron | 100 | 100 | 100 | 100 | 0,91 s | 0 | 0 ms | 99 Kio |
| Boudry | 100 | 100 | 100 | 100 | 1,05 s | 0 | 0 ms | 99 Kio |
| Cortaillod | 100 | 100 | 100 | 100 | 1,06 s | 0 | 0 ms | 99 Kio |
| Le Locle | 100 | 100 | 100 | 100 | 1,05 s | 0 | 0 ms | 100 Kio |
| Val-de-Travers | 100 | 100 | 100 | 100 | 1,66 s | 0 | 0 ms | 100 Kio |

### Ordinateur

| Fiche | Perf | A11y | BP | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Corcelles-Cormondreche | 100 | 100 | 100 | 100 | 0,29 s | 0 | 0 ms |
| Beauregard (Neuchatel) | 100 | 100 | 100 | 100 | 0,29 s | 0 | 0 ms |
| Val-de-Travers | 100 | 100 | 100 | 100 | 0,29 s | 0 | 0 ms |

Aucun decalage de mise en page (CLS 0) et aucune tache longue (TBT 0 ms) sur
les douze mesures : les quatre scripts `is:inline` des fiches ne coutent rien
de mesurable. Trois polices (74 Ko) et deux feuilles CSS (12,3 Ko) composent
l'essentiel des 99 a 103 Kio. Zero requete externe.

Les mesures d'avant correction sont conservees (`avant-*`) : les quatre scores
etaient deja a 100 avant ; la correction ci-dessous ne change pas un score,
elle corrige un defaut que Lighthouse signale sans le compter.

## Le defaut trouve, et corrige

`label-content-name-mismatch` (axe-core, WCAG 2.5.3 "Etiquette dans le nom")
echouait sur **les douze mesures**, sur trois liens du gabarit global, pas sur
les composants cimetiere. Cet audit ne pese pas dans le score : l'accessibilite
affichait 100 malgre lui.

Le probleme : quand le nom accessible d'un lien ne contient pas son texte
visible, une personne qui pilote son ordinateur a la voix ne peut pas activer
le lien en lisant ce qu'elle voit.

1. **Logos d'en-tete et de pied.** `aria-label` valait "PierreTombale.ch,
   accueil" alors que le texte visible est "PierreTombale.ch" suivi de "Suisse
   romande". Premiere correction : `aria-label` devient "PierreTombale.ch
   Suisse romande, accueil". **Elle n'a pas suffi**, et la raison est
   instructive : axe compare le texte visible *rendu*, et Astro collait les
   deux `span` sans espace. Le texte vu par axe etait
   "PierreTombale.chSuisse romande", d'ou le jeton "chsuisse" introuvable dans
   le nom accessible. Il a fallu ajouter une espace explicite entre les deux
   `span`.
2. **Credit de pied.** Texte visible "kumo-seo.ch", `aria-label` "Kumo,
   conception du site web" : le nom accessible devient "kumo-seo.ch,
   conception du site web".

Fichiers touches : `src/components/SiteHeader.astro` et
`src/components/SiteFooter.astro`. Ce sont l'en-tete et le pied communs : la
correction profite aux 75 pages, pas seulement aux neuf fiches.

**Aucun effet visuel.** Une espace seule dans un conteneur flex n'est pas
rendue comme element flex. Mesure comparative dans le navigateur, avec et sans
ce noeud de texte : geometrie identique au pixel (logo 272 x 37 px en 390,
372 x 44 px en 1280 ; memes positions du nom et de la mention), aucun
debordement horizontal. Capture relue :
`/home/kumo/atelier/tmp/lighthouse-cimetieres-20261110/entete-390-apres.png`.

## Ce qui reste signale et qui n'est pas corrige

- **`render-blocking-insight`** : les deux feuilles CSS de la route
  (`BaseLayout` 7,6 Ko et `_slug_` 4,7 Ko) bloquent le rendu, gain estime
  70 a 300 ms. C'est le comportement voulu d'une feuille de styles : la
  supprimer du chemin critique demanderait d'injecter du CSS critique en ligne
  et d'en charger le reste en differe, donc un risque de rendu non style pour
  un gain simule, alors que la performance est deja a 100 et le LCP a 1,05 s.
  Non corrige, sciemment.
- **`network-dependency-tree-insight`** : chaine critique document -> CSS ->
  police. Meme raison. Un `preload` de police ne gagnerait rien de mesurable
  ici (TBT 0, CLS 0) et toucherait le chargement de toutes les pages.
- **LCP a 1,66 s** (Peseux et Val-de-Travers en mobile) : l'audit LCP seul
  passe sous 1 au-dela de 1,2 s, sans faire bouger le score de performance
  (100). L'element LCP est le chapeau du hero (`p.type-lead`), rendu sans
  image ; l'ecart avec les 1,05 s des autres fiches vient de la mesure
  simulee, pas d'un contenu different.
- `unused-css-rules` est a zero : l'effet de bord signale comme limite de la V2
  (CSS de route inutilise sur les huit autres fiches) a bien disparu avec la
  generalisation.

## Reserve sur le score SEO

**Le 100 en SEO est un resultat local, pas une mesure de production.** Les
pages sont servies depuis `127.0.0.1:8731` alors que leur `canonical` pointe
vers `https://www.pierretombale.ch` : l'origine testee et l'origine canonique
different, et le `robots.txt` servi est celui du build, pas celui que
Cloudflare servira. Lighthouse n'a signale aucun probleme dans ces conditions
(aucun `noindex` sur les neuf fiches, verifie aussi directement dans `dist`),
mais le SEO devra etre reverifie sur `https://www.pierretombale.ch` apres la
publication. Les quatre autres categories ne dependent pas de l'origine.

## Preuves et autres controles

- Rapports bruts, JSON et HTML, des 24 mesures (12 avant, 12 apres) :
  `/home/kumo/atelier/tmp/lighthouse-cimetieres-20261110/`, recapitulatif
  exploitable dans `recap-lighthouse-cimetieres.json` (scores par categorie,
  LCP, CLS, TBT, FCP, Speed Index, poids, audits non verts, version et
  conditions).
- **Controle independant des 696 faits** relance apres correction
  (`/home/kumo/atelier/tmp/cimetieres-generalisation-check.py`) : **696 faits
  sur 696**, aucun manquant, **SEO identique** sur les neuf fiches (meme
  `title`, meme meta description, meme canonical, aucune meta robots, un seul
  `main`, un seul `h1`, memes JSON-LD), aucun lien ni ancre perdu, hub
  `/cimetieres/`, accueil et sitemaps identiques.
- `npm run build` : 75 pages, vert. `npx astro check` : 0 erreur, 0
  avertissement, 3 hints (les memes qu'avant). `npm test` : 6 fichiers,
  155 tests, vert.
- **Aucune donnee cimetiere touchee** : `src/data/cimetieres.ts` et les
  composants du guide sont inchanges par cette session.
