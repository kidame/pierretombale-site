/**
 * LES MOTIFS SUR LA STELE : ETAT D'UNE POSE, ET RENDU KONVA.
 *
 * CE QUE FAIT CE FICHIER
 * Deux choses, bien separees :
 *   1. DES FONCTIONS PURES qui fabriquent et corrigent une pose (`poseCentree`,
 *      `bornePose`, `changeLargeur`...). Elles ne touchent a rien : elles
 *      prennent une liste de poses et en rendent une autre. C'est `index.ts`
 *      qui les branche sur l'etat.
 *   2. `creeMotifs`, le rendu : un `Konva.Path` par motif pose sur la couche
 *      que `rendu.ts` a preparee (SOUS le texte), plus UN SEUL
 *      `Konva.Transformer` partage qui habille le motif selectionne.
 *
 * LES UNITES, ENCORE
 * L'etat est en CENTIMETRES DE PIERRE. Le dessin, lui, vient d'un SVG dont la
 * `viewBox` est en MILLIMETRES (`largeurMm`, `hauteurMm`, lus au build par
 * `src/data/motifs-svg.ts`). D'ou l'echelle d'un motif :
 *
 *     scale = pxParCm * largeurCm / largeurMm
 *
 * Rien n'est jamais garde en pixels : une fenetre redimensionnee ne deplace
 * donc aucun motif, et la fiche de l'atelier recevra des centimetres.
 *
 * LE MIROIR est un `scaleX` NEGATIF avec un `offsetX` d'une largeur de dessin :
 * le dessin se retourne, mais son coin haut gauche ne bouge pas, donc la
 * position en cm reste vraie.
 *
 * CE QU'IL NE FAIT PAS : il ne lit aucun controle de la page (c'est
 * `index.ts`), ne garde pas l'etat (c'est `etat.ts`), ne dessine ni fond ni
 * texte (c'est `rendu.ts`), et ne calcule aucun prix.
 */
import type { Echelle } from "./echelle";
import type { EtatConfigurateur, MotifPose, MotifSurDemande } from "./etat";
import type { Layer, ModuleKonva, Stage } from "./rendu";

type NoeudChemin = InstanceType<ModuleKonva["Path"]>;
type Groupe = InstanceType<ModuleKonva["Group"]>;
type NoeudCadre = InstanceType<ModuleKonva["Rect"]>;
type NoeudTexte = InstanceType<ModuleKonva["Text"]>;
type Transformateur = InstanceType<ModuleKonva["Transformer"]>;

/**
 * Un motif de la bibliotheque, tel que la page l'inline dans son JSON de
 * configuration (voir `src/data/motifs-svg.ts`). Les largeurs sont en cm de
 * pierre, la geometrie en mm de dessin.
 */
export interface MotifCatalogue {
  id: string;
  nom: string;
  famille: string;
  largeurCm: number;
  largeurMinCm: number;
  largeurMaxCm: number;
  symetrie: boolean;
  largeurMm: number;
  hauteurMm: number;
  d: string;
}

/**
 * Six motifs au maximum sur une stele. Ce n'est pas une limite technique : au
 * dela, une stele est chargee et le graveur passe plus de temps a composer
 * qu'a graver. Pour en autoriser plus, changer ce seul chiffre.
 */
export const MAX_MOTIFS = 6;

/** Ce qu'ajoutent ou retirent les boutons « Plus grand » et « Moins grand ». */
export const PAS_TAILLE_CM = 1;

/* ------------------------------------------- Le motif sur demande (C1) */

/** La cle de pose du cadre « Motif a creer ». Il n'y en a jamais qu'un. */
export const CLE_DEMANDE = "sur-demande";

/** Le cadre a dessiner part carre, a une taille courante de gravure. */
export const DEMANDE_LARGEUR_CM = 15;
export const DEMANDE_HAUTEUR_CM = 15;

/** Plus petit, le cadre ne dirait plus rien ni a la famille ni au graveur. */
export const DEMANDE_MIN_CM = 5;

/** Longueur de la description, comme les champs libres de /devis/. */
export const DESCRIPTION_MAX = 300;

/** 8 Mo et un seul fichier : la meme limite que le formulaire de devis. */
export const FICHIER_MAX_OCTETS = 8 * 1024 * 1024;

/** Ce que nous savons relire pour dessiner un motif. */
export const FICHIER_EXTENSIONS = ".jpg,.jpeg,.png,.pdf,.svg";

