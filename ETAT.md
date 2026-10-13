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
- [ ] E1. Importer Atelier Ko (copie unique, MIT, commit 348433f du 17.08.2026), retirer panier et paiement, bouton "Demander un devis".
- [ ] E2. Adapter le schema produit : granit, type de monument, style, tradition. 3 modeles fictifs.
- [ ] E3. `src/config/entreprise.ts` et `src/data/tarifs.json` a null, affichage "prix sur demande".
- [ ] E4. Pages : accueil, catalogue, fiche, Nos granits, contact/devis (formulaire sans envoi reel).
- [ ] E5. Configurateur Konva (ilot Preact) en prototype.
- [ ] E6. Envoi du devis vers webhook n8n + Turnstile (aucun secret dans le repo).
- [ ] E7. Deploiement Cloudflare Pages (acces a definir avant toute publication).

## Derniere session
- 13.10.2026, Claude (2e session) : tentative d E1, BLOQUEE des le point 1 (import).
  Le dossier source `/home/kumo/atelier/tmp/atelier-ko` est inaccessible depuis cette session :
  tous les acces (bash `ls`/`find`, outil de lecture, connecteur Vps-proxy) sont refuses avec
  "Claude Code may only list files in the allowed working directories for this session:
  /home/kumo/atelier/repos/pierretombale-site". La session n est pas interactive, donc aucune
  autorisation ne peut etre accordee en cours de route.
  Aucun fichier du theme n a donc ete copie. Rien d autre n a ete modifie : pas de retrait de
  panier, pas de page devis, pas de `npm ci` ni de build (il n y a pas de `package.json`).
  Etat du depot inchange a part ce fichier : AGENTS.md, CLAUDE.md, ETAT.md, analyses/, docs/.
  Il n y a pas encore de `.gitignore` a la racine : a creer lors de l import reussi
  (au minimum `node_modules/`, `dist/`, `.astro/`).
- 13.10.2026, Claude (1re session) : creation du relais (AGENTS.md commun, CLAUDE.md pointe dessus,
  ce fichier).
  Inspection d Atelier Ko : panier = `src/components/CartDrawer.astro`, `src/pages/cart.astro`,
  bloc localStorage "atelier-ko-cart" et tiroir dans `src/layouts/BaseLayout.astro`, references dans
  `SiteHeader.astro`, `src/pages/products/[slug].astro`, `src/config/site.ts`, `src/styles.css`.

## Prochaine etape
E1, a reprendre du debut. Prerequis a regler par Thomas avant de relancer un agent :
donner a la session l acces en lecture a `/home/kumo/atelier/tmp/atelier-ko`, par exemple en
lancant Claude Code depuis `/home/kumo/atelier` (les deux chemins sont alors dans le perimetre),
ou en ajoutant ce dossier aux repertoires autorises de la session.

Rappels pour E1 quand l acces sera ouvert :
- Copier le contenu d Atelier Ko a la racine SANS `.git`, `.github`, `preview.webp`, `node_modules`.
- Ne pas ecraser nos fichiers : `AGENTS.md`, `CLAUDE.md`, `ETAT.md`, `docs/`, `analyses/`.
  Leurs `AGENTS.md`, `README.md`, `CUSTOMIZATION.md`, `CHANGELOG.md` vont dans `docs/atelier-ko/`.
  Leur `LICENSE` va a la racine sous le nom `LICENSE-atelier-ko` (obligation MIT).
- Retirer le panier (fichiers et references listes dans la 1re session), verifier par
  `grep -riE "cart|checkout|AtelierCart" src`.
- Fiche produit : bouton d achat remplace par un lien "Demander un devis" vers `/devis?modele=<slug>`,
  et page `src/pages/devis.astro` minimale (titre, "Formulaire en preparation", noindex).
- Ne rien traduire ni adapter d autre (c est E2 a E4).
- Verifier `npm ci` puis `npm run build`, noter le resultat de `npx astro check` s il existe.
- `node_modules/` et `dist/` ne doivent pas etre commites.
