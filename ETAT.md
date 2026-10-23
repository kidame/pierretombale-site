# ETAT.md : relais entre sessions

<!-- protocole-produit-10:debut -->
## Protocole de production actif

- Unite de travail : un produit complet de 10 variantes, en deux lots de 5.
- Generer les images une par une, avec une seule generation active.
- Apres chaque generation, conserver le fichier local et sa correspondance modele-matiere.
- Enchainer les generations du lot sans transfert ni mise a jour documentaire entre deux images.
- Apres chaque lot de 5, transferer le lot groupe puis verifier les fichiers transferes. Le compteur et le tableau automatique se mettent a jour a la reception des images du lot.
- Apres les 10 variantes verifiees du produit, mettre a jour ensemble les documents narratifs de production et de reprise.
- Commencer ensuite le produit suivant sans demander confirmation.
- A la reprise, reutiliser les variantes deja valides et completer uniquement les manquantes du produit en cours.
- Le compteur ne compte que les fichiers produits et verifies; ce changement de protocole ne modifie aucun compteur.

Action de reprise : Produire les variantes restantes du produit par lots de 5, puis archiver le lot

Cette section definit le protocole courant pour la suite de la production.
<!-- protocole-produit-10:fin -->

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

## Apercu en ligne (demande de Thomas, 13.10.2026)
- Lien : https://pt-apercu-k7q2.netlify.app (projet Netlify "pt-apercu-k7q2", compte Netlify de Thomas,
  site id 4b456177-ffd3-42a8-bd14-bcc87aff0cb7). Public pour qui a le lien, non indexe.
- Ce n est PAS la production (prevue sur Cloudflare Pages en E7). On y publie une COPIE de dist :
  /home/kumo/atelier/tmp/apercu, a laquelle on ajoute `_headers` (X-Robots-Tag: noindex, nofollow),
  un robots.txt "Disallow: /" et un netlify.toml (publish = ".", pas de build). Ces 3 fichiers ne
  doivent jamais entrer dans le depot : ils bloqueraient l indexation du vrai site.
- Republier : build a jour, recopier dist dans tmp/apercu (+ les 3 fichiers), puis l outil Netlify
  "deploy-site" (connecteur Netlify) donne une commande npx a usage unique a lancer dans tmp/apercu.
  Ne jamais ecrire cette commande (elle contient un jeton temporaire) dans un fichier du depot.

## Plan de build (option securisee, decidee le 13.10.2026)
- [x] E1. Importer Atelier Ko (copie unique, MIT, commit 348433f du 17.08.2026), retirer panier et paiement, bouton "Demander un devis".
- [x] E2. Adapter le schema produit : granit, type de monument, style, tradition. 3 modeles fictifs.
      (passe A : schema metier et 12 fiches ; passe B : adresses SEO par famille.)
- [x] E3. `src/config/entreprise.ts` et `src/data/tarifs.json` a null, affichage "prix sur demande".
- [x] E4. Pages : accueil, catalogue, fiche, Nos granits, contact/devis (formulaire sans envoi reel).
      (passe 1 : nettoyage du theme et SEO ; passe 2 : accueil et a-propos ; passe 3 : prix, granits,
      FAQ ; passe 4 : devis, merci, protection des donnees.)
- [x] E5. Personnalisation guidee dans le formulaire de devis (4 lignes d inscription, polices sur
      echantillons, hauteur des lettres, finition, motif, apercu en direct du texte) ; configurateur
      visuel reporte (voir `docs/CONFIGURATEUR-FUTUR.md`).
      PASSE 3 TERMINEE (etapes + choix visuel).
      (passe 1 : personnalisation guidee ; passe 2 : simplification pour les familles, police unique,
      pastilles de granit, sections conditionnelles, brouillon ; passe 3 : choix visuel du modele en
      cartes (A), parcours en 4 etapes avec recapitulatif (B), lisibilite et zones cliquables (C).)
- [ ] E6. Envoi du devis : fonction Cloudflare Pages + Resend (pas de n8n), adresse en variable
      d environnement, Turnstile. Aucun secret dans le repo. Suivre `docs/devis-contrat.md`.
- [ ] E7. Deploiement Cloudflare Pages (acces a definir avant toute publication).

## Derniere session
- 23.10.2026, agent claude (80 tours atteints) + Claude : CONFIGURATEUR PASSE C2, 3 ZONES DE TEXTE.
  Etat en zones (src/data/configurateur.ts : 3 zones, 120 caracteres, 4 lignes ; zones.ts),
  onglets Zone 1 a 3, ajout ("3 zones sur 3" a la limite), suppression, message 4 lignes au plus.
  rendu.ts termine a la main : un Konva.Text par zone (police, taille cm, finition propres),
  deplacable et borne, cadre bronze sur la zone active (si plusieurs zones), clic sur un texte =
  zone active, noeuds detruits avec leur zone. Les motifs prennent la finition de la zone 1.
  Verifie au navigateur (3 zones, polices differentes). Restent D (prix), E (export + envoi), F.
- 22.10.2026, agent claude (2 runs, 80 tours chacun) + Claude : CONFIGURATEUR PASSE C1, MOTIFS.
  src/data/motifs.ts valide motifs.json au build, motifs-svg.ts extrait viewBox et path des SVG
  (inline dans le JSON de la page, aucun fetch). Section 3 "Les motifs" (etapes renumerotees :
  1 Matiere, 2 Inscription, 3 Motifs, 4 Votre devis), cartes SVG par famille, Konva.Path par
  motif sous le calque texte, Transformer partage (taille min/max en cm), miroir, Suppr, max 6.
  "Un motif a vous" : cadre en pointilles "Motif a creer" sur la stele + description 300 car. +
  fichier 8 Mo, etat motifSurDemande, sceneEnCm() prete pour E. Corrections a la main : etat
  initial motifSurDemande, styles de la liste "Sur votre stele" en :global (lignes creees par le
  script), carte sur demande compacte. Verifie au navigateur (1280 et 390 px). Reste C2 (3 zones).
- 22.10.2026, agent claude (kumo-run, 80 tours atteints) + Claude : CONFIGURATEUR PASSES A ET B
  SUR DOUCEUR. Passe A (1c9de6e) : src/data/calibrations.ts valide les JSON de
  src/data/calibrations/, page /personnaliser/<slug>/ statique (noindex, canonical vers la fiche),
  lien "Personnaliser ce modele" sur la fiche des modeles calibres. Passe B : konva 10.9.0 en
  import dynamique, src/scripts/configurateur/{etat,echelle,polices,rendu,index}.ts ; fond = image
  1200 de la matiere, cadre sur vueStelePx ; un texte centre, deplacable dans la zone gravable,
  police/hauteur cm/finition en direct ; attente de document.fonts.load. Corrections a la main :
  types HTMLDivElement (astro check), apercu colle sur mobile (cfg-grille en bloc + colonne en
  display: contents, sinon le sticky n avait pas de parent assez haut). Verifie au navigateur :
  texte sur la stele, changement de matiere, mobile 390 px avec apercu colle. Poids
  /personnaliser/douceur/ : 6,9 Ko html gz, 2,8 Ko js propre gz + konva en chunk separe, 2,7 Ko
  css ; aucune autre page ne bouge. Reste : C (3 zones, motifs), D (prix), E (export, envoi),
  F (brouillon, avertissement), extension aux 26 modeles (un JSON de calibration chacun).
- 22.10.2026, Claude + agent claude (kumo-run, 80 tours atteints, fini a la main) : LE CATALOGUE REEL
  REMPLACE LE PROVISOIRE. 27 fiches dans src/content/products (champ `modeleId` = dossier image,
  noms publics a faire corriger par Thomas), 10 matieres dans src/data/granits.json (champ
  `description`), images web derivees par `scripts/images-modeles.py` (public/images/modeles,
  810 WebP en 1200/640/320, 71 Mo ; public/images/matieres 480/160) avec index
  src/data/images-modeles.json valide par le schema. Plus de pipeline astro:assets : ProductImage
  est un <img> avec srcset et alt genere ("Douceur, monument funeraire en Bengal, vue de face").
  Fiche : rangee de pastilles pour changer de matiere (script inline < 1 Ko, aria-pressed), JSON-LD
  Product avec image 1200. Accueil : featured -> 4-pieces-stele-doucine-avec-base, douceur,
  aquarius, 5-pieces-jardiniere-en-closoir, corazon. Build + astro check 0 erreur ; pages produit
  6 Ko html gz, 0 Ko JS, 2,4 Ko css. Verifie au navigateur de test : fiche douceur (changement
  de matiere OK), liste cineraires mobile. Les 270 PNG sources restent dans le depot (decision
  de Thomas). A trancher par Thomas : Marmara est-il un granit (sinon vocabulaire "matieres") ;
  dimensions reelles par modele ; noms publics. Commits 11be6b7, 74159b2, aa4015b.
