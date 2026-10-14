# Croisement des deux analyses du configurateur Rootia (14.10.2026)

Deux sources complementaires :
- `2026-10-14-analyse-configurateur-rootia-thomas.md` : parcours MANIPULE par Thomas (comportement reel,
  quantites, prix constates, ecran final).
- `2026-10-14-etude-configurateur-france-tombale.md` : lecture du CODE par Claude (technologie,
  modele de donnees, echelle, calcul du prix, export).

## Ce qui est confirme des deux cotes
- Canvas 2D sur une photo par granit ; echelle en cm (le code : largeur_stele_cm = 70) ; la taille
  de police "28 -> 30" observee par Thomas est une valeur interne convertie depuis les cm.
- 3 zones de texte max, 120 caracteres chacune, multilignes, reglages independants (police,
  taille, alignement, finition, position). Les motifs et medaillons ne consomment pas ces zones.
- Motifs repetables sans limite (compteur par motif), chacun avec prix et parfois couleur.
- Medaillons : tailles liees a la forme (ovale 4x6 a 13x18, rectangle jusqu a 18x24) ; le code
  contient 45 combinaisons forme x taille avec prix et delai.
- Prix vivant : base + granit + motifs + medaillon + lettres facturees + complements ; la pose
  n est chiffree qu apres le code postal (le code : majorationUrl). 31 lettres facturees pour
  "EXEMPLE / 1940 - 2020 / SOUVENIR / A JAMAIS" = 310 EUR, soit 10 EUR par lettre (price_per_char 10
  dans le JSON) ; les espaces et traits ne comptent pas.
- Retours sans perte, changement de granit sans perte (meme scene, autre photo de fond).
- Fin : coordonnees (tel obligatoire chez eux), code postal, type de sepulture (pleine terre,
  caveau, cineraire, ne sait pas), 3 photos de concession max 5 Mo, rappel a creneau.

## Ce que seul le code revele (a reprendre)
- Export a l envoi : PNG de l apercu + JSON complet de la scene (positions en px, polices,
  tailles). C est ce qui rend le devis exploitable en interne et rouvrable.
- Le serveur recalcule le prix : jamais faire confiance au montant du navigateur.
- Avertissement avant de quitter la page si une personnalisation a commence.

## Ce que seule la manipulation revele (a reprendre)
- Alignement du texte (centre, gauche, droite, justifie) par zone.
- Compteur de caracteres restants et compteur de lettres FACTUREES distincts.
- Vue "stele en gros plan" + vignette du monument entier pendant la composition.
- Type de sepulture et photos de la concession a la fin, pas au debut.
- Promotion "1 medaillon offert" : logique commerciale, pas a reproduire.

## Decisions a prendre pour notre configurateur (a trancher par Thomas)
1. Zones de texte : garder nos 4 lignes a police commune (simple, deja code) OU passer a
   3 zones multilignes a reglages independants comme Rootia ? Impact : contrat d envoi, mail interne.
2. Alignement par zone : oui/non.
3. Motifs : bibliotheque a nous (SVG) avec prix ; repetables ; couleur selon finition.
4. Medaillon photo : v2 (decision du 14.10 dans l etude) ; confirmer.
5. Complements : y en a-t-il chez nous (vase, jardiniere, entretien) ? Sinon, etape supprimee.
6. Pose : forfait unique, ou selon la commune (NPA) ? Et les taxes communales, toujours exclues.
7. Rappel a creneau : utile mais demande un agenda ; v1 = "quand vous appeler ?" texte libre.

## Images a produire (Thomas, en cours : 27 produits x plusieurs granits)
Regles pour que les images servent le configurateur et pas seulement le catalogue :
- Vue de FACE, perspective nulle ou minimale, meme cadrage et meme echelle pour toutes les
  declinaisons d un meme modele (la zone gravable est definie une fois par modele, en cm,
  et doit tomber au meme endroit sur chaque photo de granit).
- Fond neutre uni (gris clair), pas d ombre portee forte, pas de texte ni motif grave sur la
  stele (le configurateur les ajoute), pas de fleurs ni vase qui cachent la stele.
- Deux images par declinaison : monument entier (catalogue, vignette) et stele seule en gros
  plan (zone de composition), comme Rootia (rootia-<granit>.jpg et rootia-<granit>-stele.jpg).
- Format : 1600 px de large minimum, JPEG ou WebP ; nommage <slug-modele>-<id-granit>.jpg et
  <slug-modele>-<id-granit>-stele.jpg avec les ids de src/data/granits.json.
- Pour chaque modele, noter : largeur reelle de la stele en cm, et sur l image "stele", le
  rectangle gravable en pourcentage de l image (gauche, haut, largeur, hauteur). Un petit
  fichier JSON par modele suffira.
- Les 27 produits de Thomas depassent les 12 fiches actuelles : prevoir l ajout des fiches
  manquantes (meme schema, memes noms descriptifs a nous).
