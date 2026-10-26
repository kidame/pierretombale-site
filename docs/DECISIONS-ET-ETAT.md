# Décisions et état du projet PierreTombale.ch

## Hebergement et domaine (Thomas, 26.10.2026)
- pierretombale.ch est achete chez Infomaniak ; canonical https://www.pierretombale.ch.
- Pas de messagerie pour le moment ; ajout prevu plus tard. Inventorier tous les DNS avant bascule.
- Cloudflare Pages Free via application GitHub. main = apercus prives, live = production.
- Netlify abandonne. E7 avance independamment de E6, le formulaire reste inactif.
- Premier push live sur accord explicite ; aucun push sans instruction pendant cette mission.
- Details operatoires : docs/MISE-EN-LIGNE.md. Ces decisions remplacent les mentions anciennes
  de domaine non reserve et de calendrier dans ce document.


## Precision visuelle du configurateur (Thomas, 14.10.2026)
- Motifs de gravure : SVG sans fond, egalement dans les apercus de selection.
- Aucun medaillon. Cette decision prime sur les exemples visuels generes.
- Maquettes originales : `docs/maquettes/configurateur/2026-10-14/README.md`.
  Les PNG ne sont pas encore corriges ; accessoires toujours hors v1.
  Cette livraison ne change ni le runtime ni les autres arbitrages ouverts.

Mis à jour le 13.10.2026. Ce fichier complète la spec. En cas de contradiction, surtout sur le calendrier, c'est lui qui fait foi.

## Ce que les associés ont décidé ou confirmé
- Projet commun à trois associés. Thomas construit le site et s'occupe du référencement sans facturer. Les bénéfices se partagent en trois parts égales.
- Le projet a reçu le feu vert d'Alnes. Le troisième associé (Kushtrim) n'a pas été confirmé dans nos échanges : à acter.
- Le marbrier de Couvet (Terziani) part à la retraite, confirmé par Thomas.
- La production peut fournir la gamme cinéraire (urnes, plaques, columbarium) sans difficulté, retour des associés.
- Le site démarre en français. L'allemand est une phase 2, non décidée.
- Les prix ne sont pas fixés. Ils dépendent du coût de production, que les associés chiffrent avec l'atelier du Kosovo, qui produit et grave.

## Choix techniques retenus (le détail est dans la spec)
- Pas de Shopify ni de paiement en ligne en v1. Le site prend des demandes de commande et un humain rappelle, comme les leaders français.
- Configurateur 2D maison avec aperçu en direct, et un dossier de fabrication pour l'atelier : image, plan vectoriel à l'échelle en millimètres, fiche de commande.
- Rien ne part en gravure sans bon à tirer validé par la famille.

## Ce qui manque encore au 13.10.2026
- Nom définitif. Nom de travail : PierreTombale.ch.
- Siège, NPA et téléphone de l'entreprise.
- Grille de prix.
- Photos des granits, de l'atelier et des réalisations.
- Polices que l'atelier sait graver, finitions (blanc, doré, feuille d'or), dimensions des modèles, motifs gravables.

## Points à trancher par les associés
- **Affichage des prix.** Alnes craint que le producteur augmente ses tarifs en voyant les prix publics, et propose des fourchettes. Recommandation : afficher « dès X CHF, tout compris » par modèle, faire signer avec le producteur une grille valable 12 à 24 mois avec une règle d'augmentation, et garder le devis d'une deuxième source. Des fourchettes larges feraient perdre l'avantage sur les concurrents romands, qui n'affichent aujourd'hui que des fourchettes ou rien.
- **Nom de domaine.** Vérifiés libres au registre le 13.10.2026, donc aucun n'est réservé : pierretombale.ch, pierre-tombale.ch, pierres-tombales.ch, pierrestombales.ch, lapierretombale.ch, tombale.ch, pierre-tombale-suisse.ch, grabsteine-schweiz.ch, grabstein-preis.ch. À réserver dès que le nom est confirmé : pierretombale.ch et pierre-tombale.ch chez Infomaniak, environ 12 CHF par an chacun.

