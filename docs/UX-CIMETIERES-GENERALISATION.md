# Pages cimetieres : generalisation de la V2 aux neuf fiches

Travail du 10.11.2026, apres la validation par Thomas de la page pilote
(commit 4cef302, Corcelles-Cormondreche). La composition V2 devient la SEULE
mise en page des pages cimetiere. Rien n'a ete pousse ni mis en ligne : tout
est local, sur `main`. Aucune commune n'a ete ajoutee, le hub, l'accueil, les
sitemaps et les autres sections du site sont inchanges.

Ce document est la suite de `docs/UX-CIMETIERES-V2.md` (la direction, les sept
chantiers, le mouvement) et de `docs/UX-CIMETIERES.md` (la V1). La direction
n'est pas refaite : elle est appliquee aux huit autres fiches, et les
composants sont adaptes aux donnees reelles de chacune.

## Ce qui change dans le code

- `src/pages/cimetieres/[slug].astro` : le rendu d'origine et la condition
  `PILOTE_GUIDE` sont supprimes. La page ne garde que ce qui doit rester
  identique (adresse, `<title>`, meta description, canonical, h1, WebPage +
  Cemetery, FAQPage, BreadcrumbList) et appelle `GuideCimetiere`. Sa feuille
  de style de page part avec le rendu qu'elle habillait ; les imports devenus
  inutiles aussi. 706 lignes -> 136.
- `src/components/GuideCimetiere.astro` : le gabarit des neuf fiches. Toujours
  aucune donnee : tout vient de `src/data/cimetieres.ts`, qui n'est pas
  modifie (aucune regle, aucun chiffre, aucune date, aucun tarif, aucune
  source touchee).
- `src/components/guide/SchemaDimensions.astro` : deux vues independantes au
  lieu d'un schema tout ou rien, plus les cotes non chiffrees ecrites en mots.
- `src/components/guide/OngletsPossibilites.astro` : avec un seul groupe, la
  barre n'est pas ecrite du tout.
- `src/components/guide/NavBesoins.astro` : inchange.

## Inventaire des neuf fiches

| Fiche | Adresse | Equip. | Tarifs | Vues du schema | Groupes cendres |
| --- | :---: | ---: | :---: | --- | ---: |
| Beauregard (Neuchatel) | oui | 9 | oui | dessus + hauteur | 4 |
| La Chaux-de-Fonds | oui | 6 | oui | aucune, cotes en mots | 3 |
| Peseux | oui | 4 | oui | dessus + hauteur | 4 |
| Corcelles-Cormondreche | oui | 4 | oui | dessus + hauteur | 3 |
| Le Landeron | non | 1 | non | dessus seule | 2 |
| Boudry | oui | 0 | non | dessus seule | 3 |
| Cortaillod | oui | 3 | non | dessus + hauteur | 4 |
| Le Locle | non | 7 | oui | hauteur seule | 3 |
| Val-de-Travers | non | 5 | oui | dessus seule | 3 |

## Les composants, adaptes aux donnees reelles

### 1. Le schema ne dessine que ce qui est chiffre

La V2 exigeait surface ET hauteur, et rangeait les deux autres reperes dans un
repli parce que le dessin les portait. Avec cette regle, cinq fiches sur neuf
n'avaient aucun dessin et leurs cotes disparaissaient dans le repli : un trou
dans la grille et une hauteur essentielle cachee.

Les deux vues sont maintenant independantes.

- **Vue de dessus** : la surface au sol d'une tombe d'adulte, quand le
  reglement la chiffre. Le grand chiffre garde l'ordre du reglement
  ("180 x 80 cm") ; le dessin met le plus petit nombre en largeur, comme une
  tombe se presente quand on se tient a son pied. Pour Corcelles (70 x 130) les
  deux coincident : le dessin valide ne bouge pas.
- **Vue de hauteur** : la premiere forme d'adulte dont la hauteur est chiffree.
  La legende nomme la forme mesuree. La largeur n'est dessinee a l'echelle que
  si le reglement l'ecrit en clair (Beauregard et Le Locle : 70 cm) ; sinon le
  dessin dit "a confirmer" et garde la phrase source.
