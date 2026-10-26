/**
 * LE PANNEAU DES ZONES DE LA MISE EN PAGE LIBRE (passe C2, sorti de `index.ts`).
 *
 * Les onglets « Zone 1, 2, 3... », les boutons ajouter / supprimer, le champ de
 * texte (4 lignes au plus par zone), la police, la taille et la finition de la
 * zone active, et « Recentrer le texte ». Tout suit `etat.zoneActive` : un
 * seul endroit (`majInterfaceZones`) remet les controles d'accord avec l'etat.
 * En mode guide (`formulaire.ts`), ce bloc est cache ; il ne change rien.
 */
import { ZONES_MAX } from "@/data/configurateur";
import type { Echelle } from "./echelle";
import type { EtatConfigurateur, Magasin, ZoneTexte } from "./etat";
import {
  ajouteZone,
  borneLignes,
  lignesPleines,
  majZone,
  MESSAGE_LIGNES_MAX,
  messageDepassement,
  peutAjouterZone,
  retireZone,
  type DefautsZone,
} from "./zones";

export interface OptionsPanneauZones {
  etat: Magasin;
  echelle: Echelle;
  defautsZone: DefautsZone;
  aidesParFinition: Map<string, string>;
}

export interface PanneauZones {
  /** Le canvas existe : « Recentrer » a un sens, le bouton apparait. */
  canvasPret(): void;
  /** Le rendu signale les zones dont le texte deborde de sa surface. */
  surDepassement(cles: string[]): void;
}

export function branchePanneauZones(options: OptionsPanneauZones): PanneauZones {
  const { etat, echelle, defautsZone, aidesParFinition } = options;

  const champTexte = document.querySelector<HTMLTextAreaElement>("[data-texte]");
  const compteur = document.querySelector<HTMLElement>("[data-compteur]");
  const choixPolice = document.querySelector<HTMLSelectElement>("[data-police]");
  const choixHauteur = document.querySelector<HTMLSelectElement>("[data-hauteur]");
  const aideFinition = document.querySelector<HTMLElement>("[data-finition-aide]");
  const boutonRecentrer = document.querySelector<HTMLButtonElement>("[data-recentrer]");
  const boutonsFinition = [...document.querySelectorAll<HTMLButtonElement>("[data-finition]")];

  /** La zone que les controles de la page modifient. */
  function changeZoneActive(changement: Partial<ZoneTexte>): void {
    const valeur = etat.lire();
    etat.maj({ zones: majZone(valeur.zones, valeur.zoneActive, changement) });
  }

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

  return {
    canvasPret() {
      if (!boutonRecentrer) return;
      boutonRecentrer.hidden = false;
      /* Recentrer ne touche QUE l'horizontale : la hauteur du bloc sur la stele
         est un choix de la famille, pas un accident a corriger. */
      boutonRecentrer.addEventListener("click", () => changeZoneActive({ xCm: null }));
    },
    surDepassement(cles) {
      if (!messageDepasse) return;
      const zones = etat.lire().zones;
      const numeros = cles.map((cle) => zones.findIndex((zone) => zone.cle === cle) + 1);
      const texte = numeros.length === 0 ? "" : messageDepassement(numeros, zones.length);
      if (messageDepasse.textContent !== texte) messageDepasse.textContent = texte;
    },
  };
}
