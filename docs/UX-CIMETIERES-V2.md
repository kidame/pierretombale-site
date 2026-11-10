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

Une seconde passe le meme jour (finition) s'attaque au seul bloc qui restait
long, "Poser un monument" : un seul repere chiffre en clair, les deux autres
et leurs precisions dans un repli, le contexte du schema dans un repli, et les
paragraphes autorisation / bordure / taxe ranges dans un repli nomme a cote
des autres replis du reglement. La section perd 45 % de sa hauteur sur
telephone sans perdre un mot. Les mesures de ce document sont celles d'apres
cette passe.

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
une selection "Vue de dessus" / "Hauteur". Depuis la finition du 10.11.2026,
les deux phrases de contexte (rappel des deux cotes et de leurs articles,
avertissement "ce n'est pas un modele du catalogue") ne sont plus sous le
dessin : elles sont dans un `<details>` natif nomme "Comprendre ces
dimensions", au bas du composant. Elles restent mot pour mot dans le HTML, et
le repli porte `repli-anime` : il reutilise le script d'ouverture de la page,
sans une ligne de script en plus. Resultat : le dessin, sa legende et son
repli tiennent ensemble dans un ecran de telephone (570 px en 390, 673 px en
320, 478 px en 1440). A l'activation d'une vue, les cotes
se mettent en evidence : les filets bronze se tracent (scaleX / scaleY,
300 ms), le chiffre monte de 10 px, les cotes apparaissent, en decale de
60 ms. Une seule fois de plus quand le schema entre dans l'ecran.
Amelioration progressive : dans le HTML initial les deux vues sont visibles
l'une sous l'autre et les deux boutons portent `hidden`. Les roles
`tablist` / `tab` / `tabpanel` ne sont poses que si le script tourne. Clavier :
tabindex tournant, fleches, Home, Fin, focus qui reste sur le bouton
(verifie). Le tableau complet des dimensions est garde, dans un repli
explicite, entierement dans le HTML.

### 4. Panneaux depliables et section monument compactee
Les `<details>` natifs s'ouvrent et se ferment en 220 ms (hauteur mesuree,
jamais fixee ; un second clic pendant l'animation l'inverse au lieu de
l'empiler : verifie, aucune animation ne reste en attente et aucune hauteur
en ligne ne subsiste). Le marqueur est dessine : deux filets bronze, la barre
verticale disparait a l'ouverture.
"Poser un monument" associe deux lectures complementaires. Le reglement
se place sous le delai, a gauche du schema sur desktop :
- **"Les cotes a retenir"** : un seul repere en clair, le delai ("Delai avant
  la pose : 1 an apres l'inhumation"), parce que c'est le seul des trois qui
  decide d'une date. Les deux autres chiffres sont ceux que le schema dessine
  deja en grand ; les ecrire une seconde fois en gros les dedoublait. Leurs
  valeurs et leurs precisions (type de sepulture, article, largeur non fixee)
  sont gardees mot pour mot dans un repli "Les precisions du reglement", qui
  contient aussi la phrase complete du delai de pose (art. 39). A cote : le
  composant de dimensions.
- **"Ce que demande le reglement"** : trois replis a la suite, du meme
  dessin que les autres replis de la page. "Autorisation, bordure et taxe de
  pose" (les trois paragraphes qui etaient en prose ouverte, inchanges, avec
  leurs intitules en gras), "Materiaux et obligations de l'entreprise", puis
  "Tableau complet des dimensions autorisees". Si une fiche publie une periode
  d'interdiction de pose, elle reste en clair au-dessus des replis : c'est la
  seule regle qui peut deplacer une date. Corcelles n'en publie pas.

Aucune phrase n'est sortie du HTML : tout est dans le document initial, les
replis sont des `<details>` natifs, donc ouvrables sans JavaScript.

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

### 7. Composition finale et longueur
Recette du build final et de son export autonome le 10.11.2026, apres
placement du reglement dans la colonne du delai. Sur desktop, le schema
occupe la colonne droite ; le delai et les replis remplissent la gauche.
Sur mobile, ces deux ensembles se suivent dans le flux naturel.

