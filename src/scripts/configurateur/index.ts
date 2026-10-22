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
 * CE QU'IL NE FAIT PAS : aucun calcul (echelle.ts), aucun dessin (rendu.ts ni
 * motifs.ts), aucun prix, aucun export, aucune zone de texte supplementaire.
 */
import type { Calibration } from "@/data/calibrations";
import { creeEchelle } from "./echelle";
import { creeEtat, type EtatConfigurateur, type MotifPose } from "./etat";
import {
  ajouteMotif,
  basculeMiroir,
  changeLargeur,
  creeMotifs,
  largeurMaxCm,
  MAX_MOTIFS,
  PAS_TAILLE_CM,
  remplaceMotif,
  retireMotif,
  type MotifCatalogue,
  type RenduMotifs,
} from "./motifs";
import { attendPolices } from "./polices";
import { creeRendu } from "./rendu";

/** Le bronze de la page, a defaut de pouvoir le lire dans le CSS. */
const ACCENT_DE_SECOURS = "#8a6a3c";

/** Ce que la page inline en JSON. Les valeurs viennent toutes de `src/data`. */
export interface DonneesConfigurateur {
  calibration: Calibration;
  /** Chemin du visuel 1200 px par matiere. */
  matieres: Array<{ id: string; image: string }>;
  /** Pile CSS par police, dans l'ordre de `personnalisation.ts`. */
  polices: Array<{ id: string; famille: string }>;
  /** Couleur d'apercu et phrase d'aide par finition. */
  finitions: Array<{ id: string; couleur: string; aide: string }>;
  /** La bibliotheque de motifs, geometrie des dessins comprise. */
  motifs: MotifCatalogue[];
  defauts: {
    matiere: string;
    policeId: string;
    hauteurMm: number;
    finitionId: string;
  };
}

