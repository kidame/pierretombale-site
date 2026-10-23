# Le configurateur : guide pour le faire évoluer

Ce document décrit le configurateur tel qu'il est (au 23.10.2026) et comment le changer sans
rien casser. Les décisions et leur raison sont dans `docs/DECISIONS-ET-ETAT.md` ; ce qui reste
à faire est dans `docs/BACKLOG.md` ; `docs/CONFIGURATEUR-FUTUR.md` garde les règles posées
avant la construction (performance, mobile, promesses de l'aperçu), toujours valables.

Page : `/personnaliser/<slug>/`, une par modèle **calibré** (noindex, canonique vers la fiche).
Aperçu de travail : https://pt-apercu-k7q2.netlify.app/personnaliser/douceur/

---

## 1. Ce que voit la famille

1. **La matière** : 10 pastilles, la stèle change de pierre.
2. **L'inscription**, en deux modes :
   - **guidé** (au chargement) : mise en page (Classique, Dédicace en haut, Deux personnes),
     prénom, nom, nom de jeune fille, naissance, décès, une phrase (avec des idées), police,
     finition. Le site compose seul, dans les tailles d'un graveur, et affiche les tailles
     choisies. Le texte ne se déplace pas ;
   - **libre** (bouton « Placer le texte moi-même ») : jusqu'à 6 zones, chacune son texte, sa
     police, sa taille, sa finition, déplaçable sur l'aperçu. Retour possible au mode guidé
     (les réglages à la main sont alors remplacés).
3. **Les motifs** : 10 dessins en 4 familles, posés sous le texte, déplaçables et
   redimensionnables partout sur la stèle ; ou « Un motif à vous » (description + photo).
4. **Le devis** : lien vers `/devis/` (l'envoi de la scène viendra en passe E).

Tout est gardé sur l'appareil (brouillon, 90 jours) et repris à la visite suivante.

---

## 2. Les fichiers et leur rôle

Un fichier = un rôle. Les **données** (ce qui change souvent) sont dans `src/data/`, le **code**
dans `src/scripts/configurateur/`. Corriger une donnée suffit à corriger l'aperçu.

### Données (`src/data/`)

| Fichier | Contient | On le touche pour |
|---|---|---|
| `calibrations/<modeleId>.json` | Où est la stèle sur l'image, sa largeur réelle, les zones de texte, le cadre des motifs | Ajouter ou corriger un modèle (section 4.3) |
| `calibrations.ts` | La lecture et la validation de ces JSON (erreur claire au build) | Ajouter un champ de calibration |
| `inscription.ts` | Mises en page, tailles essayées par rôle, espaces, phrases proposées | Régler la mise en page automatique (4.1) |
| `personnalisation.ts` | Polices (et leur `capitale`), hauteurs proposées, finitions | Ajouter une police (4.4), une taille |
| `configurateur.ts` | Bornes du mode libre : 6 zones, 200 caractères, 6 lignes | Changer une borne |
| `motifs.json` + `motifs-svg.ts`, `public/motifs/*.svg` | La bibliothèque de motifs | Ajouter un motif (4.5) |
| `granits.json`, `images-modeles.json` | Les matières et les images par modèle | Ajouter une matière (4.6) |

### Code (`src/scripts/configurateur/`)

| Fichier | Rôle | Touche au DOM ? |
|---|---|---|
| `index.ts` | Le chef d'orchestre : lit le JSON de la page, crée l'état, branche la matière et les zones libres, appelle les trois modules ci-dessous, charge Konva | oui |
| `panneau-motifs.ts` | Les contrôles de l'étape 3 : familles, liste « Sur votre stèle », motif sur demande | oui |
| `reprise.ts` | Le brouillon sur la page : reprise, message, « Tout effacer », sauvegarde, avertissement | oui |
| `etat.ts` | Le magasin : l'état (matière, zones, motifs), `maj`, `abonner`, et `sceneEnCm()` pour l'export | non |
| `formulaire.ts` | Le formulaire de l'inscription guidée, les deux modes, `restaure()` pour le brouillon | oui |
| `composition.ts` | **Pur.** Champs saisis → zones de texte (tailles, coupures, positions) | non |
| `mesure.ts` | La largeur réelle d'un texte dans une police (canvas hors écran) | non |
| `zones.ts` | Les zones du mode libre : ajouter, retirer, bornes de lignes, messages | non |
| `echelle.ts` | **La seule arithmétique** : px source, px servis, cm ; surfaces de texte, cadre des motifs | non |
| `rendu.ts` | Le dessin Konva du fond et du texte, l'alerte de dépassement | canvas |
| `motifs.ts` | Les motifs : fonctions pures (poser, borner, agrandir) + leur rendu Konva | canvas |
| `brouillon.ts` | Lire, écrire, effacer le brouillon (`localStorage`) | non |
| `polices.ts` | Attendre que les polices de gravure soient chargées | non |

### Le chemin d'une frappe

```
champ « Nom » (formulaire.ts)
  -> compose(inscription, echelle, mesureur)      composition.ts, pur
  -> etat.maj({ zones })                          etat.ts
  -> abonnés : rendu.dessine()   (Konva)          rendu.ts
               motifs.dessine()                   motifs.ts
               liste des motifs                   panneau-motifs.ts
               sauvegarde du brouillon (500 ms)   reprise.ts + brouillon.ts
```

La page `src/pages/personnaliser/[slug].astro` construit tout au build : le HTML des contrôles
(lisible sans JavaScript) et un JSON inline (`data-donnees-configurateur`) avec la calibration,
les images, les polices, les finitions et les motifs. Le script ne lit que ce JSON.

---

## 3. Les conventions à connaître

- **Trois espaces de mesure** (`echelle.ts`) : px de l'image **source** (1254, ceux des JSON de
  calibration), px de l'image **servie** (1200, ceux du canvas), **cm de pierre** (ceux de
  l'état et de l'export). Facteur 1200/1254 ; `pxParCm` = largeur de `stele.cadrePx` /
  `stele.largeurCm`.
