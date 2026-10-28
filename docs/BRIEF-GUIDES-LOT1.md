# Brief Codex : guides SEO, lot 1 (28.10.2026)

## But
Créer 4 pages "guides" qui répondent aux recherches réelles des familles en Suisse romande
et dans le canton de Neuchâtel (analyses/2026-10-28-faq-seo-recherches.md), avec des
informations officielles vérifiées. Personne ne publie ces infos en CHF et selon les
règlements suisses : c'est l'avantage du site.

## Sources AUTORISÉES (et seulement elles)
- docs/REGLEMENTS-CIMETIERES-NE.md (règles, articles, tarifs communaux, URLs officielles)
- docs/DIMENSIONS-MONUMENTS.md (dimensions par cimetière)
Toute affirmation réglementaire = commune + article + lien vers la source officielle.
Ce qui n'est pas dans ces fichiers n'est pas écrit. Pas de statistique non sourcée.
Mention visible sur chaque page : "Informations vérifiées le 28 octobre 2026 dans les
règlements communaux. Elles peuvent changer : nous vérifions toujours le règlement du
cimetière concerné avant la pose."

## Pages à créer (Astro, src/pages/guides/)
1. /guides/ : page d'index des guides (liste des 3 guides ci-dessous, courte intro).
2. /guides/quand-poser-une-pierre-tombale/
   H1 : "Quand poser une pierre tombale dans le canton de Neuchâtel ?"
   Mots-clés : quand poser une pierre tombale, délai pose pierre tombale, pierre tombale
   Neuchâtel. Contenu : le principe (règle par commune, minimum cantonal de réouverture
   30 ans), tableau par commune (délai, période interdite, réouverture), puis une section
   par commune (Neuchâtel ville et ses 4 cimetières, La Chaux-de-Fonds, Le Locle, Boudry,
   Val-de-Travers) avec démarches (permis de pose, plan 1:10, taxe de pose). FAQ de 4-6
   questions (ex. "Pourquoi attendre avant de poser un monument ?" : tassement de la terre,
   la Ville de Neuchâtel le dit sur sa page Beauregard).
3. /guides/columbarium-cavurne-jardin-du-souvenir/
   H1 : "Columbarium, cavurne, jardin du souvenir : que faire des cendres à Neuchâtel ?"
   Mots-clés : columbarium, jardin du souvenir, tombe cinéraire, cavurne, columbarium
   définition, garder une urne chez soi. Contenu : définitions simples (columbarium = niche
   dans un mur, cavurne/tombe cinéraire = petit caveau ou tombe pour urnes, jardin ou tombe
   du souvenir = dépôt anonyme), ce qui existe dans chaque commune relevée (durées, nombre
   d'urnes, prix officiels de la Ville de Neuchâtel et du Locle avec la date de l'arrêté),
   urne remise à la famille (possible), urnes biodégradables, nouvelles formes à Neuchâtel
   (semi-anonyme "4 saisons", projet de dalles "pas japonais" 2027-2028, tombes doubles).
   FAQ 5-6 questions. Liens vers /monuments-cineraires-cavurnes/.
4. /guides/epitaphe/
   H1 : "Épitaphe : idées de textes courts pour une pierre tombale"
   Mots-clés : épitaphe, épitaphe courte, phrase pierre tombale, texte pierre tombale.
   Contenu : ce qu'est une épitaphe, ce qu'on grave en général (nom, dates, phrase), conseils
   de longueur et de lisibilité (rester court, la place sur une stèle est limitée : à
   Beauregard une stèle adulte fait au plus 70 cm de large), 30 exemples ORIGINAUX classés
   (sobres, croyants, nature, pour un parent, pour un enfant, humour tendre). INTERDIT :
   citer des auteurs, chansons, poèmes protégés. Rappel : des communes demandent le n° du
   jalon ou le nom du marbrier sur le monument (Le Locle, La Chaux-de-Fonds, Val-de-Travers).
   Lien vers le configurateur (/personnaliser/...) et /devis/.

## Contraintes du projet (lire AGENTS.md et src/pages/faq.astro avant)
- Réutiliser BaseLayout, les composants et le style existants ; copier le schéma de
  faq.astro pour la FAQ (même texte affiché et JSON-LD FAQPage) et breadcrumbSchema.
- Title et meta description uniques par page (pageTitle de src/config/site).
- Français avec accents, ponctuation ASCII : pas de tiret long, pas de guillemets courbes.
- Titres avec les mots des familles (urne, columbarium, plaque).
- AUCUN prix de PierreTombale.ch (tarifs.json reste la seule source, souvent null).
  Les tarifs COMMUNAUX officiels sont permis, avec commune, date de l'arrêté et lien.
- Ne jamais mentionner où les monuments sont fabriqués.
- Ne pas affirmer que nos modèles respectent les gabarits : écrire que nous adaptons le
  monument au règlement du cimetière et vérifions avant la pose.
- Liens internes : chaque guide lie les 2 autres, /faq/, /devis/, et la famille de
  monuments utile. Ajouter un lien "Guides" dans SiteFooter (pas dans le menu principal).
- Pages rapides : pas de nouvelle image lourde, pas de JS.

## Vérification et commits
- npm run build sans erreur, npm test vert (ajouter un test simple si un utilitaire est créé).
- Un commit par page, message en français ASCII. NE PAS pousser (Claude pousse après relecture).
- Mettre à jour ETAT.md ("Dernière session" + "Prochaine étape") et cocher docs/BACKLOG.md.
