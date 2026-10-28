/**
 * LE PARCOURS EN QUATRE ETAPES (design des maquettes du 28.10.2026).
 *
 * La page construit les quatre etapes les unes sous les autres, toutes
 * visibles : sans JavaScript, la famille lit tout et les liens « Continuer »
 * sont des ancres. Ce module, lui, n'en montre qu'une a la fois : la barre
 * 01-04, les boutons Retour / Continuer, le recapitulatif de l'etape 4, et
 * sur telephone l'apercu repliable et le mode plein ecran pour placer un motif.
 *
 * CE QU'IL NE FAIT PAS : il ne touche ni a l'etat, ni au canvas, ni aux
 * controles des etapes (formulaire.ts, panneau-zones.ts, panneau-motifs.ts).
 * Il LIT l'etat pour ecrire le recapitulatif, c'est tout.
 */
import type { Magasin } from "./etat";

export interface OptionsEtapes {
  etat: Magasin;
  /** Identifiant du modele : l'etape en cours est gardee par modele. */
  modeleId: string;
  nomMatiere: (id: string) => string;
  vignetteMatiere: (id: string) => string;
  nomPolice: (id: string) => string;
  nomFinition: (id: string) => string;
  nomMotif: (id: string) => string;
  fichierMotif: (id: string) => string;
}

export interface Etapes {
  /** Montre une etape (1 a 4). */
  va(numero: number): void;
  courante(): number;
}

const TOTAL = 4;
const CLE_SESSION = "pt-cfg-etape";
const MOBILE = "(max-width: 63.999rem)";

