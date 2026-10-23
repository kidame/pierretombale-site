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
 *   - le TEXTE, UN `Konva.Text` PAR ZONE (trois au plus), chacun centre dans sa
 *     largeur, deplacable a la souris ou au doigt, borne a la zone gravable, et
 *     dessine avec SA police, SA taille de lettres et SA couleur de finition.
 *     La zone active porte en plus un cadre fin bronze, SANS poignees : la
 *     taille des lettres se regle au centimetre dans la page, jamais en etirant
 *     un bloc de texte (une gravure ne se deforme pas).
 *
 * LE SYSTEME DE COORDONNEES. La couche du texte porte une transformation
 * (echelle + decalage) qui la fait travailler en PIXELS DE L'IMAGE SERVIE :
 * la taille des lettres, la position et la zone gravable sont donc les memes
 * chiffres quelle que soit la taille de la fenetre, et un redimensionnement ne
 * deplace rien (voir `echelle.ts`).
 *
 * CE QU'IL NE FAIT PAS : il ne lit aucun controle de la page (c'est
 * `index.ts`), ne garde pas l'etat (c'est `etat.ts`), ne dessine aucun motif
 * (c'est `motifs.ts`), ne fabrique aucune zone (c'est `zones.ts`), ne calcule
 * aucun prix et n'exporte pas d'image (passes D et E).
 */
import type { Echelle, Point, Taille } from "./echelle";
import type { EtatConfigurateur, Position, ZoneTexte } from "./etat";
import { INTERLIGNE } from "./zones";

/* Les types de Konva, exportes une seule fois : `motifs.ts` travaille sur la
   couche de ce fichier et ne redeclare pas la meme chose. */
