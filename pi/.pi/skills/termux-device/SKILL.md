---
name: termux-device
description: Android device control via Termux API — battery, brightness, torch, vibrate, volume, sensors, fingerprint, location, WiFi, clipboard, notifications, dialogs, toasts, wake lock, wallpaper, downloads
---

# Termux Device — Android Hardware, Sensors & UI

Control device hardware, sensors, and system UI from the command line via Termux API.

## Quick Reference

| Command | Description |
|---------|-------------|
| `termux-battery-status` | Battery level, status, health, temperature |
| `termux-brightness` | Set screen brightness (0–255) |
| `termux-torch` | Toggle flashlight on/off |
| `termux-vibrate` | Vibrate the device |
| `termux-volume` | Get/set audio stream volumes |
| `termux-sensor` | Read device sensors (accelerometer, gyroscope, etc.) |
| `termux-fingerprint` | Authenticate via fingerprint scanner |
| `termux-location` | Get GPS/network location |
| `termux-wifi-connectioninfo` | Current WiFi connection details |
| `termux-wifi-scaninfo` | Scan nearby WiFi networks |
| `termux-wifi-enable` | Enable/disable WiFi |
| `termux-clipboard-get` | Read clipboard contents |
| `termux-clipboard-set` | Set clipboard contents |
| `termux-notification` | Show a persistent notification |
| `termux-notification-remove` | Remove a notification by ID |
| `termux-dialog` | Show an interactive dialog (input, confirm, list, etc.) |
| `termux-toast` | Show a short toast message |
| `termux-wake-lock` | Acquire CPU wake lock (prevent sleep) |
| `termux-wake-unlock` | Release CPU wake lock |
| `termux-wallpaper` | Set device wallpaper |
| `termux-download` | Download a file using Android's DownloadManager |

## Detailed Usage

### termux-battery-status

Returns JSON with battery state.

```bash
termux-battery-status
```

```json
{
  "health": "GOOD",
  "percentage": 72,
  "plugged": "UNPLUGGED",
  "status": "DISCHARGING",
  "temperature": 28.5,
  "current": -412000
}
```

### termux-brightness

Set screen brightness. Use `auto` for automatic or a value 0–255.

```bash
termux-brightness 128        # mid brightness
termux-brightness auto       # automatic
termux-brightness 0          # minimum
```

### termux-torch

Toggle the flashlight.

```bash
termux-torch on
termux-torch off
```

### termux-vibrate

Vibrate the device.

```bash
termux-vibrate                # default duration
termux-vibrate -d 500         # vibrate for 500ms
termux-vibrate -f             # force vibrate even in silent mode
```

**Flags:**
- `-d <ms>` — duration in milliseconds (default: 1000)
- `-f` — force vibrate in silent mode

### termux-volume

Get or set audio volumes.

```bash
termux-volume                          # list all audio streams and volumes
termux-volume music 8                  # set music volume to 8
termux-volume ring 5                   # set ring volume to 5
```

**Streams:** `alarm`, `music`, `notification`, `ring`, `system`, `call`

Output (no args):

```json
[
  {"stream": "music", "volume": 8, "max_volume": 15},
  {"stream": "ring", "volume": 5, "max_volume": 7},
  {"stream": "alarm", "volume": 6, "max_volume": 7}
]
```

### termux-sensor

Read hardware sensors.

```bash
termux-sensor -l                       # list all available sensors
termux-sensor -s "accelerometer"       # read accelerometer once
termux-sensor -s "accelerometer" -n 5  # read 5 samples
termux-sensor -s "accelerometer" -d 100  # delay 100ms between reads
termux-sensor -a                       # read all sensors once
```

**Flags:**
- `-l` — list available sensors
- `-s <name>` — sensor to read
- `-n <count>` — number of readings (default: 1)
- `-d <ms>` — delay between readings in milliseconds
- `-a` — read all sensors

### termux-fingerprint

Authenticate using the device fingerprint scanner. Blocks until scan or timeout.

```bash
termux-fingerprint
```

```json
{
  "auth_result": "AUTH_RESULT_SUCCESS"
}
```

Possible `auth_result` values: `AUTH_RESULT_SUCCESS`, `AUTH_RESULT_FAILURE`, `AUTH_RESULT_UNKNOWN`

### termux-location

Get device location via GPS or network.

```bash
termux-location                        # default provider
termux-location -p gps                 # GPS provider (more accurate, slower)
termux-location -p network             # network provider (faster, less accurate)
termux-location -r once                # single reading (default)
termux-location -r updates             # continuous updates
```

**Flags:**
- `-p <provider>` — `gps` or `network` (default: `gps`)
- `-r <request>` — `once` or `updates` (default: `once`)

```json
{
  "latitude": 51.5074,
  "longitude": -0.1278,
  "altitude": 11.0,
  "accuracy": 20.0,
  "bearing": 0.0,
  "speed": 0.0,
  "elapsedMs": 42,
  "provider": "gps"
}
```

### termux-wifi-connectioninfo

Current WiFi connection info.

```bash
termux-wifi-connectioninfo
```

```json
{
  "bssid": "02:00:00:00:00:00",
  "frequency_mhz": 5180,
  "ip": "192.168.1.100",
  "link_speed_mbps": 866,
  "mac_address": "02:00:00:00:00:00",
  "network_id": 0,
  "rssi": -45,
  "ssid": "MyNetwork",
  "ssid_hidden": false,
  "supplicant_state": "COMPLETED"
}
```

### termux-wifi-scaninfo

Scan for nearby WiFi networks.

```bash
termux-wifi-scaninfo
```

Returns a JSON array of discovered networks with SSID, BSSID, signal strength, frequency, and capabilities.

