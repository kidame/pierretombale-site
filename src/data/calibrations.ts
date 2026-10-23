/**
 * Les calibrations du configurateur : ou se trouve la stele sur l'image d'un
 * modele, et quelle taille elle fait en centimetres.
 *
 * CE QUE FAIT CE FICHIER
 * Il relit tous les fichiers `src/data/calibrations/*.json` au build, les
 * valide un par un (un chiffre faux doit arreter le build, pas produire un
 * apercu qui ment), et les expose au reste du site par `getCalibration` et
 * `modelesCalibres`. C'est la SEULE source des coordonnees du configurateur :
 * ni la page, ni le canvas, ni les scripts ne recalculent un cadre ailleurs.
 *
 * COMMENT AJOUTER UN MODELE
 * Deposer un fichier `src/data/calibrations/<modeleId>.json` sur le modele de
 * `douceur.json`, puis relancer le build. Rien d'autre : la page
 * `/personnaliser/<slug>/` apparait d'elle-meme pour le modele, et la fiche
 * gagne son lien « Personnaliser ce modele ». Le `modeleId` doit exister dans
 * `src/data/images-modeles.json` (donc avoir ses images dans
 * `public/images/modeles/`) et correspondre au nom du fichier.
 *
 * LES UNITES, UNE FOIS POUR TOUTES
 * Toutes les coordonnees d'un fichier de calibration sont en PIXELS DE L'IMAGE
 * SOURCE (les pilotes font 1254 x 1254). Les images servies par le site font
 * 1200 px : la conversion est faite une seule fois, dans
 * `src/scripts/configurateur/echelle.ts`. Seule `stele.largeurCm` est une
 * mesure reelle ; c'est elle qui donne l'echelle cm -> px de la gravure.
 */
import imagesModeles from "./images-modeles.json";

/** Un rectangle, en pixels de l'image source. Origine en haut a gauche. */
export interface RectanglePx {
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
}

export interface Calibration {
  /** Dossier des images du modele, cle de `src/data/images-modeles.json`. */
  modeleId: string;
  /** Numero de revision de la calibration, a incrementer a chaque correction. */
  version: number;
  /** `provisoire` tant que les cotes reelles ne sont pas confirmees. */
  statut: string;
  /** Qui l'a tracee, sur quelle image, et ce qui reste a confirmer. */
  commentaire?: string;
  /** Taille de l'image sur laquelle les coordonnees ont ete relevees. */
  imagePx: { largeur: number; hauteur: number };
  stele: {
    /** La face gravable de la stele, bord a bord. */
    cadrePx: RectanglePx;
    /** Largeur reelle de ce cadre, en centimetres. Donne l'echelle. */
    largeurCm: number;
    forme?: string;
  };
  /**
   * Ou le TEXTE peut aller (rouge sur la planche de controle). Dans le JSON,
   * `zoneGravablePx` est un rectangle, ou une liste quand le monument a
   * plusieurs steles gravables (Tango) ; ici, toujours une liste, la premiere
   * surface en tete (origine des cm).
   */
  zonesGravablesPx: RectanglePx[];
  /**
   * Ou les MOTIFS peuvent aller, librement (jaune) : `zoneMotifsPx` du JSON,
   * sinon `stele.cadrePx`. Contient toutes les surfaces de texte.
   */
  zoneMotifsPx: RectanglePx;
  /** Le cadrage de l'apercu : la stele et un peu d'air autour. */
  vueStelePx: RectanglePx;
  perspective?: string;
}

/* Tous les fichiers du dossier, charges au build. `eager` : pas de chargement
   differe, ces donnees servent a generer des pages statiques. */
const fichiers = import.meta.glob<{ default: unknown }>("./calibrations/*.json", {
  eager: true,
});

const matieresConnues = imagesModeles as Record<string, { matieres: string[] }>;

function erreur(fichier: string, message: string): never {
  throw new Error(`${fichier} : ${message}`);
}

function estNombrePositif(valeur: unknown): valeur is number {
  return typeof valeur === "number" && Number.isFinite(valeur) && valeur > 0;
}

/** Valide un rectangle et verifie qu'il tient dans `dans`. */
function lireRectangle(
  fichier: string,
  valeur: unknown,
  ou: string,
  dans: { x: number; y: number; largeur: number; hauteur: number },
  nomDans: string,
): RectanglePx {
  const rect = valeur as Partial<RectanglePx> | undefined;
  if (!rect || typeof rect !== "object") {
    erreur(fichier, `"${ou}" manque (attendu { x, y, largeur, hauteur }).`);
  }
  if (typeof rect.x !== "number" || typeof rect.y !== "number") {
    erreur(fichier, `"${ou}" : "x" et "y" doivent etre des nombres.`);
  }
  if (!estNombrePositif(rect.largeur) || !estNombrePositif(rect.hauteur)) {
    erreur(fichier, `"${ou}" : "largeur" et "hauteur" doivent etre positives.`);
  }
  if (
    rect.x < dans.x ||
    rect.y < dans.y ||
    rect.x + rect.largeur > dans.x + dans.largeur ||
    rect.y + rect.hauteur > dans.y + dans.hauteur
  ) {
    erreur(
      fichier,
      `"${ou}" (x ${rect.x}, y ${rect.y}, ${rect.largeur} x ${rect.hauteur}) sort de ${nomDans} ` +
        `(x ${dans.x}, y ${dans.y}, ${dans.largeur} x ${dans.hauteur}).`,
    );
  }

  return { x: rect.x, y: rect.y, largeur: rect.largeur, hauteur: rect.hauteur };
}

