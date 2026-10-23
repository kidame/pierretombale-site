/**
 * LES REGLES DE LA MISE EN PAGE AUTOMATIQUE (`composition.ts`).
 *
 * Chaque test dit une regle decidee avec Thomas le 23.10.2026 (voir
 * docs/DECISIONS-ET-ETAT.md, « Inscription guidee »). Si une regle change, on
 * change le test EN MEME TEMPS, et on le dit dans le message de commit.
 * Lancer : `npm test`.
 */
import { describe, expect, it } from "vitest";
import { modelesCalibres } from "@/data/calibrations";
import {
  LARGEUR_UTILE,
  NOM_UNE_LIGNE_MIN_MM,
  PHRASE_LIGNES_MAX,
  taillesParRole,
} from "@/data/inscription";
import { compose } from "@/scripts/configurateur/composition";
import {
  echelleDe,
  inscription,
  inscriptionCourante,
  mesureurTest,
  personne,
  surfaceCm,
} from "./commun";

const tailleDe = (resultat: ReturnType<typeof compose>, cle: string) =>
  resultat.zones.find((zone) => zone.cle === cle)?.hauteurMm ?? 0;

describe("cas de base", () => {
  it("une inscription vide garde une seule zone, vide", () => {
    const resultat = compose(inscription(), echelleDe("douceur"), mesureurTest);
    expect(resultat.zones).toHaveLength(1);
    expect(resultat.zones[0].texte).toBe("");
    expect(resultat.tient).toBe(true);
  });

  it("classique : nom, dates puis phrase, de haut en bas", () => {
    const resultat = compose(inscriptionCourante(), echelleDe("douceur"), mesureurTest);
    expect(resultat.zones.map((zone) => zone.cle)).toEqual(["g-nom-0", "g-dates-0", "g-phrase"]);
    const y = resultat.zones.map((zone) => zone.yCm ?? 0);
    expect(y[0]).toBeLessThan(y[1]);
    expect(y[1]).toBeLessThan(y[2]);
    expect(resultat.tient).toBe(true);
  });

  it("le nom de famille en capitales, le nom de jeune fille precede de « née »", () => {
    const resultat = compose(inscriptionCourante(), echelleDe("douceur"), mesureurTest);
    const nom = resultat.zones.find((zone) => zone.cle === "g-nom-0");
    const dates = resultat.zones.find((zone) => zone.cle === "g-dates-0");
    expect(nom?.texte.replace("\n", " ")).toBe("Camille MARTIN");
    expect(dates?.texte.split("\n")).toEqual(["née DUPONT", "1948 - 2026"]);
  });

  it("une seule date s'ecrit sans separateur", () => {
    const seule = inscription({ personnes: [personne({ nom: "Martin", deces: "2026" }), personne()] });
    const resultat = compose(seule, echelleDe("douceur"), mesureurTest);
    expect(resultat.zones.find((zone) => zone.cle === "g-dates-0")?.texte).toBe("2026");
  });

  it("les blocs sont centres horizontalement (xCm a null) et texte centre", () => {
    const resultat = compose(inscriptionCourante(), echelleDe("douceur"), mesureurTest);
    for (const zone of resultat.zones) {
      expect(zone.xCm).toBeNull();
      expect(zone.alignement).toBe("centre");
    }
  });
});

describe("sur chaque modele calibre", () => {
  for (const modele of modelesCalibres()) {
    describe(modele, () => {
      const echelle = echelleDe(modele);
      const resultat = compose(inscriptionCourante(), echelle, mesureurTest);

      it("chaque ligne tient dans la largeur de sa stele", () => {
        for (const zone of resultat.zones) {
          const max = surfaceCm(echelle, zone.surface ?? 0).largeur * LARGEUR_UTILE;
          for (const ligne of zone.texte.split("\n")) {
            /* Un mot plus large que la stele ne peut pas se couper : toleré
               seulement si la composition le signale (`tient` a false). */
            if (resultat.tient) {
              expect(mesureurTest.largeurCm(ligne, "cinzel", zone.hauteurMm)).toBeLessThanOrEqual(
                max + 1e-6,
              );
            }
          }
        }
      });

      it("la pile tient dans la hauteur de sa stele", () => {
        if (!resultat.tient) return;
        for (const zone of resultat.zones) {
          const surface = surfaceCm(echelle, zone.surface ?? 0);
          const lignes = zone.texte.split("\n").length;
          const bas = (zone.yCm ?? 0) + mesureurTest.hauteurBlocCm(lignes, "cinzel", zone.hauteurMm);
          expect(zone.yCm ?? 0).toBeGreaterThanOrEqual(surface.yCm - 1e-6);
          expect(bas).toBeLessThanOrEqual(surface.yCm + surface.hauteur + 1e-6);
        }
      });

      it("les dates restent plus petites que le nom", () => {
        const nom = tailleDe(resultat, "g-nom-0");
        const dates = tailleDe(resultat, "g-dates-0");
        const plusPetiteDate = Math.min(...taillesParRole.une.dates);
        expect(dates < nom || dates === plusPetiteDate).toBe(true);
      });

      it("toutes les tailles viennent des listes du metier", () => {
        const permises = new Set(Object.values(taillesParRole.une).flat());
        for (const zone of resultat.zones) expect(permises.has(zone.hauteurMm)).toBe(true);
      });
    });
  }
});

