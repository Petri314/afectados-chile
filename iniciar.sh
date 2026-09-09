#!/bin/bash
# ============================================================
# 🌍 Afectados Chile - Iniciar servidor
# ============================================================

PORT=8080
DIR="$(cd "$(dirname "$0")" && pwd)"

# Matar procesos previos en el puerto
pkill -f "node.*server.js" 2>/dev/null || true
sleep 0.5

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  🌍 AFECTADOS CHILE                  ║"
echo "║  Iniciando servidor...               ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "  🌐  http://localhost:$PORT"
echo "  📁  $DIR"
echo ""
echo "  Para detener: Ctrl+C"
echo ""

cd "$DIR"
node server.js