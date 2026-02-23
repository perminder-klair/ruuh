#!/data/data/com.termux/files/usr/bin/bash

# Termux + Ubuntu (proot) Setup Script
# Run this in Termux (not inside proot)
# Usage: bash ruuh-setup.sh

set -e

main() {

# Source shared config
_conf="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)/config.sh"
if [ -f "$_conf" ]; then
    source "$_conf"
else
    eval "$(curl -fsSL "https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/config.sh")"
fi

if [ "${RUUH_ORCHESTRATED:-}" != "1" ]; then
    echo ""
    echo "  Termux Environment Setup"
    echo "  Log: $RUUH_LOG"
    echo ""
fi

# Step 1: Update Termux packages
export DEBIAN_FRONTEND=noninteractive
run_quiet_eval "[1/8]" "Updating Termux packages" "pkg update -y && pkg upgrade -y -o Dpkg::Options::=\"--force-confnew\""

# Step 2: Install essentials in Termux
run_quiet "[2/8]" "Installing proot-distro, termux-api" pkg install -y proot-distro termux-api

# Step 3: Setup shared storage access
step "[3/8]" "Setting up shared storage"
termux-setup-storage >> "$RUUH_LOG" 2>&1 || true

STORAGE_READY=false
for i in $(seq 1 15); do
    if [ -d "$HOME/storage/shared" ]; then
        STORAGE_READY=true
        break
    fi
    sleep 2
done

if [ "$STORAGE_READY" = true ]; then
    step_done
else
    step_fail
    echo "  Storage not available. Restart Termux after granting permission."
    exit 1
fi

# Step 4: Download agent files to shared storage
step "[4/8]" "Downloading agent files"
mkdir -p "$RUUH_DIR"
TMP_DIR=$(mktemp -d)
{
    curl -fsSL "$REPO_TARBALL" \
        | tar xz -C "$TMP_DIR" --strip-components=2 "ruuh-main/agent"
    cp -a "$TMP_DIR/." "$RUUH_DIR/"
} >> "$RUUH_LOG" 2>&1
rm -rf "$TMP_DIR"
FILE_COUNT=$(find "$RUUH_DIR" -type f | wc -l | tr -d ' ')
step_done "$FILE_COUNT files"

# Step 5: Install Ubuntu via proot-distro
step "[5/8]" "Installing Ubuntu"
if proot-distro login ubuntu -- true 2>/dev/null; then
    step_done "already installed"
else
    proot-distro install ubuntu >> "$RUUH_LOG" 2>&1
    step_done
fi

# Step 6: Setup Ubuntu environment + patch
run_quiet_eval "[6/8]" "Configuring Ubuntu + Node.js + agent" "proot-distro login ubuntu -- bash -c '
set -e
export DEBIAN_FRONTEND=noninteractive
apt update
apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g @mariozechner/pi-coding-agent
ln -sf /sdcard/ruuh \"\$HOME/agent\" 2>/dev/null || true
'"

# Patch pi-coding-agent upstream bugs (quiet)
_patch="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)/patch-pi-agent.sh"
if [ -f "$_patch" ]; then
    proot-distro login ubuntu -- bash < "$_patch" >> "$RUUH_LOG" 2>&1
else
    curl -fsSL "$REPO_RAW/scripts/patch-pi-agent.sh" | proot-distro login ubuntu -- bash >> "$RUUH_LOG" 2>&1
fi

# Step 7: Create ruuh launcher script
step "[7/8]" "Creating ruuh launcher"

cat > "$PREFIX/bin/ruuh" << 'STARTEOF'
#!/data/data/com.termux/files/usr/bin/bash

OLLAMA_PID=""

cleanup() {
  if [ -n "$OLLAMA_PID" ]; then
    kill "$OLLAMA_PID" 2>/dev/null
    wait "$OLLAMA_PID" 2>/dev/null
  fi
}
trap cleanup EXIT

OLLAMA=false
EXTRA_ARGS=()

for arg in "$@"; do
  if [ "$arg" = "--ollama" ]; then
    OLLAMA=true
  else
    EXTRA_ARGS+=("$arg")
  fi
done

if [ "$OLLAMA" = true ]; then
  echo "Starting Ollama server..."
  ollama serve >/dev/null 2>&1 &
  OLLAMA_PID=$!
  for i in $(seq 1 30); do
    curl -s http://localhost:11434/api/tags >/dev/null 2>&1 && break
    [ "$i" -eq 30 ] && echo "Ollama failed to start" && exit 1
    sleep 1
  done
  echo "Ollama ready"
  echo ""
fi

echo "Starting Ruuh agent..."
echo ""
proot-distro login ubuntu -- bash -c "cd /sdcard/ruuh && pi ${EXTRA_ARGS[*]}"
STARTEOF

chmod +x "$PREFIX/bin/ruuh"
step_done

# Step 8: Symlink termux-api commands into proot
step "[8/8]" "Setting up Termux API access"
mkdir -p "$UBUNTU_ROOT/usr/local/bin"

for cmd in "$PREFIX"/bin/termux-*; do
    if [ -f "$cmd" ]; then
        ln -sf "$cmd" "$UBUNTU_ROOT/usr/local/bin/$(basename "$cmd")" 2>/dev/null || true
    fi
done
step_done

# Summary
echo ""
echo "  Setup complete!"
echo "  Get started:  ruuh --ollama"
echo "  Full log:     $RUUH_LOG"
echo ""

}

# Run main in a function so the entire script is loaded into memory
# before execution. This prevents breakage when pkg upgrade replaces
# bash while the script is still running.
main "$@"
