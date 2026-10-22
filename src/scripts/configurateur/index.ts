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
 * CE QU'IL NE FAIT PAS : aucun calcul (echelle.ts), aucun dessin (rendu.ts),
 * aucun prix, aucun export, aucun motif, aucune zone supplementaire.
 */
import type { Calibration } from "@/data/calibrations";
import { creeEchelle } from "./echelle";
import { creeEtat, type EtatConfigurateur } from "./etat";
import { attendPolices } from "./polices";
import { creeRendu } from "./rendu";

/** Ce que la page inline en JSON. Les valeurs viennent toutes de `src/data`. */
export interface DonneesConfigurateur {
  calibration: Calibration;
  /** Chemin du visuel 1200 px par matiere. */
  matieres: Array<{ id: string; image: string }>;
  /** Pile CSS par police, dans l'ordre de `personnalisation.ts`. */
  polices: Array<{ id: string; famille: string }>;
  /** Couleur d'apercu et phrase d'aide par finition. */
  finitions: Array<{ id: string; couleur: string; aide: string }>;
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

  const etat = creeEtat({
    matiere: donnees.defauts.matiere,
    texte: "",
    policeId: donnees.defauts.policeId,
    hauteurMm: donnees.defauts.hauteurMm,
    finitionId: donnees.defauts.finitionId,
    position: null,
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

  /* ------------------------------------------------------------ Le rendu */

  /* Les polices d'abord : un canvas dessine avec une police de remplacement ne
     se redessine pas tout seul quand la vraie arrive. */
  await attendPolices(donnees.polices.map((police) => police.famille));

  const konva = (await import("konva")).default;

  const echelle = creeEchelle(donnees.calibration);
  const rendu = creeRendu(konva, {
    conteneur: cadre,
    echelle,
    imagePourMatiere: (matiere) => imagesParMatiere.get(matiere) ?? "",
    familleDePolice: (policeId) => famillesParPolice.get(policeId) ?? "serif",
    couleurDeFinition: (finitionId) => couleursParFinition.get(finitionId) ?? "#ffffff",
    surDeplacement: (position) => etat.maj({ position }),
  });

  /* Un seul abonne : l'etat change, l'apercu suit. */
  let enCours: Promise<void> = Promise.resolve();
  const dessine = (valeur: EtatConfigurateur) => {
    enCours = enCours.then(() => rendu.dessine(valeur)).catch(() => undefined);
  };
  etat.abonner(dessine);

  await rendu.dessine(etat.lire());

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
    });
  });
}
