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

### Install Pi Agent

Run the one-line installer in Termux:

```bash
curl -fsSL https://raw.githubusercontent.com/perminder-klair/droidclaw/main/termux-setup.sh | bash
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

### Ollama Setup (Optional)

To run AI models locally on your device using Ollama, run this **after** the main setup:

```bash
curl -fsSL https://raw.githubusercontent.com/perminder-klair/droidclaw/main/ollama-setup.sh | bash
```

This installs Ollama, pulls the `glm-5:cloud` model, and configures pi-coding-agent to use it. During setup, `ollama signin` will prompt you to open a URL in your browser to authenticate with your Ollama account (required for cloud models). To use Ollama with Pi:

1. Start Ollama in a Termux session: `ollama serve`
2. In a **second** Termux session, start Pi: `start-pi`

The `glm-5:cloud` model is configured as the default — no need to select it manually.

## File Structure

After setup, the following agent files are created in shared storage (`/sdcard/pi/`):

| File | Purpose |
|------|---------|
| `AGENTS.md` | Overview of Pi and how it works |
| `SAUL.md` | Pi's system persona — personality, rules, and tone |
| `MEMORY.md` | Persistent memory updated across sessions |

These files are accessible from:

| Context | Path |
|---------|------|
| Termux | `~/storage/shared/pi/` |
| Ubuntu (proot) | `~/pi-agent/` |
| Android file manager | Internal Storage > pi |

You can edit these files from any Android text editor to customise Pi's behaviour.

## How It Works

The entire script body is wrapped in a `main()` function. This ensures the full script is loaded into memory before execution, preventing breakage if `pkg upgrade` replaces bash mid-run.

The proot Ubuntu environment shares access to `/sdcard/pi` via a symlink, and Termux API commands (e.g. `termux-battery-status`) are symlinked into the proot filesystem so they work inside Ubuntu too.

## License

MIT
