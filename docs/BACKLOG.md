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
- [>] Etendre aux autres modeles : 10 funeraires calibres (provisoire) le 23.10.2026 - Claude
      Restent : Eligie (largeur inconnue), Almandin, 4 pieces sans
      stele, Tombale simple (pas de stele : a decider), les 13 cineraires (largeurs inconnues)
- [ ] Graveur : valider les zones gravables des 9 modeles (planche de controle) - Thomas
- [x] Motifs ajoutes : poses sous le texte, libres dans le cadre jaune - Claude - 23.10.2026

- [x] Inscription guidee : formulaire, mise en page auto, tailles du metier - Claude - 23.10.2026
- [x] Tests automatiques (vitest, `npm test`) : composition, echelle, bornes des motifs - Claude
- [x] index.ts decoupe (956 -> 530 lignes) : panneau-motifs.ts, reprise.ts - Claude
- [ ] Sortir les zones du mode libre de index.ts (panneau-zones.ts) - agent

## En attente de Thomas (n'arrete rien)
- [ ] Graveur : hauteur sur la majuscule ? plus petite lettre ? signe de deces (croix) ? - Thomas
- [>] Motifs SVG : 10 sur 14 vectorises depuis les images ChatGPT (public/motifs, src/data/motifs.json) ;
      restent sapin, coeur, papillon, infini (images a produire, puis scripts/vectoriser-motif.py)
- [!] Noms publics des 27 modeles (une ligne `name:` par fiche a changer)
- [!] Nature des matieres : Marmara granit ou marbre -> vocabulaire "granits" ou "matieres"
- [!] Dimensions reelles par modele (`dimensions:` par fiche) et largeur de stele en cm
      (`largeurSteleCm` dans la calibration)
- [!] E6 envoi du devis : nom de domaine, compte Resend, adresse de destination
- [!] Relecture des 27 descriptions par un associe avant mise en ligne
- [!] Test de /devis/ avec un proche age sur telephone

## Ensuite
- [ ] E6 : fonction Cloudflare /api/devis + Resend (spec docs/devis-contrat.md)
- [ ] E7 : deploiement Cloudflare Pages, domaine, Search Console
- [ ] SEO : pages gammes, FAQ enrichie, maillage, image sitemap
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
- [ ] Design : appliquer la direction des maquettes au site entier

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
