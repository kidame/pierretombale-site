/**
 * Les prix affiches (src/data/tarifs.ts). On teste les REGLES (priorite modele >
 * famille > defaut, caractere provisoire, aucune offre Google tant que c'est
 * indicatif), avec les montants lus dans src/data/tarifs.json : les associes
 * peuvent changer un montant sans casser les tests.
 */
import { describe, expect, it } from "vitest";
import tarifsData from "@/data/tarifs.json";
import {
  enregistreFamilles,
  fourchetteAffichee,
  montantSuisse,
  offreJsonLd,
  prixAffiche,
  prixEstProvisoire,
} from "@/data/tarifs";

type PrixJson = { des?: number; min?: number; max?: number; provisoire?: boolean } | null;
const fichier = tarifsData as unknown as {
  devise: string;
  parFamille: Record<string, PrixJson>;
  modeles: Record<string, PrixJson>;
};

function texteAttendu(prix: PrixJson): string {
  if (prix === null) return "Prix sur demande";
  if (prix.des !== undefined) return `Dès ${montantSuisse(prix.des)} ${fichier.devise}`;
  return `De ${montantSuisse(prix.min!)} à ${montantSuisse(prix.max!)} ${fichier.devise}`;
}

const FUNERAIRE = "douceur";
const CINERAIRE = "aloria";

describe("tarifs", () => {
  it("refuse de chiffrer un modele dont la famille n'est pas encore connue", () => {
    expect(() => prixAffiche(FUNERAIRE)).toThrow(/famille soit connue/);
  });

  it("refuse une famille inconnue dans parFamille", () => {
    expect(() => enregistreFamilles([[FUNERAIRE, "monument"]])).toThrow(/inconnue/);
  });

  it("donne a chaque modele le prix de sa famille", () => {
    enregistreFamilles([
      [FUNERAIRE, "monument"],
      [CINERAIRE, "cineraire"],
    ]);
    expect(fichier.modeles[FUNERAIRE]).toBeNull();
    expect(fichier.modeles[CINERAIRE]).toBeNull();
    expect(prixAffiche(FUNERAIRE)).toBe(texteAttendu(fichier.parFamille.monument));
    expect(prixAffiche(CINERAIRE)).toBe(texteAttendu(fichier.parFamille.cineraire));
  });

  it("affiche aujourd'hui des prix d'appel, plus de fourchette jusqu'a 6'000", () => {
    expect(prixAffiche(FUNERAIRE)).toMatch(/^Dès /);
    expect(prixAffiche(CINERAIRE)).toMatch(/^Dès /);
    expect(prixAffiche(FUNERAIRE)).not.toContain("6'000");
  });

  it("garde un prix indicatif hors des donnees Google", () => {
    expect(prixEstProvisoire(FUNERAIRE)).toBe(fichier.parFamille.monument?.provisoire === true);
    if (prixEstProvisoire(FUNERAIRE)) expect(offreJsonLd(FUNERAIRE)).toBeNull();
  });

  it("agrege une famille en prix d'appel sur la page prix", () => {
    expect(fourchetteAffichee([FUNERAIRE])).toBe(prixAffiche(FUNERAIRE));
    expect(fourchetteAffichee([CINERAIRE])).toBe(prixAffiche(CINERAIRE));
  });
});
