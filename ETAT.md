# ETAT.md : relais entre sessions

Ce fichier permet de reprendre le travail avec Claude ou avec ChatGPT/Codex, sans perte.
Regle : chaque session le lit en premier et le met a jour en dernier, puis commit local.
`docs/DECISIONS-ET-ETAT.md` garde les decisions business ; ce fichier garde l avancement du build.

## Protocole de relais
Le travail se fait dans la copie locale du VPS : /home/kumo/atelier/repos/pierretombale-site.
GitHub n intervient pas dans le developpement ni dans le relais (push seulement comme sauvegarde, sur demande de Thomas).
Acces : Claude et ChatGPT passent chacun par leur connecteur VPS, prefixe kumo, meme dossier.
1. Debut : lire `AGENTS.md`, ce fichier, puis `git log --oneline -10` et `git status`.
2. Travail : un commit local par etape, message en francais, ASCII.
3. Fin : remplir "Derniere session" et "Prochaine etape", commit local.
4. Ne jamais laisser de travail non commite : l agent suivant ne saurait pas d ou il vient.

## Plan de build (option securisee, decidee le 13.10.2026)
- [x] E1. Importer Atelier Ko (copie unique, MIT, commit 348433f du 17.08.2026), retirer panier et paiement, bouton "Demander un devis".
- [ ] E2. Adapter le schema produit : granit, type de monument, style, tradition. 3 modeles fictifs.
- [ ] E3. `src/config/entreprise.ts` et `src/data/tarifs.json` a null, affichage "prix sur demande".
- [ ] E4. Pages : accueil, catalogue, fiche, Nos granits, contact/devis (formulaire sans envoi reel).
- [ ] E5. Configurateur Konva (ilot Preact) en prototype.
- [ ] E6. Envoi du devis vers webhook n8n + Turnstile (aucun secret dans le repo).
- [ ] E7. Deploiement Cloudflare Pages (acces a definir avant toute publication).

## Derniere session
- 13.10.2026, Claude chat : inventaire des 27 captures produits de l associe (toutes de
  granitsmaffre.com) dans `docs/references/2026-10-13-captures-maffre-produits.md`. Images
  hors depot. Ne jamais publier les images ni les noms Maffre. 4 questions ouvertes aux associes.
- 13.10.2026, E1 TERMINEE. L import d Atelier Ko (MIT, commit 348433f) a ete fait par Claude chat
  via le connecteur VPS, l agent Claude Code n ayant pas acces a `/home/kumo/atelier/tmp/atelier-ko`.
  Panier retire entierement (CartDrawer, page cart, bloc localStorage, references) : `grep -riE
  "cart|checkout|AtelierCart" src public` ne renvoie plus rien. Fiche produit : bouton d achat
  remplace par un lien vers `/devis?modele=<slug>`, page `src/pages/devis.astro` provisoire (noindex).
  Verifie le 13.10.2026 : `npm ci` 316 paquets (9 vulnerabilites signalees, non traitees),
  `npm run build` OK, 11 pages generees (accueil, about, catalog, devis, 6 fiches produit, 404,
  robots.txt, sitemap), aucun avertissement ; `npx astro check` : 16 fichiers, 0 erreur, 0 avertissement, 0 hint.
  Permissions de l agent fixees dans `.claude/settings.json` (git local, npm, lecture autorises ;
  push, pull, fetch, changement de branche, reset interdits) et confiance du dossier accordee.
- 13.10.2026, Claude (1re session) : creation du relais (AGENTS.md commun, CLAUDE.md pointe dessus,
  ce fichier).
  Inspection d Atelier Ko : panier = `src/components/CartDrawer.astro`, `src/pages/cart.astro`,
  bloc localStorage "atelier-ko-cart" et tiroir dans `src/layouts/BaseLayout.astro`, references dans
  `SiteHeader.astro`, `src/pages/products/[slug].astro`, `src/config/site.ts`, `src/styles.css`.

## Prochaine etape
E2, mais attendre d abord la reponse des associes aux 4 questions de
`docs/references/2026-10-13-captures-maffre-produits.md` (gamme reelle, formes sculptees,
granits, piste revendeur Maffre). Decider aussi les adresses (slugs) avant de creer les fiches :
le production-spec prevoit /monuments-funeraires/ et /monuments-cineraires-cavurnes/, Atelier Ko
utilise /catalog et /products/<slug>.
Rappels E2 : schema produit = famille (monument 100x200, cineraire 60x60), gamme (classique,
affinite, prestige, musulmane, noms a nous), style, lignes, stele oui/non, bicolore, motif, granit.
Prix : rien en dur, tout via `src/data/tarifs.json` en E3.
