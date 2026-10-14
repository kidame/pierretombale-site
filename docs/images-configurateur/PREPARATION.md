# Preparation des images du configurateur
Date : 14.10.2026. Statut : preparation seulement, aucune generation autorisee.
Cette specification precise les regles images de Thomas et remplace les formulations
moins strictes des anciennes notes sur ce sujet. Aucun changement du site en service.

## 1. Ce qui existe et ce qui reste a confirmer
- 27 references internes : 14 funeraires, 13 cineraires. Inventaire dans
  `inventaire-modeles.json`. Les 27 images luxe deja produites sont des references
  de presentation, pas des fonds calibres pour le configurateur.
- Le site possede actuellement 12 fiches : correspondance avec les 27 references
  a valider, sans creer automatiquement 27 nouvelles fiches ni doublons.
- `src/data/granits.json` reste l'unique registre des ids de granit. Ses 13 entrees
  actuelles ne constituent PAS la liste finale confirmee par Thomas.
  Ne pas deduire la gamme finale des captures, des couleurs ou de disponible=true.
- Les noms des fichiers actuels servent de reperes internes. Les noms publics et
  slugs descriptifs du site doivent etre confirmes avant le nommage de production.
  Ne pas publier automatiquement les noms de reference du fournisseur.
- Dimensions, surfaces gravables, associations de granits et nombre de vues
  alternatives : inconnus. Valeurs null ou listes vides, jamais estimees depuis les images.

## 2. Deux livrables techniques par combinaison validee
| Role | Fichier | Prise de vue |
| --- | --- | --- |
| Monument entier | <modele>-<granit>.jpg | Face orthographique, monument complet |
| Composition | <modele>-<granit>-stele.jpg | Face de la stele, orthographique, gros plan |
| Galerie alternative | <modele>-<granit>-vue-01.jpg etc. | Angle defini et repete entre granits |

Les deux livrables techniques sont nus, fond gris clair uni, ombre legere. Aucun
texte, motif optionnel, fleur, vase ou accessoire amovible. Ne pas effacer une partie
structurelle du produit : isoler les sculptures fixes et inserts dans les exclusions.
Pas de reflet d'un accessoire supprime. Eclairage doux lisible, sans reflet qui masque
la gravure. La direction luxe noire peut servir aux alternatives de galerie ; celles-ci
ne sont jamais des fonds de composition ni une source de mesures.

Proposition de sortie : JPEG sRGB 2000 x 2000 px (minimum obligatoire : 1600 px de large).
Un autre ratio peut etre valide pour un modele avant le master, puis il est fige.
Conserver les masters sans perte et leurs masques. Le JPEG n'est pas transparent.
Les versions WebP/AVIF et petites tailles seront derivees pour le site, sans recadrage.
Aucun upscale ne remplace une geometrie correcte ou une texture exploitable.

Meme modele + meme vue = exactement meme taille de fichier en pixels, cadrage,
camera, echelle, origine, silhouette et placement pour chaque granit. L'echelle
peut differer entre monument entier et gros plan, mais chacune est calibree et figee.
Pas d'autocadrage individuel. Entre modeles differents, ne pas imposer une taille
apparente unique qui ferait confondre leurs dimensions reelles.

## 3. Exceptions a traiter avant production
- Sans stele (Almandin, tombale simple, 4 pieces sans stele, CIN-Tombale) :
  ne pas inventer une stele. Si la dalle est gravable, second livrable
  `<modele>-<granit>-dalle.jpg`, vue orthographique perpendiculaire a la dalle
  (vue de dessus pour une dalle horizontale). Sinon, pas de composition sur ce modele.
- Acier ajoure (CIN-Nivora) : l'arbre n'est pas une surface pleine de granit.
  Confirmer la surface personnalisable (coeur, plaque ou socle). Ne pas recolorer
  l'acier avec la texture de granit et ne jamais autoriser du texte dans les vides.
- Stele inclinee : camera perpendiculaire au plan gravable pour le gros plan.
  Le monument entier et le gros plan ont des calibrations distinctes.
- Coeurs, montagnes, courbes, sculptures : polygone gravable et trous/exclusions,
  pas seulement un rectangle englobant.
- Bicolores : nommer les parties materiau A/B, les inserts fixes et les finitions.
  Confirmer si seul le granit principal varie. Si deux parties varient independamment,
  chaque association recoit un variant_id et un sous-dossier propres pour eviter
  des collisions ; les ids de chaque granit viennent toujours du registre.
- Un meme modele ayant plusieurs tailles ou geometries exige un nouveau master
  et une nouvelle calibration. La calibration n'est mutualisee que si la forme
  ET les dimensions restent identiques.

## 4. Master et calibration, definis une seule fois
Obtenir un plan cote ou des mesures validees : stele largeur/hauteur/epaisseur,
socle, dalle et encombrement. 100 x 200 et 60 x 60 sont des encombrements de capture,
pas les dimensions des steles et pas une mesure de fabrication validee.

Fournir les zones en cm pour la collecte. Pour rester compatible avec le site,
les donnees physiques canoniques sont en mm (1 cm = 10 mm). Les pourcentages ou
pixels sont des derives de calibration, jamais une seconde definition editable.

