/**
 * LE PANNEAU DES MOTIFS : LES CONTROLES DE L'ETAPE 3 (sorti de `index.ts`).
 *
 * Les pastilles de famille, les cartes de motifs, la liste « Sur votre stele »
 * (miroir, taille, retrait) et le bloc « Un motif a vous » (description,
 * fichier). Il ne dessine rien : le rendu Konva des motifs (`motifs.ts`,
 * `creeMotifs`) lui est attache par `attache()` une fois Konva charge ; avant,
 * la liste et l'etat fonctionnent deja.
 *
 * Les fonctions de calcul (poser, borner, agrandir) restent dans `motifs.ts`.
 */
import type { Echelle } from "./echelle";
import type { EtatConfigurateur, Magasin, MotifPose, MotifSurDemande } from "./etat";
import {
  ajouteMotif,
  basculeMiroir,
  borneDemande,
  changeLargeur,
  CLE_DEMANDE,
  demandeCentree,
  ERREUR_FICHIER_LOURD,
  FICHIER_MAX_OCTETS,
  largeurMaxCm,
  MAX_MOTIFS,
  PAS_TAILLE_CM,
  retireMotif,
  type MotifCatalogue,
  type RenduMotifs,
} from "./motifs";

export interface OptionsPanneauMotifs {
  etat: Magasin;
  echelle: Echelle;
  catalogue: Map<string, MotifCatalogue>;
  /** Le bas du texte sur l'apercu (px image servie) : un motif se pose dessous. */
  basDuTexte: () => number | null;
}

export interface PanneauMotifs {
  /** Le rendu Konva des motifs, une fois cree. */
  attache(vues: RenduMotifs): void;
  /** La selection a change sur l'apercu : la liste marque sa ligne. */
  surSelection(cle: string | null): void;
  /** Le cadre « Motif a creer » a ete tire ou redimensionne sur l'apercu. */
  majDemande(changement: Partial<MotifSurDemande>): void;
}

export function branchePanneauMotifs(options: OptionsPanneauMotifs): PanneauMotifs {
  const { etat, echelle } = options;
  const catalogueMotifs = options.catalogue;


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
      const bas = options.basDuTexte();
      const basTexteCm = bas === null ? null : echelle.cmDepuisPoint({ x: 0, y: bas }).yCm;
      const apres = ajouteMotif(avant, motif, echelle, basTexteCm);
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

  return {
    attache(vues) {
      vuesMotifs = vues;
    },
    surSelection(cle) {
      selectionMotif = cle;
      majListeMotifs(etat.lire());
    },
    majDemande,
  };
}
