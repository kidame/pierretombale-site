/**
 * LES BORNES DU CONFIGURATEUR VISUEL (`/personnaliser/<slug>/`).
 *
 * Trois chiffres, decides le 14.10.2026 (Thomas, version « audacieuse » du
 * point 3) : trois zones de texte libres au maximum, 120 caracteres et quatre
 * lignes par zone. **A confirmer avec celui qui grave**, comme les listes de
 * `src/data/personnalisation.ts`.
 *
 * POURQUOI UN FICHIER A PART. Ces bornes sont lues par le script du
 * configurateur, donc par le NAVIGATEUR (`src/scripts/configurateur/zones.ts`).
 * En les laissant dans `personnalisation.ts`, l'ilot emportait au passage les
 * six polices, les finitions et les motifs du formulaire de devis : des donnees
 * dont le canvas n'a pas besoin, puisque la page lui inline deja ce qu'il lui
 * faut. Un fichier qui ne contient que des nombres ne coute rien.
 *
 * Le formulaire `/devis/`, lui, ne depend pas de ces bornes : il garde ses
 * quatre lignes a police commune (`lignesInscription` et `LIGNE_LONGUEUR_MAX`
 * de `src/data/personnalisation.ts`).
 */

/** Nombre de zones de texte au maximum sur une stele. */
export const ZONES_MAX = 3;

/** Longueur maximale d'une zone de texte, en caracteres. */
export const ZONE_LONGUEUR_MAX = 120;

/** Nombre de lignes au maximum dans une zone de texte. */
export const ZONE_LIGNES_MAX = 4;
