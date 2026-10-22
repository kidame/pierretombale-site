/**
 * L'ATTENTE DES POLICES DE GRAVURE.
 *
 * Un canvas ne sait pas attendre : si on dessine un texte avant que sa police
 * soit arrivee, le navigateur peint une police de remplacement, et il ne
 * redessine pas tout seul. D'ou ce fichier : on attend `document.fonts.load`
 * pour les six polices OFL avant le premier rendu.
 *
 * LES POLICES ELLES-MEMES NE SONT PAS CHARGEES ICI. Les six imports
 * `@fontsource/<police>/latin-400.css` sont dans la PAGE
 * (`src/pages/personnaliser/[slug].astro`), exactement comme dans
 * `src/pages/devis.astro`, et nulle part ailleurs : une page du site qui ne
 * montre pas de gravure ne doit pas telecharger 140 Ko de polices. Ce fichier
 * ne fait qu'attendre ce que la page a demande.
 *
 * CE QU'IL NE FAIT PAS : il ne choisit pas les polices (c'est
 * `src/data/personnalisation.ts`) et ne dessine rien.
 */

/**
 * `document.fonts.load` attend une declaration CSS de police, pas une pile :
 * « 40px "Cinzel", Georgia, serif » n'est pas une declaration valable. On ne
 * garde donc que la premiere famille de la pile, celle du paquet @fontsource ;
 * les suivantes sont des replis deja installes sur la machine.
 */
export function premiereFamille(pile: string): string {
  return pile.split(",")[0]!.trim();
}

/**
 * Attend les polices demandees. Ne rejette jamais : une police manquante doit
 * donner un apercu imparfait, pas un configurateur mort. La taille demandee
 * (40 px) n'a pas d'importance : une police variable ou non est chargee en
 * entier, et le navigateur ne retient que la correspondance famille + graisse.
 */
export async function attendPolices(piles: readonly string[]): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;

  await Promise.all(
    piles.map(async (pile) => {
      try {
        await document.fonts.load(`400 40px ${premiereFamille(pile)}`);
      } catch {
        /* Police indisponible : le canvas prendra le repli de la pile. */
      }
    }),
  );
}
