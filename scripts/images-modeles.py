#!/usr/bin/env python3
"""Derive les images web des modeles a partir des PNG pilotes.

Source : docs/images-configurateur/pilotes/<famille>/<modeleId>/v1/<modeleId>-<matiere>.png
Sortie : public/images/modeles/<modeleId>/<modeleId>-<matiere>-{1200,640,320}.webp
Index  : src/data/images-modeles.json  { modeleId: { famille, matieres: [...] } }
Matieres : docs/images-configurateur/matieres/<date>/textures-v1/<id>-texture-v1.png
        -> public/images/matieres/<id>-{480,160}.webp (nuancier et pastilles)

Idempotent : une image n est reconvertie que si le PNG est plus recent que le WebP.
Lancer depuis la racine du depot : python3 scripts/images-modeles.py
"""
import glob
import json
import os
import sys

from PIL import Image

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(RACINE, "docs", "images-configurateur", "pilotes")
DST = os.path.join(RACINE, "public", "images", "modeles")
INDEX = os.path.join(RACINE, "src", "data", "images-modeles.json")
TAILLES = {1200: 80, 640: 78, 320: 72}
SRC_MATIERES = os.path.join(RACINE, "docs", "images-configurateur", "matieres")
DST_MATIERES = os.path.join(RACINE, "public", "images", "matieres")
TAILLES_MATIERES = {480: 80, 160: 75}


def derive(png, modele_id, matiere):
    dossier = os.path.join(DST, modele_id)
    os.makedirs(dossier, exist_ok=True)
    faits = 0
    source = None
    for taille, qualite in TAILLES.items():
        cible = os.path.join(dossier, f"{modele_id}-{matiere}-{taille}.webp")
        if os.path.exists(cible) and os.path.getmtime(cible) >= os.path.getmtime(png):
            continue
        if source is None:
            source = Image.open(png).convert("RGB")
        im = source if source.width == taille else source.resize((taille, taille), Image.LANCZOS)
        im.save(cible, "WEBP", quality=qualite, method=6)
        faits += 1
    return faits


def derive_matieres():
    """Carre central de chaque texture, en deux tailles."""
    os.makedirs(DST_MATIERES, exist_ok=True)
    faits = 0
    for png in sorted(glob.glob(os.path.join(SRC_MATIERES, "*", "textures-v1", "*-texture-v1.png"))):
        matiere = os.path.basename(png).replace("-texture-v1.png", "")
        source = None
        for taille, qualite in TAILLES_MATIERES.items():
            cible = os.path.join(DST_MATIERES, f"{matiere}-{taille}.webp")
            if os.path.exists(cible) and os.path.getmtime(cible) >= os.path.getmtime(png):
                continue
            if source is None:
                im = Image.open(png).convert("RGB")
                cote = min(im.size)
                x = (im.width - cote) // 2
                y = (im.height - cote) // 2
                source = im.crop((x, y, x + cote, y + cote))
            source.resize((taille, taille), Image.LANCZOS).save(cible, "WEBP", quality=qualite, method=6)
            faits += 1
    return faits


def main():
    print(f"{derive_matieres()} fichiers WebP de matieres ecrits")
    index = {}
    convertis = 0
    for png in sorted(glob.glob(os.path.join(SRC, "*", "*", "v1", "*.png"))):
        parts = png.split(os.sep)
        famille, modele_id = parts[-4], parts[-3]
        nom = os.path.basename(png)[:-4]
        if not nom.startswith(modele_id + "-"):
            print("ignore (nom inattendu) :", png, file=sys.stderr)
            continue
        matiere = nom[len(modele_id) + 1:]
        convertis += derive(png, modele_id, matiere)
        entree = index.setdefault(modele_id, {"famille": famille, "matieres": []})
        entree["matieres"].append(matiere)
    for entree in index.values():
        entree["matieres"].sort()
    with open(INDEX, "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"{len(index)} modeles, {sum(len(e['matieres']) for e in index.values())} images, "
          f"{convertis} fichiers WebP ecrits")


if __name__ == "__main__":
    main()
