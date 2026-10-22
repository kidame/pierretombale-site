/**
 * L'ETAT DU CONFIGURATEUR, ET RIEN D'AUTRE.
 *
 * Ce fichier garde ce que la famille a choisi (matiere, texte, police, hauteur
 * des lettres, finition, position du texte, motifs poses) et previent ses
 * abonnes a chaque changement. Il ne touche ni au DOM, ni au canvas, ni a Konva : les controles
 * de la page appellent `maj`, le rendu s'abonne, et les deux s'ignorent.
 *
 * CE QU'IL NE FAIT PAS : aucune validation metier, aucun calcul d'echelle
 * (voir `echelle.ts`), aucun enregistrement (le brouillon est la passe F).
 *
 * L'etat est stocke en UNITES REELLES : millimetres pour les lettres,
 * centimetres pour la position. Jamais de pixels : une position en pixels ne
 * voudrait plus rien dire sur un autre ecran, ni dans la fiche de travail de
 * l'atelier (decision du 14.10.2026).
 */

/** Coin haut gauche du bloc de texte, en cm depuis le coin de la zone gravable. */
export interface Position {
  xCm: number;
  yCm: number;
}

/**
 * Un motif pose sur la stele. Sa taille et sa place sont en CENTIMETRES DE
 * PIERRE : c'est ce que l'atelier gravera, et c'est ce qui partira dans la
 * demande de devis.
 */
export interface MotifPose {
  /** Identifiant de la POSE : le meme motif peut etre pose plusieurs fois. */
  cle: string;
  /** Identifiant du motif dans `src/data/motifs.json`. */
  id: string;
  /** Coin haut gauche, en cm depuis le coin de la zone gravable. */
  xCm: number;
  yCm: number;
  largeurCm: number;
  /** `true` : le dessin est retourne horizontalement. */
  miroir: boolean;
}

export interface EtatConfigurateur {
  /** Identifiant de granit (`src/data/granits.json`). */
  matiere: string;
  /** Le texte a graver, retours a la ligne compris. */
  texte: string;
  /** Identifiant de police (`src/data/personnalisation.ts`). */
  policeId: string;
  /** Hauteur des lettres en millimetres, comme le contrat du devis. */
  hauteurMm: number;
  /** Identifiant de finition (`src/data/personnalisation.ts`). */
  finitionId: string;
  /** `null` : le texte est centre dans la zone gravable a chaque rendu. */
  position: Position | null;
  /** Les motifs poses, dans l'ordre ou la famille les a choisis. */
  motifs: MotifPose[];
  /** `null` : aucun motif a dessiner n'a ete demande. */
  motifSurDemande: MotifSurDemande | null;
}

/**
 * LE MOTIF SUR DEMANDE : la famille decrit ce qu'elle veut, nous le dessinons
 * (section 5 de `docs/MOTIFS-BIBLIOTHEQUE.md`). Sur la stele, il n'occupe
 * qu'un cadre en pointilles : sa place et sa taille, elles, sont deja vraies,
 * et c'est ce qui partira avec la demande de devis.
 *
 * Un seul a la fois. Le fichier reste un `File` du navigateur : rien n'est
 * envoye avant E6, et rien n'est garde dans le brouillon (passe F).
 */
export interface MotifSurDemande {
  description: string;
  fichier: File | null;
  xCm: number;
  yCm: number;
  largeurCm: number;
  hauteurCm: number;
}

export type Abonne = (etat: EtatConfigurateur) => void;

export interface Magasin {
  /** Une copie de l'etat courant : personne ne modifie l'original. */
  lire(): EtatConfigurateur;
  /** Change une partie de l'etat et previent les abonnes si quelque chose bouge. */
  maj(changement: Partial<EtatConfigurateur>): void;
  /** Rend la fonction qui desabonne. */
  abonner(abonne: Abonne): () => void;
}

function memesMotifs(a: MotifPose[], b: MotifPose[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  return a.every((motif, index) => {
    const autre = b[index];
    return (
      motif.cle === autre.cle &&
      motif.id === autre.id &&
      motif.xCm === autre.xCm &&
      motif.yCm === autre.yCm &&
      motif.largeurCm === autre.largeurCm &&
      motif.miroir === autre.miroir
    );
  });
}

function memeDemande(a: MotifSurDemande | null, b: MotifSurDemande | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  return (
    a.description === b.description &&
    /* Deux `File` identiques restent deux objets differents : on compare les
       references, donc choisir le meme fichier deux fois est un changement. */
    a.fichier === b.fichier &&
    a.xCm === b.xCm &&
    a.yCm === b.yCm &&
    a.largeurCm === b.largeurCm &&
    a.hauteurCm === b.hauteurCm
  );
}

function identique(a: EtatConfigurateur, b: EtatConfigurateur): boolean {
  return (
    a.matiere === b.matiere &&
    a.texte === b.texte &&
    a.policeId === b.policeId &&
    a.hauteurMm === b.hauteurMm &&
    a.finitionId === b.finitionId &&
    a.position?.xCm === b.position?.xCm &&
    a.position?.yCm === b.position?.yCm &&
    (a.position === null) === (b.position === null) &&
    memesMotifs(a.motifs, b.motifs) &&
    memeDemande(a.motifSurDemande, b.motifSurDemande)
  );
}

export function creeEtat(initial: EtatConfigurateur): Magasin {
  let etat: EtatConfigurateur = { ...initial };
  const abonnes = new Set<Abonne>();

  /* La liste des motifs est recopiee elle aussi : un abonne qui bougerait un
     motif de la copie modifierait l'etat sans prevenir personne. */
  const lire = (): EtatConfigurateur => ({
    ...etat,
    motifs: etat.motifs.map((motif) => ({ ...motif })),
    motifSurDemande: etat.motifSurDemande ? { ...etat.motifSurDemande } : null,
  });

  return {
    lire,
    maj(changement) {
      const suivant: EtatConfigurateur = { ...etat, ...changement };
      if (identique(etat, suivant)) return;

      etat = suivant;
      for (const abonne of abonnes) abonne(lire());
    },
    abonner(abonne) {
      abonnes.add(abonne);
      return () => abonnes.delete(abonne);
    },
  };
}
