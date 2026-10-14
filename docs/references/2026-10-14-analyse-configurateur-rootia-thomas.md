# Analyse du configurateur Rootia (France Tombale), parcours manipule par Thomas, 14.10.2026

Observation du site France Tombale le 14 octobre 2026. Ce document
decrit les actions disponibles, leur ordre, les limites d'ajout et la
sortie vers le devis. Il sert de reference pour concevoir le futur
parcours de PierreTombale.ch.

**Le parcours actuel comporte cinq etapes. La limite de trois s'applique
aux zones de texte et aux photos de la concession. Les motifs peuvent
etre repetes au-dela de trois.**

## Ordre du parcours

| **Etape**             | **Ce que fait la famille**                                       | **Resultat**                         |
|-----------------------|------------------------------------------------------------------|--------------------------------------|
| 1 Granit              | Choisir une pierre pour le monument.                             | Visuel et prix de base adaptes.      |
| 2 Motif et medaillons | Ajouter des motifs et des medaillons photo.                      | Elements disposes sur la stele.      |
| 3 Gravure             | Ecrire et regler jusqu'a trois zones de texte.                   | Composition personnalisee.           |
| 4 Complements         | Ajouter des articles ou services facultatifs.                    | Options ajoutees au projet.          |
| 5 Devis               | Relire, saisir les coordonnees et les informations du cimetiere. | Demande de devis, rappel facultatif. |

## Les quantites a distinguer

| **Element**          | **Limite constatee**                                                                     |
|----------------------|------------------------------------------------------------------------------------------|
| Granit               | Un seul choix commun au monument entier.                                                 |
| Zones de texte       | 3 maximum, 120 caracteres par zone.                                                      |
| Motifs               | 4 exemplaires du meme motif ajoutes avec succes. Le site annonce des ajouts sans limite. |
| Medaillons           | Plusieurs possibles. 2 medaillons distincts testes ; plafond non etabli.                 |
| Photos de concession | 3 maximum, 5 Mo par photo selon l'interface.                                             |

Source principale : https://www.france-tombale.fr/rootia.html

La navigation en direct fait foi pour cette analyse. La version indexee
consultable dans le moteur de recherche presente un ancien parcours
different.

Sources du projet : AGENTS.md, ETAT.md, docs/DECISIONS-ET-ETAT.md et
docs/CONFIGURATEUR-FUTUR.md du depot pierretombale-site.

# 1 Choisir le granit puis les motifs

## Etape 1 Le granit

La fiche Rootia ouvre directement sur le choix du granit. Elle montre la
photo du produit, un prix de depart et douze choix visuels. Le passage a
l'etape 2 n'a pas fonctionne tant qu'aucun granit n'etait choisi.

Les douze choix observes sont : Rose Levant, Blanc Ivoire, Rose Cristal,
Himalaya Mountain Blue, Mass Blue Orion, Indian Juparana, Kuppan Green,
Viscount White, Romantica, Cats Eyes, Indian Aurora et Labrador Bleu Hq.

- Cliquer une pastille selectionne un seul granit et met a jour les
images ainsi que l'estimation.

- Le granit concerne la stele, la tombale et le soubassement. Aucun
choix independant par piece n'est propose dans ce parcours.

- Le bouton de continuation ouvre les motifs et les medaillons.

- Aux etapes 2 et 3, le nuancier reste disponible au-dessus de
l'apercu. Un changement de Rose Levant vers Blanc Ivoire a conserve les
textes et les elements deja ajoutes.

## Etape 2 Les motifs decoratifs

Cette etape reunit deux fonctions independantes : les motifs du
catalogue et les medaillons photo. La famille peut les combiner.
L'apercu detaille de la stele permet de composer leur placement, avec
une petite vue du monument complet.

Le catalogue de motifs comporte neuf categories : Fleur, Religieux,
Nature, Coeur, Arbre, Oiseaux, Ciel, Animaux et Metier. Chaque carte
propose un visuel, un prix et, pour certains motifs, un choix de
couleur.

- Choisir une categorie puis un motif. Quand des couleurs sont
proposees, choisir la variante avant l'ajout.

- Ajouter le motif a l'apercu. Sa carte affiche ensuite un compteur et
des boutons pour ajouter ou retirer un exemplaire.

- Repeter le meme motif ou en combiner plusieurs. Un compteur global et
des compteurs par categorie indiquent les elements poses.

- Selectionner un element sur l'apercu pour acceder a son cadre, sa
poignee de dimensionnement et sa corbeille.

