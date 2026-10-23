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
 *      que `rendu.ts` a preparee (SOUS le texte), le cadre en pointilles du
 *      motif sur demande, plus UN SEUL `Konva.Transformer` partage qui habille
 *      ce qui est selectionne, motif ou cadre.
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
  /** Chemin public du SVG : le trace y est lu au chargement du canvas. */
  fichier: string;
  /** Le trace en mm. Vide tant que le SVG n est pas lu (ou s il est illisible). */
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

/** Le libelle « Motif a creer », en pixels a l'ecran lui aussi. */
const LIBELLE_PX = 15;

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

/**
 * La place et la taille du cadre « Motif a creer » apres un deplacement ou un
 * redimensionnement. La description et le fichier, eux, ne viennent jamais du
 * canvas : c'est `index.ts` qui les conserve.
 */
export interface GeometrieDemande {
  xCm: number;
  yCm: number;
  largeurCm: number;
  hauteurCm: number;
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
  /** La pile de polices de l'interface, pour le libelle « Motif a creer ». */
  policeInterface: string;
  /** La famille a deplace ou redimensionne une pose : elle part dans l'etat. */
  surPose: (pose: MotifPose) => void;
  /** Idem pour le cadre du motif sur demande (`CLE_DEMANDE`). */
  surDemande: (geometrie: GeometrieDemande) => void;
  /** Touche Suppr ou Retour arriere sur le motif selectionne. */
  surRetrait: (cle: string) => void;
  /** La selection a change, d'ou qu'elle vienne : la liste de la page suit. */
  surSelection: (cle: string | null) => void;
}

export interface RenduMotifs {
  /** Redessine les motifs depuis l'etat, dans la couleur de la finition. */
  dessine(etat: EtatConfigurateur, couleur: string): void;
  /** Selectionne une pose (ou rien) : le transformateur suit. */
  selectionne(cle: string | null): void;
  /** Ce qui est selectionne : `CLE_DEMANDE`, une cle de pose, ou rien. */
  selection(): string | null;
  /** Les poignees gardent leur taille a l'ecran quand la fenetre change. */
  redimensionne(): void;
  detruit(): void;
}