export type ModuleKonva = (typeof import("konva"))["default"];
export type Stage = InstanceType<ModuleKonva["Stage"]>;
export type Layer = InstanceType<ModuleKonva["Layer"]>;
type NoeudTexte = InstanceType<ModuleKonva["Text"]>;
type NoeudImage = InstanceType<ModuleKonva["Image"]>;
type NoeudCadre = InstanceType<ModuleKonva["Rect"]>;

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
  /** Le bronze de la page : le cadre de la zone active, jamais la gravure. */
  couleurAccent: string;
  /** La famille a deplace une zone : sa position part dans l'etat. */
  surDeplacement: (cle: string, position: Position) => void;
  /** La famille a touche un texte sur l'apercu : sa zone devient active. */
  surZoneActive: (cle: string) => void;
  /** Apres chaque dessin : les zones dont le texte deborde de la surface gravable. */
  surDepassement?: (cles: string[]) => void;
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

  /* Un noeud par zone, retrouve par sa cle : une zone retiree emporte son
     noeud, et une zone qui reste garde le sien (donc sa place a l'ecran). */
  const noeuds = new Map<string, NoeudTexte>();

  /* LE CADRE DE LA ZONE ACTIVE. Il n'ecoute rien (un clic passe au texte qui
     est dessous) et n'a AUCUNE poignee : la taille d'une gravure se regle en
     centimetres dans la page, pas en etirant un bloc. `strokeScaleEnabled` a
     `false` fait dessiner le trait en pixels de l'ECRAN : un cadre fin reste
     fin, quelle que soit la taille de l'apercu. */
  const cadreActif: NoeudCadre = new konva.Rect({
    listening: false,
    visible: false,
    stroke: options.couleurAccent,
    strokeWidth: 1,
    strokeScaleEnabled: false,
    cornerRadius: 2,
    perfectDrawEnabled: false,
    shadowForStrokeEnabled: false,
  });
  coucheTexte.add(cadreActif);

  /** La zone dont le cadre est affiche. `null` : aucun cadre. */
  let cleActive: string | null = null;

  /* Curseur en main sur le texte : c'est le seul indice qui dit qu'on peut le
     deplacer. Sur un ecran tactile il ne coute rien. */
  const curseur = (valeur: string) => {
    conteneur.style.cursor = valeur;
  };

  function tailleDuNoeud(noeud: NoeudTexte): Taille {
    return { largeur: noeud.width(), hauteur: noeud.height() };
  }

  function noeudDeZone(cle: string): NoeudTexte {
    const connu = noeuds.get(cle);
    if (connu) return connu;

    const noeud: NoeudTexte = new konva.Text({
      text: "",
      align: "center",
      lineHeight: INTERLIGNE,
      fontSize: 10,
      draggable: true,
      /* Le texte ne sort jamais de la zone gravable : la borne est appliquee
         pendant le deplacement, pas apres. Konva donne et attend des
         coordonnees ABSOLUES (celles du stage), d'ou l'aller-retour par la
         transformation de la couche. */
      dragBoundFunc: (pos) => {
        const local: Point = {
          x: (pos.x - coucheTexte.x()) / affichage,
          y: (pos.y - coucheTexte.y()) / affichage,
        };
        const borne = echelle.borne(local, tailleDuNoeud(noeud));
        return {
          x: borne.x * affichage + coucheTexte.x(),
          y: borne.y * affichage + coucheTexte.y(),
        };
      },
    });

    noeud.on("mouseenter", () => curseur("grab"));
    noeud.on("mouseleave", () => curseur("default"));
    /* Toucher un texte sur l'apercu rend sa zone active : l'onglet et les
       controles de la page suivent, et la famille modifie ce qu'elle voit. */
    noeud.on("click tap", () => options.surZoneActive(cle));
    noeud.on("dragstart", () => {
      curseur("grabbing");
      options.surZoneActive(cle);
    });
    /* Le cadre colle au texte pendant tout le deplacement. */
    noeud.on("dragmove", () => {
      placeCadre();
      coucheTexte.batchDraw();
    });
    noeud.on("dragend", () => {
      curseur("grab");
      options.surDeplacement(cle, echelle.cmDepuisPoint({ x: noeud.x(), y: noeud.y() }));
    });

    coucheTexte.add(noeud);
    noeuds.set(cle, noeud);
    return noeud;
  }

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

  /* Les deux axes sont independants : un `null` centre la zone sur cet axe. */
  function placeTexte(noeud: NoeudTexte, zone: ZoneTexte): void {
    const taille = tailleDuNoeud(noeud);
    const centre = echelle.centre(taille);
    const coin: Point = {
      x: zone.xCm === null ? centre.x : echelle.pointDepuisCm({ xCm: zone.xCm, yCm: 0 }).x,
      y: zone.yCm === null ? centre.y : echelle.pointDepuisCm({ xCm: 0, yCm: zone.yCm }).y,
    };
    noeud.position(echelle.borne(coin, taille));
  }

  /** Le cadre bronze suit le texte de la zone active, avec une petite marge. */
  function placeCadre(): void {
    const noeud = cleActive ? noeuds.get(cleActive) : undefined;
    if (!noeud || !noeud.visible()) {
      cadreActif.visible(false);
      return;
    }
    const marge = echelle.cmVersPx(0.6);
    cadreActif.setAttrs({
      x: noeud.x() - marge,
      y: noeud.y() - marge,
      width: noeud.width() + marge * 2,
      height: noeud.height() + marge * 2,
      visible: true,
    });
  }

  ajusteTaille();

  return {
    async dessine(etat) {
      const image = await chargeImage(options.imagePourMatiere(etat.matiere), cache);
      fond.image(image);

      /* Les zones retirees emportent leur noeud. */
      const cles = new Set(etat.zones.map((zone) => zone.cle));
      for (const [cle, noeud] of noeuds) {
        if (!cles.has(cle)) {
          noeud.destroy();
          noeuds.delete(cle);
        }
      }

      for (const zone of etat.zones) {
        const noeud = noeudDeZone(zone.cle);
        noeud.setAttrs({
          text: zone.texte,
          /* Les hauteurs de lettres sont en millimetres dans les donnees (c'est
             l'unite du metier et celle du devis) ; le canvas travaille en cm. */
          fontSize: echelle.cmVersPx(zone.hauteurMm / 10),
          fontFamily: options.familleDePolice(zone.policeId),
          fill: options.couleurDeFinition(zone.finitionId),
        });
        /* Un texte vide laisserait une poignee invisible au milieu de la stele. */
        noeud.visible(zone.texte.trim().length > 0);
        placeTexte(noeud, zone);
      }

      /* Un texte qui deborde reste visible (voir `echelle.borne`) ; on le
         signale pour que la famille raccourcisse ou reduise les lettres. Un
         demi-centimetre de tolerance evite l'alerte au pixel pres. */
      const tolerance = echelle.cmVersPx(0.5);
      const depassent = etat.zones
        .filter((zone) => {
          const noeud = noeuds.get(zone.cle);
          return (
            !!noeud &&
            noeud.visible() &&
            (noeud.width() > echelle.zone.largeur + tolerance ||
              noeud.height() > echelle.zone.hauteur + tolerance)
          );
        })
        .map((zone) => zone.cle);
      options.surDepassement?.(depassent);

      /* Le cadre ne sert que s'il y a plusieurs zones : avec une seule, il n'y
         a rien a distinguer. */
      cleActive = etat.zones.length > 1 ? etat.zoneActive : null;
      placeCadre();
      cadreActif.moveToTop();

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
