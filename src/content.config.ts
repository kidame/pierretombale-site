import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { granitIds } from "./data/granits";
import imagesModeles from "./data/images-modeles.json";

/** Les modeles qui ont leurs visuels derives dans public/images/modeles. */
const modeleIds = Object.keys(imagesModeles);

/**
 * Un fichier Markdown par modele dans src/content/products.
 * Le nom du fichier sert de slug. Aucun prix dans les fiches : les prix vivent
 * dans src/data/tarifs.json, par slug, et s affichent via `prixAffiche`.
 *
 * Les visuels ne sont PAS declares dans les fiches : ils vivent dans
 * public/images/modeles/<modeleId>/, une image par matiere et par largeur, et
 * src/data/images-modeles.json en tient l index. Une fiche ne porte donc que
 * son `modeleId` ; le reste se deduit (cf. `visuelModele` dans
 * src/data/products.ts).
 */
const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: () =>
    z.object({
      name: z.string(),
      /** Identifiant du jeu de visuels. Doit exister dans src/data/images-modeles.json. */
      modeleId: z.string().refine((id) => modeleIds.includes(id), {
        message: `modele inconnu : utiliser une cle de src/data/images-modeles.json (${modeleIds.join(", ")})`,
      }),
      /** monument = 100 x 200 cm, cineraire = 60 x 60 cm. */
      famille: z.enum(["monument", "cineraire"]),
      gamme: z.enum(["classique", "contemporain", "prestige", "musulman"]),
      /** Dimensions hors tout, ex. "100 x 200 cm". */
      dimensions: z.string(),
      /** Le modele comporte-t-il une stele ? */
      stele: z.boolean(),
      bicolore: z.boolean(),
      lignes: z.enum(["droites", "courbes"]),
      /** Motifs graves ou sculptes, ex. "coeur". */
      motifs: z.array(z.string()).default([]),
      /** Options proposees, ex. "prie-dieu", "vase", "jardiniere". */
      options: z.array(z.string()).default([]),
      /** Granit du visuel presente. Doit exister dans src/data/granits.json. */
      granitPresente: z.string().refine((id) => granitIds.includes(id), {
        message: `granit inconnu : utiliser un id de src/data/granits.json (${granitIds.join(", ")})`,
      }),
      /** Granits realisables : liste d ids, ou ["tous"]. */
      granitsPossibles: z
        .array(z.string())
        .default(["tous"])
        .refine((ids) => ids.every((id) => id === "tous" || granitIds.includes(id)), {
          message: `granit inconnu : utiliser des ids de src/data/granits.json, ou ["tous"]`,
        }),
      shortDescription: z.string(),
      order: z.number().int().nonnegative().default(999),
    }),
});

export const collections = { products };
