# Pages cimetieres : la composition "guide" (pilote Corcelles-Cormondreche)

Direction validee par Thomas le 10.11.2026, a partir de l'etude UX du meme jour
(ETAT.md). Implementee le 10.11.2026 sur UNE SEULE page, en local, sans aucune
publication : rien n'a ete pousse, ni sur main ni sur live.

## Ce que c'est

Une page cimetiere qui se lit comme un guide : on sait ou aller et quoi faire
des le premier ecran, les reponses importantes restent ouvertes, les details
reglementaires se deplient. Meme charte que le reste du site (ivoire,
anthracite, bronze, EB Garamond + Archivo, jetons de `src/styles.css`), aucune
police ni dependance nouvelle, aucun JavaScript ajoute.

## Fichiers

- `src/components/GuideCimetiere.astro` : tout le composant (gabarit + CSS
  scoped). Il n'y a AUCUNE donnee dedans : chaque fait, tarif, article et lien
  vient de `src/data/cimetieres.ts`, via les memes fonctions d'URL que la mise
  en page d'origine (`cimetiereUrl`, `devisUrl`, `itineraireUrl`, `guideUrl`,
  `familleUrl`, `telUrl`).
- `src/pages/cimetieres/[slug].astro` : rendu conditionnel. La constante
  `PILOTE_GUIDE = "corcelles-cormondreche"` decide, a la construction, quelle
  mise en page est ecrite dans le HTML. Un seul rendu part dans la page : le
  DOM n'est jamais double. Titre, metadonnees, canonical, JSON-LD et fil
  d'Ariane sont calcules AU-DESSUS du rendu, donc identiques dans les deux cas.
- `src/data/cimetieres.ts` : ajout de `telUrl()` seulement (le lien d'appel du
  guichet, utilise par les deux mises en page ; sortie identique a avant).

Generaliser plus tard = rendre le composant pour d'autres slugs (ou pour tous)
dans `[slug].astro`. Rien d'autre a toucher.

## La composition, bloc par bloc

