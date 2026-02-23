---
name: roohani-dance
description: Motion-reactive freestyle game that maps phone movements to hardware effects. Use when the user wants to dance, play a motion game, do movement-based interaction, sensor play, shake-to-action, tilt games, or any physical phone interaction involving accelerometer/gyroscope responses like vibrations, torch flashes, TTS quips, and camera snapshots.
---

# Roohani Dance — Motion-Reactive Freestyle

Turn the phone into a motion-reactive toy. Physical movements trigger hardware effects in real time.

## Movement-to-Effect Mappings

| Movement | Detection | Effect |
|----------|-----------|--------|
| Shake | Accel magnitude > 20 | Vibrate + torch flash + toast; double-shake exits |
| Tilt left/right | \|X\| > 4 | Vibrate + torch flash |
| Tilt forward/back | \|Y\| > 5 | Vibrate + torch flash + random TTS quip (5s cooldown) |
| Spin/twist | \|Gyro Z\| > 5 | Vibrate + torch flash + camera snapshot (8s cooldown) |
| Face down | Z < -8 | Vibrate + double torch flash + TTS |
| Calm/still | Accel ~9.8 ± 1, gyro ~0 | Gentle vibrate + whisper TTS (10s cooldown) |

## Usage

Run the pre-built script:

```bash
bash scripts/roohani-dance.sh
```

Exit by double-shaking (two shakes within 2 seconds) or Ctrl+C. Both clean up properly (torch off, notification removed).
