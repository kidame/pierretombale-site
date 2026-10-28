/**
 * LA REPRISE DU BROUILLON SUR LA PAGE (sorti de `index.ts`, passe F).
 *
 * `brouillon.ts` sait lire et ecrire ; ce fichier fait le reste : remettre la
 * matiere, les champs, le mode, les zones et les motifs d'une visite
 * precedente, afficher le message de reprise et le bouton « Tout effacer et
 * recommencer », sauvegarder a chaque changement (avec un delai), et prevenir
 * avant de quitter si le navigateur refuse de garder le brouillon.
 */
import { ZONES_MAX } from "@/data/configurateur";
import {
  brouillonPossible,
  DELAI_SAUVEGARDE_MS,
  ecritBrouillon,
  effaceBrouillon,
  estVide,
  litBrouillon,
  quand,
  VERSION_BROUILLON,
  type Brouillon,
} from "./brouillon";
import type { Echelle } from "./echelle";
import type { Magasin } from "./etat";
import type { FormulaireInscription } from "./formulaire";
import { borneDemande, bornePose, MAX_MOTIFS, nouvelleCle, type MotifCatalogue } from "./motifs";
import { premiereZone, type DefautsZone } from "./zones";

export interface OptionsBrouillon {
  modeleId: string;
  etat: Magasin;
  echelle: Echelle;
  formulaire: FormulaireInscription;
  catalogue: Map<string, MotifCatalogue>;
  defautsZone: DefautsZone;
}

export interface BrouillonPage {
  /** Demande une sauvegarde (apres `DELAI_SAUVEGARDE_MS`). */
  planifie(): void;
}

export function brancheBrouillon(options: OptionsBrouillon): BrouillonPage {
  const { modeleId, etat, echelle, formulaire, defautsZone } = options;
  const catalogueMotifs = options.catalogue;


  /* Ce que la famille avait commence sur cet appareil est remis AVANT que le
     canvas existe : le premier dessin montre deja sa stele. Voir
     `brouillon.ts` pour ce qui est garde et pourquoi. */
  const blocBrouillon = document.querySelector<HTMLElement>("[data-brouillon]");
  const texteBrouillon = document.querySelector<HTMLElement>("[data-brouillon-texte]");
  const boutonEffacer = document.querySelector<HTMLButtonElement>("[data-brouillon-effacer]");

  const repris = litBrouillon(modeleId);
  const reprend = repris !== null && !estVide(repris);
  if (repris && reprend) {
    document
      .querySelector<HTMLButtonElement>(`[data-matiere="${CSS.escape(repris.matiere)}"]`)
      ?.click();
    formulaire.restaure(repris.inscription, repris.mode);
    /* En mise en page libre, les zones sont celles que la famille a reglees ;
       chaque champ manquant reprend sa valeur par defaut. */
    if (repris.mode === "libre" && repris.zones.length > 0) {
      const zones = repris.zones
        .slice(0, ZONES_MAX)
        .map((zone, rang) => ({ ...premiereZone(defautsZone), ...zone, cle: `b-${rang}` }));
      etat.maj({ zones, zoneActive: zones[0].cle });
    }
    /* Un motif retire de la bibliotheque depuis est ignore ; les autres sont
       remis dans les bornes (une calibration a pu changer). */
    const motifs = repris.motifs
      .flatMap((pose) => {
        const motif = catalogueMotifs.get(pose.id);
        return motif ? [bornePose({ ...pose, cle: nouvelleCle(pose.id) }, motif, echelle)] : [];
      })
      .slice(0, MAX_MOTIFS);
    const demande = repris.demande
      ? borneDemande({ ...repris.demande, fichier: null }, echelle)
      : null;
    etat.maj({ motifs, motifSurDemande: demande });
  }

  if (blocBrouillon && texteBrouillon && brouillonPossible()) {
    texteBrouillon.textContent =
      repris && reprend
        ? `Vous aviez commencé ce monument sur cet appareil ${quand(repris)} : ` +
          "tout a été repris là où vous l'aviez laissé."
        : "Ce que vous saisissez est gardé sur cet appareil, pour que vous puissiez revenir " +
          "plus tard. Rien n'est envoyé tant que vous ne demandez pas de devis.";
    /* Le bandeau de la page dit deja que tout est garde sur l'appareil : le
       bloc n'apparait que s'il y a un brouillon (repris, ou en cours). */
    blocBrouillon.hidden = !(repris && reprend);
  }

  function brouillonCourant(): Brouillon {
    const valeur = etat.lire();
    const demande = valeur.motifSurDemande;
    return {
      version: VERSION_BROUILLON,
      modeleId,
      enregistreLe: new Date().toISOString(),
      matiere: valeur.matiere,
      mode: formulaire.mode(),
      inscription: formulaire.lit(),
      zones: valeur.zones,
      motifs: valeur.motifs,
      demande: demande
        ? {
            description: demande.description,
            xCm: demande.xCm,
            yCm: demande.yCm,
            largeurCm: demande.largeurCm,
            hauteurCm: demande.hauteurCm,
          }
        : null,
    };
  }

  /* `false` apres un refus du navigateur : on previendra avant de quitter. */
  let sauvegardeOk = true;
  /* `true` apres « Tout effacer » : plus rien ne s'ecrit avant le rechargement. */
  let sauvegardeCoupee = false;
  let minuterie = 0;

  function sauve(): void {
    window.clearTimeout(minuterie);
    if (sauvegardeCoupee) return;
    const brouillon = brouillonCourant();
    const vide = estVide(brouillon);
    if (vide) {
      effaceBrouillon(modeleId);
      sauvegardeOk = true;
    } else {
      sauvegardeOk = ecritBrouillon(brouillon);
    }
    if (boutonEffacer) boutonEffacer.hidden = vide;
    if (blocBrouillon) blocBrouillon.hidden = vide;
  }

  const planifie = () => {
    window.clearTimeout(minuterie);
    minuterie = window.setTimeout(sauve, DELAI_SAUVEGARDE_MS);
  };
  etat.abonner(() => planifie());
  if (boutonEffacer) boutonEffacer.hidden = !reprend;

  boutonEffacer?.addEventListener("click", () => {
    sauvegardeCoupee = true;
    effaceBrouillon(modeleId);
    /* Une nouvelle navigation, pas un rechargement : certains navigateurs
       remettraient sinon les valeurs des champs. */
    window.location.replace(window.location.pathname);
  });

  /* Quitter la page : on ecrit tout de suite ce qui attendait. Si le
     navigateur refuse de garder le brouillon, on previent avant de partir. */
  window.addEventListener("pagehide", sauve);
  window.addEventListener("beforeunload", (evenement) => {
    sauve();
    if (!sauvegardeOk && !estVide(brouillonCourant())) {
      evenement.preventDefault();
      /* Obsolete mais encore lu par les Safari anterieurs a 17 : garde expres. */
      evenement.returnValue = "";
    }
  });

  return { planifie };
}
