# Contrat du formulaire de devis

Ce document décrit ce que le formulaire `/devis/` envoie, et ce que la fonction qui le reçoit doit
faire. C'est la référence de l'étape **E6**.

- Formulaire : `src/pages/devis.astro` (écrit à l'étape E4, passe 4).
- Réglages : `src/config/devis.ts` — `envoiActif`, `endpoint`, limites de fichiers, délai anti-robot,
  messages affichés.
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

### Gravure et personnalisation

| Nom | Type | Obligatoire | Notes |
| --- | --- | --- | --- |
| `gravure` | texte long | non | Noms, dates, épitaphe. Garder les retours à la ligne. |
| `fichiers` | fichiers | non | Champ répété : plusieurs valeurs sous le même nom. |

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

## Ce qui reste à faire en E6

- Écrire `functions/api/devis.ts` (Cloudflare Pages Functions).
- Variables d'environnement : adresse de destination, clé API Resend, clés Turnstile.
- Passer `envoiActif` à `true` dans `src/config/devis.ts`.
- Ajouter le widget Turnstile à l'emplacement commenté de `src/pages/devis.astro`.
- Essayer les deux chemins : avec et sans JavaScript.
