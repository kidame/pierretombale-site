# Backlog PierreTombale.ch

Un seul endroit pour savoir quoi faire ensuite. ETAT.md raconte ce qui a ete fait ; ici, ce qui
reste, dans l'ordre. Chaque ligne : [etat] sujet - qui - condition de depart.
Etats : [ ] a faire, [>] en cours, [x] fait, [!] bloque.

## Regle de priorite
1. Ce qui est debloque passe avant ce qui attend une reponse.
2. Un sprint = une passe livrable seule (build vert, apercu republie, ETAT a jour).
3. Les reponses de Thomas s'integrent quand elles arrivent, sans arreter le sprint en cours.

## Sprint en cours : configurateur, modele pilote Douceur
- [x] Passe A : donnees de calibration (src/data/calibrations/<modeleId>.json) + page
      /personnaliser/<slug>/ statique, sans canvas - Claude - fait le 22.10.2026
      (la page est en noindex, follow : trop mince en v1, canonique vers la fiche)
- [x] Passe B : ilot Konva, fond = image du modele dans la matiere choisie, 1 zone de texte
      deplacable dans la zone gravable, police, hauteur en cm, finition - agent kumo-run
- [x] Passe C1 : motifs (10 SVG, familles, pose, deplacement, taille cm, miroir, carte
      "Un motif a vous" avec description + fichier 8 Mo) - commits a8d156b a 0130cb4
- [x] Passe C2 : 3 zones de texte multilignes (police, hauteur, finition par zone)
- [ ] Passe D : prix indicatif en direct (tarifs.json) - agent - attend la grille de prix
- [x] Passe E : scene en cm + apercu JPEG vers /devis/, champs du contrat pre-remplis,
      `configurateur_scene` et `configurateur_apercu` - Claude - 26.10.2026 (l envoi attend E6)
- [x] Passe F : brouillon sur l appareil (90 j), reprise, "Tout effacer", avertissement si le
      navigateur refuse de garder - Claude - 23.10.2026
- [x] Etendre aux autres modeles : 22 modeles calibres (provisoire) au 26.10.2026, cotes du
      configurateur 3D du fournisseur (docs/references/2026-10-26-geometrie-fournisseur.md)
- [ ] Les 5 sans calibration (voir docs/images-configurateur/calibrations-en-attente/README.md) :
      Nivora (image a refaire), Dalle cineraire, Tombale simple, Almandin, 4 pieces sans stele
      (gravure sur la tombale : vue de dessus a produire, ou devis sans apercu) - Thomas decide
- [ ] Images a refaire : Nautis (notre "Bengal" montre un marbre blanc, texte invisible),
      Bahia (stele trop large : 42 cm sur l image, 30 cm en vrai), Esperanza (trop haute) - Thomas
- [ ] Graveur : valider les zones gravables des 22 modeles (planches de controle) - Thomas
- [x] Motifs ajoutes : poses sous le texte, libres dans le cadre jaune - Claude - 23.10.2026

- [x] Inscription guidee : formulaire, mise en page auto, tailles du metier - Claude - 23.10.2026
- [x] Tests automatiques (vitest, `npm test`) : composition, echelle, bornes des motifs - Claude
- [x] index.ts decoupe (956 -> 530 lignes) : panneau-motifs.ts, reprise.ts - Claude
- [x] Zones du mode libre sorties de index.ts (panneau-zones.ts ; index.ts : 347 lignes) - Claude

## En attente de Thomas (n'arrete rien)
- [ ] Graveur : hauteur sur la majuscule ? plus petite lettre ? signe de deces (croix) ? - Thomas
- [>] Motifs SVG : 10 sur 14 vectorises depuis les images ChatGPT (public/motifs, src/data/motifs.json) ;
      restent sapin, coeur, papillon, infini (images a produire, puis scripts/vectoriser-motif.py)
- [!] Noms publics des 27 modeles (une ligne `name:` par fiche a changer)
- [!] Nature des matieres : Marmara granit ou marbre -> vocabulaire "granits" ou "matieres"
- [ ] Dimensions reelles par modele (`dimensions:` par fiche) : les cotes de toutes les pieces sont
      dans docs/references/geometrie-fournisseur.json, a reporter dans les fiches - Claude
- [!] Relecture des 27 descriptions par un associe avant mise en ligne
- [!] Test de /devis/ avec un proche age sur telephone

## Ensuite
- [x] E6 : envoi du devis EN PRODUCTION et teste par Thomas le 27.10.2026 (fiche sur info@, accuse a la
      famille). Variables posees en Production seulement : la previsualisation n envoie pas.
- [ ] E6 suite : Turnstile (cles a creer par Thomas, puis PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET),
      limite par IP (429) - Claude + Thomas
- [>] E7 : EN PRODUCTION le 26.10.2026 sur https://www.pierretombale.ch (Cloudflare Pages,
      branche live) - Codex + Thomas
      [x] .node-version 22, _headers, guide docs/MISE-EN-LIGNE.md, premiers push main + live.
      [x] Projet Pages sur live, variables Prod/Preview, deploiement pages.dev.
      [x] DNS : zone Cloudflare, NS basculees, DNSSEC retire avant bascule, www + domaine nu,
          301 vers https://www (chemin et parametres conserves), HTTPS.
      [x] Previsualisations privees : Cloudflare Access (hello.puglisi@gmail.com).
      [x] Search Console : domaine valide, 2 sitemaps soumis ; garder le TXT de verification.
      [x] Controles HTTP depuis le VPS (26.10, 20 h) : 200, pas de noindex sur le domaine, 404,
          sitemaps, polices et chunk Konva, cache images, Access sur main.pages.dev.
      [ ] Recette restante : controles visuels des pages en production, configurateur au
          navigateur (canvas, polices, brouillon, export devis), Lighthouse mobile, SEO final
          (indexation Google a confirmer dans Search Console).
      [ ] Nettoyage tmp/apercu et apercu-extras uniquement apres accord de Thomas.
      E7 n est coche qu apres la recette. E6 (envoi du devis) fait le 27.10.2026.
