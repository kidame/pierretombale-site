# Production autonome des 270 images
Autorisation Thomas, 20.10.2026 : produire integralement, lot par lot, sans demande de continuation.
Cible : 27 modeles, 10 matieres, UNE vue par variante. Aucun changement runtime ou publication.
Le suivi courant est suivi-serie.json ; AUDIT-2026-10-20.md est un instantane historique a 46 images.

## Execution
Clarification Thomas du 20.10.2026 a 13h05 : produire toute la serie sans demander de continuation.
Cinq images = taille d'un lot de sauvegarde, PAS une limite de session ni un ordre d'arret.
Generer strictement une image a la fois, la controler et l'archiver avant la suivante.
Apres chaque lot de 5, documenter et commiter, puis enchainer automatiquement le lot suivant.
Continuer jusqu'a 270/270 ou blocage technique reel, sans nouvelle demande a Thomas.
Aucune reconstruction d'infrastructure, aucun nouveau re-audit complet a chaque passage.
Lire d'abord /home/kumo/atelier/AGENTS.md, les instructions du depot, ETAT.md et ce document.
Acces VPS uniquement via vps-proxy ; toute commande commence par kumo.
Ouvrir un shell avec script -qc bash /dev/null. Ne jamais travailler dans /home/ubuntu.
Depot : /home/kumo/atelier/repos/pierretombale-site ; main seulement, pull --ff-only apres status.
Le verrou de transfert empeche deux producteurs simultanes ; si busy, sortir sans generer.
Pas d'agent Claude/Codex ni de build pour les images. Utiliser le skill imagegen et l'outil integre.
Pas de bascule API/CLI payante. Ne pas utiliser kumo-run comme generateur d'images.

## File et references
kumo python3 /home/kumo/atelier/repos/pierretombale-site/scripts/serie-images.py status
Cette commande donne les prochaines combinaisons, dossiers et sourceLibraryId.
Pour une variante, partir TOUJOURS du Bengal du meme modele, jamais de la variante precedente.
Textures : docs/images-configurateur/matieres/2026-10-19/textures-v1/<matiere>-texture-v1.png.
Pour un nouveau modele, recuperer la reference source via son sourceLibraryId (Library), l'inspecter,
puis produire le master Bengal depuis cette reference et la texture Bengal. Ne pas deviner sa forme.
Les ids Library des sources sont conserves dans suivi-serie.json. Acces Library teste le 20.10.2026.
Respecter les cas sans stele, les inserts fixes, l'acier ajoure et les parties bicolores.
Les trames sont dans prompts-serie.json ; adapter la description aux references effectivement vues.

Pour voir une image VPS inaccessible au lecteur du connecteur :
- kumo cp <chemin-source-absolu> /tmp/kumo-images-session/<nom>.png
- kumo chmod 644 /tmp/kumo-images-session/<nom>.png
- lire /tmp/kumo-images-session/<nom>.png avec vps-proxy read_file, puis emettre son bloc image.
C'est une copie de lecture, pas une publication ni un serveur HTTP.
Deux references emises juste avant imagegen : master puis texture ; num_last_images_to_include=2.
Si les deux references sont locales, les inspecter puis utiliser referenced_image_paths.
Ne jamais combiner ces deux mecanismes. Lire la documentation imagegen du passage.
Une image par appel. Fond gris, pas de texte, accessoire amovible, vase ou fleur.
Conserver forme, cadrage, composants, ombre et cavites. Controle visuel de chaque resultat.
Une derive majeure doit etre corrigee, jamais marquee valide par le transport.
Conserver les PNG originaux : l'outil livre actuellement 1254x1254 malgre la demande 2048x2048.
La validation finale, la resolution >=1600 et la calibration restent separees de cette serie pilote.

## Transfert teste
Demarrer un recepteur avec vps-proxy start_process :
kumo python3 -u /home/kumo/atelier/repos/pierretombale-site/scripts/serie-images.py serve
Attendre ready=true ; busy=true signifie qu'un autre producteur detient le verrou.
Le serveur ne fait aucun appel reseau et n'ecoute aucun port : stdin/stdout seulement.
Il s'arrete apres 1800 secondes sans entree. Pour le fermer : envoyer {"action":"stop"}.
Un ping {"action":"ping"} conserve le verrou pendant une generation longue.

