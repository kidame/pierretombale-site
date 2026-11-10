# Pages cimetieres, version 2 : composants et mouvement (pilote Corcelles)

Travail du 10.11.2026, autorise par Thomas, sur la SEULE page pilote
`/cimetieres/corcelles-cormondreche/`. En local, rien n'a ete pousse ni mis en
ligne. Les huit autres pages cimetiere et tout le reste du site gardent leur
contenu ; voir `docs/UX-CIMETIERES.md` pour la version 1, dont ce document
n'est que la suite.

## Ce qui change par rapport a la V1

La V1 reorganisait la page. La V2 la compose : hero plus serre, navigation par
besoins avec etat actif, un vrai composant de dimensions, des panneaux
depliables animes, des onglets accessibles pour les urnes, et une seule passe
de mouvement a l'entree des sections. Memes jetons (ivoire, anthracite,
bronze), memes polices (EB Garamond + Archivo), aucune dependance ajoutee,
aucune image inventee, aucune donnee reecrite.

## Fichiers

- `src/components/GuideCimetiere.astro` : le gabarit et la feuille de la page.
  Aucune donnee : tout vient de `src/data/cimetieres.ts`.
- `src/components/guide/NavBesoins.astro` : la navigation par besoins.
- `src/components/guide/SchemaDimensions.astro` : les cotes du reglement.
- `src/components/guide/OngletsPossibilites.astro` : les possibilites pour les
  cendres.
- `src/pages/cimetieres/[slug].astro` : inchange (`PILOTE_GUIDE` decide seul
  quelle mise en page est ecrite dans le HTML).

Les trois composants sont reutilisables : chacun recoit des donnees simples
(`{id, titre}[]`, les nombres du schema, `{titre, lignes}[]`), porte sa propre
feuille scoped et son propre script `is:inline` autonome. Aucun CDN, aucun
module externe, aucune mesure d'audience ajoutee : l'export HTML autonome de la
page garde tous ses comportements.

## Les sept chantiers

### 1. Hero compose, infos pratiques compactes
Fil d'Ariane, commune precedee d'un filet bronze, h1, chapo. Le panneau
anthracite est passe de 443 a 390 px sur telephone : il ouvre sur les deux
actions (Itineraire, Appeler l'office) suivies du nom du service, puis
l'adresse et les horaires, puis un seul repli "Acces et coordonnees du
guichet" qui porte les lignes d'acces et toutes les coordonnees detaillees.
Sur un ecran de 390 x 844, l'itineraire est a 350 px du haut, l'appel a cote,
l'adresse a 508 px et les horaires juste dessous : les quatre sont dans le
premier ecran. Sur ordinateur, le hero finit a 621 px, en-tete de 155 px
comprise, en 1440 x 900 comme en 1366 x 768.

### 2. Navigation par besoins, etat actif et trait de progression
Un seul element de navigation dans le DOM, deux formes. Sous 1024 px : une
barre collee sous l'en-tete (49 px de haut), qui se fait defiler
lateralement, jamais une liste qui prend un ecran. A partir de 1024 px : un
rail vertical colle dans sa colonne, filet continu plus trait bronze. Le
trait suit la section lue (transform + height, 260-280 ms) et la puce active
revient dans la vue sans jamais faire defiler la page.
Les six liens sont des ancres natives : sans JavaScript, la navigation
fonctionne, seul le trait reste invisible. L'en-tete du site garde son
z-index 50, la barre est a 30 : elle ne le masque jamais. Verifie sur les sept
ancres : chacune se pose a 15 px sous la barre.

### 3. Composant de dimensions
Le schema de la V1 est devenu un composant. Memes nombres, relus dans
`regles.tombes` : surface 70 x 130 cm (art. 38), hauteur 160 cm socle compris
(art. 34 a 36), largeur "a confirmer", jamais "libre". Les deux vues restent a
la meme echelle (1 cm = `--cm`).
Nouveaute : un grand repere chiffre (70 x 130 cm, 160 cm) a cote du dessin, et
une selection "Vue de dessus" / "Hauteur". A l'activation d'une vue, les cotes
se mettent en evidence : les filets bronze se tracent (scaleX / scaleY,
300 ms), le chiffre monte de 10 px, les cotes apparaissent, en decale de
60 ms. Une seule fois de plus quand le schema entre dans l'ecran.
Amelioration progressive : dans le HTML initial les deux vues sont visibles
l'une sous l'autre et les deux boutons portent `hidden`. Les roles
`tablist` / `tab` / `tabpanel` ne sont poses que si le script tourne. Clavier :
tabindex tournant, fleches, Home, Fin, focus qui reste sur le bouton
(verifie). Le tableau complet des dimensions est garde, dans un repli
explicite, entierement dans le HTML.

### 4. Panneaux depliables et section monument fractionnee
Les `<details>` natifs s'ouvrent et se ferment en 220 ms (hauteur mesuree,
jamais fixee ; un second clic pendant l'animation l'inverse au lieu de
l'empiler : verifie, aucune animation ne reste en attente et aucune hauteur
en ligne ne subsiste). Le marqueur est dessine : deux filets bronze, la barre
verticale disparait a l'ouverture.
"Poser un monument" est coupee en trois sous-sections visibles : "Les cotes a
retenir" (les trois reperes et le schema), "Ce que demande le reglement" (la
prose), "Le detail, si vous le voulez" (materiaux et obligations, puis
"Tableau complet des dimensions autorisees"). Les tableaux sont dans des
replis au titre explicite ; leur contenu est dans le HTML initial.

