#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# Ruuh Dashboard Extension Setup Script
# ============================================
# Run this in Termux (not inside proot)
# Installs the pi-coding-agent dashboard
# extension for live web-based monitoring.
# Usage: bash dashboard-setup.sh
# ============================================

set -e

main() {

# Source shared config
_conf="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)/config.sh"
if [ -f "$_conf" ]; then
    source "$_conf"
else
    eval "$(curl -fsSL "https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/config.sh")"
fi

echo "============================================"
echo "  📊 Ruuh Dashboard Extension Setup"
echo "============================================"

# ------------------------------------------
# Step 1: Check shared storage is accessible
# ------------------------------------------
echo ""
echo "[1/3] Checking shared storage..."

if [ ! -d "$RUUH_DIR" ]; then
    echo "❌ $RUUH_DIR not found."
    echo "   Run ruuh-setup.sh first to set up the environment."
    exit 1
fi

echo "✅ Shared storage accessible at $RUUH_DIR"

# ------------------------------------------
# Step 2: Create extensions directory
# ------------------------------------------
echo ""
echo "[2/3] Creating extensions directory..."

mkdir -p "$RUUH_DIR/.pi/extensions"

echo "✅ Extensions directory created"

# ------------------------------------------
# Step 3: Install dashboard extension (skip if present)
# ------------------------------------------
echo ""
echo "[3/3] Checking dashboard extension..."

if [ ! -f "$RUUH_DIR/.pi/extensions/dashboard.ts" ]; then
    echo "   Downloading dashboard extension..."
    TMP_DIR=$(mktemp -d)
    curl -fsSL "$REPO_TARBALL" \
        | tar xz -C "$TMP_DIR" --strip-components=2 "ruuh-main/agent"
    cp -a "$TMP_DIR/.pi/extensions/." "$RUUH_DIR/.pi/extensions/"
    rm -rf "$TMP_DIR"
    echo "   ✅ dashboard.ts downloaded and installed"
else
    echo "   ✅ dashboard.ts already present (installed by ruuh-setup.sh)"
fi

# ------------------------------------------
# Done
# ------------------------------------------
echo ""
echo "============================================"
echo "  🎉 Dashboard extension installed!"
echo "============================================"
echo ""
echo "  The dashboard starts automatically when"
echo "  you run: ruuh"
echo ""
echo "  Once running, open Chrome on your phone:"
echo "    http://localhost:3000"
echo ""
echo "  Tip: In Chrome, tap ⋮ > 'Add to Home Screen'"
echo "  for an app-like experience."
echo ""
echo "  Or from another device on the same WiFi,"
echo "  use the IP shown in Ruuh's status bar."
echo ""
echo "  Extension file:"
echo "    Termux:   ~/storage/shared/ruuh/.pi/extensions/"
echo "    Android:  Internal Storage > ruuh > .pi > extensions"
echo "    Proot:    /sdcard/ruuh/.pi/extensions/"
echo ""
echo "  The agent will auto-discover this extension"
echo "  next time you run: ruuh"
echo "============================================"

}

# Run main in a function so the entire script is loaded into memory
# before execution. This prevents breakage when pkg upgrade replaces
# bash while the script is still running.
main "$@"
