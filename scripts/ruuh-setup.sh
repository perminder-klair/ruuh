#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# Termux + Ubuntu (proot) Setup Script
# ============================================
# Run this in Termux (not inside proot)
# Usage: bash ruuh-setup.sh
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
echo "  📱 Termux Environment Setup"
echo "============================================"

# ------------------------------------------
# Step 1: Update Termux packages
# ------------------------------------------
echo ""
echo "[1/8] Updating Termux packages..."
export DEBIAN_FRONTEND=noninteractive
pkg update -y && pkg upgrade -y -o Dpkg::Options::="--force-confnew"

# ------------------------------------------
# Step 2: Install essentials in Termux
# ------------------------------------------
echo ""
echo "[2/8] Installing Termux essentials..."
pkg install -y proot-distro termux-api

# ------------------------------------------
# Step 3: Setup shared storage access
# ------------------------------------------
echo ""
echo "[3/8] Setting up shared storage access..."
echo "⚠️  You may need to grant storage permission when prompted"
termux-setup-storage || echo "⚠️  Storage setup may need manual permission grant"
sleep 2

if [ -d "$HOME/storage/shared" ]; then
    echo "✅ Shared storage accessible at ~/storage/"
else
    echo "⚠️  Storage not yet available. You may need to restart Termux after granting permission."
    echo "   Re-run this script after granting permission."
    exit 1
fi

# ------------------------------------------
# Step 4: Create agent files in shared storage
# ------------------------------------------
echo ""
echo "[4/8] Creating Ruuh agent files in shared storage..."

mkdir -p "$RUUH_DIR"

curl -fsSL "$REPO_RAW/agent/MEMORY.md" -o "$RUUH_DIR/MEMORY.md"
curl -fsSL "$REPO_RAW/agent/SOUL.md" -o "$RUUH_DIR/SOUL.md"
curl -fsSL "$REPO_RAW/agent/AGENTS.md" -o "$RUUH_DIR/AGENTS.md"

echo "✅ Agent files created in ~/storage/shared/ruuh/"
echo "   - AGENTS.md  (overview)"
echo "   - SOUL.md    (persona)"
echo "   - MEMORY.md  (persistent memory)"
echo ""
echo "   📁 Accessible on Android at: Internal Storage > ruuh"

# ------------------------------------------
# Step 5: Install Ubuntu via proot-distro
# ------------------------------------------
echo ""
echo "[5/8] Installing Ubuntu..."
if proot-distro list | grep -q "ubuntu.*Installed"; then
    echo "✅ Ubuntu already installed, skipping..."
else
    proot-distro install ubuntu
fi

# ------------------------------------------
# Step 6: Setup Ubuntu environment
# ------------------------------------------
echo ""
echo "[6/8] Configuring Ubuntu environment..."

proot-distro login ubuntu -- bash -c '
set -e

echo "============================================"
echo "  🐧 Ubuntu Environment Setup"
echo "============================================"

# Update system
echo ""
echo "[1/5] Updating Ubuntu packages..."
export DEBIAN_FRONTEND=noninteractive
apt update && apt upgrade -y -o Dpkg::Options::="--force-confnew"

# Install essentials
echo ""
echo "[2/5] Installing curl and git..."
apt install -y curl git build-essential

# Install Node.js 22
echo ""
echo "[3/5] Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Verify installations
echo ""
echo "[4/5] Verifying installations..."
echo "  Node.js: $(node -v)"
echo "  npm:     $(npm -v)"
echo "  git:     $(git --version)"

# Install pi-coding-agent
echo ""
echo "[5/5] Installing pi-coding-agent..."
npm install -g @mariozechner/pi-coding-agent

# Symlink shared pi directory into Ubuntu home for convenience
# Note: /sdcard/ruuh and "agent" must match SDCARD_DIR and AGENT_SYMLINK_NAME in config.sh
ln -sf /sdcard/ruuh "$HOME/agent" 2>/dev/null || true
echo "✅ ~/agent symlinked to /sdcard/ruuh"

echo ""
echo "============================================"
echo "  ✅ Ubuntu setup complete!"
echo "============================================"
'

# ------------------------------------------
# Step 7: Create ruuh launcher script
# ------------------------------------------
echo ""
echo "[7/8] Creating ruuh launcher..."

cat > "$PREFIX/bin/ruuh" << STARTEOF
#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# 🤖 Start Ruuh Agent
# ============================================
# Logs into proot Ubuntu and launches
# pi-coding-agent from the shared pi directory.
# ============================================

echo "🤖 Starting Ruuh agent..."
echo ""

proot-distro login ubuntu -- bash -c 'cd $SDCARD_DIR && pi'
STARTEOF

chmod +x "$PREFIX/bin/ruuh"
echo "✅ ruuh command created"
echo "   Run 'ruuh' from Termux to launch Ruuh agent"

# ------------------------------------------
# Step 8: Symlink termux-api commands into proot
# ------------------------------------------
echo ""
echo "[8/8] Setting up Termux API access inside proot..."
mkdir -p "$UBUNTU_ROOT/usr/local/bin"

for cmd in "$PREFIX"/bin/termux-*; do
    if [ -f "$cmd" ]; then
        ln -sf "$cmd" "$UBUNTU_ROOT/usr/local/bin/$(basename "$cmd")" 2>/dev/null || true
    fi
done
echo "✅ Termux API commands symlinked"

# ------------------------------------------
# Done
# ------------------------------------------
echo ""
echo "============================================"
echo "  🎉 All done!"
echo "============================================"
echo ""
echo "  🚀 Quick start:"
echo "    ruuh"
echo ""
echo "  Or manually:"
echo "    proot-distro login ubuntu"
echo "    cd ~/agent && pi"
echo ""
echo "  Agent files live at:"
echo "    Termux:   ~/storage/shared/ruuh/"
echo "    Ubuntu:   ~/agent/ (symlink to /sdcard/ruuh)"
echo "    Android:  Internal Storage > ruuh"
echo ""
echo "  You can edit AGENTS.md, SOUL.md, and"
echo "  MEMORY.md from any Android text editor!"
echo ""
echo "  Storage locations:"
echo "    ~/storage/downloads/  → Android Downloads"
echo "    ~/storage/shared/     → Internal storage"
echo "    /sdcard/              → Internal storage (inside proot)"
echo ""
echo "  Termux API commands are available inside"
echo "  proot (e.g. termux-battery-status)"
echo "============================================"

}

# Run main in a function so the entire script is loaded into memory
# before execution. This prevents breakage when pkg upgrade replaces
# bash while the script is still running.
main "$@"