### termux-wifi-enable

Enable or disable WiFi.

```bash
termux-wifi-enable true
termux-wifi-enable false
```

### termux-clipboard-get

Read the current clipboard contents.

```bash
termux-clipboard-get
```

Returns the plain text clipboard content.

### termux-clipboard-set

Set the clipboard contents.

```bash
termux-clipboard-set "Hello, world!"
echo "copied text" | termux-clipboard-set
```

### termux-notification

Show a persistent notification in the notification shade.

```bash
termux-notification -t "Title" -c "Body text"
termux-notification --id mynotif -t "Download" -c "In progress..." --ongoing
termux-notification --id mynotif -t "Download" -c "Complete!" --alert-once
```

**Flags:**
- `-t <title>` — notification title
- `-c <content>` — notification body text
- `--id <id>` — unique ID (for updates/removal)
- `--ongoing` — persistent notification (user can't dismiss)
- `--alert-once` — only alert on first show (for updates)
- `--priority <p>` — `high`, `low`, `max`, `min`, `default`
- `--sound` — play default notification sound
- `--vibrate <pattern>` — vibration pattern (comma-separated ms)
- `--led-color <rrggbb>` — LED colour
- `--led-on <ms>` — LED on duration
- `--led-off <ms>` — LED off duration
- `--action <cmd>` — command to run when notification is tapped
- `--button1 <label>` — first action button label
- `--button1-action <cmd>` — command for first button
- `--button2 <label>` / `--button2-action <cmd>` — second action button
- `--button3 <label>` / `--button3-action <cmd>` — third action button

### termux-notification-remove

Remove a notification by its ID.

```bash
termux-notification-remove mynotif
```

### termux-dialog

Show an interactive UI dialog and return user input as JSON.

```bash
termux-dialog                                    # default text input
termux-dialog confirm -t "Are you sure?"         # yes/no confirm
termux-dialog checkbox -v "A,B,C" -t "Pick"     # multi-select checkboxes
termux-dialog radio -v "Red,Green,Blue"          # single-select radio
termux-dialog spinner -v "Opt1,Opt2,Opt3"        # dropdown spinner
termux-dialog date -t "Pick a date"              # date picker
termux-dialog time -t "Pick a time"              # time picker
termux-dialog sheet -v "Copy,Paste,Delete"       # bottom sheet
termux-dialog speech -t "Speak now"              # speech input
```

**Widget types:** `confirm`, `checkbox`, `counter`, `date`, `radio`, `sheet`, `spinner`, `speech`, `text`, `time`

**Common flags:**
- `-t <title>` — dialog title
- `-v <values>` — comma-separated values for list-based widgets
- `-i <hint>` — input hint text

Returns JSON with `code` (-1 = cancelled, -2 = error, 0+ = success) and `text` (user input).

### termux-toast

Show a brief toast message.

```bash
termux-toast "Hello!"
termux-toast -g middle "Centred toast"
termux-toast -b white -c black "Custom colours"
termux-toast -s                                  # short duration (default)
```

**Flags:**
- `-g <position>` — gravity: `top`, `middle`, `bottom` (default: `bottom`)
- `-b <colour>` — background colour
- `-c <colour>` — text colour
- `-s` — short duration (default)

### termux-wake-lock / termux-wake-unlock

Keep the CPU awake (prevents device sleep).

```bash
termux-wake-lock       # acquire lock
# ... do long-running work ...
termux-wake-unlock     # release lock
```

### termux-wallpaper

Set the device wallpaper.

```bash
termux-wallpaper -f /sdcard/photo.jpg       # from file
termux-wallpaper -u "https://example.com/img.jpg"  # from URL
termux-wallpaper -l                          # set lock screen wallpaper
```

**Flags:**
- `-f <file>` — image file path
- `-u <url>` — image URL
- `-l` — set as lock screen wallpaper (instead of home screen)

### termux-download

Download a file using Android's DownloadManager.

```bash
termux-download "https://example.com/file.zip"
termux-download -t "My Download" -d "Downloading file..." "https://example.com/file.zip"
```

**Flags:**
- `-t <title>` — notification title
- `-d <description>` — notification description

## Common Patterns

### Battery check before long tasks

```bash
BATTERY=$(termux-battery-status)
LEVEL=$(echo "$BATTERY" | jq -r '.percentage')
STATUS=$(echo "$BATTERY" | jq -r '.status')

if [ "$LEVEL" -lt 20 ] && [ "$STATUS" = "DISCHARGING" ]; then
  termux-toast "Battery low ($LEVEL%). Plug in before running."
else
  echo "Battery OK: ${LEVEL}% (${STATUS})"
fi
```

### Notification with progress updates

```bash
termux-notification --id build -t "Build" -c "Starting..." --ongoing
# ... run build ...
termux-notification --id build -t "Build" -c "Tests passed" --alert-once
# ... deploy ...
termux-notification-remove build
termux-toast "Build complete!"
```

### Get user confirmation via dialog

```bash
RESULT=$(termux-dialog confirm -t "Deploy to production?")
if echo "$RESULT" | jq -e '.text == "yes"' > /dev/null 2>&1; then
  echo "Deploying..."
else
  echo "Cancelled."
fi
```

### Location-stamped log

```bash
LOC=$(termux-location -p network)
LAT=$(echo "$LOC" | jq -r '.latitude')
LON=$(echo "$LOC" | jq -r '.longitude')
echo "[$(date -Iseconds)] lat=$LAT lon=$LON" >> /sdcard/pi/location.log
```

### Keep device awake during a task

```bash
termux-wake-lock
# ... long running process ...
termux-wake-unlock
termux-vibrate -d 200
termux-toast "Task finished"
```
