# Spec : formulaire de devis en etapes, avec choix visuel du modele (E5 passe 3)

Decision de Thomas du 14.10.2026 (option audacieuse). Fait foi pour cette passe.

## 1. Etat de depart
- src/pages/devis.astro : 1349 lignes, une seule page, 7 sections (fieldset), un script inline
  de ~460 lignes (validation, sections conditionnelles, apercu, brouillon, envoi).
- Tout est deja dynamique : modeles depuis src/content/products, granits depuis
  src/data/granits.json, polices/finitions/motifs depuis src/data/personnalisation.ts.
- Audit du 14.10 : libelles 10 px majuscules gris, radios de 23 px, 9 ecrans de telephone,
  texte de reassurance loin du bouton, date sans borne.

## 2. Principes non negociables
- UNE seule page HTML, UN seul <form>, tous les champs dans le DOM. Sans JavaScript : toutes les
  etapes visibles a la suite, envoi natif. Le decoupage en etapes est une COUCHE JS par-dessus.
- Le contrat des champs (docs/devis-contrat.md) ne change pas, sauf ajout eventuel note.
- Rien d obligatoire en plus : nom, email, localite, typeDemande, consentement. Le modele reste
  facultatif ; la carte "Conseillez-moi" vaut reponse.
- Aucun nouveau fichier JS ou CSS sur les autres pages (verifier avec scripts/poids-pages.py).
- Public : familles en deuil, souvent agees, sur telephone. Mots simples, gros textes, grosses zones.

## 3. Decoupage en 4 etapes
1. Votre demande : type de demande (3 grandes cartes radio avec une phrase chacune),
   commune du cimetiere, cimetiere, date souhaitee (min = aujourd hui).
2. Le monument : onglets Famille (Monument funeraire / Monument cineraire / Je ne sais pas) puis
   grille de cartes modeles (vignette, nom, une ligne, prix indicatif) + carte "Conseillez-moi" ;
   puis pastilles granit. Etape SAUTEE si typeDemande = inscription ou autre.
3. L inscription : style d ecriture, lignes, finition, motif, apercu. Etape SAUTEE si typeDemande = autre.
4. Vos coordonnees et envoi : nom, email, telephone, recontact, fichiers, message, consentement,
   RECAPITULATIF (lecture seule, genere en JS : type, famille, modele, granit, inscription ligne par
   ligne, apercu de la gravure), bouton "Envoyer ma demande" et juste SOUS le bouton :
   "Nous vous recontactons pour affiner votre demande. Rien n est engage, et rien n est grave avant votre accord."

Pourquoi les coordonnees en dernier : la famille a investi dans sa demande avant de donner son
email ; c est l ordre des leaders (GPG : projet d abord, contact a la fin).

## 4. Mecanique des etapes (JS, progressive enhancement)
- Chaque etape = un <section data-etape="1..4"> contenant ses fieldsets. Sans JS : tout visible.
- Avec JS : classe "etapes-actives" sur le form ; une seule section visible ; les autres en
  hidden (attribut HTML, pas seulement CSS) pour que la validation native ne bloque pas sur un
  champ invisible. Les champs d une etape masquee ne portent jamais required.
- Barre de progression : <ol> "1 Votre demande, 2 Le monument, 3 L inscription, 4 Envoi",
  aria-current="step". Les etapes sautees sont affichees barrees ou grisees.
- Navigation : boutons "Continuer" / "Retour" ; a "Continuer", validation des seuls champs de
  l etape (meme fonctions poseErreur / premierControle que maintenant) ; focus sur le titre de
  l etape suivante ; scroll en haut.
- Etape courante memorisee dans le brouillon (localStorage) pour reprendre ou on en etait.
- Entree au clavier dans un champ texte ne doit PAS soumettre : intercepter Enter hors textarea
  et declencher "Continuer".
- Le bouton submit n existe que dans l etape 4 ; le JS garde la validation globale a l envoi.

## 5. Choix visuel du modele
- Composant src/components/ChoixModele.astro : pour chaque produit (getProducts), un <label>
  contenant <input type=radio name=modele value=slug> + ProductImage (meme vignette que le
  catalogue, 4/5, lazy) + nom + shortDescription + prixAffiche(slug). Cartes "Je ne sais pas
  encore, conseillez-moi" par famille (value = "", defaut).
- Filtre par famille : radios name=famille (deja existantes) pilotent l affichage des cartes
  (data-famille sur chaque carte). Sans JS : toutes les cartes visibles, groupees par famille
  avec un titre.
- Pre-selection depuis ?modele=<slug> (deja en place) coche la carte ET la famille, et place
  directement la famille sur le bon onglet.
- Les vignettes sont la premiere image de la fiche sinon la silhouette provisoire : un nouveau
  modele ou une nouvelle image apparaissent sans toucher au formulaire.
- Poids : 12 vignettes lazy en 320 px max, format moderne genere par Astro ; viser < 25 Ko par
  vignette. La page /devis/ peut grossir ; les autres non.

## 6. Corrections d audit integrees
- Libelles de champs : 15-16 px, minuscules, couleur de texte principale ; les petits libelles
  mono majuscules restent pour les titres de section seulement.
- Radios et cases : zone cliquable >= 44 px de haut (padding sur le label), bordure visible,
  etat coche visible sans se fier a la couleur seule.
- Boutons "Continuer" pleine largeur sur mobile, >= 48 px.
- Date : min = date du jour (calculee au build en JS cote client).
- Telephone : inputmode tel, aide "ex. 079 123 45 67".

## 7. Decoupage du travail (3 sous-passes, chacune build + commit)
A. Composant ChoixModele + onglets famille, integre dans la page actuelle (sans etapes encore).
B. Structure en 4 sections + barre + navigation JS + recapitulatif + brouillon avec etape.
C. Styles (libelles, zones cliquables, boutons), date min, telephone, texte sous le bouton,
   mise a jour docs/devis-contrat.md (pas de champ nouveau attendu ; sinon le noter) et ETAT.md.

## 8. Verification attendue
- npm run build, npx astro check : 0 erreur.
- scripts/poids-pages.py : aucune page autre que /devis/ ne change ; noter /devis/.
- Navigateur : parcours complet en 4 etapes sur 390 px ; etape 2 et 3 sautees selon le type ;
  retour arriere conserve les valeurs ; rechargement reprend a la meme etape ; sans JS (desactiver
  via eval sur un clone n est pas possible : verifier au moins que le HTML genere contient tout et
  qu aucun champ n a required hors des 5 prevus).
- Texte visible sans "atelier|kosovo|sous-trait|fabriqu|n8n".

## 9. Risques connus
- Un formulaire en etapes cache la longueur : compense par la barre et "Continuer" qui n exige rien
  de facultatif.
- Les vignettes sont toutes identiques tant qu il n y a pas d images : la grille sera visuellement
  pauvre jusqu aux images IA de Thomas. Acceptable, le mecanisme est en place.
- Le script inline va depasser 600 lignes : prevoir de l extraire dans src/scripts/devis.ts
  (charge seulement par cette page) si l agent le juge plus sur.
