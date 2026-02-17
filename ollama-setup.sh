#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# Ollama Setup Script for Termux
# ============================================
# Run this in Termux AFTER termux-setup.sh
# Usage: bash ollama-setup.sh
# ============================================

set -e

main() {

echo "============================================"
echo "  🦙 Ollama Setup for Pi Agent"
echo "============================================"

# ------------------------------------------
# Step 1: Install Ollama
# ------------------------------------------
echo ""
echo "[1/4] Installing Ollama..."
pkg install -y ollama

# ------------------------------------------
# Step 2: Start Ollama and pull model
# ------------------------------------------
echo ""
echo "[2/4] Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

# Wait for server to be ready
echo "   Waiting for Ollama server to start..."
for i in $(seq 1 30); do
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
        echo "   ✅ Ollama server is ready"
        break
    fi
    if [ "$i" -eq 30 ]; then
        echo "   ❌ Ollama server failed to start"
        kill "$OLLAMA_PID" 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

echo ""
echo "[3/4] Pulling glm-5:cloud model (this may take a while)..."
ollama pull glm-5:cloud

# Stop the background server now that the pull is done
kill "$OLLAMA_PID" 2>/dev/null || true
wait "$OLLAMA_PID" 2>/dev/null || true

# ------------------------------------------
# Step 3: Configure pi-coding-agent
# ------------------------------------------
echo ""
echo "[4/4] Configuring pi-coding-agent to use Ollama..."

proot-distro login ubuntu -- bash -c '
set -e
mkdir -p "$HOME/.pi/agent"
cat > "$HOME/.pi/agent/models.json" << '"'"'MODELSEOF'"'"'
{
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434/v1",
      "api": "openai-completions",
      "apiKey": "ollama",
      "models": [
        { "id": "glm-5:cloud" }
      ]
    }
  }
}
MODELSEOF
echo "✅ models.json written to ~/.pi/agent/models.json"
'

# ------------------------------------------
# Done
# ------------------------------------------
echo ""
echo "============================================"
echo "  🎉 Ollama setup complete!"
echo "============================================"
echo ""
echo "  To use Ollama with Pi:"
echo ""
echo "  1. Start Ollama in a Termux session:"
echo "       ollama serve"
echo ""
echo "  2. In a SECOND Termux session, start Pi:"
echo "       start-pi"
echo ""
echo "  3. Inside Pi, select the Ollama model with:"
echo "       /model glm-5:cloud"
echo ""
echo "  Note: Ollama must be running in a separate"
echo "  Termux session before starting Pi."
echo "============================================"

}

# Run main in a function so the entire script is loaded into memory
# before execution. This prevents breakage when pkg upgrade replaces
# bash while the script is still running.
main "$@"
