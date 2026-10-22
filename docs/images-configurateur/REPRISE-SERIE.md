# Reprise de la serie images

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

Autorisation Thomas, 19.10.2026 : poursuivre les 27 modeles en 10 matieres, une vue par variante, classer et documenter sur le VPS. Cette demande remplace l'ancien statut 'aucune generation' de PREPARATION.md. Les exigences finales de calibration restent applicables.

## Point de reprise

Cloture de la production pilote : 2026-10-22T10:32:09.980077+00:00.
270/270 PNG archives sur le VPS ; 27/27 modeles complets, 10 matieres et une vue par variante.
Repartition : 14 modeles funeraires et 13 modeles cineraires.
Toutes les combinaisons du registre sont presentes. Aucun transfert partiel.
Les manifestes concordent avec le registre, les tailles et les dimensions des fichiers.
Controle detaille : CONTROLE-FINAL-270.json.

Derniers produits termines : ELIGIE, CORAZON, DOUCEUR, chacun a 10/10.
Derniere session de continuation : 20 nouvelles images CORAZON et DOUCEUR, de 250 a 270.
Les 20 empreintes SHA256 ont ete reverifiees face aux sources locales.
Le recepteur a ete ferme proprement. Aucune generation active.
L automation Produire les 270 variantes est desactivee, confirmation is_enabled=false.
Les champs dernierLot, dernierProduit, prochainLot et prochaineAction sont a jour.

Limites explicites : les 270 PNG originaux font 1254 x 1254 ; le format final minimal
de 1600 px reste a produire. Aucun agrandissement artificiel.
Calibration, geometrie atelier, zones physiques, contours au pixel, couleurs et
echelle du grain restent a valider avant integration definitive.
224 prompts exacts sont disponibles dans les dossiers ; 46 appels des premieres
archives ne sont pas retrouves dans prompts-exacts.json. Cette lacune historique
est detaillee dans le controle final. Aucun prompt ancien n a ete invente.

La production des pilotes est terminee. La prochaine phase est la validation et
la calibration des images produit/configurateur.
Les regles ci-dessous documentent la procedure suivie pendant la production.

## Regles de continuation

1. Lire AGENTS.md, ETAT.md, ce document et le registre ; verifier git status et les fichiers reels.
2. Pour chaque modele : inspecter sa reference source, conserver ses formes et inserts, retirer accessoires amovibles/gravures. Ne pas inventer de stele ; acier ajoure et bicolores conservent leurs parties fixes. Documenter les ambiguities.
3. Creer une seule base Bengal ; neuf editions changent uniquement la pierre depuis cette meme base, jamais depuis la variante precedente. Les prompts sont dans prompts.json par modele. Utiliser imagegen integre, pas de bascule API payante sans demande.
4. Produire les variantes restantes du produit par lots de 5, puis archiver le lot.
5. Transfert interrompu : comparer taille et prefixe au fichier source avant reprise a l'offset exact. Un fichier incomplet reste hors statut archive. Pour les nouveaux transferts utiliser un suffixe .part, puis renommer seulement apres controle complet. Ne jamais ecraser une variante complete ; correction en v2.
6. Mettre a jour le registre et le manifeste du modele avec resolution et hash reels. README : source, particularites, limites, nombre present. Commit local par modele (ou point de reprise), jamais push/publication implicite.
7. Fin de session : marquer exactement la prochaine combinaison et toute generation en cours. Aucune execution autonome n'est garantie hors session active. Le plan garantit la tracabilite, pas un traitement en arriere-plan.

## Nommage et correspondances

Dossier : `pilotes/<funeraire|cineraire>/<modeleId>/v1/`. Fichier original : `<modeleId>-<matiereId>.png`. Ces identifiants de modele sont internes ; noms publics non confirmes.
Textures selecteur : `matieres/2026-10-19/textures-v1/<matiereId>-texture-v1.png`. Une meme cle matiereId relie texture et variante. Aucun changement de granits.json avant confirmation de son mapping.
Les 10 ids : bengal, rozabeta, paradiso, jablanica, royal, vizag-blue, viscount-white, rosso-porrino, egipat, marmara.

## Validation finale separee

Les sorties actuelles font 1254 x 1254 et restent des pilotes. Minimum final 1600 px, export JPG sRGB ; ne pas presenter un agrandissement comme nouvelle definition. Fond gris, ombre legere, vue axiale mais perspective residuelle : pas encore orthographique stricte.
Avant integration : contours et reperes superposes au pixel, zone gravable mesuree en cm, calibration verifiee sur chaque matiere, tailles physiques et compatibilites atelier, materiaux et couleurs compares aux vrais echantillons. Les valeurs inconnues restent null. Aucun lot actuel n'est approuve pour fabrication ou publication automatique.

## Fichiers d'appui

- `suivi-serie.json` : etat des 270 combinaisons et ordre.
- `prompts-serie.json` : trames pour bases et variantes (completer la description apres inspection).
- `pilotes/.../manifest.json` : correspondances locales, checksums et resolution.
