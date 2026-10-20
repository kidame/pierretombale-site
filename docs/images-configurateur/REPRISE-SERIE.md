# Reprise de la serie images

Autorisation Thomas, 19.10.2026 : poursuivre les 27 modeles en 10 matieres, une vue par variante, classer et documenter sur le VPS. Cette demande remplace l'ancien statut 'aucune generation' de PREPARATION.md. Les exigences finales de calibration restent applicables.

## Point de reprise

Registre unique : `suivi-serie.json` (27 modeles, 270 combinaisons). Les statuts distinguent generation, archivage et validation configurateur. Un fichier present n'est pas automatiquement valide.
Etat courant apres le lot borne du 20.10.2026 : 61 images completes archivees, 209 restantes.
Six modeles complets : CIN1, ARQUES, ALMANDIN, doucine avec base, jardiniere et 4 pieces sans stele.
Tombale simple : 1/10. Les 20 autres modeles n'ont pas encore de variante archivee.
Le bilan de 55/270 cite par Thomas precedait Royal ; le point de depart verifie etait 56/270.
Cinq nouvelles variantes sans stele ajoutees : vizag-blue, viscount-white, rosso-porrino, egipat, marmara.
Le modele 4-pieces-sans-stele est maintenant a 10/10 ; aucun nouveau modele lance dans ce passage.
Tous les transferts du lot sont termines, PNG et SHA256 verifies ; aucune generation en cours.
Le tableau AVANCEMENT.md est mis a jour automatiquement apres chaque archivage.

Prochain lot, maximum 5 nouvelles images, sur tombale-simple-200x100x10 :
rozabeta, paradiso, jablanica, royal, vizag-blue. Partir de son master Bengal existant.
Le registre conserve prochaineAction, prochainLot et dernierLot pour reprendre sans re-audit complet.

La reprise automatique a ete observee en pause le 20.10.2026, dernier passage enregistre
2026-10-20T09:05:22.684674+00:00. Cause de la pause non etablie ici.
Sa consigne est desormais bornee a 5 images ; elle reste en pause, sans promesse de production en fond.
Voir automation-production.json et PRODUCTION-AUTONOME.md. Recepteur du lot manuel ferme.

Incident mineur de lecture : read_process_output(offset=0) a une fois affiche No output alors que
le bloc etait ecrit. La taille partielle puis la lecture offset=-3 ont confirme l'accuse ;
reprise a l'offset exact, aucune regeneration ni perte. Procedure completee.

## Regles de continuation

1. Lire AGENTS.md, ETAT.md, ce document et le registre ; verifier git status et les fichiers reels.
2. Pour chaque modele : inspecter sa reference source, conserver ses formes et inserts, retirer accessoires amovibles/gravures. Ne pas inventer de stele ; acier ajoure et bicolores conservent leurs parties fixes. Documenter les ambiguities.
3. Creer une seule base Bengal ; neuf editions changent uniquement la pierre depuis cette meme base, jamais depuis la variante precedente. Les prompts sont dans prompts.json par modele. Utiliser imagegen integre, pas de bascule API payante sans demande.
4. Generer au maximum 5 nouvelles images par passage, strictement une image a la fois. A chaque image terminee : copier sous son nom stable, enregistrer son chemin et sa matiere, transferer au VPS et verifier SHA256. Ne pas attendre la fin d'un grand lot pour sauvegarder.
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
