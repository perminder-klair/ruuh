import type { Metadata } from "next";
import {
  Download,
  Terminal,
  Play,
  Settings,
  FileText,
  Smartphone,
  Cpu,
  ArrowLeft,
  ExternalLink,
  FolderOpen,
  Pencil,
  RefreshCw,
  Plug,
  MessageSquare,
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import {
  AnimatedDiv,
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

export const metadata: Metadata = {
  title: "Docs — DroidClaw / Pi Setup Guide",
  description:
    "Step-by-step guide to install and use Pi, your AI coding agent on Android via Termux.",
};

const INSTALL_CMD =
  "curl -fsSL https://raw.githubusercontent.com/perminder-klair/droidclaw/main/scripts/termux-setup.sh | bash";

const SKILLS_CMD =
  "curl -fsSL https://raw.githubusercontent.com/perminder-klair/droidclaw/main/scripts/termux-skills-setup.sh | bash";

const prerequisites = [
  {
    icon: Smartphone,
    title: "Android Device",
    description: "Any Android phone or tablet running Android 7+.",
  },
  {
    icon: Download,
    title: "Termux from F-Droid",
    description:
      "Download Termux from F-Droid — the Play Store version is outdated and won't work.",
    link: "https://f-droid.org/en/packages/com.termux/",
  },
  {
    icon: Settings,
    title: "API Key (optional)",
    description:
      "An OpenAI or Anthropic API key for cloud models, or use Ollama for fully local/offline.",
  },
];

const setupSteps = [
  {
    step: 1,
    title: "Open Termux",
    description:
      "Launch the Termux app on your Android device. You'll see a terminal prompt ready for input.",
    terminal: null,
  },
  {
    step: 2,
    title: "Run the Install Command",
    description:
      "Paste the one-liner below into Termux. It runs an 8-step automated script that installs everything — Termux packages, Ubuntu via proot-distro, Node.js 22, and the pi-coding-agent.",
    terminal: {
      lines: [
        { prompt: true, text: "curl -fsSL https://raw.githubusercontent.com/perminder-klair/droidclaw/main/scripts/termux-setup.sh | bash" },
        { prompt: false, text: "[1/8] Updating Termux packages..." },
        { prompt: false, text: "[2/8] Installing Termux essentials..." },
        { prompt: false, text: "[3/8] Setting up shared storage access..." },
        { prompt: false, text: "[4/8] Creating Pi agent files..." },
        { prompt: false, text: "[5/8] Installing Ubuntu..." },
        { prompt: false, text: "[6/8] Configuring Ubuntu environment..." },
        { prompt: false, text: "[7/8] Creating start-pi launcher..." },
        { prompt: false, text: "[8/8] Setting up Termux API access..." },
        { prompt: false, text: "" },
        { prompt: false, text: "🎉 All done!" },
      ],
    },
  },
  {
    step: 3,
    title: "Grant Storage Permission",
    description:
      "During setup, Android will ask for storage permission. Grant it so Pi can store config files in Internal Storage > pi, accessible from any file manager or text editor.",
    terminal: null,
  },
  {
    step: 4,
    title: "Start Pi",
    description:
      "Once the install finishes, type start-pi to launch the agent. It logs into the Ubuntu proot environment and starts pi-coding-agent from the shared config directory.",
    terminal: {
      lines: [
        { prompt: true, text: "start-pi" },
        { prompt: false, text: "🤖 Starting Pi agent..." },
        { prompt: false, text: "" },
        { prompt: false, text: "Starting pi-coding-agent..." },
        { prompt: false, text: "Loading MEMORY.md..." },
        { prompt: false, text: "Loading SOUL.md persona..." },
        { prompt: false, text: "" },
        { prompt: false, text: "Ready. What are we building?" },
      ],
    },
  },
];

const configFiles = [
  {
    icon: FileText,
    name: "AGENTS.md",
    description:
      "Overview and instructions for the agent — defines what Pi can do and how it should behave when coding.",
  },
  {
    icon: Pencil,
    name: "SOUL.md",
    description:
      "Pi's personality and persona file. Customize its tone, communication style, and coding preferences.",
  },
  {
    icon: RefreshCw,
    name: "MEMORY.md",
    description:
      "Persistent memory that survives across sessions. Pi writes here to remember context about your projects.",
  },
];

const filePaths = [
  { context: "Termux", path: "~/storage/shared/pi/" },
  { context: "Ubuntu (proot)", path: "~/pi-agent/" },
  { context: "Android File Manager", path: "Internal Storage > pi" },
];

export default function DocsPage() {
  return (
    <main>
      {/* Header */}
      <section className="border-b border-border py-24 px-6">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv>
            <a
              href="/"
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Back to home
            </a>
          </AnimatedDiv>
          <AnimatedDiv delay={0.1}>
            <h1 className="mb-4 text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight">
              Getting <span className="text-primary">Started</span>
            </h1>
          </AnimatedDiv>
          <AnimatedDiv delay={0.2}>
            <p className="max-w-[560px] text-lg leading-relaxed text-muted-foreground">
              Everything you need to install and run Pi on your Android device.
              The entire process takes about five minutes.
            </p>
          </AnimatedDiv>
        </div>
      </section>

      {/* Prerequisites */}
      <section className="border-b border-border py-24 px-6">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Prerequisites
            </h2>
            <p className="mb-10 text-[1.05rem] text-muted-foreground">
              Before you begin, make sure you have the following.
            </p>
          </AnimatedDiv>
          <StaggerContainer className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {prerequisites.map((item) => (
              <StaggerItem key={item.title}>
                <div className="rounded-lg border border-border bg-card p-6 h-full">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mb-1.5 text-[0.95rem] font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-[0.88rem] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-[0.85rem] text-primary hover:underline"
                    >
                      Download <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Installation */}
      <section className="border-b border-border py-24 px-6">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Installation
            </h2>
            <p className="mb-6 text-[1.05rem] text-muted-foreground">
              Run a single command to set up everything automatically.
            </p>
          </AnimatedDiv>
          <AnimatedDiv delay={0.1}>
            <div className="mb-12 flex flex-col items-start gap-3 rounded-lg border border-border bg-pi-code p-4 shadow-premium-sm md:flex-row md:items-center">
              <span className="hidden shrink-0 select-none font-mono text-sm text-primary md:block">
                $
              </span>
              <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-[0.82rem] text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {INSTALL_CMD}
              </code>
              <CopyButton text={INSTALL_CMD} />
            </div>
          </AnimatedDiv>

          <div className="space-y-10">
            {setupSteps.map((step) => (
              <AnimatedSection key={step.step}>
                <div className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-bold text-primary">
                      {step.step}
                    </span>
                    {step.step < setupSteps.length && (
                      <div className="mt-2 flex-1 w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <h3 className="mb-2 text-[1.1rem] font-semibold">
                      {step.title}
                    </h3>
                    <p className="mb-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                    {step.terminal && (
                      <div className="overflow-hidden rounded-lg border border-border bg-pi-code">
                        <div className="flex gap-2 border-b border-border px-4 py-2.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="p-5 font-mono text-[0.8rem] leading-[1.8] text-muted-foreground">
                          {step.terminal.lines.map((line, i) => (
                            <div key={i}>
                              {line.text === "" ? (
                                <>&nbsp;</>
                              ) : line.prompt ? (
                                <>
                                  <span className="text-primary">~ $</span>{" "}
                                  <span className="text-foreground break-all">
                                    {line.text}
                                  </span>
                                </>
                              ) : (
                                line.text
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Config Files */}
      <section className="border-b border-border py-24 px-6">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Configuration <span className="text-primary">Files</span>
            </h2>
            <p className="mb-10 text-[1.05rem] text-muted-foreground">
              Pi creates three Markdown files you can edit from any text editor
              on your phone. No terminal required.
            </p>
          </AnimatedDiv>
          <StaggerContainer className="space-y-4">
            {configFiles.map((file) => (
              <StaggerItem key={file.name}>
                <div className="flex items-start gap-4 rounded-lg border border-border bg-card px-6 py-5">
                  <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <file.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="mb-1 font-mono text-[0.95rem] font-semibold text-primary">
                      {file.name}
                    </h3>
                    <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                      {file.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedDiv className="mt-10">
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
                    <span className="text-[0.85rem] font-medium text-muted-foreground w-44 flex-shrink-0">
                      {item.context}
                    </span>
                    <code className="rounded bg-pi-code px-2.5 py-1 font-mono text-[0.82rem] text-foreground">
                      {item.path}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedDiv>
        </div>
      </section>

      {/* Termux API Skills */}
      <section className="border-b border-border py-24 px-6">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Termux API <span className="text-primary">Skills</span>
            </h2>
            <p className="mb-6 text-[1.05rem] text-muted-foreground">
              Teach Pi how to use your Android device features. Skills are
              auto-discovered on startup — install once, use everywhere.
            </p>
          </AnimatedDiv>
          <AnimatedDiv delay={0.1}>
            <div className="mb-10 flex flex-col items-start gap-3 rounded-lg border border-border bg-pi-code p-4 shadow-premium-sm md:flex-row md:items-center">
              <span className="hidden shrink-0 select-none font-mono text-sm text-primary md:block">
                $
              </span>
              <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-[0.82rem] text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SKILLS_CMD}
              </code>
              <CopyButton text={SKILLS_CMD} />
            </div>
          </AnimatedDiv>
          <StaggerContainer className="space-y-4">
            <StaggerItem>
              <div className="flex items-start gap-4 rounded-lg border border-border bg-card px-6 py-5">
                <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Plug className="size-5" />
                </span>
                <div>
                  <h3 className="mb-1 font-mono text-[0.95rem] font-semibold text-primary">
                    termux-device
                  </h3>
                  <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                    Device hardware, sensors, and UI — battery status, brightness,
                    torch, vibrate, volume, sensors, fingerprint, GPS location, WiFi,
                    clipboard, notifications, dialogs, toasts, wake lock, wallpaper,
                    and downloads.
                  </p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-start gap-4 rounded-lg border border-border bg-card px-6 py-5">
                <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <MessageSquare className="size-5" />
                </span>
                <div>
                  <h3 className="mb-1 font-mono text-[0.95rem] font-semibold text-primary">
                    termux-comms
                  </h3>
                  <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                    Communication and media — SMS send &amp; receive, contacts, call log,
                    camera photos, microphone recording, text-to-speech, media playback,
                    file sharing, storage picker, and calendar access.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
          <AnimatedDiv className="mt-8">
            <div className="overflow-hidden rounded-lg border border-border bg-pi-code">
              <div className="flex gap-2 border-b border-border px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="p-5 font-mono text-[0.8rem] leading-[1.8] text-muted-foreground">
                <div>
                  <span className="text-primary">~ $</span>{" "}
                  <span className="text-foreground break-all">
                    {SKILLS_CMD}
                  </span>
                </div>
                <div>[1/3] Checking shared storage...</div>
                <div>[2/3] Creating skill directories...</div>
                <div>[3/3] Downloading skill files...</div>
                <div>&nbsp;</div>
                <div>Skills installed!</div>
              </div>
            </div>
          </AnimatedDiv>
        </div>
      </section>

      {/* Using Ollama */}
      <section className="border-b border-border py-24 px-6">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Using <span className="text-primary">Ollama</span> (Local Models)
            </h2>
            <p className="mb-10 text-[1.05rem] text-muted-foreground">
              Run AI models locally for full privacy and offline access. No API
              keys, no internet, no data leaving your device.
            </p>
          </AnimatedDiv>
          <AnimatedSection>
            <div className="space-y-6">
              <div className="flex gap-5">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-bold text-primary">
                  1
                </span>
                <div>
                  <h3 className="mb-2 text-[1.05rem] font-semibold">
                    Install Ollama
                  </h3>
                  <p className="mb-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                    Install Ollama on your device or on a machine accessible from your network.
                    Visit{" "}
                    <a
                      href="https://ollama.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      ollama.com
                    </a>{" "}
                    for installation instructions.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-bold text-primary">
                  2
                </span>
                <div className="flex-1">
                  <h3 className="mb-2 text-[1.05rem] font-semibold">
                    Pull a Model
                  </h3>
                  <p className="mb-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                    Download a coding-optimized model like CodeLlama, DeepSeek
                    Coder, or Llama 3.
                  </p>
                  <div className="overflow-hidden rounded-lg border border-border bg-pi-code">
                    <div className="flex gap-2 border-b border-border px-4 py-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="p-5 font-mono text-[0.8rem] leading-[1.8] text-muted-foreground">
                      <div>
                        <span className="text-primary">~ $</span>{" "}
                        <span className="text-foreground">ollama pull codellama</span>
                      </div>
                      <div>pulling manifest...</div>
                      <div>pulling 3a43f93b78ec... 100%</div>
                      <div>success</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-bold text-primary">
                  3
                </span>
                <div className="flex-1">
                  <h3 className="mb-2 text-[1.05rem] font-semibold">
                    Start Pi with a Local Model
                  </h3>
                  <p className="mb-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                    Pass the model name when launching Pi. It auto-detects
                    available Ollama models.
                  </p>
                  <div className="overflow-hidden rounded-lg border border-border bg-pi-code">
                    <div className="flex gap-2 border-b border-border px-4 py-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="p-5 font-mono text-[0.8rem] leading-[1.8] text-muted-foreground">
                      <div>
                        <span className="text-primary">~ $</span>{" "}
                        <span className="text-foreground">start-pi --model codellama</span>
                      </div>
                      <div>Connecting to Ollama...</div>
                      <div>Model: codellama (3.8B)</div>
                      <div>Running fully offline</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Useful Commands */}
      <section className="border-b border-border py-24 px-6">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Useful <span className="text-primary">Commands</span>
            </h2>
            <p className="mb-10 text-[1.05rem] text-muted-foreground">
              Quick reference for common operations.
            </p>
          </AnimatedDiv>
          <StaggerContainer className="space-y-3">
            {[
              {
                label: "Start the agent",
                cmd: "start-pi",
              },
              {
                label: "Start with a specific model",
                cmd: "start-pi --model codellama",
              },
              {
                label: "Log into Ubuntu manually",
                cmd: "proot-distro login ubuntu",
              },
              {
                label: "Run Pi manually inside Ubuntu",
                cmd: "cd ~/pi-agent && pi",
              },
              {
                label: "Install Termux API skills",
                cmd: SKILLS_CMD,
              },
              {
                label: "Check battery (Termux API)",
                cmd: "termux-battery-status",
              },
              {
                label: "Re-run the setup script",
                cmd: INSTALL_CMD,
              },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[0.9rem] text-muted-foreground">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="overflow-x-auto whitespace-nowrap rounded bg-pi-code px-3 py-1.5 font-mono text-[0.8rem] text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
      <section className="border-b border-border py-24 px-6">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Troubleshooting
            </h2>
            <p className="mb-10 text-[1.05rem] text-muted-foreground">
              Common issues and how to fix them.
            </p>
          </AnimatedDiv>
          <StaggerContainer className="space-y-4">
            {[
              {
                q: "Storage permission not granted",
                a: "Restart Termux after granting storage permission in Android settings, then re-run the setup script.",
              },
              {
                q: "Ubuntu install fails or hangs",
                a: "Check your internet connection. Run pkg update -y first, then try the setup script again.",
              },
              {
                q: "start-pi command not found",
                a: "The setup script may not have completed. Re-run the full install command from the top of this page.",
              },
              {
                q: "Ollama connection refused",
                a: "Make sure Ollama is running and accessible. If it's on another machine, ensure the network allows the connection and OLLAMA_HOST is set correctly.",
              },
              {
                q: "Config files not showing in file manager",
                a: "Look for Internal Storage > pi in your Android file manager. The files are plain Markdown (.md) and can be opened with any text editor.",
              },
            ].map((item) => (
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

      {/* Footer */}
      <AnimatedDiv>
        <footer className="py-10 text-center text-[0.9rem] text-muted-foreground">
          <div className="mx-auto max-w-[860px] space-y-2 px-6">
            <p>
              <a
                href="https://github.com/perminder-klair/droidclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View the source on GitHub
              </a>
            </p>
            <p>
              Built by{" "}
              <a
                href="https://github.com/perminder-klair"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Perminder Klair
              </a>
            </p>
          </div>
        </footer>
      </AnimatedDiv>
    </main>
  );
}
