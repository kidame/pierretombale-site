# Etude technique : le configurateur de France Tombale (page Rootia)

Releve du 14.10.2026 sur https://www.france-tombale.fr/rootia.html, par lecture du HTML servi et
du bundle JavaScript public (configurator.bundle.min.js, 477 Ko, 165 Ko compresse). Aucun code
n a ete copie et ne doit l etre : ce document decrit le fonctionnement pour le REFAIRE chez nous,
avec nos outils et nos donnees. Le code de France Tombale est leur propriete ; les mecanismes
(canvas 2D, zones de texte, grille de prix) sont des techniques generiques.

## 1. Ce qu ils utilisent, verifie

| Brique | Chez France Tombale | Preuve |
|---|---|---|
| Boutique | Magento 2 avec le theme Hyva | chemins /static/.../hyva/, customer/account |
| Module | FranceTombale_Configurator, developpement maison (agence Algo Factory) | nom du bundle, "Realisation Algo Factory" en pied de page |
| Interactivite | Alpine.js (composants ftMonument, ftGravure, ftGravureVase, ftMedaillonModal, ftChronogravure...) | Alpine.data(...) dans le bundle |
| Rendu de l apercu | Fabric.js 7.4.0, canvas 2D, licence MIT | version "7.4.0" et classes Fabric dans le bundle ; pas de 3D, WebGL seulement pour les filtres image de Fabric |
| Images du monument | une PHOTO par granit (43 variantes : rootia-<granit>.jpg et rootia-<granit>-stele.jpg) | base_image.by_first_value, motif_image_by_granit |
| Polices de gravure | 5 polices chargees en @font-face (.woff) : Minion, Amazon, Monotype Corsiva, Raphael, Commercial Script | HTML de la page |
| Donnees | un JSON par produit injecte dans la page : <script type="application/json" id="ft-configurator-config"> | HTML de la page |
| Envoi | POST vers /devis/product/ajax/ (pre-devis), /devis/product/save/, /devis/majoration/ajax/ ; upload des photos de medaillon vers une URL dediee | cle "terminal" du JSON, FormData dans le bundle |
| Export | canvas.toDataURL("image/png", 0.8, multiplier 1) + canvas.toObject() (JSON de la scene) envoyes avec la demande | fonction d envoi dans le bundle |

En clair : ce n est PAS de la 3D. C est une photo du monument dans le granit choisi, sur laquelle
un canvas 2D superpose du texte, des motifs et un medaillon, a l echelle.

## 2. Comment ca marche, etape par etape

Tunnel en 5 etapes (objet "etape", "maxEtape": 5, "etapesValidees") :
1. Granit : liste de 12 granits avec supplement de prix (0 a +2 100 EUR) et etat de stock ;
   choisir un granit change la photo de fond (by_first_value[id granit]) et la variante produit
   (variant_by_granit) ; "Voir le rendu" = la photo du monument dans ce granit.
2. Medaillon photo (porcelaine) : famille de forme (rectangle, ovale, coeur...), taille, photo
   envoyee par la famille, couleur (sepia / noir et blanc), filet (sans, or, blanc), orientation.
   Techniquement : un masque SVG + une ombre + un fond + une finition par forme, et la photo que
   la famille deplace et redimensionne avec des poignees dans le masque. 45 combinaisons
   forme x taille avec prix et delai chacune.
3. Gravure : jusqu a 3 "zones" de texte (maxZones), 120 caracteres max (maxChars), une police
   parmi 5, une finition (or sable, blanc, noir) avec prix par caractere (price_per_char 10),
   des motifs par familles (9 groupes : fleurs, religieux...), chaque motif pose sur le canvas,
   deplacable, avec symetrie. Le texte est un objet Fabric lie a sa zone (ft_zone_id).
4. Complements (articles additionnels : fleurs, vase...) avec bouton "passer".
5. Recapitulatif + formulaire de contact (nom, email, tel, code postal valide sur 5 chiffres),
   total estime, puis envoi. Un identifiant de devis (quote_id) revient du serveur.

### L echelle, le point technique central
- Le JSON donne largeur_stele_cm (70 pour Rootia).
- Au chargement, le code mesure la largeur en pixels de la photo affichee et calcule
  pxPerCm = largeur_image_px / largeur_stele_cm. Toute taille de texte est donc exprimee en
  centimetres reels puis convertie en pixels. Quand la fenetre change, il recalcule et
  redimensionne la scene (evenement "ft-echelle-canvas").
- Consequence pour l atelier : ils savent que "Minion 6 cm" veut dire 6 cm sur la pierre.

### Le prix, calcule cote navigateur puis recalcule cote serveur
- base_price du monument + supplement du granit choisi.
- Gravure : grille par TRANCHES de hauteur de lettres (seuil gravure_letter_threshold_cm entre
  "small" et "large") et par finition (or ou non), avec un prix forfaitaire pour les 50 premiers
  caracteres puis un prix par caractere au-dela ("text_price_50_more"). Une grille differente
  pour les jardinieres (priceGrid "jardiniere").
