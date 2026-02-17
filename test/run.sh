#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "============================================"
echo "  Ruuh Docker Test Runner"
echo "============================================"
echo ""

# Build the image
echo "[1/2] Building test image..."
docker build -t ruuh-test -f test/Dockerfile .

# Check for interactive mode
if [ "$1" = "--interactive" ] || [ "$1" = "-i" ]; then
    echo ""
    echo "[2/2] Starting interactive shell..."
    echo "  Run scripts manually:"
    echo "    bash /scripts/ruuh-setup.sh"
    echo "    bash /scripts/skills-setup.sh"
    echo "    bash /scripts/dashboard-setup.sh"
    echo "    bash /test/verify.sh"
    echo ""
    docker run --rm -it ruuh-test bash
    exit 0
fi

echo ""
echo "[2/2] Running scripts and verification..."
echo ""

docker run --rm \
    ruuh-test \
    bash -c '
        set -e
        echo ">>> Running ruuh-setup.sh..."
        bash /scripts/ruuh-setup.sh

        echo ""
        echo ">>> Running skills-setup.sh..."
        bash /scripts/skills-setup.sh

        echo ""
        echo ">>> Running dashboard-setup.sh..."
        bash /scripts/dashboard-setup.sh

        echo ""
        echo ">>> Running verification..."
        bash /test/verify.sh
    '

echo ""
echo "============================================"
echo "  All tests passed!"
echo "============================================"