1. **Hero asymetrique.** A gauche : fil d'Ariane, commune, h1 exact, chapo. A
   droite : panneau anthracite "Infos pratiques" (adresse, horaires du
   cimetiere, acces), deux actions (Itineraire, Appeler l'office) et un bloc
   "Administration du cimetiere" qui nomme le service communal, ses
   coordonnees et dit explicitement que les demarches officielles passent par
   la commune, pas par nous. Sur telephone, le panneau remonte sous le h1 et
   ses deux boutons passent en tete du panneau (ordre CSS, DOM inchange) :
   les actions sont a 378 px du haut, dans le premier ecran.
2. **Navigation par besoins.** Venir / Preparer un monument / Urnes et tarifs /
   Duree et entretien / Questions. Un seul element de navigation : rail
   lateral colle (sticky) a partir de 1024 px, simple liste encadree sur
   telephone. Les ancres historiques sont conservees (`#sur-place`,
   `#poser-un-monument`, `#cendres`, `#duree`, `#questions`) ; `#sources` est
   nouvelle. Le rail n'est jamais superpose au texte : il vit dans sa colonne.
3. **Sur place.** Equipements sur deux colonnes en lecture large, encadre
   bronze "Ce qui change bientot" (projets annonces), repli "Histoire et
   patrimoine".
4. **Poser un monument.** Trois reperes contextualises (delai, surface de la
   tombe d'adulte, hauteur maximale), chacun suivi de la ligne de reglement
   d'ou vient le chiffre. A cote, le **schema d'echelle** : vue de dessus
   (70 x 130 cm, monument et fleurs compris) et vue en elevation (160 cm,
   socle compris ; largeur NON fixee, dessinee en traitille). Les deux vues
   sont a la meme echelle (1 cm = `--cm`), et les nombres sont relus dans
   `regles.tombes` : corriger la donnee corrige le dessin. Le schema porte son
   avertissement : ce n'est pas un modele du catalogue et aucun monument n'est
   annonce conforme sans verification.
   Ensuite : les regles ouvertes (periode interdite, autorisation, bordure,
   taxe de pose), un repli "Materiaux et obligations de l'entreprise", puis le
   tableau COMPLET des dimensions (4 colonnes, `caption`, `th scope`).
5. **Appel commercial, apres les regles.** Bandeau sombre "Votre projet dans ce
   cimetiere" : le texte d'origine, la phrase "sur mesure", le devis
   pre-rempli (`devisUrl`) et le lien vers les monuments funeraires, puis la
   mention d'independance, la date de verification et un lien vers les
   documents officiels.
6. **Urnes, columbarium et jardin du souvenir.** Les lignes de la fiche sont
   rangees par possibilite (Au columbarium / Au jardin du souvenir / Dans une
   tombe, plus "A savoir aussi" si une ligne n'entre nulle part). Aucune ligne
   n'est retiree ni reecrite. Le tableau des taxes communales suit, avec sa
   phrase "ce sont des taxes communales, pas des prix de monument", sa note et
   sa source.
7. **Duree et entretien**, **Questions frequentes** (replis natifs, la
   premiere reponse ouverte), **Documents officiels** (sources + mention de
   verification).
8. **Autres cimetieres.** Meme liste de liens et memes textes qu'avant, en
   grille compacte : 1543 px de haut dans l'ancienne page, environ 600 px ici.

## Regles tenues

- Un seul `<main>`, un seul `<h1>`, le h1 exact d'avant.
- `<title>`, meta description, canonical, absence de `robots`, JSON-LD
  WebPage + about Cemetery + FAQPage + BreadcrumbList : identiques a la
  baseline (verifie, voir plus bas).
- Tous les faits, paragraphes, articles, regles, tarifs, sources, questions et
  liens sont dans le HTML initial, y compris dans les replis. Aucun fait
  nouveau, aucune date de verification "rafraichie".
- Corps a 17 px, lignes sous 75 caracteres, boutons 52 px, `summary` 44 px au
  moins, focus visible renforce, tableaux defilants annonces
  (`role="region"`, `aria-labelledby`, `tabindex="0"`), `prefers-reduced-motion`
  respecte, aucune animation au defilement, aucune image inventee.
- Le fichier du composant est en ASCII : les libelles d'interface passent par
  des entites HTML (`&#xe9;`) ou des echappements `\uXXXX`, les accents
  s'affichent normalement.

## Titres d'interface changes (et pourquoi)

- "L'essentiel" disparait comme titre : son contenu est le panneau pratique du
  hero, plus haut et plus utile.
- "Un monument pour ce cimetiere" devient "Votre projet dans ce cimetiere"
  (demande du brief ; le paragraphe et les deux liens sont inchanges).
- Les entrees de sommaire sont ecrites en besoins (Venir, Preparer un
  monument...) alors que les h2 gardent leurs formulations d'origine (Sur
  place, Poser un monument...), qui portent le vocabulaire cherche sur Google.
- Deux libelles courts sont ajoutes : "Le numero est celui de l'administration
  communale, pas le notre" et l'avertissement du schema.

## Ce qui a ete teste le 10.11.2026

- `npm run build` : 75 pages, vert. `npx astro check` : 0 erreur, 0
  avertissement, 3 hints (les memes qu'avant). `npm test` : 155 tests, 6
  fichiers, vert.
- Controle de regression HTML baseline / apres, hors depot :
  `tmp/cimetieres-ux-20261110/` (baseline `avant/`, resultat `apres/`, script
  `controle.py`, resultat `rapport.md`). Il compare title, description,
  canonical, robots, nombre de `main` et de `h1`, types JSON-LD, ancres et
  leurs cibles, liens, et surtout chaque texte de donnee de la baseline.
  Resultat : hub `/cimetieres/` identique au bit, 8 autres pages cimetiere
  identiques en contenu (meme texte, memes liens, memes schemas), page pilote
  sans aucun texte de donnee perdu. Les deux seuls textes absents sont les
  deux titres d'interface changes ci-dessus.
- Navigateur local (`/home/kumo/atelier/bin/browser`, serveur Python sur
  127.0.0.1) en 1440x1000, 768x1024, 390x844 et 320x800 : aucun debordement
  horizontal (scrollWidth = clientWidth partout), ancres qui tombent sous
  l'en-tete colle, replis qui s'ouvrent au clavier (Entree), rail colle sans
  masquer le texte, schema a l'echelle mesuree (1,6 px/cm sur les deux vues).
  Captures dans `tmp/cimetieres-ux-20261110/captures/`.
- Hauteur de page : 10 345 -> 9 151 px en 1440 (-12 %) ; 10 350 -> 10 698 px en
  768 ; 13 583 -> 14 177 px en 390 (+4 %). La page de telephone est un peu plus longue malgre la FAQ repliee,
  parce que le corps passe de 15 a 17 px (lisibilite demandee par la charte) et
  que le schema est nouveau ; ce qui change vraiment, c'est l'ordre : actions
  et navigation arrivent avant le premier tiers de l'ancienne page.

## Limites connues

- **Effet de bord sur les 8 autres pages cimetiere** : le CSS de la route
  `[slug].astro` passe d'un `<style>` en ligne a une feuille externe partagee
  (Astro n'inline que sous 4 Ko). Leur HTML gagne un `<link>` et perd son
  `<style>` ; le contenu, les liens et les schemas sont identiques. Cout :
  environ 2 Ko gzip de CSS inutilise sur ces pages tant que le pilote n'est pas
  generalise. C'est reversible en generalisant (tout le CSS sert) ou en
  revenant a l'ancienne mise en page.
- Le rangement des lignes "urnes" par possibilite est une reconnaissance par
  mots (columbarium/niche, jardin du souvenir, tombe). Pour un autre cimetiere,
  relire le resultat avant de generaliser : une ligne mal rangee doit etre
  corrigee dans le composant, jamais en reecrivant la donnee.
- Les tableaux gardent leurs 4 colonnes sur telephone et se font defiler
  lateralement (la legende reste collee a gauche). Pas de version "empilee" :
  elle casserait la semantique du tableau.
- Les liens poses dans une phrase (fil d'Ariane, numero du guichet, lien d'une
  note) restent a la taille du texte, entre 16 et 40 px de haut : exception
  prevue par WCAG 2.5.8 pour les liens en ligne. Les liens seuls dans une
  liste font 44 px.
- `scroll-behavior: smooth` est declare globalement dans `src/styles.css` : il
  n'est pas coupe par `prefers-reduced-motion`. A traiter globalement, hors de
  ce pilote.
- Le bandeau de consentement couvre le bas de l'ecran tant qu'on n'a pas
  repondu : comportement existant du site, visible sur les captures.

## Avant de generaliser

1. Faire relire la page pilote (critique visuelle) et decider des titres.
2. Verifier le rendu sur une fiche pauvre (Le Landeron : pas d'adresse, pas
   d'acces, pas de tarifs) et sur une fiche sans schema possible (hauteur ou
   surface non publiee : le schema ne se dessine pas, c'est prevu).
3. Relancer `controle.py` entre la baseline et le nouveau build.