L'imagegen retourne image_url sous forme data:image/png;base64 et un output_hint avec le chemin local.
Le chemin local permet de calculer la taille en octets et le SHA256, sans agrandir ni recompresser.
Ne jamais imprimer les donnees base64. Utiliser functions pour les relayer directement aux outils.
Couper la partie base64 en blocs de 256000 caracteres, multiples de 4.
Offset en octets = debutDuBlocBase64 / 4 * 3.
Chaque bloc est une ligne JSON envoyee par interact_with_process avec :
wait_for_prompt=false, timeout_ms=1000. IMPORTANT : true fait planter la detection par regex sur gros blocs.
Lire les accuses de reception avec read_process_output(offset=-3, length=3) ; verifier chaque erreur, l offset attendu et le resultat final.
Le curseur offset=0 a parfois renvoye No output alors que le bloc etait ecrit ; relire la fin avant toute reprise.
Un accuse ancien ne suffit pas : son offset doit couvrir le bloc envoye, ou contenir archive pour le dernier bloc.
Protocole JSON de chaque bloc :
{
  "modeleId":"<id>", "matiereId":"<id>",
  "destination":"pilotes/<famille>/<modeleId>/v1/<modeleId>-<matiereId>.png",
  "sha256":"<hash complet du PNG>", "total":1234567, "offset":0,
  "data":"<bloc base64 seulement>",
  "prompt":"<prompt exact>", "references":["<master>","<texture>"],
  "sourceLocale":"<chemin imagegen local>", "controleVisuel":"<constat reel et limites>"
}
Le recepteur refuse les fichiers complets de hash different et les trous d'offset.
Un bloc deja present avec les memes octets peut etre renvoye sans duplication.
Si un appel retourne une erreur technique, lire d'abord les accuses et la taille .incoming.part :
le bloc a peut-etre ete ecrit. Reprendre au dernier offset, pas au debut par hypothese.
Au dernier bloc : SHA256, CRC PNG, IEND, decompression zlib et taille de pixels sont verifies.
Le renommage final n'a lieu qu'apres ces controles.
Le recepteur met a jour registre, manifeste, README, prompts-exacts.json et journal-production.jsonl.
Attendre le resultat archive=<chemin> et imagesCompletes=<nombre> avant de compter l'image.
Les metadonnees .incoming.json permettent de retrouver le prompt, le fichier source et le hash en cas de coupure.
Si une source locale a disparu, rechercher la sortie imagegen sauvegardee par son nom exact dans Library.
Ne jamais regenerer une variante deja complete ; une correction est une v2.

## Incidents et fin de passage
Maximum deux tentatives de generation par combinaison et par passage. Ne pas boucler sur un echec.
Quota temporaire : consigner l'erreur exacte et reprendre au passage suivant, sans affirmer un quota deduit.
Imagegen indisponible en tache planifiee ou acces connecteur bloque : consigner, avertir une fois,
puis mettre cette automation en pause pour eviter les passages vides. Ne pas promettre sa reussite.
Source introuvable : consigner l'exception, traiter un autre modele dont la source existe, ne pas inventer.
Un modele bloque ne doit pas empecher tous les autres ; le bilan doit distinguer manque et bloque.
Ne pas lire tout le journal ni recalculer tous les hashes : verifier le nouveau lot seulement.
Fin : fermer le recepteur, mettre ETAT.md et REPRISE-SERIE.md a jour, commit local ASCII par modele.
Pas de push implicite, publication, build ou modification de granits.json.
Rapport bref : images ajoutees, total archive, prochain modele et tout blocage reel.
A 270/270 : verifier la couverture 27x10 et les manifestes, fermer le recepteur,
desactiver cette automation via automations.update(is_enabled=false), puis livrer le bilan final.

## References et memoire pendant les lots enchaines

Pour les fichiers locaux utilises comme references, lire view_image avec detail=original si une miniature apparait. Verifier le contenu, puis fournir les chemins locaux a imagegen quand toutes les references sont locales. Sinon, reemettre exactement le master et la texture, dans cet ordre, avant num_last_images_to_include=2.

Apres l accuse final de sauvegarde, conserver chemin, hash, prompt et controle visuel ; liberer les grandes donnees base64 temporaires pour ne pas accumuler toute la serie en memoire. Le PNG original et sa copie VPS restent intacts.

Les blocs de transfert de 512000 caracteres base64 ont ete verifies pendant cette continuation. Les envois restent strictement sequentiels. Lire l accuse final et ne compter l image qu apres validation SHA256 et PNG par le recepteur.
