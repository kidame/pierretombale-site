/**
 * LE RENDU KONVA : L'APERCU, ET RIEN QUE L'APERCU.
 *
 * Trois couches, dans cet ordre :
 *   - le FOND, une `Konva.Image` = le visuel 1200 px du modele dans la matiere
 *     courante, recadre sur la stele (`crop` = `vueStelePx`) et mis a l'echelle
 *     de la largeur du cadre ;
 *   - les MOTIFS, vide ici : la couche est creee et mise a l'echelle par ce
 *     fichier, mais c'est `motifs.ts` qui la remplit. Elle est SOUS le texte,
 *     parce qu'une inscription ne doit jamais passer derriere un ornement ;
 *   - le TEXTE, un `Konva.Text` centre, deplacable a la souris ou au doigt,
 *     borne a la zone gravable.
 *
 * LE SYSTEME DE COORDONNEES. La couche du texte porte une transformation
 * (echelle + decalage) qui la fait travailler en PIXELS DE L'IMAGE SERVIE :
 * la taille des lettres, la position et la zone gravable sont donc les memes
 * chiffres quelle que soit la taille de la fenetre, et un redimensionnement ne
 * deplace rien (voir `echelle.ts`).
 *
 * CE QU'IL NE FAIT PAS : il ne lit aucun controle de la page (c'est
 * `index.ts`), ne garde pas l'etat (c'est `etat.ts`), ne dessine aucun motif
 * (c'est `motifs.ts`), ne calcule aucun prix et n'exporte pas d'image (passes D
 * et E). Une seule zone de texte ; les trois zones viennent en passe C2.
 */
import type { Echelle, Point, Taille } from "./echelle";
import type { EtatConfigurateur, Position } from "./etat";

/* Les types de Konva, exportes une seule fois : `motifs.ts` travaille sur la
   couche de ce fichier et ne redeclare pas la meme chose. */
export type ModuleKonva = (typeof import("konva"))["default"];
export type Stage = InstanceType<ModuleKonva["Stage"]>;
export type Layer = InstanceType<ModuleKonva["Layer"]>;
type NoeudTexte = InstanceType<ModuleKonva["Text"]>;
type NoeudImage = InstanceType<ModuleKonva["Image"]>;

export interface OptionsRendu {
  /** L'element de la page qui recoit le canvas. Sa largeur fait l'echelle. */
  conteneur: HTMLDivElement;
  echelle: Echelle;
  /** Chemin du visuel 1200 px pour une matiere. */
  imagePourMatiere: (matiere: string) => string;
  /** Pile CSS de police pour un identifiant de police. */
  familleDePolice: (policeId: string) => string;
  /** Couleur d'apercu pour un identifiant de finition. */
  couleurDeFinition: (finitionId: string) => string;
  /** Appele quand la famille a deplace le texte : la position part dans l'etat. */
  surDeplacement: (position: Position) => void;
}

export interface Rendu {
  /** Redessine tout depuis l'etat. Attend l'image de la matiere si besoin. */
  dessine(etat: EtatConfigurateur): Promise<void>;
  /** Recalcule l'echelle d'affichage et redessine (fenetre redimensionnee). */
  redimensionne(): void;
  detruit(): void;
  /** La scene, pour qui doit ecouter les clics hors motif (`motifs.ts`). */
  stage: Stage;
  /** La couche des motifs : vide, sous le texte, deja a l'echelle. */
  coucheMotifs: Layer;
  /**
   * Pixels du canvas par pixel de l'image servie. Change a chaque
   * redimensionnement de la fenetre : a lire, jamais a garder.
   */
  affichage(): number;
}

/** Interligne de la gravure. Une valeur, un seul endroit. */
const INTERLIGNE = 1.25;

function chargeImage(url: string, cache: Map<string, HTMLImageElement>): Promise<HTMLImageElement> {
  const connue = cache.get(url);
  if (connue) return Promise.resolve(connue);

  return new Promise((resoud, rejette) => {
    const image = new Image();
    image.decoding = "sync";
    image.onload = () => {
      cache.set(url, image);
      resoud(image);
    };
    image.onerror = () => rejette(new Error(`Visuel introuvable : ${url}`));
    image.src = url;
  });
}

