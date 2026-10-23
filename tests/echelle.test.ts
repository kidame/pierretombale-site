/**
 * L'ECHELLE ET LES BORNES (`echelle.ts`, fonctions pures de `motifs.ts`).
 * Lancer : `npm test`.
 */
import { describe, expect, it } from "vitest";
import { getCalibration, modelesCalibres } from "@/data/calibrations";
import { LARGEUR_IMAGE_SERVIE } from "@/scripts/configurateur/echelle";
import { bornePose, poseCentree, type MotifCatalogue } from "@/scripts/configurateur/motifs";
import { echelleDe } from "./commun";

const rose: MotifCatalogue = {
  id: "rose",
  nom: "Rose",
  famille: "fleurs",
  largeurCm: 12,
  largeurMinCm: 6,
  largeurMaxCm: 30,
  symetrie: false,
  largeurMm: 100,
  hauteurMm: 120,
  fichier: "/motifs/fleurs-rose.svg",
  d: "",
};

describe("echelle", () => {
  it("pxParCm vient de la stele : largeur servie / largeur reelle", () => {
    const calibration = getCalibration("douceur")!;
    const attendu =
      (calibration.stele.cadrePx.largeur * LARGEUR_IMAGE_SERVIE) /
      calibration.imagePx.largeur /
      calibration.stele.largeurCm;
    expect(echelleDe("douceur").pxParCm).toBeCloseTo(attendu, 6);
  });

  it("cm <-> px : aller-retour sans perte", () => {
    const echelle = echelleDe("arques");
    const point = echelle.pointDepuisCm({ xCm: 12.5, yCm: 7 });
    const retour = echelle.cmDepuisPoint(point);
    expect(retour.xCm).toBeCloseTo(12.5, 9);
    expect(retour.yCm).toBeCloseTo(7, 9);
  });

  it("chaque modele : les surfaces de texte sont dans le cadre des motifs", () => {
    for (const modele of modelesCalibres()) {
      const { cadre, surfaces } = echelleDe(modele);
      for (const s of surfaces) {
        expect(s.x).toBeGreaterThanOrEqual(cadre.x - 1e-6);
        expect(s.y).toBeGreaterThanOrEqual(cadre.y - 1e-6);
        expect(s.x + s.largeur).toBeLessThanOrEqual(cadre.x + cadre.largeur + 1e-6);
        expect(s.y + s.hauteur).toBeLessThanOrEqual(cadre.y + cadre.hauteur + 1e-6);
      }
    }
  });

  it("un bloc de texte reste dans la surface la plus proche (Tango)", () => {
    const echelle = echelleDe("tango");
    const petite = echelle.surfaces[1];
    const taille = { largeur: 20, hauteur: 20 };
    /* Un bloc pose a gauche de la petite stele y est ramene, pas sur la grande. */
    const coin = echelle.borne({ x: petite.x - 50, y: petite.y + 10 }, taille);
    expect(echelle.surfaceDe(coin, taille)).toBe(petite);
    expect(coin.x).toBeCloseTo(petite.x, 6);
  });

  it("centre(taille, rang) centre le bloc sur la surface demandee", () => {
    const echelle = echelleDe("tango");
    const taille = { largeur: 30, hauteur: 10 };
    for (const [rang, surface] of echelle.surfaces.entries()) {
      const coin = echelle.centre(taille, rang);
      expect(coin.x + taille.largeur / 2).toBeCloseTo(surface.x + surface.largeur / 2, 6);
    }
  });
});

describe("motifs", () => {
  it("une pose hors du cadre jaune y est ramenee, a une largeur permise", () => {
    for (const modele of modelesCalibres()) {
      const echelle = echelleDe(modele);
      const pose = bornePose(
        { cle: "t", id: "rose", xCm: -500, yCm: 900, largeurCm: 500, miroir: false },
        rose,
        echelle,
      );
      expect(pose.largeurCm).toBeLessThanOrEqual(rose.largeurMaxCm);
      expect(pose.largeurCm).toBeGreaterThanOrEqual(rose.largeurMinCm);
      expect(pose.xCm).toBeGreaterThanOrEqual(echelle.cadreCm.x - 1e-6);
      expect(pose.yCm).toBeLessThanOrEqual(echelle.cadreCm.y + echelle.cadreCm.hauteur + 1e-6);
    }
  });

  it("un nouveau motif se pose sous le texte quand il y a la place", () => {
    const echelle = echelleDe("douceur");
    const basTexteCm = 10;
    const pose = poseCentree(rose, echelle, 0, basTexteCm);
    expect(pose.yCm).toBeGreaterThan(basTexteCm);
  });

  it("les motifs suivants s'ecartent a gauche puis a droite", () => {
    const echelle = echelleDe("arbre-de-vie");
    const [a, b, c] = [0, 1, 2].map((rang) => poseCentree(rose, echelle, rang, 5));
    expect(b.xCm).toBeLessThan(a.xCm);
    expect(c.xCm).toBeGreaterThan(a.xCm);
  });
});
