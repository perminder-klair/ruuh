#!/bin/bash
# Verification script — checks that all setup scripts produced correct outputs

PREFIX="${PREFIX:-/data/data/com.termux/files/usr}"
HOME_DIR="${HOME:-/data/data/com.termux/files/home}"
PI_DIR="$HOME_DIR/storage/shared/pi"
UBUNTU_ROOT="$PREFIX/var/lib/proot-distro/installed-rootfs/ubuntu"

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

# --- pi-setup.sh checks ---
echo "--- pi-setup.sh ---"

# Agent files exist and have content
for f in AGENTS.md SOUL.md MEMORY.md; do
    [ -s "$PI_DIR/$f" ]
    check "Agent file $f exists and has content" $?
done

# start-pi launcher
[ -x "$PREFIX/bin/start-pi" ]
check "start-pi is executable" $?

grep -q "proot-distro login ubuntu" "$PREFIX/bin/start-pi" 2>/dev/null
check "start-pi contains proot-distro login command" $?

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

# /sdcard/pi symlink (created by proot-distro mock)
[ -e "/sdcard/pi" ]
check "/sdcard/pi exists (bind mount simulation)" $?

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
    [ -s "$PI_DIR/.pi/skills/$skill/SKILL.md" ]
    check "Skill file $skill/SKILL.md exists and has content" $?
done

SKILL_COUNT=$(find "$PI_DIR/.pi/skills" -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')
[ "$SKILL_COUNT" -eq 3 ]
check "Exactly 3 skill files installed (found $SKILL_COUNT)" $?

echo ""

# --- dashboard-setup.sh checks ---
echo "--- dashboard-setup.sh ---"

[ -s "$PI_DIR/.pi/extensions/dashboard.ts" ]
check "Dashboard extension dashboard.ts exists and has content" $?

[ -d "$PI_DIR/.pi/extensions" ]
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
