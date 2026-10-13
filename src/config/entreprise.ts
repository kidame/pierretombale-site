/**
 * Les coordonnées de l'entreprise : source unique.
 *
 * À REMPLIR PAR LES ASSOCIÉS ; NE JAMAIS RECOPIER LES VALEURS PROVISOIRES DU
 * PRODUCTION-SPEC (`docs/production-spec-pierretombalech.json` contient un
 * téléphone, un NPA, un siège et un nom inventés par l'outil de génération).
 *
 * Tant qu'une valeur vaut `null`, le site ne doit rien afficher à sa place :
 * pas de texte d'attente, pas de lien mort, rien dans les données structurées.
 * Un site funéraire qui affiche un faux numéro perd la confiance des familles.
 *
 * Le nom affiché vient encore de `siteConfig.name` (étape E4) : `entreprise.nom`
 * prendra le relais quand les associés auront tranché le nom définitif.
 */

export interface Entreprise {
  /** Raison sociale, telle qu'elle apparaîtra au registre du commerce. */
  nom: string | null;
  /** Format international, ex. "+41 32 000 00 00". */
  telephone: string | null;
  email: string | null;
  /** Rue et numéro du siège. */
  rue: string | null;
  /** Code postal suisse, ex. "2000". */
  npa: string | null;
  localite: string | null;
  /** Abréviation du canton, ex. "NE". */
  canton: string | null;
}

export const entreprise: Entreprise = {
  nom: null,
  telephone: null,
  email: null,
  rue: null,
  npa: null,
  localite: null,
  canton: null,
};

/**
 * Dit si une coordonnée est renseignée. C'est un garde de type : après
 * `if (renseigne(entreprise.email))`, TypeScript sait que la valeur est une
 * chaîne. Une chaîne vide ou blanche compte comme non renseignée, pour qu'un
 * champ laissé à `""` ne produise pas un lien vide.
 */
export function renseigne(valeur: string | null | undefined): valeur is string {
  return typeof valeur === "string" && valeur.trim().length > 0;
}

/** Raccourci pour tester une coordonnée par son nom de champ. */
export function aCoordonnee(cle: keyof Entreprise): boolean {
  return renseigne(entreprise[cle]);
}

/** Vrai si aucune coordonnée n'est connue : l'état du départ. */
export function aucuneCoordonnee(): boolean {
  return !(Object.keys(entreprise) as Array<keyof Entreprise>).some(aCoordonnee);
}

/**
 * L'adresse postale pour les données structurées (schema.org PostalAddress),
 * limitée aux champs connus. Retourne `undefined` si on ne sait rien : il vaut
 * mieux une fiche Organization sans adresse qu'une adresse inventée.
 */
export function adressePostaleJsonLd():
  | {
      "@type": "PostalAddress";
      streetAddress?: string;
      postalCode?: string;
      addressLocality?: string;
      addressRegion?: string;
      addressCountry: "CH";
    }
  | undefined {
  if (!["rue", "npa", "localite", "canton"].some((cle) => aCoordonnee(cle as keyof Entreprise))) {
    return undefined;
  }

  return {
    "@type": "PostalAddress",
    ...(renseigne(entreprise.rue) ? { streetAddress: entreprise.rue } : {}),
    ...(renseigne(entreprise.npa) ? { postalCode: entreprise.npa } : {}),
    ...(renseigne(entreprise.localite) ? { addressLocality: entreprise.localite } : {}),
    ...(renseigne(entreprise.canton) ? { addressRegion: entreprise.canton } : {}),
    addressCountry: "CH",
  };
}
