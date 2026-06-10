#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "✏️  Actualizando 'name' en package.json..."
sed -i 's/"name": "nextjs"/"name": "ministerio-renuevo-landing"/' package.json

echo "🧹  Eliminando líneas redundantes 28 y 29 de .gitignore (ya cubiertas por .env* en línea 37)..."
sed -i '28,29d' .gitignore

echo "✅  Listo. Cambios aplicados:"
echo "    - package.json → name: ministerio-renuevo-landing"
echo "    - .gitignore   → líneas 28-29 eliminadas"
