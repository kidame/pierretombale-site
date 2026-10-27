/**
 * Le traitement serveur d'une demande de devis (src/lib/devis-serveur.ts) :
 * champs obligatoires, robots, fichiers, reference, courriels.
 */
import { describe, expect, it } from "vitest";
import { courrielAccuse, courrielAssocies, creeReference, enBase64, lisDemande } from "@/lib/devis-serveur";

const MAINTENANT = Date.UTC(2026, 9, 27, 10, 0, 0);

function formulaire(champs: Record<string, string> = {}): FormData {
  const form = new FormData();
  const base: Record<string, string> = {
    nom: "Marie Dubois",
    email: "marie@example.ch",
    localite: "Fleurier",
    typeDemande: "nouveau",
    consentement: "oui",
    societe: "",
    horodatage: String(MAINTENANT - 60_000),
    ...champs,
  };
  for (const [nom, valeur] of Object.entries(base)) form.append(nom, valeur);
  return form;
}

describe("lisDemande", () => {
  it("accepte une demande minimale", () => {
    const lecture = lisDemande(formulaire(), MAINTENANT);
    expect(lecture.statut).toBe("ok");
    if (lecture.statut === "ok") {
      expect(lecture.demande.nom).toBe("Marie Dubois");
      expect(lecture.demande.recontact).toBe("email");
      expect(lecture.demande.signalements).toEqual([]);
    }
  });

  it("signale chaque champ obligatoire manquant, sous son nom", () => {
    const lecture = lisDemande(
      formulaire({ nom: "", email: "pas-une-adresse", localite: " ", typeDemande: "x", consentement: "" }),
      MAINTENANT,
    );
    expect(lecture.statut).toBe("invalide");
    if (lecture.statut === "invalide") {
      expect(Object.keys(lecture.erreurs).sort()).toEqual(["consentement", "email", "localite", "nom", "typeDemande"]);
      expect(lecture.code).toBe(400);
    }
  });

  it("reconnait un robot : piege rempli ou envoi trop rapide", () => {
    expect(lisDemande(formulaire({ societe: "ACME" }), MAINTENANT).statut).toBe("robot");
    expect(lisDemande(formulaire({ horodatage: String(MAINTENANT - 500) }), MAINTENANT).statut).toBe("robot");
  });

  it("accepte un envoi sans JavaScript (horodatage vide)", () => {
    expect(lisDemande(formulaire({ horodatage: "" }), MAINTENANT).statut).toBe("ok");
  });

  it("refuse plus de 3 fichiers (413) et un type non accepte (400)", () => {
    const trop = formulaire();
    for (let i = 0; i < 4; i += 1) trop.append("fichiers", new File(["x"], `f${i}.jpg`, { type: "image/jpeg" }));
    const lu = lisDemande(trop, MAINTENANT);
    expect(lu.statut === "invalide" && lu.code).toBe(413);

    const mauvais = formulaire();
    mauvais.append("fichiers", new File(["x"], "virus.exe", { type: "application/x-msdownload" }));
    const lu2 = lisDemande(mauvais, MAINTENANT);
    expect(lu2.statut === "invalide" && lu2.code).toBe(400);
    expect(lu2.statut === "invalide" && lu2.erreurs.fichiers).toContain("virus.exe");
  });

  it("ignore un champ fichier vide", () => {
    const form = formulaire();
    form.append("fichiers", new File([], "", { type: "application/octet-stream" }));
    const lu = lisDemande(form, MAINTENANT);
    expect(lu.statut === "ok" && lu.demande.fichiers.length).toBe(0);
  });

  it("transmet une valeur inconnue en la signalant, sans refuser", () => {
    const lu = lisDemande(formulaire({ granit: "inconnu", motif: "dessin-fourni" }), MAINTENANT);
    expect(lu.statut).toBe("ok");
    if (lu.statut === "ok") {
      expect(lu.demande.granit).toBe("inconnu");
      expect(lu.demande.signalements.join(" ")).toContain("inconnu");
      expect(lu.demande.signalements.join(" ")).toContain("Motif");
    }
  });

  it("signale un rappel demande sans numero", () => {
    const lu = lisDemande(formulaire({ recontact: "telephone", telephone: "" }), MAINTENANT);
    expect(lu.statut === "ok" && lu.demande.signalements[0]).toContain("pas laissé de numéro");
  });

  it("ne garde que les lignes d'inscription remplies", () => {
    const lu = lisDemande(
      formulaire({ ligne1_texte: "MARIE DUBOIS", ligne1_hauteur: "50", ligne2_texte: "", ligne2_hauteur: "40" }),
      MAINTENANT,
    );
    expect(lu.statut === "ok" && lu.demande.lignes).toEqual([{ numero: 1, texte: "MARIE DUBOIS", hauteur: "50" }]);
  });
});

describe("creeReference", () => {
  it("suit le format PT-AAAAMMJJ-xxxx, date de Zurich", () => {
    const reference = creeReference(new Date(MAINTENANT), () => 0);
    expect(reference).toBe("PT-20261027-2222");
    expect(creeReference(new Date(MAINTENANT))).toMatch(/^PT-20261027-[2-9A-HJ-NP-Z]{4}$/);
  });
});

describe("courriels", () => {
  const lu = lisDemande(
    formulaire({
      modele: "douceur",
      granit: "bengal",
      ligne1_texte: "MARIE <b>DUBOIS</b>",
      ligne1_hauteur: "50",
      recontact: "telephone",
      telephone: "032 000 00 00",
    }),
    MAINTENANT,
  );
  if (lu.statut !== "ok") throw new Error("demande de test invalide");
  const catalogue = { douceur: { nom: "Douceur", famille: "Monuments funéraires", url: "/monuments-funeraires/douceur/" } };

  it("met la reference dans l'objet et le recontact en tete", () => {
    const courriel = courrielAssocies(lu.demande, "PT-20261027-AB2C", {
      catalogue,
      site: "https://www.pierretombale.ch",
      piecesJointes: [],
    });
    expect(courriel.sujet).toContain("PT-20261027-AB2C");
    expect(courriel.texte.indexOf("Par téléphone")).toBeLessThan(courriel.texte.indexOf("Marie Dubois"));
    expect(courriel.texte).toContain("Douceur (https://www.pierretombale.ch/monuments-funeraires/douceur/)");
    expect(courriel.texte).toContain("lettres de 5 cm");
  });

  it("echappe le HTML venu de la famille", () => {
    const courriel = courrielAssocies(lu.demande, "PT-1", { catalogue, site: "https://x.ch", piecesJointes: [] });
    expect(courriel.html).not.toContain("<b>DUBOIS</b>");
    expect(courriel.html).toContain("&lt;b&gt;");
  });

  it("marque une demande suspecte", () => {
    const courriel = courrielAssocies(lu.demande, "PT-1", {
      site: "https://x.ch",
      suspecte: true,
      piecesJointes: [],
    });
    expect(courriel.sujet.startsWith("[A VERIFIER]")).toBe(true);
  });

  it("accuse : reference, sans le texte de l'inscription", () => {
    const accuse = courrielAccuse(lu.demande, "PT-20261027-AB2C");
    expect(accuse.texte).toContain("PT-20261027-AB2C");
    expect(accuse.texte).not.toContain("DUBOIS</b>");
  });
});

describe("enBase64", () => {
  it("encode comme btoa", () => {
    const octets = new TextEncoder().encode("Pierre tombale");
    expect(enBase64(octets.buffer as ArrayBuffer)).toBe(btoa("Pierre tombale"));
  });
});
