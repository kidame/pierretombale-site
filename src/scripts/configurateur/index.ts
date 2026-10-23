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
import { ZONES_MAX } from "@/data/configurateur";
import { creeEchelle } from "./echelle";
import {
  creeEtat,
  type EtatConfigurateur,
  type MotifPose,
  type MotifSurDemande,
  type ZoneTexte,
} from "./etat";
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
import {
  ajouteZone,
  borneLignes,
  lignesPleines,
  majZone,
  MESSAGE_LIGNES_MAX,
  messageDepassement,
  peutAjouterZone,
  premiereZone,
  retireZone,
  type DefautsZone,
} from "./zones";

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
  const famillesParPolice = new Map(donnees.polices.map((p) => [p.id, p.famille]));
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

  /** La zone que les controles de la page modifient. */
  function changeZoneActive(changement: Partial<ZoneTexte>): void {
    const valeur = etat.lire();
    etat.maj({ zones: majZone(valeur.zones, valeur.zoneActive, changement) });
  }

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

  /* --------------------------------------- Les zones de texte (passe C2) */

  const blocZones = document.querySelector<HTMLElement>("[data-zones]");
  const panneauZone = document.querySelector<HTMLElement>("[data-zone-panneau]");
  const ongletsZone = [...document.querySelectorAll<HTMLButtonElement>("[data-zone-onglet]")];
  const boutonAjouterZone = document.querySelector<HTMLButtonElement>("[data-zone-ajouter]");
  const boutonSupprimerZone = document.querySelector<HTMLButtonElement>("[data-zone-supprimer]");
  const messageLignes = document.querySelector<HTMLElement>("[data-zone-lignes]");
  const messageDepasse = document.querySelector<HTMLElement>("[data-zone-depasse]");

  /** Le rang (0, 1, 2) de la zone active dans la liste. */
  function rangActif(valeur: EtatConfigurateur): number {
    const rang = valeur.zones.findIndex((zone) => zone.cle === valeur.zoneActive);
    return rang < 0 ? 0 : rang;
  }

  /** Rend la zone du rang `rang` active, si elle existe. */
  function choisitZone(rang: number): void {
    const zone = etat.lire().zones[rang];
    if (zone) etat.maj({ zoneActive: zone.cle });
  }

  /* Les onglets de zones et les deux boutons n ont de sens qu avec ce script :
     ils restent caches dans le HTML et c est lui qui les montre. Le bloc de
     controles devient alors le panneau de l onglet actif. */
  if (blocZones) blocZones.hidden = false;
  if (panneauZone && ongletsZone.length > 0) panneauZone.setAttribute("role", "tabpanel");

  ongletsZone.forEach((onglet, rang) => {
    onglet.addEventListener("click", () => choisitZone(rang));

    /* Clavier : les fleches passent d un onglet a l autre, Origine et Fin aux
       extremites (modele ARIA des onglets). Seul l onglet actif est dans le
       parcours de tabulation, voir `majInterfaceZones`. */
    onglet.addEventListener("keydown", (evenement) => {
      const nombre = etat.lire().zones.length;
      let cible: number | null = null;

      if (evenement.key === "ArrowRight") cible = (rang + 1) % nombre;
      else if (evenement.key === "ArrowLeft") cible = (rang - 1 + nombre) % nombre;
      else if (evenement.key === "Home") cible = 0;
      else if (evenement.key === "End") cible = nombre - 1;
      if (cible === null) return;

      evenement.preventDefault();
      choisitZone(cible);
      ongletsZone[cible]?.focus();
    });
  });

  boutonAjouterZone?.addEventListener("click", () => {
    const valeur = etat.lire();
    const zones = ajouteZone(valeur.zones, defautsZone, echelle);
    /* Trois zones sur trois : `ajouteZone` rend la meme liste, le libelle du
       bouton le dit deja. */
    if (zones.length === valeur.zones.length) return;

    etat.maj({ zones, zoneActive: zones[zones.length - 1].cle });
    champTexte?.focus();
  });

  boutonSupprimerZone?.addEventListener("click", () => {
    const valeur = etat.lire();
    const zones = retireZone(valeur.zones, valeur.zoneActive);
    if (zones.length === valeur.zones.length) return;

    /* La zone qui prend la place de celle qu on retire : celle du meme rang,
       ou la derniere si on vient de retirer la derniere. */
    const rang = Math.min(rangActif(valeur), zones.length - 1);
    etat.maj({ zones, zoneActive: zones[rang].cle });
    ongletsZone[rang]?.focus();
  });

  if (champTexte) {
    /** Le texte du champ, borne a `ZONE_LIGNES_MAX` lignes. */
    const borneChamp = (): boolean => {
      const borne = borneLignes(champTexte.value);
      if (borne === champTexte.value) return false;

      /* Le curseur est remis ou il etait : sans cela, coller un texte trop
         long renverrait la famille a la fin du champ. */
      const curseur = Math.min(champTexte.selectionStart ?? borne.length, borne.length);
      champTexte.value = borne;
      champTexte.setSelectionRange(curseur, curseur);
      return true;
    };

    const majTexte = () => {
      const coupe = borneChamp();
      if (messageLignes) messageLignes.textContent = coupe ? MESSAGE_LIGNES_MAX : "";
      if (compteur) compteur.textContent = String(champTexte.value.length);
      changeZoneActive({ texte: champTexte.value });
    };

    champTexte.addEventListener("input", majTexte);

    /* Entree sur la derniere ligne autorisee : on refuse la touche plutot que
       de laisser la famille ecrire une ligne qui serait coupee ensuite. */
    champTexte.addEventListener("keydown", (evenement) => {
      if (evenement.key !== "Enter" || !lignesPleines(champTexte.value)) return;
      evenement.preventDefault();
      if (messageLignes) messageLignes.textContent = MESSAGE_LIGNES_MAX;
    });

    /* Un navigateur peut restaurer la valeur d'un champ au retour en arriere. */
    majTexte();
  }

  /**
   * LES CONTROLES SUIVENT LA ZONE ACTIVE. Un seul endroit remet tout a jour :
   * les onglets, les deux boutons, puis le texte, la police, la hauteur et la
   * finition de la zone active.
   */
  function majInterfaceZones(valeur: EtatConfigurateur): void {
    const rang = rangActif(valeur);
    const zone = valeur.zones[rang];
    if (!zone) return;

    ongletsZone.forEach((onglet, index) => {
      const existe = index < valeur.zones.length;
      const choisi = existe && index === rang;

      onglet.hidden = !existe;
      onglet.setAttribute("aria-selected", String(choisi));
      /* Un seul onglet dans le parcours de tabulation : les fleches font le
         reste (modele ARIA des onglets). */
      onglet.tabIndex = choisi ? 0 : -1;
    });

    const identifiant = ongletsZone[rang]?.id;
    if (panneauZone && identifiant) panneauZone.setAttribute("aria-labelledby", identifiant);

    if (boutonAjouterZone) {
      const plein = !peutAjouterZone(valeur.zones);
      boutonAjouterZone.disabled = plein;
      boutonAjouterZone.textContent = plein
        ? `${ZONES_MAX} zones sur ${ZONES_MAX}`
        : "+ Ajouter une zone";
    }

    /* Une seule zone : rien a supprimer, le bouton n a pas lieu d etre. */
    if (boutonSupprimerZone) boutonSupprimerZone.hidden = valeur.zones.length <= 1;

    /* Jamais pendant la frappe : reecrire la valeur deplacerait le curseur. */
    if (champTexte && champTexte.value !== zone.texte) {
      champTexte.value = zone.texte;
      if (messageLignes) messageLignes.textContent = "";
    }
    if (compteur) compteur.textContent = String(zone.texte.length);

    if (choixPolice) choixPolice.value = zone.policeId;
    if (choixHauteur) choixHauteur.value = String(zone.hauteurMm);

    for (const bouton of boutonsFinition) {
      bouton.setAttribute("aria-pressed", String(bouton.dataset.finition === zone.finitionId));
    }
    if (aideFinition) aideFinition.textContent = aidesParFinition.get(zone.finitionId) ?? "";
  }

  etat.abonner(majInterfaceZones);
  majInterfaceZones(etat.lire());

  choixPolice?.addEventListener("change", () => {
    changeZoneActive({ policeId: choixPolice.value });
  });

  choixHauteur?.addEventListener("change", () => {
    const hauteurMm = Number(choixHauteur.value);
    if (Number.isFinite(hauteurMm) && hauteurMm > 0) changeZoneActive({ hauteurMm });
  });

  /* La finition appartient a la zone active : le bouton allume et la phrase
     d aide sont poses par `majInterfaceZones`, pas ici. */
  for (const bouton of boutonsFinition) {
    bouton.addEventListener("click", () => {
      const finitionId = bouton.dataset.finition;
      if (finitionId) changeZoneActive({ finitionId });
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
    surDepassement: (cles) => {
      if (!messageDepasse) return;
      const zones = etat.lire().zones;
      const numeros = cles.map((cle) => zones.findIndex((zone) => zone.cle === cle) + 1);
      const texte = numeros.length === 0 ? "" : messageDepassement(numeros, zones.length);
      if (messageDepasse.textContent !== texte) messageDepasse.textContent = texte;
    },
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
    vuesMotifs?.dessine(valeur, couleurMotifs(valeur));
    enCours = enCours.then(() => vues.dessine(valeur)).catch(() => undefined);
  };
  etat.abonner(dessine);

  await vues.dessine(etat.lire());
  vuesMotifs.dessine(etat.lire(), couleurMotifs(etat.lire()));

  /* Le canvas affiche quelque chose : l'apercu statique peut disparaitre. */
  if (statique) statique.hidden = true;

  if (boutonRecentrer) {
    boutonRecentrer.hidden = false;
    /* Recentrer ne touche QUE l'horizontale : la hauteur du bloc sur la stele
       est un choix de la famille, pas un accident a corriger. */
    boutonRecentrer.addEventListener("click", () => changeZoneActive({ xCm: null }));
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
