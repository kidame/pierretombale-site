# Le configurateur visuel : règles pour plus tard

Décision du 13.10.2026 (Thomas) : l'étape **E5 livre une personnalisation guidée** dans le
formulaire de devis — lignes de texte, police sur échantillons, hauteur de lettres, finition, motif,
dessin fourni, avec un aperçu simple du texte. **Le configurateur visuel (Konva) est reporté.**

Raison : l'étude des concurrents du 13.10.2026 (voir « Personnalisation et configurateur » dans
`docs/DECISIONS-ET-ETAT.md`) montre que les configurateurs 3D des fabricants français servent à
capter et structurer des demandes, pas à vendre en ligne ; aucun concurrent romand vérifié n'en a.
Un configurateur sans dimensions réelles, sans visuels et sans prix ne serait qu'une maquette. Le
site tient debout sans lui.

Ce document fixe les règles à respecter le jour où il sera construit. Elles ne sont pas des
préférences : chacune répond à un risque identifié.

## Ce qu'il faut obtenir AVANT de commencer

Rien ne doit être écrit tant que ces quatre points manquent :

1. **Dimensions en millimètres de chaque modèle** : stèle, socle, soubassement. Sans elles, l'échelle
   est inventée et l'aperçu ment.
2. **Zone de gravure** de chaque modèle, en millimètres (origine, largeur, hauteur) : c'est elle qui
   empêche une famille de composer une inscription qui ne tiendra pas sur la pierre.
3. **Polices et finitions confirmées** par ceux qui gravent. Les listes de
   `src/data/personnalisation.ts` portent le commentaire « liste provisoire, à confirmer selon ce que
   nous savons graver » : ce commentaire doit disparaître avant qu'un aperçu visuel ne prétende
   montrer le résultat.
4. **Visuels** : une photo par modèle, et si possible par modèle × granit. À défaut, monument détouré
   plus texture de granit — à prototyper, la fidélité est moindre.

À cela s'ajoute, pour afficher une estimation en direct : la grille de prix (prix de base par modèle,
coefficient par granit, prix par lettre selon hauteur et finition). Tant qu'elle est à `null` dans
`src/data/tarifs.json`, le configurateur affiche « prix sur demande », comme le reste du site.

## Page dédiée, pas un îlot dans le catalogue

- Adresse propre, par exemple `/personnaliser/<slug>/`, une page par modèle.
- La page doit avoir un **contenu texte statique et indexable** : titre, h1, description du modèle,
  explication du déroulement, lien vers le devis. Le canvas est un outil posé sur une vraie page, pas
  la page elle-même. Une page dont le contenu n'existe qu'en JavaScript n'existe pas pour Google.
- Elle garde le fil d'Ariane, le canonical et le JSON-LD des autres pages.
- Le bouton « Demander un devis » doit rester accessible **sans ouvrir le configurateur** : une
  famille endeuillée ne doit jamais être obligée de dessiner pour nous écrire.

## Performance : la règle non négociable

Le site est aujourd'hui en HTML statique avec quelques kilo-octets de JavaScript en ligne, et aucun
fichier JavaScript externe. Konva pèse plusieurs centaines de kilo-octets. Donc :

- **Konva n'entre dans aucune autre page.** Pas d'import dans `BaseLayout.astro`, pas dans
  `src/styles.css`, pas dans un composant partagé. Uniquement dans l'îlot de la page configurateur.
- L'îlot est chargé **en dernier** : `client:visible`, ou mieux, un `import()` dynamique déclenché
  par un clic sur « Voir l'aperçu ». Le LCP de la page ne doit pas attendre le canvas.
- **Budget chiffré** : aucune page existante ne doit changer de poids. Vérification :
  `python3 scripts/poids-pages.py dist`, comparé à `docs/perf-reference-2026-10-13.txt`. Les colonnes
  `js externe`, `js inline` et `css` des 22 pages autres que celle du configurateur doivent être
  **identiques**. Une seule classe Tailwind inédite suffit à faire grossir la feuille de style
  partagée par tout le site : c'est arrivé en E5, et c'est la raison pour laquelle l'habillage de la
  section gravure de `/devis/` est écrit en CSS dans la page plutôt qu'en utilitaires Tailwind.
