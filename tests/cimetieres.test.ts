/**
 * Les pages cimetiere (/cimetieres/). On teste les donnees partagees, pas le
 * texte des pages : une fiche sans source, un titre trop long pour Google ou
 * une commune du tableau qui pointe vers une page inexistante casseraient le
 * hub et le maillage interne.
 *
 * Les memes controles vivent dans `valide()` (src/data/cimetieres.ts), appele
 * au chargement du module : le build echoue aussi quand les tests ne tournent
 * pas. Ici on verifie en plus les fonctions d adresse.
 */
import { describe, expect, it } from "vitest";
import {
  CIMETIERES,
  CIMETIERES_URL,
  COMMUNES_NE,
  PHRASE_SUR_MESURE,
  VERIFIE_LE,
  autresCimetieres,
  cimetiereParSlug,
  cimetiereUrl,
  devisUrl,
  itineraireUrl,
  mentionVerification,
} from "@/data/cimetieres";
import { SOURCES } from "@/data/cimetieres-ne";

describe("fiches des cimetieres", () => {
  it("n a pas deux fois le meme slug", () => {
    const slugs = CIMETIERES.map((fiche) => fiche.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("garde un titre de page sous 65 signes", () => {
    for (const fiche of CIMETIERES) {
      expect(fiche.titreSeo.length, fiche.slug).toBeLessThanOrEqual(65);
      expect(fiche.titreSeo.length, fiche.slug).toBeGreaterThan(20);
    }
  });

  it("ecrit une meta description de 120 a 160 signes, unique", () => {
    const vues = new Set<string>();
    for (const fiche of CIMETIERES) {
      expect(fiche.description.length, fiche.slug).toBeGreaterThanOrEqual(120);
      expect(fiche.description.length, fiche.slug).toBeLessThanOrEqual(160);
      expect(vues.has(fiche.description), fiche.slug).toBe(false);
      vues.add(fiche.description);
    }
  });

  it("pose au moins quatre questions reelles par cimetiere", () => {
    for (const fiche of CIMETIERES) {
      expect(fiche.faq.length, fiche.slug).toBeGreaterThanOrEqual(4);
      for (const item of fiche.faq) {
        expect(item.question.endsWith("?"), item.question).toBe(true);
        expect(item.reponse.length, item.question).toBeGreaterThan(60);
      }
    }
  });

  it("cite au moins un document officiel connu et porte sa date de verification", () => {
    for (const fiche of CIMETIERES) {
      expect(fiche.sources.length, fiche.slug).toBeGreaterThanOrEqual(1);
      for (const id of fiche.sources) {
        expect(SOURCES[id], `${fiche.slug} : ${id}`).toBeDefined();
      }
      expect(fiche.verifieLe, fiche.slug).toBeTruthy();
    }
  });

  it("donne un article a chaque dimension publiee", () => {
    for (const fiche of CIMETIERES) {
      expect(fiche.regles.tombes.length, fiche.slug).toBeGreaterThanOrEqual(1);
      for (const tombe of fiche.regles.tombes) {
        expect(tombe.dimensions.length, `${fiche.slug} : ${tombe.type}`).toBeGreaterThan(0);
        expect(tombe.article.length, `${fiche.slug} : ${tombe.type}`).toBeGreaterThan(0);
      }
    }
  });

  it("remplit les trois chiffres du bloc L essentiel", () => {
    for (const fiche of CIMETIERES) {
      expect(fiche.chiffres.delai, fiche.slug).toBeTruthy();
      expect(fiche.chiffres.tombeAdulte, fiche.slug).toBeTruthy();
      expect(fiche.chiffres.hauteurMax, fiche.slug).toBeTruthy();
    }
  });
});

describe("adresses", () => {
  it("construit des adresses absolues terminees par une barre oblique", () => {
    for (const fiche of CIMETIERES) {
      expect(cimetiereUrl(fiche.slug)).toBe(`${CIMETIERES_URL}${fiche.slug}/`);
      expect(cimetiereUrl(fiche.slug)).toMatch(/^\/cimetieres\/[a-z0-9-]+\/$/);
    }
  });

  it("retrouve une fiche par son slug et refuse un slug inconnu", () => {
    expect(cimetiereParSlug(CIMETIERES[0].slug)).toBe(CIMETIERES[0]);
    expect(() => cimetiereParSlug("cimetiere-qui-n-existe-pas")).toThrow();
  });

  it("propose les autres cimetieres, jamais celui qu on lit", () => {
    for (const fiche of CIMETIERES) {
      const autres = autresCimetieres(fiche.slug);
      expect(autres).toHaveLength(CIMETIERES.length - 1);
      expect(autres.some((item) => item.slug === fiche.slug)).toBe(false);
    }
  });

  it("pre-remplit le devis avec la commune et le cimetiere encodes", () => {
    const beauregard = cimetiereParSlug("beauregard-neuchatel");
    const url = devisUrl(beauregard);
    expect(url.startsWith("/devis/?")).toBe(true);
    const parametres = new URLSearchParams(url.slice(url.indexOf("?") + 1));
    expect(parametres.get("commune")).toBe("Neuchâtel");
    expect(parametres.get("cimetiere")).toBe("Beauregard");
  });

  it("construit un lien d itineraire avec le nom et la localite encodes", () => {
    const fiche = cimetiereParSlug("peseux");
    const url = itineraireUrl(fiche);
    expect(url.startsWith("https://www.google.com/maps/search/?api=1&query=")).toBe(true);
    expect(url).toContain(encodeURIComponent("Cimetière de Peseux Peseux"));
  });
});

describe("tableau des communes du canton", () => {
  it("remplit chaque colonne et nomme le texte officiel", () => {
    for (const commune of COMMUNES_NE) {
      expect(commune.commune.length, commune.commune).toBeGreaterThan(2);
      for (const valeur of [
        commune.delai,
        commune.tombeAdulte,
        commune.hauteurMax,
        commune.bordure,
        commune.cineraire,
      ]) {
        expect(valeur.length, commune.commune).toBeGreaterThan(0);
      }
      expect(commune.texte.titre.length, commune.commune).toBeGreaterThan(5);
      expect(commune.texte.date.length, commune.commune).toBeGreaterThan(3);
      if (commune.texte.url) expect(commune.texte.url).toMatch(/^https:\/\//);
    }
  });

  it("ne renvoie que vers des pages qui existent", () => {
    for (const commune of COMMUNES_NE) {
      if (!commune.slug) continue;
      expect(CIMETIERES.some((fiche) => fiche.slug === commune.slug), commune.commune).toBe(true);
    }
  });

  it("couvre les 24 communes du canton", () => {
    const communes = new Set(COMMUNES_NE.map((ligne) => ligne.commune));
    expect(communes.size).toBe(24);
  });
});

describe("mentions communes", () => {
  it("porte la date de relecture et la promesse de controle avant la pose", () => {
    const mention = mentionVerification(VERIFIE_LE);
    expect(mention).toContain(VERIFIE_LE);
    expect(mention).toContain("avant la pose");
  });

  it("dit que le monument est realise sur mesure aux dimensions autorisees", () => {
    expect(PHRASE_SUR_MESURE).toContain("sur mesure");
    expect(PHRASE_SUR_MESURE).toContain("demande de pose");
  });
});
