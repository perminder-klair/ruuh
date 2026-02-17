#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# DroidClaw Full Setup Script
# ============================================
# Runs all setup scripts in order:
#   1. termux-setup.sh      — Termux + Ubuntu environment
#   2. ollama-setup.sh      — Ollama + model setup
#   3. termux-skills-setup.sh — Termux API skills
#
# Usage: bash setup.sh
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

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
echo "  [1/3] Running termux-setup.sh..."
echo "============================================"
bash "$SCRIPT_DIR/termux-setup.sh"

# ------------------------------------------
# Step 2: Ollama setup
# ------------------------------------------
echo ""
echo "============================================"
echo "  [2/3] Running ollama-setup.sh..."
echo "============================================"
bash "$SCRIPT_DIR/ollama-setup.sh"

# ------------------------------------------
# Step 3: Termux API skills
# ------------------------------------------
echo ""
echo "============================================"
echo "  [3/3] Running termux-skills-setup.sh..."
echo "============================================"
bash "$SCRIPT_DIR/termux-skills-setup.sh"

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
