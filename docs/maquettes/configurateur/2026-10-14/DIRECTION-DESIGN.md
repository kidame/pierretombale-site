# Direction design du configurateur, derivee des maquettes du 14.10.2026

Lecture des six planches par Claude le 14.10.2026. Ce document traduit les maquettes en regles
a respecter (ce qu on garde), en adaptations (ce qu on change pour coller a nos decisions) et en
points ouverts. Les maquettes restent des references : on recode, on ne reproduit pas.

## 1. Ce qu on garde tel quel (base a respecter)

### Palette
- Fond de page ivoire tres clair, cartes blanc casse, bordures gris chaud fin.
- Texte principal anthracite (pas de noir pur), texte secondaire gris moyen.
- Un seul accent : champagne / bronze mat. Il sert aux etats actifs (etape en cours, carte
  selectionnee, coche, cadre de l element selectionne sur l apercu, pastilles d etapes) et aux
  boutons secondaires (fond bronze, texte ivoire).
- Bouton principal : fond anthracite, texte ivoire, fleche a droite ("Continuer ->").
- Jamais de rouge ; les erreurs se signalent en anthracite + icone + texte.

### Typographie
- Titres en serif classique, grands (h1 d etape environ 44 px ordinateur, 32 px mobile),
  sous-titre serif plus petit. Libelles, aides et boutons en sans-serif net.
- Logo en capitales serif espacees. Kicker au-dessus du h1 en petites capitales espacees :
  "PERSONNALISATION / 01".
- Sur le site reel, les textes portent les accents (les maquettes sont en ASCII par contrainte
  d outil, pas par choix).

### Structure d ecran (ordinateur, a partir de 1024 px)
- En-tete : logo a gauche, un lien d aide a droite.
- Barre d etapes : numeros dans des cercles, etape faite = coche bronze, etape en cours = numero
  sur fond bronze + soulignement bronze, etapes a venir = cercle gris.
