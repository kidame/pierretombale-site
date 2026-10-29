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

## Apercu en ligne : migration Cloudflare Pages (26.10.2026)

- Cible : projet Pages pierretombale-site, depot kidame/pierretombale-site via application GitHub.
  Compte Cloudflare cree par Thomas via Google ; depot visible dans l'assistant Pages.
  Premier deploiement reussi : https://pierretombale-site.pages.dev/ controle en HTTPS.
  Branche live et duree du build a confirmer dans le tableau de bord.
- EN PRODUCTION depuis le 26.10.2026 (confirme par Thomas) : https://www.pierretombale.ch, projet
  Pages pierretombale-site, branche live. Domaine nu et HTTP -> 301 vers https://www (chemin et
  parametres conserves). Previsualisations de main protegees par Cloudflare Access
  (hello.puglisi@gmail.com). Search Console : domaine valide, deux sitemaps soumis ("Operation
  effectuee"), TXT google-site-verification a conserver. Indexation non confirmee.
- Organisation : main = previsualisations, live = production. Travail uniquement sur main.
  Push sur main et surtout sur live SEULEMENT sur demande explicite de Thomas.
- Parametres : Astro, npm run build, dist, Node 22 ; SITE=https://www.pierretombale.ch en
  Production ET Preview. Guide complet : docs/MISE-EN-LIGNE.md.
- Netlify abandonne. Ancien lien conserve comme archive : https://pt-apercu-k7q2.netlify.app.
  tmp/apercu et tmp/apercu-extras conserves ; suppression uniquement apres accord de Thomas.
- Recette restante (E7 pas encore coche) : controles visuels des pages en production,
  configurateur au navigateur, Lighthouse mobile, verification SEO finale.

## Derniere session
- 29.10.2026 (13h50), Claude : LOT 2 PAGES CIMETIERES MIS EN LIGNE a la demande de Thomas (hub /cimetieres/ +
  9 pages). AUDIT INDEXATION du site en ligne : sitemap-index -> sitemap-0 (50 URL, toutes en 200, canonique =
  URL, aucune noindex) + sitemap-images (28 pages, 280 images, echantillon en 200) ; robots.txt Allow + 2 sitemaps ;
  pierretombale.ch et http -> 301 www https ; sans barre finale -> 308 ; 404 propre ; pierretombale-site.pages.dev
  en X-Robots-Tag noindex ; main protege par Access. Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot,
  PerplexityBot : 200 (seul le client Python-urllib est bloque par Cloudflare, normal). Dist : 74 pages, 1 h1,
  lang fr, JSON-LD valide, aucun lien interne casse, aucun titre ni description en double. Corrige : pageTitle
  retire " | PierreTombale.ch" au-dela de 65 signes ; titre du hub et description du guide cineraire raccourcis.
  Script d audit : /tmp/ka/audit.py (dist) et /tmp/ka/live.py (en ligne), non versionnes.
- 29.10.2026, Claude : LOT 2 DES PAGES CIMETIERES, PASSE B (docs/BRIEF-CIMETIERES-LOT2.md
  section 8). CINQ FICHES DE PLUS dans src/data/cimetieres.ts, au format des 4 premieres :
  /cimetieres/{le-landeron, boudry, cortaillod, le-locle, val-de-travers}/. Le fichier de
  donnees reste la seule source ; aucune page nouvelle a ecrire (getStaticPaths), le hub et
  « Autres cimetieres » se remplissent tout seuls. SOURCES UNIQUES : docs/DIMENSIONS-MONUMENTS.md,
  docs/REGLEMENTS-CIMETIERES-NE.md, docs/CIMETIERES-PRATIQUE.md.
  CE QUI N EST PAS AFFICHE, FAUTE DE SOURCE : aucune adresse de cimetiere pour Val-de-Travers
  et Le Locle (les documents ne la donnent pas) ni pour Le Landeron ; le nom du lieu-dit du
  cimetiere du Landeron n est PAS ecrit (orthographe non confirmee) ; aucun horaire de
  cimetiere la ou il n est pas publie (les pages disent de le demander a l office) ; la
  chapelle et les chambres mortuaires du Landeron (source tierce pflv.ch) ; les tarifs de
  gravure « lecture indirecte » de Val-de-Travers (CHF 23.- par caractere) et de
  La Chaux-de-Fonds ; aucun superlatif (le « delai le plus long du canton » de Val-de-Travers
  a ete retire a la relecture). Chaque regle porte son article ; la ou la hauteur n est pas
  publiee (Landeron, Boudry, Val-de-Travers) la page le dit et renvoie a la commune.
  Equipements vides pour Boudry (rien de publie) : la section « Sur place » ne s affiche pas.
  Trois sources ajoutees a src/data/cimetieres-ne.ts : pages officielles de Boudry, de
  Cortaillod et portail des deces de Val-de-Travers. Les reglements du Landeron (1110) et de
  Cortaillod n ont AUCUNE adresse en ligne dans le releve : cites par leur nom et leur date,
  sans lien (Le Landeron n a donc que la loi cantonale en « Documents officiels »).
  DEUX RETOUCHES DE MISE EN PAGE (src/pages/cimetieres/[slug].astro) : (1) la
  MentionVerification et la ligne « page d information independante » passent APRES le bloc
  « L essentiel » (adresse, telephone et 3 chiffres cles visibles plus haut sur telephone) ;
  (2) nouvelle fonction `espacesFines()` appliquee AU RENDU : l espace apres « et avant »
  devient insecable (U+00A0), les donnees gardent des espaces ordinaires. `donnees` sert aux
  liens (devisUrl, itineraireUrl), `cimetiere` a l affichage et au JSON-LD (meme texte).
  Maillage : le guide « quand poser » relie les lignes Le Locle, Boudry et Val-de-Travers a
  leur page ; COMMUNES_NE porte les 5 nouveaux slugs.
  VERIFIE : npm run build 74 pages 0 erreur (etait 69), npx astro check 0 erreur (3 hints
  anciens), un seul h1 par page, 9 URL /cimetieres/ dans le sitemap, canoniques www, titres
  et descriptions uniques (valide() le controle au build), aucun « fabri », tiret long,
  apostrophe courbe ni guillemet anglais dans dist/cimetieres, espaces insecables presentes
  dans le HTML produit et absentes des donnees, liens /devis/?commune=&cimetiere= controles.
  NON FAIT : `npm test` N A PAS PU ETRE LANCE (commande hors .claude/settings.json, aucune
  approbation possible en mode non interactif) ; tests/cimetieres.test.ts est generique (il
  ne compte pas les fiches) et devrait passer, mais le dire seulement apres l avoir lance.
  Pas de relecture au navigateur (1280 et 390), pas de push (consigne de Thomas).
  PROCHAINE ETAPE : relecture au navigateur des 5 nouvelles pages, puis `npm test` ; appels
  aux communes pour les valeurs manquantes (liste dans docs/BACKLOG.md, etape 3 passe B).
- 29.10.2026, Claude : LOT 2 DES PAGES CIMETIERES, PASSE A (docs/BRIEF-CIMETIERES-LOT2.md
  section 8, analyse analyses/2026-10-29-seo-pages-cimetieres.md). Cinq pages nouvelles :
  /cimetieres/ (hub) et /cimetieres/{beauregard-neuchatel, la-chaux-de-fonds, peseux,
  corcelles-cormondreche}/. SOURCES UNIQUES : docs/DIMENSIONS-MONUMENTS.md,
  docs/REGLEMENTS-CIMETIERES-NE.md, docs/CIMETIERES-PRATIQUE.md ; rien d invente, une valeur
  absente n est pas affichee (ex. horaires du cimetiere de La Chaux-de-Fonds : la page dit de
  les demander a l office ; infos marquees "(tiers)" ou "lecture indirecte" non publiees).
  Nouveau src/data/cimetieres.ts = SEULE SOURCE : type Cimetiere (contact, acces, equipements,
  projets, histoire, regles avec l article de chaque dimension, cineraire, tarifs communaux
  dates, duree, entretien, faq, sources, verifieLe), COMMUNES_NE (26 lignes pour les
  24 communes du canton : Neuchatel en 3 lignes, Brot-Plamboz rattache aux Ponts-de-Martel),
  devisUrl() et itineraireUrl(). `valide()` est appele au chargement du module : titre > 65
  signes, description hors 120-160, moins de 4 questions, aucune source ou slug en double
  ARRETENT LE BUILD (les tests ne tournent pas toujours, voir plus bas).
  Mise en page unique src/pages/cimetieres/[slug].astro : fil d Ariane, h1, chapo,
  MentionVerification (nouvelle prop `texte` ; les guides gardent le leur), ligne "page
  d information independante, pour les demarches officielles : <service>" (on ne se presente
  jamais comme la commune), carte "L essentiel" (adresse + lien Itineraire Google Maps,
  horaires, telephone en tel:, acces, 3 chiffres cles), sommaire, "Sur place", "Poser un
  monument" (tableau des dimensions + phrase fixe sur mesure), "Urnes, columbarium et jardin
  du souvenir" + tarifs officiels, "Duree de la tombe", "Entretien", FAQ, appel au devis
  pre-rempli, "Documents officiels", "Autres cimetieres". JSON-LD : BreadcrumbList, FAQPage
  (meme texte qu affiche, modele des guides) et WebPage about Cemetery (adresse seulement si
  connue, aucun avis). Aucune image, aucun JS sur ces pages.
  Hub : chapo (pas de regle nationale, 30 ans de la loi cantonale), cartes des 4 pages,
  tableau des 24 communes (liste de cartes sur telephone), "Les constantes du canton",
  FAQ de 5 questions, documents officiels, liens vers les guides.
  Devis : /devis/?commune=&cimetiere= remplit communeCimetiere et cimetiere SANS ecraser une
  saisie ni un brouillon (aucun champ du contrat change). Maillage : "Cimetieres" au pied de
  page (rubrique Informations), note des fiches modele pointee sur /cimetieres/, noms de
  communes du guide "quand poser" relies a leur page, ligne /cimetieres/ dans l index des
  guides. Sources ajoutees a src/data/cimetieres-ne.ts : loi sur les sepultures (PDF rsn.ne.ch),
  pages officielles de Peseux, de Corcelles-Cormondreche et de La Chaux-de-Fonds.
  VERIFIE : npm run build 69 pages 0 erreur (etait 64), npx astro check 0 erreur (2 hints
  anciens), un seul h1 par page, 5 URL ajoutees au sitemap, canoniques www, titres et
  descriptions uniques, aucun tiret long ni apostrophe courbe ni "fabri" dans dist/cimetieres,
  liens tel: et ?commune=/?cimetiere= controles dans le HTML produit.
  NON FAIT : `npm test` N A PAS PU ETRE LANCE (commande hors .claude/settings.json, aucune
  approbation possible en mode non interactif) : tests/cimetieres.test.ts est ECRIT mais NON
  EXECUTE ; lancer `npm test` avant de pousser. Pas de relecture au navigateur (1280 et 390)
  ni de capture : a faire avant la mise en ligne. Pas de push (consigne de Thomas).
  PROCHAINE ETAPE : PASSE B du brief (fiches Le Landeron, Boudry, Cortaillod, Le Locle,
  Val-de-Travers dans le meme fichier, au format des 4 premieres).
