/**
 * LES ZONES DE TEXTE : DES FONCTIONS PURES, ET RIEN D'AUTRE.
 *
 * Meme partage des roles que `motifs.ts` : ici on fabrique et on corrige des
 * zones (en ajouter une, en retirer une, borner le nombre de lignes, deviner la
 * place d'une nouvelle zone), toujours en rendant une NOUVELLE liste. C'est
 * `index.ts` qui branche ces fonctions sur l'etat, et `rendu.ts` qui dessine.
 *
 * LES BORNES NE SONT PAS ICI : trois zones, 120 caracteres et 4 lignes par
 * zone vivent dans `src/data/configurateur.ts`. Un chiffre a corriger apres
 * avis du graveur se corrige la, dans les donnees, jamais dans le code du
 * canvas.
 *
 * CE QU'IL NE FAIT PAS : il ne touche ni au DOM, ni a Konva, et ne garde aucun
 * etat (sauf le compteur de cles, qui ne sert qu'a rendre des noms uniques).
 */
import { ZONE_LIGNES_MAX, ZONES_MAX } from "@/data/configurateur";
import type { Echelle } from "./echelle";
import { ALIGNEMENT_ZONE, type ZoneTexte } from "./etat";

/**
 * Interligne de la gravure. Un seul endroit : `rendu.ts` le donne a Konva, et
 * l'estimation de hauteur ci-dessous s'en sert pour placer une zone sous une
 * autre.
 */
export const INTERLIGNE = 1.25;

/** Ce qu'une nouvelle zone laisse de blanc sous la precedente, en cm. */
const ESPACE_ENTRE_ZONES_CM = 1.5;

/** Le message affiche quand la famille depasse `ZONE_LIGNES_MAX` lignes. */
export const MESSAGE_LIGNES_MAX = `${ZONE_LIGNES_MAX} lignes au plus par zone.`;

/** Le message affiche quand un texte deborde de la surface gravable. */
export function messageDepassement(numeros: number[], totalZones: number): string {
  const sujet =
    totalZones <= 1
      ? "Le texte dépasse"
      : numeros.length === 1
        ? `Le texte de la zone ${numeros[0]} dépasse`
        : `Les textes des zones ${numeros.join(" et ")} dépassent`;
  return `${sujet} la surface gravable de la stèle. Réduisez la hauteur des lettres ou passez à la ligne.`;
}

/** Ce qu'une nouvelle zone reprend quand aucune zone ne la precede. */
export interface DefautsZone {
  policeId: string;
  finitionId: string;
  /**
   * Une hauteur de lettres suggeree par rang de zone, en millimetres : le nom
   * en grand, les dates plus petites, l'epitaphe plus discrete encore (memes
   * valeurs que `/devis/`, voir `hauteursParDefaut`). La page construit cette
   * liste ; au-dela, la derniere valeur sert encore.
   */
  hauteursMm: number[];
}

/* Les cles de zone sont uniques dans la page : une zone garde son identite
   quand la liste change, et le rendu sait quel noeud Konva lui appartient. */
let derniereCle = 0;

export function nouvelleCleZone(): string {
  derniereCle += 1;
  return `zone-${derniereCle}`;
}

/** Les lignes d'une zone, retours a la ligne compris (jamais moins d'une). */
export function lignesDeZone(texte: string): string[] {
  return texte.split("\n");
}

/**
 * Le texte ramene a `ZONE_LIGNES_MAX` lignes. On coupe les lignes en trop
 * plutot que de refuser toute la saisie : un texte colle depuis un faire-part
 * garde ainsi ses premieres lignes, et la page dit ce qui a ete coupe.
 */
export function borneLignes(texte: string): string {
  const lignes = lignesDeZone(texte);
  if (lignes.length <= ZONE_LIGNES_MAX) return texte;
  return lignes.slice(0, ZONE_LIGNES_MAX).join("\n");
}

/** `true` : une ligne de plus ne tiendrait pas dans cette zone. */
export function lignesPleines(texte: string): boolean {
  return lignesDeZone(texte).length >= ZONE_LIGNES_MAX;
}

/**
 * HAUTEUR APPROCHEE du bloc de texte, en cm de pierre. C'est une estimation,
 * pas une mesure : seul Konva connait la hauteur reelle des lettres d'une
 * police. Elle ne sert qu'a placer une nouvelle zone sous la precedente, ou le
 * centimetre pres suffit (la famille deplace ensuite le bloc au doigt).
 */
export function hauteurBlocCm(zone: ZoneTexte): number {
  const lignes = Math.max(1, lignesDeZone(zone.texte).length);
  return lignes * (zone.hauteurMm / 10) * INTERLIGNE;
}