## Calendrier : correction du 13.10.2026
La spec et le dossier des associés visent une mise en ligne avant la Toussaint. C'est dépassé. Un site neuf met des semaines à des mois pour monter dans Google : même en ligne fin octobre, il ne profiterait pas du pic d'octobre. Recommandation : viser le pic de mars 2027, environ 390 recherches par mois sur « pierre tombale », avec une mise en ligne en décembre ou janvier au plus tard. La fiche Google de l'entreprise peut être créée dès que le siège et le téléphone sont connus.

Le dossier des associés (`analyses/2026-08-17-dossier-opportunite-pierretombale.html`) contient encore l'ancien calendrier aux points 7 et 8.

## Reponses des associes sur la gamme (13.10.2026, via Thomas)
- Les 27 captures Maffre (`docs/references/2026-10-13-captures-maffre-produits.md`) servent a la fois de gamme cible et d inspiration.
- L atelier du Kosovo sait tout produire, formes sculptees comprises.
- Granits : tous ceux des captures. Thomas fournira la liste definitive plus tard : la liste doit vivre dans un seul fichier facile a corriger (`src/data/granits.json`).
- Pas de piste revendeur Maffre. Modele : service complet (conseil, commande, pose, apres-vente) ; seules la fabrication et la gravure sont sous-traitees a l atelier.
- Consequence : ni images ni noms Maffre sur le site. Nos modeles portent des noms descriptifs a nous ; visuels provisoires en attendant photos ou rendus de l atelier.
- Adresses retenues (plan SEO) : /monuments-funeraires/<modele> et /monuments-cineraires-cavurnes/<modele>.
- Prix provisoire affiche : fourchette 1'400 - 6'000 CHF pour tous les modeles (decision de Thomas, 13.10.2026), a remplacer par modele dans `src/data/tarifs.json`.

## Regles de communication du site (Thomas, 13.10.2026)
- La pose est faite par l entreprise elle-meme.
- Ne JAMAIS mentionner sur le site la sous-traitance, l atelier de fabrication ni le Kosovo.
- Ne jamais pretendre non plus le contraire : pas de "notre atelier", pas de "fabrique en Suisse",
  "Swiss made" ou "artisan local" (fausse origine suisse = interdite, Swissness et LCD). On parle de
  "nos monuments", "realises sur mesure", "nous posons".
- Zone d intervention, par ordre : Val-de-Travers, canton de Neuchatel, Suisse romande au mieux.
- Aucun chiffre, temoignage, annee d experience ou statistique sans source verifiable.

## Prix et personnalisation (Thomas, 13.10.2026)
- Les prix affiches sont des ESTIMATIONS, pour convenir a tous les budgets ; ils seront revus plus tard.
- L estimation couvre : matiere (granit), gravure, pose, et la personnalisation.
- Personnalisation possible au-dela du catalogue : la famille peut fournir son propre dessin a faire graver.
- Taxes et autorisations communales de cimetiere : non tranche. Ecrire "les eventuelles taxes communales
  ne sont pas comprises" en attendant confirmation.

## Envoi des demandes de devis (Thomas, 13.10.2026)
- PAS de n8n : le formulaire doit etre autonome (independant du VPS).
- Option retenue (securisee) : fonction Cloudflare Pages /api/devis + Resend, mail vers une adresse
  choisie par les associes et definie en variable d environnement (jamais dans le depot), accuse de
  reception a la famille, Cloudflare Turnstile. Contrat des champs : docs/devis-contrat.md.
- Prerequis : nom de domaine achete et DNS verifie chez Resend (SPF/DKIM), compte Resend dont Thomas
  saisit lui-meme la cle dans Cloudflare. Remplace le pipeline n8n de la spec (section 5).

## Personnalisation et configurateur (Thomas, 13.10.2026)
- Etude des concurrents le 13.10.2026 : les fabricants FR (GPG Granit, Granits Maffre) ont un configurateur 3D
  qui sert a capter et structurer des demandes pour leurs reseaux de marbriers (vente conclue en agence, pas de
  prix en direct chez GPG) ; France Tombale n affiche un prix en direct que pour les plaques ; aucun concurrent
  romand verifie (lespierrestombales.ch, marbrier-geneve.ch, oudinmarbrerie.ch) n a de configurateur ni de prix.
