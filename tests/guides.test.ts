/**
 * Les guides (/guides/). On teste la liste partagee, pas le texte des pages :
 * un guide retire de src/data/guides.ts sans sa page, ou deux guides au meme
 * slug, casseraient le maillage interne et le pied de page.
 */
import { describe, expect, it } from "vitest";
import {
  GUIDES,
  GUIDES_URL,
  MENTION_VERIFICATION,
  VERIFIE_LE,
  autresGuides,
  guideParSlug,
  guideUrl,
} from "@/data/guides";
import { SOURCES } from "@/data/cimetieres-ne";

describe("liste des guides", () => {
  it("n a pas deux fois le meme slug", () => {
    const slugs = GUIDES.map((guide) => guide.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("decrit chaque guide (slug en minuscules, titres et resume remplis)", () => {
    for (const guide of GUIDES) {
      expect(guide.slug).toMatch(/^[a-z0-9-]+$/);
      expect(guide.titre.length).toBeGreaterThan(10);
      expect(guide.titreCourt.length).toBeGreaterThan(5);
      expect(guide.resume.length).toBeGreaterThan(40);
    }
  });

  it("construit des adresses absolues terminees par une barre oblique", () => {
    for (const guide of GUIDES) {
      expect(guideUrl(guide.slug)).toBe(`${GUIDES_URL}${guide.slug}/`);
      expect(guideUrl(guide.slug)).toMatch(/^\/guides\/[a-z0-9-]+\/$/);
    }
  });

  it("retrouve un guide par son slug et refuse un slug inconnu", () => {
    expect(guideParSlug(GUIDES[0].slug)).toBe(GUIDES[0]);
    expect(() => guideParSlug("guide-qui-n-existe-pas")).toThrow();
  });

  it("propose les autres guides, jamais celui qu on lit", () => {
    for (const guide of GUIDES) {
      const autres = autresGuides(guide.slug);
      expect(autres).toHaveLength(GUIDES.length - 1);
      expect(autres.some((item) => item.slug === guide.slug)).toBe(false);
    }
  });
});

describe("mention de verification", () => {
  it("porte la date de relecture et la promesse de controle avant la pose", () => {
    expect(MENTION_VERIFICATION).toContain(VERIFIE_LE);
    expect(MENTION_VERIFICATION).toContain("avant la pose");
  });
});

describe("sources officielles des cimetieres", () => {
  it("donne un libelle et un lien https a chaque source", () => {
    for (const [id, source] of Object.entries(SOURCES)) {
      expect(source.libelle.length, id).toBeGreaterThan(10);
      expect(source.url, id).toMatch(/^https:\/\//);
    }
  });
});