function zoneGravableHauteurCm(echelle: Echelle): number {
  return echelle.pxVersCm(echelle.zone.hauteur);
}

/**
 * Le haut d'une zone en cm, meme quand elle est centree (`yCm` a `null`) :
 * placer une zone sous une autre demande de savoir ou l'autre se trouve
 * vraiment.
 */
export function hautDeZoneCm(zone: ZoneTexte, echelle: Echelle): number {
  if (zone.yCm !== null) return zone.yCm;
  return Math.max(0, (zoneGravableHauteurCm(echelle) - hauteurBlocCm(zone)) / 2);
}

/** La zone `cle`, ou la premiere a defaut : il y a toujours une zone. */
export function trouveZone(zones: ZoneTexte[], cle: string): ZoneTexte | undefined {
  return zones.find((zone) => zone.cle === cle) ?? zones[0];
}

/** `true` : la stele peut recevoir une zone de plus. */
export function peutAjouterZone(zones: ZoneTexte[]): boolean {
  return zones.length < ZONES_MAX;
}

function hauteurSuggeree(defauts: DefautsZone, rang: number): number {
  const hauteurs = defauts.hauteursMm;
  return hauteurs[Math.min(rang, hauteurs.length - 1)] ?? hauteurs[0];
}

/** La zone 1, celle que la page montre des le chargement. */
export function premiereZone(defauts: DefautsZone): ZoneTexte {
  return {
    cle: nouvelleCleZone(),
    texte: "",
    policeId: defauts.policeId,
    hauteurMm: hauteurSuggeree(defauts, 0),
    finitionId: defauts.finitionId,
    alignement: ALIGNEMENT_ZONE,
    xCm: null,
    yCm: null,
  };
}

/**
 * La place d'une nouvelle zone : SOUS LA PRECEDENTE, pour que les blocs se
 * lisent de haut en bas comme sur une stele. S'il n'y a plus la hauteur
 * necessaire, la zone part du centre (`null`) et la famille la deplace : mieux
 * vaut un bloc visible a replacer qu'un bloc colle au bas de la pierre.
 */
function ySousPrecedente(
  precedente: ZoneTexte,
  nouvelle: ZoneTexte,
  echelle: Echelle,
): number | null {
  const y = hautDeZoneCm(precedente, echelle) + hauteurBlocCm(precedente) + ESPACE_ENTRE_ZONES_CM;
  if (y + hauteurBlocCm(nouvelle) > zoneGravableHauteurCm(echelle)) return null;
  return y;
}

/**
 * La liste avec une zone de plus, ou LA MEME LISTE quand les trois zones sont
 * prises (`index.ts` compare les longueurs et laisse le bouton le dire).
 */
export function ajouteZone(
  zones: ZoneTexte[],
  defauts: DefautsZone,
  echelle: Echelle,
): ZoneTexte[] {
  if (!peutAjouterZone(zones)) return zones;

  /* Un monument a plusieurs steles (Tango) : chaque nouvelle zone va d'abord
     sur une stele encore vide, centree ; ensuite sous la derniere zone de la
     premiere stele. */
  const surface = zones.length < echelle.surfaces.length ? zones.length : 0;
  const memeSurface = zones.filter((zone) => (zone.surface ?? 0) === surface);
  const precedente = memeSurface[memeSurface.length - 1];
  const modele = zones[zones.length - 1];
  const nouvelle: ZoneTexte = {
    cle: nouvelleCleZone(),
    texte: "",
    /* La nouvelle zone reprend l'ecriture et la finition de la precedente :
       une inscription garde son unite, et la famille change ce qu'elle veut. */
    policeId: modele?.policeId ?? defauts.policeId,
    hauteurMm: hauteurSuggeree(defauts, zones.length),
    finitionId: modele?.finitionId ?? defauts.finitionId,
    alignement: ALIGNEMENT_ZONE,
    xCm: null,
    yCm: null,
    surface,
  };

  return [
    ...zones,
    precedente ? { ...nouvelle, yCm: ySousPrecedente(precedente, nouvelle, echelle) } : nouvelle,
  ];
}

/** La liste sans la zone `cle`. La derniere zone ne se retire pas. */
export function retireZone(zones: ZoneTexte[], cle: string): ZoneTexte[] {
  if (zones.length <= 1) return zones;
  return zones.filter((zone) => zone.cle !== cle);
}

/** La liste avec la zone `cle` modifiee. */
export function majZone(
  zones: ZoneTexte[],
  cle: string,
  changement: Partial<ZoneTexte>,
): ZoneTexte[] {
  return zones.map((zone) => (zone.cle === cle ? { ...zone, ...changement } : zone));
}
