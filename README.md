# Ruuh

A one-command setup script that turns [Termux](https://termux.dev) into a fully configured AI coding environment on Android. It installs Ubuntu via proot, sets up Node.js, and deploys the [pi-coding-agent](https://www.npmjs.com/package/@mariozechner/pi-coding-agent) — giving you a personal AI assistant right on your phone.

## What It Does

1. Updates Termux and installs `proot-distro` + `termux-api`
2. Sets up shared storage so agent files are accessible from any Android app
3. Downloads pre-configured agent files (persona, identity, memory, tools, and more)
4. Installs Ubuntu with Node.js 22 and `pi-coding-agent`
5. Patches known upstream bugs in pi-coding-agent
6. Creates a `ruuh` launcher command (with optional `--ollama` flag)
7. Symlinks Termux API commands into the proot environment

## Prerequisites

- An Android device with [Termux](https://f-droid.org/en/packages/com.termux/) installed (F-Droid version recommended)
- [Termux:API](https://f-droid.org/en/packages/com.termux.api/) companion app (optional, for hardware access like camera, SMS, sensors)
- Storage permission granted to Termux

## Usage

### Full Setup (Recommended)

Run everything in one go — walks you through Termux environment, Ollama, and skills with optional steps:

```bash
curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/setup.sh | bash
```

Once setup completes, launch the agent:

```bash
ruuh --ollama
```

This starts Ollama and the agent in a single session. Ollama stops automatically when you exit. Or without Ollama: `ruuh`

### Individual Scripts

If you prefer to run each step separately:

#### 1. Install Ruuh Agent

```bash
curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/ruuh-setup.sh | bash
```

Once setup completes, launch the agent anytime with:

```bash
ruuh
```

Or manually:

```bash
proot-distro login ubuntu
cd ~/agent && pi
```

#### 2. Ollama Setup (Optional)

To run AI models on your device using Ollama, run this **after** the main setup:

```bash
curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/ollama-setup.sh | bash
```

During setup you'll choose from available models:

| Model | Type |
|-------|------|
| `glm-5:cloud` | Cloud (recommended) |
| `minimax-m2.5:cloud` | Cloud |
| `qwen3.5:cloud` | Cloud |
| `kimi-k2.5:cloud` | Cloud |
| `qwen3:1.7b` | Local (~1 GB) |

Cloud models require `ollama signin` during setup (opens a browser URL for authentication). To use Ollama with Ruuh:

```bash
ruuh --ollama
```

#### 3. Termux API Skills (Optional)

To teach Ruuh how to use Android device features (camera, SMS, sensors, notifications, etc.), install the Termux API skills:

```bash
curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/skills-setup.sh | bash
```

Requires the [Termux:API](https://f-droid.org/en/packages/com.termux.api/) app. This adds three skill files that Ruuh auto-discovers on next launch:

- **termux-device** — battery, brightness, torch, vibrate, volume, audio info, sensors, fingerprint, location, WiFi, clipboard, notifications, dialogs, toasts, wake lock, wallpaper, downloads
- **termux-comms** — SMS, contacts, call log, phone calls, camera, microphone, text-to-speech, speech-to-text, media playback, sharing, storage picker, calendar
- **termux-system** — job scheduling, infrared transmit, USB device access, NFC tag read/write, hardware keystore crypto

#### 4. Dashboard Extension (Optional)

Install a live web dashboard for monitoring the agent:

```bash
curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/dashboard-setup.sh | bash
```

Once installed, the dashboard starts automatically when you run `ruuh`. Open `http://localhost:3000` in your device browser. Tip: in Chrome, tap the menu > "Add to Home Screen" for an app-like experience.

## File Structure

After setup, the following agent files are created in shared storage (`/sdcard/ruuh/`):

| File | Purpose |
|------|---------|
| `AGENTS.md` | Overview of the agent and how it works |
| `SOUL.md` | Agent's system persona — personality, rules, and tone |
| `IDENTITY.md` | Agent identity and self-description |
| `MEMORY.md` | Persistent memory updated across sessions |
| `USER.md` | User profile and preferences |
| `TOOLS.md` | Tool usage guidelines |
| `BOOTSTRAP.md` | Startup bootstrap instructions |
| `HEARTBEAT.md` | Periodic heartbeat configuration |
| `.pi/skills/termux-device/SKILL.md` | Skill: device hardware, sensors, UI |
| `.pi/skills/termux-comms/SKILL.md` | Skill: SMS, camera, audio, sharing |
| `.pi/skills/termux-system/SKILL.md` | Skill: scheduling, IR, USB, NFC, keystore |
| `.pi/skills/*/SKILL.md` | Additional built-in skills (weather, summarize, etc.) |
| `.pi/extensions/dashboard.ts` | Web dashboard extension |
| `.pi/settings.json` | Agent settings |

These files are accessible from:

| Context | Path |
|---------|------|
| Termux | `~/storage/shared/ruuh/` |
| Ubuntu (proot) | `~/agent/` |
| Android file manager | Internal Storage > ruuh |

You can edit these files from any Android text editor to customise the agent's behaviour.

## Landing Page

The `web/` directory contains a Next.js landing page and docs site. See [web/README.md](web/README.md) for details.

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

Each setup script wraps its body in a `main()` function. This ensures the full script is loaded into memory before execution, preventing breakage if `pkg upgrade` replaces bash mid-run.

All scripts source a shared `config.sh` for common paths and URLs. The proot Ubuntu environment shares access to `/sdcard/ruuh` via a symlink, and Termux API commands (e.g. `termux-battery-status`) are symlinked into the proot filesystem so they work inside Ubuntu too.

After installing pi-coding-agent, `patch-pi-agent.sh` applies guards for known upstream bugs (null `.content` access) so the agent runs reliably on Termux.

## License

MIT