- **Toutes les positions en cm partent du coin haut gauche de la première surface de texte.**
  Le cadre des motifs a donc souvent des cm négatifs (`echelle.cadreCm`).
- **Une hauteur de lettres = la hauteur de la MAJUSCULE** (usage du métier). La taille de police
  vaut `hauteur / capitale` (`capitale` par police dans `personnalisation.ts`).
- **Surfaces** : rouge = où va le texte (une par stèle gravable), jaune = où vont les motifs.
  Un bloc de texte reste dans la surface la plus proche.
- **Une seule échelle par monument**, prise sur `stele` (sur Tango, la grande stèle).

---

## 4. Recettes

### 4.1 Régler la mise en page automatique

Tout est dans `src/data/inscription.ts`, rien à toucher dans le code :

- `taillesParRole` : les tailles essayées, de la plus grande à la plus petite, pour une personne
  (`une`) et pour deux (`deux`). La composition garde la première qui tient en largeur.
- `NOM_UNE_LIGNE_MIN_MM` : en dessous, un nom trop long passe sur deux lignes (prénom / NOM).
- `ESPACES_CM` : blancs entre nom et dates, et entre blocs.
- `LARGEUR_UTILE` : part de la largeur qu'une ligne peut prendre (0,95).
- `PHRASE_LONGUEUR_MAX`, `PHRASE_LIGNES_MAX`, `SEPARATEUR_DATES`, `PREFIXE_NOM_DE_NAISSANCE`.
- `phrasesSuggerees` : les idées de phrases, par thème.
- `misesEnPage` : nom et description de chaque mise en page.

Règles fixes de `composition.ts` : dates toujours un cran sous le nom ; si la hauteur manque, le
plus grand texte descend d'abord (à égalité : phrase, dates, nom) ; pile centrée sur sa stèle.

### 4.2 Ajouter une mise en page (par exemple « Nom de famille en haut »)

1. Ajouter l'entrée dans `misesEnPage` (`inscription.ts`) et son id dans `MiseEnPageId`.
2. Dans `composition.ts`, fonction `blocsDe` : construire la liste de blocs dans l'ordre voulu
   (un bloc = un rôle `nom` | `dates` | `phrase`, ses lignes, ses tailles, sa surface).
3. Si un rôle nouveau apparaît (« famille »), l'ajouter à `RoleTexte` et à `taillesParRole`.
4. Le formulaire et la page lisent `misesEnPage` : rien d'autre à changer.
5. Vérifier (section 5).

### 4.3 Calibrer un modèle (le rendre personnalisable)

