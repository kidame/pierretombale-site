# PierreTombale.ch : site de marbrerie funéraire (Suisse romande)

Projet commun à trois associés, bénéfices à parts égales. Le site est construit avec Claude Code. Le repo ne contient pas encore de code : tout est à construire.

## À lire avant toute chose
Lis `docs/SPEC-BUILD-SITE.md` en entier. C'est le document maître : stack décidée, arborescence des pages, configurateur, pipeline commande vers atelier, ordre de build en 7 étapes, placeholders.

Il commence par un avertissement : `docs/production-spec-pierretombalech.json` contient des valeurs provisoires (téléphone, NPA, siège, nom). Ne les recopie jamais dans le site.

`docs/` est une copie du dossier `w6/pierretombale.ch/` du repo `kidame/kumo-workflow` (état du 13.10.2026).

## Règles du projet
- Stack figée : Astro 7, Tailwind 4, un seul îlot Preact avec Konva.js pour le configurateur, hébergement Cloudflare Pages. Pas de Shopify, pas de paiement en ligne en v1.
- Coordonnées de l'entreprise (nom, téléphone, adresse) : un seul fichier `src/config/entreprise.ts`, valeurs `null` tant que les associés ne les ont pas fournies.
- Prix : un seul fichier `src/data/tarifs.json`, `null` tant que le coût de production n'est pas connu. L'interface affiche alors « prix sur demande ».
- Vocabulaire : les titres de pages utilisent les mots des familles (urne, columbarium, plaque). « Cinéraire » reste dans le corps du texte. Ne jamais cibler « urne » seul.
- Rien ne part à l'atelier de gravure sans bon à tirer validé par la famille.
- Aucun secret dans le repo : clés Turnstile secrètes et tokens n8n vont dans les variables d'environnement Cloudflare.

## Où est le reste
Les études complètes (marché, concurrence, mots-clés, sections 1 à 15) sont sur la branche main de `kidame/kumo-workflow` : `analyses/2026-08-17-niche-pierre-tombale-ne.md` et `analyses/data/`. Le suivi du projet est dans `.story/handovers/2026-08-17-02-complement-fr-ch-pierre-tombale.md` du même repo.
