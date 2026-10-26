/**
 * L'EXPORT VERS LE DEVIS (passe E, 26.10.2026).
 *
 * Quand la famille clique « Demander un devis », tout ce qu'elle a compose
 * part vers `/devis/` : la scene en CENTIMETRES (ce que l'atelier gravera) et
 * une image de l'apercu (ce qu'elle a vu). Le tout voyage par le
 * `sessionStorage` du navigateur (cle `CLE_SCENE`) : rien n'est envoye nulle
 * part ici, c'est le formulaire de devis qui enverra, selon
 * `docs/devis-contrat.md`. La page `/devis/` lit cette scene avec
 * `src/scripts/devis/scene.ts`.
 *
 * LE FORMAT (`SceneDevis`) est volontairement plat et lisible : il sera relu
 * par la fonction d'envoi puis par l'atelier, sans ce code. Le changer, c'est
 * incrementer `VERSION_SCENE` et adapter `scene.ts`.
 */
import type { Inscription } from "./composition";
import type { Echelle } from "./echelle";
import { sceneEnCm, type EtatConfigurateur } from "./etat";
import type { ModeInscription } from "./formulaire";
import type { MotifCatalogue } from "./motifs";

export const VERSION_SCENE = 1;

/** Meme famille de cles que les brouillons (`pt-devis-brouillon`, `pt-configurateur-`). */
export const CLE_SCENE = "pt-devis-scene";

export interface SceneDevis {
  version: number;
  composeLe: string;
  modele: { modeleId: string; slug: string; nom: string };
  matiere: { id: string; nom: string };
  mode: ModeInscription;
  /** Les champs de l'inscription guidee, tels que saisis. */
  inscription: Inscription;
  /** Les blocs de texte tels que dessines, en cm depuis la premiere surface. */
  zones: Array<{
    numero: number;
    texte: string;
    policeId: string;
    hauteurMm: number;
    finitionId: string;
    xCm: number | null;
    yCm: number | null;
    /** La stele (surface) qui porte ce texte : 0 = la principale. */
    surface: number;
  }>;
  motifs: Array<{
    id: string;
    nom: string;
    xCm: number;
    yCm: number;
    largeurCm: number;
    miroir: boolean;
  }>;
  motifSurDemande: {
    description: string;
    nomFichier: string | null;
    xCm: number;
    yCm: number;
    largeurCm: number;
    hauteurCm: number;
  } | null;
  /** Les surfaces de texte en cm, pour relire les positions. */
  surfaces: Array<{ xCm: number; yCm: number; largeurCm: number; hauteurCm: number }>;
  /** L'apercu en JPEG (data URL), ou `null` si le canvas n'a pas pu le rendre. */
  apercu: string | null;
}

export interface SourcesScene {
  etat: EtatConfigurateur;
  echelle: Echelle;
  inscription: Inscription;
  mode: ModeInscription;
  modele: SceneDevis["modele"];
  nomMatiere: (id: string) => string;
  catalogue: Map<string, MotifCatalogue>;
  apercu: string | null;
}

export function construitScene(sources: SourcesScene): SceneDevis {
  const { etat, echelle } = sources;
  const scene = sceneEnCm(etat);

  return {
    version: VERSION_SCENE,
    composeLe: new Date().toISOString(),
    modele: sources.modele,
    matiere: { id: etat.matiere, nom: sources.nomMatiere(etat.matiere) },
    mode: sources.mode,
    inscription: sources.inscription,
    zones: scene.zones.map((zone, rang) => ({
      ...zone,
      surface: etat.zones[rang]?.surface ?? 0,
    })),
    motifs: scene.motifs.map((motif) => ({
      ...motif,
      nom: sources.catalogue.get(motif.id)?.nom ?? motif.id,
    })),
    motifSurDemande: scene.motifSurDemande,
    surfaces: echelle.surfaces.map((surface) => ({
      xCm: echelle.pxVersCm(surface.x - echelle.zone.x),
      yCm: echelle.pxVersCm(surface.y - echelle.zone.y),
      largeurCm: echelle.pxVersCm(surface.largeur),
      hauteurCm: echelle.pxVersCm(surface.hauteur),
    })),
    apercu: sources.apercu,
  };
}

/** Depose la scene pour `/devis/`. `false` : le navigateur a refuse. */
export function deposeScene(scene: SceneDevis): boolean {
  try {
    window.sessionStorage.setItem(CLE_SCENE, JSON.stringify(scene));
    return true;
  } catch {
    /* Trop lourd (l'image) ou stockage refuse : on reessaie sans l'image,
       le texte compte plus que l'apercu. */
    try {
      window.sessionStorage.setItem(CLE_SCENE, JSON.stringify({ ...scene, apercu: null }));
      return true;
    } catch {
      return false;
    }
  }
}