- 22.10.2026, Claude : reception des 270 images pilotes (27 modeles x 10 matieres, 1254 px,
  705 Mo). Verdict : exploitables comme fonds, geometrie identique entre matieres (une calibration
  par modele). Manques : pas de vue stele, pas de calibration cm/px, 10 matieres sans
  correspondance avec granits.json (13), 27 modeles sans correspondance avec les 12 fiches, poids
  git. Detail : docs/images-configurateur/RECEPTION-CONFIGURATEUR-2026-10-22.md. Aucun code.
<!-- images-checkpoint -->
- Cloture images 2026-10-22T10:32:09.980077+00:00 : 270/270 PNG pilotes archives sur le VPS.
  27/27 modeles complets, 10 matieres chacun ; 14 funeraires et 13 cineraires.
  Derniers produits : ELIGIE, CORAZON et DOUCEUR, 10/10 chacun.
  Couverture, manifestes, fichiers et dimensions verifies ; aucun transfert partiel.
  Recepteur ferme, aucune generation active, automation de production desactivee.
  Originaux 1254 x 1254 ; calibration et resolution finale >=1600 restent a traiter.
  224 prompts exacts disponibles ; 46 appels historiques non retrouves.
  Details : docs/images-configurateur/CONTROLE-FINAL-270.json et REPRISE-SERIE.md.
<!-- /images-checkpoint -->
- 20.10.2026 13h05, Thomas : clarification prioritaire, produire les 270 images,
  lots de 5 automatiquement enchaines. Ne plus arreter une session a la fin d'un lot.
  Reprise a 61/270, tombale simple / rozabeta ; une image puis archivage immediat.
  Reprise automatique existante reactivee, verrou exclusif contre les doublons.
- 20.10.2026, Codex : lot de 5 termine et archive, total reel 61/270 (56 au depart).
  4-pieces-sans-stele termine 10/10 : Vizag Blue, Viscount White, Rosso Porrino,
  Egipat et Marmara ajoutes par imagegen integre, une generation puis un archivage a la fois.
  Chaque PNG controle (SHA256, CRC, IEND, decompression, dimensions) et inspecte visuellement.
  Registre, AVANCEMENT.md, manifeste, README et prompts exacts a jour ; limites pilote
  1254 px et calibration absente conservees. Six modeles complets, tombale simple 1/10,
  vingt autres non commences, 209 images restantes.
  Prochain lot de 5 : tombale-simple-200x100x10 / rozabeta, paradiso, jablanica, royal,
  vizag-blue depuis son Bengal. Recepteur ferme, aucune generation en cours.
  Automation deja en pause, consigne corrigee a maximum 5, reste en pause.
  Aucun build, changement runtime ou publication.
- 20.10.2026, Codex : reprise bornee demandee par Thomas, 5 nouvelles images maximum.
  Etat reel retrouve : 56/270, modele sans stele 5/10 ; quatre variantes precedentes
  et tableau AVANCEMENT.md presents mais non commites, conserves dans ce checkpoint.
  Registre, procedures et consigne d'automation limites a 5, generation sequentielle.
  Automation observee en pause ; aucun redemarrage. Lot manuel prevu : Vizag Blue,
  Viscount White, Rosso Porrino, Egipat, Marmara. Integrite des 5 PNG existants du
  modele verifiee. Les pilotes restent non calibres. Prochaine variante : vizag-blue.
- 20.10.2026, Codex : production reprise, jardiniere terminee 10/10. Six nouveaux PNG
  generes, inspectes et archives avec prompts exacts, SHA256 et controle PNG : total 52/270.
  Transfert reprenable stdin/stdout sans port, verrou exclusif et mise a jour par image :
  scripts/serie-images.py ; procedure docs/images-configurateur/PRODUCTION-AUTONOME.md.
  Prochaine combinaison : 4-pieces-sans-stele / rozabeta. Aucun build ni changement runtime.
  Automatisation de reprise activee, toutes les heures, maximum 10 images/35 min par passage.
  Premiere reprise prevue le 20.10.2026 a 11h01 Europe/Zurich ; premiere execution non encore verifiee.
  Configuration conservee dans docs/images-configurateur/automation-production.json.
- 20.10.2026, Codex : audit des images demande par Thomas. 46 PNG complets controles
  (CRC, IEND, decompression, SHA256), 1254 x 1254 ; cible documentaire 27 x 10 = 270.
  Suivi-serie.json et 7 manifestes synchronises ; README ajoutes aux 4 dossiers manquants,
  46 images inventoriees au lieu de 30. Prompts exacts des 4 derniers dossiers non retrouves.
  Royal jardiniere : .png.part 2700000 octets, hors total, source complete a retrouver ;
  prochaine action = recuperer/reprendre ce transfert, sinon regenerer, puis 5 autres matieres.
  Rapport : docs/images-configurateur/AUDIT-2026-10-20.md. 224 images completes manquent.
  Aucune nouvelle generation, validation configurateur, modification runtime ou publication.
- 19.10.2026, Codex : plan de reprise persistant cree dans
  docs/images-configurateur/REPRISE-SERIE.md et suivi-serie.json (270 combinaisons).
  Priorite : finir le transfert doucine, archiver trois masters, puis poursuivre la serie.
- 19.10.2026, Codex : ALMANDIN pilote termine, 10 variantes PNG dans
  docs/images-configurateur/pilotes/funeraire/almandin/v1/ avec manifeste et prompts.
  Total archive : 3 modeles / 30 variantes. Modele sans stele, zone gravable sur dalle
  a definir. Lots 1254 px non calibres, non publies ; controle SHA256 termine.
- 19.10.2026, Codex : ARQUES pilote termine, 10 variantes PNG dans
  docs/images-configurateur/pilotes/funeraire/arques/v1/ avec manifeste et prompts.
  CIN1 + ARQUES : 20 images archivees. Une vue par matiere ; 1254 px,
  perspective et calibration a finaliser avant integration configurateur.
- 19.10.2026, Codex : CIN1 pilote termine, 10 variantes PNG dans
  docs/images-configurateur/pilotes/cineraire/cin1/v1/ avec README et manifeste.
  Thomas demande une seule vue par variante pour le moment, produit + configurateur.
  Lot 1254 px a valider, non calibre ; seconde vue reportee. Suite : pilote funeraire.
- 19.10.2026, Codex : generation des 10 textures de matieres v1, PNG 1254 x 1254,
  classees dans docs/images-configurateur/matieres/2026-10-19/textures-v1/.
  README et manifest.json : correspondances, usage selecteur de matiere et images
  produit par variante, noms et limites de calibration. Integrite des transferts verifiee.
  Thomas confirme la cible de 10 materiaux par modele funeraire et cineraire.
  Suite : modele pilote puis declinaisons, avec cadrage fixe et calibration des vues.
  Aucun changement runtime ni publication ; 270 combinaisons candidates pour 27 references.
- 19.10.2026, Codex : classement de 10 photos originales de matieres dans
  `docs/images-configurateur/matieres/2026-10-19/originaux/`, noms d'apres les etiquettes.
  Correspondance fichiers recus / noms dans le README du lot ; integrite SHA-256 verifiee.
  Etiquettes ROSSO PORRINO et VIZAG BLUE usees : lecture a confirmer avant publication.
  Aucune retouche, generation, modification de granits.json, build ou publication.
  Suite images : confirmer les appellations, finitions et dimensions des echantillons,
  puis creer les textures sur demande. Prerequis du configurateur et E6 inchanges.
- 14.10.2026, Claude : lecture des 6 maquettes et redaction de
  `docs/maquettes/configurateur/2026-10-14/DIRECTION-DESIGN.md` : palette (ivoire,
  anthracite, accent bronze unique), typographie (titres serif, interface sans), structure
  ordinateur/mobile, composants (nuancier, motifs, zones de texte, recapitulatif, confirmation),
  puis 11 adaptations a nos decisions (4 etapes sans Options, aucun medaillon, SVG transparents,
  obligatoires selon devis-contrat.md, tailles 30-60 mm, contraste pour public age) et 4 points
  ouverts (ordre Motifs/Inscription, alignement par zone, multilignes, images monument+stele).
  Aucun code modifie. Commit 59a258e. Puis les 4 points tranches selon la pile (ordre Granit >
  Inscription > Motifs > Devis, alignement 3 boutons, 3 zones multilignes en cm, composition sur la vue
  monument pilotee par la calibration) : docs/DECISIONS-ET-ETAT.md, commit 4ea3f5b. Thomas a valide
  (1 audacieuse, 2 securisee = tout centre sans bouton, 3 audacieuse, 4 le plus realisable) et exige
  que tout reste facilement corrigible : principe de maintenabilite ajoute, commit a8bc6b2.