describe("le nom", () => {
  it("reste sur une ligne tant qu'une taille d'au moins 3 cm le permet", () => {
    for (const modele of modelesCalibres()) {
      const echelle = echelleDe(modele);
      const resultat = compose(inscriptionCourante(), echelle, mesureurTest);
      const nom = resultat.zones.find((zone) => zone.cle === "g-nom-0");
      if (!nom || !nom.texte.includes("\n")) continue;
      /* Sur deux lignes : alors meme la plus petite taille « grande » ne
         tenait pas sur une seule. */
      const max = surfaceCm(echelle, 0).largeur * LARGEUR_UTILE;
      expect(mesureurTest.largeurCm("Camille MARTIN", "cinzel", NOM_UNE_LIGNE_MIN_MM)).toBeGreaterThan(max);
    }
  });

  it("trop long pour une ligne : prenom au-dessus du NOM", () => {
    const long = inscription({
      personnes: [personne({ prenom: "Marie-Christine", nom: "Vuilleumier-Montandon" }), personne()],
    });
    const resultat = compose(long, echelleDe("aventuri"), mesureurTest);
    expect(resultat.zones[0].texte.split("\n")).toEqual(["Marie-Christine", "VUILLEUMIER-MONTANDON"]);
  });
});

describe("la phrase", () => {
  const longue =
    "Ceux que nous avons aimés et que nous avons perdus ne sont plus là où ils étaient, " +
    "mais ils sont partout où nous sommes";

  it("se coupe entre les mots, sans perdre un mot, et 5 lignes au plus", () => {
    const resultat = compose(inscriptionCourante({ phrase: longue }), echelleDe("douceur"), mesureurTest);
    const phrase = resultat.zones.find((zone) => zone.cle === "g-phrase");
    const lignes = phrase?.texte.split("\n") ?? [];
    expect(lignes.length).toBeGreaterThan(1);
    expect(lignes.length).toBeLessThanOrEqual(PHRASE_LIGNES_MAX);
    expect(lignes.join(" ")).toBe(longue);
  });

  it("garde les retours a la ligne voulus par la famille", () => {
    const resultat = compose(
      inscriptionCourante({ phrase: "Repose en paix\nMaman" }),
      echelleDe("douceur"),
      mesureurTest,
    );
    expect(resultat.zones.find((zone) => zone.cle === "g-phrase")?.texte).toBe("Repose en paix\nMaman");
  });

  it("dedicace : la phrase passe au-dessus du nom", () => {
    const resultat = compose(
      inscriptionCourante({ miseEnPage: "dedicace", phrase: "À notre maman" }),
      echelleDe("douceur"),
      mesureurTest,
    );
    expect(resultat.zones[0].cle).toBe("g-phrase");
    expect(resultat.zones[0].yCm ?? 0).toBeLessThan(resultat.zones[1].yCm ?? 0);
  });
});

describe("deux personnes", () => {
  it("les deux noms ont la meme taille, les deux dates aussi", () => {
    for (const modele of modelesCalibres()) {
      const resultat = compose(inscriptionCourante({ miseEnPage: "couple" }), echelleDe(modele), mesureurTest);
      expect(tailleDe(resultat, "g-nom-0")).toBe(tailleDe(resultat, "g-nom-1"));
      expect(tailleDe(resultat, "g-dates-0")).toBe(tailleDe(resultat, "g-dates-1"));
    }
  });

  it("sur un monument a deux steles (Tango), une personne par stele", () => {
    const resultat = compose(inscriptionCourante({ miseEnPage: "couple" }), echelleDe("tango"), mesureurTest);
    const surfaces = Object.fromEntries(resultat.zones.map((zone) => [zone.cle, zone.surface]));
    expect(surfaces["g-nom-0"]).toBe(0);
    expect(surfaces["g-nom-1"]).toBe(1);
    expect(surfaces["g-phrase"]).toBe(0);
  });

  it("la deuxieme personne est ignoree en mise en page classique", () => {
    const resultat = compose(inscriptionCourante(), echelleDe("douceur"), mesureurTest);
    expect(resultat.zones.some((zone) => zone.cle.endsWith("-1"))).toBe(false);
  });
});

describe("quand rien ne suffit", () => {
  it("signale `tient` a false sans planter", () => {
    const enorme = inscriptionCourante({
      miseEnPage: "couple",
      phrase: "Un très long souvenir ".repeat(9).trim(),
    });
    const resultat = compose(enorme, echelleDe("tango"), mesureurTest);
    expect(resultat.tient).toBe(false);
    expect(resultat.zones.length).toBeGreaterThan(0);
  });
});
