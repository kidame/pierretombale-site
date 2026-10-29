# Brief lot 2 : pages cimetières (29.10.2026)

Analyse : analyses/2026-10-29-seo-pages-cimetieres.md (à lire d'abord).
SOURCES UNIQUES DU CONTENU :
- docs/DIMENSIONS-MONUMENTS.md (règles, dimensions, articles, contacts, 24 communes) ;
- docs/REGLEMENTS-CIMETIERES-NE.md (détails, tarifs officiels, rapports) ;
- docs/CIMETIERES-PRATIQUE.md (adresse, accès, horaires, équipements, histoire).
Ce qui n'y figure pas n'est PAS écrit. "non trouvé" = rien sur la page. "?" = ne pas afficher
de valeur (afficher "à demander à l'office" ou omettre). Info "(tiers)" : omettre.

## 1. Données : src/data/cimetieres.ts (une seule source)
- Type `Cimetiere` : slug, nom (ex. "Cimetière de Beauregard"), commune, localites[],
  titreSeo, description (meta, 150-160 caractères), chapo, adresse?, horaires?, contact
  {service, adresse, telephone, email?, horaires?, url?}, acces[]?, equipements[],
  histoire[]?, regles {delaiPose, periodeInterdite?, tombes: [{type, dimensions, hauteurMax?,
  article}], bordure, materiaux?, autorisation?, taxePose?, obligations[]}, cineraire[]
  (niches, jardin du souvenir, urnes), tarifs? {date, source, lignes: [{prestation, domicilie,
  exterieur}]}, duree (désaffectation, reprise du monument), entretien?, faq [{question,
  reponse}], sources: SourceId[] (src/data/cimetieres-ne.ts, à compléter avec les nouveaux
  documents), verifieLe.
- Liste `COMMUNES_NE` pour le hub : les 24 communes (tableau du point 4 de
  docs/DIMENSIONS-MONUMENTS.md) : commune, cimetière, délai, tombe adulte, hauteur max,
  bordure, cinéraire, texte (titre + date + URL), slug de page si elle existe.
- En-tête de fichier : comment ajouter ou corriger une commune (Thomas modifiera ici).
- Pas de prix de l'entreprise, jamais (tarifs.json reste à part).

## 2. Pages
- src/pages/cimetieres/index.astro (hub) et src/pages/cimetieres/[slug].astro (une seule
  mise en page, getStaticPaths depuis les données).
- Slugs : beauregard-neuchatel, la-chaux-de-fonds, peseux, corcelles-cormondreche,
  le-landeron, boudry, cortaillod, le-locle, val-de-travers.
- Titres (pageTitle) et h1, exemples : "Cimetière de Beauregard à Neuchâtel : accès, horaires,
  monuments" ; "Cimetière de La Chaux-de-Fonds (la Charrière) : accès, crématoire, monuments" ;
  "Cimetière de Peseux : accès, columbarium, règles des monuments". Hub : "Cimetières du
  canton de Neuchâtel : dimensions des tombes et règles de pose".

## 3. Mise en page d'une page cimetière (mobile d'abord)
1. Fil d'Ariane (Accueil > Cimetières > nom). H1. Chapô de 2 phrases. MentionVerification.
   Ligne discrète : "Page d'information indépendante, rédigée par PierreTombale.ch. Pour les
   démarches officielles : [nom du service] (lien)." On ne se présente jamais comme la commune.
2. Bloc "L'essentiel" (carte en haut, lisible sur téléphone) : adresse + lien "Itinéraire"
   (https://www.google.com/maps/search/?api=1&query=<nom + localité encodés>), horaires,
   téléphone cliquable (tel:), accès bus/parking, puis 3 chiffres clés : délai avant la pose,
   tombe d'adulte maximale, hauteur maximale (ou "fixée par l'office" si inconnue).
3. Sommaire court (ancres) quand la page a plus de 4 sections.
4. "Sur place" : équipements (chapelle, crématoire, columbarium, jardin du souvenir, quartiers,
   cérémonies) + histoire/patrimoine si disponible (1 à 3 phrases, sources).
5. "Poser un monument" : délai, période interdite, tableau des dimensions (adulte, enfant,
   cinéraire ; dalle/stèle/croix si connu), bordure, matériaux, autorisation et pièces,
   taxe de pose, mentions obligatoires (jalon, nom du marbrier). Chaque règle avec l'article.
   Phrase fixe à la fin : "Nos monuments sont réalisés sur mesure, aux dimensions autorisées
   dans ce cimetière ; nous vérifions le règlement et nous déposons la demande de pose."
6. "Urnes, columbarium et jardin du souvenir" + tableau des tarifs officiels quand il existe
   (avec date de l'arrêté et lien ; "taxes communales, pas des prix de monument").
7. "Durée de la tombe et reprise du monument" ; "Entretien" si données.
8. FAQ propre au cimetière (4 à 6 questions réelles : horaires, accès, délai de pose, taille
   de pierre tombale autorisée, prix d'une niche, carré confessionnel si documenté...).
   Même texte affiché et en JSON-LD FAQPage (modèle de src/pages/faq.astro et des guides).
9. Appel : "Un monument pour ce cimetière" : texte court + bouton "Demander un devis" vers
   /devis/?commune=<commune>&cimetiere=<nom court> + lien vers la famille de monuments.
10. "Documents officiels" (liste des sources) ; "Autres cimetières" (liens) ; lien vers
    /guides/quand-poser-une-pierre-tombale/ et /guides/columbarium-cavurne-jardin-du-souvenir/.
- JSON-LD : BreadcrumbList, FAQPage, et WebPage avec "about" {"@type": "Cemetery", name,
  address (si connue)}. Pas d'avis, pas de note, pas de coordonnées inventées.
- Hub : chapô (pas de règle nationale, c'est la commune qui décide, 30 ans minimum de la loi
  cantonale), cartes des 9 pages, puis tableau des 24 communes (sur mobile : liste en cartes,
  pas de tableau qui déborde), puis "Les constantes du canton" (point 2 de
  DIMENSIONS-MONUMENTS), FAQ du hub ("Quelle est la taille maximale d'une pierre tombale dans
  le canton de Neuchâtel ?", "Faut-il une autorisation ?", "Quel délai avant de poser ?",
  "Qui vérifie les dimensions ?"), appel au devis.

## 4. Devis : pré-remplissage
- src/pages/devis.astro lit déjà ?modele. Ajouter ?commune et ?cimetiere : si présents,
  remplir les champs communeCimetiere et cimetiere (sans écraser une saisie). Test vitest si
  la logique est extraite dans un module testable.

## 5. Maillage
- Pied de page : lien "Cimetières" (src/config/site.ts, rubrique Informations, à côté de
  "Guides").
- Note des fiches modèles (src/components/FicheModele.astro, .specs-note) : le lien pointe
  vers /cimetieres/ avec le libellé "Les règles des cimetières neuchâtelois".
- Guide "quand poser" : le nom de chaque commune du tableau renvoie à sa page quand elle
  existe ; index des guides : une ligne vers /cimetieres/.

## 6. Règles de rédaction (identiques au lot 1)
- Français, ton sobre et chaleureux, phrases courtes, vouvoiement. Aucun superlatif
  commercial. Aucune mention de fabrication ni de lieu de fabrication ("réalisé sur mesure"
  est la formule du site). Aucun prix de l'entreprise.
- Jamais d'affirmation sans commune + article ou source du fichier. Les montants sont des
  taxes communales datées.
- Contradictions connues : ne pas publier "20 ans" pour Cornaux/Cressier (hors lot) ; Cressier
  140 cm hors lot. Beauregard : adresse n° 28.
- Pas de tiret long, pas d'apostrophe courbe, pas de guillemets anglais courbes dans le HTML
  produit (les guillemets « » français sont admis).
- Pas d'image ni de JS (sauf le pré-remplissage du devis). Pas de carte intégrée.
- Contenu unique par page : ne pas recopier les mêmes paragraphes d'une page à l'autre, sauf
  la phrase fixe du point 3.5 et la mention de vérification.

## 7. Contrôles avant de rendre la main
- npm run build (lancé par kumo-run dans l'unité plafonnée) et npm test verts ; npx astro check.
- Un seul h1 par page ; titles et descriptions uniques ; URLs dans le sitemap ; canoniques www.
- Test vitest : chaque cimetière a slug unique, titreSeo <= 65 caractères, description
  120-160, au moins 4 FAQ, au moins une source, verifieLe présent.
- Grep du dist : aucun "fabri", aucun tiret long, aucune apostrophe courbe.
- Un commit par étape (données, mise en page, hub, devis, maillage, ETAT/BACKLOG).
  NE PAS POUSSER. Mettre à jour ETAT.md et docs/BACKLOG.md.

## 8. Découpage en deux passes (limite de 30 minutes par agent)
- PASSE A : données (type, COMMUNES_NE complète, fiches Beauregard, La Chaux-de-Fonds,
  Peseux, Corcelles-Cormondrèche), mise en page [slug].astro, hub, pré-remplissage du devis,
  maillage, test vitest, ETAT/BACKLOG. Les 5 autres cimetières : ne pas créer de fiche vide.
- PASSE B : fiches Le Landeron, Boudry, Cortaillod, Le Locle, Val-de-Travers dans le même
  fichier de données, en suivant exactement le format des 4 premières.
