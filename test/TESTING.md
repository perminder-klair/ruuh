# Development Testing

Testing DroidClaw scripts normally requires an Android phone with Termux — a slow cycle of push, pull, run, and debug. The Docker test environment eliminates this by simulating Termux locally, cutting iteration time from 5-10 minutes to ~30 seconds.

## Quick Start

```bash
# Run all scripts and verify outputs
bash test/run.sh

# Interactive shell for debugging
bash test/run.sh --interactive

# Test a single script
docker run --rm droidclaw-test bash /scripts/pi-setup.sh
```

## How It Works

The Docker container (Ubuntu 22.04) recreates the Termux environment:

- **Directory structure** matches Termux: `$PREFIX` at `/data/data/com.termux/files/usr`, `$HOME` at `/data/data/com.termux/files/home`
- **Mock commands** in `$PREFIX/bin/` intercept Termux-specific binaries (`pkg`, `proot-distro`, `termux-setup-storage`, `termux-*` APIs)
- **Real Node.js 22** is installed so the proot inline script's `npm install -g` actually runs
- **Scripts run unmodified** — no changes to production code, all mocking is external via `$PATH`

### What `test/run.sh` Does

1. Builds the Docker image (`droidclaw-test`)
2. Runs `pi-setup.sh`, `skills-setup.sh`, and `dashboard-setup.sh` in sequence
3. Runs `verify.sh` to check 17 assertions against the resulting filesystem

## Mock Scripts

All mocks live in `test/mocks/bin/` and are copied to `$PREFIX/bin/` inside the container.

### `pkg`

Translates Termux package commands to `apt-get`:

| Termux Command | Docker Equivalent |
|---|---|
| `pkg update -y` | `apt-get update` |
| `pkg upgrade -y -o Dpkg::Options::="--force-confnew"` | `apt-get upgrade -y -o Dpkg::Options::="--force-confnew"` |
| `pkg install -y curl git` | `apt-get install -y curl git` |
| `pkg install -y proot-distro termux-api` | Skipped (these are mocked separately) |

Packages that have dedicated mocks (`proot-distro`, `termux-api`, `ollama`) are filtered out automatically.

### `proot-distro`

The most important mock. Simulates proot-distro without actual proot:

