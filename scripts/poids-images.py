#!/usr/bin/env python3
"""Le poids des images du site, et ce que chaque page charge au premier ecran.

Usage, apres un build : python3 scripts/poids-images.py
Sortie : par dossier (modeles, matieres, motifs), le nombre de fichiers et le
poids ; les 1200 px les plus lourds ; puis, pour quelques pages types, le poids
des images chargees sans lazy (celles qui pesent sur le premier affichage).
Repere : une image 1200 px au-dela de 200 Ko merite un reglage de qualite
(scripts/images-modeles.py, `qualite`).
"""
import os, re, sys

RACINE = os.path.join(os.path.dirname(__file__), "..")
PUBLIC = os.path.join(RACINE, "public")
DIST = os.path.join(RACINE, "dist")

def ko(octets): return f"{octets / 1024:.0f} Ko"

def dossier(chemin):
    total, n, fichiers = 0, 0, []
    for racine, _, noms in os.walk(chemin):
        for nom in noms:
            p = os.path.join(racine, nom); t = os.path.getsize(p)
            total += t; n += 1; fichiers.append((t, os.path.relpath(p, PUBLIC)))
    return total, n, sorted(fichiers, reverse=True)

print("== Dossiers")
tous = []
for d in ("images/modeles", "images/matieres", "motifs"):
    total, n, fichiers = dossier(os.path.join(PUBLIC, d))
    tous += fichiers
    print(f"{d:18s} {n:4d} fichiers  {total / 1024 / 1024:.1f} Mo")
print("\n== 1200 px les plus lourds")
for t, p in [f for f in tous if "-1200." in f[1]][:8]:
    print(f"{ko(t):>8s}  {p}")
lourds = [f for f in tous if "-1200." in f[1] and f[0] > 200 * 1024]
print(f"\n{len(lourds)} images 1200 px au-dela de 200 Ko")

if not os.path.isdir(DIST):
    sys.exit("\n(pas de dist/ : lancer npm run build pour la partie pages)")
print("\n== Premier ecran par page (images sans loading=lazy)")
pages = ["index.html", "monuments-funeraires/index.html", "monuments-funeraires/douceur/index.html",
         "personnaliser/douceur/index.html", "nos-granits/index.html", "devis/index.html"]
for page in pages:
    chemin = os.path.join(DIST, page)
    if not os.path.exists(chemin): continue
    html = open(chemin, encoding="utf-8").read()
    imgs = re.findall(r"<img[^>]*>", html)
    eager = [i for i in imgs if 'loading="lazy"' not in i]
    poids = 0
    for i in eager:
        m = re.search(r'src="(/[^"]+\.(?:webp|png|jpg|svg))"', i)
        if m:
            f = os.path.join(PUBLIC, m.group(1).lstrip("/"))
            if os.path.exists(f): poids += os.path.getsize(f)
    print(f"{page:44s} {len(imgs):3d} img, {len(eager):2d} au premier ecran, {ko(poids)} (src seul)")
