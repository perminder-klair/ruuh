# Shared configuration — sourced by all setup scripts
REPO_RAW="https://raw.githubusercontent.com/perminder-klair/ruuh/main"
RUUH_DIR="$HOME/storage/shared/ruuh"
SDCARD_DIR="/sdcard/ruuh"
AGENT_SYMLINK_NAME="agent"
UBUNTU_ROOT="$PREFIX/var/lib/proot-distro/installed-rootfs/ubuntu"
REPO_TARBALL="https://github.com/perminder-klair/ruuh/archive/refs/heads/main.tar.gz"

# -- Output helpers --
RUUH_LOG="${TMPDIR:-/tmp}/ruuh-setup.log"
: >> "$RUUH_LOG"  # ensure log file exists

# Print step indicator without newline: "  [1/8] Updating packages..."
step() {
    printf "  %s %s..." "$1" "$2"
}

# Complete a step line: "... done" or "... done (23 files)"
step_done() {
    if [ -n "${1:-}" ]; then
        printf " done (%s)\n" "$1"
    else
        printf " done\n"
    fi
}

# Fail a step and show last 5 lines of log
step_fail() {
    printf " FAILED\n"
    echo ""
    echo "  Last 5 lines of log:"
    tail -5 "$RUUH_LOG" 2>/dev/null | sed 's/^/    /'
    echo ""
}

# Run a command quietly, redirecting output to log.
# Usage: run_quiet "[1/8]" "Updating packages" pkg update -y
run_quiet() {
    local label="$1" desc="$2"
    shift 2
    step "$label" "$desc"
    if "$@" >> "$RUUH_LOG" 2>&1; then
        step_done
    else
        step_fail
        return 1
    fi
}

# Run a pipeline/complex command quietly via eval.
# Usage: run_quiet_eval "[1/8]" "Desc" "curl ... | bash -"
run_quiet_eval() {
    local label="$1" desc="$2" cmd="$3"
    step "$label" "$desc"
    if eval "$cmd" >> "$RUUH_LOG" 2>&1; then
        step_done
    else
        step_fail
        return 1
    fi
}
