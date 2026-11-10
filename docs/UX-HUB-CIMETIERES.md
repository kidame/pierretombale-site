# Refonte du hub cimetieres - 10 novembre 2026

## Livraison privee

Page /cimetieres/ refondue sur main, sans push ni publication. Production conservee.
Direction ivoire, noir et cuivre identique aux neuf fiches validees.
Recherche immediate par cimetiere, commune et alias reels des donnees. Cartes des neuf fiches, reglements des 24 communes (26 lignes), accordions natifs, FAQ et sources.
Composants Astro : BarreRecherche, ListeCimetieres, ListeCommunes, Repli. Aucun framework client ajoute.

## Verification

Build de 75 pages reussi. Recette navigateur : 320, 390, 768 et 1440 px sans debordement ; recherche accents/casse/villages, aucun resultat, reinitialisation, clavier et mouvement reduit verifies.
Sans JavaScript : neuf liens et 26 lignes disponibles, recherche masquee.
Controle des faits : 281/281 apres contre 278/281 avant ; aucun lien perdu. H1, title, description, canonical, FAQ JSON-LD et ancre #communes conserves.
Les 74 autres pages restent identiques hors empreinte CSS partagee : trois utilitaires Tailwind inutilises retires (319 octets).
Lighthouse local mobile et desktop : performance, accessibilite, bonnes pratiques et SEO 100/100. Ces mesures ne sont pas des donnees terrain ni une garantie de classement.
Rapports et captures : /home/kumo/atelier/tmp/hub-cimetieres/.

## Apercu autonome

Export : /home/kumo/atelier/tmp/cimetieres-accueil-maquette.html.
CSS et polices embarques, aucun chargement externe observe, noindex reserve a cet export. Liens vers les fiches publiques.
Verification supplementaire de l export : chargement, absence de debordement, recherche Couvet vers Val-de-Travers. Captures mobile et desktop de la page construites lues par le parent.

## Prochaine etape

Validation visuelle par Thomas puis publication autorisee explicitement. Ne pas confondre cette maquette avec les neuf fiches deja publiees.
