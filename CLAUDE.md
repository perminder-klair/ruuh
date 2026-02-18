# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repo contains `scripts/ruuh-setup.sh`, a Bash setup script that configures a Termux + Ubuntu (proot) environment on Android for running the `pi-coding-agent` npm package. The script:

1. Updates Termux and installs `proot-distro` and `termux-api`
2. Sets up shared storage access (`~/storage/shared/ruuh/`)
3. Creates agent config files (AGENTS.md, SOUL.md, MEMORY.md) in shared storage
4. Installs Ubuntu via proot-distro with Node.js 22 and `@mariozechner/pi-coding-agent`
5. Creates a `ruuh` launcher command
6. Symlinks Termux API commands into the proot environment

## Key Details

- Shebang targets Termux's bash: `#!/data/data/com.termux/files/usr/bin/bash`
- The entire script body is wrapped in a `main()` function to prevent breakage if `pkg upgrade` replaces bash mid-execution
- Agent files are written to `/sdcard/ruuh` (accessible as `~/storage/shared/ruuh/` in Termux and `~/agent/` inside proot)
- Uses `DEBIAN_FRONTEND=noninteractive` and `--force-confnew` to avoid interactive prompts during upgrades
- The proot Ubuntu setup runs as an inline bash script passed to `proot-distro login ubuntu -- bash -c '...'`

## Termux API Skills

`scripts/skills-setup.sh` installs pi-coding-agent skill files into `~/storage/shared/ruuh/.pi/skills/`. These teach the agent how to use the Termux API commands that are symlinked into proot by step 8 of `ruuh-setup.sh`.

Two skills are provided:

- **termux-device** (`agent/.pi/skills/termux-device/SKILL.md`) — device hardware, sensors, UI: battery, brightness, torch, vibrate, volume, sensors, fingerprint, location, WiFi, clipboard, notifications, dialogs, toasts, wake lock, wallpaper, downloads
- **termux-comms** (`agent/.pi/skills/termux-comms/SKILL.md`) — communication and media: SMS, contacts, call log, camera, microphone, TTS, media playback, sharing, storage picker, calendar

Each SKILL.md has YAML frontmatter (`name`, `description`), a quick reference table, detailed per-command usage with flags and JSON output examples, and common patterns showing real-world combinations.

## Landing Page (`web/`)

A Next.js landing page and docs site for the project. Stack: Next.js 16, React 19, Tailwind CSS v4, Motion (animations), Lucide icons, shadcn/ui.
