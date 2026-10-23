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
 * DEUX SORTES DE SURFACES (decide par Thomas le 23.10.2026) :
 *   - les SURFACES DE TEXTE (rouge sur la planche de controle) : une par
 *     stele gravable. Un bloc de texte reste dans la surface la plus proche ;
 *   - le CADRE DES MOTIFS (jaune) : les motifs s'y placent librement.
 * Toutes les positions en cm partent du coin de la PREMIERE surface de texte
 * (`zone`) : le cadre des motifs a donc souvent des cm negatifs (`cadreCm`).
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
  /** La premiere surface de texte, en pixels de l'image servie : origine des cm. */
  zone: Rect;
  /** Toutes les surfaces de texte, une par stele gravable (`zone` en tete). */
  surfaces: Rect[];
  /** Le cadre des motifs (jaune), en pixels de l'image servie. */
  cadre: Rect;
  /** Le meme cadre, en cm depuis le coin de `zone`. */
  cadreCm: Rect;
  cmVersPx(cm: number): number;
  pxVersCm(px: number): number;
  /** Coin d'un bloc, de cm (depuis `zone`) vers px de l'image. */
  pointDepuisCm(position: Position): Point;
  /** L'inverse : un coin en px de l'image vers des cm depuis `zone`. */
  cmDepuisPoint(point: Point): Position;
  /** La surface de texte la plus proche du centre de ce bloc. */
  surfaceDe(coin: Point, taille: Taille): Rect;
  /** Ramene un coin de bloc de texte dans la surface de texte la plus proche. */
  borne(coin: Point, taille: Taille): Point;
  /** Ramene un coin de motif dans le cadre des motifs. */
  borneMotif(coin: Point, taille: Taille): Point;
  /** Le coin qui centre un bloc de cette taille dans la surface `rang` (0 par defaut). */
  centre(taille: Taille, rang?: number): Point;
}

function convertit(rect: Rect, facteur: number): Rect {
  return {
    x: rect.x * facteur,
    y: rect.y * facteur,
    largeur: rect.largeur * facteur,
    hauteur: rect.hauteur * facteur,
  };
}

/**
 * Un bloc plus grand que son cadre est cale sur le bord haut gauche plutot que
 * repousse dehors : mieux vaut un texte qui depasse visiblement et que la
 * famille raccourcisse, qu'un texte qui disparait.
 */
function cale(dans: Rect, coin: Point, taille: Taille): Point {
  const maxX = dans.x + Math.max(0, dans.largeur - taille.largeur);
  const maxY = dans.y + Math.max(0, dans.hauteur - taille.hauteur);

  return {
    x: Math.min(Math.max(coin.x, dans.x), maxX),
    y: Math.min(Math.max(coin.y, dans.y), maxY),
  };
}

export function creeEchelle(calibration: Calibration): Echelle {
  const facteur = LARGEUR_IMAGE_SERVIE / calibration.imagePx.largeur;

  const vue = convertit(calibration.vueStelePx, facteur);
  const surfaces = calibration.zonesGravablesPx.map((rect) => convertit(rect, facteur));
  const zone = surfaces[0];
  const cadre = convertit(calibration.zoneMotifsPx, facteur);

  /* L'echelle de la gravure vient de la STELE, pas de l'image entiere : c'est
     la seule cote reelle connue. Tant que les associes n'ont pas donne la
     largeur reelle de la stele, `largeurCm` est une hypothese, et toutes les
     tailles de lettres le sont avec elle (statut "provisoire" du JSON). Sur un
     monument a plusieurs steles, une seule echelle : celle de `stele`. */
  const pxParCm = (calibration.stele.cadrePx.largeur * facteur) / calibration.stele.largeurCm;

  const cmVersPx = (cm: number) => cm * pxParCm;
  const pxVersCm = (px: number) => px / pxParCm;

  const cadreCm: Rect = {
    x: pxVersCm(cadre.x - zone.x),
    y: pxVersCm(cadre.y - zone.y),
    largeur: pxVersCm(cadre.largeur),
    hauteur: pxVersCm(cadre.hauteur),
  };

  function surfaceDe(coin: Point, taille: Taille): Rect {
    const cx = coin.x + taille.largeur / 2;
    const cy = coin.y + taille.hauteur / 2;
    let meilleure = zone;
    let ecart = Infinity;
    for (const surface of surfaces) {
      const dx = Math.max(surface.x - cx, 0, cx - (surface.x + surface.largeur));
      const dy = Math.max(surface.y - cy, 0, cy - (surface.y + surface.hauteur));
      const distance = dx * dx + dy * dy;
      if (distance < ecart) {
        ecart = distance;
        meilleure = surface;
      }
    }
    return meilleure;
  }

  return {
    facteur,
    pxParCm,
    vue,
    zone,
    surfaces,
    cadre,
    cadreCm,
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
    surfaceDe,
    borne: (coin, taille) => cale(surfaceDe(coin, taille), coin, taille),
    borneMotif: (coin, taille) => cale(cadre, coin, taille),
    centre: (taille, rang = 0) => {
      const surface = surfaces[Math.min(Math.max(0, rang), surfaces.length - 1)];
      return cale(
        surface,
        {
          x: surface.x + (surface.largeur - taille.largeur) / 2,
          y: surface.y + (surface.hauteur - taille.hauteur) / 2,
        },
        taille,
      );
    },
  };
}
