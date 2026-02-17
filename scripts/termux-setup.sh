#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# Termux + Ubuntu (proot) Setup Script
# ============================================
# Run this in Termux (not inside proot)
# Usage: bash termux-setup.sh
# ============================================

set -e

main() {

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
echo "[4/8] Creating Pi agent files in shared storage..."

REPO_RAW="https://raw.githubusercontent.com/perminder-klair/droidclaw/main"

PI_DIR="$HOME/storage/shared/pi"
mkdir -p "$PI_DIR"

curl -fsSL "$REPO_RAW/pi/MEMORY.md" -o "$PI_DIR/MEMORY.md"
curl -fsSL "$REPO_RAW/pi/SOUL.md" -o "$PI_DIR/SOUL.md"
curl -fsSL "$REPO_RAW/pi/AGENTS.md" -o "$PI_DIR/AGENTS.md"

echo "✅ Agent files created in ~/storage/shared/pi/"
echo "   - AGENTS.md  (overview)"
echo "   - SOUL.md    (persona)"
echo "   - MEMORY.md  (persistent memory)"
echo ""
echo "   📁 Accessible on Android at: Internal Storage > pi"

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
ln -sf /sdcard/pi "$HOME/pi-agent" 2>/dev/null || true
echo "✅ ~/pi-agent symlinked to /sdcard/pi"

echo ""
echo "============================================"
echo "  ✅ Ubuntu setup complete!"
echo "============================================"
'

# ------------------------------------------
# Step 7: Create start-pi launcher script
# ------------------------------------------
echo ""
echo "[7/8] Creating start-pi launcher..."

cat > "$PREFIX/bin/start-pi" << 'STARTEOF'
#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# 🤖 Start Pi Agent
# ============================================
# Logs into proot Ubuntu and launches
# pi-coding-agent from the shared pi directory.
# ============================================

echo "🤖 Starting Pi agent..."
echo ""

proot-distro login ubuntu -- bash -c 'cd /sdcard/pi && pi'
STARTEOF

chmod +x "$PREFIX/bin/start-pi"
echo "✅ start-pi command created"
echo "   Run 'start-pi' from Termux to launch Pi agent"

# ------------------------------------------
# Step 8: Symlink termux-api commands into proot
# ------------------------------------------
echo ""
echo "[8/8] Setting up Termux API access inside proot..."
UBUNTU_ROOT="$PREFIX/var/lib/proot-distro/installed-rootfs/ubuntu"
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
echo "    start-pi"
echo ""
echo "  Or manually:"
echo "    proot-distro login ubuntu"
echo "    cd ~/pi-agent && pi"
echo ""
echo "  Agent files live at:"
echo "    Termux:   ~/storage/shared/pi/"
echo "    Ubuntu:   ~/pi-agent/ (symlink to /sdcard/pi)"
echo "    Android:  Internal Storage > pi"
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
