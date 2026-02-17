---
name: termux-system
description: Android system integration via Termux API — job scheduling, infrared transmit, USB device access, NFC tag read/write, hardware keystore crypto
---

# Termux System — Scheduling, IR, USB, NFC & Keystore

System-level automation and hardware interfaces from the command line via Termux API.

## Quick Reference

| Command | Description |
|---------|-------------|
| `termux-job-scheduler` | Schedule scripts to run later or periodically |
| `termux-infrared-frequencies` | Query IR transmitter supported frequency ranges |
| `termux-infrared-transmit` | Transmit IR patterns at a carrier frequency |
| `termux-usb` | List or access USB devices |
| `termux-nfc` | Read or write NFC tags |
| `termux-keystore` | Hardware-backed crypto key management |

## Detailed Usage

### termux-job-scheduler

Schedule scripts to run at a later time or on a recurring basis, optionally requiring network or charging.

```bash
termux-job-scheduler --script /sdcard/ruuh/backup.sh       # run once
termux-job-scheduler --script /sdcard/ruuh/sync.sh \
    --job-id 1 --period-ms 3600000                        # every hour
termux-job-scheduler --script /sdcard/ruuh/sync.sh \
    --job-id 2 --period-ms 86400000 --network unmetered \
    --charging true --persisted true                       # daily on WiFi while charging
termux-job-scheduler --pending                             # list pending jobs
termux-job-scheduler --cancel 1                            # cancel job by ID
termux-job-scheduler --cancel-all                          # cancel all jobs
```

**Flags:**
- `--script <path>` — path to script to execute
- `--job-id <id>` — integer job identifier (for cancel/update)
- `--period-ms <ms>` — repeat interval in milliseconds (0 = run once)
- `--network <type>` — required network: `any`, `unmetered`, `none` (default: `any`)
- `--charging <bool>` — require device charging: `true` or `false` (default: `false`)
- `--persisted <bool>` — survive reboots: `true` or `false` (default: `false`)
- `--pending` — list all pending scheduled jobs
- `--cancel <id>` — cancel a specific job by ID
- `--cancel-all` — cancel all scheduled jobs

### termux-infrared-frequencies

Query the supported carrier frequency ranges of the device's IR transmitter.

```bash
termux-infrared-frequencies
```

```json
[
  {"min": 30000, "max": 30000},
  {"min": 33000, "max": 33000},
  {"min": 36000, "max": 36000},
  {"min": 38000, "max": 38000},
  {"min": 40000, "max": 40000},
  {"min": 56000, "max": 56000}
]
```

Returns an array of objects with `min` and `max` frequency in Hz. An empty array means no IR transmitter is available.

### termux-infrared-transmit

Transmit an IR pattern at a given carrier frequency.

```bash
termux-infrared-transmit -f 38000 9000,4500,560,560,560,1690,560,560,560,65535
```

**Flags:**
- `-f <hz>` — carrier frequency in Hz (e.g. `38000` for most consumer IR)

The positional argument is a comma-separated list of on/off durations in microseconds. The first value is "on", the second is "off", alternating. These patterns are specific to the target device's IR protocol (NEC, Samsung, Sony, etc.).

### termux-usb

List or access USB devices connected to the Android device.

```bash
termux-usb -l                          # list connected USB devices
termux-usb -r /dev/bus/usb/001/002     # request permission for a device
termux-usb -e "cat" /dev/bus/usb/001/002  # run command with device fd
termux-usb -E /dev/bus/usb/001/002     # print device info
```

**Flags:**
- `-l` — list connected USB device paths
- `-r <device>` — request permission to access a USB device
- `-e <command>` — execute a command with the device file descriptor passed via env
- `-E <device>` — print USB device information (vendor/product IDs, class, etc.)

```json
["/dev/bus/usb/001/002", "/dev/bus/usb/001/003"]
```

### termux-nfc

Read from or write to NFC tags. The command waits for a tag to be tapped.

