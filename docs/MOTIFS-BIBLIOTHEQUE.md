# Bibliotheque de motifs du configurateur - indications (22.10.2026)

Decision de Thomas : une base de motifs simples, et pour tout le reste "sur devis" : la famille
decrit son idee ou envoie une image, Thomas dessine le motif (SVG) sur demande, valide au bon a
tirer. Ce document dit quoi mettre dans la base, comment dessiner les fichiers et comment le
"sur demande" s'integre.

## 1. Ce que font les autres (releve du 22.10.2026)
- France Tombale (Rootia) : motifs par familles (9 groupes : fleurs, religieux...), autant de
  motifs que voulu, meme plusieurs fois le meme, deplacables, symetrie, prix par motif.
- GPG Granit (guide) : trois grandes familles. Religieux (croix latine, orthodoxe, celtique,
  colombe, agneau, mains jointes, etoile de David, croissant, Vierge, ange). Nature (rose, lys,
  marguerite, chene, olivier, laurier, papillon, oiseaux, animaux domestiques, montagnes, soleil
  couchant). Passions et metiers (instruments, sports, outils, portraits, initiales). Prix cites :
  d'environ 200 EUR pour une gravure simple a plus de 2 000 EUR pour des compositions.
- Direct Monuments Funeraires : feuille d'or ou lithogravure ; motifs nommes : croix (plusieurs),
  pensee, ancre, jetee de roses, bouquet de lys et croix, rose et croix, roses et epis de ble,
  papillon, bateau, vol d'hirondelles, colombe, cle de sol, ange et coeur. Pas de prix.
- Everlife.ch (symbolique) : rose, lys, lierre, chene, arbre de vie, colombe, papillon, mains
  jointes, ancre, cercle, couronne de laurier, lyre, livre ouvert, balance ; rien de specifique a
  la Suisse dans l'article, mais la montagne, le sapin, l'edelweiss et le chamois sont attendus
  en Suisse romande (Val-de-Travers, Jura, Alpes).

Conclusion : tout le monde propose les memes 20 a 30 motifs. Ce qui distingue, c'est le motif
dessine pour la famille. C'est exactement l'offre "sur demande" de Thomas : la base reste courte.

## 2. La base v1 (14 motifs, 4 familles)
| Famille | Motifs | Pourquoi |
|---|---|---|
| Fleurs et vegetaux | rose, lys, edelweiss, branche d'olivier, epis de ble, feuille de chene | les plus demandes partout ; edelweiss et chene parlent ici |
| Foi | croix latine, colombe, mains jointes | les trois motifs religieux universels ; le reste sur demande |
| Nature et region | montagne (crete), sapin | identite Suisse romande, aucun concurrent francais ne les met en avant |
| Souvenir | coeur, papillon, infini | motifs laiques, familles jeunes, enfants |

Plus une carte "Un motif a vous" dans chaque famille (voir section 5). Les motifs de passion
(cle de sol, velo, moto, tracteur, outils, animaux...) ne sont PAS dans la base : ils sont
l'exemple type du sur demande, et chacun dessine mieux en connaissant l'histoire.

Noms de fichiers : `public/motifs/<famille>-<nom>.svg`, ex. `fleurs-rose.svg`, `foi-croix-latine.svg`.

## 3. Regles de dessin des SVG (pour Thomas, Illustrator ou Inkscape)
1. Un seul ton. La gravure est monochrome : silhouette pleine ou traits, pas de degrades, pas
   d'ombres, pas de demi-teintes. Le site colore le motif avec la finition choisie (blanc, dore).
2. Que des chemins (`<path>`). Vectoriser les traits (contour -> objet), fusionner, pas de
   `<text>`, pas d'image incorporee, pas de masque ni de filtre.
3. `fill="currentColor"` sur le groupe racine, aucune couleur codee en dur, aucun `stroke`.
4. `viewBox` au ras du dessin (pas de marge), pas d'attributs width/height : le site decide de la
   taille en cm.
