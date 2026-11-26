#!/usr/bin/env bash
set -euo pipefail
SRC="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DEST="${1:-$HOME/EVOLUTION-SBN-2027}"
cd "$DEST"
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then echo "No es el repositorio Git original."; exit 1; fi
if [[ -n "$(git status --porcelain)" ]]; then echo "Hay cambios pendientes. No se modifico el repositorio."; git status --short; exit 1; fi
if [[ "$SRC" == "$PWD" ]]; then echo "Usa la carpeta descomprimida como origen y tu repositorio original como destino."; exit 1; fi
command -v node >/dev/null || { echo "Instala nodejs en Termux."; exit 1; }
FILES=(
  '.github/workflows/android.yml'
  'ACTUALIZACION-v8.7.md'
  'ACTUALIZACION-v8.8.md'
  'aplicar-v88.sh'
  'app/build.gradle'
  'app/src/main/AndroidManifest.xml'
  'app/src/main/assets/badges57.css'
  'app/src/main/assets/badges57.js'
  'app/src/main/assets/founder54.js'
  'app/src/main/assets/index.html'
  'app/src/main/assets/interface87.css'
  'app/src/main/assets/interface87.js'
  'app/src/main/assets/online41.js'
  'app/src/main/assets/progression60.js'
  'app/src/main/assets/stability88.js'
  'app/src/main/java/com/sbn/evolution/MainActivity.java'
  'health88.js'
  'network71.js'
  'package.json'
  'server.js'
  'tests/evolution-v71.test.js'
  'tests/evolution-v87-server.test.js'
  'tests/evolution-v87.test.js'
  'tests/evolution-v88-server.test.js'
  'tests/evolution-v88.test.js'
)
for f in "${FILES[@]}"; do [[ -f "$SRC/$f" ]] || { echo "Falta $f en el ZIP"; exit 1; }; done
for f in "${FILES[@]}"; do mkdir -p "$(dirname -- "$f")"; cp -- "$SRC/$f" "$f"; done
npm run test:launch
for f in "${FILES[@]}"; do git add -- "$f"; done
if git diff --cached --quiet; then echo "No hay cambios nuevos; se comprobara el push."; else git commit -m "V8.8 - estabilidad y pruebas de lanzamiento"; fi
git push
echo "V8.8 subida. Comprueba GitHub Actions y Render antes de publicar."
