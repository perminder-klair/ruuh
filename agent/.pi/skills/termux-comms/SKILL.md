---
name: termux-comms
description: Android communication and media via Termux API — SMS send/receive, contacts, call log, phone calls, camera photos, microphone recording, text-to-speech, speech-to-text, media playback, file sharing, storage picker, calendar
---

# Termux Comms — SMS, Contacts, Camera, Audio & Media

Access Android communication and media features from the command line via Termux API.

## Quick Reference

| Command | Description |
|---------|-------------|
| `termux-sms-list` | List received SMS messages |
| `termux-sms-send` | Send an SMS message |
| `termux-contact-list` | List all contacts |
| `termux-call-log` | Show recent call history |
| `termux-telephony-call` | Initiate a phone call |
| `termux-telephony-cellinfo` | Current cell tower info |
| `termux-telephony-deviceinfo` | SIM and device telephony info |
| `termux-camera-info` | List available cameras and capabilities |
| `termux-camera-photo` | Take a photo with a camera |
| `termux-microphone-record` | Record audio from the microphone |
| `termux-tts-speak` | Speak text aloud (text-to-speech) |
| `termux-tts-engines` | List available TTS engines |
| `termux-speech-to-text` | Recognize speech from microphone |
| `termux-media-player` | Play/pause/stop audio files |
| `termux-media-scan` | Scan files so they appear in media apps |
| `termux-share` | Share content via Android share sheet |
| `termux-storage-get` | Pick a file using Android's storage picker |
| `termux-calendar-list` | List calendar events |

## Detailed Usage

### termux-sms-list

List SMS messages from the inbox.

```bash
termux-sms-list                         # recent messages
termux-sms-list -l 5                    # last 5 messages
termux-sms-list -t inbox               # inbox only (default)
termux-sms-list -t sent                 # sent messages
termux-sms-list -t draft               # drafts
termux-sms-list -t all                  # all messages
termux-sms-list -n                      # show phone numbers instead of names
```

**Flags:**
- `-l <limit>` — number of messages to return (default: 10)
- `-t <type>` — `inbox`, `sent`, `draft`, `all` (default: `inbox`)
- `-n` — show phone numbers instead of contact names
- `-o <offset>` — skip first N messages

```json
[
  {
    "threadid": 1,
    "type": "inbox",
    "read": true,
    "sender": "Alice",
    "number": "+441234567890",
    "received": "2025-01-15 14:30:00",
    "body": "Hey, are you free later?"
  }
]
```

### termux-sms-send

Send an SMS message.

```bash
termux-sms-send -n "+441234567890" "Hello from Pi!"
echo "Message body" | termux-sms-send -n "+441234567890"
termux-sms-send -n "+441234567890,+449876543210" "Group msg"
```

**Flags:**
- `-n <number>` — recipient phone number(s), comma-separated for multiple

### termux-contact-list

List all device contacts.

```bash
termux-contact-list
```

```json
[
  {
    "name": "Alice Smith",
    "number": "+441234567890"
  },
  {
    "name": "Bob Jones",
    "number": "+449876543210"
  }
]
```

### termux-call-log

Show recent call history.

```bash
termux-call-log                         # recent calls
termux-call-log -l 20                   # last 20 calls
termux-call-log -o 10                   # skip first 10
```

**Flags:**
- `-l <limit>` — number of entries (default: 10)
- `-o <offset>` — skip first N entries

```json
[
  {
    "name": "Alice",
    "phone_number": "+441234567890",
    "type": "INCOMING",
    "date": "2025-01-15 14:30:00",
    "duration": "120"
  }
]
```

### termux-telephony-call

Initiate a phone call. Opens the dialer and starts the call.

```bash
termux-telephony-call "+441234567890"
termux-telephony-call "999"                    # emergency number
```

The positional argument is the phone number to call. The call is placed immediately — no confirmation dialog is shown.

### termux-telephony-cellinfo

Current cell tower / mobile network information.

```bash
termux-telephony-cellinfo
```

Returns JSON array of visible cell towers with type (LTE, GSM, etc.), signal strength, and cell identifiers.