- [ ] SEO : pages gammes, FAQ enrichie, maillage, image sitemap
      [ ] Guides FAQ (analyses/2026-10-28-faq-seo-recherches.md), ordre : cineraire
          (columbarium/cavurne/jardin du souvenir), epitaphe, FAQ prix, delais et demarches,
          entretien + pages cimetieres NE (Beauregard...) : option audacieuse CHOISIE par Thomas
      [x] Etape 1 : releve des reglements -> docs/REGLEMENTS-CIMETIERES-NE.md - Claude - 28.10.2026
      [ ] PRIORITE : catalogue 100 x 200 incompatible avec Beauregard, Le Locle, Boudry, VdT
          (docs/REGLEMENTS-CIMETIERES-NE.md section 0) - decision Thomas + associes
      [ ] Demarches : marbrier reference Beauregard (plaques de niches), entreprise designee
          VdT (plaques jardin du souvenir et niches), format dalle "pas japonais" - Thomas
      [ ] Etape 2 : lot 1 guides par Codex (docs/BRIEF-GUIDES-LOT1.md) - lance le 28.10.2026
      [ ] Etape 3 : lot 2 pages cimetieres + page dimensions (docs/DIMENSIONS-MONUMENTS.md)
      [ ] Manques : gabarits Beauregard (Office des cimetieres), tarifs communaux, loi cantonale a jour
- [x] Configurateur au design des maquettes (4 etapes, ecran partage, mobile) - Claude - 28.10.2026,
      sur main (previsualisation), pas encore sur live
- [ ] Configurateur : gravure en V a l apercu + finitions pour pierres claires (peinture noire, gravure sans peinture) - attend la confirmation de l atelier (Thomas)
- [x] Fiche produit au design des maquettes (passe 1, image unique) - Claude - 27.10.2026
- [ ] Fiche produit : 2 images de plus par modele (autre angle, gros plan) si Thomas les produit, puis vignettes - Thomas
- [ ] Accueil : remplacer les 5 rendus IA (public/images/accueil/) par de vraies photos des realisations (hero sombre, gros plan matiere, gros plan gravure) - Thomas
- [x] Images : audit du 26.10.2026 - Claude. Deja en place : noms de fichiers parlants
      (<modele>-<matiere>-<largeur>.webp), srcset 320/640/1200, width/height, lazy sauf premier
      ecran, alt genere sur les fiches et le catalogue, og:image par fiche. Ajoute : sitemap des
      images (/sitemap-images.xml, 280 images, annonce dans robots.txt), alt du modele mis en
      avant sur l accueil, scripts/poids-images.py. Alt vides volontaires : cartes de /devis/
      (le nom est dans l etiquette) et visuels provisoires des pages accueil / a-propos.
- [ ] Images : poids des 1200 px (131 au-dela de 200 Ko ; qualite 68 = -22 % sans perte visible,
      AVIF = -40 % mais encodage lourd) - a faire d un coup, quand les images seront definitives,
      pour ne pas gonfler l historique git deux fois - Claude
- [ ] Images : remplacer les visuels provisoires (accueil, a-propos) par de vraies photos avec alt
- [>] Design : direction des maquettes sur le site entier (reference : docs/DESIGN.md)
      [x] jetons, typographie, boutons, en-tete, pied, accueil - Claude - 26.10.2026
      [ ] legendes mono restantes -> `label` dans fiches, catalogue, prix, granits, FAQ, a-propos - Claude
      [ ] gabarits de ces pages selon les maquettes (a fournir : fiche, catalogue, prix, granits) - Thomas
      [ ] vraies photos pour l accueil (hero sombre, gros plan matiere, gros plan gravure) - Thomas
      [ ] page /personnaliser/ (index des 22 modeles) + entree Personnalisation du menu - Thomas decide

## Comment changer une chose courante
- Renommer un modele : `name:` dans src/content/products/<slug>.md. Le slug (URL) ne change pas.
- Changer l'URL d'un modele : renommer le fichier .md ET la cle dans src/data/tarifs.json.
- Ajouter/retirer une matiere : src/data/granits.json (+ photo dans
  docs/images-configurateur/matieres, puis `python3 scripts/images-modeles.py`).
- Nouvelle image d'un modele : deposer le PNG dans docs/images-configurateur/pilotes/.../v1/,
  lancer `python3 scripts/images-modeles.py`, rebuild.
- Prix d'un modele : src/data/tarifs.json.
- Polices, hauteurs, finitions, motifs : src/data/personnalisation.ts.
- Configurateur (calibration d'un modele, mise en page automatique, tailles, phrases proposees,
  nouvelle police, brouillon) : recettes de docs/CONFIGURATEUR.md, section 4.
- Poids des images et premier ecran : `python3 scripts/poids-images.py` (apres un build).
- Verifier le configurateur sur tous les modeles : scripts/verifie-configurateur.sh (section 5 du
  guide). Mesurer une police : scripts/mesure-polices.py.

<!-- E7 26.10.2026 : releve DNS avant migration dans docs/DNS-AVANT-MIGRATION.md ; import et comparaison Cloudflare restent a faire. -->

<!-- E7 : import DNS compare, DKIM ajoute selon Thomas. DNSSEC desactive dans Manager mais DS encore visible sur 1.1.1.1 et 8.8.8.8 ; bascule NS en attente. -->
