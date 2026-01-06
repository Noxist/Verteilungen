#!/usr/bin/env bash
set -euo pipefail

# build_and_deploy.sh
# Erstellt einen docs/-Ordner für GitHub Pages oder pusht auf gh-pages.
# Nutzung:
#   ./build_and_deploy.sh docs   # kopiert Dateien nach docs/ (für Pages "main" + docs)
#   ./build_and_deploy.sh branch # erstellt/aktualisiert gh-pages-Branch

MODE=${1:-docs}
ROOT_DIR=$(dirname "$0")
FILES=(index.html style.css app.js content.js README.md)

if [[ "$MODE" == "docs" ]]; then
  rm -rf "$ROOT_DIR/docs"
  mkdir -p "$ROOT_DIR/docs"
  for f in "${FILES[@]}"; do
    cp "$ROOT_DIR/$f" "$ROOT_DIR/docs/"
  done
  echo "Docs-Modus: Dateien in docs/ kopiert. Committe und pushe main-Branch, stelle Pages auf docs/ um."
elif [[ "$MODE" == "branch" ]]; then
  TMP_DIR=$(mktemp -d)
  trap 'rm -rf "$TMP_DIR"' EXIT
  cp "${FILES[@]}" "$TMP_DIR/"
  pushd "$TMP_DIR" >/dev/null
  git init -b gh-pages
  git add .
  git commit -m "Deploy to gh-pages"
  git remote add origin "$(git -C "$ROOT_DIR" remote get-url origin)"
  git push -f origin gh-pages
  popd >/dev/null
  echo "Branch-Modus: gh-pages aktualisiert."
else
  echo "Unbekannter Modus: $MODE" >&2
  exit 1
fi
