# Contrat du formulaire de devis

Ce document décrit ce que le formulaire `/devis/` envoie, et ce que la fonction qui le reçoit doit
faire. C'est la référence de l'étape **E6**.

- Formulaire : `src/pages/devis.astro` (écrit à l'étape E4 passe 4, complété à l'étape E5 par la
  personnalisation guidée).
- Réglages : `src/config/devis.ts` — `envoiActif`, `endpoint`, limites de fichiers, délai anti-robot,
  messages affichés.
- Choix de gravure : `src/data/personnalisation.ts` — polices, hauteurs de lettres, finitions,
  motifs. Source unique des valeurs autorisées, partagée avec le configurateur à venir.
- Destinataire à écrire en E6 : fonction Cloudflare Pages `functions/api/devis.ts`, qui envoie un
  courriel par **Resend** vers une adresse donnée en **variable d'environnement** (décision de Thomas
  du 13.10.2026 : **pas de n8n**).

Renommer un champ se fait des deux côtés à la fois : ici et dans `src/pages/devis.astro`.

## Requête

- Méthode : `POST`
- Adresse : `/api/devis` (`devisConfig.endpoint`)
- Encodage : `multipart/form-data` (il y a des fichiers)
- Deux chemins possibles, à accepter tous les deux :
  1. **avec JavaScript** : `fetch` avec un `FormData`, attend du JSON en réponse ;
  2. **sans JavaScript** : envoi natif du navigateur. La fonction doit alors répondre par une
     redirection `303` vers `/devis/merci/` en cas de succès, et vers `/devis/` en cas d'erreur.
     Le JSON décrit plus bas sert au premier cas. Distinguer les deux par l'en-tête `Accept`
     (`application/json` est envoyé par le `fetch`) ou par `Sec-Fetch-Mode`.

## Champs

### Vos coordonnées

| Nom | Type | Obligatoire | Notes |
| --- | --- | --- | --- |
| `nom` | texte | **oui** | Nom et prénom de la personne qui écrit. |
| `email` | courriel | **oui** | Seule voie de réponse. À revalider côté serveur. |
| `telephone` | texte | non | Format libre : ne pas rejeter sur la forme. |
| `localite` | texte | **oui** | Commune de la famille, pour situer le déplacement. |

### Le monument