### 5. Urnes : vrais onglets, ecrin editorial
Les lignes de la fiche sont toujours rangees par possibilite (Au columbarium /
Au jardin du souvenir / Dans une tombe, plus "A savoir aussi" si besoin), mais
elles se lisent une possibilite a la fois dans un panneau large : grand
chiffre bronze, titre en serif, lignes separees par des filets. Les trois
panneaux sont dans le HTML initial et tous visibles sans JavaScript ; les
libelles de la barre sont alors de simples ancres vers les panneaux.
Avec le script : `tablist` / `tab` / `tabpanel`, tabindex tournant, fleches,
Home et Fin, focus stable sur l'onglet, trait bronze anime sous l'onglet
actif. Les tarifs restent hors des onglets, dans leur propre sous-section,
avec la phrase "ce sont des taxes communales, pas des prix de monument" avant
le tableau : aucune confusion possible avec le prix d'un monument.

### 6. Mouvement
Une seule passe d'entree : chaque section monte de 12 px en 340 ms
(`cubic-bezier(0.25, 1, 0.5, 1)`), declenchee par un IntersectionObserver qui
cesse d'observer apres coup. L'animation part de l'opacite 0 et ne remplit pas
son etat final : aucune section n'est jamais laissee invisible, et une section
deja a l'ecran s'anime tout de suite, sans delai de lecture. Trois morceaux du
hero sont decales de 0, 60 et 120 ms. Le seul trace decoratif est le filet
bronze de la commune (scaleX, 420 ms) ; le voile bronze du hero est une teinte
fixe, sans animation ni image.
Retour des boutons : 1 px de pression, sans survol requis. Tous les survols
sont dans `(hover: hover) and (pointer: fine)`. Aucune boucle, aucun
parallaxe, aucun detournement du defilement, aucun compteur sur un chiffre
factuel.
`prefers-reduced-motion: reduce` : les animations ne sont pas lancees, les
transitions sont coupees, les replis s'ouvrent instantanement (comportement
natif) et le script pose `scroll-behavior: auto` sur la page, ce qui rend
instantane le defilement pilote par les ancres. Verifie au navigateur : zero
animation en cours, toutes les sections a l'opacite 1.

### 7. Composition et longueur
Mesures au navigateur (`/home/kumo/atelier/bin/browser`, serveur local sur
127.0.0.1:8731, build `dist`), page entiere :