function lireCalibration(chemin: string, brut: unknown): Calibration {
  const fichier = `src/data/${chemin.replace(/^\.\//, "")}`;
  const nomFichier = chemin.replace(/^.*\//, "").replace(/\.json$/, "");
  const donnees = brut as Partial<Calibration> | undefined;

  if (!donnees || typeof donnees !== "object")
    erreur(fichier, "le fichier doit contenir un objet.");

  if (typeof donnees.modeleId !== "string" || !donnees.modeleId) {
    erreur(fichier, `"modeleId" est obligatoire.`);
  }
  if (donnees.modeleId !== nomFichier) {
    erreur(
      fichier,
      `"modeleId" vaut "${donnees.modeleId}" mais le fichier s'appelle "${nomFichier}.json". ` +
        `Les deux doivent etre identiques.`,
    );
  }
  if (!matieresConnues[donnees.modeleId]) {
    erreur(
      fichier,
      `le modele "${donnees.modeleId}" est inconnu de src/data/images-modeles.json. ` +
        `Deposer ses images dans docs/images-configurateur et relancer ` +
        `scripts/images-modeles.py avant de le calibrer.`,
    );
  }

  const image = donnees.imagePx;
  if (!image || !estNombrePositif(image.largeur) || !estNombrePositif(image.hauteur)) {
    erreur(fichier, `"imagePx" doit donner la largeur et la hauteur de l'image source.`);
  }
  const cadreImage = { x: 0, y: 0, largeur: image.largeur, hauteur: image.hauteur };

  if (!donnees.stele || typeof donnees.stele !== "object") {
    erreur(fichier, `"stele" manque (attendu { cadrePx, largeurCm }).`);
  }
  const cadrePx = lireRectangle(
    fichier,
    donnees.stele.cadrePx,
    "stele.cadrePx",
    cadreImage,
    "l'image",
  );

  if (!estNombrePositif(donnees.stele.largeurCm)) {
    erreur(
      fichier,
      `"stele.largeurCm" doit etre un nombre positif : c'est la largeur reelle de ` +
        `"stele.cadrePx", et donc l'echelle de toute la gravure.`,
    );
  }

  /* Le cadre des motifs : la stele par defaut, ou une surface plus large
     quand le monument a plusieurs steles. */
  const champs = brut as Record<string, unknown>;
  const motifsDefaut = champs.zoneMotifsPx === undefined;
  const zoneMotifsPx = motifsDefaut
    ? cadrePx
    : lireRectangle(fichier, champs.zoneMotifsPx, "zoneMotifsPx", cadreImage, "l'image");

  /* Le texte est borne par le cadre des motifs, pas seulement par l'image :
     du texte qui depasse la pierre n'est pas gravable. */
  const zonesBrutes = Array.isArray(champs.zoneGravablePx)
    ? (champs.zoneGravablePx as unknown[])
    : [champs.zoneGravablePx];
  if (zonesBrutes.length === 0) {
    erreur(fichier, `"zoneGravablePx" ne peut pas etre une liste vide.`);
  }
  const zonesGravablesPx = zonesBrutes.map((rect, rang) =>
    lireRectangle(
      fichier,
      rect,
      zonesBrutes.length > 1 ? `zoneGravablePx[${rang}]` : "zoneGravablePx",
      zoneMotifsPx,
      motifsDefaut ? "stele.cadrePx" : "zoneMotifsPx",
    ),
  );

  const vueStelePx = lireRectangle(
    fichier,
    donnees.vueStelePx,
    "vueStelePx",
    cadreImage,
    "l'image",
  );

  if (!estNombrePositif(donnees.version)) erreur(fichier, `"version" doit etre un entier positif.`);
  if (typeof donnees.statut !== "string" || !donnees.statut) {
    erreur(fichier, `"statut" est obligatoire ("provisoire" ou "confirme").`);
  }

  return {
    modeleId: donnees.modeleId,
    version: donnees.version,
    statut: donnees.statut,
    commentaire: donnees.commentaire,
    imagePx: { largeur: image.largeur, hauteur: image.hauteur },
    stele: { cadrePx, largeurCm: donnees.stele.largeurCm, forme: donnees.stele.forme },
    zonesGravablesPx,
    zoneMotifsPx,
    vueStelePx,
    perspective: donnees.perspective,
  };
}

const calibrations: Map<string, Calibration> = new Map(
  Object.entries(fichiers)
    .map(([chemin, module]) => lireCalibration(chemin, module.default ?? module))
    .map((calibration) => [calibration.modeleId, calibration]),
);

/** La calibration d'un modele, ou `undefined` : tous ne sont pas calibres. */
export function getCalibration(modeleId: string): Calibration | undefined {
  return calibrations.get(modeleId);
}

/**
 * Les modeles qui ont une calibration, par ordre alphabetique de `modeleId`.
 * C'est cette liste qui decide quelles pages `/personnaliser/<slug>/` existent.
 */
export function modelesCalibres(): string[] {
  return [...calibrations.keys()].sort();
}
