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
import { creeEtat, type EtatConfigurateur, type MotifPose, type MotifSurDemande } from "./etat";
import {
  ajouteMotif,
  basculeMiroir,
  borneDemande,
  changeLargeur,
  CLE_DEMANDE,
  creeMotifs,
  demandeCentree,
  ERREUR_FICHIER_LOURD,
  FICHIER_MAX_OCTETS,
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

/** La police d'interface du site, meme repli. */
const POLICE_INTERFACE_DE_SECOURS = "Archivo, Helvetica, Arial, sans-serif";

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

  /* Ce qui est selectionne sur l'apercu, recopie ici : la liste « Sur votre
     stele » marque sa ligne, et une ligne cliquee selectionne en retour. */
  let selectionMotif: string | null = null;

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

  /**
   * Une ligne de la liste : le nom et la taille DANS UN BOUTON (cliquer la
   * ligne montre le motif sur l'apercu, et un bouton se prend au clavier,
   * contrairement a un `li` muni d'un ecouteur), puis les actions.
   */
  function ligneListe(
    cle: string,
    nom: string,
    taille: string,
    actions: HTMLButtonElement[],
  ): HTMLLIElement {
    const ligne = document.createElement("li");
    ligne.className = "cfg-pose";
    /* `aria-current` ET une bordure bronze : la couleur seule ne se lit pas. */
    if (cle === selectionMotif) ligne.setAttribute("aria-current", "true");

    const choisir = document.createElement("button");
    choisir.type = "button";
    choisir.className = "cfg-pose-choisir";
    choisir.setAttribute("aria-label", `Montrer ${nom} sur l'aperçu`);
    choisir.addEventListener("click", () => vuesMotifs?.selectionne(cle));

    const nomElement = document.createElement("span");
    nomElement.className = "cfg-pose-nom";
    nomElement.textContent = nom;

    const tailleElement = document.createElement("span");
    tailleElement.className = "cfg-pose-taille";
    tailleElement.textContent = taille;

    choisir.append(nomElement, tailleElement);

    const groupe = document.createElement("div");
    groupe.className = "cfg-pose-actions";
    groupe.append(...actions);

    ligne.append(choisir, groupe);
    return ligne;
  }

  function ligneMotif(pose: MotifPose, motif: MotifCatalogue): HTMLLIElement {
    const actions: HTMLButtonElement[] = [];

    const miroir = boutonPose("Miroir", `Retourner le motif ${motif.nom}`, () =>
      etat.maj({ motifs: basculeMiroir(etat.lire().motifs, pose.cle) }),
    );
    miroir.setAttribute("aria-pressed", String(pose.miroir));
    actions.push(miroir);

    const moins = boutonPose("Moins grand", `Réduire le motif ${motif.nom}`, () =>
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

    actions.push(moins, plus, retirer);

    return ligneListe(pose.cle, motif.nom, `${Math.round(pose.largeurCm)} cm de large`, actions);
  }

  /* Le motif sur demande a sa ligne comme les autres : la famille voit d'un
     coup d'oeil tout ce qui est pose. Ni miroir ni boutons de taille (il n'y a
     pas encore de dessin a retourner, et le cadre se tire par ses poignees) :
     le retrait suffit. */
  function ligneDemande(demande: MotifSurDemande): HTMLLIElement {
    const retirer = boutonPose("Retirer", "Retirer le motif à créer", () => {
      vuesMotifs?.selectionne(null);
      etat.maj({ motifSurDemande: null });
    });

    return ligneListe(
      CLE_DEMANDE,
      "Motif à créer",
      `${Math.round(demande.largeurCm)} × ${Math.round(demande.hauteurCm)} cm`,
      [retirer],
    );
  }

  /* La liste est reecrite en entier a chaque changement : sept lignes au
     maximum, et aucun etat a synchroniser a la main. */
  function majListeMotifs(valeur: EtatConfigurateur): void {
    if (listeMotifs) {
      listeMotifs.textContent = "";
      for (const pose of valeur.motifs) {
        const motif = catalogueMotifs.get(pose.id);
        if (motif) listeMotifs.append(ligneMotif(pose, motif));
      }
      if (valeur.motifSurDemande) listeMotifs.append(ligneDemande(valeur.motifSurDemande));
    }

    const vide = valeur.motifs.length === 0 && !valeur.motifSurDemande;
    if (motifsVide) motifsVide.hidden = !vide;
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

  /* ------------------------------------------- « Un motif a vous » (C1) */

  /* La carte est repetee dans chaque famille : elles font toutes la meme
     chose, et il n'y a jamais qu'un seul motif sur demande. */
  const cartesDemande = [...document.querySelectorAll<HTMLButtonElement>("[data-motif-demande]")];
  const blocDemande = document.querySelector<HTMLElement>("[data-bloc-demande]");
  const champDescription = document.querySelector<HTMLTextAreaElement>(
    "[data-demande-description]",
  );
  const compteurDescription = document.querySelector<HTMLElement>("[data-demande-compteur]");
  const champFichier = document.querySelector<HTMLInputElement>("[data-demande-fichier]");
  const nomFichier = document.querySelector<HTMLElement>("[data-demande-fichier-nom]");
  const erreurFichier = document.querySelector<HTMLElement>("[data-demande-fichier-erreur]");
  const boutonRetirerDemande = document.querySelector<HTMLButtonElement>("[data-demande-retirer]");

  /** « 1,4 Mo », « 840 Ko » : de quoi comprendre une limite de 8 Mo. */
  function tailleLisible(octets: number): string {
    if (octets >= 1024 * 1024) return `${(octets / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
    return `${Math.max(1, Math.round(octets / 1024))} Ko`;
  }

  /** Change le motif sur demande, bornes a la zone gravable comprises. */
  function majDemande(changement: Partial<MotifSurDemande>): void {
    const courante = etat.lire().motifSurDemande;
    if (!courante) return;
    etat.maj({ motifSurDemande: borneDemande({ ...courante, ...changement }, echelle) });
  }

  for (const carte of cartesDemande) {
    carte.addEventListener("click", () => {
      /* Un seul cadre a la fois : recliquer la carte le RECENTRE, sans perdre
         ce que la famille a deja ecrit ni le fichier choisi. */
      const courante = etat.lire().motifSurDemande;
      etat.maj({
        motifSurDemande: {
          ...demandeCentree(echelle),
          description: courante?.description ?? "",
          fichier: courante?.fichier ?? null,
        },
      });

      vuesMotifs?.selectionne(CLE_DEMANDE);
      champDescription?.focus();
    });
  }

  if (champDescription) {
    champDescription.addEventListener("input", () => {
      if (compteurDescription) {
        compteurDescription.textContent = String(champDescription.value.length);
      }
      majDemande({ description: champDescription.value });
    });
  }

  champFichier?.addEventListener("change", () => {
    const fichier = champFichier.files?.[0] ?? null;

    /* Trop lourd : on le refuse ICI, avant tout envoi, et on le dit. Le champ
       est vide pour que la famille puisse en rechoisir un tout de suite. */
    if (fichier && fichier.size > FICHIER_MAX_OCTETS) {
      champFichier.value = "";
      if (erreurFichier) erreurFichier.textContent = ERREUR_FICHIER_LOURD;
      if (nomFichier) nomFichier.textContent = "";
      majDemande({ fichier: null });
      return;
    }

    if (erreurFichier) erreurFichier.textContent = "";
    if (nomFichier) {
      nomFichier.textContent = fichier ? `${fichier.name} (${tailleLisible(fichier.size)})` : "";
    }
    majDemande({ fichier });
  });

  boutonRetirerDemande?.addEventListener("click", () => {
    vuesMotifs?.selectionne(null);
    etat.maj({ motifSurDemande: null });
  });

  /* Le bloc n'existe que tant qu'un cadre est pose : il disparait avec lui, et
     emporte la description et le fichier (l'etat les a deja oublies). */
  function majBlocDemande(valeur: EtatConfigurateur): void {
    const demande = valeur.motifSurDemande;

    if (blocDemande) blocDemande.hidden = demande === null;
    for (const carte of cartesDemande) {
      carte.setAttribute("aria-pressed", String(demande !== null));
    }

    if (!demande) {
      if (champDescription) champDescription.value = "";
      if (compteurDescription) compteurDescription.textContent = "0";
      if (champFichier) champFichier.value = "";
      if (nomFichier) nomFichier.textContent = "";
      if (erreurFichier) erreurFichier.textContent = "";
      return;
    }

    /* Jamais pendant la frappe : reecrire la valeur deplacerait le curseur. */
    if (champDescription && champDescription.value !== demande.description) {
      champDescription.value = demande.description;
      if (compteurDescription) {
        compteurDescription.textContent = String(demande.description.length);
      }
    }
  }

  etat.abonner(majListeMotifs);
  etat.abonner(majBlocDemande);
  majListeMotifs(etat.lire());
  majBlocDemande(etat.lire());

  /* ------------------------------------------------------------ Le rendu */

  /* Les polices d'abord : un canvas dessine avec une police de remplacement ne
     se redessine pas tout seul quand la vraie arrive. */
  await attendPolices(donnees.polices.map((police) => police.famille));

  const konva = (await import("konva")).default;

  const vues = creeRendu(konva, {
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

  /* Le libelle « Motif a creer » prend la police de l'interface, LUE SUR LA
     PAGE : le `--font-sans` du theme est « inline » par Tailwind, donc la
     variable elle-meme n'existe pas a l'execution. */
  const policeInterface = getComputedStyle(document.body).fontFamily || POLICE_INTERFACE_DE_SECOURS;

  const couleurFinition = (finitionId: string) => couleursParFinition.get(finitionId) ?? "#ffffff";

  vuesMotifs = creeMotifs(konva, {
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
    surDemande: (geometrie) => majDemande(geometrie),
    /* Suppr sur l'apercu : la meme touche retire un motif ou le cadre sur
       demande, c'est la cle qui dit lequel. */
    surRetrait: (cle) => {
      if (cle === CLE_DEMANDE) etat.maj({ motifSurDemande: null });
      else etat.maj({ motifs: retireMotif(etat.lire().motifs, cle) });
    },
    surSelection: (cle) => {
      selectionMotif = cle;
      majListeMotifs(etat.lire());
    },
  });

  /* L'etat change, l'apercu suit. Le fond attend parfois une image, les motifs
     jamais : ils se redessinent tout de suite. */
  let enCours: Promise<void> = Promise.resolve();
  const dessine = (valeur: EtatConfigurateur) => {
    vuesMotifs?.dessine(valeur, couleurFinition(valeur.finitionId));
    enCours = enCours.then(() => vues.dessine(valeur)).catch(() => undefined);
  };
  etat.abonner(dessine);

  await vues.dessine(etat.lire());
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
      vues.redimensionne();
      /* Les motifs ne bougent pas (leurs positions sont en cm), mais les
         poignees du transformateur doivent garder leur taille a l'ecran. */
      vuesMotifs?.redimensionne();
    });
  });
}
