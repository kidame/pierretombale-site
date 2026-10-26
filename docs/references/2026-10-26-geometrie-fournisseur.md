# Geometrie des 27 modeles d'apres le configurateur 3D du fournisseur (26.10.2026)

Document INTERNE : ni ces chiffres bruts, ni le nom du fournisseur ne vont sur le site.
Source : l'interface de donnees du configurateur 3D public du fournisseur (`/api/reference/<code>`),
lue par Claude le 26.10.2026. Elle donne chaque piece du monument avec sa forme [largeur, hauteur,
epaisseur] en cm. Le fichier complet est `geometrie-fournisseur.json` (toutes les pieces).
Les pages produit publiques, elles, ne donnent les cotes de stele que pour les funeraires :
c'est ce qui manquait dans `2026-10-23-dimensions-steles-fournisseur.md`.

## Steles gravables (ce que le configurateur utilise : `stele.largeurCm` dans la calibration)

| Modele | Stele(s) marquee(s) par le fournisseur (l x h x ep cm) | Lecture pour notre configurateur |
|---|---|---|
| douceur (Douceur) | 80.04 x 79 x 10 | 80 cm (confirme) |
| corazon (Corazon) | 90 x 90 x 10 | 90 (confirme) |
| arques (Arques) | 90 x 75 x 10 | 90 (confirme) |
| eligie (Éligie) | 35 x 90 x 12; 52.06 x 90 x 9 | DEUX steles : contre-stele 35 x 90 x 12 et stele 52 x 90 x 9. Largeur a utiliser : 52 (stele claire), 35 (contre-stele sombre) |
| tango (Tango) | 34.15 x 90 x 6; 21 x 5 x 20; 50.68 x 65 x 10 | grande 34 x 90 x 6, petite 51 x 65 x 10 (confirme) ; la piece 21 x 5 x 20 est le support de vase |
| aventuri (Aventuri) | 65 x 15 x 10; 65 x 60 x 10; 65 x 10 x 12 | stele 65 x 60 x 10, bandeau 65 x 15 x 10 au-dessus, socle 65 x 10 x 12 : total 65 x 85 (confirme) |
| quietude (Quiétude) | 95 x 90 x 10 | 95 (confirme) |
| arbre-de-vie (Arbre de vie) | 95 x 85 x 10 | 95 (confirme) |
| almandin (Almandin) | aucune marquee | pas de stele : gravure possible sur la tombale 170 x 84 (ep 8) ou sur la tete F12 74 x 15 |
| musulman-4 (Musulman 4) | 65 x 85 x 10 | 65 (confirme) |
| 4-pieces-sans-stele (4 Pièces sans stèle) | aucune marquee | pas de stele : tombale a pente 180 x 80 (ep 10/8) |
| 4-pieces-stele-doucine-avec-base (4 pièces stèle doucine avec base) | 90/85 x 70 x 10 | 90/85 (confirme) |
| 5-pieces-jardiniere-en-closoir (5 pièces jardinière en closoir) | 90/85 x 70 x 10 | 90/85 (confirme) |
| tombale-simple-200x100x10 (Tombale simple 200x100x10) | aucune marquee | pas de stele : dalle 200 x 100 x 10 |
| cin1 (CIN1 60x60) | 55 x 55 x 8 | 55 cm |
| cin8 (CIN8 60X60) | 52 x 55 x 8 | 52 cm |
| cin-aquarius (CIN-AQUARIUS 60X60) | 55 x 55 x 8 | 55 cm |
| cin-ovae (CIN-OVAE 60x60) | 55 x 60 x 8; 52.76 x 20.15 x 3 | stele 55 x 60 x 8 + plaque bicolore 53 x 20 x 3 posee dessus : largeur 55 |
| cin-esperanza (CIN-ESPERANZA 60X60) | aucune marquee | pas de piece marquee : la stele est F251 48 x 48 x 8 (meme code de forme que les autres steles cineraires) |
| cin-aloria (CIN-ALORIA 60x60) | 24.2 x 58.65 x 2; 50 x 60 x 8 | stele 50 x 60 x 8 + lame 24 x 59 x 2 : largeur 50 |
| cin-bahia (Cin Bahia 60x60) | 30 x 50 x 8 | 30 cm (stele etroite, 30 x 50) |
| cin-montagne01 (CIN-MONTAGNE01 60X60) | 56 x 70 x 8 | 56 cm |
| cin-montagne02 (CIN-MONTAGNE02 60x60) | 48 x 60 x 8 | 48 cm |
| cin-nautis (CIN-NAUTIS 60x60) | 54 x 54 x 8 | 54 cm |
| cin-saturne (CIN-SATURNE 60X60) | aucune marquee | pas de piece marquee : la stele est F25 40 x 55 x 8 (forme ronde) |
| cin-nivora (CIN-NIVORA 60x60) | 58 x 57.96 x 8.5 | 58 cm |
| cin-tombale (CIN-TOMBALE 60X60) | aucune marquee | pas de stele : dalle 60 x 60 x 10, gravure sur la dalle |

