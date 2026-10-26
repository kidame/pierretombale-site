# Contrat du formulaire de devis

Ce document décrit ce que le formulaire `/devis/` envoie, et ce que la fonction qui le reçoit doit
faire. C'est la référence de l'étape **E6**.

- Formulaire : `src/pages/devis.astro` (écrit à l'étape E4 passe 4, complété à l'étape E5 par la
  personnalisation guidée, simplifié à l'étape E5 passe 2 du 14.10.2026).
- **E5 passe 3 (14.10.2026) n'ajoute, ne retire et ne renomme AUCUN champ** — vérifié dans `dist` :
  les 29 champs listés ci-dessous sont exactement ceux que la page envoie. Les trois sous-passes ont
  changé la présentation seulement : choix du modèle en cartes (A), découpage en quatre étapes et
  récapitulatif (B), lisibilité et zones cliquables (C). L'étape en cours est gardée dans le
  brouillon du navigateur sous la clef `__etape`, qui **ne part jamais** avec la demande.
- Réglages : `src/config/devis.ts` — `envoiActif`, `endpoint`, limites de fichiers, délai anti-robot,
  format de la référence, clé du brouillon, messages affichés.
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
| `telephone` | texte | non | Format libre : ne pas rejeter sur la forme. Voir `recontact`. |
| `localite` | texte | **oui** | Commune de la famille, pour situer le déplacement. |
| `recontact` | choix unique | non | `telephone` ou `email` ; **`email` par défaut** |
| `quandAppeler` | texte | non | Texte libre (« le matin », « après 17 h »). |

- `recontact` dit comment la famille **préfère** être recontactée. C'est une préférence, pas une
  contrainte : l'adresse e-mail reste obligatoire, parce qu'elle est la seule voie de réponse sûre.
- `recontact` = `telephone` : la page rend alors le champ `telephone` **nécessaire** (en JavaScript
  seulement) et déplie `quandAppeler`. **À revérifier côté serveur** : `recontact` = `telephone`
  avec un `telephone` vide est une demande incohérente — ne pas la refuser, mais la signaler dans le
  courriel, puisqu'il faudra répondre par e-mail.
- `recontact` = `email` (ou vide) : `telephone` reste facultatif, et `quandAppeler` doit être
  ignoré s'il arrive quand même rempli (la page le replie mais ne le vide pas).

### Votre demande

| Nom | Type | Obligatoire | Valeurs |
| --- | --- | --- | --- |
| `typeDemande` | choix unique | **oui** | `nouveau`, `inscription`, `autre` |
| `cimetiere` | texte | non | Nom du cimetière. |
| `communeCimetiere` | texte | non | Commune du cimetière (son règlement s'applique). |
| `datePoseSouhaitee` | date | non | `AAAA-MM-JJ` (`input type="date"`), ou vide |

- `datePoseSouhaitee` : une date en tête, par exemple avant une cérémonie. Souhait, pas engagement.
  Format libre à l'arrivée : un navigateur ancien sans support de `type="date"` envoie du texte
  brut. Ne jamais refuser la demande sur cette forme ; transmettre la valeur telle quelle.

### Le monument

| Nom | Type | Obligatoire | Valeurs |
| --- | --- | --- | --- |
| `famille` | choix unique | non | `monument`, `cineraire`, ou vide (« Je ne sais pas ») |
| `modele` | choix unique | non | le `slug` d'une fiche de `src/content/products`, ou vide |
| `granit` | choix unique | non | l'`id` d'un granit de `src/data/granits.json`, ou vide |

Les listes `modele` et `granit` sont générées au build : une valeur inconnue signifie soit une
demande forgée, soit un catalogue modifié depuis l'affichage de la page. Ne pas faire échouer la
demande pour autant : transmettre la valeur brute dans le courriel et la signaler.

`granit` est présenté en **pastilles de couleur** depuis le 14.10.2026 (des boutons radio habillés),
et non plus en liste déroulante. Les valeurs envoyées sont inchangées : l'`id` du granit, ou vide
pour « Je ne sais pas encore », qui reste le choix par défaut.

`famille` et `modele` sont présentés de la même façon depuis le 14.10.2026 (E5 passe 3) : `famille`
en **trois onglets** (boutons radio larges) et `modele` en **grille de cartes** avec la vignette du
catalogue (`src/components/ChoixModele.astro`), et non plus en listes déroulantes. **Les valeurs
envoyées ne changent pas.** Pour `modele`, la valeur **vide** signifie « Je ne sais pas encore,
conseillez-moi » : c'est le choix par défaut, une réponse normale, et non l'absence de réponse — la
famille attend alors une proposition de notre part. Il y a une carte « conseillez-moi » par famille,
mais toutes portent la même valeur vide : la demande ne dit donc jamais laquelle a été touchée.

### Sections repliées selon `typeDemande`

En JavaScript, la page replie les sections inutiles — et les **désactive** (`fieldset.disabled`),
donc leurs champs **ne sont pas envoyés du tout** :

| `typeDemande` | Section « Le monument » | Section « L'inscription » (+ finition, motif, aperçu) |
| --- | --- | --- |
| `nouveau` | envoyée | envoyée |
| `inscription` | **absente** | envoyée |
| `autre` | **absente** | **absente** |

Conséquences pour la fonction : ne jamais supposer qu'un champ est présent. Un `famille`, `granit`,
`police`, `ligne<n>_hauteur`, `finition` ou `motif` **manquant** est le cas normal d'une demande
repliée, pas une erreur ni une demande forgée. Sans JavaScript, tout est envoyé : la fonction doit
accepter les deux formes sans distinction.

`typeDemande` = `inscription` affiche aussi, près du champ `fichiers`, « Une photo du monument
existant nous aide beaucoup ».

### L'inscription (personnalisation guidée, étape E5)

Les valeurs autorisées sont les **identifiants de `src/data/personnalisation.ts`** — c'est la source
unique, lue par la page de devis aujourd'hui et par le configurateur visuel demain. Une liste
changée là-bas change ici : la fonction ne doit jamais contenir sa propre copie de ces listes, elle
les importe.

**Un seul style d'écriture pour tout le monument** (décision de Thomas du 14.10.2026 : c'est la
pratique courante des marbriers, et une police par ligne demandait quatre décisions à une famille en
deuil) :

| Nom | Type | Obligatoire | Valeurs |
| --- | --- | --- | --- |
| `police` | choix unique | non | `cinzel`, `marcellus`, `eb-garamond`, `jost`, `great-vibes`, `pinyon-script` (`policeIds`) ; **`cinzel` par défaut** |

Les six polices sont présentées en échantillons : chaque nom est écrit dans sa propre police, et
l'échantillon **est** le bouton radio.

Puis quatre lignes fixes, numérotées de 1 à 4. Pour chaque `<n>` de 1 à 4 :

| Nom | Type | Obligatoire | Valeurs |
| --- | --- | --- | --- |
| `ligne<n>_texte` | texte | non | 60 caractères au maximum (`LIGNE_LONGUEUR_MAX`). |
| `ligne<n>_hauteur` | nombre | non | `30`, `40`, `50`, `60` — en millimètres (`hauteursLettresMm`) |

Soit neuf champs pour l'inscription : `police`, puis `ligne1_texte`, `ligne1_hauteur`, …
`ligne4_hauteur`.

- `ligne<n>_police` **N'EXISTE PLUS** (supprimé le 14.10.2026) : il est remplacé par le champ unique
  `police`. Une demande qui porterait encore un `ligne<n>_police` vient d'une page en cache : la
  fonction l'ignore.
- La ligne 1 est présentée comme étant « souvent le nom », la ligne 2 « souvent les dates », les
  lignes 3 et 4 comme une épitaphe. Ce ne sont que des libellés d'aide : **rien ne garantit** que la
  ligne 1 contienne un nom.
- `ligne<n>_hauteur` est **toujours envoyé** quand la section est affichée, même si la ligne est
  vide : c'est un `select` avec une valeur par défaut (50, 40, 30, 30 mm). Une ligne dont le `texte`
  est vide n'a pas d'inscription : ignorer sa hauteur.
- **Affichage en centimètres, envoi en millimètres.** La page écrit « 3 cm », « 4 cm », « 5 cm »,
  « 6 cm » (`hauteurLabel`), mais envoie 30, 40, 50 et 60 : l'unité du métier ne change pas.
- Les lignes 3 et 4 sont repliées derrière un bouton « Ajouter une ligne » quand le JavaScript
  fonctionne — elles sont toujours **présentes dans la page et envoyées**, seulement masquées. Sans
  JavaScript, les quatre lignes sont visibles d'emblée.
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
  il a été remplacé par les champs de ligne et par `gravure_precisions`.

Une valeur inconnue dans `police`, `ligne<n>_hauteur`, `finition` ou `motif` signifie soit
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

## Référence de demande attribuée par le serveur

Chaque demande acceptée reçoit un **numéro de demande**, dit référence, au format
`PT-AAAAMMJJ-xxxx` (`referenceDevis` dans `src/config/devis.ts`) : `PT`, la date du jour, puis
quatre caractères tirés au hasard dans un alphabet sans `0`, `O`, `1` ni `I` — une référence se
dicte au téléphone. Exemple : `PT-20261014-7KQ2`.

- **Le serveur l'attribue, jamais le navigateur.** Un numéro posé côté navigateur se duplique (deux
  onglets ouverts), se perd (brouillon restauré) et se laisse forger. Le formulaire n'envoie donc
  aucune référence, et la fonction ne doit pas en attendre.
