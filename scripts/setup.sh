#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# Ruuh Full Setup Script
# ============================================
# Runs all setup scripts in order:
#   1. ruuh-setup.sh           — Termux + Ubuntu environment
#   2. ollama-setup.sh      — Ollama + model setup
#   3. skills-setup.sh       — Termux API skills
#
# Usage: bash setup.sh
# ============================================

set -e

REPO_RAW_URL="https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts"

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
echo "  🚀 Ruuh Full Setup"
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
echo "  [1/3] Running ruuh-setup.sh..."
echo "============================================"
run_script "ruuh-setup.sh"

# ------------------------------------------
# Step 2: Ollama setup (optional)
# ------------------------------------------
echo ""
read -p "  Install Ollama + model? [Y/n] " ollama_choice < /dev/tty
if [ "$ollama_choice" != "n" ] && [ "$ollama_choice" != "N" ]; then
  echo "============================================"
  echo "  [2/3] Running ollama-setup.sh..."
  echo "============================================"
  run_script "ollama-setup.sh"
else
  echo "  Skipping Ollama setup."
fi

# ------------------------------------------
# Step 3: Termux API skills (optional)
# ------------------------------------------
echo ""
read -p "  Install Termux API skills? [Y/n] " skills_choice < /dev/tty
if [ "$skills_choice" != "n" ] && [ "$skills_choice" != "N" ]; then
  echo "============================================"
  echo "  [3/3] Running skills-setup.sh..."
  echo "============================================"
  run_script "skills-setup.sh"
else
  echo "  Skipping skills setup."
fi

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
echo "    ruuh --ollama"
echo ""
echo "  This starts Ollama and the agent in one session."
echo "  Ollama stops automatically when you exit."
echo ""
echo "  Or without Ollama:  ruuh"
echo ""
echo "  Web dashboard: http://localhost:3000"
echo "  Open in your device browser while Ruuh is running."
echo ""
echo "============================================"
