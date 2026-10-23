/**
 * LE FORMULAIRE DE L'INSCRIPTION GUIDEE.
 *
 * Branche les champs de l'etape 2 (mise en page, personnes, phrase, police,
 * finition) sur la composition (`composition.ts`), qui remplace les zones de
 * texte de l'etat a chaque frappe. Deux modes :
 *   - « guide » (au chargement) : la page compose, le texte ne se deplace pas
 *     sur l'apercu ;
 *   - « libre » : les zones de la passe C2, deplacables, chacune ses reglages.
 *     On y passe avec les zones deja composees ; revenir au mode guide les
 *     recompose depuis les champs (les reglages faits a la main sont perdus,
 *     le bouton le dit).
 *
 * Les champs saisis ne vivent qu'ici : l'etat ne garde que les zones, comme
 * avant. La passe E pourra joindre `lit()` a la demande de devis.
 */
import { misesEnPage, MISE_EN_PAGE_DEFAUT, type MiseEnPageId } from "@/data/inscription";
import {
  compose,
  personneVide,
  type Composition,
  type Inscription,
  type Mesureur,
  type Personne,
} from "./composition";
import type { Echelle } from "./echelle";
import type { Magasin } from "./etat";

export type ModeInscription = "guide" | "libre";

export interface OptionsInscription {
  etat: Magasin;
  echelle: Echelle;
  /** Lu a chaque composition : il change quand les vraies polices arrivent. */
  mesureur: () => Mesureur;
  policeId: string;
  finitionId: string;
  aidesParFinition: Map<string, string>;
  /** Le mode a change : le texte devient deplacable (libre) ou fixe (guide). */
  surMode: (mode: ModeInscription) => void;
}

export interface FormulaireInscription {
  recompose(): void;
  mode(): ModeInscription;
  lit(): Inscription;
  /**
   * Remet les champs et le mode d'un brouillon (passe F). En mode libre, les
   * zones sont remises par l'appelant, apres coup : le formulaire ne les
   * recompose pas.
   */
  restaure(sauve: Inscription, mode: ModeInscription): void;
}

const LIBELLES_ROLES = { nom: "nom", dates: "dates", phrase: "phrase" } as const;

const libelleTaille = (mm: number) => `${String(mm / 10).replace(".", ",")} cm`;

/** « Taille des lettres : nom 5 cm, dates 4 cm, phrase 2 cm. » */
function resume(composition: Composition): string {
  const parRole = new Map<string, Set<number>>();
  for (const bloc of composition.blocs) {
    const role = LIBELLES_ROLES[bloc.role];
    if (!parRole.has(role)) parRole.set(role, new Set());
    parRole.get(role)?.add(bloc.hauteurMm);
  }
  if (parRole.size === 0) return "";
  const morceaux = [...parRole].map(
    ([role, tailles]) => `${role} ${[...tailles].map(libelleTaille).join(" et ")}`,
  );
  return `Taille des lettres : ${morceaux.join(", ")}.`;
}

const MESSAGE_TROP_LONG =
  "L'inscription est trop longue pour cette stèle, même en petites lettres. " +
  "Raccourcissez la phrase, ou placez le texte vous-même.";