- La fonction la tire au moment où elle accepte la demande, et l'écrit : dans l'objet du courriel aux
  associés, dans le corps du courriel, et dans l'accusé de réception à la famille (« votre demande
  porte la référence … ») pour qu'elle puisse la citer en rappelant.
- Elle ne garantit pas l'unicité absolue : rien n'est stocké côté site. La date plus quatre
  caractères suffit à distinguer les demandes d'une même journée.
- À décider en E6 : la faire figurer ou non sur `/devis/merci/`. Aujourd'hui cette page ne reçoit
  rien du serveur (redirection simple) ; l'y afficher demanderait de la passer en paramètre
  d'adresse, ce qui la rendrait devinable. Le courriel suffit.

## Brouillon conservé dans le navigateur

Depuis le 14.10.2026, la page garde un brouillon dans le `localStorage` du navigateur de la famille
(clé `cleBrouillonDevis`, `pt-devis-brouillon`) : les champs texte, les listes et les choix, et
**rien d'autre**.

- Jamais les fichiers joints : le navigateur ne le permet pas, et nous n'en voulons pas.
- Jamais le consentement : il doit être donné à chaque envoi.
- Rien ne sort de la machine de la famille : ce n'est pas un enregistrement côté site, et cela ne
  change **aucun champ** de ce contrat.