## Toutes les pieces

Codes de forme du fournisseur : F251 stele, F271 plaque/lame fine, F30 tombale ou dalle,
F29 tombale, F14 base de stele, F12 tete de soubassement, F09/F10/F11 pieds et cotes de soubassement,
F08 jardiniere, F25 stele ronde, F301 support de vase. (Lecture de Claude d'apres les positions ; a confirmer.)

- **douceur** (Monument funéraire) : F16 185 x 15 x 13 ; F29 162 x 6 x 80 ; F14 100 x 24 x 15 ; F12 74 x 15 x 10 ; F251 80.04 x 79 x 10 STELE ; F16 185 x 15 x 13 ; F08 74 x 5 x 25
- **corazon** (Monument funéraire) : F09 200 x 15 x 13 ; F29P 155 x 5.0/7.0 x 80 ; F08 74 x 5 x 25 ; F09 200 x 15 x 13 ; F12 74 x 15 x 10 ; F12 74 x 15 x 13 ; F15 95 x 13 x 15 ; F251 90 x 90 x 10 STELE
- **arques** (Monument funéraire) : F09 200 x 12 x 12 ; F08 76 x 5 x 35 ; F29 160 x 5 x 82 ; F251 90 x 75 x 10 STELE ; F12 76 x 12 x 12 ; F12 76 x 7 x 11.4 ; F09 200 x 12 x 12
- **eligie** (Monument funéraire) : F14 85 x 8 x 20 ; F09 200 x 15 x 13 ; F29 150 x 6 x 80 ; F09 200 x 15 x 13 ; F251 35 x 90 x 12 STELE ; F12 74 x 15 x 13 ; F12 74 x 10 x 10.93 ; F251 52.06 x 90 x 9 STELE ; F08 74 x 5 x 35
- **tango** (Monument funéraire) : F251 34.15 x 90 x 6 STELE ; F08 76 x 5 x 28 ; F09 200 x 13 x 12 ; F12 76 x 13 x 10 ; F09 200 x 13 x 12 ; F301 21 x 5 x 20 STELE ; F14 90 x 8 x 15 ; F251 50.68 x 65 x 10 STELE ; F12 76 x 13 x 10 ; F29 152 x 7 x 86
- **aventuri** (Monument funéraire) : F251 65 x 15 x 10 STELE ; F11 180 x 15 x 13 ; F251 65 x 60 x 10 STELE ; F15 88 x 6 x 14 ; F11 180 x 15 x 13 ; F14 90 x 8 x 15 ; F29 170 x 6 x 84 ; F12 74 x 15 x 10 ; F251 65 x 10 x 12 STELE ; F10 100 x 15 x 20
- **quietude** (Monument funéraire) : F08 74 x 5 x 25 ; F12 74 x 15 x 10 ; F251 95 x 90 x 10 STELE ; F09 200 x 15 x 13 ; F14 95 x 10 x 15 ; F09 200 x 15 x 13 ; F29P 155 x 5.0/7.0 x 80 ; F12 74 x 15 x 13
- **arbre-de-vie** (Monument funéraire) : F29P 160 x 7/5 x 82 ; F12 74 x 15.1 x 13 ; F251 95 x 85 x 10 STELE ; F09 200 x 15 x 13 ; F08 74 x 5 x 25 ; F12 74 x 15 x 10 ; F09 200 x 15 x 13 ; F14 98 x 10 x 15
- **almandin** (Monument funéraire) : F12 74 x 15 x 10 ; F09 200 x 15 x 13 ; F12 74 x 15 x 10 ; F08 74 x 5 x 25 ; F30 170 x 8 x 84 ; F09 200 x 15 x 13
- **musulman-4** (Monument funéraire) : F15 200 x 15 x 13 ; F17 74 x 15 x 10 ; F15 200 x 15 x 13 ; F251 65 x 85 x 10 STELE ; F08 74 x 5 x 25 ; F14 90 x 5 x 35 ; F17 74 x 15 x 13
- **4-pieces-sans-stele** (Monument funéraire) : F11 187 x 15 x 13 ; F30P 180 x 10.0/8.0 x 80 ; F12 74 x 15 x 13 ; F11 187 x 15 x 13 ; F10 100 x 15 x 13
- **4-pieces-stele-doucine-avec-base** (Monument funéraire) : F10 100 x 15 x 13 ; F11 187 x 15 x 13 ; F29P 175 x 5.0/7.0 x 80 ; F14 95 x 10 x 15 ; F12 74 x 15 x 13 ; F32 90/85 x 70 x 10 STELE ; F11 187 x 15 x 13
- **5-pieces-jardiniere-en-closoir** (Monument funéraire) : F29P 155 x 5/7 x 80 ; F17 74 x 15 x 5 ; F12 74 x 15 x 13 ; F09 200 x 15 x 13 ; F12 74 x 15 x 10 ; F09 200 x 15 x 13 ; F32 90/85 x 70 x 10 STELE
- **tombale-simple-200x100x10** (Monument funéraire) : F30 200 x 10 x 100
- **cin1** (Monument cinéraire) : F30 60 x 8 x 60 ; F251 55 x 55 x 8 STELE
- **cin8** (Monument cinéraire) : F251 52 x 55 x 8 STELE ; F30 60 x 8 x 60
- **cin-aquarius** (Monument cinéraire) : F14 56 x 3 x 25 ; F30 60 x 5 x 60 ; F251 55 x 55 x 8 STELE
- **cin-ovae** (Monument cinéraire) : F30 60 x 5 x 60 ; F14 56 x 7 x 10 ; F29 55 x 5 x 45 ; F251 55 x 60 x 8 STELE ; F271 52.76 x 20.15 x 3 STELE
- **cin-esperanza** (Monument cinéraire) : F30 28 x 5 x 25 ; F14 52 x 8 x 15 ; F30 60 x 8 x 60 ; F30 20 x 8 x 20 ; F251 48 x 48 x 8
- **cin-aloria** (Monument cinéraire) : F271 24.2 x 58.65 x 2 STELE ; F251 50 x 60 x 8 STELE ; F14 56 x 7 x 13 ; F29 55 x 5 x 40 ; F30 60 x 5 x 60
- **cin-bahia** (Monument cinéraire) : F25 30 x 50 x 8 STELE ; F29 81.41 x 3 x 28 ; F30 60 x 8 x 60 ; F30 59 x 5 x 43
- **cin-montagne01** (Monument cinéraire) : F30 60 x 8 x 60 ; F251 56 x 70 x 8 STELE
- **cin-montagne02** (Monument cinéraire) : F14 54 x 6 x 10 ; F251 48 x 60 x 8 STELE ; F29 52 x 4 x 45 ; F30 60 x 5 x 60
- **cin-nautis** (Monument cinéraire) : F30 60 x 8 x 60 ; F251 54 x 54 x 8 STELE
- **cin-saturne** (Monument cinéraire) : F25 40 x 55 x 8 ; F30 60 x 8 x 60 ; F29 50 x 8 x 41 ; F14 55 x 10 x 12
- **cin-nivora** (Monument cinéraire) : F30 60 x 10 x 60 ; FDIV 58 x 57.96 x 8.5 STELE ; F251 20 x 20 x 7
- **cin-tombale** (Monument cinéraire) : F30 60 x 10 x 60

## Consequence pour le configurateur

- Eligie et les 13 cineraires ont maintenant une largeur de stele reelle : a calibrer (voir
  docs/CONFIGURATEUR.md, recette 4.3), plus besoin d'estimer sur les photos.
- Almandin, 4 pieces sans stele, Tombale simple, Dalle cineraire : la gravure irait sur la tombale
  (vue de dessus, en perspective sur nos images) : a decider avec Thomas.
- Les 10 largeurs deja utilisees sont confirmees au cm pres.
