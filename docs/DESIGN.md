# Design du site : reference courte

Direction : maquettes de l'accueil du 26.10.2026 (ordinateur et mobile, fournies par Thomas),
brief docs/brief-maquette-design.md, direction du configurateur
docs/maquettes/configurateur/2026-10-14/DIRECTION-DESIGN.md. Les maquettes sont des references :
on recode, on ne reproduit pas leurs images.

## Ou vit le design
- `src/styles.css` : jetons (couleurs, rayon, courbes), echelle typographique, boutons, champs,
  marque (`.logo`), ambiance sombre (`.nuit`). Rien en dessous des jetons ne code une couleur.
- `src/components/SiteHeader.astro`, `SiteFooter.astro` : en-tete et pied sombres, styles de
  composant dans le fichier.
- `src/pages/index.astro` : accueil, styles de page dans le fichier (sections hero, collection,
  matiere, personnalisation, parcours, appel).
- `src/config/site.ts` : navigation, modele montre dans le menu mobile (`featured.mobileMenu`).

## Deux ambiances, un seul jeu de jetons
- Ivoire (defaut) : `--canvas #f6f3ec`, `--ink #1c1b19`, `--muted #55524b`, `--accent #8a6a3c` (bronze).
- Nuit (`class="nuit"` sur une section) : `--canvas #131211`, `--ink #f4f0e8`, `--muted #cdc7ba`,
  `--accent #c0a06a`. La classe redefinit les memes jetons : boutons, liens, titres et textes se
  recolorent seuls. Pour assombrir une nouvelle section, poser `nuit` et c'est tout.
- Contrastes (calcul a la main, WCAG) : texte ivoire 15:1 (ink) et 7:1 (muted) ; texte nuit 16:1 et
  11:1 ; bronze nuit 7,5:1 ; bronze ivoire 4,5:1 seulement : le bronze ivoire ne porte jamais de
  petit texte (filets, bordures, pastilles).

## Typographie
- Titres : EB Garamond 400 (`type-hero`, `type-h1` a `type-h3`), importee dans BaseLayout (23 Ko
  woff2, prechargee). Texte courant : Archivo, 17 px (`type-body`), chapo `type-lead`.
- Legende `label` : capitales espacees, 13 px minimum. Boutons : 14 px, 52 px de haut.
- Le mono (IBM Plex Mono) ne sert plus qu'aux chiffres (`.mono`). Aucun mono sur l'interface.

## Regles pour tout nouveau morceau d'interface
- Mobile d'abord (390 px), cibles tactiles 48 px, texte 16 px au moins, peu d'elements par ecran.
- Pas de JavaScript pour du decoratif. Plus d'apparition au defilement ni de grain (retires le 26.10).
- Pas de classe Tailwind inedite : la feuille est partagee. Habillage specifique = bloc `<style>`
  de la page ou du composant (verifier `python3 scripts/poids-pages.py dist`).
- Une classe qui declare `display` prevoit son `[hidden]`.
- Jamais sur le site : fournisseur, ses liens ou prix, "fabrique en Suisse", Kosovo, sous-traitance.

## Etat de l'application (26.10.2026)
- FAIT : jetons, typographie, boutons, champs, en-tete, pied de page, accueil. Les autres pages
  heritent des jetons et des composants partages (verifie : fiche, devis, configurateur).
- A FAIRE : il reste des legendes en mono minuscule dans les gabarits des fiches, du catalogue, des
  prix, des granits, de la FAQ et de l'a-propos (classes `mono text-[0.6875rem] uppercase`),
  a passer en `label` ; puis les gabarits de ces pages selon les maquettes quand elles existeront.
- IMAGES DE L'ACCUEIL : cinq visuels fournis par le proprietaire (26.10.2026), ce sont des rendus
  generes par IA, pas des photos de realisations. Ils sont dans `public/images/accueil/` en WebP :
  `hero-700/1200`, `collection-funeraire-720`, `collection-cineraire-720`, `matiere-768`,
  `gravure-900`. Les originaux ne sont pas dans le depot. Les `alt` disent "illustration" pour ne
  pas presenter ces rendus comme des photos. A remplacer par de vraies photos des realisations
  quand elles existent : changer les fichiers (memes noms) ou les `src` de index.astro.