- Passer ensuite a la gravure. Le medaillon et les motifs restent
visibles pendant la saisie du texte.

## Verification de la repetition

Quatre Pissenlits ont ete ajoutes : le compteur est passe a 4 et
l'estimation a augmente a chaque ajout. Trois ont ensuite ete retires
avec le bouton de diminution. Il ne faut donc pas appliquer la limite de
trois zones de texte aux motifs.

L'interface annonce le deplacement et le redimensionnement des elements.
Le deplacement direct a ete essaye sur une zone de texte ; la poignee de
redimensionnement a ete observee. Aucun import libre d'image comme motif
grave n'a ete repere dans les ecrans parcourus.

# 2 Configurer les medaillons photo

Un medaillon correspond a une photo sur porcelaine ajoutee a la stele.
Le bouton d'ajout ouvre une fenetre dediee. Le medaillon n'entre dans la
composition qu'apres validation de cette fenetre.

| **Reglage** | **Choix visibles et comportement**                                                                |
|-------------|---------------------------------------------------------------------------------------------------|
| Forme       | Rectangle, ovale, coeur, rond, coeur virgule droite, coeur virgule gauche, carre.                 |
| Photo       | Import facultatif. Un medaillon peut etre ajoute sans photo, avec un portrait de remplacement.    |
| Rendu photo | Couleur, sepia, noir et blanc. Ces commandes sont desactivees tant qu'aucune photo n'est chargee. |
| Contour     | Sans contour, filet or ou filet blanc. Le contour est annonce comme offert.                       |
| Orientation | Portrait ou paysage.                                                                              |
| Taille      | Choix en centimetres. Les tailles disponibles et leur prix changent selon la forme.               |
| Validation  | Ajouter le medaillon a la composition, ou annuler et fermer la fenetre.                           |

## Exemple de tailles

Pour l'ovale, les tailles observees sont 4x6, 5x7, 6x8, 7x9, 8x10, 9x12,
11x15 et 13x18 cm. La forme rectangle propose une autre liste, jusqu'a
18x24 cm. Il faut donc rattacher les tailles a la forme, plutot que
proposer une liste unique pour tous les medaillons.

## Apres ajout

- Une ligne de recapitulatif affiche la miniature, la forme, la taille
et le prix du medaillon.

- Modifier rouvre les reglages du medaillon concerne. Retirer le
supprime de la composition.

- Un bouton permet d'ajouter un autre medaillon. Deux variantes ont ete
ajoutees : un ovale 9x12 cm et un rectangle 9x12 cm en paysage avec
filet or.

- Les medaillons possedent leurs propres reglages. Ils ne consomment
aucune des trois zones de texte.

## Promotion observee et points a confirmer

Lors de la visite, une offre accordait un medaillon par monument. Avec
un seul medaillon a 111 EUR, celui-ci etait offert. Apres ajout du
rectangle a 124,50 EUR, le rectangle est devenu offert et l'ovale
payant. Ce comportement a ete observe sur ces deux articles ; il ne
constitue pas une regle commerciale a reprendre automatiquement.

L'import d'une vraie photo, son eventuel recadrage et les limites de
fichier propres au medaillon restent a verifier. Les limites de 3
fichiers et 5 Mo affichees a la fin concernent les photos de la
concession, pas ce portrait.

# 3 Ecrire et disposer la gravure

La gravure fonctionne avec des zones de texte independantes. Une zone
peut contenir plusieurs lignes, par exemple un nom et des dates. Trois
zones ne signifient donc ni trois personnes ni trois lignes
obligatoires.

## Ordre des actions

- Saisir le texte de la premiere zone dans le champ HTML, avec des
retours a la ligne si necessaire.

- Choisir sa police, sa taille, son alignement et sa finition.

- Deplacer la zone sur l'apercu de la stele.

- Ajouter une deuxieme, puis eventuellement une troisieme zone. Cliquer
les onglets numerotes pour editer chacune.

- Supprimer une zone si besoin, puis continuer vers les complements.

| **Propriete** | **Fonctionnement observe**                                                                                                              |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| Quantite      | Une zone est presente au depart. Le bouton d'ajout devient inactif a 3 zones. Supprimer une zone le reactive.                           |
| Longueur      | 120 caracteres maximum par zone. Compteur restant et attribut maxlength verifies. Espaces et retours a la ligne consomment ce compteur. |
| Polices       | Minion, Amazon, Monotype Corsiva, Raphael et Commercial Script.                                                                         |
| Taille        | Boutons reduire et agrandir. Valeur initiale observee : 28 ; un agrandissement donne 30. L'unite physique n'est pas etablie.            |
| Alignement    | Centre, gauche, droite ou justifie.                                                                                                     |
| Finition      | Or sable, blanc ou noir.                                                                                                                |
| Position      | Deplacement direct sur la stele. Cadre de selection, poignee et corbeille sur l'apercu.                                                 |
| Independance  | Le contenu et les reglages sont conserves pour chaque zone lorsque l'on change d'onglet.                                                |