- 14.10.2026, Codex : archivage des 6 maquettes ordinateur/mobile dans
  `docs/maquettes/configurateur/2026-10-14/`, PNG originaux numerotes et README.
  Correction de Thomas : motifs de gravure SVG sans fond dans les apercus de
  selection, aucun medaillon. PNG historiques non retouches ; accessoires hors v1.
  Aucun code runtime, build, deploiement ou envoi. Suite : adapter les futures
  maquettes a ces regles, sans changer les prerequis E5/E6.
- 14.10.2026, Codex : preparation des images pour le futur configurateur, sans generation.
  Spec : `docs/images-configurateur/PREPARATION.md`, inventaire de 27 references
  (14 monuments, 13 cineraires), gabarit JSON de calibration a remplir. Masters orthographiques,
  deux vues par combinaison, exceptions sans stele/acier ajoure/bicolores et controle de recalage.
  Granits finaux, dimensions, zones et slugs publics NON confirmes : zero declinaison lancee.
  Les 27 images luxe existantes ne sont pas des fonds calibres. Aucun code runtime, prix,
  granit, build ou deploiement modifie. Suite images : recueillir les donnees, puis valider
  les masters pilotes avant la serie. Le test E5 et les prerequis E6 restent inchanges.
- 14.10.2026, Codex : analyse fonctionnelle du configurateur Rootia de France Tombale,
  demandee par Thomas avant reproduction. Document :
  `docs/ANALYSE-CONFIGURATEUR-ROOTIA-2026-10-14.md`. Parcours live : granit, motifs/medaillons,
  gravure, complements, devis. 3 zones de texte (120 caracteres chacune), motifs repetables
  au-dela de 3, 3 photos de concession maximum. Estimation de monument en direct observee :
  corrige le constat concurrentiel du 13.10 qui la reservait aux plaques. Aucun formulaire
  envoye au commercant, aucun code du site modifie. Les ecarts avec les 4 lignes et la police
  commune actuelles sont documentes ; aucun changement de contrat ni lancement de build.
  La prochaine etape du site reste celle ci-dessous, sauf nouvelle decision de Thomas.
- 14.10.2026, E5 PASSE 3 SOUS-PASSE C TERMINEE (Claude Code) : LISIBILITE, ZONES CLIQUABLES, FINITIONS.
  E5 EST FINIE. Tout l habillage est en CSS DE PAGE (`devis.astro` et `ChoixModele.astro`) :
  `src/styles.css` n est PAS touche, et AUCUNE classe Tailwind n a ete ajoutee ni retiree (la feuille
  Tailwind est unique et partagee par les 23 pages). Les classes `grav-*` nouvelles ne sont pas des
  utilitaires, donc elles ne generent rien. Les blocs `<style>` de page ne sont dans aucune couche CSS
  (`@layer`) : ils l emportent sur les composants et les utilitaires Tailwind SANS selecteur plus
  precis ni `!important`. C est par la que `.field`, `.field-label` et `.btn` sont redefinis pour
  cette page seule.
  LIBELLES : `.field-label` passe du mono gris majuscule de 10 px a 16 px, minuscules, var(--ink),
  graisse 500 (donc tous les `label for=` et toutes les `legend` d un coup) ; `.grav-sous-label`
  ("Texte", "Taille des lettres") de meme. Le mono majuscule ne reste QUE sur le `h2` d etape
  (`.etape-titre`, 15 px, var(--ink)), sur les titres de section (`.etape p.label`, 13 px) et dans la
  barre de progression. PIEGE : le `h2` porte `label` ET `etape-titre` ; le selecteur des titres de
  section est donc `.etape p.label`, sinon il reprendrait le `h2` (2 classes contre 1).
  AIDES : toutes a 15 px au moins (`.grav-aide`, `.grav-rappel`, `.grav-vide`, `.grav-erreur`).
  CONTRASTE verifie au calcul : var(--muted) #5a5a56 donne 6,3:1 sur le fond #f4f4f2 et le brun
  d erreur #8d3c33 6,4:1 - tous deux au-dela des 4,5:1 demandes. L `opacity: 0.45` des etapes sautees
  est RETIREE pour cette raison (elle cassait le contraste) : gris + texte barre a la place.
  ZONES CLIQUABLES (>= 48 px, bordure 1 px, coin de 3 px, coche = bordure 2 px var(--ink) + fond
  var(--surface) + le rond natif coche) : `.grav-carte` (type de demande), `.grav-onglet` (famille),
  `.grav-choix` (recontact, finition, granit "je ne sais pas", consentement), `.grav-polices label`
  (les 6 echantillons : nom 1.5rem dans la police, sous-titre 0.875rem). Focus clavier partout par
  `:has(input:focus-visible)` -> outline 2 px. Les ronds natifs passent de 16 a 20 px (`.grav-radio`).
  LES ONGLETS FAMILLE MONTRENT A NOUVEAU LEUR ROND NATIF (il etait masque en sous-passe A) et passent
  en UN PAVE PAR LIGNE sur telephone (grille 3 colonnes des 40rem) : trois paves serres sur 390 px ne
  se touchent pas. Les pastilles de granit gardent leur anneau (la couleur fait le travail), rond
  porte de 44 a 48 px.
  CHAMPS : `.field` devient une BOITE COMPLETE (bordure 1 px sur les 4 cotes, coin 3 px, 48 px de
  haut, texte 16 px, fond canvas) au lieu du seul trait bas du theme, focus = outline 2 px + bordure
  var(--ink) (le theme mettait `outline: none`). Le champ fichier a la meme boite (`.grav-fichier`).
  BOUTONS : Continuer / Retour / Envoyer / Ajouter une ligne a 52 px de haut, texte 16 px en
  minuscules (plus le petit mono majuscule du theme) ; pleine largeur sous 640 px. ORDRE SUR MOBILE :
  `.etape-nav` est en `column-reverse`, donc Continuer (dernier dans le HTML) s affiche AU-DESSUS de
  Retour ; en `row` des 40rem, l ordre du HTML revient.
  BARRE DE PROGRESSION : 14 px, pastille de 28 px, etape courante = pastille PLEINE (fond ink, texte
  canvas), etapes sautees grisees et barrees PLUS une mention "(non concernée)" hors de l oeil
  (classe `.sr`, attribut `hidden` pose par `majBarre`) : un texte barre ne s entend pas.
  BOGUE DU NO-JS CORRIGE : `[hidden]` ne gagnait pas contre un `display` d auteur, donc la barre
  (`.etapes`, flex), les navigations (`.etape-nav`, flex) et le bouton "Ajouter une ligne" (`.btn`,
  inline-flex) s affichaient SANS JavaScript, alors qu ils n ont alors aucun sens. Une regle
  `[hidden] { display: none }` dans le bloc de page (hors couche, donc gagnante) plus deux regles
  precises reglent les trois cas. A RETENIR pour toute nouvelle classe de ce bloc : si elle declare
  `display`, elle doit prevoir son `[hidden]`.
  DATE : `min` = aujourd hui, pose AU CHARGEMENT par `poseDateMinimale()` (pas au build : une page en
  cache proposerait la date de sa generation), en fuseau LOCAL champ par champ - `toISOString()`
  donnerait la veille en Suisse avant 1 h du matin.
  TELEPHONE : `inputmode="tel"` et l aide "Par exemple 079 123 45 67".
  RECAPITULATIF : chaque bloc est une LISTE DE DEFINITIONS (`dl` / `dt` / `dd`, intitule au-dessus,
  reponse en dessous : rien ne se tasse sur 390 px) au lieu de paragraphes ; "Modifier" est SOULIGNE
  en permanence (`.recap-modifier`, 44 px de haut) et non plus au survol seulement. L apercu de la
  gravure est bien le MEME noeud deplace dans le recap (verifie dans dist : un seul `[data-apercu]`,
  une place a l etape 3 et une a l etape 4).
  CHOIXMODELE : la carte "conseillez-moi" se distingue par un fond teinte (var(--surface), et
  var(--surface-strong) quand elle est cochee, sinon l etat coche ne se lirait que sur la bordure) et
  un POINT D INTERROGATION EN TEXTE dans un rond de 44 px - pas d image, pas de police d icones. Nom
  16 px graisse 600, prix 14 px, badge "Choisi" porte a 13 px, bordure cochee ramenee de 3 a 2 px.
  CONTRAT DES CHAMPS : AUCUN CHAMP NOUVEAU, confirme et note en tete de `docs/devis-contrat.md`
  (les 29 `name=` de dist sont exactement ceux du contrat ; les seuls ajouts sont des attributs,
  `inputmode` et `min`, et un `<span>` lu par les lecteurs d ecran).
  MESURES (gzip niveau 9, meme calcul que `scripts/poids-pages.py`, par integration temporaire dans
  `astro.config.mjs`, retiree depuis ; `python3 scripts/poids-pages.py dist` reste REFUSE a l agent,
  le motif `Bash(python3 scripts/:*)` coupe au milieu d un mot) : SEUL `/devis/` change. html 21060
  (20251 en sous-passe B), js en ligne 13146 (12474), css 9120 = 6834 partage + 2286 propre (1839).
  PREUVE QU AUCUNE AUTRE PAGE NE CHANGE : 404.html 3783 et css 6834 partout, a l octet comme en
  sous-passe B. Comme le nom du fichier CSS partage contient son empreinte, un 404.html inchange a
  l octet prouve que la feuille partagee est inchangee elle aussi.
  Verifie : `npm run build` 23 pages, `npx astro check` 34 fichiers 0 erreur ; dans dist les 4
  sections sont dans l ordre 1-2-3-4 et AUCUNE ne porte `hidden`, 7 attributs `required` (les 5 champs
  prevus), 3 radios famille, 14 radios modele, 8 `grav-choix`, 1 `inputmode="tel"`, 4 mentions
  "(non concernée)", aucun `min` en dur sur la date, sitemap 21 adresses,
  `grep -rliE "atelier|kosovo|sous-trait|fabriqu|n8n" dist` vide.
  PAS FAIT, ET ASSUME : le script en ligne (plus de 750 lignes, 13146 octets gz) n est pas extrait
  dans `src/scripts/devis.ts` (section 9 de la spec). C est le premier levier si `/devis/` doit
  maigrir : un `<script is:inline>` n est ni minifie ni depouille de ses commentaires.
  PAS FAIT : l essai dans un navigateur (aucun navigateur dans la session) ; c est Thomas qui verifie.