### termux-telephony-deviceinfo

SIM card and telephony device information.

```bash
termux-telephony-deviceinfo
```

```json
{
  "data_enabled": "true",
  "data_activity": "NONE",
  "data_state": "CONNECTED",
  "device_id": "",
  "device_software_version": "00",
  "phone_count": 1,
  "phone_type": "GSM",
  "network_operator": "23410",
  "network_operator_name": "O2 - UK",
  "network_country_iso": "gb",
  "network_type": "LTE",
  "network_roaming": false,
  "sim_country_iso": "gb",
  "sim_operator": "23410",
  "sim_operator_name": "O2 - UK",
  "sim_state": "READY"
}
```

### termux-camera-info

List available cameras and their capabilities.

```bash
termux-camera-info
```

```json
[
  {
    "id": "0",
    "facing": "back",
    "jpeg_output_sizes": [
      {"width": 4032, "height": 3024},
      {"width": 1920, "height": 1080}
    ],
    "focal_lengths": [4.25],
    "auto_exposure_modes": ["CONTROL_AE_MODE_ON"],
    "physical_size": {"width": 5.64, "height": 4.23}
  }
]
```

### termux-camera-photo

Take a photo and save it to a file.

```bash
termux-camera-photo /sdcard/ruuh/photo.jpg          # back camera (default)
termux-camera-photo -c 1 /sdcard/ruuh/selfie.jpg    # front camera
```

**Flags:**
- `-c <id>` — camera ID (use `termux-camera-info` to find IDs; `0` = back, `1` = front usually)

### termux-microphone-record

Record audio from the microphone.

```bash
termux-microphone-record -f /sdcard/ruuh/recording.m4a
termux-microphone-record -f /sdcard/ruuh/rec.m4a -l 30 -e aac -b 128000 -r 44100 -c 1
termux-microphone-record -q                        # stop recording
```

**Flags:**
- `-f <file>` — output file path
- `-l <seconds>` — max recording length in seconds (default: unlimited)
- `-e <encoder>` — `aac`, `amr_wb`, `amr_nb` (default: `aac`)
- `-b <bitrate>` — bitrate in bits/sec (default: 128000)
- `-r <rate>` — sample rate in Hz (default: 44100)
- `-c <channels>` — `1` (mono) or `2` (stereo) (default: `1`)
- `-q` — stop current recording

### termux-tts-speak

Speak text aloud using text-to-speech.

```bash
termux-tts-speak "Hello, I am Pi"
echo "Build complete" | termux-tts-speak
termux-tts-speak -l en -r 1.2 -p 1.0 "Faster speech"
termux-tts-speak -e com.google.android.tts "Using Google TTS"
```

**Flags:**
- `-e <engine>` — TTS engine (use `termux-tts-engines` to list)
- `-l <language>` — language code (e.g. `en`, `es`, `fr`)
- `-n <region>` — region/country code (e.g. `US`, `GB`)
- `-p <pitch>` — pitch multiplier (default: 1.0)
- `-r <rate>` — speech rate multiplier (default: 1.0)
- `-s <stream>` — audio stream: `ALARM`, `MUSIC`, `NOTIFICATION`, `RING`, `SYSTEM`

### termux-tts-engines

List available text-to-speech engines.

```bash
termux-tts-engines
```

```json
[
  {
    "name": "com.google.android.tts",
    "label": "Google Text-to-speech Engine",
    "default": true
  }
]
```

### termux-speech-to-text

Recognize speech from the microphone and return it as text. Blocks until the user stops speaking.

```bash
termux-speech-to-text                          # listen and return final text
termux-speech-to-text -p                       # stream partial results
```

**Flags:**
- `-p` — output partial (interim) results as they are recognized, one per line

Returns the recognized text as a plain string. With `-p`, partial results stream line by line, with the final result on the last line.

### termux-media-player

Control audio playback.

```bash
termux-media-player play /sdcard/ruuh/song.mp3    # play a file
termux-media-player play "https://example.com/stream.mp3"  # play URL
termux-media-player pause                         # pause playback
termux-media-player stop                          # stop playback
termux-media-player info                          # current playback info
```