- Deux colonnes : a gauche l apercu (image du monument, legende "Vue du monument" ou "Apercu de
  votre stele", vignettes pour basculer monument entier / stele), a droite le panneau de choix.
- Pied de page fixe : a gauche "Estimation sur devis / Sans engagement", au centre "Etape
  suivante : ...", a droite Continuer ; Retour a gauche a partir de l etape 2 ; sous la barre,
  "Vous pourrez modifier ce choix a tout moment."

### Structure d ecran (mobile, 390 px)
- "Etape n sur N" + segments de progression bronze, h1, sous-titre, apercu pleine largeur,
  choix en grille de 3, pied fixe Retour + Continuer.

### Composants
- Nuancier granit : carreaux carres, nom dessous, selectionne = bordure bronze + coche ; sous la
  grille, nom + description courte du granit choisi + lien "Voir tous les granits".
- Motifs : filtres par famille en pastilles, cartes carrees, compteur -/1/+ sur un motif pose,
  liste "Sur votre stele" avec corbeille, aide "Deplacez les elements sur l apercu".
- Element selectionne sur l apercu : cadre fin bronze, coins marques, croix de suppression en
  haut a droite, poignee de redimensionnement en bas a droite. C est exactement ce que Konva
  (Transformer) sait faire.
- Inscription : onglets Zone 1 / 2 / 3, zone de texte avec compteur "14 / 120 caracteres",
  Police (liste), Taille des lettres (stepper, affiche en cm), Alignement (4 boutons),
  Finition (pastilles), "+ Ajouter une zone" (grise quand 3 sur 3), "Supprimer cette zone",
  encart "Verifiez les noms et les dates. La maquette definitive sera soumise a votre accord."
- Devis : recapitulatif a gauche (vignette, libelle, valeur, lien Modifier par ligne), formulaire
  a droite en deux blocs "Vos coordonnees" et "Lieu de pose", photos du lieu (3 max),
  consentement, encart "Aucune fabrication sans votre accord sur le bon a tirer."
- Confirmation : coche dans un cercle, h1, apercu "Votre projet personnalise", "Et maintenant ?"
  en 3 etapes numerotees, encart bouclier "gratuite et sans engagement", bouton "Revenir au
  site", liens "Voir mon recapitulatif" et "Une question ? Contactez-nous".

## 2. Ce qu on adapte (ecarts avec nos decisions)

1. Quatre etapes, pas cinq : Granit, Motifs, Inscription, Votre devis. L etape Options
   (planche 04) est hors v1 (docs/DECISIONS-ET-ETAT.md). On en recupere une seule chose : le
   champ "Une demande particuliere ?" (300 caracteres), deplace dans l etape Votre devis.
2. Aucun medaillon photo en v1 : retirer la carte "Medaillon photo", l ovale sur l apercu, le
   bouton "Ajouter un medaillon photo" (mobile) et la ligne "Photo" du recapitulatif.
3. Motifs en SVG transparents : les cartes de selection montrent le SVG monochrome sur le fond
   neutre de la carte, pas une photo de motif sur granit. Sur l apercu, le SVG est teinte de la
   finition choisie (blanc, dore...).
4. Le lien d en-tete "Besoin de conseil ?" avec bulle de chat devient un lien "Nous appeler"
   (telephone) ou "Contact" : pas de chat sur le site.
5. Champs obligatoires du devis : on suit docs/devis-contrat.md, pas la maquette (qui met des
   etoiles sur prenom, commune, NPA, cimetiere). Obligatoires : nom, e-mail, localite, type de
   demande, consentement. Le reste reste facultatif, telephone compris.
6. Taille des lettres : le stepper parcourt notre liste fermee (30, 40, 50, 60 mm dans
   src/data/personnalisation.ts), affichee "3 cm ... 6 cm", pas un pas libre.
7. Finitions, polices, motifs, granits viennent des fichiers de donnees existants ; la maquette
   montre "Blanc / Dore / Noir", le site montrera ce que personnalisation.ts et granits.json
   contiennent, dans cet ordre. Une finition invisible sur un granit (noir sur noir) est
   desactivee avec une aide, pas cachee.
8. Mobile : pendant l etape Inscription, l apercu reste visible (colle en haut, hauteur
   reduite) quand on tape le texte, sinon la famille ne voit pas l effet. La maquette le laisse
   defiler.
9. Contraste : le bronze ne porte jamais de texte courant petit ("Selectionne" en bronze sur
   ivoire passe mal pour un public age). Bronze = bordures, fonds de pastilles, icones ; texte
   en anthracite. Minimum 16 px, cibles tactiles 48 px, comme sur /devis/.
10. Pied de page : "Estimation sur devis" tant que tarifs.json est provisoire ; quand la grille
    sera reelle, la meme case affichera "Estimation indicative : de X a Y CHF" (passe D de
    l etude), jamais un prix ferme.
11. Textes de la maquette a ne pas reprendre tels quels : "Un conseiller vous recontacte
    rapidement" (on ne promet pas de delai), "Une matiere, un hommage singulier" (a valider avec
    les associes, trop publicitaire pour le ton decide).

## 3. Points ouverts (a trancher avec Thomas / les associes)

- Ordre des etapes : la maquette met Motifs avant Inscription. France Tombale fait pareil. On
  peut preferer Inscription d abord (c est ce que toutes les familles remplissent, les motifs
  sont facultatifs). A decider avant la passe B.
- Alignement par zone (4 boutons) : utile seulement si la zone peut etre plus large que le
  texte ; on le garde pour la v1 si Konva le rend sans effort, sinon on centre tout.
- Zones multilignes : la maquette dit "Chaque zone peut contenir plusieurs lignes". OK, mais
  le compteur reste 120 caracteres par zone, et une zone = une police + une taille + une
  finition.
- Vignettes monument / stele : besoin des deux images par granit (regles images dans
  docs/references/2026-10-14-croisement-analyses-configurateur.md).

## 4. Implications pour la construction
- Les composants ci-dessus se codent en Astro + Tailwind avec les jetons existants du theme ;
  seul l ilot Konva est du JavaScript charge sur /personnaliser/<slug>/.
- Aucune police nouvelle pour l interface : on reste sur les polices du site. Les 6 polices de
  gravure (OFL, deja chargees pour /devis/) ne se chargent que sur la page du configurateur.
- Budget de poids : la page du configurateur est la seule nouvelle page lourde ; aucune autre
  page ne doit bouger (scripts/poids-pages.py).
