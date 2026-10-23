/**
 * Outils communs aux tests du configurateur.
 *
 * LE MESUREUR DE TEST est previsible : 0,8 em par caractere et une majuscule a
 * 0,7 em (l'ordre de grandeur de Cinzel). Les tests ne dependent donc ni d'un
 * navigateur ni des fichiers de police : ils verifient les REGLES de la
 * composition, pas les largeurs exactes d'une police (celles-la se controlent
 * au navigateur de test, `scripts/verifie-configurateur.sh`).
 */
import { getCalibration } from "@/data/calibrations";
import type { Inscription, Mesureur, Personne } from "@/scripts/configurateur/composition";
import { personneVide } from "@/scripts/configurateur/composition";
import { creeEchelle, type Echelle } from "@/scripts/configurateur/echelle";

export const EM_PAR_CARACTERE = 0.8;
export const CAPITALE = 0.7;
export const INTERLIGNE = 1.25;

export const mesureurTest: Mesureur = {
  largeurCm: (texte, _police, hauteurMm) => texte.length * EM_PAR_CARACTERE * (hauteurMm / 10 / CAPITALE),
  hauteurBlocCm: (lignes, _police, hauteurMm) => lignes * (hauteurMm / 10 / CAPITALE) * INTERLIGNE,
};

/** L'echelle d'un modele calibre, depuis les vrais JSON de `src/data/calibrations/`. */
export function echelleDe(modeleId: string): Echelle {
  const calibration = getCalibration(modeleId);
  if (!calibration) throw new Error(`modele non calibre : ${modeleId}`);
  return creeEchelle(calibration);
}

export function personne(champs: Partial<Personne> = {}): Personne {
  return { ...personneVide(), ...champs };
}

export function inscription(champs: Partial<Inscription> = {}): Inscription {
  return {
    miseEnPage: "classique",
    personnes: [personneVide(), personneVide()],
    phrase: "",
    policeId: "cinzel",
    finitionId: "doree",
    ...champs,
  };
}

/** Une inscription courante : Camille MARTIN, nee DUPONT, 1948 - 2026, une phrase. */
export function inscriptionCourante(champs: Partial<Inscription> = {}): Inscription {
  return inscription({
    personnes: [
      personne({ prenom: "Camille", nom: "Martin", nomJeuneFille: "Dupont", naissance: "1948", deces: "2026" }),
      personne({ prenom: "Jean-Pierre", nom: "Martin", naissance: "1945", deces: "2020" }),
    ],
    phrase: "Ton souvenir restera à jamais gravé dans nos cœurs",
    ...champs,
  });
}

/** Une surface de texte en cm, origine au coin de la premiere surface. */
export function surfaceCm(echelle: Echelle, rang: number) {
  const surface = echelle.surfaces[rang];
  return {
    yCm: echelle.pxVersCm(surface.y - echelle.zone.y),
    largeur: echelle.pxVersCm(surface.largeur),
    hauteur: echelle.pxVersCm(surface.hauteur),
  };
}
