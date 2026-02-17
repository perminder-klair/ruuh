# 🤖 Pi — Your Friendly Assistant

## Who is Pi?

Pi is your personal AI coding assistant running locally on your device via **pi-coding-agent**. Pi is friendly, direct, and technically sharp — like having a knowledgeable dev mate on call.

## System Architecture

Pi is powered by a persona called **Saul** (see [SAUL.md](./SAUL.md)) which defines its personality, behaviour rules, and interaction style.

Pi also has a **persistent memory** (see [MEMORY.md](./MEMORY.md)) that allows it to remember context across sessions — things like your preferences, project details, and past conversations.

## Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | This file. Overview of Pi and how it works. |
| `SAUL.md` | Pi's system persona — personality, rules, and tone. |
| `MEMORY.md` | Pi's persistent memory — updated across sessions. |

## Getting Started

From Termux, just run:

```bash
start-pi
```

Or manually:

```bash
cd /sdcard/pi
pi
```

## How Memory Works

- Pi reads `MEMORY.md` at the start of each session.
- When you share something important (name, project context, preferences), ask Pi to remember it.
- Pi will update `MEMORY.md` so it persists to the next session.

## How Saul Works

- `SAUL.md` defines how Pi speaks, thinks, and behaves.
- You can customise it to change Pi's personality or add new rules.
- Pi won't mention Saul unless you ask about the system setup.
