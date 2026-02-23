#!/data/data/com.termux/files/usr/bin/bash

# Ollama Setup Script for Termux
# Run this in Termux AFTER ruuh-setup.sh
# Usage: bash ollama-setup.sh

set -e

main() {

# -- Model catalogue --
MODEL_IDS=("kimi-k2.5:cloud" "minimax-m2.5:cloud" "glm-5:cloud" "qwen3.5:cloud" "qwen3-coder-next:cloud" "qwen3:1.7b")
MODEL_DESCS=("cloud, recommended" "cloud" "cloud" "cloud" "cloud" "local, ~1GB")
MODEL_COUNT=6

is_cloud_model() {
    case "$1" in *:cloud) return 0 ;; *) return 1 ;; esac
}

# Source shared config
_conf="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)/config.sh"
if [ -f "$_conf" ]; then
    source "$_conf"
else
    eval "$(curl -fsSL "https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/config.sh")"
fi

if [ "${RUUH_ORCHESTRATED:-}" != "1" ]; then
    echo ""
    echo "  Ollama Setup"
    echo "  Log: $RUUH_LOG"
    echo ""
fi

# Step 1: Install Ollama
run_quiet "[1/6]" "Installing Ollama" pkg install -y ollama

# Step 2: Start Ollama server
step "[2/6]" "Starting server"
ollama serve > /dev/null 2>&1 &
OLLAMA_PID=$!

for i in $(seq 1 30); do
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
        break
    fi
    if [ "$i" -eq 30 ]; then
        step_fail
        kill "$OLLAMA_PID" 2>/dev/null || true
        exit 1
    fi
    sleep 1
done
step_done

# Step 3: Select model (interactive — keep visible)
echo ""
echo "  [3/6] Select a model:"
echo ""
for i in $(seq 0 $((MODEL_COUNT - 1))); do
    printf "    %d) %-18s (%s)\n" "$((i + 1))" "${MODEL_IDS[$i]}" "${MODEL_DESCS[$i]}"
done
echo ""
printf "  Choice [1]: "
read -r choice < /dev/tty

if [ -z "$choice" ]; then
    choice=1
fi

if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt "$MODEL_COUNT" ]; then
    echo "  Invalid choice, defaulting to 1 (${MODEL_IDS[0]})"
    choice=1
fi

SELECTED_MODEL="${MODEL_IDS[$((choice - 1))]}"
echo "  Selected: $SELECTED_MODEL"

# Step 4: Authenticate (interactive for cloud models)
echo ""
if is_cloud_model "$SELECTED_MODEL"; then
    echo "  [4/6] Authenticating with Ollama..."
    echo "  You need an Ollama account to use cloud models."
    echo "  A URL will appear below — open it in your browser to sign in."
    echo ""
    ollama signin
else
    echo "  [4/6] Skipping authentication (local model)."
fi

# Step 5: Pull model (keep visible — has progress bar)
echo ""
echo "  [5/6] Pulling $SELECTED_MODEL..."
ollama pull "$SELECTED_MODEL"

# Stop background server
kill "$OLLAMA_PID" 2>/dev/null || true
wait "$OLLAMA_PID" 2>/dev/null || true

# Step 6: Configure pi-coding-agent
step "[6/6]" "Configuring agent"

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
cat > \"\$HOME/.pi/agent/settings.json\" << SETTINGSEOF
{
  \"defaultProvider\": \"ollama\",
  \"defaultModel\": \"$SELECTED_MODEL\"
}
SETTINGSEOF
" >> "$RUUH_LOG" 2>&1

step_done

# Summary
echo ""
echo "  Ollama setup complete! Run: ruuh --ollama"
echo ""

}

# Run main in a function so the entire script is loaded into memory
# before execution. This prevents breakage when pkg upgrade replaces
# bash while the script is still running.
main "$@"
