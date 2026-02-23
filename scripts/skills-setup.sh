#!/data/data/com.termux/files/usr/bin/bash

# Termux API Skills Setup Script
# Run this in Termux (not inside proot)
# Installs pi-coding-agent skill files that
# teach the agent how to use Termux API commands.
# Usage: bash skills-setup.sh

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
    echo "  Termux API Skills Setup"
    echo "  Log: $RUUH_LOG"
    echo ""
fi

# Step 1: Check shared storage
step "[1/4]" "Checking shared storage"
if [ ! -d "$RUUH_DIR" ]; then
    step_fail
    echo "  $RUUH_DIR not found. Run ruuh-setup.sh first."
    exit 1
fi
step_done

# Step 2: Create skill directories
step "[2/4]" "Creating skill directories"
mkdir -p "$RUUH_DIR/.pi/skills/termux-device"
mkdir -p "$RUUH_DIR/.pi/skills/termux-comms"
mkdir -p "$RUUH_DIR/.pi/skills/termux-system"
step_done

# Step 3: Install skill files
step "[3/4]" "Installing skill files"
SKILLS_MISSING=0
for skill in termux-device termux-comms termux-system; do
    if [ ! -f "$RUUH_DIR/.pi/skills/$skill/SKILL.md" ]; then
        SKILLS_MISSING=1
        break
    fi
done

if [ "$SKILLS_MISSING" -eq 1 ]; then
    TMP_DIR=$(mktemp -d)
    {
        curl -fsSL "$REPO_TARBALL" \
            | tar xz -C "$TMP_DIR" --strip-components=2 "ruuh-main/agent"
        cp -a "$TMP_DIR/.pi/skills/." "$RUUH_DIR/.pi/skills/"
    } >> "$RUUH_LOG" 2>&1
    rm -rf "$TMP_DIR"
    step_done
else
    step_done "already present"
fi

# Step 4: Verify installation
step "[4/4]" "Verifying installation"
SKILL_COUNT=$(ls -d "$RUUH_DIR/.pi/skills"/*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
step_done "$SKILL_COUNT skills"

# Summary
echo ""
echo "  Skills installed! They'll be auto-discovered next time you run: ruuh"
echo ""

}

# Run main in a function so the entire script is loaded into memory
# before execution. This prevents breakage when pkg upgrade replaces
# bash while the script is still running.
main "$@"
