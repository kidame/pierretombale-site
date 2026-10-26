# Mise en ligne sur Cloudflare Pages

Etat au 26.10.2026 (soir, confirme par Thomas) : EN PRODUCTION.
- Production : https://www.pierretombale.ch (projet Pages pierretombale-site, branche live).
- HTTP et HTTPS sans www redirigent en 301 vers HTTPS avec www, chemin et parametres conserves.
- Previsualisations (main et autres branches) protegees par Cloudflare Access ; compte autorise :
  hello.puglisi@gmail.com.
- Search Console : propriete Domaine pierretombale.ch validee sur ce compte ; sitemap-index.xml et
  sitemap-images.xml soumis, statut "Operation effectuee". Garder le TXT google-site-verification
  dans la zone Cloudflare. Indexation Google pas encore confirmee.
- Recette restante avant de declarer E7 termine : controles visuels, configurateur au navigateur,
  Lighthouse mobile, verification SEO finale. Le formulaire de devis n'envoie rien (E6).
- Verifie par Claude le 26.10 a 20 h (HTTP) : 200 sur /, /personnaliser/douceur/, robots.txt ;
  aucun X-Robots-Tag sur le domaine, meta noindex seulement sur les configurateurs ; 404 reelle ;
  sitemap pages 36 URL, sitemap images 28 pages ; polices de gravure et chunk Konva servis ;
  cache images 7 jours ; main.pierretombale-site.pages.dev renvoie vers la connexion Access.
Nom choisi dans l'ecran de creation : pierretombale-site.
Domaine confirme, achete chez Infomaniak : pierretombale.ch.
Adresse canonique : https://www.pierretombale.ch.
Pas de messagerie actuelle ; Thomas en ajoutera plus tard. Ne supprimer aucun DNS existant.

## 1. Organisation cible

- Depot : kidame/pierretombale-site. Travail uniquement sur main.
- Production Cloudflare : branche live.
- main et les autres branches : previsualisations, sans modifier la production.
- SITE identique en production et en preview, toujours le domaine canonique.
- Application GitHub Cloudflare installee par Thomas, acces au seul depot utile.
- Tous les clics de connexion, autorisation et DNS sont faits par Thomas.
- Aucun push sans instruction de Thomas pendant cette mission.
- Premier push sur live : accord explicite obligatoire avant execution.
- Netlify est abandonne pour les futures publications ; aucune copie manuelle de dist.
- Un seul agent a la fois dans le depot. Verifier l'etat Git avant toute modification.
- Aucun secret dans le depot ni dans la conversation. Pas de jeton pour le deploy Git.

## 2. Creation du projet

Lien direct si le nouvel ecran propose uniquement un Worker :
https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/pages

Selectionner GitHub, puis kidame/pierretombale-site. Le bon ecran annonce pages.dev,
une branche de production, un preset et un dossier de sortie ; aucune commande wrangler deploy.

| Champ | Valeur |
|---|---|
| Project name | pierretombale-site |
| Production branch | live |
| Framework preset | Astro |
| Build command | npm run build |
| Build output directory | dist |
| Root directory | laisser vide, racine du depot |
| NODE_VERSION | 22 |
| SITE | https://www.pierretombale.ch |