```bash
termux-nfc -r                          # read tag (wait for tap)
termux-nfc -w -t text "Hello NFC"      # write text record
termux-nfc -w -t url "https://example.com"  # write URL record
```

**Flags:**
- `-r` — read mode: wait for tag tap and return contents
- `-w` — write mode: wait for tag tap and write data
- `-t <type>` — NDEF record type for writing: `text` or `url`

Read output:

```json
{
  "type": "NDEF",
  "records": [
    {
      "type": "text",
      "payload": "Hello NFC"
    }
  ]
}
```

### termux-keystore

Hardware-backed cryptographic key management using Android Keystore. Keys never leave the secure hardware.

```bash
termux-keystore list                           # list stored keys
termux-keystore generate "mykey" -a RSA -s 2048  # generate RSA-2048 key
termux-keystore generate "ec256" -a EC -s 256    # generate EC P-256 key
termux-keystore sign "mykey" < data.bin > sig.bin  # sign data
termux-keystore verify "mykey" -s sig.bin < data.bin  # verify signature
termux-keystore delete "mykey"                 # delete a key
```

**Subcommands:**
- `list` — list all keys in the keystore
- `generate <alias>` — generate a new key pair
  - `-a <algorithm>` — `RSA` or `EC`
  - `-s <size>` — key size: `2048`, `4096` for RSA; `256` for EC
- `sign <alias>` — sign data from stdin, output signature to stdout
- `verify <alias>` — verify a signature against data
  - `-s <signature-file>` — path to the signature file
- `delete <alias>` — delete a key from the keystore

```json
["mykey", "ec256", "backup-signing-key"]
```

## Common Patterns

### Periodic backup on WiFi

```bash
# Create backup script
cat > /sdcard/ruuh/backup.sh << 'SCRIPT'
#!/bin/bash
tar czf "/sdcard/ruuh/backup-$(date +%Y%m%d).tar.gz" /sdcard/ruuh/MEMORY.md /sdcard/ruuh/AGENTS.md
SCRIPT
chmod +x /sdcard/ruuh/backup.sh

# Schedule daily on WiFi
termux-job-scheduler --script /sdcard/ruuh/backup.sh \
    --job-id 10 --period-ms 86400000 --network unmetered --persisted true
```

### TV power toggle via IR

```bash
# Check IR is available
FREQS=$(termux-infrared-frequencies)
if [ "$FREQS" = "[]" ]; then
  echo "No IR transmitter on this device"
  exit 1
fi

# Samsung TV power toggle (NEC protocol, 38kHz)
termux-infrared-transmit -f 38000 \
    9000,4500,560,560,560,560,560,1690,560,1690,560,560,560,560,560,560,560,560,560,1690,560,1690,560,560,560,560,560,1690,560,1690,560,1690,560,1690,560,560,560,1690,560,560,560,560,560,560,560,560,560,560,560,560,560,1690,560,560,560,1690,560,1690,560,1690,560,1690,560,1690,560,1690,560,65535
```

### NFC tap automation

```bash
# Read an NFC tag and act on contents
TAG=$(termux-nfc -r)
TYPE=$(echo "$TAG" | jq -r '.records[0].type')
PAYLOAD=$(echo "$TAG" | jq -r '.records[0].payload')

case "$TYPE" in
  url)
    termux-open-url "$PAYLOAD"
    ;;
  text)
    termux-toast "NFC: $PAYLOAD"
    ;;
esac
```

### Sign a file with hardware key

```bash
# One-time: generate a signing key
termux-keystore generate "file-signer" -a EC -s 256

# Sign a file
termux-keystore sign "file-signer" < /sdcard/ruuh/release.tar.gz > /sdcard/ruuh/release.sig
termux-toast "File signed"

# Verify later
termux-keystore verify "file-signer" -s /sdcard/ruuh/release.sig < /sdcard/ruuh/release.tar.gz
echo "Signature valid: $?"
```
