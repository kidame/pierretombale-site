# SPEC BUILD — PierreTombale.ch

> **Document maître pour la session Claude Code qui construira le site.**
> Autonome : toutes les décisions sont dedans. Au démarrage du repo du site, **copier ce dossier
> `w6/pierretombale.ch/` entier** (ce fichier + `production-spec-pierretombalech.json` + le brief)
> dans le nouveau repo. Les études complètes vivent dans `kumo-workflow` :
> `analyses/2026-08-17-niche-pierre-tombale-ne.md` (§1–§14) + `analyses/data/*.csv`.
> Statut au 17.08.2026 : GO business validé (Alnes). En attente : grille de prix (coût de
> production en cours), photos granits/atelier, siège + NPA + téléphone, confirmation Kushtrim.

## ⚠️ À lire AVANT d'ouvrir `production-spec-pierretombalech.json` : valeurs provisoires

Le production-spec a été généré le 17.08 par W6 à partir d'un formulaire dont les champs obligatoires
ont dû être remplis avec des **valeurs de substitution**. Elles apparaissent à ~39 endroits du JSON
(`client.*`, les sections `coordonnees` / `contact` / `formulaire_contact` de plusieurs pages, et toute
la page « pierre tombale Couvet » `pages[8]`). **Ne jamais les recopier telles quelles dans le site** :

| Valeur dans le JSON | Ce que c'est vraiment | À faire |
|---|---|---|
| `telephone: 078 930 81 00` | Numéro **KUMO de Thomas**, saisi pour passer le champ obligatoire. **Pas** le numéro de l'entreprise. | Variable de config, vide tant que l'entreprise n'a pas son numéro. Footer, JSON-LD et boutons d'appel **masqués** en attendant ; le formulaire de commande est le seul canal. |
| `npa: 2108`, `commune_siege: Couvet` | Hypothèse de travail (localité du marbrier sortant). **Le siège réel n'est pas décidé.** | Variable de config. Aucun `PostalAddress` ni LocalBusiness tant que l'adresse n'est pas confirmée. |
| `nom_entreprise: PierreTombale.ch` | Nom de travail (domaine libre au 17.08, pas encore réservé). | Variable de config unique, nom définitif à confirmer par les associés. |
| `ville: Suisse` | Contournement du ticket T-034 (la seed « pierre tombale Val-de-Travers » ne rend aucune donnée). | À ignorer pour le contenu des pages : la cible géographique réelle est dans la section 2 de cette spec. |

**Règle de build** : toute coordonnée d'entreprise vient d'un fichier unique `src/config/entreprise.ts`
(valeurs `null` au départ). Le JSON W6 fournit la structure des pages, les mots-clés et les composants,
**pas** les données de contact.

## 0. Le projet en 5 lignes

Marbrerie funéraire suisse (siège Val-de-Travers/NE, portée Suisse romande), granit sourcé en
direct (Kosovo), positionnement **prix affichés « dès X CHF tout compris »** — personne ne le fait
en Suisse romande (le leader lespierrestombales.ch cache ses prix). ~90 % de crémation en CH →
**le cinéraire est au centre du catalogue**, pas en option. Vente = commande/devis + rappel humain
(modèle France Tombale), **pas de paiement en ligne v1**. Mise en ligne visée : avant la Toussaint.

## 1. Stack (décidée, vérifiée aux sources le 17–22.08.2026 — rapport §14)

