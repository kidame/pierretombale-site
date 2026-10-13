# Analyse SEO — niche « pierre tombale / monument funéraire », Val-de-Travers · Neuchâtel · La Chaux-de-Fonds

**Date** : 2026-08-17 · **Données** : DataForSEO (Google Ads, Labs, SERP live, backlinks), relevées le jour même, location Suisse (2756), langue fr · **Coût data estimé** : ~0.5–1 CHF
**Contexte** : projet d'un service de pierres tombales à prix contenus (approvisionnement direct en pierre via contacts au Kosovo), motivé par le départ à la retraite du principal vendeur du Val-de-Travers. KUMO ferait le site + le SEO. Cible prioritaire : Val-de-Travers ; Neuchâtel et La Chaux-de-Fonds à capter aussi.
*Note doctrine : une analyse de niche vit normalement dans le repo de travail ; elle est déposée ici car la session est ouverte sur `kumo-workflow`. Aucune PII — uniquement des entreprises publiques et des données de marché.*

---

## Verdict (résumé en 10 lignes)

**GO — mais pas pour les raisons attendues.** Le Val-de-Travers seul est un micro-marché : toutes les requêtes « pierre tombale + ville du canton » sont **sous le seuil de mesure Google** (<10/mois). Ce n'est PAS un marché de volume : c'est un marché de **panier** (2'000–15'000 CHF le monument, fourchette publiée par les sites suisses qui ranken) où 1–2 ventes web par mois changent tout.
La fenêtre concurrentielle, elle, est **exceptionnelle** :
1. Le pack local vu du Vallon est rempli par des marbreries **vaudoises** (Yverdon, Bussigny) — le seul acteur local, Marbrerie Terziani à Couvet, a une fiche Google **sans site web** (1 avis) : c'est très probablement le sortant.
2. Le #1 suisse en organique sur « pierre tombale » (lespierrestombales.ch, Genève) est un **site récent avec 28 domaines référents** qui a pris la place avec de simples pages ville — preuve que la barrière d'entrée est minuscule (KD du mot-clé principal : **2/100**).
3. L'intention la plus commerciale du marché est **« prix pierre tombale suisse »** (70/mois, intent commercial à 93 %) — et personne n'y répond avec de vrais prix affichés. Un positionnement « prix transparents, moins chers » attaque exactement là où la demande est la plus chaude.
**Là où il faut être honnête** : demande nationale en léger déclin (~-19 % sur un an sur le mot-clé principal, crémation oblige), et le SEO seul ne remplira pas un carnet de commandes au Vallon — il faut le combiner au bouche-à-oreille et aux pompes funèbres locales (prescripteurs).

---

## 1. Plan de recherche appliqué (méthode)

1. **Périmètre** : métier marbrerie funéraire × prestations (monument, gravure, entretien, plaques, columbarium/urnes) × zones (Val-de-Travers, Neuchâtel, La Chaux-de-Fonds, + national CH-fr).
2. **Demande** : volumes/CPC Google Ads (6 lots), expansion Labs (`keyword_suggestions` sur « pierre tombale » : 203 requêtes ; `keyword_ideas` : écarté, trop bruité), intentions (`search_intent`).
3. **Saisonnalité** : Google Trends CH (inexploitable, trop peu de données — marché trop petit) → remplacé par les courbes mensuelles Google Ads.
4. **Offre / saturation** : 5 SERP live mobiles géolocalisées (Val-de-Travers, Fleurier, Neuchâtel, La Chaux-de-Fonds, national) : pack local + organique + PAA.
5. **Difficulté** : `bulk_keyword_difficulty` (22 mots-clés) + autorité backlinks (`bulk_ranks`) des 13 domaines concurrents rencontrés.
6. **Vérifications** : registre Zefix (Terziani : introuvable sous ce nom — raison individuelle probable, à confirmer), recoupement annuaires (search.ch/local.ch).

Toutes les valeurs ci-dessous sont des **estimations DataForSEO/Google** (volumes arrondis par Google) — pas des mesures internes. « n.m. » = non mesuré (pas assez de données).

## 2. La demande — les mots-clés qui comptent (Suisse, fr)

### Le cœur commercial (à viser en priorité)

| Mot-clé | Vol./mois CH | CPC (CHF) | KD | Intention |
|---|---|---|---|---|
| pierre tombale | **320** | 3.26–9.27 | **2** | mixte : SERP = pack local + marbriers + prix |
| prix pierre tombale suisse (+ variante inversée) | **70** | 4.43–5.60 | 37 | **commercial 0.93** |
| catalogue pierre tombale prix | 50 | 3.04 | n.m. | commercial |
| monument funéraire | 50 | 8.62 | 41 | informational/commercial |
| prix pierre tombale / pierre tombale prix | 40 | 3.48–5.68 | n.m. | commercial 0.83 |
| marbrerie funéraire / marbrier funéraire | 40 | 7.91 | n.m. | commercial 0.51 |
| stèle funéraire | 30 | 7.52 | 43 | info/transactionnel |
| prix pierre tombale simple | 20 | 2.15 | n.m. | commercial |
| monument funéraire prix | 10 | 9.12 | n.m. | commercial |
| pierre tombale pas cher / d'occasion / en granit suisse… | 10 chacun | 0.3–9 | n.m. | commercial longue traîne |

Lecture : le cluster **« prix »** pèse ~200 recherches/mois à lui seul, avec les CPC les plus élevés du marché (jusqu'à 9 CHF le clic payé — c'est le prix que les annonceurs acceptent de payer pour CE trafic). Les Suisses ajoutent « suisse » à la requête pour fuir les résultats français : une page prix **suisse, chiffrée, honnête** est le meilleur actif SEO possible de ce projet.

### Le trafic « métier » (notoriété + local)

