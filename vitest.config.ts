/**
 * Les tests du configurateur (`npm test`). Ils ne testent que du code PUR
 * (composition, echelle, bornes des motifs), avec les vraies calibrations de
 * `src/data/calibrations/`. Le rendu se controle au navigateur de test :
 * `scripts/verifie-configurateur.sh`. Guide : docs/CONFIGURATEUR.md, section 5.
 */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
