/**
 * LE BRANCHEMENT : LES CONTROLES DE LA PAGE, L'ETAT, LE RENDU.
 *
 * C'est le seul fichier qui touche au DOM de la page. Il lit la configuration
 * inlinee au build (`<script type="application/json" data-donnees-configurateur>`),
 * cree l'etat, branche chaque controle dessus, puis abonne le rendu a l'etat.
 * Konva est charge en IMPORT DYNAMIQUE : il part dans un fichier separe, charge
 * par cette page seule, et jamais avant que les polices de gravure soient
 * pretes.
 *
 * SANS JAVASCRIPT, ET AVANT QUE CE FICHIER TOURNE, la page reste celle de la
 * passe A : un apercu statique deja cadre sur la stele et des controles inertes
 * (voir l'en-tete de `src/pages/personnaliser/[slug].astro`). L'apercu statique
 * n'est masque qu'au moment ou le canvas affiche quelque chose : jamais de
 * double stele, jamais de trou blanc.
 *
 * IL DELEGUE : l'inscription guidee a `formulaire.ts`, le panneau des motifs a
 * `panneau-motifs.ts`, le brouillon a `reprise.ts`. Il garde la matiere, les
 * zones du mode libre et le chargement de Konva.
 *
 * CE QU'IL NE FAIT PAS : aucun calcul (echelle.ts, composition.ts), aucun
 * dessin (rendu.ts ni motifs.ts), aucun prix, aucun export.
 * Guide : docs/CONFIGURATEUR.md.
 */
import type { Calibration } from "@/data/calibrations";
import { creeEchelle } from "./echelle";
import { creeEtat, type EtatConfigurateur } from "./etat";
import { CLE_DEMANDE, creeMotifs, remplaceMotif, retireMotif, type MotifCatalogue } from "./motifs";
import { construitScene, deposeScene } from "./export";
import { brancheInscription } from "./formulaire";
import { branchePanneauMotifs } from "./panneau-motifs";
import { branchePanneauZones } from "./panneau-zones";
import { brancheBrouillon } from "./reprise";
import { brancheEtapes } from "./etapes";
import { creeMesureur } from "./mesure";
import { attendPolices } from "./polices";
import { creeRendu } from "./rendu";
import { CAPITALE_MOYENNE, majZone, premiereZone, type DefautsZone } from "./zones";

/** Le bronze de la page, a defaut de pouvoir le lire dans le CSS. */
const ACCENT_DE_SECOURS = "#8a6a3c";

/** La police d'interface du site, meme repli. */
const POLICE_INTERFACE_DE_SECOURS = "Archivo, Helvetica, Arial, sans-serif";

/** Ce que la page inline en JSON. Les valeurs viennent toutes de `src/data`. */
export interface DonneesConfigurateur {
  calibration: Calibration;
  /** Le modele de la page, pour le devis. */
  modele: { modeleId: string; slug: string; nom: string };
  /** Chemin du visuel 1200 px et nom de chaque matiere. */
  matieres: Array<{ id: string; nom: string; image: string; vignette: string }>;
  /** Pile CSS par police, dans l'ordre de `personnalisation.ts`. */
  polices: Array<{ id: string; nom: string; famille: string; capitale: number }>;
  /** Couleur d'apercu et phrase d'aide par finition. */
  finitions: Array<{ id: string; nom: string; couleur: string; aide: string }>;
  /** La bibliotheque de motifs, geometrie des dessins comprise. */
  motifs: MotifCatalogue[];
  defauts: {
    matiere: string;
    policeId: string;
    finitionId: string;
    /** Une hauteur de lettres suggeree par rang de zone, en millimetres. */
    hauteursMmParZone: number[];
  };
}