**Actions:** `play <file|url>`, `pause`, `stop`, `info`

### termux-media-scan

Scan files so they appear in Android's media library (Gallery, Music, etc.).

```bash
termux-media-scan /sdcard/ruuh/photo.jpg
termux-media-scan -r /sdcard/ruuh/photos/           # recursive scan
termux-media-scan -v /sdcard/ruuh/video.mp4          # verbose output
```

**Flags:**
- `-r` — scan recursively
- `-v` — verbose output

### termux-share

Share content via Android's share sheet (sends to other apps).

```bash
termux-share /sdcard/ruuh/photo.jpg                     # share a file
echo "Check this out" | termux-share                   # share text
termux-share -a send /sdcard/ruuh/document.pdf           # send action
termux-share -a view "https://example.com"             # open URL
termux-share -c "image/jpeg" /sdcard/ruuh/photo.jpg      # explicit MIME type
```

**Flags:**
- `-a <action>` — `send` (default) or `view`
- `-c <type>` — MIME content type (auto-detected from file if omitted)
- `-d` — share default (skip chooser dialog)
- `-t <title>` — share dialog title

### termux-storage-get

Open Android's file picker and copy the chosen file to a destination.

```bash
termux-storage-get /sdcard/ruuh/picked-file.pdf
```

This opens Android's file picker UI. The selected file is copied to the given path.

### termux-calendar-list

List calendar events.

```bash
termux-calendar-list
```

Returns a JSON array of calendar events with title, description, start/end times, location, and calendar account info.

## Common Patterns

### Read and reply to latest SMS

```bash
MSG=$(termux-sms-list -l 1 | jq -r '.[0]')
SENDER=$(echo "$MSG" | jq -r '.number')
BODY=$(echo "$MSG" | jq -r '.body')
echo "From: $SENDER"
echo "Message: $BODY"

# Reply
termux-sms-send -n "$SENDER" "Got it, thanks!"
```

### Take a photo and share it

```bash
termux-camera-photo /sdcard/ruuh/snap.jpg
termux-media-scan /sdcard/ruuh/snap.jpg
termux-share /sdcard/ruuh/snap.jpg
```

### Voice notification for task completion

```bash
# Run at the end of a long process
termux-tts-speak "Your build has finished successfully"
termux-vibrate -d 300
```

### Record a voice memo

```bash
termux-toast "Recording... speak now"
termux-microphone-record -f /sdcard/ruuh/memo.m4a -l 60
# Recording runs in background for up to 60 seconds
# Stop early with:
termux-microphone-record -q
termux-toast "Recording saved"
```

### Find a contact and send SMS

```bash
# Search contacts for "Alice"
CONTACT=$(termux-contact-list | jq -r '.[] | select(.name | test("Alice"; "i"))')
NUMBER=$(echo "$CONTACT" | jq -r '.number')

if [ -n "$NUMBER" ]; then
  termux-sms-send -n "$NUMBER" "Hey Alice!"
  termux-toast "SMS sent to $NUMBER"
else
  termux-toast "Contact not found"
fi
```

### Voice-commanded SMS

```bash
# Speak to send a text message
termux-tts-speak "Who should I text?"
NAME=$(termux-speech-to-text)
CONTACT=$(termux-contact-list | jq -r --arg n "$NAME" '.[] | select(.name | test($n; "i"))')
NUMBER=$(echo "$CONTACT" | jq -r '.number')

if [ -z "$NUMBER" ]; then
  termux-tts-speak "Contact not found"
  exit 1
fi

termux-tts-speak "What should I say?"
MESSAGE=$(termux-speech-to-text)
termux-sms-send -n "$NUMBER" "$MESSAGE"
termux-tts-speak "Message sent"
```

### Audio alert with fallback

```bash
# Try to play a sound file, fall back to TTS
if [ -f /sdcard/ruuh/alert.mp3 ]; then
  termux-media-player play /sdcard/ruuh/alert.mp3
else
  termux-tts-speak "Alert: task requires your attention"
fi
termux-vibrate -d 500
```
