#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# Termux API Skills Setup Script
# ============================================
# Run this in Termux (not inside proot)
# Installs pi-coding-agent skill files that
# teach the agent how to use Termux API commands.
# Usage: bash termux-skills-setup.sh
# ============================================

set -e

main() {

echo "============================================"
echo "  📱 Termux API Skills Setup"
echo "============================================"

REPO_RAW="https://raw.githubusercontent.com/perminder-klair/droidclaw/main"
PI_DIR="$HOME/storage/shared/pi"

# ------------------------------------------
# Step 1: Check shared storage is accessible
# ------------------------------------------
echo ""
echo "[1/4] Checking shared storage..."

if [ ! -d "$PI_DIR" ]; then
    echo "❌ $PI_DIR not found."
    echo "   Run termux-setup.sh first to set up the environment."
    exit 1
fi

echo "✅ Shared storage accessible at $PI_DIR"

# ------------------------------------------
# Step 2: Create skill directories
# ------------------------------------------
echo ""
echo "[2/4] Creating skill directories..."

mkdir -p "$PI_DIR/.pi/skills/termux-device"
mkdir -p "$PI_DIR/.pi/skills/termux-comms"
mkdir -p "$PI_DIR/.pi/skills/termux-system"

echo "✅ Skill directories created"

# ------------------------------------------
# Step 3: Download skill files
# ------------------------------------------
echo ""
echo "[3/4] Downloading skill files..."

curl -fsSL "$REPO_RAW/pi/.pi/skills/termux-device/SKILL.md" \
    -o "$PI_DIR/.pi/skills/termux-device/SKILL.md"
echo "   ✅ termux-device skill installed"

curl -fsSL "$REPO_RAW/pi/.pi/skills/termux-comms/SKILL.md" \
    -o "$PI_DIR/.pi/skills/termux-comms/SKILL.md"
echo "   ✅ termux-comms skill installed"

curl -fsSL "$REPO_RAW/pi/.pi/skills/termux-system/SKILL.md" \
    -o "$PI_DIR/.pi/skills/termux-system/SKILL.md"
echo "   ✅ termux-system skill installed"

# ------------------------------------------
# Step 4: Verify installation
# ------------------------------------------
echo ""
echo "[4/4] Verifying installation..."

SKILL_COUNT=$(ls -d "$PI_DIR/.pi/skills"/*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
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
echo "    Termux:   ~/storage/shared/pi/.pi/skills/"
echo "    Android:  Internal Storage > pi > .pi > skills"
echo "    Proot:    /sdcard/pi/.pi/skills/"
echo ""
echo "  The agent will auto-discover these skills"
echo "  next time you run: start-pi"
echo "============================================"

}

# Run main in a function so the entire script is loaded into memory
# before execution. This prevents breakage when pkg upgrade replaces
# bash while the script is still running.
main "$@"
