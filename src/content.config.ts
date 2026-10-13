import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { granitIds } from "./data/granits";

/**
 * Un fichier Markdown par modele dans src/content/products.
 * Le nom du fichier sert de slug. Aucun prix dans les fiches : l affichage est
 * toujours "Prix sur demande" (tarifs reels en E3).
 */
const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
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
      /** Photos ou rendus du modele. Vide tant qu on n a que des visuels provisoires. */
      images: z.array(image()).default([]),
      order: z.number().int().nonnegative().default(999),
    }),
});

export const collections = { products };