## Scenario effectivement essaye

Zone 1 : EXEMPLE puis 1940 - 2020 sur la ligne suivante, en Monotype
Corsiva, taille 28, centree. Zone 2 : SOUVENIR. Zone 3 : A JAMAIS,
finition blanche, taille 30 et alignement a gauche. Le retour vers la
zone 1 a retrouve son texte, sa police et son alignement. La zone 3 a
ete deplacee puis supprimee, ce qui a libere une place.

## Compteur de texte et prix

Le recapitulatif a affiche 3 zones et 31 lettres facturees, pour 310 EUR
dans ce scenario. Le compteur de 120 caracteres et le nombre de lettres
facturees sont deux calculs distincts. La regle complete de tarification
des espaces, signes, accents, tailles et finitions ne peut pas etre
generalisee a partir de cet essai.

# 4 Complements et recapitulatif du prix

## Etape 4 Les complements

Cette etape est facultative. La famille peut cocher plusieurs articles
ou services, ajouter une demande libre, puis continuer. Un bouton permet
aussi de passer directement a l'etape suivante.

| **Complement observe**               | **Prix affiche** |
|--------------------------------------|------------------|
| Fleurs artificielles pour vase       | 85 EUR           |
| Fleurs artificielles pour jardiniere | 95 EUR           |
| Vase tulipe de 25 cm                 | 214 EUR          |
| Entretien et fleurissement           | 179 EUR          |

Le champ libre permet de demander un autre article. Deux complements ont
ete coches ensemble : fleurs pour vase et entretien. Le recapitulatif a
bien affiche les deux et leur somme de 264 EUR.

## Etape 5 Relire le projet

Le dernier ecran presente le monument complet, l'apercu personnalise de
la stele et un recapitulatif chiffre. Il distingue le modele et le
granit, les motifs, les medaillons, la gravure, les complements et la
pose. Une commande permet de revenir modifier le projet.

Une barre d'estimation reste visible pendant le parcours, avec un acces
au detail. Les choix influencent le total avant toute saisie des
coordonnees. Le tarif de pose est actualise lorsque le code postal du
cimetiere est renseigne.

## Exemple de calcul constate

| **Poste du scenario de test**                  | **Montant**                    |
|------------------------------------------------|--------------------------------|
| Rootia en Rose Levant                          | 2 499 EUR                      |
| Un motif Pissenlit blanc                       | 140 EUR                        |
| Un medaillon ovale 9x12 cm                     | 111 EUR puis remise de 111 EUR |
| Trois zones de texte, 31 lettres facturees     | 310 EUR                        |
| Deux complements                               | 264 EUR                        |
| Total avant chiffrage de la pose               | 3 213 EUR                      |
| Pose apres saisie du code postal de test 75001 | 799 EUR                        |
| Total estime apres chiffrage de la pose        | 4 012 EUR                      |

Ces montants documentent le fonctionnement du site visite au 14.10.2026.
Ils ne sont pas des tarifs pour PierreTombale.ch.

## Clarifier les inclusions sur notre futur parcours

La page affiche une mention de pose incluse, alors que le recapitulatif
attend le code postal pour la chiffrer. Elle avertit aussi que certains
elements representes, comme la semelle ou le vase, peuvent etre exclus
du tarif. Notre interface devra separer clairement prix connu, poste en
attente et element decoratif non compris.

# 5 Terminer la demande de devis

## Les champs du dernier ecran

| **Information**          | **Statut presente a l'utilisateur**                                                 |
|--------------------------|-------------------------------------------------------------------------------------|
| Prenom et nom            | Deux champs marques obligatoires par une etoile.                                    |
| Email et telephone       | Deux champs marques obligatoires par une etoile.                                    |
| Code postal du cimetiere | Marque obligatoire ; sert aussi au chiffrage de la pose.                            |
| Nom du cimetiere         | Champ sans etoile.                                                                  |
| Type de sepulture        | Pleine terre, caveau, cineraire ou choix indiquant que la famille ne sait pas.      |
| Precisions               | Texte facultatif : delai, contraintes ou demande particuliere.                      |
| Photos de la concession  | Facultatives. 3 maximum, 5 Mo par photo. Formats annonces : JPG, PNG, WEBP et HEIC. |
| Rappel                   | Facultatif. Selection d'un jour puis d'une heure ; mode telephone affiche.          |

