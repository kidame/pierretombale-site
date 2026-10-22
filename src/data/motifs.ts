/**
 * LA BIBLIOTHEQUE DE MOTIFS : LA LISTE, VALIDEE AU BUILD.
 *
 * CE QUE FAIT CE FICHIER
 * Il relit `src/data/motifs.json` au build et le valide ligne par ligne : un
 * motif dont le SVG manque, dont la famille n'existe pas ou dont la plage de
 * tailles est incoherente doit ARRETER LE BUILD, pas produire une carte vide ni
 * un apercu qui mente. C'est la seule source de la liste des motifs ; ni la
 * page, ni le canvas ne redeclarent quoi que ce soit.
 *
 * COMMENT AJOUTER UN MOTIF
 * Deposer le SVG dans `public/motifs/` (regles de dessin : section 3 de
 * `docs/MOTIFS-BIBLIOTHEQUE.md`, outil : `scripts/vectoriser-motif.py`) puis
 * ajouter une ligne dans `src/data/motifs.json`. Rien d'autre : la carte
 * apparait d'elle-meme dans sa famille sur `/personnaliser/<slug>/`.
 *
 * LES UNITES
 * Les largeurs des donnees sont en CENTIMETRES DE PIERRE (taille reelle du
 * motif grave). La geometrie du dessin, elle, est en millimetres dans le SVG :
 * c'est `src/data/motifs-svg.ts` qui la lit.
 *
 * CE QU'IL NE FAIT PAS : il ne lit aucun SVG (voir `motifs-svg.ts`), ne connait
 * ni prix ni Konva.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

import brut from "./motifs.json";

export interface FamilleMotifs {
  id: string;
  nom: string;
  /** Ordre d'affichage des pastilles de famille, du plus courant au reste. */
  ordre: number;
}

export interface Motif {
  id: string;
  nom: string;
  /** Identifiant d'une famille de `familles`. */
  famille: string;
  /** Chemin public du SVG, par exemple `/motifs/fleurs-rose.svg`. */
  fichier: string;
  /** Largeur posee par defaut sur la stele, en centimetres reels. */
  largeurCm: number;
  /** En dessous, le graveur ne peut plus sabler les details. */
  largeurMinCm: number;
  largeurMaxCm: number;
  /** `true` : le dessin est orientable, le miroir a donc un sens. */
  symetrie: boolean;
  motsCles: string[];
  /** `false` : le motif reste dans le fichier mais ne s'affiche pas. */
  disponible: boolean;
}

interface FichierMotifs {
  familles?: unknown;
  motifs?: unknown;
}

/** Dossier servi tel quel par Astro : le `fichier` d'un motif part de la. */
const DOSSIER_PUBLIC = join(process.cwd(), "public");

const SOURCE = "src/data/motifs.json";

function erreur(message: string): never {
  throw new Error(`${SOURCE} : ${message}`);
}

function estNombrePositif(valeur: unknown): valeur is number {
  return typeof valeur === "number" && Number.isFinite(valeur) && valeur > 0;
}

function lireTexte(valeur: unknown, ou: string): string {
  if (typeof valeur !== "string" || !valeur.trim()) {
    erreur(`${ou} doit etre un texte non vide.`);
  }
  return valeur;
}

function lireFamille(valeur: unknown, index: number): FamilleMotifs {
  const famille = valeur as Partial<FamilleMotifs> | undefined;
  if (!famille || typeof famille !== "object") {
    erreur(`"familles[${index}]" doit etre un objet { id, nom, ordre }.`);
  }

  const id = lireTexte(famille.id, `"familles[${index}].id"`);
  const nom = lireTexte(famille.nom, `"familles[${id}].nom"`);
  if (!estNombrePositif(famille.ordre)) {
    erreur(`"familles[${id}].ordre" doit etre un nombre positif.`);
  }

  return { id, nom, ordre: famille.ordre };
}

