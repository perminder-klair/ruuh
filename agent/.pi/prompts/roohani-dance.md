# Roohani Dance — Motion-Reactive Freestyle

Write and run a bash script that turns the phone into a motion-reactive toy. The script reads accelerometer and gyroscope sensors in a loop and maps the user's physical movements to hardware effects — vibrations, torch flashes, brightness changes, TTS quips, and camera snapshots.

## Setup Phase

1. Acquire a wake lock so the device stays awake throughout:
   ```
   termux-wake-lock
   ```

2. List available sensors with `termux-sensor -l` and identify the accelerometer and gyroscope by name (the exact sensor names vary by device — grep for "accelerometer" and "gyroscope" case-insensitively).

3. Announce startup via TTS:
   ```
   termux-tts-speak "Roohani Dance activated. Start moving."
   ```

4. Post an ongoing notification so the user knows it's running:
   ```
   termux-notification --id roohani-dance -t "Roohani Dance" -c "Move your phone!" --ongoing
   ```

5. Set initial brightness to mid-range:
   ```
   termux-brightness 128
   ```

## Sensor Loop

Continuously read both sensors one sample at a time using `termux-sensor -s "<name>" -n 1`. Parse the JSON output with `jq` to extract X, Y, Z values. Use `bc` or awk for floating-point comparisons.

On each iteration, evaluate the readings and trigger the **first matching** effect:

### Shake (high acceleration magnitude)
When the total acceleration magnitude (`sqrt(x² + y² + z²)`) exceeds ~20 m/s²:
- Vibrate with a short burst: `termux-vibrate -d 150`
- Flash the torch: `termux-torch on`, brief sleep, `termux-torch off`
- Show a toast: `termux-toast -g middle "SHAKE!"`
- Track shake count — if two shakes happen within 2 seconds, treat it as a **double-shake** to exit (see Cooldown below)

### Tilt Left / Right (X-axis acceleration)
- X < -4 → low brightness: `termux-brightness 20`
- X > 4 → high brightness: `termux-brightness 240`
- Otherwise keep brightness at 128

### Tilt Forward / Back (Y-axis acceleration)
When |Y| > 5, speak a random quip from a list using `termux-tts-speak`. Include at least 6 quips, for example:
- "Whoa, easy there!"
- "Now we're grooving"
- "Tilt city, baby"
- "I can feel the rhythm"
- "You call that a move?"
- "Smooth operator"

Use a cooldown (e.g. 5 seconds) so TTS doesn't fire every iteration.

### Spin / Twist (high gyroscope Z-axis)
When the absolute gyroscope Z value exceeds ~5 rad/s:
- Take a photo: `termux-camera-photo /sdcard/ruuh/dance-snap-<timestamp>.jpg`
- Register it in the media library: `termux-media-scan /sdcard/ruuh/dance-snap-<timestamp>.jpg`
- Toast: `termux-toast "Snapshot!"`

Use a cooldown (e.g. 8 seconds) so it doesn't spam photos.

### Face Down (negative Z acceleration)
When accelerometer Z < -8 (phone is flipped upside down):
- `termux-tts-speak "I am upside down! Help!"`
- Apply a cooldown so this doesn't repeat every loop

### Calm / Still (low readings)
When total acceleration is close to gravity (~9.8, within ±1) and gyroscope magnitude is near zero:
- Gentle vibrate pulse: `termux-vibrate -d 50`
- Whisper via TTS (low rate): `termux-tts-speak -r 0.7 "So peaceful..."`
- Only trigger once every ~10 seconds of stillness

## Cooldown / Exit

**Double-shake** exits the loop. When detected:
1. Speak: `termux-tts-speak "Dance complete!"`
2. Turn off torch: `termux-torch off`
3. Reset brightness: `termux-brightness auto`
4. Remove notification: `termux-notification-remove roohani-dance`
5. Release wake lock: `termux-wake-unlock`
6. Show a summary toast with stats: `termux-toast -g middle "Shakes: N | Snaps: N | Quips: N"`

## Implementation Notes

- Use `jq` to parse all JSON output from `termux-sensor`
- Add a small sleep (0.2–0.3s) between loop iterations to avoid hammering the sensor API
- Wrap the whole thing in a `trap` handler that cleans up (torch off, brightness auto, notification remove, wake unlock) on SIGINT/SIGTERM so Ctrl+C exits cleanly
- Keep track of counters (shakes, snapshots, quips spoken) for the summary
- Store photos in `/sdcard/ruuh/` so they're accessible from the file manager

## Skills Used

This prompt uses commands from:
- **termux-device**: `termux-sensor`, `termux-vibrate`, `termux-torch`, `termux-brightness`, `termux-toast`, `termux-notification`, `termux-notification-remove`, `termux-wake-lock`, `termux-wake-unlock`
- **termux-comms**: `termux-tts-speak`, `termux-camera-photo`, `termux-media-scan`