Repere du plan gravable : origine au coin haut gauche de sa boite englobante,
x vers la droite, y vers le bas. Chaque contour et exclusion est exprime en mm.
La marge de securite est fournie par le graveur, sans valeur inventee.

Pour chaque vue orthographique : largeur/hauteur image en px, position de l'origine
physique dans l'image (x0, y0), facteur s en px/mm, version de geometrie.
Projection : x_px = x0 + s*x_mm ; y_px = y0 + s*y_mm. Un seul s pour x et y :
aucun etirement. Chaque vue a son propre x0, y0 et s.
Ces metadonnees de projection peuvent etre en pixels ; les positions de la
composition (textes, motifs) restent en mm. Au redimensionnement mobile, image
et calques recoivent ensemble la meme transformation, sans object-fit: cover.

Si une vue alternative en perspective doit un jour afficher la composition :
projection specifique du plan a calculer, jamais reutiliser directement les
coordonnees pixels du gros plan. Hors perimetre de cette preparation.

Le gabarit `gabarit-modele.json` sert de fiche a remplir par modele, hors runtime.
Le changement de granit ne change ni la geometrie, ni les zones, ni la composition.
Un changement de forme doit invalider la calibration precedente.

## 5. Dossiers de production proposes
Conserver les references actuelles dans leur dossier existant.
Creer lors du lancement, sans deplacer ni ecraser les images existantes :
- Funeraire/<modele>/master/ et Cineraire/<modele>/master/ : fichiers sources,
  masques, calibration et fiche de validation.
- <famille>/<modele>/<granit>/ : les deux JPEG techniques et les vues alternatives.
- <famille>/<modele>/associations/<variant_id>/ : seulement pour les combinaisons
  bicolores independantes, avec manifeste indiquant chaque id de granit.
Minuscules ASCII et tirets pour modele, granit et variant_id ; identifiants stables.
Ne pas utiliser les alias internes tels que CORAZON comme slug public par defaut.
La famille documentaire Funeraire correspond a `famille: monument` dans le site.

## 6. Methode et ordre de production apres feu vert
1. Thomas fournit la liste finale de materiaux, les echantillons et les compatibilites.
   Photographier les echantillons avec repere d'echelle, lumiere neutre et finition
   connue ; relever sens des veines et dimensions physiques du champ photographie.
2. Valider les 27 correspondances, les noms publics, dimensions et zones par modele.
   Une reference non confirmee reste bloquee.
3. Choisir les angles de galerie une fois et inscrire leur nombre A dans le plan.
4. Produire UN master nu par modele avec geometrie, deux cameras et eclairage verrouilles.
   Choisir comme pilote un modele simple et un cas difficile (ajoure ou bicolore).
5. Valider le pilote sur deux materiaux tres differents lorsqu'ils seront connus.
   La seule variation autorisee est la matiere, sa couleur, son grain et sa reponse
   a la lumiere ; pas la silhouette ou le cadrage.
6. Decliner uniquement les couples modele/granit confirmes. Produire les deux vues
   et les alternatives depuis la meme version du master.
7. Controler chaque livraison puis renseigner les chemins et validations.
   Integrer au site uniquement les variantes approuvees.

Voie securisee recommandee : master 3D cote ou rendus orthographiques de l'atelier,
camera verrouillee, changement de materiau puis rendus repetables.
Voie experimentale : retouche IA masquee depuis un master unique avec contour
verrouille, suivie du meme controle. Un prompt identique ne garantit pas le
recalage ; regenerer chaque granit independamment est exclu pour la composition.
Aucune de ces voies n'est lancee maintenant.

## 7. Controle d'acceptation
- Dimensions image >= 1600 px de large, ratio et taille identiques au master.
- A 50% d'opacite ou en difference de masques : silhouettes et reperes superposes,
  aucun decalage admis apres recalage ; ignorer les differences de texture.
- Meme zone physique et meme projection sur chaque granit, pas de trou gravable.
- Simulation avec texte et motif de test aux limites, sur fond clair et sombre :
  positions en mm identiques lors du changement de granit et du zoom.
- Champ entier, aucune coupe, aucun accessoire, motif optionnel ou reflet parasite.
- Grain et veines a une echelle plausible, materiaux des inserts respectes.
- Concordance nom de fichier / id du registre / modele / surface et absence de
  collision. Paire complete, ou exception sans stele explicitement validee.
- Validation geometrie par atelier, validation zones par graveur et validation
  visuelle par Thomas avant integration. Le rendu reste indicatif ; BAT obligatoire.

## 8. Quantites et conditions de lancement
Soit C le nombre de combinaisons reellement confirmees. Pour les combinaisons
avec surface personnalisable, compter 2*C images techniques, plus la somme des
vues alternatives choisies. Si A est constant : (2+A)*C. Ne pas calculer 27 fois
le nombre de granits sans verifier les compatibilites et les bicolores.
Une variante non personnalisable a une seule vue technique ; documenter l'exception.

Lancement bloque tant que gamme finale, cotes, zones, masters et correspondances
ne sont pas valides. Le registre de preparation contient volontairement zero
declinaison planifiee. Pas de generation, de build, de deploiement ou de modification
de `granits.json` dans cette session.
