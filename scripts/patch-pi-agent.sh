#!/bin/bash
# Patch pi-coding-agent: guard all unprotected .content access
# Runs inside proot Ubuntu — called by ruuh-setup.sh after npm install

set -e

PI_PKG="/usr/lib/node_modules/@mariozechner/pi-coding-agent"
if [ ! -d "$PI_PKG" ]; then
    echo "  ⚠️  pi-coding-agent not found at $PI_PKG, skipping patches"
    exit 0
fi

echo "  Patching pi-coding-agent content access bugs..."
PATCHED=0

# 1. compaction.js: for...of on message.content (can be null/undefined)
CJS=$(find "$PI_PKG" -path "*/compaction/compaction.js" -print -quit 2>/dev/null)
if [ -n "$CJS" ]; then
    if grep -q 'for (const block of message\.content) {' "$CJS" && ! grep -q 'Array\.isArray(message\.content)' "$CJS"; then
        sed -i 's/for (const block of message\.content) {/for (const block of (Array.isArray(message.content) ? message.content : [])) {/' "$CJS"
        PATCHED=$((PATCHED+1))
    fi
    # .filter() on response.content (generateSummary / generateTurnPrefixSummary)
    if grep -q 'response\.content\.filter(' "$CJS" && ! grep -q '(response\.content || \[\])\.filter(' "$CJS"; then
        sed -i 's/response\.content\.filter(/(response.content || []).filter(/g' "$CJS"
        PATCHED=$((PATCHED+1))
    fi
fi

# 2. assistant-message.js: message.content.some( — MOST LIKELY .some() culprit
AMJ=$(find "$PI_PKG" -name "assistant-message.js" -print -quit 2>/dev/null)
if [ -n "$AMJ" ] && grep -q 'message\.content\.some(' "$AMJ" && ! grep -q '(message\.content || \[\])\.some(' "$AMJ"; then
    sed -i 's/message\.content\.some(/(message.content || []).some(/g' "$AMJ"
    PATCHED=$((PATCHED+1))
fi

# 3. anthropic.js (pi-ai provider): content.some((c) => c.type ===
AJS=$(find "$PI_PKG" -name "anthropic.js" -path "*/providers/*" -print -quit 2>/dev/null)
if [ -n "$AJS" ] && grep -q 'content\.some((c) => c\.type ===' "$AJS"; then
    sed -i 's/content\.some((c) => c\.type ===/(Array.isArray(content) ? content : []).some((c) => c.type ===/g' "$AJS"
    PATCHED=$((PATCHED+1))
fi

# 4. agent.js (pi-agent-core): partial.content.some(
AGJ=$(find "$PI_PKG" -name "agent.js" -path "*pi-agent-core*" -print -quit 2>/dev/null)
if [ -n "$AGJ" ] && grep -q 'partial\.content\.some(' "$AGJ" && ! grep -q '(partial\.content || \[\])\.some(' "$AGJ"; then
    sed -i 's/partial\.content\.some(/(partial.content || []).some(/g' "$AGJ"
    PATCHED=$((PATCHED+1))
fi

echo "  ✅ Applied $PATCHED content-guard patches"
