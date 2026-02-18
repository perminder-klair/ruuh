#!/bin/bash
# Verification script — checks that all setup scripts produced correct outputs

PREFIX="${PREFIX:-/data/data/com.termux/files/usr}"
HOME_DIR="${HOME:-/data/data/com.termux/files/home}"

# Source shared config for RUUH_DIR and UBUNTU_ROOT
_conf="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)/../scripts/config.sh"
if [ -f "$_conf" ]; then
    HOME="$HOME_DIR" source "$_conf"
else
    RUUH_DIR="$HOME_DIR/storage/shared/ruuh"
    UBUNTU_ROOT="$PREFIX/var/lib/proot-distro/installed-rootfs/ubuntu"
fi

PASS=0
FAIL=0

check() {
    local desc="$1"
    local result="$2"

    if [ "$result" = "0" ]; then
        echo "  PASS  $desc"
        PASS=$((PASS + 1))
    else
        echo "  FAIL  $desc"
        FAIL=$((FAIL + 1))
    fi
}

echo ""
echo "============================================"
echo "  Verification"
echo "============================================"
echo ""

# --- ruuh-setup.sh checks ---
echo "--- ruuh-setup.sh ---"

# Agent files exist and have content
for f in AGENTS.md SOUL.md MEMORY.md; do
    [ -s "$RUUH_DIR/$f" ]
    check "Agent file $f exists and has content" $?
done

# ruuh launcher
[ -x "$PREFIX/bin/ruuh" ]
check "ruuh is executable" $?

grep -q "proot-distro login ubuntu" "$PREFIX/bin/ruuh" 2>/dev/null
check "ruuh contains proot-distro login command" $?

# Ubuntu rootfs structure
[ -d "$UBUNTU_ROOT" ]
check "Ubuntu rootfs directory exists" $?

[ -d "$UBUNTU_ROOT/usr/local/bin" ]
check "Ubuntu rootfs /usr/local/bin exists" $?

# Termux API commands symlinked into rootfs
SYMLINK_COUNT=0
for cmd in "$UBUNTU_ROOT/usr/local/bin"/termux-*; do
    [ -L "$cmd" ] && SYMLINK_COUNT=$((SYMLINK_COUNT + 1))
done
[ "$SYMLINK_COUNT" -gt 10 ]
check "Termux API commands symlinked into rootfs ($SYMLINK_COUNT found)" $?

# /sdcard/ruuh symlink (created by proot-distro mock)
[ -e "/sdcard/ruuh" ]
check "/sdcard/ruuh exists (bind mount simulation)" $?

# Node.js available
node -v >/dev/null 2>&1
check "Node.js is available" $?

# pi-coding-agent installed
npm list -g @mariozechner/pi-coding-agent >/dev/null 2>&1
check "pi-coding-agent is installed globally" $?

echo ""

# --- skills-setup.sh checks ---
echo "--- skills-setup.sh ---"

for skill in termux-device termux-comms termux-system; do
    [ -s "$RUUH_DIR/.pi/skills/$skill/SKILL.md" ]
    check "Skill file $skill/SKILL.md exists and has content" $?
done

SKILL_COUNT=$(find "$RUUH_DIR/.pi/skills" -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')
[ "$SKILL_COUNT" -ge 3 ]
check "At least 3 skill files installed (found $SKILL_COUNT)" $?

echo ""

# --- dashboard-setup.sh checks ---
echo "--- dashboard-setup.sh ---"

[ -s "$RUUH_DIR/.pi/extensions/dashboard.ts" ]
check "Dashboard extension dashboard.ts exists and has content" $?

[ -d "$RUUH_DIR/.pi/extensions" ]
check "Extensions directory exists" $?

echo ""

# --- Summary ---
echo "============================================"
TOTAL=$((PASS + FAIL))
echo "  Results: $PASS/$TOTAL passed"
if [ "$FAIL" -gt 0 ]; then
    echo "  $FAIL FAILED"
    echo "============================================"
    exit 1
else
    echo "  All checks passed!"
    echo "============================================"
    exit 0
fi