| Brique | Choix | Notes |
|---|---|---|
| Framework | **Astro 7** (Node ≥ 22.12), 100 % statique | i18n natif (`locales:['fr','de']`, `defaultLocale:'fr'`, `prefixDefaultLocale:false`), content collections, `astro:assets` |
| Starter | Fork **github.com/mearashadowfax/ScrewFast** (MIT) | i18n câblé, JSON-LD, OG, sitemap. **Élaguer Preline UI / GSAP / Lenis.** Branche `monolingual-site` possible pour démarrer FR seul |
| CSS | Tailwind v4 via `@tailwindcss/vite` | l'intégration `@astrojs/tailwind` est obsolète |
| Îlot interactif | **@astrojs/preact**, un seul îlot : le configurateur, `client:visible` | le reste du site = 0 JS |
| Canvas | **Konva.js** vanilla (≥ 10.3, ~55 KB gzip, MIT, 0 dépendance) | PAS react-konva, PAS Fabric (API v5→v7 cassée, corpus LLM périmé), PAS SVG natif pour l'export (ressources à inliner, bugs Safari) |
| Texte → vecteurs | **opentype.js** (MIT) : `Font.getPath()` → `Path.toSVG()` | pour la fiche de fabrication (§5). Charge les .ttf/.woff des 6 polices |
| Polices | 6 familles OFL via **Fontsource npm**, ~140 Ko woff2 total, subset latin suffit (ë Ë ç Ç ä ö ü ß vérifiés dans la cmap) | **Cinzel** (capitale gravée — petites capitales par design, le documenter dans l'UI), **Marcellus** (romain lapidaire), **EB Garamond** (romain classique), **Jost** (bâton), **Great Vibes** (anglaise), **Pinyon Script** (copperplate). ẞ majuscule allemand absent partout → convention SS |
| Formulaires | fetch POST **multipart/form-data** → webhook n8n prod (n8n.kidame.ch) | CORS : « Allowed Origins » = https://pierretombale.ch (OPTIONS natif OK). ⚠️ régler `client_max_body_size` nginx (1 MiB par défaut) à ~25 MiB |
| Anti-spam | honeypot (`position:absolute` hors écran, PAS `display:none`) + time-trap < 3 s + **Cloudflare Turnstile** (gratuit illimité) validé côté n8n via `siteverify` | token 300 s à usage unique : `turnstile.reset()` avant chaque retry, `data-expired-callback` géré |
| Hébergement | **Cloudflare Pages** (gratuit, BP illimitée, deploy Git, PoP GVA/ZRH) ; domaine .ch chez **Infomaniak**, zone DNS → Cloudflare | Netlify écarté (crédits 2026). Considérer Workers static assets (successeur poussé par CF, même gratuité). Formulation marketing honnête : « domaine suisse, données de commande traitées en Suisse (n8n auto-hébergé), site servi depuis Genève/Zurich » |
| Coût récurrent | **domaine seul (~12 CHF/an ×2 domaines)** | tout le reste MIT/OFL/gratuit |

## 2. Arborescence & pages (rapport §5, §8.5, §11 ; détail par page dans `production-spec-pierretombalech.json`)

**Règle lexicale absolue (§11)** : titres/H1 avec les mots des familles — « urne », « columbarium »,
« plaque », « monument pour urne ». « Cinéraire » en corps de texte seulement (30 rech./mois, terme
de métier). Ne JAMAIS cibler « urne » seul (ambigu votations en CH) ni « crematorium » (navigationnel).

1. **Accueil** — marbrerie + zone (VdT / canton NE / Suisse romande).
2. **Prix** (`/prix-pierre-tombale-suisse/`) — LA page stratégique : tableau « dès X CHF tout
   compris » par type, ce qui est inclus (gravure N lettres, pose, taxes), comparaison honnête avec
   les fourchettes du marché (2'000–15'000 publiés par everlife/marbrier-geneve/bestatter). Cible le
   cluster prix (~200/mois) + PAA + AI Overview.
3. **Catalogue monuments** — par type : simple / double / **cinéraire** (petits monuments pour urnes,
   cavurnes) ; par style : moderne / classique ; par matière : granit / marbre. Prix « dès » sur
   chaque fiche + bouton configurateur.
4. **Urnes & columbarium** (`/urne-funeraire/`, `/columbarium-plaques/`) — 170 + 320 rech./mois.
5. **Plaques funéraires** — cluster ~200/mois (longue traîne, KD 61 sur le head : ne pas s'acharner).
6. **Gravure & inscription complémentaire** — ajout d'un nom sur tombe existante (récurrent).
7. **Entretien / rénovation de tombes** — zéro concurrence.
8. **Pierre tombale musulmane** — segment diaspora, quasi personne en Suisse romande.
9. **Pages villes** : val-de-travers, neuchatel, la-chaux-de-fonds, le-locle (+ val-de-ruz ph. 1.5 ;
   vaud/fribourg/valais ph. 2 — requêtes cantonales 50/30/20).
10. **Pages cimetières** (autorité locale, playbook GPG) : un gabarit par cimetière du canton —
    règles, dimensions max autorisées, délai de pose (~1 an après inhumation à NE), contact commune.
    « cimetière la chaux-de-fonds » 90/mois, « cimetière neuchâtel » 30.
11. **Hub « Accompagner le deuil »** (~4'100 rech./mois, concurrence quasi nulle — §8.3) : messages
    de condoléances (1'300), textes de condoléances courts (880), condoléances touchantes (720),
    épitaphes (480 + bibliothèque d'épitaphes réutilisable DANS le configurateur), textes d'hommage
    (110), remerciements après décès (50), musiques d'obsèques (180), rédiger un avis de décès,
    faire-part (110), jardin du souvenir (140). Maillage systématique vers catalogue/prix. Ton sobre.
12. **Pages confiance** : notre atelier & le granit (E-E-A-T, photos), prévoyance (« choisir son
    monument de son vivant », 110/mois CPC 5.49), contact, à propos, CGV/mentions/confidentialité.

**Contenus collections Astro** : `monuments` (fiches produit), `granits` (nuancier), `villes`,
`cimetieres`, `guides` (hub deuil), `epitaphes` (data JSON réutilisée par le configurateur).

## 3. SEO & performance (exigences non négociables)

- Core Web Vitals verts mobile (statique + 1 îlot lazy = acquis si on ne charge Konva/fonts que sur
  les pages produit, `client:visible`).
- **JSON-LD** : LocalBusiness (siège, à activer quand adresse connue) + Product avec `offers`
  (« dès » = `lowPrice`) sur chaque fiche + BreadcrumbList + FAQPage sur les FAQ.
- `@astrojs/sitemap` (avec alternates i18n en ph. 2) + robots.txt + canonicals propres.
- **Flux Google Merchant Center** : endpoint `src/pages/merchant-feed.xml.ts` généré au build
  (RSS 2.0 namespace `g:`) — valider le format dans Merchant Center au premier envoi.
- Images : `astro:assets` (AVIF/WebP, srcset), photos granits/monuments optimisées.
- FAQ par page depuis les PAA mesurées (« Quel est le prix moyen d'une pierre tombale ? », « Qui
  doit payer ? », « Quand poser la pierre ? », « Est-ce obligatoire ? », « Différence stèle/pierre
  tombale ? », « Prix d'un caveau 2 places ? »).
- Search Console + Merchant + (analytics léger à décider : Umami self-host sur notre serveur ou rien
  au départ ; PAS de GA4 lourd sans consentement géré).

## 4. Le configurateur (rapport §13 + standards métier vérifiés)

**Parcours 5 étapes** (modèle des leaders FR/US) : modèle → granit → texte+police(+motif) →
aperçu + estimation immédiate → passer commande.

**Modèle de données — tout en millimètres réels** (`src/data/monuments/*.json`) :

```json
{
  "id": "stele-doucine-01", "nom": "Stèle doucine", "type": "cineraire|simple|double",
  "dimensions_mm": { "stele": [600, 800, 80], "socle": [700, 200, 150] },
  "zone_gravure_mm": { "x": 60, "y": 120, "largeur": 480, "hauteur": 400 },
  "prix_base_chf": null, "coef_granits": { "noir-fin": 1.0, "gris-clair": 0.9 },
  "photos": { "noir-fin": "…", "gris-clair": "…" }
}
```

- **Échelle canvas** : 1 px = 0.5 mm (constante unique). Toute position stockée en mm.
- **Granits** : photos pré-rendues par modèle×granit si l'atelier les fournit, sinon monument
  détouré + texture par `fillPatternImage`/masque (fidélité moindre, à prototyper).
- **Texte** : lignes structurées (pas un blob) : `[{texte, police, hauteur_lettres_mm, x_mm, y_mm,
  alignement}]`. **Hauteurs de lettres = presets métier : 30 / 40 / 50 / 60 mm** (standard funéraire
  vérifié : 3–6 cm ; facturation par lettre dans la grille de prix). Défauts proposés : nom 50 mm,
  dates 40 mm, épitaphe 30 mm.
- **Bibliothèque d'épitaphes** intégrée (depuis la collection `epitaphes`) + saisie libre.
- **Finitions de gravure** (choix, impacte prix + fiche atelier) : gravé sablé peint **blanc** /
  **doré** / feuille d'or (liste à confirmer avec l'atelier).
- **Prix live** : `base × coef_granit + nb_lettres × prix_lettre(hauteur, finition) + motif + options`
  → affiché « Estimation : dès X CHF tout compris ». Grille dans `src/data/tarifs.json` —
  **placeholder tant que le coût kosovar n'est pas connu** ; une seule source de vérité pour tout le site.
- **Rendu** : Konva.Stage 3 layers (photo monument / granit / texte+motif). `document.fonts.load()`
  de la police AVANT tout rendu texte (sinon PNG avec police de fallback). Attention plafond de
  taille canvas iOS Safari : `pixelRatio` 2 max pour l'export (~1200–1600 px).
- **UI** : inputs HTML classiques (pas de manipulation directe sur canvas), mobile-first,
  mention « Aperçu indicatif — la maquette définitive vous sera confirmée avant gravure ».

## 5. Pipeline commande → atelier Kosovo (LE maillon critique)

Objectif : une commande client produit automatiquement un **dossier de fabrication précis au
millimètre et neutre en langue**, exploitable par les graveurs sans rien retaper. Modèle inspiré du
« proof » des designers US (Monumize : proof photoréaliste + approbation signée avant gravure).

**À la commande, le navigateur génère 3 artefacts** (tous POSTés dans le même multipart) :

1. **`preview.png`** — l'aperçu client (Konva `toDataURL`, pixelRatio 2) : pour la famille, le BAT,
   Notion.
2. **`fabrication.svg`** — le fichier atelier, **échelle 1:1 en millimètres** (`viewBox` en mm,
   `width="600mm"`), contenant UNIQUEMENT des tracés vectoriels : le texte est converti
   **police → paths via opentype.js** (`Font.getPath(texte, x, y, taille)` → `Path.toSVG()`).
   Zéro dépendance de police côté atelier, importable tel quel dans un logiciel de découpe de
   pochoir (sablage) ou de gravure laser. + calque « cotes » : contour du monument, distances du
   bloc texte aux bords en mm, hauteur de lettres par ligne, repères d'alignement.
3. **`commande.json`** — machine-readable, la source de vérité :

```json
{
  "ref": "PT-2026-0001", "client_ref": "uuid",
  "monument": "stele-doucine-01", "granit": "noir-fin",
  "dimensions_mm": {…}, "finition": "sable-peint-dore",
  "lignes": [
    {"texte": "ALBAN GASHI", "police": "Cinzel", "hauteur_mm": 50, "x_mm": 300, "y_mm": 180, "alignement": "centre"},
    {"texte": "1948 – 2026", "police": "Cinzel", "hauteur_mm": 40, "x_mm": 300, "y_mm": 260, "alignement": "centre"}
  ],
  "motif": {"id": "rose-01", "position_mm": [80, 600], "hauteur_mm": 120},
  "cimetiere": "Couvet", "prix_estime_chf": 0
}
```

**Flux n8n (nouveau workflow, pattern W5)** :
webhook (Turnstile vérifié) → fiche **Notion** (statuts : `nouvelle → BAT envoyé → BAT validé → en
fabrication → posée`) avec les 3 fichiers → email **famille** (récap + BAT : « vérifiez chaque
lettre et chaque date — c'est gravé dans la pierre » + rappel des règles du cimetière choisi) →
**⛔ STOP humain : rien ne part à l'atelier sans BAT validé** (réponse écrite de la famille, statut
basculé à la main) → email **atelier** (template bilingue FR/EN sobre, l'albanais peut s'ajouter :
les cotes et le SVG parlent d'eux-mêmes) avec `fabrication.svg` + `commande.json` + `preview.png`.

**Checkpoint cimetière** (différenciateur + anti-drame, pratiqué par les US) : le formulaire demande
le cimetière → croisement avec la collection `cimetieres` (dimensions max autorisées) → alerte si le
modèle dépasse ; à défaut de donnée, mention « nous vérifions la conformité avec votre commune avant
fabrication ».

**Filet de fiabilité** (§14) : AbortController 15 s, 2–3 retries backoff avec `turnstile.reset()`,
`order_client_id` UUID dédupliqué côté n8n, monitoring UptimeRobot du webhook.

## 6. Phase 2+ (dessiné, pas construit en v1)

- **/de/** : i18n Astro déjà configuré, hreflang via sitemap ; marché « grabstein » ×4 (§9), étude
  SERP/KD allemande À FAIRE avant d'investir. Domaines libres notés : grabsteine-schweiz.ch,
  grabstein-preis.ch.
- **E-commerce expédiable** (urnes pierre, plaques gravées — §11) : fiches Product prêtes dès la v1
  (schema + Merchant), panier Snipcart/Shopify SEULEMENT si le volume le justifie.
- **Acompte en ligne** : lien Payrexx (TWINT) ou Stripe dans l'email de confirmation — sans refonte.
- **Avis de décès** (§10) : hub deuil v1 capte l'aval ; republication d'avis locaux = pari phase 3
  adossé au partenariat pompes funèbres.

## 7. Ce qui manque encore (placeholders prévus, n'empêche PAS le build du squelette)

| Input | Où il s'insère | Placeholder v0 |
|---|---|---|
| Grille de prix (coût kosovar en cours) | `src/data/tarifs.json` | `null` → UI affiche « prix sur demande » tant que non rempli |
| Photos granits + atelier + réalisations | collections `granits`, page atelier | textures d'exemple libres de droits, marquées À REMPLACER |
| Siège, NPA, téléphone | config globale + LocalBusiness + footer | « Val-de-Travers (NE) » sans adresse, LocalBusiness désactivé |
| Polices réellement gravables par l'atelier | filtre sur les 6 polices | les 6 activées, à restreindre |
| Finitions proposées (blanc/doré/feuille d'or…) | configurateur + tarifs | les 3 classiques |
| Motifs gravables | collection `motifs` | 6 SVG génériques |
| Nom définitif + logo | partout | PierreTombale.ch, logo typographique Cinzel |

## 8. Ordre de build recommandé (pour la session Claude Code)

1. Fork ScrewFast → élagage (Preline/GSAP/Lenis out) → Tailwind 4 → i18n fr → deploy Cloudflare
   Pages branché (préviews par branche dès le jour 1).
2. Collections + gabarits : monuments, granits, villes, cimetières, guides — avec 2–3 fiches
   d'exemple chacune.
3. Configurateur : îlot Preact+Konva, données mm, 6 polices Fontsource, prix live sur tarifs.json.
4. Pipeline commande : opentype.js → fabrication.svg + commande.json + preview.png ; formulaire
   multipart + Turnstile ; workflow n8n (webhook → Notion → emails, stop BAT).
5. Contenus : page prix (structure sans chiffres), hub deuil (6–8 guides), pages villes, FAQ.
6. SEO plumbing : JSON-LD, sitemap, merchant-feed.xml, OG, canonicals.
7. Recette : Lighthouse mobile ≥ 95, test iPhone réel du configurateur (plafond canvas), test
   bout-en-bout commande → Notion → emails → SVG ouvert dans un logiciel vectoriel.

## 9. Sources des points vérifiés

Rapport complet : `kumo-workflow/analyses/2026-08-17-niche-pierre-tombale-ne.md` (§1–§14, chaque
§ cite ses sources). Lettrage 3–6 cm : guides gravure GPG/Funexis/Comitam (17.08). Pattern proof :
monumize.com, legacyheadstones.com, signatureheadstones.com (17.08). opentype.js : github.com/opentypejs/opentype.js
(MIT, ~5k★, `Font.getPath`/`Path.toSVG`, WOFF/TTF). Konva/Fontsource/n8n/Turnstile/Cloudflare :
§14 (vérifiés code source et pages officielles, 17–22.08.2026).
