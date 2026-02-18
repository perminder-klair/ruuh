#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# Ollama Setup Script for Termux
# ============================================
# Run this in Termux AFTER ruuh-setup.sh
# Usage: bash ollama-setup.sh
# ============================================

set -e

main() {

# -- Model catalogue --
MODEL_IDS=("glm-5:cloud" "minimax-m2.5:cloud" "qwen3.5:cloud" "kimi-k2.5:cloud" "qwen3:1.7b")
MODEL_DESCS=("cloud, recommended" "cloud" "cloud" "cloud" "local, ~1GB")
MODEL_COUNT=5

is_cloud_model() {
    case "$1" in *:cloud) return 0 ;; *) return 1 ;; esac
}

echo "============================================"
echo "  🦙 Ollama Setup for Ruuh Agent"
echo "============================================"

# ------------------------------------------
# Step 1: Install Ollama
# ------------------------------------------
echo ""
echo "[1/6] Installing Ollama..."
pkg install -y ollama

# ------------------------------------------
# Step 2: Start Ollama server
# ------------------------------------------
echo ""
echo "[2/6] Starting Ollama server..."
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

# ------------------------------------------
# Step 3: Select model
# ------------------------------------------
echo ""
echo "[3/6] Select a model:"
echo ""
for i in $(seq 0 $((MODEL_COUNT - 1))); do
    printf "  %d) %-18s (%s)\n" "$((i + 1))" "${MODEL_IDS[$i]}" "${MODEL_DESCS[$i]}"
done
echo ""
printf "Choice [1]: "
read -r choice < /dev/tty

if [ -z "$choice" ]; then
    choice=1
fi

if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt "$MODEL_COUNT" ]; then
    echo "   Invalid choice, defaulting to 1 (${MODEL_IDS[0]})"
    choice=1
fi

SELECTED_MODEL="${MODEL_IDS[$((choice - 1))]}"
echo "   Selected: $SELECTED_MODEL"

# ------------------------------------------
# Step 4: Authenticate (cloud models only)
# ------------------------------------------
echo ""
if is_cloud_model "$SELECTED_MODEL"; then
    echo "[4/6] Authenticating with Ollama..."
    echo "   You need an Ollama account to use cloud models."
    echo "   A URL will appear below — open it in your browser to sign in."
    echo ""
    ollama signin
else
    echo "[4/6] Skipping authentication (local model selected)."
fi

# ------------------------------------------
# Step 5: Pull model
# ------------------------------------------
echo ""
echo "[5/6] Pulling $SELECTED_MODEL model (this may take a while)..."
ollama pull "$SELECTED_MODEL"

# Stop the background server now that the pull is done
kill "$OLLAMA_PID" 2>/dev/null || true
wait "$OLLAMA_PID" 2>/dev/null || true

# ------------------------------------------
# Step 6: Configure pi-coding-agent
# ------------------------------------------
echo ""
echo "[6/6] Configuring pi-coding-agent to use Ollama..."

proot-distro login ubuntu -- env SELECTED_MODEL="$SELECTED_MODEL" bash -c "
set -e
mkdir -p \"\$HOME/.pi/agent\"
cat > \"\$HOME/.pi/agent/models.json\" << MODELSEOF
{
  \"providers\": {
    \"ollama\": {
      \"baseUrl\": \"http://localhost:11434/v1\",
      \"api\": \"openai-completions\",
      \"apiKey\": \"ollama\",
      \"models\": [
        { \"id\": \"$SELECTED_MODEL\" }
      ]
    }
  }
}
MODELSEOF
echo \"✅ models.json written to ~/.pi/agent/models.json\"
cat > \"\$HOME/.pi/agent/settings.json\" << SETTINGSEOF
{
  \"defaultProvider\": \"ollama\",
  \"defaultModel\": \"$SELECTED_MODEL\"
}
SETTINGSEOF
echo \"✅ settings.json written to ~/.pi/agent/settings.json\"
"

# ------------------------------------------
# Done
# ------------------------------------------
echo ""
echo "============================================"
echo "  🎉 Ollama setup complete!"
echo "============================================"
echo ""
echo "  To use Ollama with Ruuh:"
echo ""
echo "    ruuh --ollama"
echo ""
echo "  This starts Ollama and the agent in one session."
echo "  Ollama stops automatically when you exit."
echo ""
echo "  The $SELECTED_MODEL model is now the default —"
echo "  no need to select it manually."
echo "============================================"

}

# Run main in a function so the entire script is loaded into memory
# before execution. This prevents breakage when pkg upgrade replaces
# bash while the script is still running.
main "$@"
