#!/usr/bin/env bash
# CONTROLE DU CONFIGURATEUR AU NAVIGATEUR DE TEST DE L'ATELIER.
#
# A lancer apres un build (dist/ a jour), depuis la racine du depot :
#   (bash scripts/verifie-configurateur.sh > /tmp/verif-configurateur.log 2>&1 &)
#   puis attendre la ligne FINI dans le journal (compter ~6 s par modele).
# Le pont MCP coupe vers 55 s : toujours en tache de fond.
#
# Pour chaque modele de dist/personnaliser/ (ou ceux passes en argument) :
#   - remplit l'inscription guidee (Camille MARTIN, nee DUPONT, 1948 - 2026,
#     une phrase de 51 caracteres), note les tailles choisies et le message
#     "trop long" s'il apparait, et fait une capture ;
#   - sur le premier modele : mise en page "Deux personnes", puis le brouillon
#     (reprise apres rechargement, puis "Tout effacer").
# Sortie : /tmp/verif-configurateur/<modele>.png, planche.jpg, et le journal.
# Lecture rapide : chaque ligne RES doit avoir un message "trop long" vide,
# BROUILLON doit dire "repris=Camille" puis "efface=".
set +H
set -u
RACINE=$(cd "$(dirname "$0")/.." && pwd)
SORTIE=/tmp/verif-configurateur
B=/home/kumo/atelier/bin/browser
PORT=4321
mkdir -p "$SORTIE"
rm -f "$SORTIE"/*.png

if [ $# -gt 0 ]; then MODELES="$*"; else MODELES=$(ls "$RACINE/dist/personnaliser"); fi

cat > "$SORTIE/remplit.js" <<'JS'
(() => {
  const P = window.__P || {};
  const f = (s, v) => { const e = document.querySelector(s); if (!e) return; e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); };
  if (P.couple) { const r = document.querySelector('[data-mise-en-page][value="couple"]'); r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); }
  f('[data-personne="0"] [data-p="prenom"]', "Camille");
  f('[data-personne="0"] [data-p="nom"]', "Martin");
  f('[data-personne="0"] [data-p="nomJeuneFille"]', "Dupont");
  f('[data-personne="0"] [data-p="naissance"]', "1948");
  f('[data-personne="0"] [data-p="deces"]', "2026");
  if (P.couple) {
    f('[data-personne="1"] [data-p="prenom"]', "Jean-Pierre");
    f('[data-personne="1"] [data-p="nom"]', "Martin");
    f('[data-personne="1"] [data-p="naissance"]', "1945");
    f('[data-personne="1"] [data-p="deces"]', "2020");
  }
  f("[data-phrase]", "Ton souvenir restera à jamais gravé dans nos cœurs");
  return document.querySelector("[data-guide-tailles]").textContent + " | trop long: " + document.querySelector("[data-guide-tient]").textContent;
})()
JS
J=$(cat "$SORTIE/remplit.js")

cd "$RACINE/dist" && (nohup python3 -m http.server $PORT --bind 127.0.0.1 > /tmp/verif-http.log 2>&1 &)
sleep 1
$B start | tail -1
$B set viewport 1280 1250 | tail -1

PREMIER=""
for m in $MODELES; do
  [ -z "$PREMIER" ] && PREMIER=$m
  $B open "http://127.0.0.1:$PORT/personnaliser/$m/" > /dev/null
  sleep 3
  $B eval "localStorage.clear()" > /dev/null
  echo "RES $m: $($B eval "window.__P={}; $J" | tail -1)"
  sleep 1
  $B eval "window.scrollTo(0,180)" > /dev/null
  sleep 1
  $B screenshot "$SORTIE/$m.png" > /dev/null
done

# Deux personnes et brouillon, sur le premier modele.
U="http://127.0.0.1:$PORT/personnaliser/$PREMIER/"
$B open "$U" > /dev/null
sleep 3
echo "COUPLE $PREMIER: $($B eval "window.__P={couple:true}; $J" | tail -1)"
sleep 2
$B open "$U" > /dev/null
sleep 3
echo "BROUILLON repris=$($B eval "document.querySelector('[data-personne=\"0\"] [data-p=\"prenom\"]').value" | tail -1)"
$B eval "document.querySelector('[data-brouillon-effacer]').click()" > /dev/null
sleep 3
echo "BROUILLON efface=$($B eval "document.querySelector('[data-personne=\"0\"] [data-p=\"prenom\"]').value" | tail -1)"

$B stop | tail -1
pkill -u "$(id -un)" -f "http.server $PORT" || true

python3 - "$SORTIE" <<'PY'
import glob, sys
from PIL import Image
sortie = sys.argv[1]
fichiers = sorted(glob.glob(f"{sortie}/*.png"))
if fichiers:
    ims = [Image.open(f).convert("RGB") for f in fichiers]
    ims = [im.crop((0, 150, im.size[0] // 2, im.size[1] * 3 // 4)).resize((320, 365)) for im in ims]
    cols = 4
    planche = Image.new("RGB", (320 * cols, 365 * ((len(ims) + cols - 1) // cols)), "white")
    for i, im in enumerate(ims):
        planche.paste(im, ((i % cols) * 320, (i // cols) * 365))
    planche.save(f"{sortie}/planche.jpg", quality=80)
PY
chmod -R o+r "$SORTIE" 2>/dev/null
echo FINI