| Mot-clé | Vol./mois CH | CPC | KD | Note |
|---|---|---|---|---|
| marbrerie / marbrier | 320 chacun | 4.68 | 5–12 | mixte funéraire + plans de travail |
| columbarium | 320 | 2.21 | n.m. | informationnel (familles en amont) |
| urne funéraire | 170 | 0.58 | n.m. | transactionnel (e-commerce) |
| plaque funéraire | 70 | 3.30 | 61 | transactionnel, dominé par e-commerce FR |
| gravure pierre tombale | 10 | 1.91–8.85 | n.m. | prestation à page dédiée |
| entretien / nettoyage / rénovation tombe | 10–20 | ~0 | n.m. | prestation récurrente, zéro concurrence |
| pierre tombale musulmane | 10 | n.d. | n.m. | segment communautaire — pertinent vu le réseau des porteurs |

### Villes (base Labs, ce qui est mesurable)

| Mot-clé | Vol./mois | Note |
|---|---|---|
| pierre tombale vaud | 50 | l'arc lémanique cherche par canton |
| pierre tombale genève | 30 | |
| pierre tombale valais / lausanne | 20 | CPC lausanne 8.63 |
| marbrerie la chaux-de-fonds | 20 | seule requête locale NE mesurée |
| pierre tombale neuchâtel, marbrerie neuchâtel, … val-de-travers, fleurier, le locle | **<10 (n.m.)** | sous le seuil de mesure |
| pompes funèbres neuchâtel · la chaux-de-fonds (écosystème) | 140 · 50 | la demande funéraire locale existe bel et bien |

