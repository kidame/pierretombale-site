#!/usr/bin/env python3
"""Vectorise un pochoir noir sur blanc (PNG) en SVG aux regles du configurateur.

C est l outil du "motif sur demande" : une image noir pur sur blanc pur (dessinee
ou generee), et on obtient un SVG monochrome, chemins seuls, fill=currentColor,
viewBox au ras du dessin, 1 unite = 1 mm.

Usage : python3 scripts/vectoriser-motif.py <dossier_sortie> <image.png> <nom> <largeur_mm> [...]
Exemple : python3 scripts/vectoriser-motif.py public/motifs rose.png fleurs-rose 120
Dependances : pip install potracer numpy (scipy et opencv seulement pour la mesure
des traits, facultative : sans eux la mesure est sautee).
Regles d entree : noir #000 sur blanc #fff, pas de gris, marge blanche autour,
2048 px si possible. Le seuil est a 128 : tout gris devient noir ou blanc.
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter
import potrace

SEUIL = 128


def charge(chemin):
    im = Image.open(chemin).convert("L")
    a = np.asarray(im)
    noir = a < SEUIL
    ys, xs = np.where(noir)
    if len(xs) == 0:
        raise SystemExit(f"{chemin}: image vide")
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    return noir[y0:y1, x0:x1]


def nettoie(noir, taille_min_px):
    """Supprime les miettes isolees plus petites que taille_min_px (ouverture)."""
    im = Image.fromarray((noir * 255).astype("uint8"))
    k = max(3, taille_min_px | 1)
    ouvert = im.filter(ImageFilter.MinFilter(k)).filter(ImageFilter.MaxFilter(k))
    return np.asarray(ouvert) > 0


def trait_le_plus_fin(noir, mm_par_px):
    """Epaisseur minimale significative (mm) des formes noires et des vides blancs
    interieurs : transformee de distance, puis 5e percentile des epaisseurs locales
    sur le squelette (2 x distance au bord), pour ignorer les pointes isolees."""
    import cv2
    from scipy import ndimage

    def epaisseur(mask):
        if mask.sum() < 50:
            return 0.0
        m = mask.astype("uint8")
        dist = cv2.distanceTransform(m, cv2.DIST_L2, 5)
        maxloc = (dist >= ndimage.maximum_filter(dist, size=5) - 1e-6) & (dist > 0)
        valeurs = dist[maxloc] * 2
        return float(np.percentile(valeurs, 5)) * mm_par_px

    h, w = noir.shape
    fond = np.zeros((h + 2, w + 2), dtype="uint8")
    fond[1:-1, 1:-1] = (~noir).astype("uint8")
    etiquettes, _ = ndimage.label(fond)
    vides = (etiquettes[1:-1, 1:-1] != etiquettes[0, 0]) & ~noir
    return epaisseur(noir), epaisseur(vides)


def trace(noir, largeur_mm):
    h, w = noir.shape
    echelle = largeur_mm / w
    bmp = potrace.Bitmap(~noir)  # potracer : 0 = noir
    chemin = bmp.trace(turdsize=int((w / 150) ** 2), turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
                       alphamax=1.0, opticurve=True, opttolerance=1.0)
    f = lambda v: f"{v * echelle:.1f}".rstrip("0").rstrip(".")
    morceaux = []
    n = 0
    for courbe in chemin:
        n += 1
        sx, sy = courbe.start_point.x, courbe.start_point.y
        d = [f"M{f(sx)} {f(sy)}"]
        for seg in courbe:
            ex, ey = seg.end_point.x, seg.end_point.y
            if seg.is_corner:
                cx, cy = seg.c.x, seg.c.y
                d.append(f"L{f(cx)} {f(cy)}L{f(ex)} {f(ey)}")
            else:
                c1x, c1y = seg.c1.x, seg.c1.y
                c2x, c2y = seg.c2.x, seg.c2.y
                d.append(f"C{f(c1x)} {f(c1y)} {f(c2x)} {f(c2y)} {f(ex)} {f(ey)}")
        d.append("Z")
        morceaux.append("".join(d))
    W, H = f(w), f(h)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" fill="currentColor" '
           f'fill-rule="evenodd"><path d="{"".join(morceaux)}"/></svg>\n')
    return svg, n, echelle, W, H


def main():
    sortie = sys.argv[1]
    os.makedirs(sortie, exist_ok=True)
    args = sys.argv[2:]
    print("fichier | viewBox (mm) | contours | octets | trait noir min | vide blanc min")
    for i in range(0, len(args), 3):
        image, nom, largeur = args[i], args[i + 1], float(args[i + 2])
        noir = charge(image)
        noir = nettoie(noir, int(noir.shape[1] / 300))
        svg, n, echelle, W, H = trace(noir, largeur)
        try:
            tn, tb = trait_le_plus_fin(noir, echelle)
        except ImportError:
            tn = tb = float("nan")
        chemin = os.path.join(sortie, nom + ".svg")
        open(chemin, "w").write(svg)
        print(f"{nom}.svg | {W} x {H} | {n} | {len(svg)} | {tn:.1f} mm | {tb:.1f} mm")


if __name__ == "__main__":
    main()