- 14.10.2026, E5 PASSE 3 SOUS-PASSE B TERMINEE (Claude Code) : PARCOURS EN 4 ETAPES ET RECAPITULATIF.
  `src/pages/devis.astro` : 4 `<section data-etape="N" aria-labelledby="etape-N-titre">` dans l ordre de
  la spec (1 Votre demande : typeDemande en 3 cartes radio avec une phrase, commune, cimetiere, date ;
  2 Le monument ; 3 L inscription ; 4 Vos coordonnees et envoi). Chaque section a un `h2` numerote
  (`tabindex="-1"`, classe `label etape-titre`). Script garde EN LIGNE (option 1 du mandat).
  SANS JS : les 4 sections sont visibles a la suite, aucune ne porte `hidden`, envoi natif, ni barre ni
  bouton Continuer/Retour (rendus avec `hidden`, montres par le JS). Toujours 7 attributs `required`
  dans dist, les 5 champs prevus (nom, email, localite, typeDemande, consentement).
  AVEC JS : classe `etapes-actives` sur le form, une seule section sans `hidden`. Barre `<ol class="etapes">`
  (4 items, `aria-current="step"`, etapes sautees marquees `data-sautee` et grisees/barrees). Continuer
  ne valide que l etape affichee (`valide(portee)` / `videErreurs(portee)` filtrent par
  `portee.contains(premierControle(nom))`), puis va a l etape suivante NON SAUTEE, focus sur son h2 et
  remontee en haut du FORMULAIRE (pas de la page : la barre doit rester visible). Etapes sautees : 2 et 3
  si `typeDemande` = autre, 2 si = inscription ; deduites de `blocsParTypeDemande` (meme table que les
  blocs replies), donc un changement de type a l etape 1 recalcule tout (`majEtapes` quitte meme une
  etape devenue sautee). Les fieldsets `data-bloc` restent desactives quand ils sont sautes : rien
  d inutile ne part. Entree dans un input texte : `preventDefault` puis Continuer (a l etape 4, Entree
  ne fait rien : le bouton d envoi est juste la). A l envoi, validation complete ; une erreur d une
  etape precedente y ramene avant de la montrer.
  RECAPITULATIF (etape 4, lecture seule, regenere a chaque affichage et a chaque `change` si on y est) :
  4 blocs (Votre demande / Le monument / L inscription / Fichiers) avec un bouton "Modifier" (classe
  `link`, `aria-label` complet) qui retourne a l etape et focalise son premier champ. Noms lisibles
  ajoutes a `reglages` (`labelsTypeDemande`, `labelsFamille`, `nomsParModele`, `nomsParGranit`,
  `nomsParFinition`) ; motif et taille des lettres lus dans le libelle de l option choisie, donc "5 cm"
  sans redire `hauteurLabel`. L APERCU EST UN SEUL NOEUD DEPLACE : `[data-apercu-place]` (etape 3) vers
  `[data-recap-apercu]` (etape 4) quand une ligne est remplie, et ramene au retour. Contrat des champs
  INCHANGE (aucun champ ajoute ni renomme).
  BROUILLON : garde aussi l etape sous la clef `__etape` (aucun champ ne porte ce nom) ;
  `restaureBrouillon` rend desormais l objet au lieu d un booleen. Au chargement on revient a cette
  etape, SAUF si l URL porte `?modele=` (venir d une fiche recommence au debut) ; une etape sautee ou
  inconnue ramene a la 1. "Effacer" remet a l etape 1.
  MESURES (gzip niveau 9, meme calcul que `scripts/poids-pages.py`, par integration temporaire dans
  `astro.config.mjs`, retiree depuis — le motif `Bash(python3 scripts/:*)` ne couvre toujours pas
  `python3 scripts/poids-pages.py`) : SEUL `/devis/` change. html 20251 (15939 en sous-passe A),
  js en ligne 12474 (8614), css 8673 = 6834 partage + 1839 propre (1526). Preuve : 404.html 3783 et
  css 6834 partout, a l octet comme en sous-passe A.
  A SAVOIR : les +3860 octets gz de script sont surtout des COMMENTAIRES (un `<script is:inline>` n est
  ni minifie ni depouille). Le script approche 700 lignes : l extraire dans `src/scripts/devis.ts`
  (section 9 de la spec) le ferait minifier ; c est le premier levier si `/devis/` doit maigrir.
  Verifie : `npm run build` 23 pages, `npx astro check` 34 fichiers 0 erreur ; dans dist les 4 sections
  sont dans l ordre 1-2-3-4 et aucune ne porte `hidden`, le texte "Rien n est engage..." est dans la
  MEME section que le bouton submit et juste apres lui, 3 radios `typeDemande`, 3 `famille`, 14 `modele`,
  sitemap 21 adresses, `grep -rliE "atelier|kosovo|sous-trait|fabriqu|n8n" dist` vide.
  PAS FAIT (sous-passe C) : styles des libelles et des radios, date min, inputmode du telephone, docs.
