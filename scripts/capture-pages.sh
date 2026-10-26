#!/usr/bin/env bash
# Usage : capture.sh <prefixe> <chemin1> [chemin2 ...]
# Sert dist/ sur 127.0.0.1:4321, prend une capture PLEINE PAGE 1280 et 390 par chemin.
# Sortie : /tmp/pt-design/<prefixe>-<nom>-<largeur>.png ; la ligne FINI marque la fin.
set +H
set -u
R=/home/kumo/atelier/repos/pierretombale-site
B=/home/kumo/atelier/bin/browser
OUT=/tmp/pt-design
PORT=4321
PREF=$1; shift
pkill -u "$(id -un)" -f "http.server $PORT" >/dev/null 2>&1 || true
cd "$R/dist" && (nohup python3 -m http.server $PORT --bind 127.0.0.1 > /tmp/pt-design/http.log 2>&1 &)
sleep 1
$B start | tail -1
for p in "$@"; do
  nom=$(echo "$p" | tr '/' '_' | sed 's/^_//; s/_$//'); [ -z "$nom" ] && nom=accueil
  for w in 1280 390; do
    $B set viewport $w 900 | tail -1
    $B open "http://127.0.0.1:$PORT$p" > /dev/null
    sleep 1
    H=$($B eval "document.documentElement.scrollHeight" | tail -1 | tr -dc '0-9')
    [ -z "$H" ] && H=900
    [ "$H" -gt 6000 ] && H=6000
    $B set viewport $w $H | tail -1
    sleep 1
    $B screenshot "$OUT/$PREF-$nom-$w.png" | tail -1
    echo "HAUTEUR $nom $w = $H"
  done
done
$B stop | tail -1
pkill -u "$(id -un)" -f "http.server $PORT" || true
chmod a+r $OUT/*.png
echo FINI
