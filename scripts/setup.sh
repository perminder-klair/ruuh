#!/data/data/com.termux/files/usr/bin/bash

# Ruuh Full Setup Script
# Runs all setup scripts in order:
#   1. ruuh-setup.sh       — Termux + Ubuntu environment
#   2. ollama-setup.sh     — Ollama + model setup
#   3. skills-setup.sh     — Termux API skills
#
# Usage: bash setup.sh

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

# Tell sub-scripts to skip their own banners
export RUUH_ORCHESTRATED=1

echo ""
echo "  Ruuh Full Setup"
echo "  Log: /tmp/ruuh-setup.log"
echo ""
echo "  This will:"
echo "    1. Update Termux & install Ubuntu (proot)"
echo "    2. Install Node.js 22 & pi-coding-agent"
echo "    3. Optionally install Ollama + model"
echo "    4. Optionally install Termux API skills"
echo ""
read -p "  Continue? [Y/n] " confirm < /dev/tty
if [ "$confirm" = "n" ] || [ "$confirm" = "N" ]; then
  echo "  Aborted."
  exit 0
fi

echo ""

# Step 1: Termux + Ubuntu environment
run_script "ruuh-setup.sh"

# Step 2: Ollama setup (optional)
echo ""
read -p "  Install Ollama + model? [Y/n] " ollama_choice < /dev/tty
if [ "$ollama_choice" != "n" ] && [ "$ollama_choice" != "N" ]; then
  echo ""
  run_script "ollama-setup.sh"
else
  echo "  Skipping Ollama setup."
fi

# Step 3: Termux API skills (optional)
echo ""
echo "  Requires the Termux:API app: https://f-droid.org/en/packages/com.termux.api/"
read -p "  Install Termux API skills? [Y/n] " skills_choice < /dev/tty
if [ "$skills_choice" != "n" ] && [ "$skills_choice" != "N" ]; then
  echo ""
  run_script "skills-setup.sh"
else
  echo "  Skipping skills setup."
fi

# Summary
echo ""
echo "  Setup complete!"
echo "  Get started:  ruuh --ollama"
echo "  Dashboard:    http://localhost:3000"
echo "  Full log:     /tmp/ruuh-setup.log"
echo ""
