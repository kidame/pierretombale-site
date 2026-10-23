/**
 * LA COMPOSITION : DES CHAMPS A L'INSCRIPTION GRAVEE.
 *
 * Fonction pure. Elle recoit ce que la famille a saisi (prenom, nom, dates,
 * phrase, mise en page), la geometrie de la stele (`Echelle`) et un
 * `Mesureur` (la largeur reelle d'un texte dans une police), et rend les zones
 * de texte a dessiner : une par bloc (nom, dates, phrase), centrees, empilees,
 * chacune dans la plus grande taille du metier qui tient.
 *
 * L'ALGORITHME, dans l'ordre :
 *   1. chaque bloc prend la plus grande taille de `taillesParRole` dont toutes
 *      les lignes tiennent dans la largeur (un nom trop long passe sur deux
 *      lignes, prenom puis NOM ; une phrase se coupe entre les mots) ;
 *   2. tant que la pile deborde en hauteur, on descend d'un cran : la phrase
 *      d'abord, puis les dates, puis le nom ;
 *   3. la pile est centree verticalement sur sa stele.
 * Si rien ne suffit, `tient` vaut `false` : la page le dit, rien n'est cache.
 *
 * CE QU'IL NE FAIT PAS : il ne touche ni au DOM ni a Konva (voir
 * `inscription.ts` pour le formulaire, `mesure.ts` pour le mesureur).
 */
import {
  ESPACES_CM,
  LARGEUR_UTILE,
  misesEnPage,
  NOM_UNE_LIGNE_MIN_MM,
  PHRASE_LIGNES_MAX,
  PREFIXE_NOM_DE_NAISSANCE,
  SEPARATEUR_DATES,
  taillesParRole,
  type MiseEnPageId,
  type RoleTexte,
} from "@/data/inscription";
import type { Echelle } from "./echelle";
import { ALIGNEMENT_ZONE, type ZoneTexte } from "./etat";

export interface Personne {
  prenom: string;
  nom: string;
  /** Facultatif : imprime « née DUPONT » sous le nom. */
  nomJeuneFille: string;
  /** Texte libre : « 1948 » ou « 12.03.1948 ». */
  naissance: string;
  deces: string;
}

export interface Inscription {
  miseEnPage: MiseEnPageId;
  /** Toujours deux fiches ; la seconde ne sert qu'en mise en page a deux. */
  personnes: [Personne, Personne];
  phrase: string;
  policeId: string;
  finitionId: string;
}

export interface Mesureur {
  /** Largeur en cm d'une ligne, lettres de `hauteurMm` (hauteur de majuscule). */
  largeurCm(texte: string, policeId: string, hauteurMm: number): number;
  /** Hauteur en cm d'un bloc de `lignes` lignes, comme Konva le dessinera. */
  hauteurBlocCm(lignes: number, policeId: string, hauteurMm: number): number;
}

export interface BlocCompose {
  role: RoleTexte;
  /** 0 ou 1 ; -1 pour la phrase. */
  personne: number;
  hauteurMm: number;
}

export interface Composition {
  zones: ZoneTexte[];
  blocs: BlocCompose[];
  /** `false` : meme aux plus petites tailles, l'inscription deborde. */
  tient: boolean;
}

export function personneVide(): Personne {
  return { prenom: "", nom: "", nomJeuneFille: "", naissance: "", deces: "" };
}

const net = (texte: string) => texte.replace(/\s+/g, " ").trim();
const capitales = (texte: string) => net(texte).toLocaleUpperCase("fr-CH");

interface Bloc {
  cle: string;
  role: RoleTexte;
  personne: number;
  surface: number;
  tailles: number[];
  rang: number;
  lignes: string[];
  /** Les variantes de lignes a essayer, de la preferee a la plus serree. */
  variantes: (largeurMaxCm: number, hauteurMm: number) => string[] | null;
}

/** Coupe une phrase entre les mots pour tenir dans `largeurMaxCm`. */
function coupe(
  texte: string,
  largeurMaxCm: number,
  mesure: (ligne: string) => number,
): string[] {
  const lignes: string[] = [];
  /* Les retours a la ligne voulus par la famille sont gardes. */
  for (const paragraphe of texte.split("\n")) {
    const mots = net(paragraphe).split(" ").filter(Boolean);
    let courante = "";
    for (const mot of mots) {
      const essai = courante ? `${courante} ${mot}` : mot;
      if (!courante || mesure(essai) <= largeurMaxCm) courante = essai;
      else {
        lignes.push(courante);
        courante = mot;
      }
    }
    if (courante) lignes.push(courante);
  }
  return lignes;
}