- **Les deux vues** : onglets comme sur le pilote. **Une seule vue** : pas de
  bouton du tout, un onglet unique serait un faux onglet. **Aucune vue** : la
  carte porte les cotes en mots.
- **Ce qui n'est pas chiffre** est ecrit dans la meme carte, avec la phrase du
  reglement et son article : La Chaux-de-Fonds "Aucune dimension dans le
  reglement : elles sont definies par l'administration sur des plans
  d'amenagement consultables chez elle" (art. 51), Val-de-Travers "Aucun
  chiffre dans le reglement : la grandeur est fixee par le Conseil communal sur
  les plans d'amenagement, qui ne sont pas publies" (art. 9.12).
- **Les reperes** ne passent dans le repli que si le dessin porte deja leur
  chiffre. Une hauteur non publiee reste donc en clair, a cote du dessin :
  Le Landeron et Boudry "Non publiee, a demander a la commune",
  Val-de-Travers "Fixee par le Conseil communal", La Chaux-de-Fonds "Fixee
  par l'administration". Le delai reste toujours en clair.

Garde-fous tenus :

- **La fosse de La Chaux-de-Fonds (200 x 80 cm, art. 21, "pour memoire") est
  exclue du dessin** : c'est une fosse creusee, pas l'emprise d'un monument.
  Elle reste lisible la ou la donnee la met, dans le repere "Tombe d'adulte"
  ("Fixee par l'administration (fosse 200 x 80 cm)") et dans le tableau.
- **Aucune hauteur non publiee n'est dessinee** : Le Landeron, Boudry et
  Val-de-Travers n'ont pas de vue de hauteur.
- **Tombe, stele et croix ne sont pas confondues.** Chaque legende nomme sa
  forme, et les autres formes chiffrees pour un adulte sont listees dans le
  repli "Comprendre ces dimensions" :
  - Beauregard : dessin de la stele d'adulte a 120 cm, puis "Croix, inhumation
    d'adulte : 140 cm" et "Obelisque, inhumation d'adulte : 140 cm"
    (gabarits du 9 octobre 1990) ;
  - Cortaillod : "Stele ou obelisque : 130 cm (70 cm pour un enfant)" dessine,
    "Croix : 140 cm (70 cm pour un enfant)" dans le repli (art. 8.9) ;
  - Le Locle : "Stele d'adulte, socle compris : 110 cm (130 cm pour une croix),
    art. 30", la croix est dans la phrase meme du reglement.
- **L'intitule d'un repere suit sa valeur** : Le Locle publie la largeur d'une
  stele, pas la surface d'une tombe ; le repere s'appelle donc "Stele
  d'adulte".

### 2. Hero : pas d'itineraire promis sans adresse

Le lien d'itineraire est une recherche Google Maps sur le nom du cimetiere. Il
n'est propose que si la fiche publie une adresse. Le Landeron, Le Locle et
Val-de-Travers n'en publient pas : leur panneau ouvre sur l'appel du service
communal (bouton principal), et la ligne "Adresse" devient "Localites
desservies", prise dans les donnees. Val-de-Travers nomme ainsi ses six
villages (Couvet, Fleurier, Travers, Motiers, Buttes, Boveresse) au lieu de
promettre un trajet unique, et son h2 d'appel passe au pluriel ("Votre projet
dans ces cimetieres"). Le h1 et le titre SEO viennent des donnees : ils ne
sont pas touches.

Le bouton d'appel nomme le bon service, sans le rebaptiser : "Appeler
l'office" (Neuchatel), "Appeler l'administration" (Le Landeron, Cortaillod,
Le Locle), "Appeler le controle des habitants" (Boudry, Val-de-Travers),
"Appeler le cimetiere" (La Chaux-de-Fonds, dont le service est le cimetiere
et centre funeraire). Le numero appele est toujours celui de la fiche, et le
devis est pre-rempli avec la commune et le nom court du cimetiere de la page
(verifie sur les neuf, voir les preuves).

### 3. Sections vides : aucune

- **Boudry n'a aucun equipement** (ni projet, ni histoire) : la section "Sur
  place" n'est pas ecrite et sa navigation n'a que cinq entrees.
- **Le Landeron n'a qu'un equipement** : la liste n'est plus sur deux colonnes
  sur ordinateur (deux colonnes a partir de quatre lignes).