/** Le message affiche quand le fichier depasse `FICHIER_MAX_OCTETS`. */
export const ERREUR_FICHIER_LOURD =
  "Ce fichier dépasse 8 Mo. Envoyez-en un plus léger, ou décrivez-nous votre idée : " +
  "nous pouvons aussi vous rappeler pour en parler.";

/** Taille des poignees du transformateur, en pixels a l'ecran. */
const POIGNEE_PX = 11;

/** Hauteur reelle d'un motif pose a cette largeur, dessin oblige. */
export function hauteurCmMotif(motif: MotifCatalogue, largeurCm: number): number {
  return (largeurCm * motif.hauteurMm) / motif.largeurMm;
}

/**
 * La plus grande largeur possible pour ce motif : sa largeur maximale, bornee
 * par la zone gravable. Une zone plus etroite que la largeur MINIMALE du motif
 * ne doit pas le rendre invisible : la largeur minimale gagne alors, le motif
 * depasse a l'oeil, et la famille le voit.
 */
export function largeurMaxCm(motif: MotifCatalogue, echelle: Echelle): number {
  const zoneLargeurCm = echelle.pxVersCm(echelle.zone.largeur);
  return Math.max(motif.largeurMinCm, Math.min(motif.largeurMaxCm, zoneLargeurCm));
}

/**
 * Ramene une pose dans ses limites : largeur entre `largeurMinCm` et
 * `largeurMaxCm` (sans depasser la zone gravable), coin a l'interieur de la
 * zone. Appelee a chaque changement, d'ou qu'il vienne : un seul endroit decide
 * de ce qui est possible.
 */
export function bornePose(pose: MotifPose, motif: MotifCatalogue, echelle: Echelle): MotifPose {
  const zoneLargeurCm = echelle.pxVersCm(echelle.zone.largeur);
  const zoneHauteurCm = echelle.pxVersCm(echelle.zone.hauteur);

  const largeurCm = Math.min(
    Math.max(pose.largeurCm, motif.largeurMinCm),
    largeurMaxCm(motif, echelle),
  );
  const hauteurCm = hauteurCmMotif(motif, largeurCm);

  return {
    ...pose,
    largeurCm,
    xCm: Math.min(Math.max(pose.xCm, 0), Math.max(0, zoneLargeurCm - largeurCm)),
    yCm: Math.min(Math.max(pose.yCm, 0), Math.max(0, zoneHauteurCm - hauteurCm)),
  };
}

/* Les cles de pose sont uniques dans la page : le meme motif peut etre pose
   plusieurs fois, et chaque pose garde son identite quand la liste change. */
let derniereCle = 0;

export function nouvelleCle(prefixe: string): string {
  derniereCle += 1;
  return `${prefixe}-${derniereCle}`;
}

/** Une pose au centre de la zone gravable, a la largeur par defaut du motif. */
export function poseCentree(motif: MotifCatalogue, echelle: Echelle): MotifPose {
  const zoneLargeurCm = echelle.pxVersCm(echelle.zone.largeur);
  const zoneHauteurCm = echelle.pxVersCm(echelle.zone.hauteur);
  const hauteurCm = hauteurCmMotif(motif, motif.largeurCm);

  return bornePose(
    {
      cle: nouvelleCle(motif.id),
      id: motif.id,
      xCm: (zoneLargeurCm - motif.largeurCm) / 2,
      yCm: (zoneHauteurCm - hauteurCm) / 2,
      largeurCm: motif.largeurCm,
      miroir: false,
    },
    motif,
    echelle,
  );
}

/** La liste avec un motif de plus, ou la meme liste si la stele est pleine. */
export function ajouteMotif(
  liste: MotifPose[],
  motif: MotifCatalogue,
  echelle: Echelle,
): MotifPose[] {
  if (liste.length >= MAX_MOTIFS) return liste;
  return [...liste, poseCentree(motif, echelle)];
}

/** La liste sans la pose `cle`. */
export function retireMotif(liste: MotifPose[], cle: string): MotifPose[] {
  return liste.filter((pose) => pose.cle !== cle);
}

/** Remplace une pose par une autre, bornes comprises. */
export function remplaceMotif(
  liste: MotifPose[],
  pose: MotifPose,
  motif: MotifCatalogue,
  echelle: Echelle,
): MotifPose[] {
  return liste.map((courante) =>
    courante.cle === pose.cle ? bornePose(pose, motif, echelle) : courante,
  );
}

