/**
 * LA GEOMETRIE DES MOTIFS, LUE DANS LES SVG AU BUILD.
 *
 * CE QUE FAIT CE FICHIER
 * Il ouvre chaque SVG de `public/motifs/` avec `node:fs` (donc au build, jamais
 * dans le navigateur), et en sort deux choses :
 *   - la `viewBox`, qui donne la largeur et la hauteur du dessin EN
 *     MILLIMETRES (regle de dessin : `viewBox="0 0 W H"` au ras du dessin,
 *     1 unite = 1 mm, posee par `scripts/vectoriser-motif.py`) ;
 *   - l'attribut `d` de l'unique `<path>`.
 *
 * A QUOI CA SERT
 * Deux endroits, un seul travail de lecture :
 *   - `svgMotif(id)` rend le balisage inline des cartes de selection de la page
 *     (`set:html`), sans `fill` en dur : la couleur suit le CSS ;
 *   - `motifsConfigurateur()` rend la liste complete inlinee dans le JSON de
 *     configuration de `/personnaliser/<slug>/`. Le canvas dessine un
 *     `Konva.Path` a partir du `d` : AUCUN fetch de SVG a l'execution.
 *
 * Un SVG qui ne respecte pas les regles (plusieurs chemins, viewBox decalee,
 * pas de `d`) ARRETE LE BUILD : mieux vaut un build rouge qu'un motif pose de
 * travers sur une stele.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { motifsDisponibles, type Motif } from "./motifs";

export interface GeometrieMotif {
  /** Largeur du dessin en millimetres (la `viewBox`). */
  largeurMm: number;
  hauteurMm: number;
  /** L'attribut `d` du chemin, coordonnees en millimetres. */
  d: string;
}

/** Ce que la page inline pour le canvas : les donnees plus la geometrie. */
export interface MotifConfigurateur extends GeometrieMotif {
  id: string;
  nom: string;
  famille: string;
  largeurCm: number;
  largeurMinCm: number;
  largeurMaxCm: number;
  symetrie: boolean;
}

const DOSSIER_PUBLIC = join(process.cwd(), "public");

function lireGeometrie(motif: Motif): GeometrieMotif {
  const chemin = join(DOSSIER_PUBLIC, motif.fichier);
  const source = readFileSync(chemin, "utf8");
  const ou = `public${motif.fichier}`;

  const viewBox = /viewBox="([^"]+)"/.exec(source);
  if (!viewBox)
    throw new Error(`${ou} : aucune "viewBox" (attendu viewBox="0 0 largeur hauteur").`);

  const bornes = viewBox[1]
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (bornes.length !== 4 || bornes.some((valeur) => !Number.isFinite(valeur))) {
    throw new Error(`${ou} : "viewBox" illisible ("${viewBox[1]}").`);
  }

  const [x, y, largeurMm, hauteurMm] = bornes;
  if (x !== 0 || y !== 0) {
    throw new Error(
      `${ou} : la "viewBox" doit commencer a "0 0" (trouve "${x} ${y}"), sinon le motif ` +
        `se pose decale sur la stele. Recadrer le dessin au ras, puis revectoriser.`,
    );
  }
  if (!(largeurMm > 0) || !(hauteurMm > 0)) {
    throw new Error(`${ou} : largeur et hauteur de "viewBox" doivent etre positives.`);
  }

  const chemins = source.match(/<path\b/g) ?? [];
  if (chemins.length !== 1) {
    throw new Error(
      `${ou} : ${chemins.length} <path> au lieu d'un seul. Fusionner les chemins ` +
        `(regle 2 de docs/MOTIFS-BIBLIOTHEQUE.md).`,
    );
  }

  const trace = /<path\b[^>]*\bd="([^"]+)"/.exec(source);
  if (!trace) throw new Error(`${ou} : le <path> n'a pas d'attribut "d".`);

  return { largeurMm, hauteurMm, d: trace[1] };
}

/* Tout est lu une fois pour toutes au chargement du module : dix fichiers de
   quelques kilo-octets, et le build echoue tout de suite si l'un est mauvais. */
const geometries = new Map<string, GeometrieMotif>(
  motifsDisponibles().map((motif) => [motif.id, lireGeometrie(motif)]),
);

export function geometrieMotif(id: string): GeometrieMotif | undefined {
  return geometries.get(id);
}

/**
 * Le SVG inline d'une carte de selection. Pas de `width`/`height` (le conteneur
 * carre de la page decide), pas de couleur : `fill="currentColor"` fait suivre
 * la couleur du texte, donc le CSS de la page. `aria-hidden` parce que le nom
 * du motif est ecrit en clair juste a cote.
 */
export function svgMotif(id: string): string {
  const geometrie = geometries.get(id);
  if (!geometrie) throw new Error(`Motif inconnu ou indisponible : "${id}".`);

  return (
    `<svg viewBox="0 0 ${geometrie.largeurMm} ${geometrie.hauteurMm}" ` +
    `fill="currentColor" fill-rule="evenodd" aria-hidden="true" focusable="false">` +
    `<path d="${geometrie.d}"/></svg>`
  );
}

/** La liste inlinee dans le JSON de configuration de la page. */
export function motifsConfigurateur(): MotifConfigurateur[] {
  return motifsDisponibles().map((motif) => {
    const geometrie = geometries.get(motif.id)!;

    return {
      id: motif.id,
      nom: motif.nom,
      famille: motif.famille,
      largeurCm: motif.largeurCm,
      largeurMinCm: motif.largeurMinCm,
      largeurMaxCm: motif.largeurMaxCm,
      symetrie: motif.symetrie,
      ...geometrie,
    };
  });
}
