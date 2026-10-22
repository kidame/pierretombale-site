# PierreTombale.ch : site de marbrerie funéraire (Suisse romande)

Projet commun à trois associés, bénéfices à parts égales. Le site est construit avec Claude Code. Le repo ne contient pas encore de code : tout est à construire.

## À lire avant toute chose
1. `docs/DECISIONS-ET-ETAT.md (journal) et docs/BACKLOG.md (ce qui reste, dans l ordre)` : décisions prises, ce qui manque, calendrier à jour. Il fait foi si la spec dit autre chose.
2. `docs/SPEC-BUILD-SITE.md` : le document maître (stack décidée, arborescence des pages, configurateur, pipeline commande vers atelier, ordre de build en 7 étapes, placeholders).

La spec commence par un avertissement : `docs/production-spec-pierretombalech.json` contient des valeurs provisoires (téléphone, NPA, siège, nom). Ne les recopie jamais dans le site.

## Règles du projet
- Stack figée : Astro 7, Tailwind 4, un seul îlot Preact avec Konva.js pour le configurateur, hébergement Cloudflare Pages. Pas de Shopify, pas de paiement en ligne en v1.
- Coordonnées de l'entreprise (nom, téléphone, adresse) : un seul fichier `src/config/entreprise.ts`, valeurs `null` tant que les associés ne les ont pas fournies.
- Prix : un seul fichier `src/data/tarifs.json`, `null` tant que le coût de production n'est pas connu. L'interface affiche alors « prix sur demande ».
- Vocabulaire : les titres de pages utilisent les mots des familles (urne, columbarium, plaque). « Cinéraire » reste dans le corps du texte. Ne jamais cibler « urne » seul.
- Rien ne part à l'atelier de gravure sans bon à tirer validé par la famille.
- Aucun secret dans le repo : clés Turnstile secrètes et tokens n8n vont dans les variables d'environnement Cloudflare.

## Où est le reste
- `analyses/` : l'analyse de marché complète (sections 1 à 15), ses données CSV et le dossier présenté aux associés.
- `docs/` : la spec, le brief, le rapport et le production-spec générés par l'outil W6 (copie du dossier `w6/pierretombale.ch/` de `kidame/kumo-workflow`), et `docs/historique/` pour les handovers de préparation.
- Le suivi de l'outil de génération (ticket T-034, leçon L-012) reste dans `kidame/kumo-workflow`.