- Medaillon : prix de la combinaison forme x taille, + supplement couleur.
- Motifs : prix par motif, certains offerts (offeredTextsAndPatterns).
- Pose : forfait (799 EUR) affiche a part. Delais : objet "delais" par produit.
- Le serveur refait le calcul a la reception (majorationUrl) : le prix du navigateur n est
  jamais la reference.

### Ce qui part a l envoi
FormData : identifiants produit et granit, zones de texte (texte, police, finition, position),
motifs choisis (motif_ids), medaillon (forme, taille, photo deja uploadee), complements, pose,
coordonnees, photos du devis, PLUS l image PNG de l apercu et le JSON complet de la scene
(positions, tailles, polices). Le JSON permet de rouvrir la maquette cote atelier.

### Details d ergonomie observes dans le code
- Avertissement avant de quitter la page si une personnalisation a commence (enableLeavingWarning).
- "Flash" d alerte quand on depasse le nombre de zones.
- Le canvas est vide tant qu aucun texte n est saisi ; la zone active est mise en avant (focus).
- Texte limite a 120 caracteres pour toutes les zones.
- Symetrie horizontale d un motif (flipX).

## 3. Ce qu on refait pareil, ce qu on fait autrement

### Pareil (c est la bonne architecture pour nous)
- Canvas 2D sur une photo par granit, pas de 3D.
- Un JSON de configuration par modele, genere au build depuis nos fiches (pas injecte par une boutique).
- Echelle en centimetres reels a partir de la largeur de la stele.
- Zones de texte limitees, police par monument, finition, motifs d une bibliotheque.
- Export PNG + JSON de la scene joints a la demande, recalcul du prix cote serveur.
- Tunnel en etapes avec recapitulatif et avertissement avant de quitter.

### Autrement
- Moteur : Konva (decide dans la spec, Astro + ilot) plutot que Fabric. Les deux font la meme
  chose ; Konva est plus leger (environ 55 Ko compresse contre 165 Ko pour leur bundle) et sa
  demo officielle couvre deja texte deplacable + export. Fabric 7 reste une option valable (MIT)
  si Konva bloque sur un point : a decider a la premiere passe, pas avant.
- Pas de Magento : les donnees viennent de src/content/products, granits.json, tarifs.json,
  personnalisation.ts ; le build Astro ecrit le JSON de chaque modele.
- Pas de paiement, pas de panier : le tunnel se termine par la demande de devis existante
  (docs/devis-contrat.md), a laquelle on ajoute apercu PNG + JSON de scene + prix estime.
- Pas de medaillon photo en v1 (c est la partie la plus lourde de leur code : masques, upload,
  recadrage, 45 combinaisons). A prevoir en v2 si l atelier le propose.
- Polices : les 6 polices OFL deja choisies (les leurs sont des polices commerciales, on ne
  peut pas les reprendre).
- Prix : notre grille vit dans tarifs.json ; tant qu elle est provisoire, l estimation affiche
  "indicatif" et le mail interne porte le detail du calcul.

## 4. Ce qu il nous faut AVANT de coder (a fournir par Thomas / les associes)
1. Une photo (ou rendu IA) de chaque modele dans chaque granit propose, prise de face, cadrage
   identique pour un meme modele, fond neutre. C est ce qui rend leur outil credible : 43 photos
   pour UN modele. Pour nous : 12 modeles x 13 granits = 156 images si tout est propose ; on
   peut commencer avec 3 modeles x 4 granits.
2. Pour chaque modele : largeur reelle de la stele en cm, et la zone gravable (rectangle en cm
   dans le repere de la photo). C est la calibration de l echelle.
3. Les hauteurs de lettres gravables (30/40/50/60 mm deja supposees), les finitions reelles,
   et le prix de la gravure (forfait + par caractere, ou par ligne : a choisir avec l atelier).
4. La bibliotheque de motifs (SVG monochromes, les notres ou libres de droits) avec prix.
5. Le nombre max de zones de texte (eux : 3, 120 caracteres).

## 5. Ordre de construction propose (chaque passe = build + commit + test navigateur)
A. Donnees : schema configurateur.json par modele (largeur_cm, zone_gravable_cm, images par
   granit), genere au build ; page /personnaliser/<slug>/ statique (texte indexable, sans canvas).
B. Canvas Konva en ilot charge sur cette page seulement : photo par granit + echelle en cm +
   1 zone de texte dans la police choisie, deplacable dans la zone gravable, tailles en cm.
C. Zones multiples (max 3), finition (couleur), motifs SVG poses et deplacables, symetrie.
D. Prix estime en direct depuis tarifs.json (meme regles que la page prix), affiche "indicatif".
E. Export PNG (multiplier 2 max pour iOS) + JSON de scene ; branchement sur le formulaire de
   devis existant (champs supplementaires dans docs/devis-contrat.md) ; recapitulatif.
F. Avertissement avant de quitter, brouillon, mobile (pinch non necessaire : poignees).
Mesure de poids a chaque passe : aucune autre page ne doit changer (scripts/poids-pages.py).

## 6. Sources
- https://www.france-tombale.fr/rootia.html (HTML, JSON ft-configurator-config)
- https://static.france-tombale.fr/.../FranceTombale_Configurator/js/configurator.bundle.min.js
- Fabric.js : https://fabricjs.com (MIT) ; Konva : https://konvajs.org (MIT)
