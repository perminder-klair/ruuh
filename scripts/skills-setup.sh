#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# Termux API Skills Setup Script
# ============================================
# Run this in Termux (not inside proot)
# Installs pi-coding-agent skill files that
# teach the agent how to use Termux API commands.
# Usage: bash skills-setup.sh
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
echo "  📱 Termux API Skills Setup"
echo "============================================"

# ------------------------------------------
# Step 1: Check shared storage is accessible
# ------------------------------------------
echo ""
echo "[1/4] Checking shared storage..."

if [ ! -d "$RUUH_DIR" ]; then
    echo "❌ $RUUH_DIR not found."
    echo "   Run ruuh-setup.sh first to set up the environment."
    exit 1
fi

echo "✅ Shared storage accessible at $RUUH_DIR"

# ------------------------------------------
# Step 2: Create skill directories
# ------------------------------------------
echo ""
echo "[2/4] Creating skill directories..."

mkdir -p "$RUUH_DIR/.pi/skills/termux-device"
mkdir -p "$RUUH_DIR/.pi/skills/termux-comms"
mkdir -p "$RUUH_DIR/.pi/skills/termux-system"

echo "✅ Skill directories created"

# ------------------------------------------
# Step 3: Install skill files (skip if present)
# ------------------------------------------
echo ""
echo "[3/4] Checking skill files..."

SKILLS_MISSING=0
for skill in termux-device termux-comms termux-system; do
    if [ ! -f "$RUUH_DIR/.pi/skills/$skill/SKILL.md" ]; then
        SKILLS_MISSING=1
        break
    fi
done

if [ "$SKILLS_MISSING" -eq 1 ]; then
    echo "   Downloading skill files..."
    TMP_DIR=$(mktemp -d)
    curl -fsSL "$REPO_TARBALL" \
        | tar xz -C "$TMP_DIR" --strip-components=2 "ruuh-main/agent"
    cp -a "$TMP_DIR/.pi/skills/." "$RUUH_DIR/.pi/skills/"
    rm -rf "$TMP_DIR"
    echo "   ✅ Skill files downloaded and installed"
else
    echo "   ✅ Skill files already present (installed by ruuh-setup.sh)"
fi

# ------------------------------------------
# Step 4: Verify installation
# ------------------------------------------
echo ""
echo "[4/4] Verifying installation..."

SKILL_COUNT=$(ls -d "$RUUH_DIR/.pi/skills"/*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
echo "✅ $SKILL_COUNT skill files installed"

# ------------------------------------------
# Done
# ------------------------------------------
echo ""
echo "============================================"
echo "  🎉 Skills installed!"
echo "============================================"
echo ""
echo "  Installed skills:"
echo "    termux-device  — battery, sensors, location, UI"
echo "    termux-comms   — SMS, camera, audio, sharing"
echo "    termux-system  — scheduling, IR, USB, NFC, keystore"
echo ""
echo "  Skill files live at:"
echo "    Termux:   ~/storage/shared/ruuh/.pi/skills/"
echo "    Android:  Internal Storage > ruuh > .pi > skills"
echo "    Proot:    /sdcard/ruuh/.pi/skills/"
echo ""
echo "  The agent will auto-discover these skills"
echo "  next time you run: ruuh"
echo ""
echo "  💡 Want a live web dashboard?"
echo "     Run: bash dashboard-setup.sh"
echo "============================================"

}

# Run main in a function so the entire script is loaded into memory
# before execution. This prevents breakage when pkg upgrade replaces
# bash while the script is still running.
main "$@"