- 14.10.2026, E5 PASSE 3 SOUS-PASSE A TERMINEE (Claude Code) : CHOIX VISUEL DU MODELE.
  `src/components/ChoixModele.astro` : grille de cartes radio `name="modele"` (vignette
  ProductImage 480x600 lazy, nom, shortDescription, prixAffiche), 2 colonnes sur mobile et 3 au-dela,
  plus une carte "Je ne sais pas encore, conseillez-moi" (value vide) EN PREMIER par famille. Etat
  coche = bordure de 3 px + le mot "Choisi" (jamais la couleur seule) ; le radio est masque a l oeil
  (position absolue, 1 px, opacity 0) mais jamais `display:none`. Chaque carte porte `data-famille`.
  Les deux `<select>` famille et modele sont SUPPRIMES. `famille` devient 3 onglets radio larges
  (>= 44 px, `grav-onglet`) : "Monument funeraire", "Monument cineraire", "Je ne sais pas" (defaut,
  valeur vide). `majOngletFamille()` (JS) cache les cartes des autres familles et les sous-titres ;
  "Je ne sais pas" montre tout. Un modele coche devenu invisible revient sur la carte
  "conseillez-moi" visible. SANS JS : les 14 cartes sont la, groupees par famille sous un sous-titre.
  `?modele=<slug>` coche la carte ET pose l onglet de sa famille, meme si le brouillon disait autre
  chose (`form.elements.modele` est une RadioNodeList : lui affecter une valeur coche le bon bouton).
  Brouillon : garde-fou dans `restaureBrouillon` (les 2 cartes "conseillez-moi" partagent la valeur
  vide ; sans lui la derniere restait allumee). Contrat INCHANGE (`docs/devis-contrat.md` note juste
  que `modele` vide signifie "conseillez-moi", et que la demande ne dit pas laquelle des deux cartes).
  A SAVOIR : le CSS de /devis/ (styles `grav-*` + les 6 `@font-face`) PASSE EN FICHIER EXTERNE
  `dist/_astro/devis.*.css` (6843 octets bruts, 1526 gz) : en ajoutant ~2,5 Ko de CSS, la feuille
  depasse le seuil d inlining d Astro (4096 octets). Elle n est referencee que par /devis/.
  MESURES (gzip niveau 9, meme calcul que `scripts/poids-pages.py`, par integration temporaire dans
  `astro.config.mjs`, retiree depuis — le motif `Bash(python3 scripts/:*)` ne couvre toujours pas
  `python3 scripts/poids-pages.py`) : `/devis/` html 15939 (15348 en passe 2), js en ligne 8614
  (7908), css 8360 = 6834 partage + 1526 propre (6834). Aucune autre page ne change : css 6834
  partout et 404.html 3783, a l octet comme en passe 2.
  Verifie : `npm run build` 23 pages, `npx astro check` 34 fichiers 0 erreur ; dans dist 14 radios
  `modele` (12 slugs + 2 vides, une seule `checked`), 3 radios `famille`, plus aucun select
  famille/modele, 12 vignettes `loading="lazy"`, seules images referencees = les 2 SVG provisoires
  (703 et 713 octets, tres loin des 60 Ko), 7 attributs `required` (les 5 champs prevus),
  sitemap 21 adresses, `grep -rliE "atelier|kosovo|sous-trait|fabriqu|n8n" dist` vide.