- Le brouillon est effacé dès que la demande est partie (réponse `200 ok:true`), et par le lien
  « Effacer » du message « Nous avons retrouvé votre brouillon ».

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
4. La référence `PT-AAAAMMJJ-xxxx` figure dans l'objet et dans le corps, ainsi que dans l'accusé de
   réception à la famille.
5. `recontact` (et `quandAppeler` le cas échéant) se lisent en tête du courriel : c'est la première
   chose à savoir pour répondre.

## Configurateur futur

Le configurateur visuel (Konva) décrit dans `docs/CONFIGURATEUR-FUTUR.md` **ne crée aucun champ
nouveau** : il doit produire exactement les champs de ce contrat, avec les mêmes noms et les mêmes
valeurs autorisées — `police`, `ligne1_texte` … `ligne4_hauteur`, `finition`, `motif`,
`gravure_precisions`, plus `modele` et `granit`. C'est pour cela que la page de devis et le
configurateur lisent la même source, `src/data/personnalisation.ts`.

Conséquences :

- la fonction `/api/devis` écrite en E6 n'aura **rien à changer** quand le configurateur arrivera ;
- une demande venue du configurateur et une demande venue du formulaire donnent le **même courriel**,
  donc la même fiche de travail pour la gravure ;
- un champ propre au configurateur (une image PNG d'aperçu, par exemple) viendrait **s'ajouter** à
  cette liste, sans jamais remplacer les champs de texte : un PNG ne se relit pas, et c'est le texte
  qui part à la gravure.

### Les deux champs du configurateur (passe E, 26.10.2026)

Quand la famille arrive de `/personnaliser/<slug>/` par « Demander un devis avec cette stèle »,
le script `src/scripts/devis/scene.ts` remplit les champs du contrat d'après sa composition
(`modele`, `granit`, `typeDemande` = `nouveau`, `police`, `ligne1..4` avec leurs tailles,
`finition`, `motif`, `gravure_precisions` avec le détail complet en cm) et ajoute **deux champs
facultatifs** :

| Nom | Type | Obligatoire | Notes |
| --- | --- | --- | --- |
| `configurateur_scene` | texte (JSON) | non | La scène en cm : `SceneDevis` de `src/scripts/configurateur/export.ts` (version, modèle, matière, mode, champs saisis, textes avec police/taille/finition/position/stèle, motifs avec taille et position, motif à créer, surfaces). Sans l'image. Vide quand la demande ne vient pas du configurateur. |
| `configurateur_apercu` | fichier (`image/jpeg`) | non | L'aperçu tel que la famille l'a vu, 1200 px de large, 50 à 150 Ko. À joindre au courriel comme les `fichiers`, mais **hors du compte des 3 fichiers** et de leur taille totale. Absent sans JavaScript ou si le navigateur n'a pas pu le produire. |

Règles pour la fonction : le texte des lignes et `gravure_precisions` font foi (un JPEG ne se relit
pas) ; le JSON est là pour l'atelier et pour relire les positions ; un JSON illisible ou d'une
autre `version` se transmet tel quel et se signale, sans refuser la demande. Les quatre lignes ne
portent que les quatre premières lignes de la composition : le reste est dans les précisions.

## Ce qui reste à faire en E6

- Écrire `functions/api/devis.ts` (Cloudflare Pages Functions).
- Variables d'environnement : adresse de destination, clé API Resend, clés Turnstile.
- Passer `envoiActif` à `true` dans `src/config/devis.ts`.
- Ajouter le widget Turnstile à l'emplacement commenté de `src/pages/devis.astro`.
- Essayer les deux chemins : avec et sans JavaScript.
