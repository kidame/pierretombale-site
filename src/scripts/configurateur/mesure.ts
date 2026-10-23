/**
 * LE MESUREUR : LA LARGEUR REELLE D'UN TEXTE DANS UNE POLICE DE GRAVURE.
 *
 * La composition (`composition.ts`) a besoin de savoir si « Camille MARTIN »
 * tient sur la stele en 5 cm. Seul le navigateur le sait : on mesure sur un
 * canvas hors ecran, avec la meme police que Konva, une fois les polices
 * chargees (`attendPolices`). Les mesures sont gardees en cache.
 *
 * Les tailles sont des hauteurs de MAJUSCULE : la taille de police vaut
 * `hauteur / capitale`, exactement comme dans `rendu.ts`.
 */
import type { Mesureur } from "./composition";
import { CAPITALE_MOYENNE, INTERLIGNE } from "./zones";

/** Taille de police de la mesure : assez grande pour etre precise. */
const TAILLE_MESURE_PX = 100;

/** Repli sans canvas (tests, vieux navigateur) : 0,6 em par caractere. */
const EM_PAR_CARACTERE_DE_SECOURS = 0.6;

export function creeMesureur(
  familleDePolice: (policeId: string) => string,
  capitaleDePolice: (policeId: string) => number,
): Mesureur {
  const contexte =
    typeof document === "undefined" ? null : document.createElement("canvas").getContext("2d");
  const cache = new Map<string, number>();

  /** Largeur du texte en em (taille de police = 1). */
  function largeurEm(texte: string, policeId: string): number {
    const cle = `${policeId}\u0000${texte}`;
    const connue = cache.get(cle);
    if (connue !== undefined) return connue;

    let em = texte.length * EM_PAR_CARACTERE_DE_SECOURS;
    if (contexte) {
      contexte.font = `normal normal ${TAILLE_MESURE_PX}px ${familleDePolice(policeId)}`;
      em = contexte.measureText(texte).width / TAILLE_MESURE_PX;
    }
    cache.set(cle, em);
    return em;
  }

  /** Taille de police en cm pour une majuscule de `hauteurMm`. */
  const policeCm = (policeId: string, hauteurMm: number) =>
    hauteurMm / 10 / (capitaleDePolice(policeId) || CAPITALE_MOYENNE);

  return {
    largeurCm: (texte, policeId, hauteurMm) =>
      largeurEm(texte, policeId) * policeCm(policeId, hauteurMm),
    hauteurBlocCm: (lignes, policeId, hauteurMm) =>
      lignes * policeCm(policeId, hauteurMm) * INTERLIGNE,
  };
}
