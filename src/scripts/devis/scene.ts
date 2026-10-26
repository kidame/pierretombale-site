/**
 * LA RECEPTION D'UNE STELE COMPOSEE SUR `/devis/` (passe E, 26.10.2026).
 *
 * Le configurateur (`/personnaliser/<slug>/`) depose une `SceneDevis` dans le
 * `sessionStorage` (`src/scripts/configurateur/export.ts`). Ici, on la relit
 * et on remplit le formulaire AVEC LES CHAMPS DU CONTRAT (`docs/devis-contrat.md`) :
 * modele, granit, police, ligne1..4, finition, motif, gravure_precisions. En
 * plus, deux champs propres au configurateur : `configurateur_scene` (le JSON)
 * et `configurateur_apercu` (l'image, en fichier). Un bloc en tete de l'etape
 * « Le monument » montre l'apercu et permet de modifier ou de retirer.
 *
 * ORDRE : le script inline de la page restaure d'abord son brouillon et pose
 * `?modele=` ; il emet ensuite `pt-devis-pret` sur le formulaire. On ne
 * remplit qu'a ce signal, sinon le brouillon ecraserait la scene.
 */
import { CLE_SCENE, VERSION_SCENE, type SceneDevis } from "@/scripts/configurateur/export";

/** Les motifs du configurateur -> le choix `motif` du formulaire. */
const MOTIF_VERS_DEVIS: Record<string, string> = {
  "croix-latine": "croix",
  colombe: "colombe",
  rose: "rose",
  coeur: "coeur",
  chene: "arbre",
  olivier: "arbre",
  sapin: "arbre",
};

const mm = (valeur: number) => `${String(valeur / 10).replace(".", ",")} cm`;
const cm = (valeur: number) => `${Math.round(valeur * 10) / 10} cm`.replace(".", ",");

export function litScene(): SceneDevis | null {
  try {
    const brut = window.sessionStorage.getItem(CLE_SCENE);
    if (!brut) return null;
    const scene = JSON.parse(brut) as Partial<SceneDevis>;
    if (scene.version !== VERSION_SCENE || !scene.modele || !Array.isArray(scene.zones))
      return null;
    return scene as SceneDevis;
  } catch {
    return null;
  }
}

export function effaceScene(): void {
  try {
    window.sessionStorage.removeItem(CLE_SCENE);
  } catch {
    /* Rien a effacer. */
  }
}

/** Le texte pour `gravure_precisions` : tout ce que les 4 lignes ne portent pas. */
export function precisionsDe(scene: SceneDevis): string {
  const lignes: string[] = [
    `Stele composee sur le site (${scene.modele.nom}, ${scene.matiere.nom}), ` +
      `${scene.mode === "guide" ? "mise en page automatique" : "mise en page libre"}. ` +
      "Positions en cm depuis le coin haut gauche de la surface gravable.",
  ];
  for (const zone of scene.zones) {
    if (!zone.texte.trim()) continue;
    const ou = scene.surfaces.length > 1 ? `, stele ${zone.surface + 1}` : "";
    const pos =
      zone.yCm === null
        ? "centre"
        : `x ${zone.xCm === null ? "centre" : cm(zone.xCm)}, y ${cm(zone.yCm)}`;
    lignes.push(
      `Texte ${zone.numero} (${mm(zone.hauteurMm)}, ${zone.policeId}, ${zone.finitionId}${ou}, ${pos}) : ` +
        zone.texte.replace(/\n/g, " / "),
    );
  }
  for (const motif of scene.motifs) {
    lignes.push(
      `Motif ${motif.nom} : ${cm(motif.largeurCm)} de large, x ${cm(motif.xCm)}, y ${cm(motif.yCm)}` +
        (motif.miroir ? ", en miroir" : ""),
    );
  }
  const demande = scene.motifSurDemande;
  if (demande) {
    lignes.push(
      `Motif a creer : ${cm(demande.largeurCm)} x ${cm(demande.hauteurCm)}, x ${cm(demande.xCm)}, ` +
        `y ${cm(demande.yCm)}` +
        (demande.description ? ` ; souhait : ${demande.description}` : "") +
        (demande.nomFichier ? ` ; fichier a joindre : ${demande.nomFichier}` : ""),
    );
  }
  return lignes.join("\n");
}

/** Le choix `motif` du formulaire qui decrit le mieux la scene. */
export function motifPourDevis(scene: SceneDevis): string {
  if (scene.motifSurDemande) return "dessin-fourni";
  if (scene.motifs.length === 0) return "aucun";
  const choix = new Set(scene.motifs.map((motif) => MOTIF_VERS_DEVIS[motif.id] ?? "autre"));
  return choix.size === 1 ? [...choix][0] : "autre";
}

/** Un data URL JPEG -> un `File`, pour le champ fichier `configurateur_apercu`. */
function fichierDepuis(dataUrl: string, nom: string): File | null {
  try {
    const [entete, base64] = dataUrl.split(",");
    const type = /data:([^;]+)/.exec(entete)?.[1] ?? "image/jpeg";
    const octets = atob(base64);
    const tableau = new Uint8Array(octets.length);
    for (let i = 0; i < octets.length; i += 1) tableau[i] = octets.charCodeAt(i);
    return new File([tableau], nom, { type });
  } catch {
    return null;
  }
}