export async function demarre(): Promise<void> {
  const balise = document.querySelector<HTMLScriptElement>("[data-donnees-configurateur]");
  const cadre = document.querySelector<HTMLDivElement>("[data-apercu-canvas]");
  if (!balise?.textContent || !cadre) return;

  const donnees = JSON.parse(balise.textContent) as DonneesConfigurateur;

  const imagesParMatiere = new Map(donnees.matieres.map((m) => [m.id, m.image]));
  const famillesParPolice = new Map(donnees.polices.map((p) => [p.id, p.famille]));
  const couleursParFinition = new Map(donnees.finitions.map((f) => [f.id, f.couleur]));
  const aidesParFinition = new Map(donnees.finitions.map((f) => [f.id, f.aide]));
  const catalogueMotifs = new Map(donnees.motifs.map((motif) => [motif.id, motif]));

  /* L'echelle est connue des le depart (elle ne depend que de la calibration) :
     poser un motif n'attend donc pas Konva. */
  const echelle = creeEchelle(donnees.calibration);

  const etat = creeEtat({
    matiere: donnees.defauts.matiere,
    texte: "",
    policeId: donnees.defauts.policeId,
    hauteurMm: donnees.defauts.hauteurMm,
    finitionId: donnees.defauts.finitionId,
    position: null,
    motifs: [],
    motifSurDemande: null,
  });

  /* ------------------------------------------------------- Les controles */

  const statique = document.querySelector<HTMLElement>("[data-apercu-statique]");
  const imageStatique = document.querySelector<HTMLImageElement>("[data-apercu-image]");
  const nomMatiere = document.querySelector<HTMLElement>("[data-matiere-nom]");
  const champTexte = document.querySelector<HTMLTextAreaElement>("[data-texte]");
  const compteur = document.querySelector<HTMLElement>("[data-compteur]");
  const choixPolice = document.querySelector<HTMLSelectElement>("[data-police]");
  const choixHauteur = document.querySelector<HTMLSelectElement>("[data-hauteur]");
  const aideFinition = document.querySelector<HTMLElement>("[data-finition-aide]");
  const boutonRecentrer = document.querySelector<HTMLButtonElement>("[data-recentrer]");

  const boutonsMatiere = [...document.querySelectorAll<HTMLButtonElement>("[data-matiere]")];
  const boutonsFinition = [...document.querySelectorAll<HTMLButtonElement>("[data-finition]")];

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
      if (nomMatiere && bouton.dataset.nom) nomMatiere.textContent = bouton.dataset.nom;

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

  if (champTexte) {
    const majTexte = () => {
      if (compteur) compteur.textContent = String(champTexte.value.length);
      etat.maj({ texte: champTexte.value });
    };
    champTexte.addEventListener("input", majTexte);
    /* Un navigateur peut restaurer la valeur d'un champ au retour en arriere. */
    majTexte();
  }

  choixPolice?.addEventListener("change", () => {
    etat.maj({ policeId: choixPolice.value });
  });

  choixHauteur?.addEventListener("change", () => {
    const hauteurMm = Number(choixHauteur.value);
    if (Number.isFinite(hauteurMm) && hauteurMm > 0) etat.maj({ hauteurMm });
  });

  for (const bouton of boutonsFinition) {
    bouton.addEventListener("click", () => {
      const finitionId = bouton.dataset.finition;
      if (!finitionId) return;

      allume(boutonsFinition, bouton);
      if (aideFinition) aideFinition.textContent = aidesParFinition.get(finitionId) ?? "";
      etat.maj({ finitionId });
    });
  }

  /* ------------------------------------------------------------ Les motifs */

  /* Le rendu des motifs n'existe qu'avec Konva ; la liste, les pastilles de
     famille et l'etat, eux, fonctionnent sans lui. */
  let vuesMotifs: RenduMotifs | null = null;

  const boutonsFamilleMotifs = [
    ...document.querySelectorAll<HTMLButtonElement>("[data-famille-motifs]"),
  ];
  const groupesMotifs = [...document.querySelectorAll<HTMLElement>("[data-groupe-motifs]")];
  const listeMotifs = document.querySelector<HTMLElement>("[data-liste-motifs]");
  const motifsVide = document.querySelector<HTMLElement>("[data-motifs-vide]");
  const motifsPlein = document.querySelector<HTMLElement>("[data-motifs-plein]");

  /* Une famille a la fois. Sans JavaScript les quatre familles restent
     affichees a la suite sous leur titre : c'est le titre qui devient inutile
     ici, pas l'inverse. */
  function montreFamilleMotifs(id: string): void {
    for (const bouton of boutonsFamilleMotifs) {
      bouton.setAttribute("aria-pressed", String(bouton.dataset.familleMotifs === id));
    }
    for (const groupe of groupesMotifs) {
      groupe.hidden = groupe.dataset.groupeMotifs !== id;
    }
  }

  for (const bouton of boutonsFamilleMotifs) {
    bouton.addEventListener("click", () => {
      if (bouton.dataset.familleMotifs) montreFamilleMotifs(bouton.dataset.familleMotifs);
    });
  }

  if (boutonsFamilleMotifs.length > 0) {
    for (const titre of document.querySelectorAll<HTMLElement>("[data-groupe-titre]")) {
      titre.hidden = true;
    }
    const premiere = boutonsFamilleMotifs[0].dataset.familleMotifs;
    if (premiere) montreFamilleMotifs(premiere);
  }

  /** Un bouton d'une ligne de la liste « Sur votre stele ». */
  function boutonPose(texte: string, label: string, action: () => void): HTMLButtonElement {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "cfg-pose-bouton";
    bouton.textContent = texte;
    /* Le mot seul ("Miroir") se repete d'une ligne a l'autre : le nom du motif
       dans l'`aria-label` dit de quel motif il s'agit. */
    bouton.setAttribute("aria-label", label);
    bouton.addEventListener("click", action);
    return bouton;
  }

  function ligneMotif(pose: MotifPose, motif: MotifCatalogue): HTMLLIElement {
    const ligne = document.createElement("li");
    ligne.className = "cfg-pose";

    const nom = document.createElement("span");
    nom.className = "cfg-pose-nom";
    nom.textContent = motif.nom;

    const taille = document.createElement("span");
    taille.className = "cfg-pose-taille";
    taille.textContent = `${Math.round(pose.largeurCm)} cm de large`;

    const actions = document.createElement("div");
    actions.className = "cfg-pose-actions";

    const miroir = boutonPose("Miroir", `Retourner le motif ${motif.nom}`, () =>
      etat.maj({ motifs: basculeMiroir(etat.lire().motifs, pose.cle) }),
    );
    miroir.setAttribute("aria-pressed", String(pose.miroir));

    const moins = boutonPose("Moins grand", `Reduire le motif ${motif.nom}`, () =>
      etat.maj({
        motifs: changeLargeur(
          etat.lire().motifs,
          pose.cle,
          -PAS_TAILLE_CM,
          catalogueMotifs,
          echelle,
        ),
      }),
    );
    moins.disabled = pose.largeurCm <= motif.largeurMinCm;

    const plus = boutonPose("Plus grand", `Agrandir le motif ${motif.nom}`, () =>
      etat.maj({
        motifs: changeLargeur(
          etat.lire().motifs,
          pose.cle,
          PAS_TAILLE_CM,
          catalogueMotifs,
          echelle,
        ),
      }),
    );
    plus.disabled = pose.largeurCm >= largeurMaxCm(motif, echelle);

    const retirer = boutonPose("Retirer", `Retirer le motif ${motif.nom}`, () => {
      vuesMotifs?.selectionne(null);
      etat.maj({ motifs: retireMotif(etat.lire().motifs, pose.cle) });
    });

    actions.append(miroir, moins, plus, retirer);
    ligne.append(nom, taille, actions);
    return ligne;
  }

  /* La liste est reecrite en entier a chaque changement : six lignes au
     maximum, et aucun etat a synchroniser a la main. */
  function majListeMotifs(valeur: EtatConfigurateur): void {
    if (listeMotifs) {
      listeMotifs.textContent = "";
      for (const pose of valeur.motifs) {
        const motif = catalogueMotifs.get(pose.id);
        if (motif) listeMotifs.append(ligneMotif(pose, motif));
      }
    }
    if (motifsVide) motifsVide.hidden = valeur.motifs.length > 0;
    if (motifsPlein) motifsPlein.hidden = valeur.motifs.length < MAX_MOTIFS;
  }

  for (const bouton of document.querySelectorAll<HTMLButtonElement>("[data-motif]")) {
    bouton.addEventListener("click", () => {
      const motif = catalogueMotifs.get(bouton.dataset.motif ?? "");
      if (!motif) return;

      const avant = etat.lire().motifs;
      const apres = ajouteMotif(avant, motif, echelle);
      /* Stele pleine : `ajouteMotif` rend la meme liste, le message le dit. */
      if (apres.length === avant.length) return;

      etat.maj({ motifs: apres });
      /* Le motif pose est selectionne : ses poignees montrent tout de suite
         qu'il se deplace et se redimensionne. */
      vuesMotifs?.selectionne(apres[apres.length - 1].cle);
    });
  }

  etat.abonner(majListeMotifs);
  majListeMotifs(etat.lire());

  /* ------------------------------------------------------------ Le rendu */

  /* Les polices d'abord : un canvas dessine avec une police de remplacement ne
     se redessine pas tout seul quand la vraie arrive. */
  await attendPolices(donnees.polices.map((police) => police.famille));

  const konva = (await import("konva")).default;

  const rendu = creeRendu(konva, {
    conteneur: cadre,
    echelle,
    imagePourMatiere: (matiere) => imagesParMatiere.get(matiere) ?? "",
    familleDePolice: (policeId) => famillesParPolice.get(policeId) ?? "serif",
    couleurDeFinition: (finitionId) => couleursParFinition.get(finitionId) ?? "#ffffff",
    surDeplacement: (position) => etat.maj({ position }),
  });

  /* Le bronze des poignees et du cadre « Motif a creer » vient du CSS de la
     page (`--cfg-accent`) : une seule definition de la couleur. */
  const accent =
    getComputedStyle(cadre).getPropertyValue("--cfg-accent").trim() || ACCENT_DE_SECOURS;

  const couleurFinition = (finitionId: string) => couleursParFinition.get(finitionId) ?? "#ffffff";

  vuesMotifs = creeMotifs(konva, {
    couche: rendu.coucheMotifs,
    stage: rendu.stage,
    echelle,
    motifs: catalogueMotifs,
    affichage: () => rendu.affichage(),
    couleurAccent: accent,
    surPose: (pose) => {
      const motif = catalogueMotifs.get(pose.id);
      if (!motif) return;
      etat.maj({ motifs: remplaceMotif(etat.lire().motifs, pose, motif, echelle) });
    },
    surRetrait: (cle) => etat.maj({ motifs: retireMotif(etat.lire().motifs, cle) }),
  });

  /* L'etat change, l'apercu suit. Le fond attend parfois une image, les motifs
     jamais : ils se redessinent tout de suite. */
  let enCours: Promise<void> = Promise.resolve();
  const dessine = (valeur: EtatConfigurateur) => {
    vuesMotifs?.dessine(valeur, couleurFinition(valeur.finitionId));
    enCours = enCours.then(() => rendu.dessine(valeur)).catch(() => undefined);
  };
  etat.abonner(dessine);

  await rendu.dessine(etat.lire());
  vuesMotifs.dessine(etat.lire(), couleurFinition(etat.lire().finitionId));

  /* Le canvas affiche quelque chose : l'apercu statique peut disparaitre. */
  if (statique) statique.hidden = true;

  if (boutonRecentrer) {
    boutonRecentrer.hidden = false;
    boutonRecentrer.addEventListener("click", () => etat.maj({ position: null }));
  }

  /* Fenetre redimensionnee (ou telephone tourne) : l'echelle d'affichage
     change, les coordonnees de la gravure non. Un seul recalcul par image. */
  let attente = 0;
  window.addEventListener("resize", () => {
    if (attente) return;
    attente = window.requestAnimationFrame(() => {
      attente = 0;
      rendu.redimensionne();
      /* Les motifs ne bougent pas (leurs positions sont en cm), mais les
         poignees du transformateur doivent garder leur taille a l'ecran. */
      vuesMotifs?.redimensionne();
    });
  });
}
