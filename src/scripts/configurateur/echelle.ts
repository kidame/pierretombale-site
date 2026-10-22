/**
 * L'ECHELLE : LA SEULE ARITHMETIQUE DU CONFIGURATEUR.
 *
 * Trois espaces de mesure cohabitent, et c'est ici qu'ils se rencontrent :
 *
 *   1. les PIXELS DE L'IMAGE SOURCE : ce que contient
 *      `src/data/calibrations/<modeleId>.json` (pilotes de 1254 px) ;
 *   2. les PIXELS DE L'IMAGE SERVIE : les visuels de `public/images/modeles`
 *      font 1200 px, d'ou le facteur `1200 / largeur de l'image source` ;
 *   3. les CENTIMETRES REELS : `stele.largeurCm` dit quelle largeur reelle
 *      couvre `stele.cadrePx`, ce qui donne `pxParCm`.
 *
 * Tout ce que ce fichier rend est en PIXELS DE L'IMAGE SERVIE. La mise a
 * l'echelle de l'affichage (une stele de 1200 px montree dans un cadre de
 * 400 px) n'est PAS ici : c'est `rendu.ts` qui s'en charge, par une
 * transformation de couche Konva. Ainsi la taille des lettres ne depend jamais
 * de la taille de la fenetre.
 *
 * CE QU'IL NE FAIT PAS : il ne dessine rien et ne connait pas Konva.
 */
import type { Calibration } from "@/data/calibrations";
import type { Position } from "./etat";

/**
 * Largeur des visuels servis par le site (`<modeleId>-<matiere>-1200.webp`,
 * derives par `scripts/images-modeles.py`). Changer la largeur derivee oblige
 * a changer ce seul chiffre.
 */
export const LARGEUR_IMAGE_SERVIE = 1200;

export interface Rect {
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
}

export interface Taille {
  largeur: number;
  hauteur: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Echelle {
  /** Pixels de l'image servie par pixel de l'image source (1200 / 1254). */
  facteur: number;
  /** Pixels de l'image servie par centimetre reel de pierre. */
  pxParCm: number;
  /** Le cadrage de l'apercu, en pixels de l'image servie. */
  vue: Rect;
  /** La zone gravable, en pixels de l'image servie. */
  zone: Rect;
  cmVersPx(cm: number): number;
  pxVersCm(px: number): number;
  /** Coin du bloc de texte, de cm (depuis la zone) vers px de l'image. */
  pointDepuisCm(position: Position): Point;
  /** L'inverse : un coin en px de l'image vers des cm depuis la zone. */
  cmDepuisPoint(point: Point): Position;
  /** Ramene un coin de bloc dans la zone gravable. */
  borne(coin: Point, taille: Taille): Point;
  /** Le coin qui centre un bloc de cette taille dans la zone gravable. */
  centre(taille: Taille): Point;
}

function convertit(rect: Rect, facteur: number): Rect {
  return {
    x: rect.x * facteur,
    y: rect.y * facteur,
    largeur: rect.largeur * facteur,
    hauteur: rect.hauteur * facteur,
  };
}

export function creeEchelle(calibration: Calibration): Echelle {
  const facteur = LARGEUR_IMAGE_SERVIE / calibration.imagePx.largeur;

  const vue = convertit(calibration.vueStelePx, facteur);
  const zone = convertit(calibration.zoneGravablePx, facteur);

  /* L'echelle de la gravure vient de la STELE, pas de l'image entiere : c'est
     la seule cote reelle connue. Tant que les associes n'ont pas donne la
     largeur reelle de la stele, `largeurCm` est une hypothese, et toutes les
     tailles de lettres le sont avec elle (statut "provisoire" du JSON). */
  const pxParCm = (calibration.stele.cadrePx.largeur * facteur) / calibration.stele.largeurCm;

  const cmVersPx = (cm: number) => cm * pxParCm;
  const pxVersCm = (px: number) => px / pxParCm;

  function borne(coin: Point, taille: Taille): Point {
    /* Un bloc plus grand que la zone est cale sur son bord haut gauche plutot
       que repousse dehors : mieux vaut un texte qui depasse visiblement et que
       la famille raccourcisse, qu'un texte qui disparait. */
    const maxX = zone.x + Math.max(0, zone.largeur - taille.largeur);
    const maxY = zone.y + Math.max(0, zone.hauteur - taille.hauteur);

    return {
      x: Math.min(Math.max(coin.x, zone.x), maxX),
      y: Math.min(Math.max(coin.y, zone.y), maxY),
    };
  }

  return {
    facteur,
    pxParCm,
    vue,
    zone,
    cmVersPx,
    pxVersCm,
    pointDepuisCm: (position) => ({
      x: zone.x + cmVersPx(position.xCm),
      y: zone.y + cmVersPx(position.yCm),
    }),
    cmDepuisPoint: (point) => ({
      xCm: pxVersCm(point.x - zone.x),
      yCm: pxVersCm(point.y - zone.y),
    }),
    borne,
    centre: (taille) =>
      borne(
        {
          x: zone.x + (zone.largeur - taille.largeur) / 2,
          y: zone.y + (zone.hauteur - taille.hauteur) / 2,
        },
        taille,
      ),
  };
}