- E5 retenu (securisee) : personnalisation GUIDEE dans le formulaire de devis (lignes de texte, police sur
  echantillons, hauteur, finition, motif, dessin fourni) avec un apercu simple du texte. Pas de canvas.
- Plus tard : vrai configurateur visuel (Konva), d abord pour cineraires et plaques, quand prix et visuels existent.
  Il devra reutiliser les memes donnees (src/data/personnalisation.ts) et le meme contrat (docs/devis-contrat.md),
  et ne charger son code que sur sa propre page, sans alourdir les autres pages ni nuire au SEO.

## Formulaire de devis, peaufinage (Thomas, 14.10.2026)
- Pas de champ "budget indicatif" pour le moment.
- Telephone : facultatif, la famille choisit comment etre recontactee (telephone ou email).
- Une seule police pour tout le monument (pratique courante), tailles de lettres pre-remplies.
- Sections conditionnelles selon le type de demande ; brouillon conserve dans le navigateur.
- Passe 2 (etapes + recapitulatif) decidee apres un test avec un proche age sur telephone.

## Configurateur visuel, cadrage (Thomas, 14.10.2026)
- Reference : parcours Rootia de France Tombale (docs/references/2026-10-14-*). Meme principe technique
  (photo par granit + canvas 2D a l echelle en cm), design a nous, fait apres la conception technique.
- Pas de multilingue pour le moment (confirme a nouveau).
- Pas d etape "complements" (vase, fleurs, entretien) pour le moment ; peut-etre a l avenir : prevoir
  la place dans le modele de donnees, pas dans l interface.
- Pas de medaillon photo en v1.
- Images : Thomas produit 27 produits declines en plusieurs granits (en cours). Regles dans
  docs/references/2026-10-14-croisement-analyses-configurateur.md (vue de face, stele nue, meme cadrage
  par modele, image monument + image stele, nommage par id de granit, largeur stele en cm, zone gravable).
- Tranche le 14.10.2026 (Claude, valide par Thomas "decide par rapport a notre tech") :
  1. Ordre des etapes : Granit > Inscription > Motifs > Votre devis (4 etapes, pas d etape Options).
     Le granit d abord parce que le canvas a besoin de son fond ; le texte avant les motifs parce que
     toutes les familles saisissent un texte, les motifs sont facultatifs et se placent autour.
  2. Alignement : tout centre, aucun bouton (Thomas a choisi la version securisee). Le champ
     `alignement` existe dans la scene, fixe a "centre", pour une evolution sans migration.
  3. Zones : configurateur = 3 zones libres, 120 caracteres, retours a la ligne autorises (4 lignes
     max par zone), une police + une hauteur + une finition + un alignement par zone. Le formulaire
     /devis/ garde ses 4 lignes a police commune. La scene est stockee en cm, jamais en pixels.
  4. Vues : composition sur la vue stele (export PNG = cette vue, pixelRatio 2). La vue monument
     affiche aussi la composition des que sa calibration (x0, y0, echelle, cf. PREPARATION.md)
     existe dans le JSON du modele ; sinon photo nue legendee "sans gravure". Pilote par les donnees.
  Technique figee : Konva en import dynamique sur /personnaliser/<slug>/ seulement, etat en JS sans
  framework (comme devis.astro), config inlinee en JSON au build, polices de gravure chargees sur
  cette page seule avec attente de document.fonts.load, prix indicatif calcule dans le navigateur et
  recalcule par la fonction Cloudflare avec le meme module, envoi sur le meme /api/devis avec un bloc
  `configurateur` (scene JSON + PNG). Bornes 120 caracteres et 4 lignes par zone a confirmer avec le
  graveur. Reste ouvert : pose au forfait ou par commune ; rappel a creneau (v1 : texte libre).