| Viewport  | Page V2 | Page V1 | Hero (bas, en-tete comprise) | Debordement |
|-----------|---------|---------|------------------------------|-------------|
| 390 x 844 | 10 661  | 14 177  | 905                          | 0           |
| 320 x 800 | 12 295  | -       | 1 117                        | 0           |
| 768 x 1024| 8 392   | 10 698  | 824                          | 0           |
| 1366 x 768| 7 621   | -       | 621                          | 0           |
| 1440 x 900| 7 646   | 9 151   | 621                          | 0           |

Soit -25 % sur telephone (14 177 -> 10 661) et -16 % sur ordinateur, sans
qu'aucun fait disparaisse. Aucun debordement horizontal a aucune largeur.

Hauteur des blocs en 390 et en 1440 :

| Bloc                | 390   | 1440 |
|---------------------|-------|------|
| hero                | 833   | 466  |
| sur-place           | 811   | 527  |
| poser-un-monument   | 2 303 | 1 526|
| projet (appel)      | 823   | 532  |
| cendres             | 1 109 | 856  |
| duree               | 854   | 637  |
| questions           | 870   | 701  |
| sources             | 756   | 598  |
| autres cimetieres   | 674   | 407  |

Blocs qui depassent un ecran, et pourquoi :
- **poser-un-monument (2 303 px en 390)** : c'est le coeur de la page. Il
  porte trois reperes chiffres avec leur article, le composant de dimensions
  (828 px a lui seul : grand chiffre, dessin a l'echelle, legende et
  avertissement), quatre paragraphes de reglement et deux replis. Il est deja
  coupe en trois sous-sections titrees et ses deux tableaux sont replies. Le
  raccourcir encore voudrait dire replier la prose du reglement, qui est
  precisement ce que les gens viennent lire.
- **cendres (1 109 px en 390)** : un seul panneau d'onglet a la fois, plus le
  titre, la sous-section des tarifs et son tableau replie. Incompressible sans
  replier les tarifs eux-memes.
- **duree, questions, sources, projet (750 a 870 px en 390)** : ces blocs
  tiennent sensiblement dans un ecran de 844 px moins l'en-tete. "questions"
  garde sa premiere reponse ouverte, comme en V1.
- **autres cimetieres (674 px)** : les huit autres fiches sont passees dans un
  repli explicite ("Les 8 autres cimetieres de la liste") et les quatre liens
  de parcours restent ouverts. Tous les liens restent dans le HTML initial.
  Ce bloc faisait 1 534 px avant ce repli.

Aucune section n'est forcee a 100 vh, rien n'est coupe, et aucun texte n'a ete
reduit : les tailles sont celles de la V1 (corps et faits a 17 px ; notes,
legendes, cellules de tableau et cotes du dessin a 15-16 px, et libelles en
capitales a 13 px, comme ailleurs sur le site).

## SEO : ce qui n'a pas bouge

