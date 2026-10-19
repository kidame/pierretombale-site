# CIN1 - pilote v1

19.10.2026. Famille : cineraire. Reference interne CIN1, nom public non valide.
10 variantes, UNE seule vue commune par matiere, selon la correction de Thomas du
19.10.2026 : cette vue vise a servir la fiche produit et le configurateur.
La seconde vue stele est reportee. Le present lot reste un pilote a valider.

| Matiere | Image |
|---|---|
| bengal | [cin1-bengal.png](cin1-bengal.png) |
| rozabeta | [cin1-rozabeta.png](cin1-rozabeta.png) |
| paradiso | [cin1-paradiso.png](cin1-paradiso.png) |
| jablanica | [cin1-jablanica.png](cin1-jablanica.png) |
| royal | [cin1-royal.png](cin1-royal.png) |
| vizag-blue | [cin1-vizag-blue.png](cin1-vizag-blue.png) |
| viscount-white | [cin1-viscount-white.png](cin1-viscount-white.png) |
| rosso-porrino | [cin1-rosso-porrino.png](cin1-rosso-porrino.png) |
| egipat | [cin1-egipat.png](cin1-egipat.png) |
| marmara | [cin1-marmara.png](cin1-marmara.png) |

## Production et correspondances

Generation via imagegen integre. Reference source : CIN1.png,
Library libfile_453ddd4d523c81918fad3b9a1c3efcfd.
Creation d'une vue frontale Bengal depuis la reference, suppression du vase et des
fleurs. Puis 9 edits de cette meme base avec une texture de matiere chacun.
Prompt : conserver silhouette, cadrage, echelle, camera et ombre, changer uniquement
la pierre sur toutes les pieces ; aucune gravure, aucun accessoire.
Textures : ../../../../matieres/2026-10-19/textures-v1/.
manifest.json relie modeleId, matiereId, image et texture du selecteur.
Fichiers PNG originaux, copies identiques verifiees par SHA-256.

## Bilan du pilote

Visuellement coherent pour essayer un changement de matiere. Contours proches a
l'oeil, mais recalage pixel a pixel NON mesure ni garanti. Le dessus de la base reste
visible : ce n'est pas une elevation orthographique stricte de tout le monument.
Geometrie reconstruite depuis une image en perspective, pas depuis un plan atelier.
Paradiso parait plus orange que la texture source ; valider la couleur avant serie.
Echelle physique du grain non calibree. Grain Marmara assez marque : a valider.
Sortie effective : 1254 x 1254 px, inferieure au minimum final de 1600 px, malgre la
demande 2048 px. Ne pas considerer ce lot comme un export final conforme.
Dimensions et zones gravables inconnues ; calibration et validation atelier requises.
Noms internes conserves pour suivi, non autorises comme noms publics par defaut.
Aucun branchement runtime, publication ni modification de granits.json.