- 14.10.2026, E5 PASSE 2 TERMINEE (Claude Code) : formulaire de devis SIMPLIFIE pour les familles
  (decisions de Thomas du 14.10.2026, `docs/DECISIONS-ET-ETAT.md` section "Formulaire de devis,
  peaufinage"). Toujours UNE page, complete et utilisable sans JavaScript.
  CHAMPS : `police` (UN seul style d ecriture pour tout le monument, 6 echantillons radio, chaque
  nom ecrit dans sa police, defaut cinzel) REMPLACE les 4 `ligne<n>_police` ; `recontact` (radio
  telephone / e-mail, defaut e-mail) ; `quandAppeler` (texte libre) ; `datePoseSouhaitee`
  (input date). Le telephone reste facultatif, SAUF si `recontact` = telephone : le JS le passe
  alors en requis, pose l etoile et deplie `quandAppeler`. 9 champs d inscription au lieu de 12.
  TAILLES DE LETTRES : libelle "Taille des lettres", affichage en centimetres ("3 cm" ... "6 cm",
  via `hauteurLabel`), valeurs envoyees INCHANGEES (30/40/50/60 mm), defauts 50/40/30/30.
  Lignes 3 et 4 repliees derriere un bouton "Ajouter une ligne" EN JS SEULEMENT (sans JS les 4
  lignes sont la, le bouton reste cache) ; une ligne repliee qui porte du texte se deplie a la
  restauration du brouillon.
  GRANIT : pastilles de couleur cliquables (vrais boutons radio habilles, masques a l oeil mais
  utilisables au clavier et sans JS ; anneau sur `:checked` et `:focus-visible`), groupees par
  teinte, couleurs de TEINTE_PASTILLE, plus "Je ne sais pas encore" par defaut. Champ `granit`
  inchange. Le select deroulant est supprime.
  SECTIONS CONDITIONNELLES (JS) : `typeDemande` sort de la section "Le monument" et vit dans une
  nouvelle section "Votre demande" (avec cimetiere, commune, date de pose), sinon il se cacherait
  lui-meme. `nouveau` = tout ; `inscription` = pas de section monument + rappel "Une photo du
  monument existant nous aide beaucoup" pres des fichiers ; `autre` = ni monument ni inscription.
  Les blocs replies sont AUSSI desactives (`fieldset.disabled`) : leurs valeurs par defaut ne
  partent pas. Aucun champ obligatoire dans un bloc repliable, donc jamais de `required` masque
  (verifie dans dist : les 7 `required` du HTML sont tous hors `data-bloc`). Sans JS, tout visible.
  BROUILLON : `localStorage` (cle `cleBrouillonDevis` = "pt-devis-brouillon"), champs texte, listes
  et radios seulement, JAMAIS les fichiers ni le consentement ; enregistre 500 ms apres la frappe,
  et seulement si un champ texte est rempli ; message "Nous avons retrouve votre brouillon." avec
  un bouton "Effacer" (remet le formulaire a zero) ; efface a l envoi reussi. Tout en try/catch.
  `?modele=` passe APRES la restauration : venir d une fiche est plus recent que le brouillon.
  REFERENCE DE DEMANDE : `referenceDevis` dans `src/config/devis.ts`, format `PT-AAAAMMJJ-xxxx`,
  alphabet sans 0/O/1/I. ATTRIBUEE PAR LE SERVEUR EN E6, jamais par le navigateur (duplication en
  deux onglets, perte au brouillon, forgeable). Le formulaire n en envoie aucune.
  `docs/devis-contrat.md` a jour : `police`, `recontact`, `quandAppeler`, `datePoseSouhaitee`,
  suppression de `ligne<n>_police`, tableau des sections repliees (un champ ABSENT est le cas
  normal, pas une erreur), sections "Reference de demande attribuee par le serveur" et "Brouillon
  conserve dans le navigateur".
  MESURES (gzip, meme calcul que `scripts/poids-pages.py`) : `/devis/` html 15348 octets (12318
  apres E5 passe 1), js en ligne 7908 (5613), css partage 6834 INCHANGE. Preuve qu aucune autre
  page ne change : 404.html 3783 et css 6834, exactement les chiffres de la passe 1 ; et toutes les
  classes Tailwind de la page existaient deja (seul `btn-outline` est nouveau ICI, mais il sert
  deja sur 6 autres pages). L habillage reste en CSS `grav-*` dans la page, mis en ligne dans
  `/devis/index.html` seul (un seul fichier css dans `dist/_astro`).
  A SAVOIR POUR PLUS TARD : un `<script is:inline>` n est NI minifie NI depouille de ses
  commentaires par Astro. Les commentaires francais du script partent donc chez la famille : c est
  la premiere chose a retirer si `/devis/` doit maigrir.
  PIEGE DE SESSION : `python3 scripts/poids-pages.py` reste REFUSE a l agent malgre la ligne
  `Bash(python3 scripts/:*)` de `.claude/settings.json` (le motif coupe au milieu d un mot, il
  faudrait `Bash(python3 scripts/poids-pages.py:*)`) ; `gzip` et `git checkout` sont refuses aussi.
  La mesure a donc ete refaite par une integration temporaire dans `astro.config.mjs` (gzip de
  Node, NIVEAU 9 pour coller au defaut de `gzip.compress()` en python), retiree depuis
  (`git status` : `astro.config.mjs` non modifie). Niveau 9 : les chiffres tombent a l octet sur
  ceux de la passe 1, le niveau par defaut de Node donnait 3789 au lieu de 3783.
  Verifie : `npm run build` OK (23 pages), `npx astro check` 33 fichiers 0 erreur 0 avertissement
  0 hint ; `grep -rliE "atelier|kosovo|sous-trait|fabriqu|n8n" dist` ne renvoie rien ; sitemap
  21 adresses (inchange) ; dans dist : 6 radios `police`, 0 `ligne<n>_police`, 14 radios `granit`,
  4 `ligne<n>_hauteur` avec 50/40/30/30, `recontact` a "email", "3 cm" a "6 cm" sur les 4 lignes.
  A FAIRE AVANT E6 : essayer la page sur un telephone avec un proche age (c est la decision de
  Thomas : la passe 3, etapes et recapitulatif, ne se decide qu apres ce test).
- 13.10.2026, E5 TERMINEE (Claude Code) : PERSONNALISATION GUIDEE, pas de configurateur visuel
  (reporte, regles dans `docs/CONFIGURATEUR-FUTUR.md`).
  `src/data/personnalisation.ts` est la SOURCE UNIQUE (reutilisee plus tard par le configurateur) :
  6 polices OFL (cinzel, marcellus, eb-garamond, jost, great-vibes, pinyon-script ; style romain /
  baton / anglaise / lapidaire, pile CSS), hauteursLettresMm [30, 40, 50, 60] (defauts nom 50,
  dates 40, epitaphe 30), 3 finitions (blanc, dore, feuille-or) avec leur couleur d apercu,
  8 motifs (aucun, croix, colombe, rose, coeur, arbre, autre, dessin-fourni), les 4 lignes et la
  mention d apercu. En tete : "liste provisoire, a confirmer selon ce que nous savons graver".
  Aucun paquet @fontsource ne manquait : les 6 polices de la spec existent, rien n a ete remplace.
  `/devis/` : le champ unique "texte a graver" (`gravure`) est REMPLACE par 12 champs
  `ligne<n>_texte` / `_police` / `_hauteur` (n de 1 a 4), plus `finition` (radio, "Je ne sais pas
  encore" par defaut), `motif` (select) et `gravure_precisions` (textarea). Tout reste facultatif.
  Echantillons : la liste des 6 polices est ecrite chacune dans sa police (statique, lisible sans
  JS), et sous chaque select un apercu du nom de la police choisie.
  Apercu en direct (JS vanilla, progressive enhancement, aucun canvas) : cadre colore avec la teinte
  approximative du granit choisi (TEINTE_PASTILLE de granits.ts), les 4 lignes dans leur police, la
  taille a 0,6 px par mm, la couleur selon la finition. Sans JS le bloc reste cache (`hidden`) et le
  formulaire est complet. Mention fixe sous l apercu : "Apercu indicatif... (bon a tirer) avant
  toute gravure."
  POLICES CHARGEES SEULEMENT SUR /devis/ : les 6 imports `@fontsource/<police>/latin-400.css` sont
  dans la page, jamais dans BaseLayout ni styles.css ; Astro en met le `@font-face` en ligne dans
  `/devis/index.html` seul, avec `font-display: swap` (6 occurrences). Ne pas les deplacer.
  PIEGE TAILWIND : la feuille Tailwind est UNIQUE et partagee par les 23 pages, donc une classe
  utilitaire inedite utilisee sur /devis/ alourdit tout le site (+163 octets gz au premier essai).
  L habillage de la section gravure est donc ecrit en CSS dans la page (classes `grav-*`), et les
  classes Tailwind gardees sont exactement celles que la page utilisait deja.
  MESURES : `python3` n est pas dans l allowlist de `.claude/settings.json`, la mesure a donc ete
  refaite avec le gzip de Node (meme calcul que `scripts/poids-pages.py`, integration temporaire
  dans astro.config.mjs, retiree depuis). Son gzip ne donne pas le meme octet que celui de Python :
  l ecart constant avec `docs/perf-reference-2026-10-13.txt` (404 : 3783 au lieu de 3805 ; css 6834
  au lieu de 6810) vient de l outil, pas des pages. Preuve : un build de controle avec l ANCIENNE
  page devis donne, pour les 22 autres pages, exactement les memes chiffres que le build E5
  (html, js en ligne et css identiques a l octet). E5 ne coute rien aux autres pages.
  `/devis/` : html 12318 octets gz (8652 avant E5, @font-face en ligne compris), js en ligne 5613
  (4405 avant), css partage 6834 (inchange). Polices : 6 woff2 latin, 143 748 octets au total
  (great-vibes 42 800, pinyon-script 39 044, eb-garamond 23 820, marcellus 14 552, cinzel 14 128,
  jost 9 404), telechargees seulement sur /devis/. Les .woff de repli sont aussi ecrits dans dist
  mais aucun navigateur moderne ne les demande.
  Verifie : `npm run build` OK (23 pages), `npx astro check` 33 fichiers 0 erreur 0 avertissement
  0 hint ; `grep -rliE "atelier|kosovo|sous-trait|fabriqu|n8n" dist` ne renvoie rien ; 12 champs
  de ligne dans le HTML, hauteurs par defaut 50/40/30/30, plus aucun `name="gravure"`.
  `docs/devis-contrat.md` : section "L inscription" (valeurs autorisees = ids de
  personnalisation.ts) et section "Configurateur futur" (il devra produire exactement ces champs).
- 13.10.2026, Claude chat : formulaire teste dans le navigateur (pre-selection du modele, erreurs, message d attente) ; espace manquant corrige dans le consentement. Build 23 pages, check 0 erreur. VPS passe a 80 Go (partition etendue automatiquement).
- 13.10.2026, E4 PASSE 4 TERMINEE (Claude Code) : devis, merci, protection des donnees. E4 EST FINIE.
  `/devis/` est une vraie page indexable (title 44, meta 150, h1 unique, canonical, fil d Ariane) :
  formulaire `method="post" action="/api/devis" enctype="multipart/form-data"`, 4 sections
  (coordonnees, monument, gravure et personnalisation, message), consentement obligatoire avec lien
  vers /protection-des-donnees/, select modele genere depuis les 12 fiches (2 optgroups) et select
  granit depuis granits.json. Pre-selection depuis `?modele=<slug>` en JS (remplit aussi la famille,
  via `famillesParModele`) ; sans JS la page reste utilisable et poste nativement.
  ENVOI INACTIF : `src/config/devis.ts` ({ envoiActif: false, endpoint: "/api/devis" }, limites de
  fichiers, delai anti-robot, messages). Tant que `envoiActif` est false, le JS valide puis affiche
  "L envoi en ligne sera bientot disponible" et ne poste RIEN. A true : fetch multipart, "Envoi en
  cours", puis /devis/merci/ ou message d erreur (les `erreurs` de la reponse s affichent sous le
  champ concerne). Validation maison en francais (`form.noValidate = true` cote JS seulement) :
  message sous chaque champ, resume en role="alert", focus sur le premier champ fautif.
  Fichiers : 3 au maximum, 8 Mo au total, JPEG/PNG/WEBP/PDF, verifies en JS et A REVERIFIER EN E6.
  Anti-spam : piege `societe` (hors parcours clavier) et `horodatage` pose par le JS (vide sans JS,
  c est normal) ; emplacement commente pour Turnstile, aucune cle dans le depot.
  `docs/devis-contrat.md` : le contrat que E6 doit implementer (chaque champ, les limites, les
  reponses 200/400/413/429/500, les deux chemins avec et sans JS).
  `/devis/merci/` en noindex, hors sitemap, aucun delai chiffre. `/protection-des-donnees/` courte et
  prudente (LPD), responsable lu dans entreprise.ts donc rien d affiche aujourd hui, commentaire
  "A faire relire : texte provisoire, pas un avis juridique" en tete du fichier ; liee depuis la
  ligne basse du pied de page (`siteConfig.footerLegal`).
  Tous les liens internes passent a `/devis/` (et `/devis/?modele=<slug>` sur les fiches) : la page
  etant indexable, son canonical est /devis/ et les liens ne doivent plus passer par une redirection.
  Le filtre du sitemap n exclut plus que `/devis/merci`.
  Verifie : `npm run build` OK (23 pages), `npx astro check` 32 fichiers 0 erreur 0 avertissement
  0 hint ; sitemap 21 adresses dont /devis/ et /protection-des-donnees/, sans /devis/merci/ ;
  le select modele contient les 12 slugs ; `grep -rniE "atelier|kosovo|sous-trait|fabriqu|n8n" dist`
  ne renvoie rien ; titles 44, 41 et 34 signes, metas 150, 136 et 39.
- 13.10.2026, E4 PASSE 3 TERMINEE (Claude Code) : page prix, Nos granits, FAQ.
  3 pages nouvelles : `/prix-pierre-tombale-suisse/` (ce que comprend l estimation, ce qui fait varier
  le prix, tableau par famille, "Prix indicatifs, estimation gratuite et sans engagement sur devis" et
  "les eventuelles taxes communales de cimetiere ne sont pas comprises"), `/nos-granits/` (granits
  disponibles par teinte, pastille de couleur approximative, aucune origine geographique) et `/faq/`
  (8 questions, JSON-LD FAQPage).
  AUCUN MONTANT DANS LES PAGES : `fourchetteAffichee(slugs)` et `fourchetteEstProvisoire(slugs)` dans
  `src/data/tarifs.ts` agregent les prix de tarifs.json (aujourd hui "De 1'400 a 6'000 CHF" pour les
  2 familles). `TEINTE_PLURIEL`, `TEINTE_PASTILLE` et `granitsParTeinte()` passent dans
  `src/data/granits.ts` : l accueil et /nos-granits/ lisent la meme source.
  FAQ : le delai "environ un an apres l inhumation" du production-spec est ECARTE, comme toute
  affirmation reglementaire ; les 2 questions concernees repondent "les regles dependent de chaque
  commune : nous verifions pour vous le reglement du cimetiere concerne". Une question porte sur le
  dessin fourni par la famille.
  Menu : Prix ajoute. Pied de page : Nos granits (Catalogue), Prix et Questions frequentes
  (Informations). Accueil : la liste des granits faisait doublon, remplacee par un lien vers
  /nos-granits/, plus un lien Prix dans l en-tete de la section des modeles. Fiches modele : lien
  discret "Comment est calcule le prix ?" sous le prix.
  Verifie : `npm run build` OK (21 pages), `npx astro check` 29 fichiers 0 erreur 0 avertissement
  0 hint ; sitemap 19 adresses dont les 3 nouvelles ; `grep -rniE
  "atelier|kosovo|sous-trait|fabriqu|swiss ?made|artisan" dist` ne renvoie rien ; titles 30, 53 et 59
  signes, meta 145, 148 et 153.
- 13.10.2026, Claude chat : carte de partage public/og-image.png (1200x630, gris, "PierreTombale.ch",
  generee par script PIL) branchee par defaut via siteConfig.socialImage. A regenerer avec le nom definitif.
  Build 18 pages et astro check 0 erreur. Apercu Netlify republie.
- 13.10.2026, E4 PASSE 2 TERMINEE (Claude Code) : accueil et page de presentation.
  `src/pages/about.astro` devient `src/pages/a-propos.astro` (adresse /a-propos/, slug du
  production-spec), libelle "Qui sommes-nous" dans le menu et le pied de page (les deux viennent de
  `siteConfig`, seule source des liens). Contenu : service complet de A a Z en 5 etapes (conseil,
  devis detaille, bon a tirer, pose au cimetiere par nos soins, suivi apres la pose), zone
  Val-de-Travers > canton de Neuchatel > Suisse romande. Les anciens "chiffres" (03 associes) sont
  remplaces par des reperes sans chiffre : zone, matiere, pose.
  Accueil : promesse "realises sur mesure et poses par nos soins", bloc "Comment ca se passe" en
  4 etapes (tableau `etapes` dans le frontmatter), section "Ou nous intervenons" en bas, bouton
  principal = /devis partout (les 2 familles restent en boutons secondaires).
  Mentions d atelier et de fabrication retirees du texte visible : legendes de visuels ->
  "Photographies de nos realisations a venir", granits -> "selon les granits disponibles"
  (accueil, a-propos, FicheModele, fiche stele-bicolore). Repli de `robots.txt.js` remis sur le
  domaine du projet (c etait la demo du theme). Restent des COMMENTAIRES de code qui parlent de
  l atelier (granits.ts:11, products.ts:126, ProductImage.astro:7, monuments-funeraires/index.astro:8) :
  invisibles sur le site, a reecrire a l occasion.
  STATISTIQUE RETIREE : "plus de 90% de cremations en Suisse" (et 97% a Neuchatel) sur
  /monuments-cineraires-cavurnes/ (intro + meta). Aucune source verifiable : le dossier aux associes
  l attribue a "RTS et l association suisse des services funeraires" sans document ni date, et
  `analyses/2026-08-17-niche-pierre-tombale-ne.md` dit que la part inhumation/cremation reste a
  chiffrer via OFS. Texte actuel : "la grande majorite des defunts sont aujourd hui incineres".
  Le motif est note en commentaire dans la page ; a remettre avec la reference exacte si les
  associes fournissent la statistique de l OFS.
  Verifie : `npm run build` OK (18 pages), `npx astro check` 26 fichiers 0 erreur 0 avertissement
  0 hint ; plus de /about dans dist, /a-propos/ dans le sitemap (16 adresses, /devis toujours
  exclu) ; `grep -rniE "atelier|kosovo|sous-trait|fabriqu|swiss ?made|artisan" dist` ne renvoie
  rien ; plus aucun "90%" ni "97%" dans dist ; meta descriptions 151 et 145 signes.
- 13.10.2026, E4 PASSE 1 TERMINEE (Claude Code) : nettoyage du theme, nom, titres.
  Nom PROVISOIRE "PierreTombale.ch" dans `src/config/site.ts` (name, tagline, description,
  defaultTitle, commentaires en francais). `pageTitle()` passe au separateur " | " :
  "Page | PierreTombale.ch". A changer quand le nom sera tranche : `name` ici et `site` dans
  astro.config.mjs.
  Fiches : `titreFiche(nom, nature)` dans site.ts donne "<Nom> - pierre tombale en granit |
  PierreTombale.ch" (ou "monument cineraire" pour un cineraire), retire le nom du site au-dela
  de 60 signes, et si le nom du modele repete deja la nature ("Stele cineraire courbe avec
  vase") ne la redit pas. Meta description = shortDescription + " Prix indicatif et devis
  gratuit.", tronquee a 155. h1 inchange. Verifie : 18 titres uniques, aucun au-dela de 60.
  Pied de page : newsletter supprimee entierement (section, script, styles `.newsletter-field`
  de src/styles.css) ; colonnes Catalogue (les 2 familles) et Informations (L atelier, Demander
  un devis), aucun faux lien ; mention basse "(c) 2026 PierreTombale.ch" ; `id="studio"` retire
  du pied de page, il doublait celui de la page L atelier.
  Visuels : `git rm` des 3 photos de meubles et de public/og-image.png. Remplacees par
  `src/assets/visuel-provisoire.svg` (aplat de granit gris, grain en filtre SVG) avec la legende
  "Visuel provisoire" sur l accueil et sur L atelier. `public/favicon.svg` : monogramme "PT"
  en rectangles, pas de police embarquee.
  PAS D OG:IMAGE pour l instant : le PNG 1200x630 n a pas pu etre genere dans la session,
  `node` n est pas dans l allowlist de `.claude/settings.json` et ni ce fichier ni
  /home/kumo/atelier/tmp ne sont ouverts en ecriture a l agent. `socialImage` a donc disparu de
  site.ts, et BaseLayout n emet og:image / twitter:image que si la page fournit son propre
  visuel (les fiches le feront des qu elles auront des photos).
  A FAIRE : creer `public/og-image.png` (1200x630, fond gris pierre, texte "PierreTombale.ch")
  puis remettre `socialImage` dans site.ts. Un SVG ne suffit pas : les reseaux ne le lisent pas.
  Anglais : `src/pages/about.astro` entierement traduite (principes, chiffres, appel a l action,
  aria-label) ; commentaires de site.ts, SiteFooter, BaseLayout et index.astro passes au
  francais. Restent 4 commentaires anglais NON visibles, a traduire a l occasion :
  SiteHeader.astro:8, ProductCard.astro:8, 12 et 54. Corrige au passage sur l accueil :
  "conseil, gravure et pose comprises" -> "compris".
  `.parallax` (src/styles.css) n est plus utilise : les visuels provisoires sont des aplats.
  A remettre sur les vraies photos, ou a supprimer.
  Verifie : `npm run build` OK (18 pages), `npx astro check` 26 fichiers, 0 erreur,
  0 avertissement, 0 hint ; `grep -rli "Atelier K" dist` vide ; aucun renvoi vers
  atelier-hero / atelier-hands / atelier-workshop / og-image dans dist.
  Piege de session : les 4 suppressions de fichiers avaient ete indexees avant le premier
  commit, elles sont donc dans "nom provisoire et format des titres" et pas dans le commit des
  visuels (git reset est interdit par les permissions, l historique n a pas ete repris).
- 13.10.2026, E3 TERMINEE (Claude Code, docs finies par Claude chat : l agent a atteint 80 tours).
  `src/config/entreprise.ts` : coordonnees toutes a null, rien d affiche tant qu elles manquent.
  `src/data/tarifs.json` + `src/data/tarifs.ts` : fourchette par defaut 1'400 - 6'000 CHF (provisoire),
  affichee via prixAffiche(slug) avec "Prix indicatif, devis personnalise gratuit" ; pas d offre chiffree
  dans le JSON-LD tant que c est provisoire ; un slug inconnu dans tarifs.json fait echouer le build.
  Verifie dans dist : fiches et listes affichent la fourchette, aucune Offer, aucune coordonnee inventee.
  Restes du theme reperes pour E4 : nom "Atelier Ko" partout ; formulaire newsletter en anglais dans
  `src/components/SiteFooter.astro` (factice, n envoie rien) a supprimer.
  Changer un prix : dans `src/data/tarifs.json`, remplacer `null` du modele par {"des": 2400} ou
  {"min": 2400, "max": 3100}. Changer la fourchette generale : `fourchetteParDefaut`.
  Changer une coordonnee : remplir le champ dans `src/config/entreprise.ts`. Puis rebuild.
- 13.10.2026, E2 passe B TERMINEE (Claude Code) : les adresses SEO.
  Nouvelles adresses : `/monuments-funeraires/` et `/monuments-cineraires-cavurnes/` (une page liste
  par famille, filtre gamme seulement, tri ordre du catalogue ou nom), `/monuments-funeraires/<slug>/`
  et `/monuments-cineraires-cavurnes/<slug>/` pour les fiches. Chaque `[slug].astro` ne genere que les
  modeles de sa famille : un modele n a qu une seule adresse.
  `src/pages/catalog.astro` et `src/pages/products/` supprimes (site pas en ligne, pas de redirection).
  Factorisation : `src/components/ListeModeles.astro` (filtre, tri, compteur, grille),
  `src/components/PageFamille.astro` (en-tete, intro en slot, fil d Ariane, liste) et
  `src/components/FicheModele.astro` (l ancienne fiche produit). `productUrl(product)` et
  `familleUrl(famille)` dans `src/data/products.ts` : tous les liens de modele passent par la, y compris
  ProductCard, SiteHeader, menu mobile, accueil, 404 et about. Le lien devis reste `/devis?modele=<slug>`.
  `FAMILLE_LABELS` devient "Monuments funeraires" et "Monuments cineraires et cavurnes" (fil d Ariane,
  pied de page, ligne Famille des fiches). Menu : Monuments funeraires, Monuments cineraires, L atelier,
  Demander un devis ; libelles accentues, chrome du menu et `lang="fr"` au passage.
  SEO : title unique par page (47 caracteres au plus) et meta description (154 au plus, coupee sur un mot
  entier par `tronque`), un seul h1 par page, canonical partout, JSON-LD BreadcrumbList
  (Accueil > famille > modele) et Product sans offre chiffree sur les fiches, alt sur toutes les images.
  Titres et descriptions des 2 pages liste raccourcis depuis `docs/production-spec-pierretombalech.json` :
  le marbre, les prix affiches et le telephone du production-spec sont ecartes (granit seul, tarifs en E3,
  coordonnees provisoires).
  `astro.config.mjs` : `site` pointait encore sur la demo d Atelier Ko ; remis sur
  **https://www.pierretombale.ch, provisoire, nom non definitif** (le nom de l entreprise et le domaine
  ne sont pas tranches, cf. `docs/DECISIONS-ET-ETAT.md`). A corriger des que le nom est choisi : c est la
  seule source des URL absolues (canonical, sitemap, JSON-LD). Le sitemap exclut desormais `/devis`,
  qui est en noindex.
  Verifie : `npm run build` OK, 18 pages (accueil, about, devis, 2 pages liste, 12 fiches, 404,
  robots.txt, sitemap) ; `npx astro check` : 24 fichiers, 0 erreur, 0 avertissement, 0 hint (le hint de
  la passe A a disparu avec l ancienne fiche) ; `grep -rl "/catalog\|/products/" dist` et le meme grep
  sur `src` ne renvoient rien ; le sitemap liste 16 adresses, dont les 2 pages liste et les 12 fiches.
  Visuels : Thomas generera des images par IA plus tard ; il suffira de les mettre dans `src/assets` et
  de les lister dans `images:` de la fiche.
  Piege : `npm run format` (prettier) reformate tout le depot, y compris les documents de `docs/`,
  `analyses/` et le production-spec JSON genere par W6. Le code de `src/` etait deja conforme ; le reste
  a ete remis dans l etat d origine. Ne lancer prettier que sur un chemin precis, par exemple
  `npx prettier --write src`.
- 13.10.2026, E2 passe A TERMINEE (Claude Code). Les trois derniers fichiers qui utilisaient les
  anciens champs d Atelier Ko (price, material, category, formatPrice) sont passes au schema metier :
  `SiteHeader.astro` (plus de prix : "Prix sur demande", visuel via ProductImage),
  `index.astro` (chiffres du catalogue, modele mis en avant par famille/gamme/granit presente,
  section granits regroupes par teinte, textes en francais), `catalog.astro` (filtres famille et
  gamme, tri ordre du catalogue ou nom, data-attributes et script adaptes).
  `getProductFilters` remplace par les listes fixes `FAMILLES` et `GAMMES` dans `src/data/products.ts`
  (une gamme sans modele reste proposee) ; `formatPrice` avait deja disparu en passe A precedente.
  `siteConfig.featured` pointait encore sur les modeles supprimes d Atelier Ko : remis sur
  stele-doucine-classique, stele-arrondie, stele-cineraire-droite (grille), monument-avec-jardiniere
  (solo), stele-coeur (menu mobile), sinon le build echouait.
  Verifie : `npm run build` OK, 17 pages (accueil, about, catalog, devis, 12 fiches produit, 404,
  robots.txt, sitemap) ; `npx astro check` : 18 fichiers, 0 erreur, 0 avertissement, 1 hint
  (interface `Props` de `products/[slug].astro`, utilisee par Astro : faux positif).
  L adresse /catalog est inchangee, les adresses SEO sont la passe B.
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
CATALOGUE : faire corriger par Thomas les noms publics, les dimensions et la nature des matieres
(granit ou non) ; republier l apercu apres chaque correction. Puis configurateur passe A sur douceur.

TEST PAR THOMAS AVEC UN PROCHE AGE, SUR UN TELEPHONE (sa decision du 14.10.2026, prealable a E6).
E5 est terminee : plus rien n est a construire sur `/devis/` avant ce test. Ce qu il faut regarder :
le parcours complet en 4 etapes sur un ecran de 390 px, les etapes 2 et 3 sautees selon le type de
demande, le retour arriere qui conserve les reponses, le rechargement qui reprend a la meme etape, les
boutons et les cases assez grands pour un pouce age, et le recapitulatif qui se relit sans lunettes.
Ce qui n a PAS pu etre essaye dans la session : rien dans un navigateur (il n y en a pas).
Si la page doit maigrir ou si le script devient difficile a tenir : l extraire dans
`src/scripts/devis.ts` (section 9 de `docs/SPEC-DEVIS-ETAPES.md`) le ferait minifier ; il pese
13146 octets gz en ligne, surtout des commentaires.

ENSUITE E6 : ENVOI DU DEVIS. Fonction Cloudflare Pages `functions/api/devis.ts` + Resend (PAS de n8n,
decision de Thomas du 13.10.2026), adresse de destination en variable d environnement, Turnstile.
Tout est specifie dans `docs/devis-contrat.md`, y compris les 12 champs d inscription, `finition`,
`motif` et `gravure_precisions` ajoutes en E5 (valeurs autorisees = ids de
`src/data/personnalisation.ts`, que la fonction importe au lieu d en recopier les listes).
Il restera a passer `envoiActif` a true dans `src/config/devis.ts` et a poser le widget Turnstile a
l emplacement commente de la page devis. Aucun secret dans le depot.
PREREQUIS A OBTENIR DE THOMAS AVANT DE COMMENCER : le nom de domaine achete et son DNS verifie chez
Resend (SPF/DKIM), un compte Resend dont il saisit lui-meme la cle dans Cloudflare, et l adresse de
destination des demandes. Sans eux, la fonction ne peut pas etre essayee pour de vrai.
Ensuite E7 : deploiement Cloudflare Pages.
Le configurateur visuel (Konva) n est plus une etape du plan : il viendra apres la mise en ligne,
en respectant docs/maquettes/configurateur/2026-10-14/DIRECTION-DESIGN.md (regles derivees des
maquettes, points ouverts a trancher avant la passe B),
selon `docs/CONFIGURATEUR-FUTUR.md` (inputs a obtenir d abord : dimensions mm par modele, zones de
gravure, polices et finitions confirmees, visuels).
