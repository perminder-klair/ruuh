#!/bin/bash
# Roohani Dance — Motion-Reactive Freestyle
# Maps accelerometer/gyroscope readings to hardware effects.
# Exit: double-shake (2 shakes within 2s) or Ctrl+C.

set -euo pipefail

# --- Counters ---
SHAKE_COUNT=0
SNAP_COUNT=0
QUIP_COUNT=0

# --- Cooldown timestamps (epoch seconds) ---
LAST_SHAKE_TIME=0
LAST_QUIP_TIME=0
LAST_SPIN_TIME=0
LAST_FACEDOWN_TIME=0
LAST_CALM_TIME=0

# --- Quips ---
QUIPS=(
  "Whoa, easy there!"
  "Now we're grooving"
  "Tilt city, baby"
  "I can feel the rhythm"
  "You call that a move?"
  "Smooth operator"
  "Keep it going!"
  "Feeling the vibe"
)

# --- Float math helpers (no bc dependency) ---
awk_gt() { awk "BEGIN { exit !($1 > $2) }"; }
awk_lt() { awk "BEGIN { exit !($1 < $2) }"; }
awk_abs() { awk "BEGIN { v=$1; print (v < 0 ? -v : v) }"; }
awk_mag() { awk "BEGIN { print sqrt($1*$1 + $2*$2 + $3*$3) }"; }

now_epoch() { date +%s; }

# --- Cleanup ---
cleanup() {
  termux-torch off 2>/dev/null || true
  termux-notification-remove roohani-dance 2>/dev/null || true
  termux-tts-speak "Dance complete!" 2>/dev/null || true
  termux-toast -g middle "Shakes: $SHAKE_COUNT | Snaps: $SNAP_COUNT | Quips: $QUIP_COUNT" 2>/dev/null || true
  exit 0
}
trap cleanup EXIT SIGINT SIGTERM

# --- Setup ---

