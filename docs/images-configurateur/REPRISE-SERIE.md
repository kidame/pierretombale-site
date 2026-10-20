# Reprise de la serie images

Autorisation Thomas, 19.10.2026 : poursuivre les 27 modeles en 10 matieres, une vue par variante, classer et documenter sur le VPS. Cette demande remplace l'ancien statut 'aucune generation' de PREPARATION.md. Les exigences finales de calibration restent applicables.

## Point de reprise

Checkpoint 2026-10-20T11:30:25.501708+00:00 : 70/270 images archivees, 200 restantes.
7/27 modeles complets. Le registre suivi-serie.json et AVANCEMENT.md sont les sources du compte courant.
Le tableau AVANCEMENT.md est mis a jour automatiquement apres chaque archivage.
Prochaine combinaison : musulman-4 / bengal.

Clarification Thomas du 20.10.2026 a 13h05 : produire toute la serie.
Un lot de 5 est un checkpoint, jamais une consigne d arret. Enchainer les lots sans confirmation.
Une seule generation simultanee ; inspecter puis archiver chaque resultat avant le suivant.
Le dernier lot est entierement transfere et controle. Aucun transfert partiel de ce lot.
La production active detient le verrou ; le recepteur peut rester ouvert entre les lots.
Ne pas prendre cette note de checkpoint pour une preuve de generation en arriere-plan.
La reprise planifiee existante a ete reactivee ; sa capacite de generation reste a verifier.
Voir automation-production.json et PRODUCTION-AUTONOME.md.

Les champs dernierLot et prochainLot sont actualises a chaque checkpoint ; prochaineAction est actualisee apres chaque image.

## Regles de continuation

1. Lire AGENTS.md, ETAT.md, ce document et le registre ; verifier git status et les fichiers reels.
2. Pour chaque modele : inspecter sa reference source, conserver ses formes et inserts, retirer accessoires amovibles/gravures. Ne pas inventer de stele ; acier ajoure et bicolores conservent leurs parties fixes. Documenter les ambiguities.
3. Creer une seule base Bengal ; neuf editions changent uniquement la pierre depuis cette meme base, jamais depuis la variante precedente. Les prompts sont dans prompts.json par modele. Utiliser imagegen integre, pas de bascule API payante sans demande.
4. Generer par lots de 5 automatiquement enchaines, strictement une image a la fois. Apres le checkpoint de chaque lot, continuer sans demander de confirmation. A chaque image terminee : copier sous son nom stable, enregistrer son chemin et sa matiere, transferer au VPS et verifier SHA256. Ne pas attendre la fin d'un grand lot pour sauvegarder.
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