Prérequis : ses 10 images sont dans `docs/images-configurateur/pilotes/` et dérivées
(`python3 scripts/images-modeles.py`), et la largeur réelle de sa stèle est connue (fiche
fournisseur, `docs/references/`, interne).

1. Ouvrir l'image 1200 px du modèle en Bengal et relever, en px de l'image **source 1254**
   (multiplier par 1254/1200 une mesure faite sur l'image 1200) :
   - `stele.cadrePx` : la stèle bord à bord (c'est elle qui donne l'échelle) ;
   - `zoneGravablePx` : où le texte peut aller, à l'intérieur du cadre ; **un rectangle, ou une
     liste** si le monument a plusieurs stèles gravables (la première est la principale) ;
   - `zoneMotifsPx` (facultatif) : le cadre des motifs, si ce n'est pas `stele.cadrePx` ;
   - `vueStelePx` : le cadrage de l'aperçu, la stèle et un peu d'air.
2. Créer `src/data/calibrations/<modeleId>.json` (le nom du fichier = `modeleId`) :

```json
{
  "modeleId": "tango",
  "version": 2,
  "statut": "provisoire",
  "commentaire": "D'où viennent les cotes, ce qui reste à confirmer.",
  "imagePx": { "largeur": 1254, "hauteur": 1254 },
  "stele": { "cadrePx": { "x": 873, "y": 52, "largeur": 170, "hauteur": 428 }, "largeurCm": 34, "forme": "double" },
  "zoneMotifsPx": { "x": 698, "y": 52, "largeur": 347, "hauteur": 431 },
  "zoneGravablePx": [
    { "x": 897, "y": 146, "largeur": 120, "hauteur": 293 },
    { "x": 711, "y": 209, "largeur": 105, "hauteur": 240 }
  ],
  "vueStelePx": { "x": 650, "y": 31, "largeur": 450, "hauteur": 470 },
  "perspective": "vue de 3/4 : le texte plat ne suit pas l'angle"
}
```

3. Build : `calibrations.ts` refuse un fichier incohérent avec un message clair (zone hors du
   cadre, champ manquant...). La page `/personnaliser/<slug>/` apparaît toute seule, et la fiche
   reçoit le lien « Personnaliser ce modèle ».
4. Faire une planche de contrôle (zones en couleur sur l'image) et la faire valider par le
   graveur ; passer alors `statut` à `confirme` et incrémenter `version` à chaque correction.
5. Pas prêt à publier ? Ranger le fichier dans
   `docs/images-configurateur/calibrations-en-attente/` (le build ne le lit pas).

Vues de 3/4 (Quiétude, Aventuri, Tango) : le texte reste plat ; c'est noté dans `perspective`.

### 4.4 Ajouter une police

1. `npm install @fontsource/<police>`, puis importer `@fontsource/<police>/latin-400.css` en
   tête de `src/pages/personnaliser/[slug].astro` (et de `src/pages/devis.astro`).
2. Mesurer : `python3 scripts/mesure-polices.py <police>` (capitale + caractères absents).
3. Ajouter l'entrée dans `polices` de `src/data/personnalisation.ts` (`id`, `nom`, `style`,
   `famille`, `capitale`). Elle apparaît dans les deux modes et dans `/devis/`.

### 4.5 Ajouter un motif

Suivre `docs/MOTIFS-BIBLIOTHEQUE.md`, section 7 (image noir sur blanc ->
`scripts/vectoriser-motif.py` -> `public/motifs/` -> entrée dans `src/data/motifs.json`).

### 4.6 Ajouter une matière, une image, changer un nom ou un prix

Voir « Comment changer une chose courante » dans `docs/BACKLOG.md`.

### 4.7 Faire évoluer le brouillon

`brouillon.ts`. Ajouter un champ lu avec une valeur par défaut : sans risque. Changer le sens
d'un champ : incrémenter `VERSION_BROUILLON` (les anciens brouillons sont alors ignorés). Clé :
`pt-configurateur-<modeleId>` ; durée : `DUREE_JOURS`. Le fichier joint n'est jamais gardé.

---

## 5. Vérifier un changement

0. **Tests** : `npm test` (vitest, quelques secondes). Ils vérifient les règles du code pur avec
   les vraies calibrations : composition (`tests/composition.test.ts` : ordre des blocs,
   capitales, largeur et hauteur sur chaque modèle, hiérarchie des tailles, nom sur une ligne,
   coupure des phrases, dédicace, deux personnes, cas impossible), échelle et bornes des motifs
   (`tests/echelle.test.ts`). **Une règle changée = son test changé dans le même commit.** Un
   nouveau modèle calibré est testé tout seul (les tests bouclent sur `modelesCalibres()`).
   Le mesureur de test est fictif (0,8 em par caractère) : les largeurs exactes d'une police se
   contrôlent au point 2.
1. Build plafonné (VPS partagé) :
   `systemd-run --user --wait -p MemoryMax=1200M --collect bash -c "npm run build && npx astro check"`
   (en tâche de fond avec un fichier témoin si le pont MCP est utilisé).
2. Contrôle au navigateur de test, tous les modèles calibrés :
   `(bash scripts/verifie-configurateur.sh > /tmp/verif-configurateur.log 2>&1 &)`
   puis lire les lignes `RES`, `COUPLE`, `BROUILLON` du journal et la planche
   `/tmp/verif-configurateur/planche.jpg`. Attendu : aucun « trop long », le brouillon repris
   puis effacé.
3. Regarder au moins un modèle sur téléphone (390 px) : l'aperçu reste collé en haut pendant la
   saisie.
4. Poids : la page doit rester légère (environ 9 Ko gz de HTML, Konva chargé à part).
   `python3 scripts/poids-pages.py` donne les chiffres.

## 6. Publier l'aperçu

L'aperçu Netlify (`pt-apercu-k7q2`, noindex) se publie depuis une copie de `dist/` dans
`/home/kumo/atelier/tmp/apercu`, qui garde `_headers`, `netlify.toml` et `robots.txt`. La
commande de déploiement contient un jeton à usage unique : elle se demande au connecteur
Netlify au moment de publier, s'exécute depuis un script temporaire dans `/tmp`, et ce script
est effacé juste après. **Jamais de jeton dans le dépôt.**

---

## 7. Règles à garder

- **Une donnée = un endroit.** Une valeur métier dans le code est un défaut : la sortir dans
  `src/data/`.
- **Les fonctions de calcul restent pures** (`composition.ts`, `echelle.ts`, les fonctions de
  `motifs.ts` et `zones.ts`) : elles se testent sans navigateur, dans `tests/`.
- **Un fichier de branchement par étape de la page** (`formulaire.ts`, `panneau-motifs.ts`,
  `reprise.ts`) : `index.ts` ne fait que les appeler. Une nouvelle étape = un nouveau fichier.
- **CSS** : toute classe qui déclare `display` doit avoir sa règle `[hidden]` (sinon un bloc
  caché reste visible) ; les éléments créés par le script se stylent avec `:global(...)`.
- **Performance** : Konva en import dynamique, tracés des motifs lus dans les SVG publics (pas
  inlinés), polices en sous-ensemble latin.
- **Commentaires en français, en ASCII** dans le code ; un commit par étape.
- **Rien ne part à l'atelier sans bon à tirer** : l'aperçu reste indicatif (mention sous le
  canvas).

## 8. Limites connues et pistes

| Limite | Piste |
|---|---|
| Les champs de l'inscription guidée ne partent pas encore avec le devis | Passe E : joindre `formulaire.lit()` et `sceneEnCm()` |
| Une seule échelle par monument : sur Tango, la petite stèle paraît plus étroite qu'en vrai | Une échelle par surface (`largeurCm` par zone) et un léger écrasement horizontal du texte |
| Vues de 3/4 : texte plat | Images de face, ou une transformation de perspective par calibration |
| Cadre des motifs rectangulaire : on peut poser un motif hors de la pierre sur les formes découpées | Un masque de la forme de la stèle (polygone dans la calibration) |
| Signe † absent des polices web | Sous-ensemble de polices élargi, ou motif « croix » |
| « née » seulement (champ « Nom de jeune fille ») | Un choix née / né, ou « nom de naissance » |
| Polices web ≠ polices du graveur (écart de largeur 10 à 20 %) | Valider sur bon à tirer ; à terme, les polices de l'atelier |
| Les zones du mode libre sont encore branchées dans `index.ts` | Les sortir dans un `panneau-zones.ts`, comme les motifs |
| Les tests ne couvrent que le code pur | Le rendu et les branchements se contrôlent au navigateur (`verifie-configurateur.sh`) |
| Calibrations tracées à l'oeil, statut provisoire | Validation du graveur, planche par modèle |