export function brancheInscription(options: OptionsInscription): FormulaireInscription {
  const { etat, echelle } = options;

  const blocGuide = document.querySelector<HTMLElement>("[data-guide]");
  const blocLibre = document.querySelector<HTMLElement>("[data-libre]");
  const radios = [...document.querySelectorAll<HTMLInputElement>("[data-mise-en-page]")];
  const fiches = [...document.querySelectorAll<HTMLElement>("[data-personne]")];
  const champPhrase = document.querySelector<HTMLTextAreaElement>("[data-phrase]");
  const compteurPhrase = document.querySelector<HTMLElement>("[data-phrase-compteur]");
  const idees = [...document.querySelectorAll<HTMLButtonElement>("[data-idee]")];
  const choixPolice = document.querySelector<HTMLSelectElement>("[data-g-police]");
  const finitions = [...document.querySelectorAll<HTMLButtonElement>("[data-g-finition]")];
  const aideFinition = document.querySelector<HTMLElement>("[data-g-finition-aide]");
  const messageTailles = document.querySelector<HTMLElement>("[data-guide-tailles]");
  const messageTient = document.querySelector<HTMLElement>("[data-guide-tient]");
  const versLibre = document.querySelector<HTMLButtonElement>("[data-vers-libre]");
  const versGuide = document.querySelector<HTMLButtonElement>("[data-vers-guide]");

  const inscription: Inscription = {
    miseEnPage: MISE_EN_PAGE_DEFAUT,
    personnes: [personneVide(), personneVide()],
    phrase: "",
    policeId: options.policeId,
    finitionId: options.finitionId,
  };
  let mode: ModeInscription = "guide";

  function recompose(): void {
    if (mode !== "guide") return;
    const composition = compose(inscription, echelle, options.mesureur());
    const active = etat.lire().zoneActive;
    const garde = composition.zones.some((zone) => zone.cle === active);
    etat.maj({
      zones: composition.zones,
      zoneActive: garde ? active : composition.zones[0].cle,
    });
    if (messageTailles) messageTailles.textContent = resume(composition);
    if (messageTient) messageTient.textContent = composition.tient ? "" : MESSAGE_TROP_LONG;
  }

  /* --------------------------------------------------- Mise en page */
  function majFiches(): void {
    const deux = misesEnPage.find((m) => m.id === inscription.miseEnPage)?.personnes === 2;
    fiches.forEach((fiche, rang) => {
      if (rang === 1) fiche.hidden = !deux;
      const titre = fiche.querySelector<HTMLElement>("[data-personne-titre]");
      if (titre && rang === 0) titre.textContent = deux ? "La première personne" : "La personne";
    });
  }

  for (const radio of radios) {
    radio.addEventListener("change", () => {
      if (!radio.checked) return;
      inscription.miseEnPage = radio.value as MiseEnPageId;
      majFiches();
      recompose();
    });
    /* Retour en arriere du navigateur : il peut restaurer le bouton coche. */
    if (radio.checked) inscription.miseEnPage = radio.value as MiseEnPageId;
  }

  /* ------------------------------------------------------ Personnes */
  fiches.forEach((fiche, rang) => {
    for (const champ of fiche.querySelectorAll<HTMLInputElement>("[data-p]")) {
      const cle = champ.dataset.p as keyof Personne;
      const lire = () => {
        inscription.personnes[rang][cle] = champ.value;
      };
      lire();
      champ.addEventListener("input", () => {
        lire();
        recompose();
      });
    }
  });

  /* --------------------------------------------------------- Phrase */
  const majPhrase = () => {
    if (!champPhrase) return;
    inscription.phrase = champPhrase.value;
    if (compteurPhrase) compteurPhrase.textContent = String(champPhrase.value.length);
  };
  champPhrase?.addEventListener("input", () => {
    majPhrase();
    recompose();
  });
  majPhrase();

  for (const idee of idees) {
    idee.addEventListener("click", () => {
      if (!champPhrase || !idee.dataset.idee) return;
      champPhrase.value = idee.dataset.idee;
      majPhrase();
      recompose();
      champPhrase.focus();
    });
  }

  /* ------------------------------------------------ Police, finition */
  choixPolice?.addEventListener("change", () => {
    inscription.policeId = choixPolice.value;
    recompose();
  });
  if (choixPolice) inscription.policeId = choixPolice.value;

  for (const bouton of finitions) {
    bouton.addEventListener("click", () => {
      const id = bouton.dataset.gFinition;
      if (!id) return;
      inscription.finitionId = id;
      for (const autre of finitions) {
        autre.setAttribute("aria-pressed", String(autre === bouton));
      }
      if (aideFinition) aideFinition.textContent = options.aidesParFinition.get(id) ?? "";
      recompose();
    });
  }

  /* ---------------------------------------------------------- Modes */
  function appliqueMode(suivant: ModeInscription): void {
    mode = suivant;
    if (blocGuide) blocGuide.hidden = mode !== "guide";
    if (blocLibre) blocLibre.hidden = mode !== "libre";
    options.surMode(mode);
    if (mode === "guide") recompose();
  }

  /** Le changement voulu par la famille : le focus suit le bloc affiche. */
  function changeMode(suivant: ModeInscription): void {
    appliqueMode(suivant);
    if (mode === "guide") versLibre?.focus();
    else document.querySelector<HTMLButtonElement>("[data-zone-onglet]")?.focus();
  }

  function restaure(sauve: Inscription, modeSauve: ModeInscription): void {
    const connue = misesEnPage.some((m) => m.id === sauve.miseEnPage);
    inscription.miseEnPage = connue ? sauve.miseEnPage : MISE_EN_PAGE_DEFAUT;
    for (const radio of radios) radio.checked = radio.value === inscription.miseEnPage;

    fiches.forEach((fiche, rang) => {
      const personne = sauve.personnes?.[rang];
      for (const champ of fiche.querySelectorAll<HTMLInputElement>("[data-p]")) {
        const cle = champ.dataset.p as keyof Personne;
        const valeur = typeof personne?.[cle] === "string" ? personne[cle] : "";
        champ.value = valeur;
        inscription.personnes[rang][cle] = valeur;
      }
    });

    if (champPhrase) champPhrase.value = typeof sauve.phrase === "string" ? sauve.phrase : "";
    majPhrase();

    if (choixPolice && [...choixPolice.options].some((o) => o.value === sauve.policeId)) {
      choixPolice.value = sauve.policeId;
      inscription.policeId = sauve.policeId;
    }
    const finition = finitions.find((bouton) => bouton.dataset.gFinition === sauve.finitionId);
    if (finition) {
      inscription.finitionId = sauve.finitionId;
      for (const autre of finitions) {
        autre.setAttribute("aria-pressed", String(autre === finition));
      }
      if (aideFinition) {
        aideFinition.textContent = options.aidesParFinition.get(sauve.finitionId) ?? "";
      }
    }

    majFiches();
    appliqueMode(modeSauve === "libre" ? "libre" : "guide");
  }

  if (versLibre) {
    versLibre.hidden = false;
    versLibre.addEventListener("click", () => changeMode("libre"));
  }
  versGuide?.addEventListener("click", () => changeMode("guide"));

  majFiches();
  recompose();

  return {
    recompose,
    mode: () => mode,
    restaure,
    lit: () => ({
      ...inscription,
      personnes: [{ ...inscription.personnes[0] }, { ...inscription.personnes[1] }],
    }),
  };
}