Controle de regression `tmp/cimetieres-ux-20261110/controle.py`, baseline
`avant/` (la page d'avant le pilote) contre `apres-v2/` (ce build) :

- Hub `/cimetieres/` identique au bit. Les huit autres pages cimetiere :
  memes textes, memes liens, memes schemas.
- Page pilote : meme `<title>`, meme meta description, meme canonical, pas de
  meta robots, un seul `<main>`, un seul `<h1>` au texte exact, memes types
  JSON-LD (WebPage, Cemetery, FAQPage, BreadcrumbList, ...), 20 liens sortants
  avant comme apres, toutes les ancres ont une cible.
- Ancres historiques conservees : `#sur-place`, `#poser-un-monument`,
  `#cendres`, `#duree`, `#questions`, plus `#sources` et `#infos-pratiques`
  de la V1. Nouvelles ancres : `#urne-panneau-0` a `-2` (cibles des onglets).
- Une alerte, la meme nature qu'en V1 : trois libelles d'INTERFACE de la
  baseline ne sont plus ecrits tels quels. "Delai avant la pose." (le point
  final), "Dimensions autorisees" (devenu "Tableau complet des dimensions
  autorisees") et "Un monument pour ce cimetiere" (devenu "Votre projet dans
  ce cimetiere" en V1). Aucun fait, aucun tarif, aucun article n'est concerne.
- Contre-verification : `tmp/cimetieres-ux-20261110/controle-faits.py` compare
  les 86 chaines de la fiche (`/home/kumo/atelier/tmp/corcelles-faits.json`)
  au texte du `<main>` et au document. 86 presentes, 0 absente, exactement
  comme la baseline.
- Date de verification inchangee, aucune donnee de `src/data/cimetieres.ts`
  modifiee, aucune configuration, aucun CI, aucune mise en ligne touches.

## Validation du 10.11.2026

- `npm run build` : 75 pages, vert. `npx astro check` : 0 erreur, 0
  avertissement, 3 hints (les memes qu'avant). `npm test` : 155 tests, 6
  fichiers, vert.
- Navigateur local en 1440x900, 1366x768, 768x1024, 390x844 et 320x800 :
  aucun debordement horizontal, hero et blocs mesures (tableaux ci-dessus).
- Onglets des urnes et du schema : fleches, Home et Fin, tabindex tournant,
  focus qui reste sur l'onglet, panneaux caches et montres correctement.
- Replis : ouverture au clavier (Entree), fermeture, double clic rapide sans
  empilement ni hauteur residuelle.
- Ancres : les sept se posent a 15 px sous la barre collee, l'etat actif suit.
- Sans JavaScript (copie de la page, scripts retires) : les deux vues du
  schema et les trois panneaux d'urnes sont visibles, les boutons du schema
  restent caches, la navigation fonctionne, les replis s'ouvrent.
- `prefers-reduced-motion` : aucune animation, defilement instantane.
- Captures dans `/home/kumo/atelier/tmp/cv2/`.

## Limites reelles

- **Effet de bord sur les 8 autres pages cimetiere** : inchange depuis la V1.
  Le CSS de la route est une feuille externe partagee ; elles gagnent un
  `<link>` et portent du CSS inutilise tant que le pilote n'est pas
  generalise. Reversible en generalisant ou en revenant en arriere.
- **Trois scripts `is:inline` au lieu d'un** : un par composant, pour que
  chaque composant reste autonome et reutilisable. L'export HTML les garde
  tous ; aucun n'a de dependance.
- **Le rangement des lignes "urnes" par possibilite** reste une
  reconnaissance par mots. Pour un autre cimetiere, relire le resultat avant
  de generaliser : une ligne mal rangee se corrige dans le composant, jamais
  en reecrivant la donnee. Avec une seule possibilite reconnue, le script
  d'onglets ne s'active pas (il exige deux onglets) et la section se lit comme
  un seul ecrin : c'est voulu.
- **Les tableaux gardent leurs colonnes sur telephone** et se font defiler
  lateralement, legende collee a gauche. Pas de version empilee.
- **`scroll-behavior: smooth` reste declare globalement** dans
  `src/styles.css`. Le pilote le neutralise en JavaScript quand la personne
  demande moins de mouvement, ce qui suffit pour cette page ; le corriger
  dans la feuille globale reste a faire pour les 75 pages, hors de ce pilote.
- **Le bandeau de consentement** couvre le bas de l'ecran tant qu'on n'a pas
  repondu : comportement existant du site, visible sur les captures.
- **Sans JavaScript, le trait de progression et l'etat actif n'existent pas**
  (ils n'ont pas de sens sans defilement observe) ; la navigation, elle,
  fonctionne entierement.
- **Les deux grands chiffres du schema sont en IBM Plex Mono** (`.mono`),
  conformement a `docs/DESIGN.md` qui reserve ce caractere aux nombres.

## Avant de generaliser

1. Faire relire la page pilote par Thomas (critique visuelle) et decider des
   titres d'interface.
2. Verifier le rendu sur une fiche pauvre (Le Landeron : pas d'adresse, pas
   d'acces, pas de tarifs) et sur une fiche sans schema possible.
3. Verifier une fiche dont les lignes cineraires ne forment qu'un seul groupe.
4. Relancer `controle.py` et `controle-faits.py` entre la baseline et le
   nouveau build.