export function brancheEtapes(options: OptionsEtapes): Etapes {
  const sections = [...document.querySelectorAll<HTMLElement>("[data-etape]")];
  const liens = [...document.querySelectorAll<HTMLElement>("[data-etape-vers]")];
  const barre = [...document.querySelectorAll<HTMLElement>("[data-etape-barre]")];
  if (sections.length !== TOTAL) return { va: () => {}, courante: () => 1 };

  const cle = `${CLE_SESSION}-${options.modeleId}`;
  let courante = 1;

  function numeroDe(element: HTMLElement | null): number | null {
    const brut = Number(element?.dataset.etape ?? element?.dataset.etapeVers ?? element?.dataset.etapeBarre);
    return Number.isInteger(brut) && brut >= 1 && brut <= TOTAL ? brut : null;
  }

  function va(numero: number, options2: { focus?: boolean; defile?: boolean } = {}): void {
    const { focus = true, defile = true } = options2;
    courante = numero;
    for (const section of sections) {
      const n = numeroDe(section);
      section.hidden = n !== numero;
    }
    for (const item of barre) {
      const n = numeroDe(item) ?? 0;
      item.classList.toggle("est-courante", n === numero);
      item.classList.toggle("est-faite", n < numero);
      if (n === numero) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    }
    try {
      window.sessionStorage.setItem(cle, String(numero));
    } catch {
      /* Navigation privee : l'etape ne survit pas a un rechargement, sans plus. */
    }
    if (numero === TOTAL) ecritRecapitulatif();

    const section = sections[numero - 1];
    if (defile) {
      if (window.matchMedia(MOBILE).matches) {
        /* Telephone : le panneau des choix est sous l'apercu, on y amene la
           famille. */
        section.scrollIntoView({ block: "start", behavior: "smooth" });
      } else {
        /* Ordinateur : la vue application. La barre vient en haut de la
           fenetre (l'en-tete du site passe au-dessus), et le panneau des
           choix, qui defile seul, repart du haut. */
        const nav = barre[0]?.closest("nav");
        if (nav) {
          const haut = nav.getBoundingClientRect().top + window.scrollY;
          if (Math.abs(window.scrollY - haut) > 2) window.scrollTo({ top: haut, behavior: "smooth" });
        }
        const panneau = section.parentElement;
        if (panneau) panneau.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    if (focus) {
      const titre = section.querySelector<HTMLElement>("[data-etape-titre]");
      titre?.focus({ preventScroll: true });
    }
  }

  /* ---------------------------------------------------- Les liens */

  for (const lien of liens) {
    lien.addEventListener("click", (evenement) => {
      const numero = numeroDe(lien);
      if (numero === null) return;
      evenement.preventDefault();
      va(numero);
    });
  }

  /* ------------------------------------------------ Le recapitulatif */

  const recapMatiereImg = document.querySelector<HTMLImageElement>("[data-recap-matiere-img]");
  const recapMatiere = document.querySelector<HTMLElement>("[data-recap-matiere]");
  const recapInscription = document.querySelector<HTMLElement>("[data-recap-inscription]");
  const recapEcriture = document.querySelector<HTMLElement>("[data-recap-ecriture]");
  const recapMotif = document.querySelector<HTMLElement>("[data-recap-motif]");
  const recapMotifVue = document.querySelector<HTMLElement>("[data-recap-motif-vue]");

  function ecritRecapitulatif(): void {
    const valeur = options.etat.lire();

    if (recapMatiere) recapMatiere.textContent = options.nomMatiere(valeur.matiere);
    if (recapMatiereImg) {
      const vignette = options.vignetteMatiere(valeur.matiere);
      if (vignette) recapMatiereImg.src = vignette;
      recapMatiereImg.alt = "";
    }

    const lignes = valeur.zones
      .flatMap((zone) => zone.texte.split("\n"))
      .map((ligne) => ligne.trim())
      .filter((ligne) => ligne.length > 0);
    if (recapInscription) {
      recapInscription.replaceChildren();
      if (lignes.length === 0) {
        const vide = document.createElement("span");
        vide.className = "cfg-recap-vide";
        vide.textContent = "Aucune inscription pour l'instant.";
        recapInscription.append(vide);
      } else {
        for (const ligne of lignes) {
          const element = document.createElement("span");
          element.className = "cfg-recap-ligne";
          element.textContent = ligne;
          recapInscription.append(element);
        }
      }
    }
    if (recapEcriture) {
      const zone = valeur.zones[0];
      recapEcriture.textContent =
        zone && lignes.length > 0
          ? `${options.nomPolice(zone.policeId)} · ${options.nomFinition(zone.finitionId)}`
          : "";
    }

    if (recapMotif) {
      const noms = valeur.motifs.map((pose) => options.nomMotif(pose.id));
      if (valeur.motifSurDemande) noms.push("Un motif à vous");
      recapMotif.textContent = noms.length ? noms.join(", ") : "Aucun motif";
    }
    if (recapMotifVue) {
      const premier = valeur.motifs[0];
      const fichier = premier ? options.fichierMotif(premier.id) : "";
      recapMotifVue.style.setProperty("--motif", fichier ? `url(${fichier})` : "none");
      recapMotifVue.hidden = !fichier;
    }
  }

  /* Le recapitulatif suit l'etat tant qu'il est affiche (une famille qui
     modifie depuis l'etape 4 revient dessus). */
  options.etat.abonner(() => {
    if (courante === TOTAL) ecritRecapitulatif();
  });

  /* ------------------------------------- Telephone : replier, agrandir */

  const apercu = document.querySelector<HTMLElement>("[data-apercu-panneau]");
  const replier = document.querySelector<HTMLButtonElement>("[data-apercu-replier]");
  const agrandirs = [...document.querySelectorAll<HTMLButtonElement>("[data-apercu-agrandir]")];
  const fermer = document.querySelector<HTMLButtonElement>("[data-apercu-fermer]");

  /* Le canvas prend la largeur de son cadre : apres un repli ou un plein
     ecran, l'echelle d'affichage change. `index.ts` ecoute `resize`. */
  const signaleRedimension = () => window.dispatchEvent(new Event("resize"));

  if (apercu && replier) {
    replier.hidden = false;
    replier.addEventListener("click", () => {
      const replie = apercu.classList.toggle("est-replie");
      replier.setAttribute("aria-expanded", String(!replie));
      const texte = replier.querySelector<HTMLElement>("[data-replier-texte]");
      if (texte) texte.textContent = replie ? "Voir l'aperçu" : "Replier l'aperçu";
      signaleRedimension();
    });
  }

  if (apercu && agrandirs.length) {
    const ouvre = () => {
      apercu.classList.remove("est-replie");
      document.documentElement.classList.add("cfg-plein-ecran");
      if (fermer) {
        fermer.hidden = false;
        fermer.focus({ preventScroll: true });
      }
      signaleRedimension();
    };
    const ferme = () => {
      document.documentElement.classList.remove("cfg-plein-ecran");
      if (fermer) fermer.hidden = true;
      signaleRedimension();
      agrandirs[0]?.focus({ preventScroll: true });
    };
    for (const bouton of agrandirs) {
      bouton.hidden = false;
      bouton.addEventListener("click", ouvre);
    }
    fermer?.addEventListener("click", ferme);
    document.addEventListener("keydown", (evenement) => {
      if (evenement.key === "Escape" && document.documentElement.classList.contains("cfg-plein-ecran")) {
        ferme();
      }
    });
  }

  /* ------------------------------------------------- Etape de depart */

  let depart = 1;
  const ancre = Number(/^#etape-(\d)$/.exec(window.location.hash)?.[1]);
  if (Number.isInteger(ancre) && ancre >= 1 && ancre <= TOTAL) depart = ancre;
  else {
    try {
      const gardee = Number(window.sessionStorage.getItem(cle));
      if (Number.isInteger(gardee) && gardee >= 1 && gardee <= TOTAL) depart = gardee;
    } catch {
      /* rien */
    }
  }
  va(depart, { focus: false, defile: false });

  window.addEventListener("hashchange", () => {
    const n = Number(/^#etape-(\d)$/.exec(window.location.hash)?.[1]);
    if (Number.isInteger(n) && n >= 1 && n <= TOTAL && n !== courante) va(n);
  });

  return { va, courante: () => courante };
}