# Detect sensor names
SENSOR_LIST=$(termux-sensor -l 2>/dev/null || true)
ACCEL_NAME=$(echo "$SENSOR_LIST" | grep -i accelerometer | head -1 | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
GYRO_NAME=$(echo "$SENSOR_LIST" | grep -i gyroscope | head -1 | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')

if [ -z "$ACCEL_NAME" ]; then
  termux-tts-speak "No accelerometer found. Cannot dance."
  exit 1
fi

HAS_GYRO=true
if [ -z "$GYRO_NAME" ]; then
  HAS_GYRO=false
  termux-tts-speak "No gyroscope found. Spin detection disabled."
fi

termux-tts-speak "Roohani Dance activated. Start moving."
termux-notification --id roohani-dance -t "Roohani Dance" -c "Move your phone!" --ongoing

# --- Main loop ---
while true; do
  NOW=$(now_epoch)

  # Read accelerometer
  ACCEL_JSON=$(termux-sensor -s "$ACCEL_NAME" -n 1 2>/dev/null || echo '{}')
  AX=$(echo "$ACCEL_JSON" | jq -r 'to_entries[0].value.values[0] // 0' 2>/dev/null || echo 0)
  AY=$(echo "$ACCEL_JSON" | jq -r 'to_entries[0].value.values[1] // 0' 2>/dev/null || echo 0)
  AZ=$(echo "$ACCEL_JSON" | jq -r 'to_entries[0].value.values[2] // 0' 2>/dev/null || echo 0)

  # Read gyroscope (if available)
  GZ=0
  if $HAS_GYRO; then
    GYRO_JSON=$(termux-sensor -s "$GYRO_NAME" -n 1 2>/dev/null || echo '{}')
    GZ=$(echo "$GYRO_JSON" | jq -r 'to_entries[0].value.values[2] // 0' 2>/dev/null || echo 0)
  fi

  ACCEL_MAG=$(awk_mag "$AX" "$AY" "$AZ")
  ABS_AY=$(awk_abs "$AY")
  ABS_GZ=$(awk_abs "$GZ")

  MATCHED=false

  # 1. Shake (magnitude > 20)
  if ! $MATCHED && awk_gt "$ACCEL_MAG" 20; then
    MATCHED=true
    SHAKE_COUNT=$((SHAKE_COUNT + 1))
    termux-vibrate -d 150
    termux-torch on
    sleep 0.1
    termux-torch off
    termux-toast -g middle "SHAKE!"

    # Double-shake detection: 2 shakes within 2 seconds
    SHAKE_ELAPSED=$((NOW - LAST_SHAKE_TIME))
    if [ "$SHAKE_ELAPSED" -le 2 ]; then
      # Double-shake → exit (cleanup trap handles the rest)
      exit 0
    fi
    LAST_SHAKE_TIME=$NOW
  fi

  # 2. Tilt left/right (X axis) → vibrate + torch flash
  if ! $MATCHED; then
    if awk_lt "$AX" -4 || awk_gt "$AX" 4; then
      MATCHED=true
      termux-vibrate -d 80
      termux-torch on
      sleep 0.1
      termux-torch off
    fi
  fi

  # 3. Tilt forward/back (|Y| > 5, 5s cooldown)
  if ! $MATCHED && awk_gt "$ABS_AY" 5; then
    QUIP_ELAPSED=$((NOW - LAST_QUIP_TIME))
    if [ "$QUIP_ELAPSED" -ge 5 ]; then
      MATCHED=true
      QUIP_COUNT=$((QUIP_COUNT + 1))
      termux-vibrate -d 100
      termux-torch on; sleep 0.15; termux-torch off
      IDX=$((RANDOM % ${#QUIPS[@]}))
      termux-tts-speak "${QUIPS[$IDX]}"
      LAST_QUIP_TIME=$NOW
    fi
  fi

  # 4. Spin (|gyro Z| > 5, 8s cooldown)
  if ! $MATCHED && $HAS_GYRO && awk_gt "$ABS_GZ" 5; then
    SPIN_ELAPSED=$((NOW - LAST_SPIN_TIME))
    if [ "$SPIN_ELAPSED" -ge 8 ]; then
      MATCHED=true
      SNAP_COUNT=$((SNAP_COUNT + 1))
      termux-vibrate -d 200
      termux-torch on; sleep 0.2; termux-torch off
      STAMP=$(date +%s)
      PHOTO="/sdcard/ruuh/dance-snap-${STAMP}.jpg"
      termux-camera-photo "$PHOTO"
      termux-media-scan "$PHOTO"
      termux-toast "Snapshot!"
      LAST_SPIN_TIME=$NOW
    fi
  fi

  # 5. Face down (Z < -8)
  if ! $MATCHED && awk_lt "$AZ" -8; then
    FACEDOWN_ELAPSED=$((NOW - LAST_FACEDOWN_TIME))
    if [ "$FACEDOWN_ELAPSED" -ge 5 ]; then
      MATCHED=true
      termux-vibrate -d 300
      termux-torch on; sleep 0.1; termux-torch off; sleep 0.1; termux-torch on; sleep 0.1; termux-torch off
      termux-tts-speak "I am upside down! Help!"
      LAST_FACEDOWN_TIME=$NOW
    fi
  fi

  # 6. Calm (accel ~9.8 ± 1, gyro ~0, 10s cooldown)
  if ! $MATCHED; then
    ACCEL_DIFF=$(awk "BEGIN { v=$ACCEL_MAG - 9.8; print (v < 0 ? -v : v) }")
    if awk_lt "$ACCEL_DIFF" 1 && awk_lt "$ABS_GZ" 0.5; then
      CALM_ELAPSED=$((NOW - LAST_CALM_TIME))
      if [ "$CALM_ELAPSED" -ge 10 ]; then
        MATCHED=true
        termux-vibrate -d 50
        termux-tts-speak -r 0.7 "So peaceful..."
        LAST_CALM_TIME=$NOW
      fi
    fi
  fi

  sleep 0.25
done