export function creeRendu(konva: ModuleKonva, options: OptionsRendu): Rendu {
  const { conteneur, echelle } = options;
  const cache = new Map<string, HTMLImageElement>();

  const stage: Stage = new konva.Stage({ container: conteneur, width: 1, height: 1 });

  const coucheFond: Layer = new konva.Layer({ listening: false });
  /* L'ordre d'ajout fait l'ordre d'empilement : fond, motifs, texte. */
  const coucheMotifs: Layer = new konva.Layer();
  const coucheTexte: Layer = new konva.Layer();
  stage.add(coucheFond);
  stage.add(coucheMotifs);
  stage.add(coucheTexte);

  /* `image: undefined` : le fond existe avant son visuel, pose au premier
     `dessine`. Konva exige la cle, pas la valeur. */
  const fond: NoeudImage = new konva.Image({ image: undefined, x: 0, y: 0, listening: false });
  coucheFond.add(fond);

  /* L'echelle d'affichage : pixels du canvas par pixel de l'image servie.
     Elle ne vit QUE dans ce fichier. */
  let affichage = 1;

  const texte: NoeudTexte = new konva.Text({
    text: "",
    align: "center",
    lineHeight: INTERLIGNE,
    fontSize: 10,
    draggable: true,
    /* Le texte ne sort jamais de la zone gravable : la borne est appliquee
       pendant le deplacement, pas apres. Konva donne et attend des coordonnees
       ABSOLUES (celles du stage), d'ou l'aller-retour par la transformation de
       la couche. */
    dragBoundFunc: (pos) => {
      const local: Point = {
        x: (pos.x - coucheTexte.x()) / affichage,
        y: (pos.y - coucheTexte.y()) / affichage,
      };
      const borne = echelle.borne(local, tailleTexte());
      return {
        x: borne.x * affichage + coucheTexte.x(),
        y: borne.y * affichage + coucheTexte.y(),
      };
    },
  });
  coucheTexte.add(texte);

  function tailleTexte(): Taille {
    return { largeur: texte.width(), hauteur: texte.height() };
  }

  /* Curseur en main sur le texte : c'est le seul indice qui dit qu'on peut le
     deplacer. Sur un ecran tactile il ne coute rien. */
  const curseur = (valeur: string) => {
    conteneur.style.cursor = valeur;
  };
  texte.on("mouseenter", () => curseur("grab"));
  texte.on("mouseleave", () => curseur("default"));
  texte.on("dragstart", () => curseur("grabbing"));
  texte.on("dragend", () => {
    curseur("grab");
    options.surDeplacement(echelle.cmDepuisPoint({ x: texte.x(), y: texte.y() }));
  });

  function ajusteTaille(): void {
    const largeur = Math.max(1, Math.round(conteneur.clientWidth));
    const hauteur = Math.round((largeur * echelle.vue.hauteur) / echelle.vue.largeur);

    stage.size({ width: largeur, height: hauteur });
    affichage = largeur / echelle.vue.largeur;

    /* Le fond montre exactement `vueStelePx` : on recadre l'image servie, puis
       on etire le morceau sur tout le cadre. */
    fond.size({ width: largeur, height: hauteur });
    fond.crop({
      x: echelle.vue.x,
      y: echelle.vue.y,
      width: echelle.vue.largeur,
      height: echelle.vue.hauteur,
    });

    /* Motifs et texte partagent la meme transformation : leurs coordonnees sont
       celles de l'image servie, quelle que soit la taille du cadre. */
    for (const couche of [coucheMotifs, coucheTexte]) {
      couche.scale({ x: affichage, y: affichage });
      couche.position({
        x: -echelle.vue.x * affichage,
        y: -echelle.vue.y * affichage,
      });
    }
  }

  function placeTexte(position: Position | null): void {
    const taille = tailleTexte();
    const coin = position ? echelle.pointDepuisCm(position) : echelle.centre(taille);
    texte.position(echelle.borne(coin, taille));
  }

  ajusteTaille();

  return {
    async dessine(etat) {
      const image = await chargeImage(options.imagePourMatiere(etat.matiere), cache);
      fond.image(image);

      texte.setAttrs({
        text: etat.texte,
        /* Les hauteurs de lettres sont en millimetres dans les donnees (c'est
           l'unite du metier et celle du devis) ; le canvas travaille en cm. */
        fontSize: echelle.cmVersPx(etat.hauteurMm / 10),
        fontFamily: options.familleDePolice(etat.policeId),
        fill: options.couleurDeFinition(etat.finitionId),
      });

      /* Un texte vide laisserait une poignee invisible au milieu de la stele. */
      texte.visible(etat.texte.trim().length > 0);
      placeTexte(etat.position);

      stage.batchDraw();
    },
    redimensionne() {
      ajusteTaille();
      stage.batchDraw();
    },
    detruit() {
      stage.destroy();
    },
    stage,
    coucheMotifs,
    affichage: () => affichage,
  };
}