- **Trois communes ne publient aucun tarif** (Le Landeron, Boudry, Cortaillod) :
  aucune table vide, aucune taxe inventee, et la navigation dit "Urnes et
  cendres" au lieu de "Urnes et tarifs".
- **Les titres des replis du reglement ne nomment que ce qu'ils contiennent** :
  "Autorisation, bordure et taxe de pose" devient "Bordure et taxe de pose"
  quand la commune ne publie pas d'autorisation (Boudry, Cortaillod), et
  "Materiaux et obligations de l'entreprise" devient "Obligations de
  l'entreprise" quand il n'y a pas de regle de materiaux (Cortaillod).
- **La periode d'interdiction de pose** reste en clair au-dessus des replis :
  seule La Chaux-de-Fonds en publie une (du 1er novembre au 30 avril, art. 56).

### 4. Cendres : les lignes qui concernent plusieurs possibilites

Le rangement par possibilite reste une reconnaissance par mots, mais une ligne
n'est plus rangee de force dans le premier groupe reconnu. Une ligne qui
concerne PLUSIEURS possibilites va dans un groupe qui le dit ("Plusieurs
possibilites") ; ce que personne ne reconnait reste dans "A savoir aussi".
Exemple : a Beauregard, "Une urne peut etre deposee dans une tombe, a 70 cm de
profondeur, ou placee dans une niche" n'est plus annoncee comme une ligne du
columbarium.

Le groupe du columbarium prend le mot de la commune : "Au mur cineraire" au
Locle, "Dans une niche" a Cortaillod et a La Chaux-de-Fonds, "Au
columbarium" ailleurs. Aucune ligne n'est perdue : la somme des groupes est
toujours le nombre de lignes de la fiche (controle des faits ci-dessous).
Avec un seul groupe, la barre d'onglets n'est pas ecrite ; aucune fiche n'est
dans ce cas aujourd'hui (deux groupes au minimum, Le Landeron).

## Preuves

### Build et tests, le 10.11.2026

- `npm run build` : 75 pages, vert.
- `npx astro check` : 86 fichiers, 0 erreur, 0 avertissement, 3 hints (les
  memes qu'avant).
- `npm test` : 6 fichiers, 155 tests, vert.
- Aucune erreur de page ni de console sur les neuf pages (navigateur local).

### Controle independant du parent

`/home/kumo/atelier/tmp/cimetieres-generalisation-check.py`, baseline
`/home/kumo/atelier/tmp/cimetieres-generalisation-20261110/avant/` contre ce
build, donnees `/home/kumo/atelier/tmp/cimetieres-generalisation-donnees.json` :

- **696 faits sur 696** presents dans le `<main>` des neuf pages, 0 manquant
  (135 Beauregard, 86 Peseux, 86 Corcelles, 86 Le Locle, 79 La Chaux-de-Fonds,
  69 Val-de-Travers, 59 Cortaillod, 52 Boudry, 44 Le Landeron).
- **SEO identique** sur les neuf : meme `<title>`, meme meta description, meme
  canonical, pas de meta robots, un seul `<main>`, un seul `<h1>` au texte
  exact, memes objets JSON-LD complets.
- **Aucun lien perdu**, **aucune ancre perdue** : les ancres historiques
  `#sur-place`, `#poser-un-monument`, `#cendres`, `#duree`, `#questions`,
  `#sources` et `#infos-pratiques` sont la sur chaque fiche, et toutes les
  ancres de la page ont une cible (verifie aussi au navigateur).
- **Hub `/cimetieres/`, accueil, sitemaps** : identiques.
- Aucun `noindex` dans le build ; aucune page cimetiere ne porte de meta
  robots.

### Recette au navigateur (navigateur officiel, 127.0.0.1:8731)

Debordement horizontal **0 sur les neuf fiches aux quatre largeurs**
(320 x 800, 390 x 844, 768 x 1024, 1440 x 900). Aucun bloc vide detecte
(blocs, sous-blocs, listes, barres d'onglets, cartes de cotes, panneau
pratique).

Hauteurs mesurees (px) :

| Fiche | Page 390 | Page 1440 | Monument 390 | Monument 1440 | Carte des cotes 390 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Beauregard | 10 435 | 7 147 | 1 282 | 731 | 598 |
| La Chaux-de-Fonds | 9 304 | 6 734 | 1 396 | 945 | 326 |
| Peseux | 9 707 | 6 909 | 1 254 | 731 | 570 |
| Corcelles | 9 613 | 6 851 | 1 254 | 731 | 570 |
| Le Landeron | 7 698 | 5 603 | 1 371 | 751 | 576 |
| Boudry | 7 736 | 5 492 | 1 317 | 694 | 563 |
| Cortaillod | 8 011 | 5 887 | 1 266 | 779 | 583 |
| Le Locle | 9 264 | 6 571 | 1 250 | 727 | 484 |
| Val-de-Travers | 9 125 | 6 430 | 1 537 | 927 | 771 |

Corcelles retrouve exactement ses mesures validees (9 613 en 390, 6 851 en
1440, 11 057 en 320, 7 603 en 768, monument 1 254 en 390 et 731 en 1440) : la
page validee n'a pas bouge.

Sur ordinateur, le reglement est bien dans la colonne du delai, a gauche de la
carte des cotes, comme sur le pilote ; sur telephone les deux ensembles se
suivent dans le flux. Le bouton d'itineraire ou d'appel, le nom du service,
l'adresse (ou les localites) et les horaires sont dans le premier ecran en
390 x 844 (premiere action entre 283 et 350 px du haut selon la fiche).

Captures lues (et pas seulement produites) :
`/home/kumo/atelier/tmp/cimgen-captures/` contient le hero et la section
monument des neuf fiches en 390 et 1440 (54 fichiers). Ont ete relues a
l'ecran : La Chaux-de-Fonds (aucune vue), Val-de-Travers (vue de dessus seule
et hauteur en mots), Le Locle (hauteur seule, largeur dessinee), Beauregard
(deux vues, autres formes), Boudry (vue de dessus seule, navigation a cinq
entrees), Corcelles (reference validee), Le Landeron (hero sans itineraire).

Comportements, verifies sur les variantes (La Chaux-de-Fonds, Boudry,
Le Locle, Val-de-Travers, Beauregard, Corcelles) :

- Onglets des cendres : fleches, Home, Fin, tabindex tournant, focus qui reste
  sur l'onglet, un seul panneau visible, un seul onglet selectionne.
- Onglets du schema : presents seulement sur les quatre fiches a deux vues ;
  fleches et bascule de vue verifiees.
- Replis : ouverture a la souris et au clavier, hauteur animee puis remise a
  vide (aucune hauteur en ligne residuelle), double clic rapide sans
  empilement.
- Navigation par besoins : ancres natives, etat actif, cinq entrees a Boudry,
  six ailleurs ; aucune ancre sans cible sur les neuf.
- `prefers-reduced-motion: reduce` : zero animation en cours, toutes les
  sections a l'opacite 1, defilement instantane.
- Sans JavaScript (copie des pages, scripts retires) : tous les panneaux de
  cendres visibles, toutes les vues du schema visibles, boutons du schema
  caches, navigation et replis natifs fonctionnels, aucun debordement.

### Poids et performance

Aucun framework ajoute, aucune dependance, aucun CDN, zero JavaScript externe
sur ces pages. Le cout est celui du pilote, maintenant paye par les neuf :

| Fiche | HTML gz avant -> apres | dont JS inline gz |
| --- | ---: | ---: |
| Beauregard | 11 554 -> 18 031 | 3 361 -> 9 071 |
| La Chaux-de-Fonds | 10 177 -> 15 833 | 3 426 -> 9 136 |
| Peseux | 10 065 -> 16 315 | 3 279 -> 8 989 |
| Corcelles | 15 906 -> 16 022 | 8 898 -> 8 996 |
| Le Landeron | 8 169 -> 13 989 | 3 010 -> 8 720 |
| Boudry | 8 434 -> 14 371 | 3 250 -> 8 960 |
| Cortaillod | 8 461 -> 14 749 | 3 221 -> 8 931 |
| Le Locle | 9 413 -> 15 303 | 3 352 -> 9 062 |
| Val-de-Travers | 9 319 -> 15 153 | 3 239 -> 8 949 |

Les quatre scripts `is:inline` (entree des sections, navigation, schema,
onglets) pesent environ 5,7 Ko gzip par page. En contrepartie, la feuille CSS
de la route (11,6 Ko gzip, deja chargee par les huit autres pages depuis le
pilote) n'est plus du CSS inutilise : l'effet de bord signale comme limite de
la V2 disparait.

Lighthouse n'est pas installe sur cette machine et n'a pas ete installe :
**performance non mesuree par Lighthouse**. Ce qui a ete mesure : poids gzip
par page (ci-dessus), zero requete externe ajoutee, zero erreur de console, et
aucune animation en boucle (une seule passe d'entree par section, observateur
qui cesse d'observer).

## Limites reelles

- **Le rangement des lignes cineraires reste une reconnaissance par mots.**
  Les lignes ambigues sont desormais signalees comme telles plutot que mal
  rangees, mais une nouvelle commune demande toujours une relecture du
  resultat. Une ligne mal rangee se corrige dans le composant, jamais en
  reecrivant la donnee.
- **"Plusieurs possibilites" est un libelle d'interface**, pas une categorie
  du reglement. A Beauregard, la phrase sur le jardin du souvenir et la Tombe
  du souvenir s'y trouve parce qu'elle parle des deux.
- **Le Locle n'a pas de vue de dessus** : son reglement ne publie pas la
  surface d'une tombe. Rien n'est ecrit a la place : on n'affirme pas qu'une
  cote est absente du reglement quand on ne l'a pas lu noir sur blanc.
- **Le repere "Stele d'adulte : Stele de 70 cm de large"** (Le Locle) repete
  le mot stele : c'est la valeur exacte de la donnee, gardee telle quelle.
- **La section monument depasse un ecran de telephone** sur les neuf fiches
  (1 250 a 1 537 px en 390). Ce n'est pas une interface a diapositives : rien
  n'est force dans 100vh, le corps reste a 17 px. Val-de-Travers est la plus
  longue, a cause de la phrase du reglement sur la hauteur non publiee.
- **Les tableaux gardent leurs colonnes sur telephone** et se font defiler
  lateralement.
- **`scroll-behavior: smooth` reste declare globalement** dans
  `src/styles.css` ; les pages cimetiere le neutralisent en JavaScript quand
  la personne demande moins de mouvement. Le corriger dans la feuille globale
  reste a faire pour les 75 pages.
- **Le bandeau de consentement** couvre le bas de l'ecran tant qu'on n'a pas
  repondu : comportement existant du site, visible sur les captures.
- **Aucune valeur manquante n'a ete comblee** : les hauteurs du Landeron, de
  Boudry et de Val-de-Travers, les tarifs des trois communes et les adresses
  manquantes restent a demander aux communes (liste dans `docs/BACKLOG.md`).
  Cette passe ne change aucune donnee.

## Apercu autonome livre

- Les neuf fiches sont reunies dans un seul fichier `cimetieres-maquettes.html`,
  avec un selecteur natif de commune et un lien Pleine page. Les liens vers une
  autre des neuf fiches restent dans cet apercu. Les autres liens ouvrent leur
  destination habituelle.
- Export du build du commit afbb11b, par
  `/home/kumo/atelier/tmp/export-cimetieres-generalisation.py`. Fichier source :
  `/home/kumo/atelier/tmp/cimetieres-generalisation-20261110/cimetieres-maquettes.html`.
- 1 550 656 octets. SHA-256 :
  `cfab993cb12fa52daaf117f74b22bcb59663be9505900d54ea0e639ee93d4c20`.
- Polices, styles et images integres. Aucun chargement HTTP externe dans
  l'apercu teste. Le suivi d'audience et son bandeau sont retires uniquement
  de cet export ; `noindex,nofollow` est ajoute uniquement a l'export.
- Verification propre a l'apercu : 9 fiches x 320/390/1440 px, aucun
  debordement horizontal interne ou externe, les neuf bons h1, les neuf
  nouveaux gabarits. Ancres, onglet de hauteur et onglets des cendres testes
  dans l'iframe ; bascule Corcelles -> Peseux par lien interne verifiee.
  Capture du fichier final en 390 px relue.
- Controle independant des 696 faits relance apres le build final : toujours
  aucun fait, lien ou ancre perdu et SEO identique.
- Fichier remis a Thomas pour relecture. Aucun push ni deploiement.
