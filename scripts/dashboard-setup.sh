#!/data/data/com.termux/files/usr/bin/bash

# Ruuh Dashboard Extension Setup Script
# Run this in Termux (not inside proot)
# Installs the pi-coding-agent dashboard
# extension for live web-based monitoring.
# Usage: bash dashboard-setup.sh

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
    echo "  Dashboard Extension Setup"
    echo "  Log: $RUUH_LOG"
    echo ""
fi

# Step 1: Check shared storage
step "[1/3]" "Checking shared storage"
if [ ! -d "$RUUH_DIR" ]; then
    step_fail
    echo "  $RUUH_DIR not found. Run ruuh-setup.sh first."
    exit 1
fi
step_done

# Step 2: Create extensions directory
step "[2/3]" "Creating extensions directory"
mkdir -p "$RUUH_DIR/.pi/extensions"
step_done

# Step 3: Install dashboard extension
step "[3/3]" "Installing dashboard extension"
if [ ! -f "$RUUH_DIR/.pi/extensions/dashboard.ts" ]; then
    TMP_DIR=$(mktemp -d)
    {
        curl -fsSL "$REPO_TARBALL" \
            | tar xz -C "$TMP_DIR" --strip-components=2 "ruuh-main/agent"
        cp -a "$TMP_DIR/.pi/extensions/." "$RUUH_DIR/.pi/extensions/"
    } >> "$RUUH_LOG" 2>&1
    rm -rf "$TMP_DIR"
    step_done
else
    step_done "already present"
fi

# Summary
echo ""
echo "  Dashboard installed! Open http://localhost:3000 while ruuh is running."
echo ""

}

# Run main in a function so the entire script is loaded into memory
# before execution. This prevents breakage when pkg upgrade replaces
# bash while the script is still running.
main "$@"
