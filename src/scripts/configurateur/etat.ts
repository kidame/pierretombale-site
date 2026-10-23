/**
 * L'ETAT DU CONFIGURATEUR, ET RIEN D'AUTRE.
 *
 * Ce fichier garde ce que la famille a choisi (matiere, zones de texte avec leur
 * police, leur hauteur de lettres, leur finition et leur place, motifs poses) et
 * previent ses abonnes a chaque changement. Il ne touche ni au DOM, ni au
 * canvas, ni a Konva : les controles de la page appellent `maj`, le rendu
 * s'abonne, et les deux s'ignorent.
 *
 * CE QU'IL NE FAIT PAS : aucune validation metier, aucun calcul d'echelle
 * (voir `echelle.ts`), aucune fabrication de zone (voir `zones.ts`), aucun
 * enregistrement (le brouillon est la passe F).
 *
 * L'etat est stocke en UNITES REELLES : millimetres pour les lettres,
 * centimetres pour les positions. Jamais de pixels : une position en pixels ne
 * voudrait plus rien dire sur un autre ecran, ni dans la fiche de travail de
 * l'atelier (decision du 14.10.2026).
 */

/** Coin haut gauche d'un bloc, en cm depuis le coin de la zone gravable. */
export interface Position {
  xCm: number;
  yCm: number;
}

/**
 * L'ALIGNEMENT D'UNE ZONE : UNE SEULE VALEUR AUJOURD'HUI.
 *
 * Thomas a choisi le 14.10.2026 la version securisee : tout est centre, et la
 * page n'offre aucun bouton d'alignement. Le champ existe quand meme dans la
 * scene, fige a "centre", pour qu'ajouter un jour "gauche" et "droite" ne
 * casse aucun devis deja envoye (`docs/DECISIONS-ET-ETAT.md`).
 */
export type Alignement = "centre";

export const ALIGNEMENT_ZONE: Alignement = "centre";

/**
 * UNE ZONE DE TEXTE. Trois au maximum (`ZONES_MAX` de
 * `src/data/configurateur.ts`), chacune avec SA police, SA hauteur de
 * lettres et SA finition : une stele porte souvent un nom en grand, des dates
 * plus petites et une epitaphe plus discrete encore.
 */
export interface ZoneTexte {
  /** Identifiant de la zone, stable tant qu'elle existe. */
  cle: string;
  /** Le texte a graver, retours a la ligne compris (4 lignes au plus). */
  texte: string;
  /** Identifiant de police (`src/data/personnalisation.ts`). */
  policeId: string;
  /** Hauteur des lettres en millimetres, comme le contrat du devis. */
  hauteurMm: number;
  /** Identifiant de finition (`src/data/personnalisation.ts`). */
  finitionId: string;
  alignement: Alignement;
  /**
   * Coin haut gauche, en cm depuis le coin de la zone gravable. Les deux axes
   * sont independants : `xCm` a `null` centre la zone horizontalement a chaque
   * rendu (c'est ce que fait « Recentrer le texte »), `yCm` a `null` la centre
   * verticalement.
   */
  xCm: number | null;
  yCm: number | null;
  /**
   * La surface de texte (la stele) ou la zone se centre quand `xCm` ou `yCm`
   * vaut `null` : 0, la premiere, sauf sur un monument a plusieurs steles.
   */
  surface?: number;
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
  /** Les zones de texte, dans l'ordre d'affichage (zone 1, 2, 3). */
  zones: ZoneTexte[];
  /** La cle de la zone que les controles de la page modifient. */
  zoneActive: string;
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

function memesZones(a: ZoneTexte[], b: ZoneTexte[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  return a.every((zone, index) => {
    const autre = b[index];
    return (
      zone.cle === autre.cle &&
      zone.texte === autre.texte &&
      zone.policeId === autre.policeId &&
      zone.hauteurMm === autre.hauteurMm &&
      zone.finitionId === autre.finitionId &&
      zone.alignement === autre.alignement &&
      zone.xCm === autre.xCm &&
      zone.yCm === autre.yCm
    );
  });
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
    a.zoneActive === b.zoneActive &&
    memesZones(a.zones, b.zones) &&
    memesMotifs(a.motifs, b.motifs) &&
    memeDemande(a.motifSurDemande, b.motifSurDemande)
  );
}

export function creeEtat(initial: EtatConfigurateur): Magasin {
  let etat: EtatConfigurateur = { ...initial };
  const abonnes = new Set<Abonne>();

  /* Les listes sont recopiees elles aussi : un abonne qui bougerait une zone ou
     un motif de la copie modifierait l'etat sans prevenir personne. */
  const lire = (): EtatConfigurateur => ({
    ...etat,
    zones: etat.zones.map((zone) => ({ ...zone })),
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

/* --------------------------------------------------------------- La scene */

/** Une zone de texte telle que l'atelier la lira : numerotee, en cm. */
export interface SceneZone {
  /** 1, 2 ou 3 : le numero que la page affiche sur son onglet. */
  numero: number;
  texte: string;
  policeId: string;
  hauteurMm: number;
  finitionId: string;
  alignement: Alignement;
  /** `null` : la zone est centree sur cet axe dans la zone gravable. */
  xCm: number | null;
  yCm: number | null;
}

/**
 * LA SCENE EN CENTIMETRES : ce que la passe E joindra a la demande de devis, et
 * ce que l'atelier gravera. Aucun pixel, aucune cle interne, aucun `File` : un
 * fichier ne s'ecrit pas en JSON, seul son nom voyage ici (l'envoi du fichier
 * lui-meme suivra `docs/devis-contrat.md`).
 *
 * RIEN N'EST ENVOYE EN C2 : cette fonction existe pour que la passe E n'ait
 * rien a inventer, et pour que la forme de la scene soit decidee au meme
 * endroit que l'etat.
 */
export interface SceneEnCm {
  matiere: string;
  zones: SceneZone[];
  motifs: Array<{
    id: string;
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
}

export function sceneEnCm(etat: EtatConfigurateur): SceneEnCm {
  const demande = etat.motifSurDemande;

  return {
    matiere: etat.matiere,
    zones: etat.zones.map((zone, index) => ({
      numero: index + 1,
      texte: zone.texte,
      policeId: zone.policeId,
      hauteurMm: zone.hauteurMm,
      finitionId: zone.finitionId,
      alignement: zone.alignement,
      xCm: zone.xCm,
      yCm: zone.yCm,
    })),
    motifs: etat.motifs.map((pose) => ({
      id: pose.id,
      xCm: pose.xCm,
      yCm: pose.yCm,
      largeurCm: pose.largeurCm,
      miroir: pose.miroir,
    })),
    motifSurDemande: demande
      ? {
          description: demande.description,
          nomFichier: demande.fichier?.name ?? null,
          xCm: demande.xCm,
          yCm: demande.yCm,
          largeurCm: demande.largeurCm,
          hauteurCm: demande.hauteurCm,
        }
      : null,
  };
}