| Viewport | Page finale | Page V1 | Hero, bas avec en-tete | Debordement horizontal |
| --- | ---: | ---: | ---: | ---: |
| 320 x 800 | 11 057 | - | 1 117 | 0 |
| 390 x 844 | 9 613 | 14 177 | 905 | 0 |
| 768 x 1024 | 7 603 | 10 698 | 824 | 0 |
| 1366 x 768 | 6 825 | - | 621 | 0 |
| 1440 x 900 | 6 851 | 9 151 | 621 | 0 |

La page est environ 32 % plus courte en 390 et 25 % plus courte en 1440
que la V1, avec les 86 informations de la fiche toujours presentes.

| Viewport | Section monument | Composant dimensions |
| --- | ---: | ---: |
| 320 x 800 | 1 411 | 673 |
| 390 x 844 | 1 254 | 570 |
| 768 x 1024 | 1 135 | 478 |
| 1366 x 768 | 731 | 478 |
| 1440 x 900 | 731 | 478 |

Le bloc monument tient dans un ecran desktop. Le composant de dimensions
tient dans les ecrans mobiles testes. La section monument complete reste
plus longue sur telephone : delai, reglement et schema se suivent, sans
texte tronque ni hauteur 100vh forcee. Les developpements ouverts et les
tableaux peuvent naturellement depasser l'ecran. Les tableaux gardent leur
defilement horizontal interne.

Les autres sections denses (cendres et tarifs, certaines questions) peuvent
egalement depasser un ecran mobile. Ce n'est pas une interface a diapositives :
le contenu reste lisible a taille normale. Corps a 17 px ; notes et cotes
a 15-16 px et petits libelles a 13 px, comme dans la V1.

Mesures conservees dans /home/kumo/atelier/tmp/corcelles-v2-final-mesures.json.
Export teste separement : /home/kumo/atelier/tmp/corcelles-v2-export-mesures.json.
Il masque le consentement et le bouton de preferences, d'ou de petits ecarts
de hauteur du pied de page a certaines largeurs.

### 8. Recette de l'export autonome
- Fichier de 419 800 octets, polices et CSS inclus, zero ressource HTTP chargee.
- Onglets urnes et hauteur, panneaux, double clic rapide, bascule native,
  ancres et legende du schema verifies dans le fichier exporte.
- Aucun debordement aux cinq formats ci-dessus.
- noindex,nofollow uniquement dans l'export prive ; le build source conserve
  son indexabilite et ses metadonnees.
- Build final : 75 pages, astro check 0 erreur, 0 avertissement, 3 hints
  preexistants ; les 86 faits et les objets JSON-LD complets sont inchanges.
- Les 155 tests avaient passe lors de l'integration V2. Les finitions de
  composition ont ete verifiees par build, astro check, comparaison des faits
  et recette navigateur ; pas de repetition sans changement de logique.

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

Deux passes le meme jour : la composition V2 (commit d678d73), puis la
finition de la section monument. Les lignes ci-dessous valent pour l'etat
apres finition.

- `npm run build` : 75 pages, vert. `npx astro check` : 0 erreur, 0
  avertissement, 3 hints (les memes qu'avant). `npm test` : 155 tests, 6
  fichiers, vert a la passe V2 ; non relance a la passe de finition.
- Faits : `/home/kumo/atelier/tmp/corcelles-final-check.py` 86 faits sur 86,
  SEO identique a la baseline, un seul `<main>`, un seul `<h1>` ;
  `tmp/cimetieres-ux-20261110/controle-faits.py` 86 presentes, 0 absente ;
  `controle.py` 1 alerte, les trois memes libelles d'INTERFACE reecrits
  qu'avant la finition, aucun fait perdu.
- Les trois replis ajoutes ("Comprendre ces dimensions", "Les precisions du
  reglement", "Autorisation, bordure et taxe de pose") : ouverture et
  fermeture a la souris (hauteur animee puis remise a vide), ouverture au
  clavier (Entree sur le resume), aucune erreur de page, mouvement reduit =
  bascule native instantanee.
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
- Captures de la passe V2 dans `/home/kumo/atelier/tmp/cv2/`, captures de la
  finition (section monument en 390, 320 et 1440, plus le composant de
  dimensions seul en 390) dans `/home/kumo/atelier/tmp/cv2-finition/`.

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
- **A 320 x 800, le sous-bloc "Les cotes a retenir" fait 918 px**, soit un
  ecran et 15 %. C'est la seule mesure de la section qui depasse un ecran a sa
  largeur. Assume : a 320 px les deux boutons de vue passent sur deux lignes
  et la legende du dessin sur quatre.
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
