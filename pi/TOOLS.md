# TOOLS.md — Quick Reference

All available Termux API commands from installed skills. For full usage, flags, and examples see the skill files in `.pi/skills/`.

## termux-comms (18 commands)

**SMS**
- `termux-sms-list` — List received SMS messages
- `termux-sms-send` — Send an SMS message

**Contacts & Telephony**
- `termux-contact-list` — List all contacts
- `termux-call-log` — Show recent call history
- `termux-telephony-call` — Initiate a phone call
- `termux-telephony-cellinfo` — Current cell tower info
- `termux-telephony-deviceinfo` — SIM and device telephony info

**Camera**
- `termux-camera-info` — List available cameras and capabilities
- `termux-camera-photo` — Take a photo with a camera

**Audio**
- `termux-microphone-record` — Record audio from the microphone
- `termux-speech-to-text` — Recognize speech from microphone

**TTS**
- `termux-tts-speak` — Speak text aloud
- `termux-tts-engines` — List available TTS engines

**Media**
- `termux-media-player` — Play/pause/stop audio files
- `termux-media-scan` — Scan files so they appear in media apps

**Sharing & Storage**
- `termux-share` — Share content via Android share sheet
- `termux-storage-get` — Pick a file using Android's storage picker

**Calendar**
- `termux-calendar-list` — List calendar events

## termux-device (23 commands)

**Battery & Power**
- `termux-battery-status` — Battery level, status, health, temperature

**Display**
- `termux-brightness` — Set screen brightness (0–255)
- `termux-torch` — Toggle flashlight on/off

**Audio & Volume**
- `termux-audio-info` — Current audio output device and routing info
- `termux-volume` — Get/set audio stream volumes
- `termux-vibrate` — Vibrate the device

**Sensors**
- `termux-sensor` — Read device sensors (accelerometer, gyroscope, etc.)
- `termux-fingerprint` — Authenticate via fingerprint scanner

**Location**
- `termux-location` — Get GPS/network location

**WiFi**
- `termux-wifi-connectioninfo` — Current WiFi connection details
- `termux-wifi-scaninfo` — Scan nearby WiFi networks
- `termux-wifi-enable` — Enable/disable WiFi

**Clipboard**
- `termux-clipboard-get` — Read clipboard contents
- `termux-clipboard-set` — Set clipboard contents

**Notifications**
- `termux-notification` — Show a persistent notification
- `termux-notification-remove` — Remove a notification by ID
- `termux-notification-list` — List active notifications

**Dialogs & Toasts**
- `termux-dialog` — Show an interactive dialog (input, confirm, list, etc.)
- `termux-toast` — Show a short toast message

**Wake Lock**
- `termux-wake-lock` — Acquire CPU wake lock (prevent sleep)
- `termux-wake-unlock` — Release CPU wake lock

**Wallpaper**
- `termux-wallpaper` — Set device wallpaper

**Downloads**
- `termux-download` — Download a file using Android's DownloadManager

## termux-system (6 commands)

**Scheduling**
- `termux-job-scheduler` — Schedule scripts to run later or periodically

**IR**
- `termux-infrared-frequencies` — Query IR transmitter supported frequency ranges
- `termux-infrared-transmit` — Transmit IR patterns at a carrier frequency

**USB**
- `termux-usb` — List or access USB devices

**NFC**
- `termux-nfc` — Read or write NFC tags

**Keystore**
- `termux-keystore` — Hardware-backed crypto key management
