#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# DroidClaw Full Setup Script
# ============================================
# Runs all setup scripts in order:
#   1. pi-setup.sh           — Termux + Ubuntu environment
#   2. ollama-setup.sh      — Ollama + model setup
#   3. skills-setup.sh       — Termux API skills
#
# Usage: bash setup.sh
# ============================================

set -e

REPO_RAW_URL="https://raw.githubusercontent.com/perminder-klair/droidclaw/main/scripts"

# Detect if running from a pipe (curl | bash) or locally
if [ -f "$0" ]; then
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  USE_LOCAL=true
else
  USE_LOCAL=false
fi

run_script() {
  local name="$1"
  if [ "$USE_LOCAL" = true ] && [ -f "$SCRIPT_DIR/$name" ]; then
    bash "$SCRIPT_DIR/$name"
  else
    curl -fsSL "$REPO_RAW_URL/$name" | bash
  fi
}

echo "============================================"
echo "  🚀 DroidClaw Full Setup"
echo "============================================"
echo ""
echo "  This will run:"
echo "    1. Termux + Ubuntu environment setup"
echo "    2. Ollama + model setup"
echo "    3. Termux API skills setup"
echo ""

# ------------------------------------------
# Step 1: Termux + Ubuntu environment
# ------------------------------------------
echo "============================================"
echo "  [1/3] Running pi-setup.sh..."
echo "============================================"
run_script "pi-setup.sh"

# ------------------------------------------
# Step 2: Ollama setup
# ------------------------------------------
echo ""
echo "============================================"
echo "  [2/3] Running ollama-setup.sh..."
echo "============================================"
run_script "ollama-setup.sh"

# ------------------------------------------
# Step 3: Termux API skills
# ------------------------------------------
echo ""
echo "============================================"
echo "  [3/3] Running skills-setup.sh..."
echo "============================================"
run_script "skills-setup.sh"

# ------------------------------------------
# Done
# ------------------------------------------
echo ""
echo "============================================"
echo "  🎉 Full setup complete!"
echo "============================================"
echo ""
echo "  To get started:"
echo ""
echo "  1. Start Ollama in a Termux session:"
echo "       ollama serve"
echo ""
echo "  2. In a SECOND Termux session, start Pi:"
echo "       start-pi"
echo ""
echo "============================================"
