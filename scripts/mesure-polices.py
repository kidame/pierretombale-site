#!/usr/bin/env python3
"""Mesure ce dont le configurateur a besoin pour une police de gravure.

1. La CAPITALE : hauteur de la majuscule / taille de police (sCapHeight /
   unitsPerEm). Le metier mesure les lettres sur la majuscule ; le canvas a
   besoin de ce rapport pour dessiner « 3 cm » juste. A recopier dans
   `capitale:` de la police, dans src/data/personnalisation.ts.
2. Les CARACTERES qui manquent dans le sous-ensemble latin charge par le site
   (accents, guillemets, signe de deces...). Un caractere absent s'affiche
   dans une autre police.

Usage (depuis la racine du depot, apres npm install) :
  python3 scripts/mesure-polices.py                 # les 6 polices du site
  python3 scripts/mesure-polices.py cormorant       # une nouvelle police @fontsource
Dependance : pip3 install --user --break-system-packages fonttools
"""
import glob
import sys

from fontTools.ttLib import TTFont

POLICES = ["cinzel", "marcellus", "eb-garamond", "jost", "great-vibes", "pinyon-script"]
A_VERIFIER = "éèêëàâäçùûüôöîïœŒÉÈÀÇ«»’–†✝"


def main() -> None:
    for police in sys.argv[1:] or POLICES:
        fichiers = glob.glob(f"node_modules/@fontsource/{police}/files/{police}-latin-400-normal.woff")
        if not fichiers:
            print(f"{police}: fichier introuvable (npm install @fontsource/{police} ?)")
            continue
        fonte = TTFont(fichiers[0])
        capitale = fonte["OS/2"].sCapHeight / fonte["head"].unitsPerEm
        table = fonte.getBestCmap()
        manque = "".join(c for c in A_VERIFIER if ord(c) not in table) or "aucun"
        print(f"{police}: capitale {capitale:.2f} | caracteres absents : {manque}")


if __name__ == "__main__":
    main()
