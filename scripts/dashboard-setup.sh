#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# Pi Dashboard Extension Setup Script
# ============================================
# Run this in Termux (not inside proot)
# Installs the pi-coding-agent dashboard
# extension for live web-based monitoring.
# Usage: bash dashboard-setup.sh
# ============================================

set -e

main() {

echo "============================================"
echo "  📊 Pi Dashboard Extension Setup"
echo "============================================"

REPO_RAW="https://raw.githubusercontent.com/perminder-klair/droidclaw/main"
PI_DIR="$HOME/storage/shared/pi"

# ------------------------------------------
# Step 1: Check shared storage is accessible
# ------------------------------------------
echo ""
echo "[1/3] Checking shared storage..."

if [ ! -d "$PI_DIR" ]; then
    echo "❌ $PI_DIR not found."
    echo "   Run termux-setup.sh first to set up the environment."
    exit 1
fi

echo "✅ Shared storage accessible at $PI_DIR"

# ------------------------------------------
# Step 2: Create extensions directory
# ------------------------------------------
echo ""
echo "[2/3] Creating extensions directory..."

mkdir -p "$PI_DIR/.pi/extensions"

echo "✅ Extensions directory created"

# ------------------------------------------
# Step 3: Download dashboard extension
# ------------------------------------------
echo ""
echo "[3/3] Downloading dashboard extension..."

curl -fsSL "$REPO_RAW/pi/.pi/extensions/dashboard.ts" \
    -o "$PI_DIR/.pi/extensions/dashboard.ts"
echo "   ✅ dashboard.ts installed"

# ------------------------------------------
# Done
# ------------------------------------------
echo ""
echo "============================================"
echo "  🎉 Dashboard extension installed!"
echo "============================================"
echo ""
echo "  The dashboard starts automatically when"
echo "  you run: start-pi"
echo ""
echo "  Once running, open Chrome on your phone:"
echo "    http://localhost:3000"
echo ""
echo "  Or from another device on the same WiFi,"
echo "  use the IP shown in Pi's status bar."
echo ""
echo "  Extension file:"
echo "    Termux:   ~/storage/shared/pi/.pi/extensions/"
echo "    Android:  Internal Storage > pi > .pi > extensions"
echo "    Proot:    /sdcard/pi/.pi/extensions/"
echo ""
echo "  The agent will auto-discover this extension"
echo "  next time you run: start-pi"
echo "============================================"

}

# Run main in a function so the entire script is loaded into memory
# before execution. This prevents breakage when pkg upgrade replaces
# bash while the script is still running.
main "$@"