export async function demarre(): Promise<void> {
  const balise = document.querySelector<HTMLScriptElement>("[data-donnees-configurateur]");
  const cadre = document.querySelector<HTMLDivElement>("[data-apercu-canvas]");
  if (!balise?.textContent || !cadre) return;

  const donnees = JSON.parse(balise.textContent) as DonneesConfigurateur;

  const imagesParMatiere = new Map(donnees.matieres.map((m) => [m.id, m.image]));
  const nomsParMatiere = new Map(donnees.matieres.map((m) => [m.id, m.nom]));
  const famillesParPolice = new Map(donnees.polices.map((p) => [p.id, p.famille]));
  const capitalesParPolice = new Map(donnees.polices.map((p) => [p.id, p.capitale]));
  const couleursParFinition = new Map(donnees.finitions.map((f) => [f.id, f.couleur]));
  const aidesParFinition = new Map(donnees.finitions.map((f) => [f.id, f.aide]));
  const catalogueMotifs = new Map(donnees.motifs.map((motif) => [motif.id, motif]));

  /* L'echelle est connue des le depart (elle ne depend que de la calibration) :
     poser un motif n'attend donc pas Konva. */
  const echelle = creeEchelle(donnees.calibration);

  /* Ce qu'une zone reprend quand rien ne la precede. Les hauteurs de lettres
     viennent de la page (`hauteursParDefaut` de `personnalisation.ts`). */
  const defautsZone: DefautsZone = {
    policeId: donnees.defauts.policeId,
    finitionId: donnees.defauts.finitionId,
    hauteursMm: donnees.defauts.hauteursMmParZone,
  };

  /* L'etat part avec UNE zone de texte, comme la page que le visiteur voit
     avant que ce script tourne. La famille en ajoute si elle veut. */
  const zoneInitiale = premiereZone(defautsZone);

  const etat = creeEtat({
    matiere: donnees.defauts.matiere,
    zones: [zoneInitiale],
    zoneActive: zoneInitiale.cle,
    motifs: [],
    motifSurDemande: null,
  });

  /* ------------------------------------------------------- Les controles */

  const statique = document.querySelector<HTMLElement>("[data-apercu-statique]");
  const imageStatique = document.querySelector<HTMLImageElement>("[data-apercu-image]");
  const nomsMatiere = [...document.querySelectorAll<HTMLElement>("[data-matiere-nom]")];

  const boutonsMatiere = [...document.querySelectorAll<HTMLButtonElement>("[data-matiere]")];

  /** Un seul bouton allume dans un groupe, `aria-pressed` fait foi. */
  function allume(boutons: HTMLButtonElement[], actif: HTMLButtonElement): void {
    for (const bouton of boutons) {
      bouton.setAttribute("aria-pressed", String(bouton === actif));
    }
  }

  for (const bouton of boutonsMatiere) {
    bouton.addEventListener("click", () => {
      const matiere = bouton.dataset.matiere;
      if (!matiere) return;

      allume(boutonsMatiere, bouton);
      if (bouton.dataset.nom) for (const nom of nomsMatiere) nom.textContent = bouton.dataset.nom;

      /* L'apercu statique est masque des que le canvas tourne, mais on le garde
         a jour : si Konva n'a pas pu demarrer, la page reste juste. */
      if (imageStatique && bouton.dataset.matiere) {
        const chemin = imagesParMatiere.get(matiere);
        if (chemin) imageStatique.src = chemin;
        if (bouton.dataset.alt) imageStatique.alt = bouton.dataset.alt;
      }

      etat.maj({ matiere });
    });
  }

  /* --------------------------------- Les zones de la mise en page libre */

  /* Onglets de zones, champ de texte, police, taille, finition, recentrer :
     `panneau-zones.ts` (passe C2, sortie de ce fichier le 26.10.2026). */
  const panneauZones = branchePanneauZones({ etat, echelle, defautsZone, aidesParFinition });

  /* ----------------------------------- L'inscription guidee (23.10.2026) */

  /* Le mesureur lit les polices de gravure : il est refait quand elles sont
     chargees (plus bas), et la composition reprend avec les vraies largeurs. */
  const familleDe = (policeId: string) => famillesParPolice.get(policeId) ?? "serif";
  const capitaleDe = (policeId: string) => capitalesParPolice.get(policeId) ?? CAPITALE_MOYENNE;
  let mesureur = creeMesureur(familleDe, capitaleDe);
  /* Le rendu du texte n'existe qu'avec Konva : le mode est applique a son
     arrivee. */
  let vuesTexte: { autoriseDeplacement(oui: boolean): void; basDuTexte(): number | null } | null =
    null;
  /* Le brouillon (plus bas) est prevenu des changements de mode, qui ne
     changent pas toujours l'etat. */
  let planifieSauvegarde = () => {};
  const formulaire = brancheInscription({
    etat,
    echelle,
    mesureur: () => mesureur,
    policeId: donnees.defauts.policeId,
    finitionId: donnees.defauts.finitionId,
    aidesParFinition,
    surMode: (mode) => {
      vuesTexte?.autoriseDeplacement(mode === "libre");
      planifieSauvegarde();
    },
  });

  /* ------------------------------------------------------------ Les motifs */

  /* Le panneau des motifs (familles, liste « Sur votre stele », motif sur
     demande) vit dans `panneau-motifs.ts`. Le rendu Konva lui est attache plus
     bas, quand il existe. */
  const panneauMotifs = branchePanneauMotifs({
    etat,
    echelle,
    catalogue: catalogueMotifs,
    basDuTexte: () => vuesTexte?.basDuTexte() ?? null,
  });

  /* ------------------------------------------- Le brouillon (passe F) */

  /* La reprise de ce que la famille avait commence, puis la sauvegarde a
     chaque changement : `reprise.ts` (le stockage lui-meme : `brouillon.ts`).
     Avant le canvas, pour que le premier dessin montre deja sa stele. */
  planifieSauvegarde = brancheBrouillon({
    modeleId: donnees.calibration.modeleId,
    etat,
    echelle,
    formulaire,
    catalogue: catalogueMotifs,
    defautsZone,
  }).planifie;

  /* ------------------------------------------- Les etapes (28.10.2026) */

  /* La barre 01-04, Retour / Continuer, le recapitulatif, l'apercu repliable
     du telephone : `etapes.ts`. Avant le canvas : la navigation marche meme
     si Konva tarde ou echoue. */
  brancheEtapes({
    etat,
    modeleId: donnees.calibration.modeleId,
    nomMatiere: (id) => nomsParMatiere.get(id) ?? id,
    vignetteMatiere: (id) => donnees.matieres.find((m) => m.id === id)?.vignette ?? "",
    nomPolice: (id) => donnees.polices.find((p) => p.id === id)?.nom ?? id,
    nomFinition: (id) => donnees.finitions.find((f) => f.id === id)?.nom ?? id,
    nomMotif: (id) => catalogueMotifs.get(id)?.nom ?? id,
    fichierMotif: (id) => catalogueMotifs.get(id)?.fichier ?? "",
  });

  /* ------------------------------------------------------------ Le rendu */

  /* Les polices d'abord : un canvas dessine avec une police de remplacement ne
     se redessine pas tout seul quand la vraie arrive. */
  await attendPolices(donnees.polices.map((police) => police.famille));
  mesureur = creeMesureur(familleDe, capitaleDe);
  formulaire.recompose();

  const konva = (await import("konva")).default;

  /* Les traces des motifs : lus dans les SVG publics (deja en cache par les
     vignettes), en parallele avec Konva. Un fichier illisible retire son motif
     du canvas sans casser le reste. */
  await Promise.all(
    [...catalogueMotifs.values()].map(async (motif) => {
      try {
        const source = await (await fetch(motif.fichier)).text();
        motif.d = /\sd="([^"]+)"/.exec(source)?.[1] ?? "";
      } catch {
        motif.d = "";
      }
    }),
  );

  const vues = creeRendu(konva, {
    conteneur: cadre,
    echelle,
    imagePourMatiere: (matiere) => imagesParMatiere.get(matiere) ?? "",
    familleDePolice: (policeId) => famillesParPolice.get(policeId) ?? "serif",
    capitaleDePolice: (policeId) => capitalesParPolice.get(policeId) ?? CAPITALE_MOYENNE,
    couleurDeFinition: (finitionId) => couleursParFinition.get(finitionId) ?? "#ffffff",
    couleurAccent:
      getComputedStyle(cadre).getPropertyValue("--cfg-accent").trim() || ACCENT_DE_SECOURS,
    surDeplacement: (cle, position) =>
      etat.maj({
        zones: majZone(etat.lire().zones, cle, {
          xCm: position.xCm,
          yCm: position.yCm,
        }),
      }),
    surZoneActive: (cle) => {
      if (etat.lire().zoneActive !== cle) etat.maj({ zoneActive: cle });
    },
    surDepassement: (cles) => panneauZones.surDepassement(cles),
  });

  /* Le bronze des poignees et du cadre « Motif a creer » vient du CSS de la
     page (`--cfg-accent`) : une seule definition de la couleur. */
  const accent =
    getComputedStyle(cadre).getPropertyValue("--cfg-accent").trim() || ACCENT_DE_SECOURS;

  /* Le libelle « Motif a creer » prend la police de l'interface, LUE SUR LA
     PAGE : le `--font-sans` du theme est « inline » par Tailwind, donc la
     variable elle-meme n'existe pas a l'execution. */
  const policeInterface = getComputedStyle(document.body).fontFamily || POLICE_INTERFACE_DE_SECOURS;

  /* Un motif est grave dans la meme finition que les lettres. Avec plusieurs
     zones il faut en choisir une : c'est celle de la ZONE 1, la principale. */
  const couleurMotifs = (valeur: EtatConfigurateur) =>
    couleursParFinition.get(valeur.zones[0]?.finitionId ?? "") ?? "#ffffff";

  const vuesMotifs = creeMotifs(konva, {
    couche: vues.coucheMotifs,
    stage: vues.stage,
    echelle,
    motifs: catalogueMotifs,
    affichage: () => vues.affichage(),
    couleurAccent: accent,
    policeInterface,
    surPose: (pose) => {
      const motif = catalogueMotifs.get(pose.id);
      if (!motif) return;
      etat.maj({ motifs: remplaceMotif(etat.lire().motifs, pose, motif, echelle) });
    },
    surDemande: (geometrie) => panneauMotifs.majDemande(geometrie),
    /* Suppr sur l'apercu : la meme touche retire un motif ou le cadre sur
       demande, c'est la cle qui dit lequel. */
    surRetrait: (cle) => {
      if (cle === CLE_DEMANDE) etat.maj({ motifSurDemande: null });
      else etat.maj({ motifs: retireMotif(etat.lire().motifs, cle) });
    },
    surSelection: (cle) => panneauMotifs.surSelection(cle),
  });
  panneauMotifs.attache(vuesMotifs);

  vuesTexte = vues;
  vues.autoriseDeplacement(formulaire.mode() === "libre");

  /* L'etat change, l'apercu suit. Le fond attend parfois une image, les motifs
     jamais : ils se redessinent tout de suite. */
  let enCours: Promise<void> = Promise.resolve();
  const dessine = (valeur: EtatConfigurateur) => {
    vuesMotifs?.dessine(valeur, couleurMotifs(valeur));
    enCours = enCours.then(() => vues.dessine(valeur)).catch(() => undefined);
  };
  etat.abonner(dessine);

  await vues.dessine(etat.lire());
  vuesMotifs.dessine(etat.lire(), couleurMotifs(etat.lire()));

  /* Le canvas affiche quelque chose : l'apercu statique peut disparaitre. */
  if (statique) statique.hidden = true;

  panneauZones.canvasPret();

  /* ------------------------------------------- Vers le devis (passe E) */

  /* Le lien « Demander un devis » emporte la scene : texte en cm, motifs,
     champs saisis et une image de l'apercu, deposes pour `/devis/` (voir
     `export.ts`). Sans JavaScript, le lien mene au formulaire vide : la
     famille y retape son inscription. */
  const lienDevis = document.querySelector<HTMLAnchorElement>("[data-vers-devis]");
  lienDevis?.addEventListener("click", (evenement) => {
    /* Les poignees d'un motif selectionne ne font pas partie de la stele. */
    vuesMotifs.selectionne(null);
    const scene = construitScene({
      etat: etat.lire(),
      echelle,
      inscription: formulaire.lit(),
      mode: formulaire.mode(),
      modele: donnees.modele,
      nomMatiere: (id) => nomsParMatiere.get(id) ?? id,
      catalogue: catalogueMotifs,
      apercu: vues.capture(),
    });
    if (!deposeScene(scene)) return;
    evenement.preventDefault();
    window.location.assign(`/devis/?modele=${encodeURIComponent(donnees.modele.slug)}&scene=1`);
  });

  /* Fenetre redimensionnee (ou telephone tourne) : l'echelle d'affichage
     change, les coordonnees de la gravure non. Un seul recalcul par image. */
  let attente = 0;
  window.addEventListener("resize", () => {
    if (attente) return;
    attente = window.requestAnimationFrame(() => {
      attente = 0;
      vues.redimensionne();
      /* Les motifs ne bougent pas (leurs positions sont en cm), mais les
         poignees du transformateur doivent garder leur taille a l'ecran. */
      vuesMotifs?.redimensionne();
    });
  });
}