**Lecture honnête des volumes locaux** : « pierre tombale neuchâtel » n'est pas mesurable, mais la demande locale passe par la **requête générique tapée depuis la zone** (« pierre tombale », « marbrerie ») + le **pack local**. Le contraste avec « pompes funèbres neuchâtel » (140/mois) montre que les familles cherchent d'abord les obsèques, puis le monument des mois plus tard (règle des cimetières NE : attendre ~1 an le tassement de la terre avant la pose — c'est écrit sur neuchatelville.ch). Les pompes funèbres locales sont donc **le premier canal d'apport d'affaires**, le SEO le second.

### Saisonnalité et tendance

- Google Trends CH : quasi aucune donnée (marché trop petit) — non exploitable, dit tel quel.
- Courbes mensuelles Google Ads « pierre tombale » : pics **mars (390)** et **octobre (390)**, creux déc–janv et été (260). Amplitude modérée (±20 %) : pas de fenêtre critique, mais viser une mise en ligne **avant octobre** (Toussaint) ou au pire avant mars.
- Tendance annuelle du mot-clé principal : **~-19 %** (Labs). Cohérent avec la montée de la crémation (columbarium 320/mois…). Le marché rétrécit lentement en volume — il reste un marché de panier élevé, et le columbarium/plaques cinéraires est la diversification naturelle à prévoir dans l'offre.

## 3. La concurrence — qui rank vraiment, et à quel point c'est prenable

Autorité backlinks (échelle DataForSEO 0–1000 ; un site établi normal = 300+) :

| Domaine | Qui | Autorité | Position observée |
|---|---|---|---|
| lespierrestombales.ch | Genève (Carouge), site récent | **131** (28 dom. réf.) | **#1 CH organique « pierre tombale »**, pages ville (dont Neuchâtel #5 sur « pierre tombale neuchâtel ») |
| lesateliersdelacernia.ch | Neuchâtel (carrière + taille) | 342 | #2–3 local, mais site orienté patrimoine ; « pierre tombale » #12 via une page secondaire |
| oudinmarbrerie.ch | Neuchâtel, leader visibilité ville | 204 | Knowledge panel + #1 sur « pierre tombale neuchâtel » — mais **aucun** mot-clé funéraire commercial ranké ailleurs : visibilité = marque + fiche Google, zéro SEO de contenu |
| latelierdelapierre.ch | La Chaux-de-Fonds | 91 | pack local CdF (4.8/13 avis) |
| marbrerie-mathez.ch | La Chaux-de-Fonds | **0 backlink détecté** | pack local CdF — **2 fiches Google dupliquées** (4.6/10 et 5.0/2), site daté |
| Marbrerie Terziani | **Couvet (Val-de-Travers)** | — | fiche Google **sans site web**, 1 avis. Introuvable au Zefix sous « Terziani » (raison individuelle probable — à faire confirmer par les associés). Très probablement le sortant. |
| marbrier-geneve.ch | Genève (Designo Granit) | **31** | #2 national sur le cluster prix avec une simple page « prix-pierre-tombale » |
| everlife.ch | pompes funèbres en ligne | 337 | #1 national prix via un article de blog **de 2022** |
| marbrerie-romande.ch / cirillo / pidoux / marbreriedyverdon | Vaudois | 63 / 56 / 87 | occupent le pack local… vu du Val-de-Travers |
| search.ch / local.ch | annuaires | — | top 5 organique sur toutes les requêtes locales NE/CdF — signe de SERP faible |

Ce que disent les SERP live (mobile, géolocalisées) :

- **« pierre tombale » depuis le Val-de-Travers** : pack local = Pidoux (Montagny-près-Yverdon), Cirillo (Bussigny), Marbrerie d'Yverdon. **Aucun acteur du canton.** Google va chercher à 40–60 km faute de candidat local avec site + fiche solide.
- **« marbrerie » depuis Fleurier** : Pidoux, Cernia, **Terziani (Couvet, sans site)**. La relève locale est à prendre telle quelle.
- **« pierre tombale neuchâtel »** : Oudin en panel, puis **annuaires en #3–4**, et le Genevois lespierrestombales.ch qui capte la ville avec une page dédiée. Quand des annuaires tiennent le top 5, une vraie page optimisée les passe.
- **« marbrerie la chaux-de-fonds »** : annuaires #1–2 en organique ; Mathez et ses fiches dupliquées dans le pack. Prenable pareil.
- **« prix pierre tombale suisse » (national)** : AI Overview + blogs (everlife 2022, avisdeces, bestatter) + un marbrier genevois. Les fourchettes publiées : **2'000–8'500** (everlife), **2'150–15'000** (marbrier-geneve), **3'500–15'000** (bestatter/avisdeces). Personne n'affiche un catalogue avec de vrais prix. C'est LE référentiel public à casser pour un entrant « moins cher » — et la matière idéale pour être cité par l'AI Overview.
- **PAA récurrentes** (à traiter en FAQ) : « Quel est le prix moyen d'une pierre tombale ? » · « Combien coûte une pierre tombale en Suisse ? » · « Prix d'une pierre tombale simple en Suisse ? » · « Différence entre stèle et pierre tombale ? » · « Quelle pierre mettre sur une tombe ? »

**Limite de mesure** : le comptage Maps par catégorie (`business_listings_search`) n'a rien rendu (filtre catégorie non matché) — la densité concurrentielle est estimée via packs locaux + annuaires (5 marbreries inscrites à Neuchâtel, 3 à La Chaux-de-Fonds, 1 au Val-de-Travers). Dit comme tel.

## 4. Croisements (le cœur de l'analyse)

1. **Demande × offre** : volume national modeste mais réel (~1'000+ recherches/mois sur l'univers funéraire pierre), offre locale NE quasi absente du web (leader ville sans SEO de contenu, CdF tenu par des annuaires, Vallon vide). → Opportunité nette, entrée par le local ET par le national prix.
2. **Demande × intention** : tout ce qui contient « prix » est commercial à 0.8–0.93 — et c'est là que le projet a un avantage structurel (coût d'appro). Le trafic informationnel (columbarium, « tombe ») nourrit la notoriété mais ne vend pas directement.
3. **Difficulté × capacités** : KD 2–43 sur les cibles, autorités adverses ≤342, le #1 national a 28 domaines référents. Aucun besoin de netlinking lourd : on-page propre + pages dédiées + GBP + quelques annuaires suisses suffisent pour jouer le podium. C'est exactement le périmètre KUMO (site + on-page + local).
4. **Saison × calendrier** : mise en ligne idéale **avant octobre 2026** (pic Toussaint), sinon avant mars 2027.
5. **Fit** : hors prospection ICP classique (c'est un projet propre) ; aucune exclusion touchée. Le vrai risque n'est pas SEO : c'est le **volume d'affaires local** (Vallon ~11'000 hab.) et la part crémation qui monte — d'où la zone élargie et les prestations cinéraires au catalogue dès le départ.

## 5. Plan SEO recommandé pour le site (l'architecture qui gagne)

Logique KUMO « une page par prestation × ville », adaptée au funéraire :

**Pages socles**
1. Home = marbrerie funéraire + zone (Val-de-Travers / canton de Neuchâtel).
2. **« Prix d'une pierre tombale en Suisse »** — LA page stratégique : tableau de prix réels par type (simple / double / cinéraire), ce qui est inclus (gravure, pose, taxes cimetière), comparaison honnête avec la fourchette du marché. Vise le cluster prix (~200/mois) + les PAA + l'AI Overview.
3. Catalogue monuments **avec prix affichés** (granit, marbre, calcaire ; moderne / classique).
4. Prestations : gravure & inscription complémentaire · entretien / nettoyage / rénovation de tombes (récurrent, zéro concurrence) · plaques funéraires & columbarium · urnes cinéraires.
5. Page **pierre tombale musulmane** (orientation, modèles conformes ; segment servi par le réseau naturel des porteurs — quasi personne dessus en Suisse romande).

**Pages villes** (ordre de priorité)
val-de-travers (Fleurier, Couvet, Môtiers dans le texte) → neuchâtel → la-chaux-de-fonds → le-locle → val-de-ruz ; phase 2 : yverdon / vaud / fribourg / valais (les requêtes cantonales existent : 50/30/20/20 par mois).

**Pack local (décisif ici)**
- Créer la fiche GBP au siège (Vallon), catégorie Marbrier funéraire / monuments, photos d'ateliers et de réalisations, et **collecter les avis dès les premiers chantiers** : le pack VdT se gagne avec une poignée d'avis (Terziani en a 1, Mathez a des fiches dupliquées).
- S'inscrire sur local.ch, search.ch (ils ranken top 5 : y être = exister par procuration), + annuaire bestatter.ch.
- NAP cohérent partout ; si reprise de l'activité du sortant se négocie, récupérer sa fiche/son numéro serait un raccourci énorme (à explorer côté business).

**Contenu de confiance** (E-E-A-T funéraire) : FAQ par cimetière (règles NE : pose ~1 an après inhumation, dimensions autorisées — les pages communales ranken sur ces questions), guide granit vs marbre, délais, garantie. Ton sobre, jamais mercantile — c'est un achat de deuil.

**Technique** : stack KUMO habituelle (Astro, schema LocalBusiness + Product avec fourchettes de prix, Core Web Vitals propres, hébergement suisse). Aucun besoin de netlinking agressif.

**Objectifs 12 mois (réalistes au vu des KD/autorités)** : #1 pack local Val-de-Travers (3–4 mois) ; top 3 organique sur les requêtes canton NE (6 mois) ; top 3 national sur le cluster « prix pierre tombale suisse » (9–12 mois). Trafic attendu modeste (quelques centaines de visites/mois) — mais à 2'000–15'000 CHF le panier, le seuil de rentabilité SEO est à 1–2 conversions/mois.

## 6. Workflows n8n — compréhension et usage pour ce projet

Fonctionnement compris depuis les snapshots du repo (`workflows/W2-SNAPSHOT-LIVE-2026-07-28-apres-fiabilite.nodes.json` — le live n'était pas joignable depuis cette session : connecteur `n8n-edit` non actif, `N8N_EDIT_TOKEN` absent de l'environnement web. **Aucun workflow n'a été modifié.**)

**W2 — Concurrence & Mots-clés** (le workflow correspondant à cette analyse) :
- **Entrées** (formulaire ou webhook) : `JSON Output W1` (**requis** — W2 lit domaine/nom/service/ville depuis les métadonnées W1), `URL Concurrent 1..2` (requis) + `3` (optionnel), `Mots-clés seeds` (liste virgules), `Langue` (fr), `location_code` (défaut 2756 = Suisse), `Override requête Maps`, options custom (désactiver Maps, seuils volume, grille Maps).
- **Ce qu'il fait** : B1 volumes Ads → B2 suggestions par seed (boucle + dédup) → B3 ranked keywords du client → B3b ranked keywords des concurrents (analyse croisée = gaps) → B3c difficulté → B5 SERP + PAA → B6 autorité domaines → A sitemap/crawl OnPage des concurrents + classification des pages (Anthropic) + backlinks → C pack local Maps (coupé automatiquement hors Suisse) → synthèse IA → JSON final.
- C'est exactement l'enchaînement que j'ai exécuté ici **en direct via les mêmes endpoints DataForSEO** (B1/B2/B3c/B5/C1) — nécessaire car W2 exige un site client existant (W1), ce que le projet n'a pas encore.

**Séquence recommandée une fois le projet lancé** :
1. **W6 WebBrief** : générer le Production JSON du site (architecture ci-dessus en entrée) → build Astro avec Claude Code.
2. Site en ligne → **W1 Diagnostic** sur le nouveau domaine (baseline santé).
3. **W2** avec : JSON W1 du site, concurrents `lespierrestombales.ch` + `lesateliersdelacernia.ch` + `oudinmarbrerie.ch`, seeds `pierre tombale, monument funéraire, marbrerie funéraire, prix pierre tombale suisse`, Langue `fr`, location_code `2756`, Override Maps `marbrerie Val-de-Travers`.
4. **W3** si un rapport présentable aux associés est utile.
5. **W7 Suivi Positions** en mensuel dès la mise en ligne (il se relit d'un mois sur l'autre pour l'évolution).

## 7. Ce qui manque / à vérifier (honnêteté)

- **Volumes = estimations Google arrondies** ; les requêtes locales NE sont sous seuil — la demande locale réelle se lira dans GBP Insights et Search Console après lancement, pas avant.
- **Terziani/Couvet** : identité et départ à la retraite non vérifiés au registre (introuvable sous ce nom au Zefix) — info terrain des associés à confirmer. Idem pour l'éventuelle reprise de fiche/clientèle.
- **Taille réelle du marché VdT** (décès/an, part inhumation vs crémation, règlements des cimetières communaux) : à chiffrer via OFS/communes avant le business plan — hors de portée de DataForSEO, je ne l'invente pas.
- Le comptage Maps exhaustif a échoué (limite outil) ; densité estimée via packs + annuaires.
- Google Trends CH inexploitable sur cette niche (trop petite) — saisonnalité lue sur les courbes Ads uniquement.

---

## 8. Complément (17.08, même session de données) — la base de mots-clés du top français, testée pour la Suisse

**Méthode** : 2 SERP live France (mobile) sur « pierre tombale » et « prix pierre tombale » pour identifier le top FR → extraction des mots-clés organiques top 20 (volume ≥ 50) de 4 leaders : **gpggranit.com**, **france-tombale.fr**, **silver-plaque.fr**, **amgranit.com** (150 mots-clés uniques, 128 dans l'univers funéraire) → re-mesure **suisse** de 65 mots-clés canoniques (volumes Ads CH + difficulté KD CH). Données complètes : `analyses/data/2026-08-17-mots-cles-fr-vs-ch.csv`. Coût data additionnel ~0.3–0.5 CHF. Volumes = estimations Google arrondies, comme au §2.

### 8.1 Comment le top français gagne — et ce que ça confirme

- **france-tombale.fr** (#1 organique) vend « au prix juste » avec catalogue e-commerce complet ; **silver-plaque.fr** affiche un **prix unique 799 € TTC** pose comprise directement en SERP ; **gpggranit.com** publie catalogue + fourchettes chiffrées ; la SERP FR « prix pierre tombale » est remplie de **Google Shopping avec monuments à 990–2'618 €**.
- Le modèle gagnant français = **prix transparents + catalogue en ligne + pages guide chiffrées**. C'est mot pour mot le positionnement du projet — et personne ne l'applique en Suisse romande (§3). La France valide frontalement l'angle « prix affichés, moins chers ».

### 8.2 Transfert commercial FR → CH : proportionnel, pas de pépite cachée

| Mot-clé | Vol. FR | Vol. CH | Ratio | KD CH |
|---|---|---|---|---|
| pierre tombale | 12'100 | 320 | 38:1 | 2 |
| prix pierre tombale | 4'400 | 40 | 110:1 | n.m. |
| catalogue pierre tombale prix | 3'600 | 50 | 72:1 | 38 |
| monument funéraire | 3'600 | 50 | 72:1 | 41 |
| marbrerie | 14'800 | 320 | 46:1 | 5 |
| marbrier funéraire | 2'400 | 40 | 60:1 | 36 |
| stèle funéraire | 1'600 | 30 | 53:1 | 43 |
| urne funéraire | 6'600 | 170 | 39:1 | n.m. |
| plaque funéraire | 18'100 | 70 | 259:1 | 61 |

Lecture : le ratio « naturel » démographique (≈67 M vs ≈2 M de romands) est ~33:1. Le cœur du marché transfère dans cette proportion → **la France ne révèle aucune grosse requête commerciale qu'on aurait ratée** ; le cluster prix/catalogue du §2 reste la cible reine. Deux nuances :
- Les requêtes « prix … » sur-transfèrent vers la variante « … suisse » (§2) — les Suisses ajoutent le pays, le volume est là-bas.
- Le cluster **plaques funéraires** (l'eldorado FR à 18'100) sous-transfère (≈200/mois CH cumulés : plaque funéraire 70 + commémorative 70 + personnalisée/tombale/pour tombe ~60) avec le **KD le plus dur du corpus (61)** — les e-commerçants français tiennent cette SERP jusqu'en Suisse. → diversification e-commerce possible en phase 2 (léger, expédiable, sans pose), **pas un pilier**.

### 8.3 LA découverte : le moteur de contenu deuil (le playbook GPG Granit)

Le trafic des leaders français ne vient pas d'abord des pages produits : **gpggranit.com rank sur l'accompagnement du deuil** (condoléances, épitaphes, musiques d'obsèques…) et s'en sert comme moteur d'autorité. Ce cluster **transfère massivement** en Suisse fr — et il était absent de l'analyse initiale :

| Mot-clé (contenu) | Vol. CH/mois | Concurrence Ads CH | KD CH |
|---|---|---|---|
| message de condoléances | **1'300** | LOW | n.m. |
| texte de condoléances court | **880** | LOW | n.m. |
| condoléances touchantes | **720** | LOW | n.m. |
| épitaphe | 480 | LOW | n.m. |
| toutes mes condoléances | 390 | LOW | n.m. |
| texte court d'hommage à une personne décédée | 110 | LOW | n.m. |
| chanson / musique d'enterrement | 110 + 70 | LOW | 41–42 |
| remerciement décès | 50 | HIGH (CPC 5.20 !) | 43 |

≈ **4'100 recherches/mois cumulées en Suisse fr**, concurrence publicitaire quasi nulle, saisonnalité à pic **janvier** (mortalité hivernale) + mars/octobre. Pourquoi c'est de l'or pour ce projet :
1. **Autorité topique funéraire** : c'est exactement ce qui a construit gpggranit.com — les pages guides tirent les pages commerciales.
2. **Matière à AI Overview** : réponses courtes, listées, citables (comme la page prix au §3).
3. **Le visiteur en deuil d'aujourd'hui achète le monument dans 6–18 mois** (règle NE : pose ~1 an après inhumation) — capter tôt, laisser une trace (marque + GBP + newsletter discrète).
4. **Aucun acteur romand ne le fait.**

**Reco concrète** : un hub « Accompagner le deuil » de 6–8 pages (messages de condoléances, épitaphes, textes d'hommage, remerciements après décès, musiques d'obsèques, usages funéraires romands) + maillage interne vers catalogue/prix. Ton sobre et réellement utile, jamais mercantile — c'est aussi ce que le E-E-A-T funéraire (§5) exige.

### 8.4 Pièges et non-transferts (honnêteté)

- **« urne » (1'300/mois CH)** : ambigu — en Suisse, « urne » = aussi les **votations**. Ne jamais cibler seul ; la vraie cible est « urne funéraire » (170).
- **« crematorium » (590/mois)** : navigationnel (on cherche *son* crématorium), pic anormal en mai — pas une cible commerciale, au mieux une page info.
- **« granit du tarn »** (matière-marque FR) : 10/mois CH. L'origine de la pierre (ici Kosovo) n'a **pas de requête** — la pédagogie matière se joue sur « granit vs marbre », pas sur la provenance.
- **Intentions Labs** : plusieurs requêtes « prix … » sont étiquetées *informational* par le modèle — la SERP réelle (§3) est commerciale ; se fier aux SERP.
- **KD « n.m. »** : base Labs CH sans données (marché micro) — pas une preuve de facilité, mais sur ce corpus les SERP CH observées (§3) restent faibles.
- Le complément est **national CH** : rien de neuf côté volumes locaux NE — la conquête locale reste le pack local/GBP (§3, §5).

### 8.5 Deltas concrets au plan du §5

1. Page **Prix/catalogue chiffré** : inchangée — le modèle français la confirme comme arme n°1.
2. **+ Hub contenu deuil** (6–8 pages, phase 1–2) : ~4'100 rech./mois adressables, coût de production faible, concurrence CH quasi nulle. C'est le principal ajout de ce complément.
3. **+ Cluster plaques/cinéraire en phase 2** : e-commerce léger expédiable (modèle silver-plaque), sans pose — tester après le socle.
4. **FAQ enrichie** des PAA françaises transposées au droit suisse/NE : « Est-il obligatoire de mettre une pierre tombale ? », « Qui doit payer la pierre tombale ? », « Prix d'un caveau 2 places ? ».
5. **Trafic potentiel revu à la hausse** : avec le hub deuil en top 3, le site peut viser un ordre de grandeur de plusieurs centaines à ~1'000 visites/mois à 12 mois (vs « quelques centaines » au §5) — estimation, pas une promesse ; la **conversion**, elle, reste portée par prix/catalogue + pack local, le hub nourrit l'autorité et la marque.

---

## 9. L'axe non couvert : le marché alémanique « Grabstein » (ajout 17.08, sur question de Thomas)

Tout ce qui précède est mesuré **en français** — soit ~1/4 du marché suisse. Volumes allemands (Ads CH, langue de, relevés 17.08) :

| Mot-clé (de) | Vol. CH/mois | CPC (CHF) | Équivalent fr | Ratio |
|---|---|---|---|---|
| grabstein / grabsteine | **1'300** | 3.71 | pierre tombale (320) | **×4** |
| grabstein preis | 140 | 2.75 | prix pierre tombale (40) | ×3.5 |
| grabmal | 110 | 3.36 | monument funéraire (50) | ×2 |
| grabstein kaufen | 90 | 3.50 | — (pas d'équivalent fr mesuré) | — |
| urnengrab / urnengrabstein | 90 + 30 | 2.95–3.32 | cinéraire | — |
| grabstein schweiz | 70 | 3.99 | pierre tombale suisse | — |
| grabplatte | 70 | 3.42 | plaque tombale (20) | ×3.5 |

≈ **1'900+ rech./mois sur 10 requêtes de cadrage seulement** — le marché alémanique pèse ~4× le romand, aux mêmes CPC commerciaux.

**Pourquoi ce projet est spécialement bien placé** : sourcing granit national (pas d'ancrage géographique du coût), et la **diaspora kosovare est concentrée en Suisse alémanique** — réseau et langue potentiels côté associés.

**Réalité concurrentielle (honnête)** : grabstein.ch, grabsteine.ch, grabstein-schweiz.ch et grabmal.ch sont **déjà pris** (RDAP 17.08) — le marché DE est plus disputé que le romand. Libres : **grabsteine-schweiz.ch**, **grabstein-preis.ch**. Aucune SERP ni KD allemande n'a été analysée ici : **une étude alémanique complète (SERP, concurrents, difficulté) reste à faire avant d'investir.**

**Implication pratique** : pas pour le lancement (service germanophone + pose outre-Sarine à résoudre), mais **à dessiner dès le jour 1** — architecture multilingue prête ou stratégie deux sites exact-match (le modèle lespierrestombales.ch répliqué en allemand), catalogue partagé. La page « prix transparents » se réplique telle quelle (grabstein preis 140/mois).

**Pistes secondaires chiffrées au passage** : prévoyance funéraire 110/mois (CPC 5.49 — page « choisir son monument de son vivant », les marbriers n'y sont pas) ; pages par cimetière (cimetière la chaux-de-fonds 90, cimetière neuchâtel 30 — navigationnel, autorité locale, playbook GPG) ; plan de travail granit 210/mois (business séparé — diversification éventuelle du sourcing, à NE PAS mettre sur le site funéraire) ; mémorial animalier 10–50 (phase 3 au mieux).

---

## 10. Exploration de l'amont du parcours d'achat, en français (ajout 17.08, sur question de Thomas)

**Question** : reste-t-il du volume francophone « menant à l'achat d'une pierre tombale » qu'on n'a pas couvert ? Méthode : suggestions Labs sur « enterrement » et « obsèques » + volumes Ads CH sur ~20 requêtes amont ciblées.

### 10.1 La rivière de trafic n°1 du secteur : « avis de décès »

| Mot-clé | Vol. CH/mois | Concurrence Ads |
|---|---|---|
| avis de décès | **18'100** (pic 27'100 en janv.) | LOW |
| avis mortuaire (terme romand) | **2'900** | LOW |
| **avis de décès neuchâtel** | **1'300** | LOW |
| avis de décès la chaux-de-fonds | 320 | LOW |
| avis mortuaires neuchâtel | 210 | LOW |
| faire part de décès | 110 | HIGH |
| rédiger / modèle / exemple avis de décès | 10–20 chacun | LOW |

C'est **14× « pierre tombale »** — la plus grosse porte d'entrée du funéraire en ligne. **Lecture honnête** : les têtes de requête sont tenues par les portails qui **publient les avis réels** (hommages.ch, presse/arcinfo, sites de pompes funèbres) — une page de contenu ne les prendra pas ; il faut le *produit* (les avis eux-mêmes). Trois niveaux de capture réalistes :
1. **Déjà prévu sans le savoir** : le hub deuil (§8.3) intercepte l'audience des avis **en aval** — le lecteur d'un avis cherche ensuite « message de condoléances » (1'300), « condoléances touchantes » (720)… C'est le second étage de la fusée GPG.
2. **À ajouter au hub (côté famille-acheteuse)** : page « Rédiger un avis de décès : modèles et usages romands » (~40/mois cumulés, zéro concurrence marbrier) + « faire-part de décès » (110) + « jardin du souvenir » (140/mois, LOW — cinéraire).
3. **Le pari phase 3 (business, pas SEO pur)** : le plan fait déjà des **pompes funèbres locales le prescripteur n°1** — si ce partenariat inclut la **republication des avis locaux** (avec accord des familles/PF), viser « avis de décès neuchâtel » (1'300/mois) devient possible et ferait du site LE hub funéraire cantonal. Gros levier, exécution lourde, dépendante des partenariats — à décider en connaissance de cause.

### 10.2 Le reste de l'amont : à laisser (honnêtement)

- **Fleurs** (fleurs enterrement ~140, fleurs deuil 70, couronne 20) : territoire fleuristes/Interflora, hors métier — au mieux un lien partenaire.
- **Assurance/convention obsèques** (40 + 30, **CPC 19–25 CHF**) : le pré carré des assureurs — impayable et hors périmètre. « Prévoyance funéraire » 110 (§9) reste le seul angle marbrier légitime (choisir son monument de son vivant).
- **Démarches/coûts d'obsèques** (« démarches après décès » 10, « prix enterrement » 10, « combien coûte un enterrement » n.m. en CH) : gros en France, micro en Suisse — une FAQ suffit.
- **Suggestions « enterrement »** : 880/mois sur le mot seul mais l'essentiel du reste est du bruit (films, enterrements de vie de garçon, actualité people) — rien à viser.
- Micro confirmés : columbarium prix 10, caveau familial 20, entretien tombe 10, faire son deuil 20.

**Conclusion §10** : en français, il n'y a **pas de nouveau cluster commercial** à fort volume caché — la carte est complète (prix/catalogue + local + cinéraire + hub deuil). Le seul très gros gisement restant est l'écosystème **avis de décès**, capturable partiellement via le hub (niveaux 1–2) et totalement seulement via un modèle « portail d'avis » adossé aux pompes funèbres (niveau 3, décision business).

---

## 11. Deep-dive cinéraire (ajout 17.08 — les associés confirment pouvoir produire la gamme)

Mesure complète de l'univers (suggestions « cinéraire » + « urne funéraire » + 10 requêtes produits, Ads CH) :

- **Volume total cinéraire fr ≈ 1'000/mois** : cluster urne funéraire ~250 (170 + suisse 30 + prix 40), columbarium 320 (info), jardin du souvenir 140, plaques ~200, cavurne 20–30 ; toute la longue traîne produit (urne cinéraire, urne en granit/pierre, plaque columbarium, niche, biodégradable) plafonne à 10–20 chacun. Pas de trésor caché : le poids est dans les têtes déjà cartographiées. + côté DE : urnengrab 90, urnengrabstein 30.
- **Lexique décisif pour le build** : « cinéraire » est un mot de métier — 30/mois, dont une partie pour… la plante *cinéraire maritime*. Les familles tapent « urne », « columbarium », « plaque », « monument pour urne ». → Titres et H1 des pages avec les mots des familles ; « cinéraire » en corps de texte seulement. (À répercuter dans le Production JSON au build.)
- **Ce que la capacité de production change** : pas le SEO (volumes produits faibles) mais le **modèle** — urnes en pierre, plaques gravées, vases et médaillons se produisent ET s'expédient sans pose → vente Suisse entière (puis alémanique), présence possible dans Google Shopping (le canal des leaders FR, cf. §8.1). Préparer les fiches produits (schema Product, prix affichés) dès le build ; boutique en ligne complète en phase 2.
- Rappels : « urne » seul (1'300/mois) reste ambigu (votations) — ne jamais cibler tel quel ; le cluster plaques garde son KD 61 (e-commerçants FR) — l'attaque passe par la longue traîne et Shopping, pas par le head.

---

## 12. Architecture de la partie « commande » (ajout 17.08 — question de Thomas : Shopify indispensable ?)

**Renseignement pris chez les leaders (WebFetch 17.08)** : France Tombale = prix affichés + personnalisation en ligne + « Obtenir un devis » + conseiller sous 48 h, **aucun panier/checkout** ; GPG Granit = configurateur 3D + devis gratuit, **pas de paiement en ligne** ; lespierrestombales.ch = « Prix sur devis » partout + téléphone, vente consultative (silver-plaque : 403, non vérifié). → Même les leaders ne font PAS de checkout e-commerce pour les monuments : le modèle du métier = **prix affichés + configuration + demande de commande/devis + rappel humain**. Exactement ce que décrit Thomas (« on ne livre pas, on passe commande comme des devis »).

**Recommandation v1 — pas de Shopify, pas de plateforme** :
1. Catalogue **Astro statique** avec prix « dès X, tout compris » (notre différenciation, même vs le leader CH qui cache tout).
2. **Mini-configurateur maison** (îlot JS léger, pas de librairie lourde) : modèle → granit → dimensions → texte de gravure → estimation live → « Passer commande ».
3. **Formulaire de commande → webhook n8n** (notre usine) : fiche Notion + email récap client + notification associés. Même pattern que W5 Prospect→Notion. Coût plateforme : 0 CHF/mois (vs Shopify ~350–430 CHF/an pour des fonctions panier/stock/livraison inutilisées ici).
4. Acompte : hors ligne au lancement (facture/virement/TWINT). Si besoin plus tard : **Payrexx** (suisse, TWINT natif) ou Stripe Payment Link dans l'email de confirmation — s'ajoute sans refonte.
5. **Google Shopping sans Shopify** : flux Merchant Center généré au build (XML) + schema.org Product sur les fiches.
6. **Phase 2 (urnes/plaques expédiables)** : si le volume le justifie, ajouter **Snipcart** (panier JS sur site statique, ~2 % ou ~20 $/mois) ou Shopify à ce moment-là — décision reportée à quand elle coûte réellement quelque chose.

Argument de fond : un achat de deuil à 3'000+ CHF ne se paie pas par carte sans contact humain — le formulaire + rappel EST l'étape de closing (France Tombale le prouve à grande échelle). Et le SEO-first du plan (§5, §8) exige la maîtrise totale des pages, ce qu'Astro donne et qu'un thème Shopify contraint.

---

## 13. Conception du configurateur de personnalisation (ajout 17.08)

**Ce que font les leaders (vérifié)** : GPG = configurateur **3D**, 40 granits, textes (nom/dates/épitaphe), motifs pré-conçus ou sur-mesure depuis photo, accessoires (vase, jardinière, statuette) → « Demander un devis » + sauvegarde du projet. France Tombale = module 3D, parcours **5 étapes** : forme+granit → gravure+texte (avec **choix de police**) → **devis immédiat** → validation avec un conseiller → suivi fabrication/pose. Constat : la conversion tient au *parcours* (estimation immédiate + rappel humain), pas à la 3D.

**Conception v1 recommandée — aperçu 2D en direct, fait maison** (îlot JS dans Astro, zéro dépendance payante, ~300–600 lignes) :
1. **Parcours en 5 étapes copié des leaders** : modèle → granit → texte + police (+ motif) → aperçu + estimation immédiate → « Passer commande ».
2. **Granit** : nuancier photo des granits réellement disponibles (6–12 au départ). Rendu : monument détouré + texture granit appliquée par masque CSS/SVG → 1 texture par granit réutilisée sur tous les modèles (pas besoin de 8×8 photos).
3. **Texte** : SVG `<text>` superposé, saisie libre (nom, dates, épitaphe), **4–6 polices de gravure** mappées sur des webfonts embarquées (romain → Cormorant/EB Garamond ; bâton → Jost/Montserrat ; anglaise → Great Vibes ; lapidaire → Cinzel). ⚠️ Vérifier la couverture des caractères albanais (ë, ç…) — clientèle diaspora.
4. **Motifs** : bibliothèque SVG simple (croix, rose, colombe, paysage…) + option « motif depuis votre photo » (sur devis, comme GPG).
5. **Estimation immédiate** : grille JSON (prix de base par modèle + coefficient granit + forfait gravure N lettres incluses puis X CHF/lettre + options) → total « dès » affiché en direct. La grille découle du coût de production kosovar.
6. **Commande** : l'aperçu SVG est sérialisé (PNG) et joint au récap → webhook n8n → Notion + email famille + notification associés (§12).
7. **Garde-fou métier : le BAT (bon à tirer)** — l'aperçu est marqué « indicatif » ; double confirmation du texte et des dates à la commande (« vérifiez l'orthographe : c'est gravé dans la pierre ») ; maquette définitive validée par un humain avant gravure. Aucune gravure lancée sans BAT signé.

**3D : phase 3 au mieux.** Coût réel : un modèle 3D par monument + Three.js + textures — ~10× l'effort, lourd sur mobile, et n'améliore pas la conversion (le devis immédiat + rappel la font). Les leaders l'ont ajouté après des années d'exploitation.

**Inputs associés nécessaires pour construire** : nuancier photo des granits disponibles, liste des polices que l'atelier sait réellement graver, dimensions réelles par modèle, motifs gravables, règles de prix (base + coefficients + gravure). SaaS de customisation (Zakeke, Customily…) : écartés — payants, pensés e-commerce print, et notre besoin est couvert en interne.

---

## 14. Stack technique tranchée (ajout 17.08 — recherche parallèle 5 volets, tout vérifié aux sources)

| Brique | Choix | Vérifié |
|---|---|---|
| Base | **Astro 7** (7.2, Node ≥22.12) : i18n natif (fr, /de/ en ph. 2), content collections (monuments/guides/villes), @astrojs/sitemap, **@astrojs/preact** pour l'îlot configurateur, Tailwind v4 via @tailwindcss/vite, endpoint `merchant-feed.xml.ts` généré au build | docs.astro.build, 22.08 |
| Starter | **ScrewFast** (github.com/mearashadowfax/ScrewFast, MIT, ~1.4k★, commit 16.08.2026) : template business avec i18n câblé, JSON-LD, OG, sitemap ; branche `monolingual-site` pour démarrer FR seul. Réserve de composants : AstroWind (5.9k★, Astro 7 + TW4). ⚠️ élaguer Preline/GSAP/Lenis au fork | pages GitHub |
| Configurateur | **Konva.js vanilla** (10.3.1 du 15.08.2026, **54.6 KB gzip**, 0 dépendance, MIT) dans UN îlot `client:visible` : 3 layers (photo monument / granit / texte), inputs HTML, prix JS pur, `document.fonts.load()` AVANT rendu, export `toDataURL({pixelRatio:2})` ~1200–1600 px joint au POST. **Fabric écarté** (92 KB + rupture API v5→v7 = code LLM/tutos périmés) ; **SVG natif écarté pour l'export** (ressources à inliner en data URI, caprices Safari). Granit : photos pré-rendues modèle×granit de préférence au masque. Repos d'inspiration : lmanukyan/print-designer, YaroslavChuiko/Webster (Konva+fonts), salgum1114/react-design-editor | npm, Bundlephobia, docs Konva, GitHub API |
| Polices | 6 familles **OFL**, couverture ë Ë ç Ç (albanais) + ä ö ü ß **vérifiée dans la table cmap des woff2** (subset latin suffit, ~140 Ko total, via Fontsource npm) : **Cinzel** (capitale gravée Trajan), **Marcellus** (romain lapidaire), **EB Garamond** (romain classique), **Jost** (bâton), **Great Vibes** (anglaise), **Pinyon Script** (copperplate). ⚠️ ẞ majuscule allemand absent partout (convention SS) ; Cinzel = petites capitales (pas de vraies minuscules) | fontTools sur les woff2, métadonnées Google Fonts (sq_Latn) |
| Formulaires | POST fetch **multipart/form-data** direct → webhook n8n prod, « Allowed Origins (CORS) » = pierretombale.ch (OPTIONS natif vérifié dans le code source n8n master). Anti-spam 3 étages : honeypot (position:absolute, pas display:none) + time-trap <3 s + **Turnstile** (gratuit illimité confirmé 2026) validé côté n8n via siteverify. Photo + PNG dans le même FormData → `$binary` (limites n8n vérifiées : body 16 MiB, fichier 200 MiB — ⚠️ nginx devant n8n plafonne à 1 MiB par défaut, à régler). Fallback : AbortController 15 s + 2–3 retries backoff + `turnstile.reset()` (token à usage unique) + `order_client_id` UUID dédupliqué + UptimeRobot gratuit | code source n8n (webhook-request-handler.ts, endpoints.config.ts), docs Cloudflare |
| Hébergement | Domaine .ch chez **Infomaniak** (~12 CHF/an ; Cloudflare Registrar ne fait PAS le .ch — vérifié), zone DNS → Cloudflare (requis pour l'apex), site sur **Cloudflare Pages** (gratuit, bande passante illimitée, deploy Git natif, PoP Genève/Zurich). **Netlify écarté** (free tier 2026 = 300 crédits/mois, sites mis en pause au plafond). Option « hébergé en Suisse » au sens strict : Infomaniak web ~69 CHF/an + GitHub Actions rsync. Formulation honnête retenue : « domaine suisse, données du formulaire traitées en Suisse (n8n auto-hébergé), site servi depuis Genève/Zurich ». Note : Cloudflare oriente les projets neufs vers Workers static assets (parité, même gratuité) — à trancher au setup | limites Pages, pricing Netlify, liste TLD Cloudflare |

**Coût récurrent total de la stack : le domaine (~12 CHF/an). Tout le reste est gratuit (MIT/OFL) et maîtrisé en interne.** Fit Claude Code : Astro et Konva ont des API stables et un corpus d'exemples cohérent (pas de rupture de version type Fabric), un seul îlot interactif à maintenir, zéro service tiers à intégrer hors Turnstile.

---

## 15. Spec de build consolidée + pipeline de fabrication (ajout 17.08, post-GO)

Tout ce qui précède est consolidé en UN document maître prêt pour la session Claude Code du build :
**`w6/pierretombale.ch/SPEC-BUILD-SITE.md`** (autonome ; à copier dans le repo du site avec le
production-spec JSON). Ajouts propres à cette spec, issus d'un dernier renseignement vérifié :
- **Standards de lettrage** : gravure funéraire en lettres de **3 à 6 cm** (facturation à la lettre) → presets 30/40/50/60 mm dans le configurateur.
- **Pattern « proof » des designers US** (Monumize, Legacy Headstones) : aperçu photoréaliste + approbation signée avant gravure + vérification des règles du cimetière → confirme notre BAT (§13) et ajoute le **checkpoint cimetière** au flux de commande (croisement avec nos fiches cimetières : dimensions max autorisées).
- **Le maillon fabrication** (demande de Thomas) : à la commande, le navigateur génère 3 artefacts — `preview.png` (famille/BAT), **`fabrication.svg` à l'échelle 1:1 en mm avec le texte converti en tracés vectoriels via opentype.js** (MIT, ~5k★, `Font.getPath`→`Path.toSVG`) + calque de cotes, et `commande.json` (machine-readable). L'atelier kosovar reçoit un dossier neutre en langue, importable en découpe de pochoir/laser, zéro texte à retaper, zéro risque de faute. Flux n8n : webhook → Notion (statuts) → BAT famille → **stop humain** → email atelier.

