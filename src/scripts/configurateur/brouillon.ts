/**
 * LE BROUILLON (passe F) : CE QUE LA FAMILLE A COMMENCE, GARDE SUR SON APPAREIL.
 *
 * Une famille en deuil revient souvent plusieurs fois, parfois apres avoir
 * demande l'avis d'un proche. Tout ce qu'elle saisit est garde dans le
 * `localStorage` du navigateur, un brouillon par modele, et repris a la visite
 * suivante. Rien ne quitte l'appareil : il n'y a ni compte ni serveur.
 *
 * CE QUI EST GARDE : la matiere, les champs de l'inscription guidee et le mode,
 * les zones de texte (utiles en mise en page libre), les motifs poses, et la
 * description du motif sur demande. PAS le fichier joint : un `File` ne se
 * garde pas, la famille le rechoisit.
 *
 * CE QUI PEUT CASSER UN BROUILLON, et qui est prevu : une version de format
 * differente (`VERSION_BROUILLON`), un brouillon trop vieux (`DUREE_JOURS`), un
 * motif retire de la bibliotheque, un stockage refuse (navigation privee).
 * Dans tous ces cas, la page repart de zero sans erreur.
 *
 * POUR FAIRE EVOLUER LE FORMAT : ajouter un champ est sans risque si sa lecture
 * a un defaut ; changer le sens d'un champ demande d'incrementer
 * `VERSION_BROUILLON` (les anciens brouillons sont alors ignores).
 */
import type { Inscription } from "./composition";
import type { MotifPose, ZoneTexte } from "./etat";
import type { ModeInscription } from "./formulaire";

/** A incrementer quand le format change de sens (voir l'en-tete). */
export const VERSION_BROUILLON = 1;

/** Au-dela, un brouillon est oublie : il concerne sans doute un autre projet. */
export const DUREE_JOURS = 90;

/* Meme famille de cles que le brouillon de /devis/ (`pt-devis-brouillon`). */
const PREFIXE_CLE = "pt-configurateur-";

/** Attente apres la derniere modification avant d'ecrire (ms). */
export const DELAI_SAUVEGARDE_MS = 500;

export interface Brouillon {
  version: number;
  modeleId: string;
  /** Date ISO de la derniere sauvegarde. */
  enregistreLe: string;
  matiere: string;
  mode: ModeInscription;
  inscription: Inscription;
  zones: ZoneTexte[];
  motifs: MotifPose[];
  demande: {
    description: string;
    xCm: number;
    yCm: number;
    largeurCm: number;
    hauteurCm: number;
  } | null;
}

const cle = (modeleId: string) => `${PREFIXE_CLE}${modeleId}`;

/** Le stockage, ou `null` s'il est refuse (navigation privee, reglages). */
function stockage(): Storage | null {
  try {
    const essai = `${PREFIXE_CLE}essai`;
    window.localStorage.setItem(essai, "1");
    window.localStorage.removeItem(essai);
    return window.localStorage;
  } catch {
    return null;
  }
}

/** `true` : le navigateur garde les brouillons. */
export function brouillonPossible(): boolean {
  return stockage() !== null;
}

/** Le brouillon de ce modele, ou `null` (absent, illisible, perime). */
export function litBrouillon(modeleId: string): Brouillon | null {
  try {
    const brut = stockage()?.getItem(cle(modeleId));
    if (!brut) return null;
    const lu = JSON.parse(brut) as Partial<Brouillon>;
    if (lu.version !== VERSION_BROUILLON || lu.modeleId !== modeleId) return null;
    const age = Date.now() - Date.parse(lu.enregistreLe ?? "");
    if (!Number.isFinite(age) || age > DUREE_JOURS * 24 * 3600 * 1000) {
      effaceBrouillon(modeleId);
      return null;
    }
    if (!lu.inscription || !Array.isArray(lu.zones) || !Array.isArray(lu.motifs)) return null;
    return lu as Brouillon;
  } catch {
    return null;
  }
}

/** Ecrit le brouillon. `false` : le navigateur l'a refuse. */
export function ecritBrouillon(brouillon: Brouillon): boolean {
  try {
    const lieu = stockage();
    if (!lieu) return false;
    lieu.setItem(cle(brouillon.modeleId), JSON.stringify(brouillon));
    return true;
  } catch {
    return false;
  }
}

export function effaceBrouillon(modeleId: string): void {
  try {
    stockage()?.removeItem(cle(modeleId));
  } catch {
    /* Rien a effacer, ou stockage refuse : rien a faire. */
  }
}

/** `true` : la famille n'a encore rien saisi qui merite d'etre garde. */
export function estVide(brouillon: Brouillon): boolean {
  const { inscription } = brouillon;
  const champs = [
    inscription.phrase,
    ...inscription.personnes.flatMap((p) => [p.prenom, p.nom, p.nomJeuneFille, p.naissance, p.deces]),
  ];
  return (
    champs.every((champ) => !champ?.trim()) &&
    brouillon.zones.every((zone) => !zone.texte.trim()) &&
    brouillon.motifs.length === 0 &&
    brouillon.demande === null
  );
}

/** « le 23 octobre a 13 h 40 », pour le message de reprise. */
export function quand(brouillon: Brouillon): string {
  const date = new Date(brouillon.enregistreLe);
  if (Number.isNaN(date.getTime())) return "";
  const jour = date.toLocaleDateString("fr-CH", { day: "numeric", month: "long" });
  const heure = date.toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" });
  return `le ${jour} à ${heure.replace(":", " h ")}`;
}
