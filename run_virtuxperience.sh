#!/usr/bin/env bash
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "=== UNIMINUTO VirtuXperience 3D ==="

if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias..."
  npm install
fi

echo "Compilando paquete de produccion..."
npm run build

echo "Iniciando aplicacion de escritorio..."
npx electron .
