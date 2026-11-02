# La page /realisations/

Page editoriale d une seule realisation, ecrite le 02.11.2026 d apres la maquette
validee par Thomas. Un seul fichier : `src/pages/realisations.astro` (gabarit,
styles de page et galerie). L entree " Realisations " du menu et du pied de page
vit dans `src/config/site.ts`, comme toutes les autres.

## Origine des photos

Les quatre photos de `public/images/realisations/monument-coeur/` ont ete
FOURNIES RETOUCHEES PAR LE CLIENT (quatre JPEG 1086 x 1448). Elles ont ete
redimensionnees et encodees en WebP pour le web, sans nouvelle retouche de
contenu ni recadrage. Trois largeurs par vue (480, 800, 1086 px), en portrait
3:4 (800 x 1067 pour la taille moyenne), nommees <vue>-<largeur>.webp.
Les 12 fichiers transferes ont ete verifies par SHA-256 avant integration.

Les quatre vues, chacune utilisee UNE SEULE FOIS dans la page :

| Fichier                  | Ou                          |
| ------------------------ | --------------------------- |
| `pose-vue-ensemble`      | hero (photo principale)     |
| `pose-vue-detail`        | section de presentation     |
| `avant-pose-face`        | " Avant la pose ", a gauche |
| `avant-pose-trois-quarts`| " Avant la pose ", a droite |

## Ce que la page ne dit pas

- Jamais le nom ni la date graves sur le monument : ni en texte, ni en `alt`,
  ni en metadonnee, ni en donnees structurees. C est aussi la raison pour
  laquelle le partage social garde la carte generique `og-image.png` au lieu de
  la photo du hero : une image de partage est une metadonnee.
- Pas de dimensions, pas de matiere exacte, pas de localisation, pas de prix :
  rien qui n ait ete valide.
- Pas de mention d atelier ni de fabrication suisse (regles de communication,
  `docs/DECISIONS-ET-ETAT.md`).
- Pas de fausse realisation, pas de filtre, pas de compteur de projets, pas de
  bloc " a venir ", pas de temoignage.

## Ajouter une realisation plus tard

1. Deposer les photos retouchees dans
   `public/images/realisations/<projet>/`, en trois largeurs (480, 800, 1086),
   meme ratio pour toutes les vues d un projet, sous la forme
   `<vue>-<largeur>.webp`.
2. Dans `src/pages/realisations.astro`, le tableau `photos` du frontmatter est
   la seule source : chaque entree porte son `legende` et son `alt`. L ordre du
   tableau est celui de la galerie (la position " 1 / 4 " en decoule).
3. Dupliquer la section de presentation et la section " Avant la pose " pour le
   nouveau projet. Si la page passe a plusieurs projets, c est le moment de
   sortir le tableau dans `src/data/` et d en faire une liste.
4. Verifier `npm run build`, `npx astro check` et `npm test`, puis relire la
   page au navigateur en 390, 1024, 1280 et 1440 px.

## Galerie

Amelioration progressive, sans aucune bibliotheque : chaque photo est un vrai
lien vers son fichier le plus grand ; si le navigateur sait faire
`dialog.showModal()`, le clic ouvre a la place une boite sombre (photo entiere,
legende, position, precedent / suivant, fermeture). Echap et le retour du focus
sur la photo d origine viennent du `<dialog>` natif ; les fleches, le clic sur
le fond et le balayage tactile sont ajoutes. Le dialogue ne porte aucune source au chargement initial ; le navigateur
choisit la taille adaptee via srcset, puis la source est liberee a la fermeture. Les
boutons font 48 px. L animation d ouverture respecte
`prefers-reduced-motion`.