export function creeMotifs(konva: ModuleKonva, options: OptionsMotifs): RenduMotifs {
  const { couche, stage, echelle, motifs } = options;
  const conteneur = stage.container();

  const noeuds = new Map<string, NoeudChemin>();
  let selection: string | null = null;

  /* Le cadre « Motif a creer » et son libelle. Deux noeuds plutot qu'un groupe :
     le cadre porte le deplacement et le transformateur, le libelle n'ecoute
     rien et se recentre apres chaque mouvement. Dans un groupe, le
     transformateur aurait aussi etire le texte. */
  let cadreDemande: NoeudCadre | null = null;
  let libelleDemande: NoeudTexte | null = null;

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

  /* UN SEUL transformateur pour tout ce qui se redimensionne : Konva le deplace
     d'un noeud a l'autre. Les coins seulement, jamais de rotation (une gravure
     de travers ne se rattrape pas). Le rapport largeur/hauteur est conserve
     pour un MOTIF (un dessin etire ne ressemble plus a rien) et libre pour le
     CADRE sur demande (c'est une place reservee, pas un dessin) : `keepRatio`
     bascule avec la selection, voir `majTransformateur`. */
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
      const noeud = transformateur.nodes()[0];
      const affichage = options.affichage();

      /* Les bornes de taille, en pixels du canvas : celles du dessin pour un
         motif, le seul minimum gravable pour le cadre sur demande. */
      let minLargeur: number;
      let maxLargeur: number;
      let minHauteur: number;

      if (noeud && noeud === cadreDemande) {
        minLargeur = echelle.cmVersPx(DEMANDE_MIN_CM) * affichage;
        minHauteur = minLargeur;
        maxLargeur = echelle.zone.largeur * affichage;
      } else {
        const motif = noeud ? motifDuNoeud(noeud as NoeudChemin) : undefined;
        if (!motif) return nouvelle;

        minLargeur = echelle.cmVersPx(motif.largeurMinCm) * affichage;
        minHauteur = 0;
        maxLargeur =
          Math.min(echelle.cmVersPx(motif.largeurMaxCm), echelle.zone.largeur) * affichage;
      }

      /* Hors des tailles gravables : on refuse le mouvement plutot que de
         corriger la boite, sinon la poignee « colle » et saute. */
      if (
        nouvelle.width < minLargeur ||
        nouvelle.width > maxLargeur ||
        nouvelle.height < minHauteur
      ) {
        return ancienne;
      }

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

  /* ------------------------------------- Le cadre « Motif a creer » (C1) */

  /** Le cadre tel que le canvas le porte maintenant, en cm de pierre. */
  function geometrieDemande(cadre: NoeudCadre): GeometrieDemande {
    const coin = echelle.cmDepuisPoint({ x: cadre.x(), y: cadre.y() });
    return {
      xCm: coin.xCm,
      yCm: coin.yCm,
      largeurCm: echelle.pxVersCm(cadre.width() * Math.abs(cadre.scaleX())),
      hauteurCm: echelle.pxVersCm(cadre.height() * Math.abs(cadre.scaleY())),
    };
  }

  /**
   * Le libelle recouvre exactement le cadre (`verticalAlign` fait le reste), et
   * garde sa taille a l'ecran. Un cadre trop petit pour le lire le cache
   * plutot que de laisser du texte deborder sur la gravure.
   */
  function placeLibelle(): void {
    if (!cadreDemande || !libelleDemande) return;

    const taille = LIBELLE_PX / (options.affichage() || 1);
    libelleDemande.setAttrs({
      x: cadreDemande.x(),
      y: cadreDemande.y(),
      width: cadreDemande.width(),
      height: cadreDemande.height(),
      fontSize: taille,
      fontFamily: options.policeInterface,
      fill: options.couleurAccent,
    });
    libelleDemande.visible(
      cadreDemande.height() >= taille * 2.5 && cadreDemande.width() >= taille * 5,
    );
  }

  function creeDemande(): void {
    const cadre: NoeudCadre = new konva.Rect({
      draggable: true,
      /* `transparent` et non pas rien du tout : Konva ne rend saisissable que
         l'interieur d'une forme REMPLIE, et le cadre doit s'attraper partout,
         pas seulement sur son trait. */
      fill: "transparent",
      stroke: options.couleurAccent,
      perfectDrawEnabled: false,
      shadowForStrokeEnabled: false,
      /* `strokeScaleEnabled: false` : Konva dessine alors le trait en pixels de
         L'ECRAN, sans tenir compte de l'echelle de la couche. Le pointille a
         donc la meme allure dans un cadre de 320 px et sur un grand ecran, et
         ces deux chiffres se lisent en pixels d'ecran. */
      strokeWidth: 2,
      dash: [10, 7],
      strokeScaleEnabled: false,
      dragBoundFunc: (position) => {
        const affichage = options.affichage();
        const local = {
          x: (position.x - couche.x()) / affichage,
          y: (position.y - couche.y()) / affichage,
        };
        const borne = echelle.borne(local, {
          largeur: cadre.width() * Math.abs(cadre.scaleX()),
          hauteur: cadre.height() * Math.abs(cadre.scaleY()),
        });

        return {
          x: borne.x * affichage + couche.x(),
          y: borne.y * affichage + couche.y(),
        };
      },
    });
    cadre.setAttr("motifCle", CLE_DEMANDE);

    const libelle: NoeudTexte = new konva.Text({
      text: "Motif à créer",
      align: "center",
      verticalAlign: "middle",
      /* Le libelle n'ecoute rien : un clic dessus attrape le cadre qui est
         dessous, et le transformateur n'habille jamais le texte. */
      listening: false,
    });

    cadre.on("mouseenter", () => curseur("grab"));
    cadre.on("mouseleave", () => curseur("default"));
    cadre.on("dragstart", () => curseur("grabbing"));
    cadre.on("dragmove", () => placeLibelle());
    cadre.on("dragend", () => {
      curseur("grab");
      options.surDemande(geometrieDemande(cadre));
    });

    /* Le transformateur pose une ECHELLE sur le noeud. Pour un rectangle, on la
       repasse aussitot en largeur et hauteur : sinon le trait pointille
       s'etirerait et le libelle avec lui. */
    cadre.on("transform", () => {
      cadre.setAttrs({
        width: Math.max(1, cadre.width() * cadre.scaleX()),
        height: Math.max(1, cadre.height() * cadre.scaleY()),
        scaleX: 1,
        scaleY: 1,
      });
      placeLibelle();
    });
    cadre.on("transformend", () => options.surDemande(geometrieDemande(cadre)));

    couche.add(cadre);
    couche.add(libelle);
    cadreDemande = cadre;
    libelleDemande = libelle;
  }

  function retireDemande(): void {
    cadreDemande?.destroy();
    libelleDemande?.destroy();
    cadreDemande = null;
    libelleDemande = null;
  }

  /** Le noeud selectionne, motif ou cadre sur demande. */
  function noeudSelectionne(): NoeudChemin | NoeudCadre | null {
    if (!selection) return null;
    if (selection === CLE_DEMANDE) return cadreDemande;
    return noeuds.get(selection) ?? null;
  }

  function majTransformateur(): void {
    const noeud = noeudSelectionne();
    if (noeud) {
      /* Le cadre sur demande se deforme librement ; un motif garde ses
         proportions. Un seul transformateur, deux comportements. */
      transformateur.keepRatio(selection !== CLE_DEMANDE);
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
    /* Rien a selectionner tant que le cadre n'existe pas : un transformateur
       pose sur du vide laisserait des poignees orphelines. */
    if (cle === CLE_DEMANDE && !cadreDemande) return;

    selection = cle;
    majTransformateur();
    couche.batchDraw();
    options.surSelection(selection);
  }

  ajustePoignees();

  return {
    dessine(etat, couleur) {
      let selectionPerdue = false;

      /* Les poses disparues emportent leur noeud : rien ne reste derriere. */
      const vivantes = new Set(etat.motifs.map((pose) => pose.cle));
      for (const [cle, noeud] of noeuds) {
        if (vivantes.has(cle)) continue;
        noeud.destroy();
        noeuds.delete(cle);
        if (selection === cle) {
          selection = null;
          selectionPerdue = true;
        }
      }

      /* LE CADRE SUR DEMANDE. Il n'y en a jamais qu'un, et il ne porte pas la
         couleur de la finition : ce n'est pas une gravure, c'est une place
         reservee, d'ou le bronze de la page. */
      if (!etat.motifSurDemande) {
        if (cadreDemande) retireDemande();
        if (selection === CLE_DEMANDE) {
          selection = null;
          selectionPerdue = true;
        }
      } else {
        if (!cadreDemande) creeDemande();

        const coin = echelle.pointDepuisCm({
          xCm: etat.motifSurDemande.xCm,
          yCm: etat.motifSurDemande.yCm,
        });
        cadreDemande?.setAttrs({
          x: coin.x,
          y: coin.y,
          width: echelle.cmVersPx(etat.motifSurDemande.largeurCm),
          height: echelle.cmVersPx(etat.motifSurDemande.hauteurCm),
          scaleX: 1,
          scaleY: 1,
        });
        placeLibelle();
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
         devant, et le transformateur reste au-dessus de tout. Le cadre sur
         demande reste dessous : il n'a pas de dessin a cacher. */
      for (const pose of etat.motifs) noeuds.get(pose.cle)?.moveToTop();

      majTransformateur();
      couche.batchDraw();
      if (selectionPerdue) options.surSelection(null);
    },
    selectionne,
    selection: () => selection,
    redimensionne() {
      ajustePoignees();
      placeLibelle();
      couche.batchDraw();
    },
    detruit() {
      window.removeEventListener("keydown", surTouche);
      stage.off(".motifs");
      transformateur.destroy();
      retireDemande();
      for (const noeud of noeuds.values()) noeud.destroy();
      noeuds.clear();
    },
  };
}