function blocsDe(inscription: Inscription, mesureur: Mesureur, surfaces: number): Bloc[] {
  const miseEnPage = misesEnPage.find((m) => m.id === inscription.miseEnPage) ?? misesEnPage[0];
  const tailles = taillesParRole[miseEnPage.personnes === 2 ? "deux" : "une"];
  const police = inscription.policeId;
  const tous = (lignes: string[], max: number, h: number) =>
    lignes.every((ligne) => mesureur.largeurCm(ligne, police, h) <= max);

  const blocsPersonne = (p: Personne, rang: number): Bloc[] => {
    const surface = rang === 1 && surfaces > 1 ? 1 : 0;
    const prenom = net(p.prenom);
    const nom = capitales(p.nom);
    const ligneNom = [prenom, nom].filter(Boolean).join(" ");
    const dates = [net(p.naissance), net(p.deces)].filter(Boolean).join(SEPARATEUR_DATES);
    const lignesDates = [
      net(p.nomJeuneFille) ? `${PREFIXE_NOM_DE_NAISSANCE} ${capitales(p.nomJeuneFille)}` : "",
      dates,
    ].filter(Boolean);

    const blocs: Bloc[] = [];
    if (ligneNom) {
      blocs.push({
        cle: `g-nom-${rang}`,
        role: "nom",
        personne: rang,
        surface,
        tailles: tailles.nom,
        rang: 0,
        lignes: [ligneNom],
        variantes: (max, h) => {
          if (tous([ligneNom], max, h)) return [ligneNom];
          /* Une taille plus petite, mais encore grande, le garde sur une ligne :
             la boucle y descendra. */
          const uneLigneAilleurs = tailles.nom.some(
            (t) => t < h && t >= NOM_UNE_LIGNE_MIN_MM && tous([ligneNom], max, t),
          );
          if (uneLigneAilleurs) return null;
          /* Trop long sur une ligne : prenom au-dessus du NOM. */
          if (prenom && nom && tous([prenom, nom], max, h)) return [prenom, nom];
          return null;
        },
      });
    }
    if (lignesDates.length > 0) {
      blocs.push({
        cle: `g-dates-${rang}`,
        role: "dates",
        personne: rang,
        surface,
        tailles: tailles.dates,
        rang: 0,
        lignes: lignesDates,
        variantes: (max, h) => (tous(lignesDates, max, h) ? lignesDates : null),
      });
    }
    return blocs;
  };

  const blocs = blocsPersonne(inscription.personnes[0], 0);
  if (miseEnPage.personnes === 2) blocs.push(...blocsPersonne(inscription.personnes[1], 1));

  const phrase = inscription.phrase.trim();
  if (phrase) {
    const blocPhrase: Bloc = {
      cle: "g-phrase",
      role: "phrase",
      personne: -1,
      surface: 0,
      tailles: tailles.phrase,
      rang: 0,
      lignes: [phrase],
      variantes: (max, h) => {
        const lignes = coupe(phrase, max, (ligne) => mesureur.largeurCm(ligne, police, h));
        return lignes.length <= PHRASE_LIGNES_MAX && tous(lignes, max, h) ? lignes : null;
      },
    };
    if (miseEnPage.phraseEnHaut) blocs.unshift(blocPhrase);
    else blocs.push(blocPhrase);
  }
  return blocs;
}