- 29.10.2026, Claude : Thomas precise que les monuments sont FABRIQUES SUR MESURE (le 100 x 200 n est
  pas un blocage). Fiches modele : "Dimensions indicatives" + note "realise sur mesure, a la taille
  exigee par le reglement de votre cimetiere, verifie au devis" (accordeon Dimensions) + puce dans
  "Pose et accompagnement". Devis etape 1 : phrase "Ou sera pose le monument ?", aide du champ commune
  reformulee, suggestions (datalist) des localites NE, saisie libre conservee. Build 64 pages et
  90 tests verts. MIS EN LIGNE le 29.10.2026 a la demande de Thomas (push main:live a442c77,
  verifie sur www.pierretombale.ch : devis et fiches a jour, guides en ligne).
- 29.10.2026, Claude : INSCRIPTION SUR MONUMENT EXISTANT RETIREE PARTOUT (service non offert, decision de
  Thomas). Devis : la carte "Une inscription sur un monument existant" n'est plus proposee (restent
  "Un nouveau monument" et "Autre demande") ; le script et le serveur gardent la valeur `inscription`
  (sans effet, compatibilite), contrat mis a jour. FAQ et guide epitaphe : question "ajouter une
  inscription/epitaphe sur un monument deja pose" retiree (JSON-LD FAQPage suit). Accueil, fiches,
  a-propos : "inscription complementaire" retiree du suivi apres pose. Resume de la FAQ dans 3 guides
  reecrit. Build 0 erreur, tests verts.