/** Agrandit ou reduit une pose de `deltaCm`, dans ses limites. */
export function changeLargeur(
  liste: MotifPose[],
  cle: string,
  deltaCm: number,
  motifs: Map<string, MotifCatalogue>,
  echelle: Echelle,
): MotifPose[] {
  return liste.map((pose) => {
    if (pose.cle !== cle) return pose;

    const motif = motifs.get(pose.id);
    if (!motif) return pose;

    /* Le motif grandit autour de son centre : sinon il part vers la droite et
       la famille doit le replacer a chaque clic. */
    const avant = pose.largeurCm;
    const grandi = bornePose({ ...pose, largeurCm: avant + deltaCm }, motif, echelle);
    const ecart = grandi.largeurCm - avant;
    const ecartHauteur = hauteurCmMotif(motif, grandi.largeurCm) - hauteurCmMotif(motif, avant);

    return bornePose(
      { ...grandi, xCm: pose.xCm - ecart / 2, yCm: pose.yCm - ecartHauteur / 2 },
      motif,
      echelle,
    );
  });
}

/** Ramene le cadre « Motif a creer » dans la zone gravable. */
export function borneDemande(demande: MotifSurDemande, echelle: Echelle): MotifSurDemande {
  const zoneLargeurCm = echelle.pxVersCm(echelle.zone.largeur);
  const zoneHauteurCm = echelle.pxVersCm(echelle.zone.hauteur);

  const largeurCm = Math.min(
    Math.max(demande.largeurCm, DEMANDE_MIN_CM),
    Math.max(DEMANDE_MIN_CM, zoneLargeurCm),
  );
  const hauteurCm = Math.min(
    Math.max(demande.hauteurCm, DEMANDE_MIN_CM),
    Math.max(DEMANDE_MIN_CM, zoneHauteurCm),
  );

  return {
    ...demande,
    largeurCm,
    hauteurCm,
    xCm: Math.min(Math.max(demande.xCm, 0), Math.max(0, zoneLargeurCm - largeurCm)),
    yCm: Math.min(Math.max(demande.yCm, 0), Math.max(0, zoneHauteurCm - hauteurCm)),
  };
}

/** Un cadre « Motif a creer » vide, au centre de la zone gravable. */
export function demandeCentree(echelle: Echelle): MotifSurDemande {
  const zoneLargeurCm = echelle.pxVersCm(echelle.zone.largeur);
  const zoneHauteurCm = echelle.pxVersCm(echelle.zone.hauteur);

  return borneDemande(
    {
      description: "",
      fichier: null,
      xCm: (zoneLargeurCm - DEMANDE_LARGEUR_CM) / 2,
      yCm: (zoneHauteurCm - DEMANDE_HAUTEUR_CM) / 2,
      largeurCm: DEMANDE_LARGEUR_CM,
      hauteurCm: DEMANDE_HAUTEUR_CM,
    },
    echelle,
  );
}

/** Retourne une pose horizontalement. */
export function basculeMiroir(liste: MotifPose[], cle: string): MotifPose[] {
  return liste.map((pose) => (pose.cle === cle ? { ...pose, miroir: !pose.miroir } : pose));
}

/* ----------------------------------------------------------------- Rendu */

export interface OptionsMotifs {
  /** La couche preparee par `rendu.ts`, sous le texte et deja a l'echelle. */
  couche: Layer;
  /** La scene, pour attraper les clics hors motif (deselection). */
  stage: Stage;
  echelle: Echelle;
  /** La bibliotheque, par identifiant de motif. */
  motifs: Map<string, MotifCatalogue>;
  /** Pixels du canvas par pixel de l'image servie, lu a chaque usage. */
  affichage: () => number;
  /** Le bronze de la page : poignees et cadres, jamais le dessin lui-meme. */
  couleurAccent: string;
  /** La famille a deplace ou redimensionne une pose : elle part dans l'etat. */
  surPose: (pose: MotifPose) => void;
  /** Touche Suppr ou Retour arriere sur le motif selectionne. */
  surRetrait: (cle: string) => void;
}

export interface RenduMotifs {
  /** Redessine les motifs depuis l'etat, dans la couleur de la finition. */
  dessine(etat: EtatConfigurateur, couleur: string): void;
  /** Selectionne une pose (ou rien) : le transformateur suit. */
  selectionne(cle: string | null): void;
  /** Les poignees gardent leur taille a l'ecran quand la fenetre change. */
  redimensionne(): void;
  detruit(): void;
}