## Le choix du rappel

Lors de la visite du mercredi 14 octobre, six jours etaient proposes :
15, 16, 19, 20, 21 et 22 octobre. Choisir le 15 octobre a fait
apparaitre les heures 09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00 et
18:00. Le texte d'aide indique qu'un second clic permet de
deselectionner. Ces disponibilites doivent etre considerees comme
dynamiques.

## Action finale et suite annoncee

Le bouton final demande un devis. La page annonce un retour d'un
conseiller sous 24 heures, avec un devis detaille et une maquette, sans
engagement. Elle informe la famille que l'envoi autorise une reprise de
contact sur ce projet.

**Aucun paiement ni creation de compte n'a ete exige dans les cinq
etapes parcourues. La demande n'a pas ete envoyee pendant cette analyse.
La page de confirmation, l'email recu, la sauvegarde cote serveur et le
delai reel de reponse restent donc non verifies.**

## Retour et conservation des choix

Les etapes terminees sont accessibles depuis la progression. Les boutons
de retour permettent aussi de reprendre les choix precedents. Le retour
du devis vers la gravure a conserve les trois textes et leurs reglages.
Le changement de granit a conserve la composition dans la session.

La reprise apres fermeture ou rechargement du navigateur n'a pas ete
testee. Il ne faut pas en deduire l'existence d'une sauvegarde durable,
d'un lien partageable ou d'un brouillon accessible sur un autre
appareil.

# 6 Traduire cette analyse pour PierreTombale

L'experience a reproduire est une composition guidee suivie d'une
demande de devis. Les catalogues, les tarifs, les promotions et les
promesses de service doivent provenir de notre propre offre. Ce document
decrit la reference ; il ne remplace pas les decisions deja prises pour
le site.

## Version securisee

Conserver le formulaire guide actuel : modele et granit, inscription
avec apercu, fichiers, puis recapitulatif et coordonnees. Reprendre la
clarte des etapes, les retours sans perte, le detail des choix et les
limites visibles. Maintenir le telephone facultatif, une police commune
et le bon a tirer obligatoire, conformement aux decisions du projet.

## Version audacieuse

Creer une page de composition visuelle dediee, avec le modele deja
choisi, puis les cinq etapes de la reference : granit, motifs et
medaillons, gravure, complements, devis. Ajouter des controles simples
utilisables sur telephone, un brouillon et une estimation detaillee
lorsque les tarifs seront valides. Le rendu reste indicatif et le bon a
tirer precede toute gravure.

## Ecarts a regler avant une reproduction fidele

| **Reference Rootia**                           | **Situation ou decision pour notre site**                                                                                                     |
|------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| 3 zones multilignes avec reglages independants | Le formulaire actuel prevoit 4 lignes et une police commune. Choisir le modele cible avant de modifier le contrat d'envoi.                    |
| Plusieurs motifs et medaillons positionnes     | Prevoir une liste d'elements avec identifiant, variante, dimensions et position. Le champ motif actuel ne decrit pas toute cette composition. |
| Prix vivant et pose selon le code postal       | Utiliser la grille propre au projet en CHF et les regles locales. Adapter le code postal au NPA suisse.                                       |
| Placement libre sur la stele                   | Obtenir dimensions reelles et zones gravables par modele. Conserver positions et dimensions en millimetres.                                   |
| Portrait photo et photos du cimetiere          | Les distinguer dans l'interface, les fichiers envoyes et le dossier de demande.                                                               |

## Controles de reception du futur parcours

- Une quatrieme zone est impossible si la limite de trois est retenue ;
une suppression libere une place.

- Les choix, textes et positions survivent aux retours. Le changement
de granit ne detruit pas la composition.

- Le recapitulatif correspond exactement aux elements visibles et au
detail du prix.

- Les fichiers trop nombreux ou trop lourds sont refuses avec une
explication. Les textes restent recuperables en cas d'erreur d'envoi.

- Le parcours fonctionne sur telephone et au clavier. La demande recue
contient la configuration exploitable ; aucune gravure ne commence sans
bon a tirer valide.

Limites de l'analyse : parcours ordinateur observe, sans envoi au
commercant ni import de photo personnelle. Les fonctions apres envoi,
les validations serveur, le recadrage photo et l'usage tactile reel
restent a verifier. Les informations de la page peuvent evoluer.