- Validation de Thomas, 14.10.2026 : 1 audacieuse (Inscription avant Motifs), 2 securisee (tout
  centre, aucun bouton d alignement ; le champ `alignement` reste dans la scene, fixe a "centre",
  pour l ajouter plus tard sans casser les devis deja envoyes), 3 audacieuse (3 zones multilignes),
  4 le plus realisable (composition sur la vue stele seule en v1 ; la vue monument suivra quand sa
  calibration existera, sans code nouveau).
- Principe de maintenabilite (demande de Thomas, 14.10.2026 : "tout devra etre facilement
  ameliorable ou corrigible par toi et moi") :
  - Tout ce qui est un choix (granits, polices, hauteurs, finitions, motifs, bornes 120/4/3,
    textes d aide, ordre des etapes) vit dans src/data/ ou src/config/, jamais dans le code du canvas.
    Ajouter un motif = deposer un SVG + une ligne dans un fichier de donnees.
  - Le JSON par modele (dimensions, zones gravables, images, calibrations) est genere au build
    depuis la fiche produit : corriger une cote = corriger la fiche.
  - Le code du configurateur est decoupe en petits fichiers a un seul role (etat, rendu Konva,
    prix, export, formulaire), chacun avec un commentaire d en-tete en francais qui dit ce qu il
    fait et ce qu il ne fait pas. Pas de framework, pas de bundle externe autre que Konva.
  - Un seul document de reference pour le modifier : docs/CONFIGURATEUR-FUTUR.md, avec une
    section "Comment changer X" tenue a jour a chaque passe.
  - Chaque passe (A a F de l etude) est un commit isole, testable seul, avec le script
    scripts/poids-pages.py comme garde-fou : on peut revenir en arriere passe par passe.

## Inscription guidee (Thomas, 23.10.2026, version audacieuse)
- La famille remplit des champs (prenom, nom, nom de jeune fille, naissance, deces, phrase) et
  choisit une mise en page : Classique, Dedicace en haut, Deux personnes. Le site compose seul.
- Tailles du metier, mesurees sur la MAJUSCULE : la plus grande qui tient. Reperes de recherche
  (a confirmer par le graveur) : noms 3 a 6 cm, chiffres 3 cm, phrase 1,5 a 3 cm, epitaphe de
  10 a 30 mots. Choix proposes : 1,5 / 2 / 2,5 / 3 / 4 / 5 / 6 cm.
- Regles de composition : nom sur une ligne tant qu'une taille >= 3 cm le permet, dates plus
  petites que le nom, phrase coupee entre les mots (5 lignes au plus), en cas de manque de
  hauteur le plus grand texte descend d'abord.
- Mise en page libre (zones deplacables, 6 au plus, 200 caracteres, 6 lignes) derriere le bouton
  "Placer le texte moi-meme". Le texte ne se deplace pas en mode guide.
- Tout se regle dans `src/data/inscription.ts` (mises en page, tailles par role, espaces, phrases).
- A demander au graveur : hauteur mesuree sur la majuscule ? plus petite lettre en sablage ?
  le signe de deces (croix) est-il grave ? (absent des polices web actuelles)

## Où retrouver quoi
- `docs/SPEC-BUILD-SITE.md` : la spec de build, avec l'avertissement sur les valeurs provisoires du production-spec.
- `analyses/2026-08-17-niche-pierre-tombale-ne.md` : l'analyse de marché complète, sections 1 à 15. Les données sont dans `analyses/data/`.
- `analyses/2026-08-17-dossier-opportunite-pierretombale.html` : le dossier présenté aux associés.
- `docs/historique/` : les deux handovers de la préparation.

## Base de départ du site : recherche du 13.10.2026
Question posée : existe-t-il un dépôt GitHub pour ne pas partir de zéro, avec un site de type Granits Maffre (catalogue, choix du style et de la matière, choix d'image, sur-mesure), où le bouton « acheter » devient une demande de devis par email ?

**Résultat : aucun dépôt ne fait tout.** Les recherches n'ont trouvé aucun configurateur open source de pierre tombale. La solution est un assemblage de trois pièces.

1. **Catalogue : fork d'Atelier Kō** (`github.com/xocothemes/atelier-ko`, licence MIT, démo `atelier-ko-topaz.vercel.app`). Astro 7, Tailwind 4, TypeScript strict, HTML statique avec un peu de JavaScript. Un fichier Markdown par produit dans `src/content/products`, validé par un schéma (`src/content.config.ts`). Réglages centralisés dans `src/config/site.ts`. Filtres par catégorie et par matériau, tri par prix, fiche produit avec galerie et tableau de caractéristiques, données structurées Google, sitemap, robots.txt. Fournit aussi `CUSTOMIZATION.md` et `AGENTS.md`. Jeune (11 étoiles, 24 commits au 13.10.2026) : on le copie une fois, on ne dépend pas de ses mises à jour.
   - À adapter : bois devient granit, catégorie devient type de monument. Ajouter les filtres style (moderne, classique) et tradition (chrétienne, musulmane, israélite). Ajouter la page « Nos granits ».
   - À retirer : panier, page panier, aperçu de paiement. Le bouton d'achat devient « Demander un devis ». La difficulté du retrait n'a pas pu être vérifiée (code non lisible depuis cette session) : à regarder le premier jour.
   - Manque : formulaire de devis, CMS, multilingue. Le multilingue n'est pas nécessaire en v1.
   - Remplace ScrewFast comme point de départ cité dans la spec (§1). ScrewFast reste utile en phase 2 pour le câblage du multilingue.
2. **Configurateur : à écrire, avec la démo officielle Konva comme point de départ** (`konvajs.org/docs/sandbox/Badge_Maker.html`). Elle fournit : saisie du texte par un champ superposé, déplacement, redimensionnement, export PNG (`pixelRatio` 3, poignées retirées avant l'export). Elle ne fournit pas : choix de police (Arial en dur), textures de granit, prix. Licence du code de la démo non précisée : s'en inspirer, ne pas copier tel quel. Pour une éventuelle phase 3 en 3D, référence : `github.com/iosorin/cup-demo` (Nuxt, Three.js, Fabric.js, 89 étoiles, démo en ligne, licence non vérifiée).
3. **Devis par email : le pipeline de la spec (§5)**. Le bouton envoie la configuration, l'aperçu PNG et les coordonnées de la famille au webhook n8n, qui envoie le courriel aux associés et un accusé de réception à la famille.

**Granits Maffre, ce que le site fait réellement** (observé le 13.10.2026) : menu « Configurateur », « Notre catalogue » (par type, par collection, par catégorie, par tradition), « Nos granits », « Où acheter ? ». Catalogue en grille de 23 pages avec photo, mots-clés, dimensions et « À partir de X € ». Chaque monument a un bouton « Configurez » qui renvoie vers un simulateur externe. Pas de panier, pas de formulaire de devis sur les pages vues : le sur-mesure passe par la page Contact. C'est un fabricant qui vend à des professionnels ; notre site est pour les familles, donc plus court (une quinzaine de modèles au départ) et avec un devis direct.

**Écartés** : le modèle Astro + Decap CMS + Cloudflare (`jshuntley/astro-decap-cloudflare-starter`, 6 étoiles, sans licence, version de Decap non fixée) ; les thèmes Astro e-commerce avec panier (Eclipse, Vortexwear, ShopVerse, Proxima), payants ou centrés sur le paiement. Pour que les associés modifient les prix sans toucher au code, un simple fichier de prix modifiable depuis GitHub suffit au départ.

## Preparation des images (Thomas, 14.10.2026)
- Aucune generation maintenant. Liste definitive des materiaux encore inconnue.
- Reference de production : `docs/images-configurateur/PREPARATION.md`. Inventaire de
  27 modeles et gabarit de calibration, hors runtime ; aucune declinaison lancee.
- Images luxe deja produites = presentation. Le configurateur exige des masters nus,
  orthographiques, avec geometrie et cadrage fixes entre granits, et deux vues par variante.
- Cotes collectees en cm, converties en mm canoniques pour le contrat du site.
- Dalles sans stele, acier ajoure et parties bicolores doivent etre calibres separement.
- Les mentions anterieures "27 produits declines en plusieurs granits (en cours)" ne
  constituent pas une autorisation de lancer une serie avant ces validations.