function champ(
  form: HTMLFormElement,
  nom: string,
): RadioNodeList | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
  const element = form.elements.namedItem(nom);
  return element as
    | RadioNodeList
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | null;
}

function pose(form: HTMLFormElement, nom: string, valeur: string): void {
  const element = champ(form, nom);
  if (!element) return;
  /* Une liste de boutons radio accepte une valeur : elle coche celui qui la porte. */
  if ("value" in element) element.value = valeur;
}

export function remplitFormulaire(form: HTMLFormElement, scene: SceneDevis): void {
  pose(form, "typeDemande", "nouveau");
  pose(form, "modele", scene.modele.slug);
  pose(form, "granit", scene.matiere.id);

  const premiere = scene.zones.find((zone) => zone.texte.trim());
  if (premiere) {
    pose(form, "police", premiere.policeId);
    pose(form, "finition", premiere.finitionId);
  }

  /* Les 4 lignes du contrat recoivent les premieres lignes de la scene, chacune
     avec la taille de sa zone ; le reste est dans `gravure_precisions`. */
  const lignes = scene.zones
    .filter((zone) => zone.texte.trim())
    .flatMap((zone) =>
      zone.texte.split("\n").map((texte) => ({ texte: texte.trim(), hauteurMm: zone.hauteurMm })),
    )
    .filter((ligne) => ligne.texte);
  for (let numero = 1; numero <= 4; numero += 1) {
    const ligne = lignes[numero - 1];
    const texte = champ(form, `ligne${numero}_texte`);
    const max = texte && "maxLength" in texte && texte.maxLength > 0 ? texte.maxLength : 60;
    pose(form, `ligne${numero}_texte`, ligne ? ligne.texte.slice(0, max) : "");
    if (ligne) pose(form, `ligne${numero}_hauteur`, String(ligne.hauteurMm));
  }

  pose(form, "motif", motifPourDevis(scene));
  pose(form, "gravure_precisions", precisionsDe(scene));

  pose(form, "configurateur_scene", JSON.stringify({ ...scene, apercu: null }));
  const apercu = champ(form, "configurateur_apercu") as HTMLInputElement | null;
  if (apercu && scene.apercu && typeof DataTransfer !== "undefined") {
    const fichier = fichierDepuis(scene.apercu, `stele-${scene.modele.slug}.jpg`);
    if (fichier) {
      const transfert = new DataTransfer();
      transfert.items.add(fichier);
      apercu.files = transfert.files;
    }
  }
}

export function videFormulaire(form: HTMLFormElement): void {
  pose(form, "configurateur_scene", "");
  const apercu = champ(form, "configurateur_apercu") as HTMLInputElement | null;
  if (apercu) apercu.value = "";
}

/** Le bloc « Votre stele composee » en tete de l'etape monument. */
function montreBloc(form: HTMLFormElement, scene: SceneDevis): void {
  const bloc = form.querySelector<HTMLElement>("[data-scene]");
  if (!bloc) return;
  const image = bloc.querySelector<HTMLImageElement>("[data-scene-image]");
  const resume = bloc.querySelector<HTMLElement>("[data-scene-resume]");
  const modifier = bloc.querySelector<HTMLAnchorElement>("[data-scene-modifier]");
  const retirer = bloc.querySelector<HTMLButtonElement>("[data-scene-retirer]");

  if (image) {
    if (scene.apercu) {
      image.src = scene.apercu;
      image.alt = `Votre stèle ${scene.modele.nom} en ${scene.matiere.nom}, telle que composée`;
      image.hidden = false;
    } else {
      image.hidden = true;
    }
  }
  if (resume) {
    const textes = scene.zones.filter((zone) => zone.texte.trim()).length;
    const motifs = scene.motifs.length + (scene.motifSurDemande ? 1 : 0);
    resume.textContent =
      `${scene.modele.nom} en ${scene.matiere.nom}, ` +
      `${textes} ${textes > 1 ? "textes" : "texte"}, ` +
      `${motifs} ${motifs > 1 ? "motifs" : "motif"}. ` +
      "Les champs ci-dessous ont été remplis d'après votre composition : vous pouvez les corriger.";
  }
  if (modifier) modifier.href = `/personnaliser/${scene.modele.slug}/`;
  retirer?.addEventListener("click", () => {
    effaceScene();
    videFormulaire(form);
    bloc.hidden = true;
    form.dispatchEvent(new Event("change", { bubbles: true }));
  });
  bloc.hidden = false;
}

export function recoitScene(): void {
  const form = document.querySelector<HTMLFormElement>("[data-devis]");
  if (!form) return;

  const applique = () => {
    const scene = litScene();
    if (!scene) return;
    remplitFormulaire(form, scene);
    montreBloc(form, scene);
    /* Le script de la page recalcule son recapitulatif et son brouillon sur
       `change`. */
    form.dispatchEvent(new Event("change", { bubbles: true }));
  };

  if (form.dataset.pret === "true") applique();
  else form.addEventListener("pt-devis-pret", applique, { once: true });
}

recoitScene();
