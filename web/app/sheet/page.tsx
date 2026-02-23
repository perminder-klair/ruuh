import type { Metadata } from "next";
import {
  Zap,
  Rocket,
  Download,
  FolderOpen,
  Smartphone,
  MessageSquare,
  Settings,
  Sparkles,
  Code,
  Cpu,
  CircleHelp,
  FileText,
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import {
  AnimatedDiv,
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  GlowIcon,
} from "@/components/motion";

export const metadata: Metadata = {
  title: "Cheatsheet — Ruuh Quick Reference",
  description:
    "Quick-reference cheatsheet for Ruuh commands, Termux API, paths, skills, and common patterns.",
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const tocSections = [
  { id: "quick-start", label: "Quick Start" },
  { id: "setup", label: "Setup" },
  { id: "paths", label: "Paths" },
  { id: "device", label: "Device API" },
  { id: "comms", label: "Comms API" },
  { id: "system", label: "System API" },
  { id: "skills", label: "Skills" },
  { id: "patterns", label: "Patterns" },
  { id: "ollama", label: "Ollama" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

const quickStartCmds = [
  {
    label: "Install everything",
    cmd: "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/setup.sh | bash",
  },
  { label: "Start the agent", cmd: "ruuh" },
  { label: "Start with local model", cmd: "ruuh --ollama" },
  { label: "Web dashboard", cmd: "http://localhost:3000" },
];

const setupScripts = [
  {
    name: "Full setup (all-in-one)",
    desc: "Installs Termux env, Ubuntu proot, Ollama, and skills in one go.",
    cmd: "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/setup.sh | bash",
  },
  {
    name: "Ruuh core only",
    desc: "Termux + Ubuntu proot environment with pi-coding-agent.",
    cmd: "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/ruuh-setup.sh | bash",
  },
  {
    name: "Ollama setup",
    desc: "Install Ollama and pull a local model for offline use.",
    cmd: "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/ollama-setup.sh | bash",
  },
  {
    name: "Termux API skills",
    desc: "Install skill files for device and comms APIs.",
    cmd: "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/skills-setup.sh | bash",
  },
  {
    name: "Extra skills",
    desc: "Install community skills (blog watcher, weather, etc.).",
    cmd: "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/extra-skills-setup.sh | bash",
  },
];

const filePaths = [
  { context: "Termux", path: "~/storage/shared/ruuh/" },
  { context: "Ubuntu (proot)", path: "~/agent/" },
  { context: "Android File Manager", path: "Internal Storage > ruuh" },
];

const configFiles = [
  { name: "AGENTS.md", desc: "Workspace config, startup routine, memory" },
  { name: "SOUL.md", desc: "Personality, tone, communication style" },
  { name: "IDENTITY.md", desc: "Auto-filled name, creature type, emoji" },
  { name: "USER.md", desc: "Profile of the human, auto-updated" },
  { name: "MEMORY.md", desc: "Persistent long-term memory" },
  { name: "TOOLS.md", desc: "Available Termux API commands reference" },
  { name: "HEARTBEAT.md", desc: "Periodic scheduled checks" },
];

const piStructure = [
  { name: ".pi/settings.json", desc: "Model, API keys, preferences" },
  { name: ".pi/prompts/", desc: "Reusable prompt templates" },
  { name: ".pi/extensions/", desc: "Extensions (dashboard.ts, etc.)" },
  { name: ".pi/skills/", desc: "Auto-discovered skill directories" },
];

interface CmdEntry {
  cmd: string;
  desc: string;
  example: string;
}

const deviceCmds: CmdEntry[] = [
  {
    cmd: "termux-battery-status",
    desc: "Battery level, status, health, temperature",
    example: "termux-battery-status",
  },
  {
    cmd: "termux-audio-info",
    desc: "Current audio output device and routing",
    example: "termux-audio-info",
  },
  {
    cmd: "termux-brightness",
    desc: "Set screen brightness (0-255 or auto)",
    example: "termux-brightness 128",
  },
  {
    cmd: "termux-torch",
    desc: "Toggle the flashlight on/off",
    example: "termux-torch on",
  },
  {
    cmd: "termux-vibrate",
    desc: "Vibrate the device (-d ms, -f force)",
    example: "termux-vibrate -d 500",
  },
  {
    cmd: "termux-volume",
    desc: "Get/set audio stream volumes",
    example: "termux-volume music 8",
  },
  {
    cmd: "termux-sensor",
    desc: "Read hardware sensors (accelerometer, gyro...)",
    example: "termux-sensor -l",
  },
  {
    cmd: "termux-fingerprint",
    desc: "Authenticate via fingerprint scanner",
    example: "termux-fingerprint",
  },
  {
    cmd: "termux-location",
    desc: "Get GPS or network location",
    example: "termux-location -p gps",
  },
  {
    cmd: "termux-wifi-connectioninfo",
    desc: "Current WiFi connection details",
    example: "termux-wifi-connectioninfo",
  },
  {
    cmd: "termux-wifi-scaninfo",
    desc: "Scan nearby WiFi networks",
    example: "termux-wifi-scaninfo",
  },
  {
    cmd: "termux-wifi-enable",
    desc: "Enable or disable WiFi",
    example: "termux-wifi-enable true",
  },
  {
    cmd: "termux-clipboard-get",
    desc: "Read clipboard contents",
    example: "termux-clipboard-get",
  },
  {
    cmd: "termux-clipboard-set",
    desc: "Set clipboard contents",
    example: 'termux-clipboard-set "hello"',
  },
  {
    cmd: "termux-notification",
    desc: "Show persistent notification",
    example: 'termux-notification -t "Title" -c "Body"',
  },
  {
    cmd: "termux-notification-remove",
    desc: "Remove notification by ID",
    example: "termux-notification-remove myid",
  },
  {
    cmd: "termux-notification-list",
    desc: "List active notifications",
    example: "termux-notification-list",
  },
  {
    cmd: "termux-dialog",
    desc: "Show interactive UI dialog",
    example: 'termux-dialog confirm -t "Sure?"',
  },
  {
    cmd: "termux-toast",
    desc: "Show a brief toast message",
    example: 'termux-toast "Hello!"',
  },
  {
    cmd: "termux-wake-lock",
    desc: "Acquire CPU wake lock (prevent sleep)",
    example: "termux-wake-lock",
  },
  {
    cmd: "termux-wake-unlock",
    desc: "Release CPU wake lock",
    example: "termux-wake-unlock",
  },
  {
    cmd: "termux-wallpaper",
    desc: "Set device wallpaper from file or URL",
    example: "termux-wallpaper -f /sdcard/photo.jpg",
  },
  {
    cmd: "termux-download",
    desc: "Download file via Android DownloadManager",
    example: 'termux-download "https://example.com/file.zip"',
  },
];

const commsCmds: CmdEntry[] = [
  {
    cmd: "termux-sms-list",
    desc: "List received SMS messages",
    example: "termux-sms-list -l 5",
  },
  {
    cmd: "termux-sms-send",
    desc: "Send an SMS message",
    example: 'termux-sms-send -n "+1234" "Hi!"',
  },
  {
    cmd: "termux-contact-list",
    desc: "List all device contacts",
    example: "termux-contact-list",
  },
  {
    cmd: "termux-call-log",
    desc: "Show recent call history",
    example: "termux-call-log -l 10",
  },
  {
    cmd: "termux-telephony-call",
    desc: "Initiate a phone call",
    example: 'termux-telephony-call "+1234"',
  },
  {
    cmd: "termux-telephony-cellinfo",
    desc: "Current cell tower info",
    example: "termux-telephony-cellinfo",
  },
  {
    cmd: "termux-telephony-deviceinfo",
    desc: "SIM and device telephony info",
    example: "termux-telephony-deviceinfo",
  },
  {
    cmd: "termux-camera-info",
    desc: "List cameras and capabilities",
    example: "termux-camera-info",
  },
  {
    cmd: "termux-camera-photo",
    desc: "Take a photo and save to file",
    example: "termux-camera-photo /sdcard/ruuh/photo.jpg",
  },
  {
    cmd: "termux-microphone-record",
    desc: "Record audio from microphone",
    example: "termux-microphone-record -f /sdcard/ruuh/rec.m4a -l 30",
  },
  {
    cmd: "termux-tts-speak",
    desc: "Speak text aloud (text-to-speech)",
    example: 'termux-tts-speak "Hello"',
  },
  {
    cmd: "termux-tts-engines",
    desc: "List available TTS engines",
    example: "termux-tts-engines",
  },
  {
    cmd: "termux-speech-to-text",
    desc: "Recognize speech from microphone",
    example: "termux-speech-to-text",
  },
  {
    cmd: "termux-media-player",
    desc: "Play/pause/stop audio files",
    example: "termux-media-player play /sdcard/song.mp3",
  },
  {
    cmd: "termux-media-scan",
    desc: "Scan files for Android media library",
    example: "termux-media-scan /sdcard/ruuh/photo.jpg",
  },
  {
    cmd: "termux-share",
    desc: "Share content via Android share sheet",
    example: "termux-share /sdcard/ruuh/photo.jpg",
  },
  {
    cmd: "termux-storage-get",
    desc: "Pick a file using Android file picker",
    example: "termux-storage-get /sdcard/ruuh/picked.pdf",
  },
  {
    cmd: "termux-calendar-list",
    desc: "List calendar events",
    example: "termux-calendar-list",
  },
];

const systemCmds: CmdEntry[] = [
  {
    cmd: "termux-job-scheduler",
    desc: "Schedule background jobs",
    example: "termux-job-scheduler --pending",
  },
  {
    cmd: "termux-infrared-transmit",
    desc: "Transmit infrared signal",
    example: "termux-infrared-transmit -f 38000 100,50,100",
  },
  { cmd: "termux-usb", desc: "Access USB devices", example: "termux-usb -l" },
  { cmd: "termux-nfc", desc: "Read/write NFC tags", example: "termux-nfc" },
  {
    cmd: "termux-keystore",
    desc: "Hardware keystore crypto operations",
    example: "termux-keystore list",
  },
  {
    cmd: "termux-infrared-frequencies",
    desc: "List supported IR carrier frequencies",
    example: "termux-infrared-frequencies",
  },
];

const extraSkills = [
  {
    name: "blogwatcher",
    desc: "Monitor RSS feeds and blogs for new posts, summarize updates automatically.",
  },
  {
    name: "thoth",
    desc: "Create and optimize social media content for Twitter, LinkedIn, and Instagram with AI images and brand styles.",
  },
  {
    name: "agent-browser",
    desc: "Browser automation for navigating pages, filling forms, clicking buttons, taking screenshots, and extracting data.",
  },
  {
    name: "summarize",
    desc: "Summarize articles, web pages, or long texts into concise bullet points.",
  },
  {
    name: "weather",
    desc: "Get current weather and forecasts for any location using wttr.in.",
  },
  {
    name: "humanizer",
    desc: "Rewrite AI-generated text to sound more natural and human.",
  },
  {
    name: "skill-creator",
    desc: "Meta-skill that helps you create new custom skills from scratch.",
  },
];

const patterns = [
  {
    title: "Battery check before long task",
    code: `BATTERY=$(termux-battery-status)
LEVEL=$(echo "$BATTERY" | jq -r '.percentage')
if [ "$LEVEL" -lt 20 ]; then
  termux-toast "Battery low ($LEVEL%). Plug in."
fi`,
  },
  {
    title: "Notification with progress",
    code: `termux-notification --id build -t "Build" -c "Starting..." --ongoing
# ... run build ...
termux-notification --id build -t "Build" -c "Done!" --alert-once
termux-notification-remove build`,
  },
  {
    title: "Voice-commanded SMS",
    code: `termux-tts-speak "Who should I text?"
NAME=$(termux-speech-to-text)
NUMBER=$(termux-contact-list | jq -r --arg n "$NAME" \\
  '.[] | select(.name | test($n;"i")) | .number')
termux-tts-speak "What should I say?"
MSG=$(termux-speech-to-text)
termux-sms-send -n "$NUMBER" "$MSG"`,
  },
  {
    title: "Take photo and share",
    code: `termux-camera-photo /sdcard/ruuh/snap.jpg
termux-media-scan /sdcard/ruuh/snap.jpg
termux-share /sdcard/ruuh/snap.jpg`,
  },
  {
    title: "Wake lock for long task",
    code: `termux-wake-lock
# ... long running process ...
termux-wake-unlock
termux-vibrate -d 200
termux-toast "Task finished"`,
  },
  {
    title: "Scheduled backup via cron",
    code: `# Add to HEARTBEAT.md or use termux-job-scheduler
termux-wake-lock
tar czf /sdcard/ruuh/backup-$(date +%F).tar.gz ~/agent/
termux-wake-unlock
termux-notification -t "Backup" -c "Complete"`,
  },
  {
    title: "NFC tag automation",
    code: `TAG=$(termux-nfc)
URL=$(echo "$TAG" | jq -r '.content')
termux-toast "Scanned: $URL"
# Trigger action based on tag content`,
  },
];

const ollamaModels = [
  {
    name: "glm-5:cloud",
    size: "Cloud",
    type: "Cloud",
    note: "Recommended",
  },
  {
    name: "minimax-m2.5:cloud",
    size: "Cloud",
    type: "Cloud",
    note: "",
  },
  {
    name: "qwen3.5:cloud",
    size: "Cloud",
    type: "Cloud",
    note: "",
  },
  {
    name: "kimi-k2.5:cloud",
    size: "Cloud",
    type: "Cloud",
    note: "",
  },
  {
    name: "qwen3:1.7b",
    size: "~1 GB",
    type: "Local",
    note: "",
  },
];

const troubleshooting = [
  {
    q: "ruuh command not found",
    a: "Re-run the full install script. The setup may not have completed. Check that ~/storage/shared/ruuh/ exists.",
  },
  {
    q: "Storage permission denied",
    a: "Go to Android Settings > Apps > Termux > Permissions > Storage and grant access. Restart Termux.",
  },
  {
    q: "Termux API commands fail",
    a: "Install both Termux and Termux:API from F-Droid (not Play Store). Mixing sources causes signature mismatch.",
  },
  {
    q: "Ollama out of memory",
    a: "Try a smaller model: ollama pull qwen3:1.7b. Close other apps to free RAM.",
  },
  {
    q: "Ubuntu proot won't start",
    a: "Run: proot-distro remove ubuntu && proot-distro install ubuntu, then re-run ruuh-setup.sh.",
  },
  {
    q: "Skills not showing up",
    a: "Skills must be in ~/storage/shared/ruuh/.pi/skills/. Re-run the skills setup script.",
  },
  {
    q: "Dashboard not loading",
    a: "The dashboard runs at localhost:3000 while the agent is active. Open it in your device's browser, not Termux.",
  },
  {
    q: "Permission error on first API call",
    a: "Normal. Android prompts for permission on first use. Retry the command once after granting.",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function CommandCard({ cmd, desc, example }: CmdEntry) {
  return (
    <div className="rounded-lg border border-border bg-card px-5 py-4">
      <code className="font-mono text-[0.82rem] font-semibold text-primary">
        {cmd}
      </code>
      <p className="mt-1 text-[0.82rem] text-muted-foreground">{desc}</p>
      <div className="mt-2 flex items-center gap-2">
        <code className="overflow-x-auto rounded bg-[var(--color-code-block)] px-2 py-1 font-mono text-[0.75rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {example}
        </code>
        <CopyButton text={example} />
      </div>
    </div>
  );
}

function CommandGrid({ commands }: { commands: CmdEntry[] }) {
  return (
    <StaggerContainer className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {commands.map((c) => (
        <StaggerItem key={c.cmd}>
          <CommandCard {...c} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

function SectionHeader({
  id,
  icon: Icon,
  title,
  subtitle,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <AnimatedDiv>
      <div id={id} className="scroll-mt-20">
        <div className="mb-2 flex items-center gap-3">
          <GlowIcon className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Icon className="size-5" />
          </GlowIcon>
          <h2 className="text-[1.75rem] font-bold tracking-tight">{title}</h2>
        </div>
        {subtitle && (
          <p className="mb-10 mt-2 text-[1.05rem] text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </AnimatedDiv>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SheetPage() {
  return (
    <main>
      {/* Header + TOC */}
      <section className="border-b-soft relative bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(251,170,25,0.04),transparent_70%)] px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv delay={0.1}>
            <div className="mb-4 flex items-center gap-3">
              <GlowIcon className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Zap className="size-5" />
              </GlowIcon>
              <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight">
                Cheatsheet
              </h1>
            </div>
          </AnimatedDiv>
          <AnimatedDiv delay={0.2}>
            <p className="mb-8 max-w-[560px] text-lg leading-relaxed text-muted-foreground">
              Quick-reference for every Ruuh command, Termux API call, file
              path, and common pattern.
            </p>
          </AnimatedDiv>
          <AnimatedDiv delay={0.3}>
            <div className="flex flex-wrap gap-2">
              {tocSections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[0.82rem] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </AnimatedDiv>
        </div>
      </section>

      {/* Quick Start */}
      <section className="border-b-soft px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <SectionHeader
            id="quick-start"
            icon={Rocket}
            title="Quick Start"
            subtitle="Get up and running in under five minutes."
          />
          <StaggerContainer className="space-y-3">
            {quickStartCmds.map((item) => (
              <StaggerItem key={item.label}>
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[0.9rem] text-muted-foreground">
                    {item.label}
                  </span>
                  <div className="flex min-w-0 items-center gap-2">
                    <code className="overflow-x-auto break-all rounded bg-[var(--color-code-block)] px-3 py-1.5 font-mono text-[0.75rem] sm:break-normal sm:whitespace-nowrap sm:text-[0.8rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {item.cmd}
                    </code>
                    <CopyButton text={item.cmd} />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Setup Scripts */}
      <section className="border-b-soft px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <SectionHeader
            id="setup"
            icon={Download}
            title="Setup Scripts"
            subtitle="Individual scripts you can run separately."
          />
          <StaggerContainer className="space-y-3">
            {setupScripts.map((s) => (
              <StaggerItem key={s.name}>
                <div className="rounded-lg border border-border bg-card px-5 py-4">
                  <h3 className="text-[0.95rem] font-semibold">{s.name}</h3>
                  <p className="mt-1 text-[0.85rem] text-muted-foreground">
                    {s.desc}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="overflow-x-auto break-all rounded bg-[var(--color-code-block)] px-2 py-1 font-mono text-[0.75rem] sm:break-normal sm:whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {s.cmd}
                    </code>
                    <CopyButton text={s.cmd} />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Key Paths */}
      <section className="border-b-soft px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <SectionHeader
            id="paths"
            icon={FolderOpen}
            title="Key Paths"
            subtitle="Where Ruuh stores files across environments."
          />
          <div className="space-y-4">
            <AnimatedDiv>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 flex items-center gap-2 text-[0.95rem] font-semibold">
                  <FolderOpen className="size-4 text-primary" />
                  File Locations
                </h3>
                <div className="space-y-2.5">
                  {filePaths.map((item) => (
                    <div
                      key={item.context}
                      className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3"
                    >
                      <span className="w-44 flex-shrink-0 text-[0.85rem] font-medium text-muted-foreground">
                        {item.context}
                      </span>
                      <code className="rounded bg-[var(--color-code-block)] px-2.5 py-1 font-mono text-[0.82rem] text-foreground">
                        {item.path}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedDiv>

            <AnimatedDiv>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 flex items-center gap-2 text-[0.95rem] font-semibold">
                  <FileText className="size-4 text-primary" />
                  Config Files
                </h3>
                <div className="space-y-2.5">
                  {configFiles.map((f) => (
                    <div
                      key={f.name}
                      className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3"
                    >
                      <code className="w-40 shrink-0 rounded bg-[var(--color-code-block)] px-2.5 py-1 font-mono text-[0.82rem] text-primary">
                        {f.name}
                      </code>
                      <span className="text-[0.85rem] text-muted-foreground">
                        {f.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedDiv>

            <AnimatedDiv>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 flex items-center gap-2 text-[0.95rem] font-semibold">
                  <Settings className="size-4 text-primary" />
                  .pi Directory
                </h3>
                <div className="space-y-2.5">
                  {piStructure.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3"
                    >
                      <code className="w-40 shrink-0 rounded bg-[var(--color-code-block)] px-2.5 py-1 font-mono text-[0.82rem] text-primary">
                        {item.name}
                      </code>
                      <span className="text-[0.85rem] text-muted-foreground">
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedDiv>
          </div>
        </div>
      </section>

      {/* Termux API: Device */}
      <section className="border-b-soft px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <SectionHeader
            id="device"
            icon={Smartphone}
            title="Termux API: Device"
            subtitle="Hardware, sensors, and system UI commands."
          />
          <CommandGrid commands={deviceCmds} />
        </div>
      </section>

      {/* Termux API: Comms */}
      <section className="border-b-soft px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <SectionHeader
            id="comms"
            icon={MessageSquare}
            title="Termux API: Comms"
            subtitle="Communication and media commands."
          />
          <CommandGrid commands={commsCmds} />
        </div>
      </section>

      {/* Termux API: System */}
      <section className="border-b-soft px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <SectionHeader
            id="system"
            icon={Settings}
            title="Termux API: System"
            subtitle="System integration and automation."
          />
          <CommandGrid commands={systemCmds} />
        </div>
      </section>

      {/* Extra Skills */}
      <section className="border-b-soft px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <SectionHeader
            id="skills"
            icon={Sparkles}
            title="Extra Skills"
            subtitle="Community skills installed via the extra-skills script."
          />
          <StaggerContainer className="space-y-3">
            {extraSkills.map((skill) => (
              <StaggerItem key={skill.name}>
                <div className="flex items-start gap-4 rounded-lg border border-border bg-card px-6 py-5">
                  <GlowIcon className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Sparkles className="size-5" />
                  </GlowIcon>
                  <div>
                    <h3 className="mb-1 font-mono text-[0.95rem] font-semibold text-primary">
                      {skill.name}
                    </h3>
                    <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                      {skill.desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Common Patterns */}
      <section className="border-b-soft px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <SectionHeader
            id="patterns"
            icon={Code}
            title="Common Patterns"
            subtitle="Multi-command recipes you can copy and adapt."
          />
          <StaggerContainer className="space-y-4">
            {patterns.map((p) => (
              <StaggerItem key={p.title}>
                <AnimatedSection>
                  <div className="overflow-hidden rounded-lg border border-border bg-[var(--color-code-block)] shadow-terminal">
                    <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                      <div className="flex gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <span className="text-[0.75rem] text-muted-foreground">
                        {p.title}
                      </span>
                      <CopyButton text={p.code} />
                    </div>
                    <pre className="overflow-x-auto p-5 font-mono text-[0.8rem] leading-[1.8] text-muted-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {p.code}
                    </pre>
                  </div>
                </AnimatedSection>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Ollama */}
      <section className="border-b-soft px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <SectionHeader
            id="ollama"
            icon={Cpu}
            title="Ollama"
            subtitle="Local models for offline, private AI."
          />
          <AnimatedDiv>
            <div className="mb-6 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-[0.85rem]">
                <thead>
                  <tr className="border-b border-border bg-card text-left">
                    <th className="px-4 py-3 font-semibold">Model</th>
                    <th className="px-4 py-3 font-semibold">Size</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ollamaModels.map((m) => (
                    <tr key={m.name} className="border-b border-border">
                      <td className="px-4 py-3">
                        <code className="font-mono text-[0.82rem] text-primary">
                          {m.name}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {m.size}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {m.type}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {m.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedDiv>
          <StaggerContainer className="space-y-3">
            {[
              { label: "Start with Ollama", cmd: "ruuh --ollama" },
              { label: "Pull a model", cmd: "ollama pull qwen3:1.7b" },
              { label: "List installed models", cmd: "ollama list" },
              { label: "Remove a model", cmd: "ollama rm qwen3:1.7b" },
              {
                label: "Config file",
                cmd: "~/storage/shared/ruuh/.pi/settings.json",
              },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[0.9rem] text-muted-foreground">
                    {item.label}
                  </span>
                  <div className="flex min-w-0 items-center gap-2">
                    <code className="overflow-x-auto break-all rounded bg-[var(--color-code-block)] px-3 py-1.5 font-mono text-[0.75rem] sm:break-normal sm:whitespace-nowrap sm:text-[0.8rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {item.cmd}
                    </code>
                    <CopyButton text={item.cmd} />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="border-b-soft px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <SectionHeader
            id="troubleshooting"
            icon={CircleHelp}
            title="Troubleshooting"
            subtitle="Common issues and how to fix them."
          />
          <StaggerContainer className="space-y-4">
            {troubleshooting.map((item) => (
              <StaggerItem key={item.q}>
                <div className="rounded-lg border border-border bg-card px-6 py-5">
                  <h3 className="mb-2 text-[0.95rem] font-semibold">
                    {item.q}
                  </h3>
                  <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </main>
  );
}