.node-version contient aussi 22. Les deux variables sont a configurer pour
Production ET Preview, dans le projet > Settings > Environment variables
(ou Variables and Secrets selon l'interface). Utiliser des variables de build.
Apres un changement de variable, reconstruire : les HTML statiques sont deja generes.

La branche live doit exister sur GitHub pour apparaitre dans le selecteur.
Apres accord explicite et controle du commit a publier, depuis main :
```bash
kumo git -C /home/kumo/atelier/repos/pierretombale-site push origin main
kumo git -C /home/kumo/atelier/repos/pierretombale-site push origin main:live
```
Ne pas faire de checkout live : le code est toujours modifie sur main.
Rafraichir ensuite le selecteur et choisir live AVANT Save and Deploy.
La creation de la branche seule ne change pas les DNS ; le premier Save and Deploy
rend la version accessible sur l'adresse principale pages.dev.
Ne jamais mettre main temporairement en production pour contourner le selecteur.

## 3. Previsualiser puis publier

Avant toute modification : git status, git pull --ff-only origin main.
Faire un commit par etape, avec un message en francais ASCII. Tester les changements.
Apres autorisation de push, git push origin main declenche une preview.
Dans Workers & Pages > pierretombale-site > Deployments, ouvrir le deploiement de main.
L'adresse exacte est fournie dans ses details. Alias attendu apres le premier build
de preview : https://main.pierretombale-site.pages.dev.
L'adresse https://pierretombale-site.pages.dev correspond a live, pas a main.

Avant le premier push de preview, activer Cloudflare Access pour ces apercus :
Settings > General > Enable access policy (libelle a confirmer sur l'ecran).
Restreindre l'acces au compte de Thomas. Verifier EN NAVIGATION PRIVEE qu'une
authentification est exigee sur l'alias main et sur l'URL de commit.
Le noindex empeche l'indexation, il ne rend jamais une page privee.
Cette option Pages ne protege pas l'adresse principale pages.dev ni le domaine public.

Pour publier une version validee de main :
```bash
kumo git -C /home/kumo/atelier/repos/pierretombale-site push origin main:live
```
Controler ensuite le succes du build de live et le commit actif dans Deployments.
Si Git refuse le push (historiques divergents), inspecter les commits ; aucun push force.

## 4. DNS, HTTPS et Search Console (a faire avec Thomas)

1. Dans Infomaniak, relever ou exporter TOUS les DNS et les serveurs de noms actuels :
   A, AAAA, CNAME, MX, TXT (SPF, DKIM, DMARC et validations), SRV, CAA, delegations.
   Les requetes publiques DNS ne remplacent pas cet inventaire.
2. Ajouter pierretombale.ch dans Cloudflare en plan Free, importer les DNS et comparer
   chaque nom, type, valeur et priorite avec l'inventaire. Completer les omissions.
   Garder les enregistrements de messagerie en DNS only quand ils ne supportent pas le proxy.
3. Verifier DNSSEC : s'il est actif chez l'ancien DNS, suivre la procedure de migration
   avant le changement de serveurs de noms pour eviter un DS obsolete et des SERVFAIL.
4. Chez Infomaniak, remplacer les nameservers par les DEUX fournis pour cette zone
   Cloudflare. Aucun transfert du domaine. Confirmer la propagation NS et l'etat Active.
5. Dans Pages > Custom domains, ajouter www.pierretombale.ch ET pierretombale.ch.
   Utiliser cet assistant avant d'ajouter les CNAME. Verifier l'activation des deux certificats.
6. Dans la zone Cloudflare, SSL/TLS : Full (strict). Activer la redirection HTTPS.
7. Creer une redirection 301 du seul hote pierretombale.ch vers
   https://www.pierretombale.ch en conservant chemin et parametres.
   Ne pas rediriger les apercus main/commit. Verifier l'absence de boucle.
8. Dans Search Console, creer la propriete Domaine pierretombale.ch. Thomas obtient
   le TXT google-site-verification, l'ajoute au DNS Cloudflare puis valide.
   Soumettre https://www.pierretombale.ch/sitemap-index.xml et
   https://www.pierretombale.ch/sitemap-images.xml. Verifier leur statut.
9. Documenter dans ETAT les nameservers, domaines actifs, preuve des controles et date.
   Ne cocher E7 fait qu'apres validation de toutes les etapes.

## 5. Indexation, cache et fonctions

public/_headers est copie dans dist/_headers par Astro. Il applique nosniff,
strict-origin-when-cross-origin, une restriction camera/micro/geolocalisation,
et X-Frame-Options SAMEORIGIN. Pas de CSP restrictive susceptible de casser le canvas
ou le futur Turnstile.

Aucun noindex HTTP global sur le domaine personnalise.
Les regles X-Robots-Tag ne ciblent que les hotes pages.dev, avec ou sans prefixe de preview.
Les meta noindex existantes de /personnaliser/* et /devis/merci/ sont volontaires.
La page 404 reste une erreur HTTP, elle ne doit pas servir un fallback SPA en 200.
robots.txt doit laisser explorer le site et annoncer les deux sitemaps.

Cache navigateur : /_astro/* un an et immutable (noms avec empreinte) ;
/images/* sept jours, sans immutable (noms actuellement stables).
Pour remplacer immediatement une image, lui donner un nouveau nom et corriger sa reference.
Une purge du CDN ne vide pas le cache deja present dans les navigateurs.

E6 est hors mission : envoiActif reste false.
Futur endpoint : functions/api/devis.ts a la RACINE du depot, pas dans dist.
L'integration Git Pages compile les Functions sans copie manuelle.
_headers ne s'applique pas aux reponses generees par Functions : definir leurs en-tetes
dans leurs Response. Prerequis E6 : compte Resend, verification SPF/DKIM du domaine,
adresse de destination et Turnstile ; secrets uniquement dans Cloudflare.

## 6. Revenir en arriere

Pages > projet > Deployments > All deployments > menu ... sur une version de
PRODUCTION reussie > Rollback to this deployment > confirmer.
Une preview n'est pas une cible de rollback. Il faut une ancienne production reussie.
Controler le site et noter le commit restaure. Le rollback Cloudflare ne modifie pas Git.
Corriger ou revertir le mauvais changement sur main, tester, puis republier main:live.
Le prochain deploiement live remplace la version restauree.

## 7. Si le build echoue

- Dans Deployments > deploiement en erreur > View build, lire la premiere erreur utile.
- Distinguer clone Git, installation npm, build Astro et publication des fichiers.
- Verifier live, le preset Astro, npm run build, dist, Node 22 et SITE.
- Verifier les droits de l'application GitHub sur ce depot. Aucun token a copier.
- Pour reproduire sur le VPS : build systemd-run --user --wait --pipe --collect,
  MemoryMax=1200M, repertoire du depot et PATH explicites, SITE canonique,
  lance en fond avec un fichier temoin ; voir ETAT pour le dernier resultat.
- Si necessaire, corriger sur main, tester puis commit et push autorise.
- Un echec de build ne doit pas conduire a mettre en ligne un dist ancien manuellement.

Premier build Cloudflare a chronometrer : clone + dependances + build.
Limite documentee : 20 minutes. docs/images-configurateur pese environ 754 Mo sur le VPS
et n'entre pas dans dist (~76 Mo), mais reste telecharge lors du clone.
Un .gitignore ou une suppression apres clone ne reduit pas le transfert deja effectue.
En cas d'echec au clone : relever le temps et l'erreur. Proposer de sortir les PNG sources
vers une archive durable hors depot, sous accord de Thomas (ils sont conserves par decision).
Un clone superficiel reduit l'historique, pas les PNG du commit courant ; aucun parametre
de clone Git natif Pages n'est suppose disponible sans verification.

## 8. Controles avant de dire que le site est en ligne

- Domaine canonique HTTPS valide, domaine nu en 301 vers www, chemins et query conserves.
- /, /robots.txt, /sitemap-index.xml, /sitemap-0.xml, /sitemap-images.xml.
- /monuments-funeraires/, /monuments-funeraires/douceur/, /nos-granits/, /devis/.
- /personnaliser/douceur/ : canvas et les six polices reellement charges au navigateur.
- /404 et une adresse inexistante : reponse 404, page personnalisee visible.
- En-tetes HTTP : noindex sur pages.dev, aucun noindex global sur le domaine.
- Canonicals, URLs de sitemaps et JSON-LD : www.pierretombale.ch.
- Lighthouse mobile sur le domaine reel : publier performance et accessibilite,
  URL, date et conditions du test ; aucun chiffre estime.
- Search Console Domaine valide, deux sitemaps soumis et etat note.
- Previews privees verifiees, pas simplement noindex.

## Sources techniques

- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/headers/
- https://developers.cloudflare.com/pages/configuration/build-image/
- https://developers.cloudflare.com/pages/configuration/preview-deployments/
- https://developers.cloudflare.com/pages/configuration/rollbacks/
- https://developers.cloudflare.com/pages/platform/limits/
