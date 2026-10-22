/**
 * L'ETAT DU CONFIGURATEUR, ET RIEN D'AUTRE.
 *
 * Ce fichier garde ce que la famille a choisi (matiere, texte, police, hauteur
 * des lettres, finition, position du texte) et previent ses abonnes a chaque
 * changement. Il ne touche ni au DOM, ni au canvas, ni a Konva : les controles
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

function identique(a: EtatConfigurateur, b: EtatConfigurateur): boolean {
  return (
    a.matiere === b.matiere &&
    a.texte === b.texte &&
    a.policeId === b.policeId &&
    a.hauteurMm === b.hauteurMm &&
    a.finitionId === b.finitionId &&
    a.position?.xCm === b.position?.xCm &&
    a.position?.yCm === b.position?.yCm &&
    (a.position === null) === (b.position === null)
  );
}

export function creeEtat(initial: EtatConfigurateur): Magasin {
  let etat: EtatConfigurateur = { ...initial };
  const abonnes = new Set<Abonne>();

  const lire = (): EtatConfigurateur => ({ ...etat });

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