## Fiche produit : maquettes du 26.10.2026 (APPLIQUEE le 27.10.2026, passe 1)
Decisions de Thomas (27.10) : prix garde, en "Prix indicatif" ; "D'autres modeles a voir" garde ;
accroches ecrites par Claude sans validation (champ `accroche` des fiches, repli sur shortDescription) ;
une seule image par matiere (pas de vignettes), lien "Voir en grand" ; fond gris des rendus normal ;
menu et configurateur inchanges. Description et tableau : dans l accordeon "Dimensions et possibilites".
Analyse d origine :
Maquettes ordinateur + mobile de la fiche Douceur fournies par Thomas. Gabarit concerne :
`src/components/FicheModele.astro` (partage par les deux familles, 27 modeles, 10 matieres chacun).
Ecarts maquette / fiche actuelle :
- Mobile : titre, accroche, puis image (aujourd'hui : image d'abord). Ordinateur : galerie 7/12 a gauche,
  colonne choix a droite (famille, titre tres grand, accroche, granit, boutons).
- Accroche courte par modele ("Une courbe delicate. Une presence intemporelle.") : champ a creer dans
  src/content/products (27 textes a faire valider). Repli generique possible.
- Choix du granit dans la colonne de droite : tuiles carrees (coche sur la matiere choisie), nom au-dessus,
  lien "Decouvrir les granits" + mention "La teinte definitive se choisit sur un echantillon" (deja en place).
  Aujourd'hui : pastilles rondes sous l image. Le script de changement de matiere est a adapter, pas a refaire.
- Bouton principal "Personnaliser ce modele" (noir), puis lien "Demander un conseil" + "Devis gratuit, sans
  engagement". Seuls 22 modeles sur 27 ont une calibration : les 5 autres gardent "Demander un devis" en principal.
- Absents de la maquette : prix, "Comment est calcule le prix", tableau de caracteristiques, paragraphe de
  description, "D'autres modeles a voir". A DECIDER avant de les retirer (prix : decision du 13.10, estimations).
- Ajoutes par la maquette : trois etapes "Un hommage a votre image" (matiere, mots, motif), deux accordeons
  ("Dimensions et possibilites", "Pose et accompagnement"), bande sombre "Chaque detail compte", appel
  "Votre projet commence par un echange", barre fixe en bas sur mobile (nom + Personnaliser).
- Galerie : 3 vignettes + "Agrandir" sur la maquette ; nous n avons QU UNE image par matiere. Normal : on
  n affiche pas de vignettes factices.
- Menu de la maquette : Monuments / Matieres / Personnalisation / La maison : revient a la question ouverte
  de la page /personnaliser/ (index) dans la zone interdite du configurateur.
- Ecart de teinte : le Bengal des maquettes (noir, veines bronze) ne ressemble pas au Bengal de notre catalogue
  (gris moucheté). A trancher : quelle image est la reference.
Contraintes a garder : configurateur et champs du devis intacts, canoniques www, JSON-LD Product et fil d Ariane,
CSS de page (pas de nouvelle classe Tailwind), pas de JS decoratif, cibles tactiles 48 px.

## Configurateur : maquettes du 28.10.2026 (ANALYSE, pas encore appliquee)
8 maquettes (4 ordinateur, 4 mobile) : etapes 01 Matiere, 02 Inscription, 03 Motifs, 04 Votre devis.
Aujourd hui : une seule longue page, les 4 sections visibles l une sous l autre, apercu a gauche sur fond clair.
Ecarts :
- Parcours en ETAPES : barre 01-04, une etape a la fois, Retour / Continuer (aujourd hui tout est visible).
- Ecran partage : panneau sombre a gauche (nom du modele en grand, apercu, legende), panneau clair a droite.
- Matiere : tuiles rectangulaires avec nom dessous, 3 colonnes (2 sur mobile), "Votre choix : Bengal".
- Inscription : cartes illustrees pour la disposition, champs en 2 colonnes, phrase sur une ligne, finitions
  en tuiles "Aa" sur pierre avec coche, lien "Placer le texte moi-meme" (mode libre garde).
- Motifs : onglets de familles, grandes cartes avec coche, "Un motif a vous" en ligne, "Sur votre stele" +
  Retirer, "Continuer sans motif". Mobile : "Agrandir l apercu" pour placer le motif (nouveau).
- Etape 4 = recapitulatif (matiere, inscription, motif, chacun avec "Modifier"), encadre "Avant toute gravure",
  bouton "Poursuivre vers le devis". La maquette ne montre pas le prix indicatif.
- Bas de page : bandeau sombre "Votre projet est conserve sur cet appareil | Devis gratuit" au lieu du pied complet.
- Mobile : apercu sombre en haut, repliable ; barre d action fixe Retour / Continuer + "Etape suivante : ...".
- "Retour au modele" remplace le fil d Ariane (page en noindex).
Limites : nos visuels sont des rendus sur fond gris (et la calibration depend de ces images) : sur le panneau
sombre, la stele reste dans un cadre clair. Le menu de la maquette (Personnalisation) n est pas applique.

