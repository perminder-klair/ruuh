# DroidClaw

A one-command setup script that turns [Termux](https://termux.dev) into a fully configured AI coding environment on Android. It installs Ubuntu via proot, sets up Node.js, and deploys the [pi-coding-agent](https://www.npmjs.com/package/@mariozechner/pi-coding-agent) — giving you a personal AI assistant (Pi) right on your phone.

## What It Does

1. Updates Termux and installs `proot-distro` + `termux-api`
2. Sets up shared storage so agent files are accessible from any Android app
3. Creates pre-configured agent files (persona, memory, overview)
4. Installs Ubuntu with Node.js 22 and `pi-coding-agent`
5. Creates a `start-pi` launcher command
6. Symlinks Termux API commands into the proot environment

## Prerequisites

- An Android device with [Termux](https://f-droid.org/en/packages/com.termux/) installed (F-Droid version recommended)
- Storage permission granted to Termux

## Usage

### Full Setup (Recommended)

Run everything in one go — Termux environment, Ollama, and skills:

```bash
curl -fsSL https://raw.githubusercontent.com/perminder-klair/droidclaw/main/scripts/setup.sh | bash
```

Once setup completes, launch the agent:

1. Start Ollama in a Termux session: `ollama serve`
2. In a **second** Termux session: `start-pi`

### Individual Scripts

If you prefer to run each step separately:

#### 1. Install Pi Agent

```bash
curl -fsSL https://raw.githubusercontent.com/perminder-klair/droidclaw/main/scripts/pi-setup.sh | bash
```

Once setup completes, launch the agent anytime with:

```bash
start-pi
```

Or manually:

```bash
proot-distro login ubuntu
cd ~/pi-agent && pi
```

#### 2. Ollama Setup (Optional)

To run AI models locally on your device using Ollama, run this **after** the main setup:

```bash
curl -fsSL https://raw.githubusercontent.com/perminder-klair/droidclaw/main/scripts/ollama-setup.sh | bash
```

This installs Ollama, pulls the `glm-5:cloud` model, and configures pi-coding-agent to use it. During setup, `ollama signin` will prompt you to open a URL in your browser to authenticate with your Ollama account (required for cloud models). To use Ollama with Pi:

1. Start Ollama in a Termux session: `ollama serve`
2. In a **second** Termux session, start Pi: `start-pi`

The `glm-5:cloud` model is configured as the default — no need to select it manually.

#### 3. Termux API Skills (Optional)

To teach Pi how to use Android device features (camera, SMS, sensors, notifications, etc.), install the Termux API skills:

```bash
curl -fsSL https://raw.githubusercontent.com/perminder-klair/droidclaw/main/scripts/skills-setup.sh | bash
```

This adds three skill files that Pi auto-discovers on next launch:

- **termux-device** — battery, brightness, torch, vibrate, volume, audio info, sensors, fingerprint, location, WiFi, clipboard, notifications, dialogs, toasts, wake lock, wallpaper, downloads
- **termux-comms** — SMS, contacts, call log, phone calls, camera, microphone, text-to-speech, speech-to-text, media playback, sharing, storage picker, calendar
- **termux-system** — job scheduling, infrared transmit, USB device access, NFC tag read/write, hardware keystore crypto

## File Structure

After setup, the following agent files are created in shared storage (`/sdcard/pi/`):

| File | Purpose |
|------|---------|
| `AGENTS.md` | Overview of Pi and how it works |
| `SOUL.md` | Pi's system persona — personality, rules, and tone |
| `MEMORY.md` | Persistent memory updated across sessions |
| `.pi/skills/termux-device/SKILL.md` | Skill: device hardware, sensors, UI |
| `.pi/skills/termux-comms/SKILL.md` | Skill: SMS, camera, audio, sharing |
| `.pi/skills/termux-system/SKILL.md` | Skill: scheduling, IR, USB, NFC, keystore |

These files are accessible from:

| Context | Path |
|---------|------|
| Termux | `~/storage/shared/pi/` |
| Ubuntu (proot) | `~/pi-agent/` |
| Android file manager | Internal Storage > pi |

You can edit these files from any Android text editor to customise Pi's behaviour.

## Development Testing

A Docker-based test environment simulates Termux so you can test script changes locally without an Android device.

**Prerequisites:** Docker

```bash
# Run all scripts and verify outputs (~30s)
bash test/run.sh

# Interactive shell for debugging
bash test/run.sh --interactive
```

The test container uses Ubuntu 22.04 with Termux's directory structure (`$PREFIX`, `$HOME`) and mock versions of `pkg`, `proot-distro`, `termux-setup-storage`, and all `termux-*` API commands. Scripts run unmodified — mocking is purely external via `$PATH`.

## How It Works

The entire script body is wrapped in a `main()` function. This ensures the full script is loaded into memory before execution, preventing breakage if `pkg upgrade` replaces bash mid-run.

The proot Ubuntu environment shares access to `/sdcard/pi` via a symlink, and Termux API commands (e.g. `termux-battery-status`) are symlinked into the proot filesystem so they work inside Ubuntu too.

## License

MIT
