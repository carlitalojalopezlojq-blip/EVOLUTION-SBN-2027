#!/usr/bin/env bash
set -euo pipefail
SRC="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DEST="${1:-$HOME/EVOLUTION-SBN-2027}"
cd "$DEST"
git rev-parse --is-inside-work-tree >/dev/null
if [[ "$SRC" == "$PWD" ]]; then echo "El origen no puede ser el repositorio original."; exit 1; fi
if [[ -n "$(git status --porcelain)" ]]; then echo "Hay cambios pendientes; no se modifico nada."; git status --short; exit 1; fi
command -v node >/dev/null || { echo "Instala nodejs."; exit 1; }
FILES=(
  app/build.gradle
  app/src/main/AndroidManifest.xml
  app/src/main/assets/index.html
  app/src/main/assets/pareja.jpg
  app/src/main/java/com/sbn/evolution/MainActivity.java
  app/src/main/res/drawable-nodpi/icono_reyes.png
  app/src/main/res/drawable-nodpi/logo_pareja.jpg
  app/src/main/res/values-v31/arena_theme.xml
  scripts/icono-reyes.svg
  ACTUALIZACION-v8.9.md
  ACTUALIZACION-v8.9.1.md
  aplicar-v891.sh
)
for f in "${FILES[@]}"; do [[ -f "$SRC/$f" ]] || { echo "Falta $f"; exit 1; }; done
(cd "$SRC" && npm run test:launch)
for f in "${FILES[@]}"; do mkdir -p "$(dirname -- "$f")"; cp -- "$SRC/$f" "$f"; done
for f in "${FILES[@]}"; do git add -- "$f"; done
if ! git diff --cached --quiet; then git commit -m "V8.9.1 - icono de los reyes y foto de carga"; fi
git push
echo "V8.9.1 subida. Descarga el nuevo APK desde GitHub Actions."
