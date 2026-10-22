/**
 * Réglages du formulaire de devis.
 *
 * `envoiActif` est l'interrupteur du formulaire : tant qu'il vaut `false`, le
 * JavaScript valide la saisie puis affiche « L'envoi en ligne sera bientôt
 * disponible » et n'envoie RIEN. Il passera à `true` à l'étape E6, quand la
 * fonction Cloudflare Pages `/api/devis` existera (envoi par Resend vers une
 * adresse donnée en variable d'environnement, décision de Thomas du
 * 13.10.2026 : pas de n8n).
 *
 * Le contrat entre ce formulaire et cette fonction est écrit dans
 * `docs/devis-contrat.md` : tout changement de nom de champ ou de limite se
 * fait ici ET là-bas.
 */

export const devisConfig = {
  /** `false` : le formulaire valide mais n'envoie rien. `true` : envoi vers `endpoint`. */
  envoiActif: false,
  /** Fonction Cloudflare Pages qui recevra la demande (étape E6). */
  endpoint: "/api/devis",
} as const;

/**
 * Limites des fichiers joints (un dessin à graver, une photo du monument
 * existant, une esquisse). Vérifiées par le JavaScript avant l'envoi, et à
 * revérifier côté serveur en E6 : un navigateur sans JS ou modifié ne les
 * respecte pas.
 */
export const fichiersDevis = {
  nombreMax: 3,
  /** 8 Mo pour l'ensemble des fichiers, pas par fichier. */
  tailleTotaleMaxOctets: 8 * 1024 * 1024,
  /** Valeur de l'attribut `accept` de l'input, et liste de contrôle du JS. */
  typesAcceptes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
} as const;

/** `accept="..."` de l'input fichier, dérivé de `typesAcceptes`. */
export const acceptFichiers = fichiersDevis.typesAcceptes.join(",");

/** « 8 Mo », pour l'aide affichée sous le champ. */
export const tailleTotaleMaxLisible = `${Math.round(fichiersDevis.tailleTotaleMaxOctets / (1024 * 1024))} Mo`;

/**
 * Numéro de demande, dit « référence ».
 *
 * Format : `PT-AAAAMMJJ-xxxx` — `PT` pour le site, la date du jour de la
 * demande (année, mois, jour), puis quatre caractères tirés au hasard. Exemple :
 * `PT-20261014-7KQ2`. La date se lit à l'œil nu dans la référence, ce qui aide
 * au téléphone avec une famille qui rappelle.
 *
 * ATTRIBUÉ PAR LE SERVEUR, EN E6, par la fonction d'envoi — jamais par le
 * navigateur. Un numéro posé côté navigateur se duplique (deux onglets), se
 * perd (brouillon restauré) et se laisse forger. La fonction le tire au moment
 * où elle accepte la demande, l'écrit dans le courriel aux associés et dans
 * l'accusé de réception à la famille. Voir `docs/devis-contrat.md`.
 */
export const referenceDevis = {
  prefixe: "PT",
  /** Le format, en clair, tel qu'il est documenté. */
  format: "PT-AAAAMMJJ-xxxx",
  /** Nombre de caractères tirés au hasard à la fin. */
  longueurSuffixe: 4,
  /**
   * Caractères possibles du suffixe. Ni `0`/`O` ni `1`/`I` : une référence se
   * dicte au téléphone et se recopie à la main.
   */
  alphabetSuffixe: "23456789ABCDEFGHJKLMNPQRSTUVWXYZ",
} as const;

/**
 * Clé du brouillon conservé dans le `localStorage` du navigateur de la famille.
 * Le brouillon garde les champs texte, les listes et les choix, JAMAIS les
 * fichiers joints (le navigateur ne le permet pas, et nous n'en voulons pas) ni
 * le consentement, qui doit être donné à chaque envoi. Il est effacé dès que la
 * demande est partie.
 */
export const cleBrouillonDevis = "pt-devis-brouillon";

/**
 * Délai minimal entre l'affichage de la page et l'envoi. Un robot remplit et
 * poste en quelques millisecondes ; une famille met au moins quelques
 * secondes. Le champ caché `horodatage` porte l'heure d'affichage, posée par
 * le JavaScript : la page étant statique, elle ne peut pas venir du serveur.
 * La comparaison se fait côté serveur, en E6 : un robot peut mentir sur ce
 * champ, mais pas sur le fait qu'il ne tombe jamais juste.
 */
export const delaiMinimalMs = 3000;

/** Messages d'état du formulaire, au même endroit que l'interrupteur. */
export const messagesDevis = {
  envoiInactif:
    "L'envoi en ligne sera bientôt disponible. Votre demande n'a pas été transmise : merci de revenir dans quelques jours.",
  envoiEnCours: "Envoi en cours…",
  erreurReseau: "Votre demande n'a pas pu être transmise. Merci de réessayer dans un instant.",
  erreurSaisie: "Merci de corriger les champs signalés ci-dessous.",
  brouillonRetrouve: "Nous avons retrouvé votre brouillon.",
} as const;