| Nom | Type | Obligatoire | Valeurs |
| --- | --- | --- | --- |
| `typeDemande` | choix unique | **oui** | `nouveau`, `inscription`, `autre` |
| `famille` | choix unique | non | `monument`, `cineraire`, ou vide (« Je ne sais pas ») |
| `modele` | choix unique | non | le `slug` d'une fiche de `src/content/products`, ou vide |
| `granit` | choix unique | non | l'`id` d'un granit de `src/data/granits.json`, ou vide |
| `cimetiere` | texte | non | Nom du cimetière. |
| `communeCimetiere` | texte | non | Commune du cimetière (son règlement s'applique). |

Les listes `modele` et `granit` sont générées au build : une valeur inconnue signifie soit une
demande forgée, soit un catalogue modifié depuis l'affichage de la page. Ne pas faire échouer la
demande pour autant : transmettre la valeur brute dans le courriel et la signaler.

### L'inscription (personnalisation guidée, étape E5)

Les valeurs autorisées sont les **identifiants de `src/data/personnalisation.ts`** — c'est la source
unique, lue par la page de devis aujourd'hui et par le configurateur visuel demain. Une liste
changée là-bas change ici : la fonction ne doit jamais contenir sa propre copie de ces listes, elle
les importe.

Quatre lignes fixes, numérotées de 1 à 4. Pour chaque `<n>` de 1 à 4 :

| Nom | Type | Obligatoire | Valeurs |
| --- | --- | --- | --- |
| `ligne<n>_texte` | texte | non | 60 caractères au maximum (`LIGNE_LONGUEUR_MAX`). |
| `ligne<n>_police` | choix unique | non | `cinzel`, `marcellus`, `eb-garamond`, `jost`, `great-vibes`, `pinyon-script` (`policeIds`) |
| `ligne<n>_hauteur` | nombre | non | `30`, `40`, `50`, `60` — en millimètres (`hauteursLettresMm`) |

Soit douze champs : `ligne1_texte`, `ligne1_police`, `ligne1_hauteur`, … `ligne4_hauteur`.

- La ligne 1 est présentée comme étant « le plus souvent le nom », la ligne 2 « le plus souvent les
  dates ». Ce ne sont que des libellés d'aide : **rien ne garantit** que la ligne 1 contienne un nom.
- `ligne<n>_police` et `ligne<n>_hauteur` sont **toujours envoyés**, même quand la ligne est vide :
  ce sont des `select` avec une valeur par défaut (police `cinzel` ; hauteurs 50, 40, 30, 30 mm).
  Une ligne dont le `texte` est vide n'a pas d'inscription : ignorer sa police et sa hauteur.
- Longueur à revérifier côté serveur : le `maxlength` du HTML ne protège de rien.

| Nom | Type | Obligatoire | Valeurs |
| --- | --- | --- | --- |
| `finition` | choix unique | non | `blanc`, `dore`, `feuille-or` (`finitionIds`), ou **vide** (« Je ne sais pas encore ») |
| `motif` | choix unique | non | `aucun`, `croix`, `colombe`, `rose`, `coeur`, `arbre`, `autre`, `dessin-fourni` (`motifIds`) |
| `gravure_precisions` | texte long | non | Épitaphe longue, disposition, orthographe exacte. Garder les retours à la ligne. |
| `fichiers` | fichiers | non | Champ répété : plusieurs valeurs sous le même nom. |

- `finition` vide est le choix par défaut : la famille n'a pas tranché, ce n'est pas une erreur.
- `motif` vaut `aucun` par défaut.
- `motif` = `autre` ou `dessin-fourni` : la page rappelle à la famille de décrire le symbole dans
  `gravure_precisions` et de joindre son dessin dans `fichiers`. Le courriel doit **le signaler**,
  même si les deux champs sont vides : c'est le cas où il faut rappeler la famille.
- Le champ `gravure` de l'étape E4 (un seul texte libre pour toute la gravure) **n'existe plus** :
  il a été remplacé par les douze champs de ligne et par `gravure_precisions`.

Une valeur inconnue dans `ligne<n>_police`, `ligne<n>_hauteur`, `finition` ou `motif` signifie soit
une demande forgée, soit une liste modifiée depuis l'affichage de la page. Même règle que pour
`modele` et `granit` : **ne pas faire échouer la demande**, transmettre la valeur brute dans le
courriel et la signaler.

Aucun de ces choix n'engage : seul le **bon à tirer** engage, et la page le dit sous l'aperçu
(`MENTION_APERCU` dans `src/data/personnalisation.ts`).

Limites des fichiers (`fichiersDevis` dans `src/config/devis.ts`), vérifiées par le JavaScript et **à
revérifier côté serveur** :

- 3 fichiers au maximum ;
- 8 Mo (8 388 608 octets) au total, pas par fichier ;
- types acceptés : `image/jpeg`, `image/png`, `image/webp`, `application/pdf`.

Attention à la limite de Cloudflare Pages Functions sur la taille du corps de la requête, et à celle
des pièces jointes de Resend (autour de 40 Mo par message, mais l'encodage base64 ajoute un tiers) :
8 Mo au total passent dans les deux.

### Message

| Nom | Type | Obligatoire |
| --- | --- | --- |
| `message` | texte long | non |

### Consentement

| Nom | Type | Obligatoire | Valeur |
| --- | --- | --- | --- |
| `consentement` | case à cocher | **oui** | `oui` quand elle est cochée ; le champ est **absent** sinon |

Une case non cochée n'est pas envoyée par le navigateur : traiter l'absence du champ comme un refus
et répondre `400`.

### Anti-spam

| Nom | Type | Attendu | Que faire sinon |
| --- | --- | --- | --- |
| `societe` | piège (honeypot) | vide | Non vide = robot. Répondre `200 {"ok":true}` sans rien envoyer. |
| `horodatage` | millisecondes epoch | posé par le JavaScript au chargement de la page | Voir ci-dessous. |

- `horodatage` : si `Date.now() - horodatage < 3000` (`delaiMinimalMs`), c'est un robot : même
  traitement que le piège.
- `horodatage` **vide** est normal : c'est un envoi sans JavaScript. Ne pas rejeter ; dans ce cas
  Turnstile fait seul le travail.
- Cloudflare Turnstile sera ajouté en E6 : le widget déposera un champ `cf-turnstile-response`, à
  vérifier auprès de `https://challenges.cloudflare.com/turnstile/v0/siteverify` avec la clé secrète
  **lue dans une variable d'environnement**. Aucune clé, publique ou secrète, n'entre dans le dépôt.
- Répondre `200 {"ok":true}` à un robot (plutôt qu'une erreur) évite de lui apprendre ce qui a été
  détecté. Si le doute est possible, préférer envoyer le courriel avec une mention « demande
  suspecte » : perdre une demande de famille est plus grave que recevoir un message publicitaire.

## Réponses

| Code | Corps | Quand |
| --- | --- | --- |
| `200` | `{"ok":true}` | Le courriel est parti (ou la demande a été écartée comme robot). |
| `400` | `{"ok":false,"erreurs":{"<champ>":"<message en français>"}}` | Un champ obligatoire manque ou est invalide. |
| `413` | `{"ok":false,"erreurs":{"fichiers":"..."}}` | Fichiers trop nombreux ou trop lourds. Un `400` sur le champ `fichiers` fait aussi l'affaire. |
| `429` | `{"ok":false,"message":"..."}` | Trop de demandes depuis la même adresse IP. Limite à décider en E6. |
| `500` | `{"ok":false,"message":"..."}` | Panne : Resend injoignable, clé absente, erreur inattendue. |

Côté formulaire (`src/pages/devis.astro`) :

- `200` avec `ok: true` → le navigateur va sur `/devis/merci/` ;
- une réponse qui contient `erreurs` → chaque message est affiché **sous le champ concerné** (la clé
  doit donc être exactement le nom du champ ci-dessus) ;
- toute autre réponse, ou une erreur réseau → message général « Votre demande n'a pas pu être
  transmise » et le bouton redevient actif.

Les messages de la clé `erreurs` sont affichés tels quels à la famille : ils doivent être en
français, courts, et dire quoi corriger.

## Courriel à envoyer

Non figé, à décider en E6, mais trois points découlent de ce formulaire :

1. Destinataire = variable d'environnement (jamais écrit dans le dépôt).
2. `Reply-To` = le champ `email`, pour qu'une réponse parte directement à la famille.
3. Les fichiers joints partent en pièces jointes du courriel : rien n'est stocké côté site.

## Configurateur futur

Le configurateur visuel (Konva) décrit dans `docs/CONFIGURATEUR-FUTUR.md` **ne crée aucun champ
nouveau** : il doit produire exactement les champs de ce contrat, avec les mêmes noms et les mêmes
valeurs autorisées — `ligne1_texte` … `ligne4_hauteur`, `finition`, `motif`,
`gravure_precisions`, plus `modele` et `granit`. C'est pour cela que la page de devis et le
configurateur lisent la même source, `src/data/personnalisation.ts`.

Conséquences :

- la fonction `/api/devis` écrite en E6 n'aura **rien à changer** quand le configurateur arrivera ;
- une demande venue du configurateur et une demande venue du formulaire donnent le **même courriel**,
  donc la même fiche de travail pour la gravure ;
- un champ propre au configurateur (une image PNG d'aperçu, par exemple) viendrait **s'ajouter** à
  cette liste, sans jamais remplacer les champs de texte : un PNG ne se relit pas, et c'est le texte
  qui part à la gravure.

## Ce qui reste à faire en E6

- Écrire `functions/api/devis.ts` (Cloudflare Pages Functions).
- Variables d'environnement : adresse de destination, clé API Resend, clés Turnstile.
- Passer `envoiActif` à `true` dans `src/config/devis.ts`.
- Ajouter le widget Turnstile à l'emplacement commenté de `src/pages/devis.astro`.
- Essayer les deux chemins : avec et sans JavaScript.
