# Textures de reference v1 - 19.10.2026

10 images generees avec imagegen integre, une par photo d'echantillon.
PNG RGB, 1254 x 1254 px reels. Originaux photographiques conserves dans ../originaux/.
Controle visuel : surfaces a plat, sans etiquette, bord de dalle ni ombre de camera.
Transfert VPS verifie par SHA-256 contre les fichiers generes.

## Correspondance

| Identifiant de matiere | Texture / futur selecteur | Photo source |
|---|---|---|
| rozabeta | [rozabeta-texture-v1.png](rozabeta-texture-v1.png) | [rozabeta.jpeg](../originaux/rozabeta.jpeg) |
| paradiso | [paradiso-texture-v1.png](paradiso-texture-v1.png) | [paradiso.jpeg](../originaux/paradiso.jpeg) |
| jablanica | [jablanica-texture-v1.png](jablanica-texture-v1.png) | [jablanica.jpeg](../originaux/jablanica.jpeg) |
| royal | [royal-texture-v1.png](royal-texture-v1.png) | [royal.jpeg](../originaux/royal.jpeg) |
| vizag-blue | [vizag-blue-texture-v1.png](vizag-blue-texture-v1.png) | [vizag-blue.jpeg](../originaux/vizag-blue.jpeg) |
| viscount-white | [viscount-white-texture-v1.png](viscount-white-texture-v1.png) | [viscount-white.jpeg](../originaux/viscount-white.jpeg) |
| rosso-porrino | [rosso-porrino-texture-v1.png](rosso-porrino-texture-v1.png) | [rosso-porrino.jpeg](../originaux/rosso-porrino.jpeg) |
| egipat | [egipat-texture-v1.png](egipat-texture-v1.png) | [egipat.jpeg](../originaux/egipat.jpeg) |
| bengal | [bengal-texture-v1.png](bengal-texture-v1.png) | [bengal.jpeg](../originaux/bengal.jpeg) |
| marmara | [marmara-texture-v1.png](marmara-texture-v1.png) | [marmara.jpeg](../originaux/marmara.jpeg) |

## Utilisation

Ces images servent de references visuelles pour decliner les monuments et de base aux
vignettes du selecteur de matiere. Le choix d'une vignette doit afficher la variante
du modele portant le meme identifiant de matiere, comme un choix de couleur en e-commerce.
Le site ne doit jamais afficher l'image d'une autre matiere par repli silencieux.

Les identifiants sont reserves pour ce lot. Leur integration dans src/data/granits.json
reste a faire avec la reconciliation de l'ancienne liste provisoire. Ne pas creer
une seconde liste de vente independante. Le manifeste de ce dossier est un inventaire
de production, pas la configuration runtime.

Nommage des futures images :
- <modele>-<matiere>.jpg : monument entier.
- <modele>-<matiere>-stele.jpg : composition sur stele.
- <modele>-<matiere>-dalle.jpg : surface de composition des modeles sans stele, si adaptee.
- <modele>-<matiere>-vue-01.jpg : vue alternative de presentation.

Classer par famille, puis modele, puis matiere. Chaque variante reference explicitement
modeleId, matiereId et ses chemins d'images. Garder le nom public distinct du nom interne.
Une combinaison non produite ou incompatible ne doit pas etre proposee dans le selecteur.
Cible annoncee par Thomas : 10 materiaux pour chaque modele funeraire et cineraire.
Pour les 27 references internes existantes, cela represente 270 combinaisons candidates,
a rapprocher des modeles publics et des compatibilites reelles (bicolores, acier, dalles).

## Limites a conserver dans le suivi

References synthetiques, sans calibration colorimetrique ni echelle physique mesuree.
La couleur et le grain sont interpretes a partir de photos : validation sur echantillon
reel avant usage commercial. Raccord bord a bord non garanti ; aucune carte PBR
(normal, roughness, displacement) n'est fournie. Ne pas etirer une texture pour couvrir
arbitrairement un monument. Respecter le sens du veinage, notamment Marmara.

Les vues finales du configurateur suivent ../../../PREPARATION.md : cadrage et geometrie
fixes par modele, stele nue, face orthographique, deux vues, au moins 1600 px de large.
Ces textures 1254 px sont des references, pas les vues finales des monuments.
Un essai sur un modele pilote precede la serie. Les zones gravables necessitent les cotes
du modele et leur calibration, qu'une generation IA ne garantit pas a elle seule.

ROSSO PORRINO et VIZAG BLUE : lecture des etiquettes usees a confirmer.
Aucun monument ni aucune declinaison de monument genere a cette etape.

## Prompt employe

Un appel par matiere avec sa photographie comme unique reference. Demande de texture
carree 2048 x 2048 (sortie effective 1254 x 1254), plein cadre, photorealiste, vue
orthographique, conservation des couleurs, formes minerales, grain relatif et sens du
veinage. Suppression des etiquettes, bords, tissu, ombres, rayures et reflets directs,
reconstruction par une texture naturelle coherente. Eclairage diffus neutre uniforme,
sans gradient, vignettage, texte, watermark, symetrie artificielle ni veines ajoutees.