export function creeMotifs(konva: ModuleKonva, options: OptionsMotifs): RenduMotifs {
  const { couche, stage, echelle, motifs } = options;
  const conteneur = stage.container();

  const noeuds = new Map<string, NoeudChemin>();
  let selection: string | null = null;

  const curseur = (valeur: string) => {
    conteneur.style.cursor = valeur;
  };

  /** La zone gravable en pixels du canvas : la borne du transformateur. */
  function zoneCanvas(): { x: number; y: number; largeur: number; hauteur: number } {
    const affichage = options.affichage();
    return {
      x: echelle.zone.x * affichage + couche.x(),
      y: echelle.zone.y * affichage + couche.y(),
      largeur: echelle.zone.largeur * affichage,
      hauteur: echelle.zone.hauteur * affichage,
    };
  }

  function motifDuNoeud(noeud: NoeudChemin): MotifCatalogue | undefined {
    const id = noeud.getAttr("motifId");
    return typeof id === "string" ? motifs.get(id) : undefined;
  }

  /* UN SEUL transformateur pour tous les motifs : Konva le deplace d'un noeud a
     l'autre. Les coins seulement, jamais de rotation (une gravure de travers ne
     se rattrape pas), et le rapport largeur/hauteur est conserve : un motif
     etire ne ressemble plus a son dessin. */
  const transformateur: Transformateur = new konva.Transformer({
    keepRatio: true,
    rotateEnabled: false,
    enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
    borderStroke: options.couleurAccent,
    anchorStroke: options.couleurAccent,
    anchorFill: "#ffffff",
    anchorCornerRadius: 2,
    ignoreStroke: true,
    boundBoxFunc: (ancienne, nouvelle) => {
      const noeud = transformateur.nodes()[0] as NoeudChemin | undefined;
      const motif = noeud ? motifDuNoeud(noeud) : undefined;
      if (!motif) return nouvelle;

      const affichage = options.affichage();
      const minPx = echelle.cmVersPx(motif.largeurMinCm) * affichage;
      const maxPx =
        Math.min(echelle.cmVersPx(motif.largeurMaxCm), echelle.zone.largeur) * affichage;

      /* Hors des tailles gravables : on refuse le mouvement plutot que de
         corriger la boite, sinon la poignee « colle » et saute. */
      if (nouvelle.width < minPx || nouvelle.width > maxPx) return ancienne;

      /* Un demi-pixel de tolerance : sans lui, un motif cale contre le bord de
         la zone ne peut plus etre redimensionne du tout. */
      const zone = zoneCanvas();
      const marge = 0.5;
      if (
        nouvelle.x < zone.x - marge ||
        nouvelle.y < zone.y - marge ||
        nouvelle.x + nouvelle.width > zone.x + zone.largeur + marge ||
        nouvelle.y + nouvelle.height > zone.y + zone.hauteur + marge
      ) {
        return ancienne;
      }

      return nouvelle;
    },
  });
  couche.add(transformateur);

  /** Les poignees font toujours `POIGNEE_PX` a l'ecran, cadre large ou etroit. */
  function ajustePoignees(): void {
    const affichage = options.affichage() || 1;
    transformateur.anchorSize(POIGNEE_PX / affichage);
    transformateur.anchorStrokeWidth(1 / affichage);
    transformateur.borderStrokeWidth(1 / affichage);
    transformateur.padding(3 / affichage);
  }

  /** La pose telle que le canvas la porte maintenant, bornes comprises. */
  function poseDuNoeud(noeud: NoeudChemin, motif: MotifCatalogue): MotifPose {
    const coin = echelle.cmDepuisPoint({ x: noeud.x(), y: noeud.y() });
    const largeurPx = Math.abs(noeud.scaleX()) * motif.largeurMm;

    return bornePose(
      {
        cle: String(noeud.getAttr("motifCle")),
        id: motif.id,
        xCm: coin.xCm,
        yCm: coin.yCm,
        largeurCm: echelle.pxVersCm(largeurPx),
        miroir: noeud.scaleX() < 0,
      },
      motif,
      echelle,
    );
  }

  function creeNoeud(pose: MotifPose, motif: MotifCatalogue): NoeudChemin {
    const noeud: NoeudChemin = new konva.Path({
      data: motif.d,
      draggable: true,
      perfectDrawEnabled: false,
      shadowForStrokeEnabled: false,
      /* Le motif ne sort jamais de la zone gravable. Konva donne et attend des
         coordonnees ABSOLUES : d'ou l'aller-retour par la transformation de la
         couche, comme pour le texte dans `rendu.ts`. */
      dragBoundFunc: (position) => {
        const affichage = options.affichage();
        const local = {
          x: (position.x - couche.x()) / affichage,
          y: (position.y - couche.y()) / affichage,
        };
        const taille = {
          largeur: Math.abs(noeud.scaleX()) * motif.largeurMm,
          hauteur: Math.abs(noeud.scaleY()) * motif.hauteurMm,
        };
        const borne = echelle.borne(local, taille);

        return {
          x: borne.x * affichage + couche.x(),
          y: borne.y * affichage + couche.y(),
        };
      },
    });

    noeud.setAttr("motifCle", pose.cle);
    noeud.setAttr("motifId", motif.id);

    noeud.on("mouseenter", () => curseur("grab"));
    noeud.on("mouseleave", () => curseur("default"));
    noeud.on("dragstart", () => curseur("grabbing"));
    noeud.on("dragend", () => {
      curseur("grab");
      options.surPose(poseDuNoeud(noeud, motif));
    });
    noeud.on("transformend", () => options.surPose(poseDuNoeud(noeud, motif)));

    couche.add(noeud);
    return noeud;
  }

  function majTransformateur(): void {
    const noeud = selection ? noeuds.get(selection) : undefined;
    if (noeud) {
      transformateur.nodes([noeud]);
      transformateur.moveToTop();
    } else {
      transformateur.nodes([]);
    }
    ajustePoignees();
  }

  /* Un clic sur un motif le selectionne ; un clic ailleurs (le fond, le texte)
     deselectionne. Un seul ecouteur, pose sur la scene, suffit : les motifs
     portent leur cle en attribut. */
  stage.on("click.motifs tap.motifs", (evenement) => {
    const cible = evenement.target;
    const cle = cible instanceof konva.Shape ? cible.getAttr("motifCle") : null;
    selectionne(typeof cle === "string" ? cle : null);
  });

  function surTouche(evenement: KeyboardEvent): void {
    if (!selection) return;
    if (evenement.key !== "Delete" && evenement.key !== "Backspace") return;

    /* Jamais la touche d'un champ : la famille efface son texte, pas son
       motif. */
    const cible = evenement.target as HTMLElement | null;
    if (cible && (cible.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(cible.tagName))) {
      return;
    }

    evenement.preventDefault();
    const cle = selection;
    selectionne(null);
    options.surRetrait(cle);
  }

  window.addEventListener("keydown", surTouche);

  function selectionne(cle: string | null): void {
    if (selection === cle) return;
    selection = cle;
    majTransformateur();
    couche.batchDraw();
  }

  ajustePoignees();

  return {
    dessine(etat, couleur) {
      /* Les poses disparues emportent leur noeud : rien ne reste derriere. */
      const vivantes = new Set(etat.motifs.map((pose) => pose.cle));
      for (const [cle, noeud] of noeuds) {
        if (vivantes.has(cle)) continue;
        noeud.destroy();
        noeuds.delete(cle);
        if (selection === cle) selection = null;
      }

      for (const pose of etat.motifs) {
        const motif = motifs.get(pose.id);
        if (!motif) continue;

        let noeud = noeuds.get(pose.cle);
        if (!noeud) {
          noeud = creeNoeud(pose, motif);
          noeuds.set(pose.cle, noeud);
        }

        const taille = echelle.cmVersPx(pose.largeurCm) / motif.largeurMm;
        const coin = echelle.pointDepuisCm({ xCm: pose.xCm, yCm: pose.yCm });

        noeud.setAttrs({
          x: coin.x,
          y: coin.y,
          scaleX: pose.miroir ? -taille : taille,
          scaleY: taille,
          /* Avec le miroir, le dessin part vers la gauche : l'offset d'une
             largeur de dessin remet son coin haut gauche sur `x`. */
          offsetX: pose.miroir ? motif.largeurMm : 0,
          fill: couleur,
        });
      }

      /* L'ordre du calque suit l'ordre de la liste : le dernier pose passe
         devant, et le transformateur reste au-dessus de tout. */
      for (const pose of etat.motifs) noeuds.get(pose.cle)?.moveToTop();

      majTransformateur();
      couche.batchDraw();
    },
    selectionne,
    redimensionne() {
      ajustePoignees();
      couche.batchDraw();
    },
    detruit() {
      window.removeEventListener("keydown", surTouche);
      stage.off(".motifs");
      transformateur.destroy();
      for (const noeud of noeuds.values()) noeud.destroy();
      noeuds.clear();
    },
  };
}