- **`proot-distro install ubuntu`** — Creates a fake rootfs directory at `$PREFIX/var/lib/proot-distro/installed-rootfs/ubuntu/` with the expected subdirectories (`usr/local/bin`, `root`, `etc`).
- **`proot-distro list`** — Outputs text matching the format `pi-setup.sh` greps for (`ubuntu.*Installed`).
- **`proot-distro login ubuntu -- bash -c '<script>'`** — Executes `<script>` directly in a subshell (we're already on Ubuntu). Also creates `/sdcard/pi` as a symlink to `$HOME/storage/shared/pi` to simulate the Android shared storage bind mount.

This means the inline Ubuntu setup script from `pi-setup.sh` step 6 (which installs Node.js, npm packages, and creates symlinks) actually runs for real.

### `termux-setup-storage`

Creates the storage directory tree that Termux normally provides after the user grants permission:

```
$HOME/storage/
├── shared/
├── downloads/
├── dcim/
├── pictures/
├── music/
└── movies/
```

### `termux-api-mock`

A single script that handles all 35+ Termux API commands. Each `termux-*` command (e.g., `termux-battery-status`, `termux-sms-send`) is a symlink pointing to this script. It checks `$0` (the invoked command name) and returns appropriate sample JSON or status messages.

Example outputs:

```bash
$ termux-battery-status
{"health":"GOOD","percentage":85,"plugged":"UNPLUGGED","status":"DISCHARGING","temperature":25.0}

$ termux-location
{"latitude":37.7749,"longitude":-122.4194,"altitude":10.0,"accuracy":5.0,"provider":"gps"}

$ termux-wifi-connectioninfo
{"bssid":"00:11:22:33:44:55","frequency_mhz":5180,"ip":"192.168.1.100","link_speed_mbps":866,"rssi":-45,"ssid":"TestWifi"}
```

### `ollama`

Stubs the three subcommands used by `ollama-setup.sh`:

- `ollama serve` — Blocks forever (like the real server)
- `ollama signin` — No-op, prints success
- `ollama pull <model>` — No-op, prints success

## Verification Checks

`test/verify.sh` runs 17 assertions grouped by script:

### pi-setup.sh (11 checks)

| Check | What It Verifies |
|---|---|
| Agent files exist | `AGENTS.md`, `SOUL.md`, `MEMORY.md` in `~/storage/shared/pi/` with content |
| `start-pi` executable | Launcher script exists at `$PREFIX/bin/start-pi` with execute permission |
| `start-pi` content | Contains `proot-distro login ubuntu` command |
| Ubuntu rootfs | Directory exists at expected proot-distro path |
| Rootfs structure | `/usr/local/bin` exists inside rootfs |
| API symlinks | 10+ `termux-*` commands symlinked into rootfs `/usr/local/bin/` |
| `/sdcard/pi` | Bind mount simulation exists |
| Node.js | `node -v` succeeds |
| pi-coding-agent | `npm list -g @mariozechner/pi-coding-agent` succeeds |

### skills-setup.sh (4 checks)

| Check | What It Verifies |
|---|---|
| Skill files | `termux-device/SKILL.md`, `termux-comms/SKILL.md`, `termux-system/SKILL.md` exist with content |
| Skill count | Exactly 3 `SKILL.md` files found |

### dashboard-setup.sh (2 checks)

| Check | What It Verifies |
|---|---|
| Dashboard extension | `dashboard.ts` exists with content |
| Extensions directory | `.pi/extensions/` directory exists |

## File Structure

```
test/
├── Dockerfile              # Ubuntu 22.04 with Termux directory layout + Node.js 22
├── run.sh                  # Build image, run scripts, verify (supports --interactive)
├── verify.sh               # 17 post-run assertions
├── TESTING.md              # This file
└── mocks/
    └── bin/
        ├── pkg                   # Wraps apt-get, filters mocked packages
        ├── proot-distro          # Fakes rootfs, runs inline scripts directly
        ├── termux-setup-storage  # Creates storage directory tree
        ├── termux-api-mock       # Generic handler, symlinked as 35+ termux-* commands
        └── ollama                # Stubs serve/signin/pull
```

## Troubleshooting

### Interactive Debugging

```bash
bash test/run.sh --interactive
```

This drops you into a bash shell inside the container. From there you can run scripts one at a time and inspect the filesystem:

```bash
# Run the main setup
bash /scripts/pi-setup.sh

# Check what was created
ls -la ~/storage/shared/pi/
ls -la $PREFIX/bin/start-pi
cat $PREFIX/bin/start-pi

# Check the proot rootfs
ls -la $PREFIX/var/lib/proot-distro/installed-rootfs/ubuntu/usr/local/bin/

# Run verification
bash /test/verify.sh
```

### Network Issues

The setup scripts use `curl` to download files from GitHub (`raw.githubusercontent.com`). If downloads fail, check that your Docker daemon has internet access. For fully offline testing, you could mount the local `pi/` directory into the container and modify the scripts to use local paths.

### Adding New Checks

To add verification for a new script or feature, edit `test/verify.sh` and use the `check` helper:

```bash
# Test that a file exists and has content
[ -s "/path/to/file" ]
check "Description of what this verifies" $?

# Test that a command succeeds
some-command >/dev/null 2>&1
check "Description" $?
```

### Adding New Mocks

To mock a new Termux command that returns JSON, no code changes needed — the generic `termux-api-mock` handles unknown commands with a default response. For specific output, add a case to `test/mocks/bin/termux-api-mock`.

For entirely new commands (not `termux-*`), create a new script in `test/mocks/bin/` and it will automatically be copied to `$PREFIX/bin/` during the Docker build.
