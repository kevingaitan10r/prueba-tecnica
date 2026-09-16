#!/usr/bin/env bash
# ==============================================================================
# Lanzador Oficial: UNIMINUTO VirtuXperience 3D
# Virtual Experience Engineering SAS & UNIMINUTO Virtual 2026
# ==============================================================================

set -e
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "======================================================================"
echo "   UNIMINUTO VirtuXperience 3D - Virtual Experience Engineering SAS   "
echo "   Iniciando Entorno Virtual Inmersivo y Adaptativo (DUA)              "
echo "======================================================================"

# Verificar dependencias instaladas
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependencias necesarias (Three.js, Vite, Electron)..."
  npm install
fi

# Compilar build de producción
echo "⚡ Compilando experiencia inmersiva..."
npm run build

echo "🚀 Iniciando Ejecutable de Escritorio de Virtual Experience Engineering SAS..."
npx electron .

echo "Sesión de VirtuXperience finalizada con éxito."