5. Taille reelle : chaque motif a une largeur par defaut en cm (rose 12 cm, croix 20 cm,
   montagne 25 cm...) et une plage min/max. Le trait le plus fin doit faire au moins 1,5 mm a la
   taille minimale, sinon le graveur ne peut pas le sabler proprement. Verifier en exportant le
   motif a sa largeur min et en mesurant.
6. Symetrie : dessiner le motif orientable (une rose penchee a gauche) ; le site propose le
   miroir. Les motifs symetriques (croix, coeur) n'en ont pas besoin.
7. Fichier leger : < 10 Ko apres passage dans SVGO (`npx svgo fichier.svg`), coordonnees
   arrondies a 2 decimales, pas de metadonnees d'editeur.
8. Originaux : jamais de motif copie d'un catalogue concurrent ni d'une banque d'icones sous
   licence non commerciale. Dessins de Thomas ou domaine public retravaille.

## 4. Donnees (ce que le site lit)
`src/data/motifs.json`, une ligne par motif, lu par src/data/personnalisation.ts :
```
{ "id": "rose", "nom": "Rose", "famille": "fleurs", "fichier": "/motifs/fleurs-rose.svg",
  "largeurCm": 12, "largeurMinCm": 6, "largeurMaxCm": 30, "symetrie": true,
  "motsCles": ["fleur", "amour"], "disponible": true }
```
Familles dans le meme fichier : `{ "id": "fleurs", "nom": "Fleurs et vegetaux", "ordre": 1 }`.
Ajouter un motif = deposer le SVG + une ligne JSON. Le build echoue si le fichier manque.
Prix : par motif dans tarifs.json quand la grille existera ; d'ici la, "compris dans le devis".

## 5. "Un motif a vous" (sur demande)
Dans le configurateur, derniere carte de chaque famille : "Un motif a vous : decrivez-le ou
envoyez une image, nous le dessinons pour vous." En cliquant :
- un cadre en pointilles "Motif a creer" se pose sur la stele, deplacable et redimensionnable
  comme un motif (il fixe l'emplacement et la taille voulus) ;
- un champ texte (300 caracteres) : "Decrivez votre idee" ;
- un envoi de fichier (photo, dessin, logo ; jpg, png, pdf, svg ; 8 Mo max, les memes regles que
  le formulaire de devis) ;
- mention : "Nous vous proposons un dessin avec le devis ; rien n'est grave sans votre accord."
A l'envoi du devis : description, fichier, position et taille en cm partent dans le mail
interne ; Thomas dessine le SVG, l'ajoute au projet (ou a la base s'il est reutilisable) et
le bon a tirer montre le resultat. Aucune promesse de delai ni de prix sur le site.

## 6. Ordre de travail
1. Thomas dessine les 14 SVG de base selon la section 3 (ou valide que Claude en fasse des
   versions simples provisoires, a remplacer).
2. Claude cree motifs.json et branche la passe C : familles, pose, deplacement, taille en cm,
   miroir, "Un motif a vous".
3. Les prix par motif attendent la grille de l'atelier (passe D).

## 7. Chaine de production retenue (22.10.2026)
Image generee par ChatGPT (prompt : noir pur sur blanc pur, style pochoir, 2048 px) ->

(potrace, seuil 128, nettoyage des miettes, simplification, 1 unite = 1 mm) -> ligne dans
src/data/motifs.json. Controle visuel en blanc sur pierre sombre et en noir sur pierre claire.
Premiers resultats : rose, lys, edelweiss, olivier, ble, chene, croix latine, colombe, mains
jointes, montagne. Les vides blancs les plus fins (nervures) font 0,3 a 0,6 mm a la largeur
par defaut : le graveur dira si c est sablable ou s il faut poser ces motifs plus grands
(largeurMinCm a ajuster).