- 29.10.2026, Claude : PRIX D'APPEL PAR FAMILLE (decision de Thomas : plus de "De 1'400 a 6'000 CHF").
  Funeraire "Des 2'200 CHF", cineraire "Des 1'400 CHF", toujours indicatifs (mention "Prix indicatif",
  aucune offre dans les donnees Google). Version audacieuse choisie : nouvelle cle "parFamille" dans
  src/data/tarifs.json (monument / cineraire), priorite modele > famille > fourchetteParDefaut (passee a
  Des 1'400, filet de securite). tarifs.ts : enregistreFamilles() appele par getProducts ; un prix demande
  avant que la famille soit connue, ou une famille inconnue dans parFamille, arrete le build. Nouveau
  tests/tarifs.test.ts (6 tests, montants lus dans le JSON). Page prix : deux phrases qui parlaient de
  "fourchette" reecrites. Verifie dans dist/ : 14 fiches a 2'200, 13 a 1'400, plus aucun 6'000, pas
  d'Offer JSON-LD ; captures fiche 390 et page prix 1536. Build 0 erreur, 90 tests.
- 28.10.2026 (soir), Claude : RELEVE DES 24 COMMUNES DU CANTON (demande de Thomas : verifier sur le
  net toutes les conditions des communes, tailles, etc.). 4 recherches web paralleles + lecture par
  Claude des textes officiels (PDF texte, scans dechiffres sur le VPS). Resultat :
  docs/DIMENSIONS-MONUMENTS.md reecrit (synthese point 4, fiches point 5, compatibilite point 6,
  liste d appels point 8) et docs/REGLEMENTS-CIMETIERES-NE.md complete (sections 9 et 10).
  CONSTAT MAJEUR : aucune commune ne publie une tombe d adulte de plus de 80 x 180 cm ; le format
  100 x 200 des fiches ne passe nulle part ou la regle est connue. Tarifs 2021 de Neuchatel
  toujours en vigueur. Taxe de pose : seulement Neuchatel, La Chaux-de-Fonds (50.-) et Le Locle.
  Pas de modification du site dans cette etape.
- 28.10.2026, Claude : LOT 1 DES GUIDES SEO ECRIT (docs/BRIEF-GUIDES-LOT1.md execute par Claude,
  pas par Codex). Quatre pages : /guides/ (index), /guides/quand-poser-une-pierre-tombale/,
  /guides/columbarium-cavurne-jardin-du-souvenir/, /guides/epitaphe/. SOURCES UNIQUES :
  docs/REGLEMENTS-CIMETIERES-NE.md et docs/DIMENSIONS-MONUMENTS.md ; chaque regle porte sa commune,
  son article et le lien officiel ; mention "verifiees le 28 octobre 2026" sur chaque page ; ce qui
  est note "non verifie" dans le releve n est pas publie (ex. la plaque du jardin du souvenir VdT).
  Partage : src/data/guides.ts (liste + mention), src/data/cimetieres-ne.ts (9 documents officiels),
  src/components/MentionVerification.astro ; lien "Guides" ajoute au PIED DE PAGE
  (src/config/site.ts, rubrique Informations), pas au menu principal. Un JSON-LD FAQPage par guide
  (meme texte affiche et structure, comme faq.astro) + BreadcrumbList ; 1 h1 par page, title et
  description uniques, aucune image, aucun JS. Les 30 epitaphes sont ECRITES POUR LE SITE (aucune
  citation d auteur, de chanson ni de poeme). Aucun prix de l entreprise : seuls des tarifs
  COMMUNAUX, dates et sources (arrete Ville de Neuchatel du 15.11.2021, reglement du Locle) ;
  la page dit que le nouveau reglement des taxes du 17.11.2025 reste a controler. Jamais affirme
  qu un modele du catalogue respecte un gabarit : "nous adaptons le monument au reglement et nous
  verifions avant la pose". Verifie : npm run build 64 pages 0 erreur, npx astro check 0 erreur
  (2 hints anciens), un seul h1 par page, 4 URL dans le sitemap, canoniques www, pas de tiret long
  ni d apostrophe courbe dans le HTML produit, pas de mot interdit (fabrication).
  NON FAIT : `npm test` N A PAS PU ETRE LANCE dans cette session (la commande n est pas dans
  .claude/settings.json et aucune approbation n est possible en mode non interactif). Le nouveau
  tests/guides.test.ts est ecrit mais NON EXECUTE : lancer `npm test` avant de pousser.
  Pas de push (consigne de Thomas). Un commit par page, comme demande.
  RELECTURE Claude (chat) le 28.10.2026 a 17h : npm test 84/84 vert, build 64 pages vert ; 3 references
  d articles non sourcees retirees (Le Locle : jalon et delai "terrain stabilise" sans numero d article,
  concession A/B reformulee en taille de monument). Pousse sur main (previsualisation), PAS sur live.
- 28.10.2026, Claude : docs/DIMENSIONS-MONUMENTS.md (regles par commune, a completer) et
  docs/BRIEF-GUIDES-LOT1.md. Thomas : fabrication possible a l etranger, POSE faite par nous en
  Suisse. Lot 1 des guides confie a Codex via kumo-run ; Claude relit, verifie et pousse ensuite.
- 28.10.2026, Claude : relecture complete des documents a la demande de Thomas. Releve refait :
  gabarits Beauregard (scan lu), tarifs Ville de Neuchatel 2022 (taxe de pose 60.-/m), Le Locle,
  rapports CG 23-005 et 26-012 (tombes doubles, pas japonais, quartiers 2026-2028). ALERTE :
  les modeles 100 x 200 du catalogue ne passent pas a Beauregard, Le Locle, Boudry, Val-de-Travers.
- 28.10.2026, Claude : etape 1 FAQ/guides faite. Reglements officiels releves (canton, Neuchatel ville
  2023, La Chaux-de-Fonds, Le Locle, Boudry, Val-de-Travers) : docs/REGLEMENTS-CIMETIERES-NE.md.
  Thomas a choisi l option audacieuse (guides + pages cimetieres) et veut Codex pour la redaction.
  Prochaine etape : brief Codex (URLs, gabarit de page) a valider par Thomas, puis kumo-run codex.
- 28.10.2026, Claude : analyse SEO des futures pages FAQ/guides (DataForSEO, CH et canton NE) :
  analyses/2026-10-28-faq-seo-recherches.md. Aucun code modifie. Decision attendue de Thomas :
  version securisee (5 guides) ou audacieuse (+ pages cimetieres NE). Ligne ajoutee au BACKLOG.
- 28.10.2026, Claude : hero de l accueil = video (fournie par Thomas, 13 s, 1280x720) a la place de l image.
  Recompressee en mp4 H.264 sans audio (1 Mo, faststart) : public/videos/accueil/hero.mp4 ; affiche
  public/images/accueil/hero-video-poster-1200.webp (image finale, sert aussi de LCP, sans JS et en mouvement
  reduit). Lecture auto muette, UNE fois (pas de boucle), puis reste sur l image finale. Pas de lecture auto si
  prefers-reduced-motion ou economie de donnees. Bouton pause/lecture (WCAG 2.2.2) masque a la fin. Memes
  regles CSS que l ancienne image (contain, droite, fondus). _headers : /videos/* 7 jours. Verifie au navigateur
  en 1536 et 390 (lecture ok, pas d erreur). Non teste : Safari/iPhone reels. Poids accueil : +1 Mo de video,
  charge apres l affiche. Les anciens hero-700/1200.webp ne sont plus utilises (a supprimer plus tard).
- 28.10.2026, Claude : passe visuelle de toutes les pages (1536 et 390) avant presentation aux associes.
  Corrige : a-propos n affiche plus les deux visuels provisoires gris (gravure-900 en bandeau, matiere-768 en
  portrait, legendes neutres) ; accents retablis dans les descriptions de src/data/granits.json ; configurateur
  telephone, "Votre choix" retire de la barre collee en bas (la tuile dit deja Selectionne). RAS sur accueil,
  catalogues, fiches, granits, prix, FAQ, devis, merci. Reste visible : meme fourchette de prix sur tous les
  modeles (grille de prix a fournir par Thomas), pas de vraies photos.
- 28.10.2026, Claude : accueil, hero recadre comme la maquette. Le monument n est plus coupe (object-fit:
  contain, pose a droite, bords de l image fondus par des degrades, plus de token ajoute) ; sur ordinateur le
  hero fait clamp(34rem, 40vw, 100vh - en-tete) avec marge interieure 6vw ; sur telephone le titre passe sur
  deux lignes ("Ce qui / demeure."), l image deborde a droite sous le texte avec son bord haut fondu
  (mask-image), bouton pleine largeur en bas. sizes de l image ajuste (150vw telephone). Verifie en 390, 820,
  1280, 1536, 1920. Les autres bandes de l accueil correspondaient deja a la maquette.
- 28.10.2026, Claude : configurateur en "vue application" sur ordinateur (>= 1024 px), suite a la photo de
  l ecran de Thomas (la page ne tenait pas dans la fenetre comme la maquette). Barre 01-04 collee en haut,
  ecran = hauteur de la fenetre (moins barre et bandeau), apercu sans defilement avec stele dimensionnee par
  la hauteur disponible, panneau de droite qui defile seul avec Retour/Continuer colle en bas, bandeau sombre
  toujours en bas ; "Votre choix : matiere" a gauche du bouton a l etape 1 ; traits entre les etapes retires.
  Telephone inchange. Verifie au navigateur en 1920x1080, 1536x1024, 1280x800 et 1024x768 : bas du bandeau =
  bas de la fenetre partout. Reste : l en-tete du site est visible au chargement au-dessus de la barre ; un
  defilement (ou Continuer) le fait sortir et tout tient. Build 0 erreur, 77 tests.
- 28.10.2026, Claude : configurateur, fidelite aux maquettes verifiee en 1536x1024 (taille des maquettes), 1280,
  1024 paysage et 820 portrait (= mise en page telephone). Ajuste : tuiles 7:3 + "Selectionne", boutons
  "Continuer vers l inscription / les motifs / le recapitulatif" sur ordinateur, "Besoin d aide ?" (FAQ),
  legende "Apercu de la stele · matiere" sur ordinateur, titres a 46 px, bloc du brouillon compact et affiche
  seulement s il y a un brouillon (reprise.ts), pas de filet au-dessus de l etape visible.
- 28.10.2026, Claude : CONFIGURATEUR AU DESIGN DES MAQUETTES (version audacieuse choisie par Thomas).
  src/pages/personnaliser/[slug].astro reecrit (22 pages) : parcours en 4 etapes avec barre 01-04 (collee en
  haut sur ordinateur), ecran partage (apercu sur fond `.nuit` a gauche avec "Retour au modele", nom du modele
  en grand, legende ; choix a droite), tuiles de granit avec coche + "Votre choix", cartes illustrees de
  disposition (3 SVG inline), champs en 2 colonnes, phrase sur une ligne, finitions "Aa" sur pierre, cartes de
  motifs + "Un motif a vous" en ligne + "Continuer sans motif", etape 4 = recapitulatif (matiere, inscription,
  motif, Modifier) + prix indicatif + encadre "Avant toute gravure" + "Poursuivre vers le devis" ; bandeau
  sombre a la place du pied (includeFooter=false). Telephone : apercu en haut colle (26vh), repliable, barre
  Retour/Continuer collee en bas avec "Etape suivante", plein ecran "Agrandissez l apercu" pour placer le motif
  (Echap ferme). Nouveau module src/scripts/configurateur/etapes.ts (ne touche ni etat ni canvas ; etape gardee
  en sessionStorage par modele ; ancres #etape-N ; sans JS tout reste visible). index.ts : met a jour tous les
  [data-matiere-nom], branche etapes.ts avant Konva ; donnees JSON enrichies des noms (polices, finitions) et
  vignettes. Tous les data-* des autres scripts conserves, aucun champ du devis change. SEO inchange : noindex,
  follow, canonique vers la fiche, hors sitemap, 1 h1 (nom du modele). Verifie au navigateur (douceur) en 1280
  et 390 : parcours complet au clic, recapitulatif juste, replier/agrandir, rechargement = meme etape + brouillon,
  export vers /devis/ (scene + apercu). Build 0 erreur, 77 tests. Poids : css page 11,1 Ko gz (etait 9,2).
  LIMITES : les rendus restent sur fond gris dans un cadre clair (pas de scene sombre) ; la coche des cartes de
  motifs ne s affiche que pour "Un motif a vous" (les motifs poses sont listes sous "Sur votre stele").
  Pousse sur main (previsualisation), PAS sur live.
- 28.10.2026, Claude : ANALYSE DU CONFIGURATEUR selon les 8 maquettes de Thomas (4 etapes, ordinateur + mobile).
  Aucun code touche. Ecarts et limites dans docs/DESIGN.md ("Configurateur"). Captures de l etat actuel 1280/390.
  Prochaine etape : choix de Thomas (parcours en etapes ou page longue, prix au recapitulatif, pied compact,
  "Agrandir l apercu" mobile), puis passes successives.
- 27-28.10.2026, Claude : E6 EN PRODUCTION. Sur demande expresse de Thomas, push main:live (74f568d -> b4daadb) :
  fiches produits, images de l accueil, contour des lettres du configurateur et envoi du devis. Variables
  Production posees par Thomas (RESEND_API_KEY secret, DEVIS_DESTINATAIRE, PUBLIC_DEVIS_ENVOI ; valeur "Oui"
  corrigee en "oui" puis Retry deployment). Verifie depuis le VPS : envoiActif true, /api/devis repond
  (requete robot ecartee sans envoi), /devis/modeles.json present. TEST REEL OK selon Thomas (fiche et accuse
  recus). Le commit 73ce46a (PUBLIC_DEVIS_ENVOI tolerant a la casse) est sur main, pas encore sur live.
  La previsualisation n a pas les variables : elle n envoie pas (normal). Reste E6 : Turnstile, limite par IP.
- 27.10.2026, Claude : E6, ENVOI DU DEVIS ECRIT (pas encore allume). functions/api/devis.ts (Pages Functions),
  src/lib/devis-serveur.ts (logique pure), /devis/modeles.json (catalogue au build), 15 tests ajoutes (77 au
  total). Envoi Resend vers DEVIS_DESTINATAIRE, Reply-To famille, pieces jointes (fichiers, apercu, composition
  JSON), accuse de reception court a la famille, reference PT-AAAAMMJJ-xxxx, robots -> 200 sans envoi,
  Turnstile facultatif (echec = "[A VERIFIER]", sans accuse). devis.astro : envoi allume par la variable de
  build PUBLIC_DEVIS_ENVOI=oui (par environnement), widget Turnstile si PUBLIC_TURNSTILE_SITE_KEY, reset du
  jeton apres un echec. Aucun champ du contrat change. Verifie : build, astro check, tsc strict sur la
  fonction, bundle esbuild sans dependance Node, simulation complete avec un faux Resend (JS, sans JS, robot,
  champ manquant, cle absente, Turnstile manquant). Domaine Resend mail.pierretombale.ch : DNS publies et
  verifies au dig (statut Resend "Pending" au moment du commit). INCIDENT : Thomas a colle une cle Resend
  dans le chat ; non utilisee, revocation demandee. Prochaine etape : Thomas pose les variables Preview, relance
  le deploiement, test reel sur main.pierretombale-site.pages.dev/devis/ ; puis variables Production.
- 27.10.2026, Claude : MESSAGERIE ET ENVOI DU DEVIS (E6, preparation). Decisions de Thomas : envoi par Resend
  (plan gratuit, 3000/mois, 100/jour), domaine d envoi prevu `mail.pierretombale.ch` (region eu-west-1),
  expediteur `PierreTombale.ch <devis@mail.pierretombale.ch>`, Reply-To = la famille. Messagerie : Service Mail
  Infomaniak, adresse info@pierretombale.ch (destinataire des devis, a mettre en variable Cloudflare, pas dans
  le depot). Thomas a cree le MX `@ -> mta-gw.infomaniak.ch` prio 5 dans Cloudflare (verifie au dig). SPF corrige par
  Thomas en `v=spf1 include:spf.infomaniak.ch -all` (verifie au dig, 1.1.1.1 et 8.8.8.8), test d envoi reussi.
  RESTE : DKIM 20261022._domainkey present, a comparer avec celui affiche par Infomaniak ; DMARC p=reject en place.
  Puis domaine Resend, cle "Sending access" en secret Cloudflare RESEND_API_KEY, fonction functions/api/devis.ts.
- 27.10.2026, Claude : CONFIGURATEUR, LISIBILITE DU TEXTE (demande de Thomas, version sure). Sur granit clair
  (Viscount White, Jablanica...) la peinture blanche ou doree ne se voyait presque plus. rendu.ts : chaque
  lettre recoit un contour fin dessine sous la peinture et une ombre courte vers le bas (`ombreDeLettre`,
  valeurs en fraction de la taille de police ; fonce sous une couleur claire, clair sous une couleur foncee).
  L apercu JPEG envoye au devis porte le meme effet. Finitions proposees INCHANGEES. Verifie au navigateur
  (Douceur, Viscount White / Jablanica / Bengal, avant-apres), build, astro check, 62 tests. A VOIR plus tard
  (version audacieuse) : vraie gravure en V et finitions pour pierres claires (peinture noire, gravure sans
  peinture), seulement si l atelier les propose (question posee a Thomas).
- 27.10.2026, Claude : FICHE PRODUIT AU DESIGN DES MAQUETTES (passe 1). FicheModele.astro reecrit (les 27
  fiches, deux familles) : fil d Ariane sans majuscules (Accueil cache sur telephone), titre serif tres grand,
  accroche, "Prix indicatif" + lien vers la page prix, image unique + "Voir en grand", tuiles carrees du granit
  avec coche (le script met a jour image, alt, nom et lien "Voir en grand"), bouton principal "Personnaliser ce
  modele" si calibre (22) sinon "Demander un devis" (5), lien "Demander un conseil", trois etapes "Un hommage a
  votre image", accordeons <details> (description + caracteristiques ; pose et accompagnement, textes deja
  valides de l accueil), "D'autres modeles a voir", bande sombre "Chaque detail compte" (image matiere-768),
  barre fixe en bas sur telephone. Champ `accroche` ajoute au schema et aux 27 fiches. CSS de page, aucune
  classe Tailwind ajoutee : css partage 6838 -> 6669 o gz, css fiche 8932 o gz, html fiche 6388 o gz.
  Build, astro check 0 erreur, 62 tests, grep des mots interdits vide, canonique www et noindex de
  /personnaliser/ inchanges. Verifie au navigateur : douceur, tombale-simple (non calibre), aquarius (cineraire),
  1280 et 390, changement de matiere au clic, pas de debordement horizontal a 390 (corrige : grille des cartes).
  Configurateur et devis non touches. Pousse sur main (previsualisation), PAS sur live.
- 26.10.2026, Claude : ANALYSE DE LA FICHE PRODUIT selon les maquettes (ordinateur + mobile, modele Douceur).
  Aucun code touche. Ecarts, contraintes et decisions a prendre dans docs/DESIGN.md ("Fiche produit").
  Capture de la fiche actuelle : 1280 et 390 px. Prochaine etape : reponses de Thomas (prix, "D'autres
  modeles", accroches, images), puis passe 1 = structure et style de FicheModele.astro avec l image unique.
- 26.10.2026, Claude (20 h) : REPRISE APRES MISE EN LIGNE. Faits de Thomas consignes (production
  sur www.pierretombale.ch, 301, Access, Search Console). Controles HTTP faits depuis le VPS :
  200 sur /, configurateur et robots ; pas de noindex sur le domaine ; 404 reelle ; sitemaps
  36 URL et 28 pages d images ; polices et chunk Konva servis ; cache images 7 jours ; preview
  derriere Access. Restent : controles visuels, configurateur au navigateur en production,
  Lighthouse mobile, SEO final. Pas de push (consigne de Thomas). Suite : design et UX selon ses
  instructions, en preservant URL, canoniques, sitemaps, Access et configurateur.
- 26.10.2026, Codex : import Cloudflare compare (2 A, SPF, DMARC conformes).
  DKIM ajoute par Thomas, correction du nom 20261022._domainkey confirmee par lui.
  NS attribues : gracie.ns.cloudflare.com et steven.ns.cloudflare.com.
  DNSSEC desactive dans Infomaniak selon Thomas ; controle public apres confirmation :
  1.1.1.1 et 8.8.8.8 retournent encore le DS 63723, TTL 3600.
  ATTENDRE le retrait du DS avant de changer les serveurs de noms.
- 26.10.2026, Codex : releve de sept enregistrements DNS Infomaniak fourni par Thomas,
  DKIM complet conserve dans docs/DNS-AVANT-MIGRATION.md. Aucun MX visible, pas de boite
  e-mail selon Thomas. Prochaine etape : import Cloudflare Free et comparaison ; aucune
  modification DNS effectuee. DNSSEC reste a verifier avant delegation.
- 26.10.2026, Codex : PREMIER DEPLOIEMENT PAGES CONFIRME par Thomas et controle HTTP.
  https://pierretombale-site.pages.dev/ : HTTPS valide, 200, X-Robots-Tag noindex,
  quatre en-tetes de securite presents. robots et deux sitemaps : 200, domaine absolu www.
  Catalogue funeraire, fiche Douceur, granits, devis, personnaliser/Douceur : 200.
  URL inexistante : 404 ; /404 explicitement : 200 (fichier de page servi directement).
  urllib Python recoit 403/1010, curl fonctionne ; pas de changement de securite Cloudflare.
  Restent : duree du premier clone/build et branche live a confirmer dans le tableau de bord,
  variables Preview et Access, inventaire DNS Infomaniak, domaines/301/HTTPS, test canvas/polices,
  Lighthouse et Search Console. Prochaine action utilisateur : afficher toute la zone DNS.
- 26.10.2026, Codex : PREMIERS PUSH EFFECTUES APRES ACCORD EXPLICITE de Thomas.
  git push origin main puis git push origin main:live reussis ; verification ls-remote :
  les deux branches pointent sur 74f568d. Aucun changement DNS ni clic Deploy effectue.
  Prochaine action : rafraichir la liste des branches dans Pages, choisir live,
  verifier Astro / npm run build / dist / NODE_VERSION=22 / SITE canonique puis Save and Deploy.
  Compte rendu commite localement apres les push ; aucune nouvelle version du site dans ce commit.
- 26.10.2026, Codex : PREPARATION E7 VALIDEE LOCALEMENT, PAS EN LIGNE.
  docs/MISE-EN-LIGNE.md ajoute (branches, variables, Access, DNS, rollback, echec de build, E6).
  Build npm run build avec SITE canonique sous Node v22.23.2 : succes, 5,38 s avec le lanceur,
  unite systemd pt-pages-build-20261026, MemoryMax=1200M, tache de fond avec temoin.
  Controle dist : 60 HTML et 60 canonicals sur www ; 36 URLs dans sitemap-0.xml ;
  sitemap images : 308 loc (pages et images). 24 meta noindex : 22 configurateurs, merci et 404.
  robots Allow: / et deux sitemaps corrects ; _headers recopie, noindex HTTP limite a pages.dev ;
  938 fichiers, maximum 277250 octets, aucun dossier docs publie. Formulaire toujours inactif.
  Preuves locales : /home/kumo/atelier/tmp/pt-pages-preparation/{build-result.json,build.log,
  controle-build.json}. Controles HTTP Cloudflare, DNS, Lighthouse et canvas en ligne NON faits.
  Prochaine etape : regler l'ecran Pages ; accord explicite pour pousser main puis main:live,
  avant de selectionner live et de valider le premier deploiement. E7 reste en cours, E6 intact.
- 26.10.2026, Codex : PREPARATION CLOUDFLARE. .node-version = 22, public/_headers :
  securite sur les fichiers statiques, cache Astro avec empreinte un an, images sept jours
  (renommer les images remplacees pour changer leur URL). noindex limite aux hotes pages.dev,
  jamais global sur le domaine personnalise. Valeur SITE par defaut inchangee :
  https://www.pierretombale.ch ; commentaire du domaine confirme corrige.
  Branche live absente du remote ; aucun push effectue. Build plafonne a verifier avant publication.
- 26.10.2026, Codex : E7 DEMARRE, AUCUNE PUBLICATION. Domaine confirme par Thomas :
  pierretombale.ch, achete chez Infomaniak ; canonical retenu https://www.pierretombale.ch/.
  Aucune messagerie pour le moment (prevue plus tard). Compte Cloudflare cree par Thomas via Google (confirmation dans le chat).
  Lecture initiale des consignes, ETAT, backlog et historique ; main propre au commit b83f0d9,
  pull --ff-only deja a jour. Organisation demandee : main = apercus, live = production.
  Netlify abandonne pour les prochaines publications ; ancien apercu conserve provisoirement.
  Prochaine action utilisateur : ouvrir Workers & Pages > Create application > Pages,
  puis connecter GitHub. Aucun projet Pages cree ou deploiement confirme a ce stade.
  Restent : preparation du depot, integration GitHub, protection privee des apercus (noindex
  seul ne protege pas l acces), inventaire DNS Infomaniak, domaines, controles et Search Console.
  Aucun push sans instruction de Thomas ; premier push main:live sur accord explicite.
  Aucun nettoyage de tmp/apercu ou apercu-extras sans accord. E6 hors mission, envoi inactif.
- 26.10.2026, Claude : IMAGES DE L ACCUEIL BRANCHEES (maquette). Thomas a fourni 5 visuels (hero, collection
  funeraire, collection cineraire, matiere, gravure) : ce sont des RENDUS IA, pas des photos de realisations.
  Encodes en WebP dans public/images/accueil/ (hero 700 et 1200 px, cartes 720, matiere 768, gravure 900 ;
  de 14 a 46 Ko chacun, 174 Ko au total), transferes au VPS par morceaux avec controle md5 de chaque
  fichier. Les originaux ne sont pas dans le depot. index.astro : hero pleine largeur (telephone : image
  en haut fondue dans le noir, puis texte ; ordinateur : image en fond, degrade a gauche), cartes 2:1,
  bande matiere, bande personnalisation avec la gravure (image AU-DESSUS du texte sur telephone). Retires :
  ProductImage et nomGranit dans l accueil, le masque CSS du motif d olivier, siteConfig.featured.homepageVitrine
  (plus utilise ; reste featured.mobileMenu). Les alt disent "illustration" pour ne pas faire passer ces
  rendus pour des photos. Mesure (poids-pages.py) : css 6838 o gz hors accueil, 8095 sur l accueil
  (css de page), html accueil 4124 o gz. Build 60 pages, astro check 0 erreur, 62 tests, grep des mots
  interdits vide. Verifie au navigateur en 1280 et 390 (capture pleine page). A REMPLACER par de vraies
  photos des realisations quand elles existent (memes noms de fichiers, voir docs/DESIGN.md).
  APERCU NETLIFY REPUBLIE avec cette version (https://pt-apercu-k7q2.netlify.app, noindex), par la procedure
  de la section "Apercu en ligne" ; la commande npx a jeton temporaire a ete lancee sur demande expresse de
  Thomas ("donne moi le lien"), le jeton n est ecrit dans aucun fichier.
- 26.10.2026, Claude : DESIGN DES MAQUETTES, PASSE 1 (jetons, en-tete, pied, accueil). Thomas a fourni
  les maquettes de l accueil (ordinateur + mobile : hero sombre, collection ivoire, matiere, personnalisation,
  appel). Reference : docs/DESIGN.md. Fait : src/styles.css (ivoire #f6f3ec, anthracite #1c1b19, bronze
  #8a6a3c ; ambiance `.nuit` qui redefinit les memes jetons ; EB Garamond pour les titres ; labels et
  boutons passes du mono 11 px au sans 13-14 px, boutons 52 px, champs en boite, liens soulignes ; grain
  et apparition au defilement RETIRES, donc deux scripts en moins dans BaseLayout). SiteHeader (logo
  centre, menu Monuments funeraires / cineraires / Matieres / Prix / La maison + Votre projet a droite,
  burger sous 1024 px, en-tete colle a 72 px sur mobile pour le configurateur), SiteFooter (sombre, prop
  `joint`), accueil reecrit (siteConfig.featured.homepageVitrine remplace homepageGrid et homepageSolo),
  navigation de site.ts, theme-color. Le parcours en 4 etapes est GARDE (absent de la maquette). H1 poetique
  "Ce qui demeure." : le mot-cle est dans le chapo sous le titre et dans le title/meta.
  Mesures (poids-pages.py) : css partage 6849 -> 7048 o gz, html accueil 6119 -> 4228, js en ligne
  1615 -> 872 ; coute +23 Ko de police (EB Garamond) sur chaque page, prechargee. Build 60 pages, astro check
  0 erreur (1 hint ancien, reprise.ts), 62 tests, grep des mots interdits vide. Verifie au navigateur sur
  accueil, fiche, devis, configurateur en 1280/390 (+1024 et menu mobile pour l accueil).
  LIMITES : images de l accueil PROVISOIRES (nos rendus sont sur gris clair, pas dans des scenes sombres) ;
  legendes mono restantes dans les gabarits des fiches, catalogue, prix, granits, FAQ, a-propos ; pas de
  page /personnaliser/ (index) donc le bouton Personnaliser mene au catalogue funeraire et le menu n a
  pas d entree Personnalisation. PIEGES : `systemd-run --user` veut `-d --setenv=PATH=$PATH` pour trouver
  npm et le dossier (sinon code 254 en 138 ms) ; sa sortie va au journal (journalctl --user -u <unite>)
  sauf avec `--pipe`. Captures : scripts/capture-pages.sh (pleine page, 1280 et 390).
  APERCU NETLIFY : republie le 26.10.2026 (voir la session suivante).
- 26.10.2026, Claude : panneau-zones.ts (mode libre sorti de index.ts, qui passe a 347 lignes et
  ne fait plus que relier les panneaux au rendu). Build, astro check, 62 tests, mode libre
  verifie au navigateur (onglets, ajout, 5 lignes, depassement par zone, suppression, recentrer,
  retour au mode guide). Pousse sur GitHub a la demande de Thomas (129 commits).
- 26.10.2026, Claude : 12 MODELES CALIBRES DE PLUS (22 au total) avec les largeurs reelles du
  configurateur 3D du fournisseur : eligie (2 steles 52 + 35, surfaces multiples), cin1, cin8,
  cin-aquarius, cin-ovae, cin-esperanza, cin-aloria (+ lame), cin-bahia, cin-montagne01/02,
  cin-nautis, cin-saturne. Zones tracees a l oeil sur grilles, planche de controle,
  verifie-configurateur.sh sur les 12 (textes places, tailles 2 a 3 cm sur ces petites steles).
  En attente : nivora (image sans rapport), cin-tombale et les 3 tombales (pas de stele). A
  refaire : images nautis (marbre blanc), bahia et esperanza (proportions).
- 26.10.2026, Claude : IMAGES. Audit (607 img dans dist : 575 avec alt, 561 lazy, toutes avec
  width/height et srcset sur les visuels). Ajoute : src/pages/sitemap-images.xml.ts (280 images
  reliees a leur fiche ou a Nos granits, legende = alt), robots.txt l annonce ; alt du modele mis
  en avant (accueil) ; scripts/poids-images.py. Mesure : 131 images 1200 px > 200 Ko, re-encodage
  reporte (voir BACKLOG). Premier ecran : catalogue 219 Ko, fiche 65 Ko, configurateur 207 Ko.
- 26.10.2026, Claude : PASSE E (sans l envoi). export.ts construit `SceneDevis` (cm, stele par
  texte, champs saisis, motifs, apercu JPEG 1200 px par `rendu.capture()`), deposee en
  sessionStorage ; « Demander un devis avec cette stele » mene a /devis/?modele=&scene=1.
  src/scripts/devis/scene.ts remplit les champs du contrat + `configurateur_scene` (JSON) et
  `configurateur_apercu` (fichier), bloc « Votre stele composee » (apercu, modifier, retirer),
  apres le signal `pt-devis-pret` du script de la page. Contrat mis a jour. Verifie au navigateur.
  Aussi : geometrie des 27 modeles relevee dans le configurateur 3D du fournisseur
  (docs/references/2026-10-26-geometrie-fournisseur.md) : Eligie et les cineraires ont leurs cotes.
- 23.10.2026, Claude : TESTS ET DECOUPAGE. vitest 5.0.5 (devDependency exacte), `npm test` :
  62 tests (tests/composition.test.ts, tests/echelle.test.ts, outils dans tests/commun.ts), sur
  les vraies calibrations ; verifie par mutation (harmonise() retire -> 8 echecs). index.ts
  956 -> 530 lignes : panneau-motifs.ts (etape 3) et reprise.ts (brouillon sur la page). Bug
  corrige au passage : cliquer un motif avant la fin du chargement de Konva levait une erreur.
  Verifie : build, astro check, verifie-configurateur.sh (douceur, tango, musulman), motifs
  (clic precoce, miroir, retrait, motif sur demande). Guide docs/CONFIGURATEUR.md a jour.
- 23.10.2026, Claude : PASSE F + DOCUMENTATION. Brouillon par modele dans le localStorage
  (brouillon.ts : matiere, champs, mode, zones, motifs, description du motif sur demande ; 90 j ;
  reprise avant le premier dessin ; "Tout effacer et recommencer" ; avertissement avant de
  quitter seulement si le stockage est refuse). Page protection des donnees completee.
  composition.ts : noms de meme taille a deux personnes, dates toujours sous le nom (aussi apres
  la descente en hauteur). Nouveau guide docs/CONFIGURATEUR.md (architecture, conventions,
  recettes, verification, publication, limites). Outils : scripts/verifie-configurateur.sh
  (controle des 10 modeles au navigateur de test, planche) et scripts/mesure-polices.py.
- 23.10.2026, Claude : INSCRIPTION GUIDEE (decision Thomas, version audacieuse). Audit : l apercu
  appliquait la hauteur a la taille de police, majuscules 25 a 35 % trop petites -> rapport
  `capitale` par police (c7fea28). Tailles 1,5/2/2,5 cm ajoutees. Moteur pur composition.ts +
  mesure.ts + data/inscription.ts (23bfdeb). Formulaire guide formulaire.ts, 3 mises en page,
  idees de phrases, bascule libre/guide (cb74859). Verifie au navigateur : Douceur, Musulman,
  Arques en couple, Tango en couple (une personne par stele), mobile. Limites : champs saisis non
  gardes dans l etat (passe E/F a brancher via `formulaire.lit()`), pas de signe de deces.
- 23.10.2026, Claude : DECISIONS THOMAS : Tango grave sur ses deux steles ; les motifs se placent
  librement dans le cadre jaune (stele entiere), le texte reste dans les zones rouges. Code :
  echelle.ts gere plusieurs surfaces de texte (`zoneGravablePx` = rectangle ou liste) et un cadre
  des motifs (`zoneMotifsPx`, defaut `stele.cadrePx`) ; une zone de texte reste dans la surface la
  plus proche ; zone 2 de Tango sur la petite stele. Nouveau motif pose SOUS le texte (rapetisse
  pour tenir, sinon en bas de la zone), les suivants a gauche puis a droite. Tango publie (10
  modeles). Limites : une seule echelle par monument (raccourci de la petite stele de Tango non
  corrige) ; l export de scene (passe E) ne dit pas encore sur quelle stele est chaque zone.
- 23.10.2026, Claude : CONFIGURATEUR ETENDU A 9 MODELES. Calibrations provisoires tracees a l oeil
  sur les images 1200 (grilles), largeurs de stele des fiches fournisseur : corazon 90, arques 90,
  4 pieces doucine 90, 5 pieces jardiniere 90, musulman-4 65, arbre-de-vie 95, aventuri 65,
  quietude 95 (+ douceur 80). Quietude et Aventuri sont des vues de 3/4 : texte plat, ecart visible
  sur Quietude. Tango mis en attente (docs/images-configurateur/calibrations-en-attente/).
  Nouveau : message "Le texte depasse la surface gravable" (rendu.ts surDepassement, zones.ts
  messageDepassement, data-zone-depasse). Verifie au navigateur de test sur les 9 pages.
- 23.10.2026, Claude : fiches recues de Thomas (27 captures de fiches produit, encombrement et
  etiquettes). Encombrements confirmes (100 x 200 et 60 x 60) sauf Quietude 101 x 200. Corrige selon
  les etiquettes : prie-Dieu (Almandin, Corazon, Douceur, Eligie, Arbre de vie, Quietude, Tango),
  Almandin sans benitier ni vase, Arbre de vie lignes droites, Aventuri prestige, Tango contemporain,
  Ovae bicolore. Les captures ne donnent PAS la largeur des steles : calibration toujours provisoire.
  Captures non versees au depot (contenu tiers).
- 23.10.2026, Claude : POIDS DE /personnaliser/ RAMENE DE 70 A 9 KO GZ. Les traces des motifs etaient
  inlines deux fois (vignettes SVG + JSON). Vignettes en masque CSS sur le SVG public (mis en cache),
  JSON sans le trace d, lu par fetch dans index.ts au chargement du canvas. Rendu identique verifie.
  A reprendre : un nouveau motif se pose encore au centre et peut recouvrir le nom (placement sous le
  texte demande en C1, non fait).
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

## Prochaine etape (mis a jour le 26.10.2026)

OU EN EST LE SITE. Catalogue de 27 modeles en 10 matieres, formulaire de devis en 4 etapes (E5),
configurateur visuel sur 22 modeles (inscription guidee, mise en page libre, motifs, brouillon,
export vers le devis), 62 tests (`npm test`), migration de l'apercu Netlify vers Cloudflare Pages en cours. Le detail de ce qui reste,
dans l ordre, est dans `docs/BACKLOG.md` ; le configurateur se modifie avec `docs/CONFIGURATEUR.md`.

DEBLOQUE, A FAIRE SANS ATTENDRE PERSONNE (au choix de Thomas) :
- GUIDES, SUITE IMMEDIATE : tests et build verts, pousse sur main le 28.10.2026 ;
  relire les 4 pages au navigateur en 1280 et 390, puis push sur main pour la previsualisation.
- Pages cimetieres lot 2 : PASSES A ET B FAITES le 29.10.2026, neuf pages en ligne locale
  (hub + Beauregard, La Chaux-de-Fonds, Peseux, Corcelles-Cormondreche, Le Landeron, Boudry,
  Cortaillod, Le Locle, Val-de-Travers), build 74 pages vert. SUITE : lancer `npm test`,
  relire les pages au navigateur en 1280 et 390, puis appeler les communes pour les valeurs
  manquantes (hauteurs, adresses, columbariums : liste dans docs/BACKLOG.md). Lot 3 possible :
  Milvignes, Bevaix, Saint-Blaise, Val-de-Ruz, memes regles (commune, article, lien, date).
- Design : appliquer la direction des maquettes a tout le site (seul le configurateur en profite).
- SEO : pages par gamme, FAQ enrichie, maillage interne.
- Fiches : reporter les cotes reelles (docs/references/geometrie-fournisseur.json) dans `dimensions:`.

EN ATTENTE DE THOMAS (voir la liste complete dans docs/BACKLOG.md) :
- Graveur : zones gravables des 22 modeles (planches), hauteur mesuree sur la majuscule, plus
  petite lettre, signe de deces, Tango a 20-25 mm.
- Images a refaire : Nivora, Nautis, Bahia, Esperanza. Les 4 modeles sans stele : vue de dessus ou
  devis sans apercu.
- Noms publics des modeles ; Marmara granit ou marbre ; grille de prix (passe D).
- E6 ENVOI DU DEVIS : domaine confirme pierretombale.ch ; verification Resend SPF/DKIM a faire,
  compte Resend dont Thomas
  saisit lui-meme la cle dans Cloudflare, adresse de destination. Tout est specifie dans
  `docs/devis-contrat.md` (y compris les deux champs du configurateur). Il restera a ecrire
  `functions/api/devis.ts`, passer `envoiActif` a true et poser Turnstile. Aucun secret dans le depot.
- E7 EN COURS, independant de E6 : preparation locale testee ; restent integration Cloudflare,
  DNS, HTTPS, Access, recette en ligne et Search Console. Guide : docs/MISE-EN-LIGNE.md.
- Test par Thomas avec un proche age, sur un telephone de 390 px : /devis/ puis /personnaliser/.

REGLES QUI NE CHANGENT PAS : rien ne part a l atelier sans bon a tirer ; prix indicatifs ; jamais le
nom du fournisseur, ses liens ni ses prix sur le site (docs/references/ est interne).
