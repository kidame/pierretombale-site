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
- `src/config/site.ts` : navigation, modeles montres sur l'accueil (`featured.homepageVitrine`).

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
- IMAGES DE L'ACCUEIL PROVISOIRES : nos rendus de catalogue sont sur fond gris clair, pas dans des
  scenes sombres comme sur les maquettes. Hero, collection : rendus du catalogue ; matiere et
  personnalisation : textures des matieres (480 px, agrandies) et motif d'olivier en masque CSS.
  A remplacer par de vraies photos (hero sombre, gros plan de la matiere, gros plan d'une
  gravure) : deposer les fichiers dans `public/images/accueil/` et changer les `src` de index.astro.