function lireMotif(valeur: unknown, index: number, idsFamilles: Set<string>): Motif {
  const motif = valeur as Partial<Motif> | undefined;
  if (!motif || typeof motif !== "object") {
    erreur(`"motifs[${index}]" doit etre un objet.`);
  }

  const id = lireTexte(motif.id, `"motifs[${index}].id"`);
  const nom = lireTexte(motif.nom, `"motifs[${id}].nom"`);
  const famille = lireTexte(motif.famille, `"motifs[${id}].famille"`);

  if (!idsFamilles.has(famille)) {
    erreur(
      `le motif "${id}" annonce la famille "${famille}", qui n'est pas dans "familles" ` +
        `(connues : ${[...idsFamilles].join(", ")}).`,
    );
  }

  const fichier = lireTexte(motif.fichier, `"motifs[${id}].fichier"`);
  if (!fichier.startsWith("/motifs/") || !fichier.endsWith(".svg")) {
    erreur(`"motifs[${id}].fichier" doit etre un chemin du genre "/motifs/fleurs-rose.svg".`);
  }
  if (!existsSync(join(DOSSIER_PUBLIC, fichier))) {
    erreur(
      `le motif "${id}" pointe sur "${fichier}", absent de public/motifs. ` +
        `Deposer le SVG (voir docs/MOTIFS-BIBLIOTHEQUE.md) ou retirer la ligne.`,
    );
  }

  if (
    !estNombrePositif(motif.largeurCm) ||
    !estNombrePositif(motif.largeurMinCm) ||
    !estNombrePositif(motif.largeurMaxCm)
  ) {
    erreur(`"motifs[${id}]" : largeurCm, largeurMinCm et largeurMaxCm doivent etre positives.`);
  }
  if (motif.largeurMinCm > motif.largeurCm || motif.largeurCm > motif.largeurMaxCm) {
    erreur(
      `"motifs[${id}]" : la largeur par defaut (${motif.largeurCm} cm) doit tenir entre ` +
        `largeurMinCm (${motif.largeurMinCm} cm) et largeurMaxCm (${motif.largeurMaxCm} cm).`,
    );
  }

  if (typeof motif.symetrie !== "boolean")
    erreur(`"motifs[${id}].symetrie" doit etre vrai ou faux.`);
  if (typeof motif.disponible !== "boolean") {
    erreur(`"motifs[${id}].disponible" doit etre vrai ou faux.`);
  }
  if (!Array.isArray(motif.motsCles) || motif.motsCles.some((mot) => typeof mot !== "string")) {
    erreur(`"motifs[${id}].motsCles" doit etre une liste de textes.`);
  }

  return {
    id,
    nom,
    famille,
    fichier,
    largeurCm: motif.largeurCm,
    largeurMinCm: motif.largeurMinCm,
    largeurMaxCm: motif.largeurMaxCm,
    symetrie: motif.symetrie,
    motsCles: motif.motsCles,
    disponible: motif.disponible,
  };
}

const donnees = brut as FichierMotifs;

if (!Array.isArray(donnees.familles) || donnees.familles.length === 0) {
  erreur(`"familles" doit etre une liste non vide.`);
}
if (!Array.isArray(donnees.motifs)) erreur(`"motifs" doit etre une liste.`);

/** Les familles, dans l'ordre des pastilles. */
export const familles: FamilleMotifs[] = donnees.familles
  .map((valeur, index) => lireFamille(valeur, index))
  .sort((a, b) => a.ordre - b.ordre);

const idsFamilles = new Set(familles.map((famille) => famille.id));
if (idsFamilles.size !== familles.length) erreur(`deux familles portent le meme "id".`);

const tous: Motif[] = donnees.motifs.map((valeur, index) => lireMotif(valeur, index, idsFamilles));

const idsMotifs = new Set(tous.map((motif) => motif.id));
if (idsMotifs.size !== tous.length) erreur(`deux motifs portent le meme "id".`);

/** Les motifs proposes aux familles, dans l'ordre du fichier. */
export function motifsDisponibles(): Motif[] {
  return tous.filter((motif) => motif.disponible);
}

/** Un motif par son identifiant, `undefined` s'il est inconnu ou retire. */
export function getMotif(id: string): Motif | undefined {
  return tous.find((motif) => motif.id === id && motif.disponible);
}

/**
 * Les motifs disponibles groupes par famille, familles vides exclues : une
 * pastille de famille sans motif n'aurait rien a montrer.
 */
export function motifsParFamille(): Array<{ famille: FamilleMotifs; motifs: Motif[] }> {
  return familles
    .map((famille) => ({
      famille,
      motifs: motifsDisponibles().filter((motif) => motif.famille === famille.id),
    }))
    .filter((groupe) => groupe.motifs.length > 0);
}
