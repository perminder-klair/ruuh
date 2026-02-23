# Contributing to Ruuh

Thanks for your interest in contributing! Here's how to get started.

## Project Structure

```
scripts/          # Bash setup scripts (Termux + proot)
agent/            # Agent config files and skills
web/              # Next.js landing page and docs site
test/             # Docker-based test environment
```

See the [README](README.md) for a full overview.

## Prerequisites

- **Scripts development:** Docker (for the test environment)
- **Web development:** Node.js 18+ and pnpm

## Setup

1. Fork and clone the repo
2. Create a branch for your change: `git checkout -b my-feature`

### Working on scripts

No Android device needed — use the Docker test environment:

```bash
# Run all scripts and verify outputs
bash test/run.sh

# Interactive shell for debugging
bash test/run.sh --interactive
```

### Working on the landing page

```bash
cd web
pnpm install
pnpm dev
```

## Submitting a Pull Request

1. Keep changes focused — one feature or fix per PR
2. Test your changes (`bash test/run.sh` for scripts, manual check for web)
3. Write a clear PR description explaining what changed and why
4. Push your branch and open a PR against `main`

## Code Style

- Shell scripts: follow existing patterns, use `main()` wrapper convention
- Web: follow existing Next.js/React patterns, use Tailwind for styling