export function compose(
  inscription: Inscription,
  echelle: Echelle,
  mesureur: Mesureur,
): Composition {
  const surfacesCm = echelle.surfaces.map((s) => ({
    yCm: echelle.pxVersCm(s.y - echelle.zone.y),
    largeur: echelle.pxVersCm(s.largeur),
    hauteur: echelle.pxVersCm(s.hauteur),
  }));
  const blocs = blocsDe(inscription, mesureur, surfacesCm.length);
  const police = inscription.policeId;

  /** Les lignes du bloc a son rang de taille, ou la plus serree a defaut. */
  const ajuste = (bloc: Bloc): boolean => {
    const max = surfacesCm[bloc.surface].largeur * LARGEUR_UTILE;
    const lignes = bloc.variantes(max, bloc.tailles[bloc.rang]);
    if (lignes) {
      bloc.lignes = lignes;
      return true;
    }
    return false;
  };

  /* 1. La largeur : la plus grande taille qui tient. */
  let tient = true;
  for (const bloc of blocs) {
    while (!ajuste(bloc) && bloc.rang < bloc.tailles.length - 1) bloc.rang += 1;
    if (!ajuste(bloc)) {
      tient = false;
      /* Rien ne tient : on garde la plus petite taille, coupee au mieux. */
      if (bloc.role === "phrase") {
        const h = bloc.tailles[bloc.rang];
        const max = surfacesCm[bloc.surface].largeur * LARGEUR_UTILE;
        bloc.lignes = coupe(bloc.lignes.join(" "), max, (l) => mesureur.largeurCm(l, police, h));
      }
    }
  }

  /* La coherence, appelee apres chaque etape (elle ne fait que REDUIRE, donc
     ne casse jamais ce qui tenait) :
       - deux personnes : leurs noms ont la meme taille, leurs dates aussi ;
       - les dates d'une personne restent un cran sous son nom, si possible. */
  const harmonise = () => {
    for (const role of ["nom", "dates"] as RoleTexte[]) {
      const memes = blocs.filter((bloc) => bloc.role === role);
      const plusPetit = Math.min(...memes.map((bloc) => bloc.tailles[bloc.rang]));
      for (const bloc of memes) {
        while (bloc.tailles[bloc.rang] > plusPetit && bloc.rang < bloc.tailles.length - 1) {
          bloc.rang += 1;
        }
        ajuste(bloc);
      }
    }
    for (const dates of blocs.filter((bloc) => bloc.role === "dates")) {
      const nom = blocs.find((bloc) => bloc.role === "nom" && bloc.personne === dates.personne);
      if (!nom) continue;
      while (
        dates.tailles[dates.rang] >= nom.tailles[nom.rang] &&
        dates.rang < dates.tailles.length - 1
      ) {
        dates.rang += 1;
        ajuste(dates);
      }
    }
  };
  harmonise();

  const hauteurBloc = (bloc: Bloc) =>
    mesureur.hauteurBlocCm(bloc.lignes.length, police, bloc.tailles[bloc.rang]);
  const espaceAvant = (bloc: Bloc, precedent: Bloc | undefined) =>
    !precedent
      ? 0
      : precedent.personne === bloc.personne && bloc.personne >= 0
        ? ESPACES_CM.dansPersonne
        : ESPACES_CM.entreBlocs;
  const pile = (surface: number) => blocs.filter((bloc) => bloc.surface === surface);
  const hauteurPile = (surface: number) =>
    pile(surface).reduce(
      (total, bloc, rang, liste) => total + espaceAvant(bloc, liste[rang - 1]) + hauteurBloc(bloc),
      0,
    );

  /* 2. La hauteur : on descend d'un cran le PLUS GRAND texte, pour garder la
     hierarchie (nom >= dates >= phrase) sans ecraser la phrase ; a egalite, la
     phrase d'abord, puis les dates, puis le nom. */
  const priorite: Record<RoleTexte, number> = { phrase: 0, dates: 1, nom: 2 };
  surfacesCm.forEach((surface, numero) => {
    while (hauteurPile(numero) > surface.hauteur) {
      const reductible = pile(numero)
        .filter((bloc) => bloc.rang < bloc.tailles.length - 1)
        .sort(
          (a, b) =>
            b.tailles[b.rang] - a.tailles[a.rang] || priorite[a.role] - priorite[b.role],
        )[0];
      if (!reductible) {
        tient = false;
        break;
      }
      reductible.rang += 1;
      ajuste(reductible);
    }
  });

  /* La descente en hauteur a pu remettre un nom a la taille de ses dates. */
  harmonise();

  /* 3. Les positions : chaque pile centree sur sa stele. */
  const zones: ZoneTexte[] = [];
  surfacesCm.forEach((surface, numero) => {
    let y = surface.yCm + Math.max(0, (surface.hauteur - hauteurPile(numero)) / 2);
    pile(numero).forEach((bloc, rang, liste) => {
      y += espaceAvant(bloc, liste[rang - 1]);
      zones.push({
        cle: bloc.cle,
        texte: bloc.lignes.join("\n"),
        policeId: police,
        hauteurMm: bloc.tailles[bloc.rang],
        finitionId: inscription.finitionId,
        alignement: ALIGNEMENT_ZONE,
        xCm: null,
        yCm: y,
        surface: numero,
      });
      y += hauteurBloc(bloc);
    });
  });

  /* L'etat veut toujours une zone : une inscription vide en garde une, vide. */
  if (zones.length === 0) {
    zones.push({
      cle: "g-vide",
      texte: "",
      policeId: police,
      hauteurMm: taillesParRole.une.nom[0],
      finitionId: inscription.finitionId,
      alignement: ALIGNEMENT_ZONE,
      xCm: null,
      yCm: null,
      surface: 0,
    });
  }

  return {
    zones,
    blocs: blocs.map((bloc) => ({
      role: bloc.role,
      personne: bloc.personne,
      hauteurMm: bloc.tailles[bloc.rang],
    })),
    tient,
  };
}