- Mesurer avec le même outil de part et d'autre : deux implémentations de gzip ne donnent pas le
  même octet, et un écart de 20 octets n'est alors pas une régression.
- Les polices de gravure suivent la même règle : elles ne sont chargées que par la page qui les
  montre (voir les imports `@fontsource` en tête de `src/pages/devis.astro`), en sous-jeu latin, avec
  `font-display: swap`.

## Données : la même source, le même contrat

- Les polices, hauteurs de lettres, finitions et motifs viennent de **`src/data/personnalisation.ts`**
  et de nulle part ailleurs. Le configurateur ne redéclare aucune liste.
- Les granits viennent de `src/data/granits.json`, les modèles de `src/content/products`, les prix de
  `src/data/tarifs.json`. Trois sources déjà en place, aucune copie.
- Le configurateur **produit exactement les champs de `docs/devis-contrat.md`** : `ligne1_texte`,
  `ligne1_police`, `ligne1_hauteur` … `ligne4_hauteur`, `finition`, `motif`, `gravure_precisions`,
  `modele`, `granit`. Voir la section « Configurateur futur » de ce contrat. La fonction `/api/devis`
  écrite en E6 n'aura ainsi rien à changer.
- Tout en millimètres réels dans les données ; l'échelle du canvas est une constante unique
  (la spec propose 1 px = 0,5 mm). Aucune position stockée en pixels.
- Les lignes de texte restent **structurées** (une entrée par ligne), jamais un bloc de texte unique :
  c'est ce qui permet de produire une fiche de travail exploitable sans rien retaper.

## Ce que l'aperçu promet, et ce qu'il ne promet pas

- Mention obligatoire sous l'aperçu, la même que sur `/devis/` : `MENTION_APERCU` de
  `src/data/personnalisation.ts` — « Aperçu indicatif. Vérifiez l'orthographe des noms et des dates :
  la maquette définitive vous sera soumise pour accord (bon à tirer) avant toute gravure. »
- **Le bon à tirer reste obligatoire.** Un aperçu à l'écran n'est pas un accord, et rien ne part à la
  gravure sans l'accord écrit de la famille (règle du projet, `AGENTS.md`).
- Les couleurs de granit et de finition affichées sont **approximatives** : l'écran ne rend pas une
  pierre. Le dire, comme le fait déjà `/nos-granits/`.
- Avant tout rendu de texte sur canvas : `document.fonts.load()` sur la police choisie, sinon
  l'export PNG sort avec une police de remplacement.
- Export : `pixelRatio` 2 au maximum (plafond de taille des canvas sur iOS Safari).

## Mobile d'abord

- La majorité des familles arriveront par téléphone. Le configurateur doit être utilisable à une main,
  en portrait, sans geste de pincement obligatoire.
- Saisie par **champs HTML classiques** (texte, select, radio), pas de manipulation directe des
  lettres sur le canvas : le canvas montre, il ne sert pas à saisir.
- Le parcours doit pouvoir être abandonné à tout moment vers le formulaire de devis, en conservant ce
  qui a déjà été saisi.

## Ordre de travail proposé

1. Collecter les quatre points ci-dessus auprès des associés.
2. `src/data/monuments/*.json` : dimensions et zone de gravure, un fichier par modèle.
3. Page `/personnaliser/<slug>/` statique, sans canvas : contenu, SEO, lien devis. Mesurer le poids.
4. Îlot Konva en chargement différé, cinéraires et plaques d'abord (formes les plus simples).
5. Estimation en direct, seulement quand la grille de prix existe.
6. Export PNG et champs joints à la demande de devis.

Point de départ technique retenu le 13.10.2026 : la démo « Badge Maker » de Konva — s'en inspirer,
ne pas la copier.
