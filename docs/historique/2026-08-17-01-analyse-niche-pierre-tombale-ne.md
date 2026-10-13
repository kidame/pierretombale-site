# Handover — Analyse SEO niche pierre tombale (Val-de-Travers / NE / CdF)

## Fait (2026-08-17, session web kumo-workflow, branche `claude/seo-analysis-tombstones-ch-z84xpy`)
- Analyse de niche complète (skill `analyse-niche`, DataForSEO direct : volumes Ads ×6 lots, suggestions Labs, 5 SERP live géolocalisées, KD ×22, intentions, bulk_ranks ×13 domaines, Zefix). Coût data ~0.5–1 CHF.
- Livrables : `analyses/2026-08-17-niche-pierre-tombale-ne.md` (rapport complet + plan SEO + usage W2/W6/W7) et `analyses/data/2026-08-17-mots-cles-pierre-tombale-ch.csv`.

## Décisions / conclusions clés
- **GO nuancé** : marché de panier (2'000–15'000 CHF), pas de volume. Cluster « prix pierre tombale suisse » (~200 rech./mois cumulées, intent commercial 0.93) = la cible reine, en phase avec le positionnement prix bas du projet.
- Fenêtre concurrentielle exceptionnelle : pack local VdT tenu par des Vaudois, Terziani (Couvet) sans site (= le sortant, non vérifié Zefix), KD 2 sur « pierre tombale », #1 CH = site récent à 28 dom. réf. (lespierrestombales.ch, le modèle à copier : pages ville).
- Mise en ligne idéale avant octobre (pic Toussaint) ; tendance marché -19 %/an (crémation) → prévoir offre cinéraire.

## Reste à faire
1. Valider le go business avec les associés (taille marché VdT réelle : décès/an, part crémation — OFS/communes ; statut exact de Terziani).
2. Si go : W6 WebBrief → build Astro (architecture dans le rapport §5) → GBP + avis → W1 puis W2 (inputs exacts documentés §6) → W7 mensuel.
3. n8n-edit non actif dans cette session (N8N_EDIT_TOKEN absent de l'env web) — aucun workflow modifié ; à régler si on veut lancer W2 depuis ici.

## Prochaine étape immédiate
Présenter le rapport aux associés ; décision go/no-go business ; si go, chiffrer la part KUMO (site + SEO + suivi) via skill `chiffrer-un-cas`.
