# Reception des 270 images pilotes pour le configurateur - 22.10.2026

Lecture par Claude des dossiers pilotes/, de CONTROLE-FINAL-270.json, des README/manifestes et
d'un echantillon visuel (6 modeles, 3 matieres de DOUCEUR). Aucune image modifiee.

## Ce qui est la
- 27 modeles (14 funeraires, 13 cineraires) x 10 matieres = 270 PNG de 1254 x 1254, 705 Mo dans
  docs/images-configurateur/pilotes/<famille>/<modele>/v1/, chacun avec manifest.json (SHA256).
- Matieres : bengal, rozabeta, paradiso, jablanica, royal, vizag-blue, viscount-white,
  rosso-porrino, egipat, marmara (photos d'echantillons du 19.10, textures dans matieres/).
- Qualite visuelle : fond gris neutre uniforme, monument entier vu de face avec une legere
  plongee, grain credible, pas de vase ni de fleurs. Exploitable comme fond de configurateur.
- Coherence geometrique entre matieres d'un meme modele : verifiee par superposition a 50 %
  (DOUCEUR bengal/viscount-white, puis les 6 modeles au score le plus bas) : aucun decalage visible.
  Consequence : UNE calibration par modele suffit, valable pour ses 10 matieres.

## Ce qui manque par rapport au plan (PREPARATION.md, etude Rootia)
1. Une seule vue par variante : pas de gros plan de stele (-stele). Le configurateur devra
   zoomer dans l'image du monument ; la stele y fait 450 a 650 px de large, correct sur mobile,
   un peu doux sur grand ecran. Acceptable pour un pilote.
2. Vue non strictement orthographique (legere perspective) : le texte pose a plat sur la face de
   la stele restera credible tant qu'il ne touche pas les bords ; une correction de perspective
   (homographie depuis 4 coins) est possible plus tard sans refaire les images.
3. Aucune calibration : ni largeur de stele en cm, ni zone gravable, ni coins de la face en px.
   Les dimensions physiques des 27 modeles ne sont pas validees (inventaire-modeles.json,
   dimensionsValidees = false partout).
4. Matieres : les 10 ids produits ne correspondent pas a src/data/granits.json (13 granits,
   un seul id commun : viscount-white). A trancher : quelle liste vend-on ?
5. Modeles : 27 ids internes, 12 fiches produit dans src/content/products, aucun slugSite ni
   nomPublic renseigne. Il faut la table de correspondance modele interne -> fiche publique.
6. Resolution 1254 < 1600 visee ; pas bloquant pour le web (on sert 1254 en WebP, environ
   230 Ko a 1254 px, 126 Ko a 900 px, 13 Ko en vignette 320 px, mesure sur douceur-bengal).
7. Poids du depot : 705 Mo de PNG sous docs/. Git les garde pour toujours ; a decider avant la
   prochaine sauvegarde GitHub (depot lourd a cloner, kumo-run plus lent a chaque clone).

## Ce que ca debloque
- Passe A (donnees + page statique) et passe B (canvas Konva) peuvent demarrer sur UN modele
  pilote avec ses 10 matieres, en px provisoires, sans attendre les cm.
- Les cm ne sont necessaires que pour afficher "5 cm" au lieu d'un pourcentage et pour le prix a
  la hauteur de lettre : ils s'ajoutent dans le JSON du modele quand les associes les donnent.
