import {
  Terminal,
  Server,
  Brain,
  Sparkles,
  FolderOpen,
  Plug,
  Cpu,
  Cloud,
  WifiOff,
  Shield,
  Smartphone,
  MessageSquare,
  Settings,
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import {
  AnimatedSection,
  AnimatedDiv,
  StaggerContainer,
  StaggerItem,
  HoverCard,
} from "@/components/motion";

const INSTALL_CMD =
  "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/setup.sh | bash";

const SKILLS_CMD =
  "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/skills-setup.sh | bash";

const features = [
  {
    icon: Terminal,
    title: "One-Command Setup",
    description:
      "A single curl command sets up Termux, Ubuntu, Node.js 22, the agent, Ollama, and device skills — everything in one go.",
  },
  {
    icon: Cpu,
    title: "Hybrid AI Backend",
    description:
      "Choose cloud APIs (OpenAI, Anthropic) or run models locally via Ollama for offline, private coding.",
  },
  {
    icon: Server,
    title: "Full Ubuntu Environment",
    description:
      "Runs in a real Ubuntu instance via proot-distro with Node.js 22 — no root required, no containers, no VMs.",
  },
  {
    icon: Brain,
    title: "Persistent Memory",
    description:
      "MEMORY.md preserves context across sessions. Ruuh remembers what you're working on and picks up where you left off.",
  },
  {
    icon: Sparkles,
    title: "Custom AI Persona",
    description:
      "Define Ruuh's personality and behavior in SOUL.md. Make it match your coding style and communication preferences.",
  },
  {
    icon: FolderOpen,
    title: "Android File Access",
    description:
      "Agent configs live in /sdcard/ruuh — edit them from any text editor on your phone. No terminal required for configuration.",
  },
  {
    icon: Plug,
    title: "Termux API Skills",
    description:
      "Ruuh knows how to use your Android hardware — camera, SMS, sensors, location, notifications, and more via auto-discovered Termux API skills.",
  },
];

const installSteps = [
  {
    title: "Update Termux",
    description: "Upgrades all Termux packages non-interactively",
  },
  {
    title: "Install proot-distro & termux-api",
    description: "Adds proot for Linux distros and API access",
  },
  {
    title: "Setup Shared Storage",
    description: "Creates ~/storage/shared/ruuh/ for config files",
  },
  {
    title: "Create Agent Configs",
    description: "Writes AGENTS.md, SOUL.md, and MEMORY.md",
  },
  {
    title: "Install Ubuntu",
    description: "Sets up Ubuntu via proot-distro",
  },
  {
    title: "Install Node.js 22",
    description: "Adds Node.js via NodeSource inside Ubuntu",
  },
  {
    title: "Install pi-coding-agent",
    description: "Installs @mariozechner/pi-coding-agent globally",
  },
  {
    title: "Create Launcher & Symlinks",
    description: "Adds ruuh command and Termux API symlinks",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(251,170,25,0.06),transparent_70%)]" />
        <div className="relative max-w-[740px]">
          <AnimatedDiv>
            <span className="mb-6 inline-block rounded-full border border-primary/25 bg-primary/15 px-3.5 py-1 font-mono text-xs tracking-wide text-primary">
              Open Source
            </span>
          </AnimatedDiv>
          <AnimatedDiv delay={0.1}>
            <h1 className="mb-5 text-[clamp(2.2rem,6vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight">
              <span className="text-primary">Ruuh</span> — Your AI Coding Agent on
              Android
            </h1>
          </AnimatedDiv>
          <AnimatedDiv delay={0.2}>
            <p className="mx-auto mb-10 max-w-[520px] text-lg leading-relaxed text-muted-foreground">
              A personal AI coding assistant that runs locally on your Android
              device — powered by cloud APIs or local models via Ollama. One
              command to install, one command to start.
            </p>
          </AnimatedDiv>
          <AnimatedDiv delay={0.3}>
            <div className="mx-auto flex max-w-[620px] flex-col items-center gap-3 rounded-lg border border-border bg-code-block p-3 sm:p-4 shadow-premium-sm text-left md:flex-row">
              <span className="hidden shrink-0 select-none font-mono text-sm text-primary md:block">
                $
              </span>
              <code className="flex-1 overflow-x-auto break-all sm:break-normal sm:whitespace-nowrap font-mono text-[0.75rem] sm:text-[0.82rem] text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {INSTALL_CMD}
              </code>
              <CopyButton text={INSTALL_CMD} />
            </div>
            <a
              href="/docs"
              className="mt-4 inline-block text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Read the docs &rarr;
            </a>
          </AnimatedDiv>
        </div>
      </section>

      {/* What is Ruuh */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              What is <span className="text-primary">Ruuh</span>?
            </h2>
          </AnimatedDiv>
          <AnimatedSection className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-[1.05rem] text-muted-foreground">
                Ruuh is a personal AI coding assistant powered by the{" "}
                <strong className="text-foreground">pi-coding-agent</strong> npm
                package. It runs inside a full Ubuntu environment on your
                Android device via Termux and proot-distro — no root required.
                Connect to cloud APIs like OpenAI and Anthropic, or run models
                locally with <strong className="text-foreground">Ollama</strong>{" "}
                for fully offline coding.
              </p>
              <p className="text-[1.05rem] text-muted-foreground">
                It remembers context across sessions, follows custom
                instructions you define, and can access your Android&apos;s file
                system so you can edit configs from any text editor on your
                phone.
              </p>
              <p className="text-[1.05rem] text-muted-foreground">
                Think of it as having a sharp, opinionated senior engineer in
                your pocket — one that actually listens and gets better over
                time.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg border border-border bg-code-block">
              <div className="flex gap-2 border-b border-border px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="p-5 font-mono text-[0.82rem] leading-[1.8] text-muted-foreground">
                <div>
                  <span className="text-primary">~ $</span> ruuh
                </div>
                <div>Starting pi-coding-agent...</div>
                <div>Loading MEMORY.md...</div>
                <div>Loading SOUL.md persona...</div>
                <div>&nbsp;</div>
                <div>Ready. What are we building?</div>
                <div>&nbsp;</div>
                <div>
                  <span className="text-primary">pi &gt;</span>{" "}
                  <span className="animate-blink inline-block h-4 w-2 bg-primary align-text-bottom" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="mb-12 max-w-[600px] text-[1.05rem] text-muted-foreground">
              Three steps. Five minutes. No root access required.
            </p>
          </AnimatedDiv>
          <StaggerContainer className="mx-auto grid max-w-[400px] grid-cols-1 gap-8 md:max-w-none md:grid-cols-3">
            <StaggerItem>
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-mono text-xs font-bold text-primary">
                  1
                </span>
                <h3 className="mb-2 text-[1.1rem] font-semibold">
                  Install Termux
                </h3>
                <p className="text-[0.92rem] text-muted-foreground">
                  Download Termux from{" "}
                  <a
                    href="https://f-droid.org/en/packages/com.termux/"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    F-Droid
                  </a>
                  . The Play Store version is outdated — use F-Droid for the
                  latest build.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-mono text-xs font-bold text-primary">
                  2
                </span>
                <h3 className="mb-2 text-[1.1rem] font-semibold">
                  Run the Setup
                </h3>
                <p className="text-[0.92rem] text-muted-foreground">
                  Paste the one-line install command into Termux. It handles
                  everything automatically — packages, Ubuntu, Node.js, the
                  agent, Ollama, and device skills.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-mono text-xs font-bold text-primary">
                  3
                </span>
                <h3 className="mb-2 text-[1.1rem] font-semibold">
                  Start Coding
                </h3>
                <p className="text-[0.92rem] text-muted-foreground">
                  Type{" "}
                  <code className="rounded bg-code-block px-2 py-0.5 font-mono text-[0.82rem] text-primary">
                    ruuh
                  </code>{" "}
                  and you&apos;re in. Ruuh is ready to help you build, debug, and
                  ship code — right from your phone.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              <span className="text-primary">Features</span>
            </h2>
            <p className="mb-12 max-w-[600px] text-[1.05rem] text-muted-foreground">
              Everything you need for a productive AI coding workflow on mobile.
            </p>
          </AnimatedDiv>
          <StaggerContainer className="mx-auto grid max-w-[400px] grid-cols-1 gap-6 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <HoverCard
                key={feature.title}
                className="rounded-lg border border-border bg-card p-7"
              >
                <span className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mb-2 text-base font-semibold">
                  {feature.title}
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </HoverCard>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Run Local with Ollama */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Run Local with <span className="text-primary">Ollama</span>
            </h2>
          </AnimatedDiv>
          <AnimatedSection className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-[1.05rem] text-muted-foreground">
                Don&apos;t want to rely on cloud APIs? Ruuh supports{" "}
                <strong className="text-foreground">Ollama</strong> as a local
                backend — run models like Llama 3, CodeGemma, and DeepSeek
                Coder directly on your device. No API keys, no internet, no
                data leaving your phone.
              </p>
              <p className="text-[1.05rem] text-muted-foreground">
                Switching between cloud and local is a single config change.
                Point Ruuh at your Ollama instance and it auto-detects available
                models — no restart required.
              </p>
              <p className="text-[1.05rem] text-muted-foreground">
                Cloud APIs give you the most capable models. Ollama gives you
                full privacy and offline access. Use whichever fits the moment
                — or both.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg border border-border bg-code-block">
              <div className="flex gap-2 border-b border-border px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="p-5 font-mono text-[0.82rem] leading-[1.8] text-muted-foreground">
                <div>
                  <span className="text-primary">~ $</span> ollama pull
                  codellama
                </div>
                <div>pulling manifest...</div>
                <div>pulling 3a43f93b78ec... 100%</div>
                <div>success</div>
                <div>&nbsp;</div>
                <div>
                  <span className="text-primary">~ $</span> ruuh --model
                  codellama
                </div>
                <div>Connecting to Ollama...</div>
                <div>Model: codellama (3.8B)</div>
                <div>Running fully offline</div>
                <div>&nbsp;</div>
                <div>
                  <span className="text-primary">pi &gt;</span>{" "}
                  <span className="animate-blink inline-block h-4 w-2 bg-primary align-text-bottom" />
                </div>
              </div>
            </div>
          </AnimatedSection>
          <StaggerContainer className="mx-auto mt-12 grid max-w-[400px] grid-cols-1 gap-6 md:max-w-none md:grid-cols-3">
            <StaggerItem>
              <div className="rounded-lg border border-border bg-card p-7 text-center">
                <span className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary mx-auto">
                  <WifiOff className="size-5" />
                </span>
                <h3 className="mb-2 text-base font-semibold">Fully Offline</h3>
                <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                  Run models without an internet connection. Perfect for
                  coding on the go or in restricted networks.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-lg border border-border bg-card p-7 text-center">
                <span className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary mx-auto">
                  <Shield className="size-5" />
                </span>
                <h3 className="mb-2 text-base font-semibold">
                  Private by Default
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                  Your code never leaves your device. No tokens sent to
                  third-party servers, no usage tracking.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-lg border border-border bg-card p-7 text-center">
                <span className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary mx-auto">
                  <Cloud className="size-5" />
                </span>
                <h3 className="mb-2 text-base font-semibold">
                  Seamless Switching
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                  Switch between cloud APIs and local models with a single
                  config change. No re-install, no downtime.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Termux API Skills */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Android Device <span className="text-primary">Skills</span>
            </h2>
          </AnimatedDiv>
          <AnimatedSection className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-[1.05rem] text-muted-foreground">
                Ruuh can interact with your Android hardware through{" "}
                <strong className="text-foreground">Termux API skills</strong>.
                Send SMS, take photos, check battery, read sensors, show
                notifications, record audio, and more — all through natural
                conversation with your agent.
              </p>
              <p className="text-[1.05rem] text-muted-foreground">
                Skills are auto-discovered when Ruuh starts. Install them with a
                single command and Ruuh immediately knows how to use every Termux
                API command on your device.
              </p>
              <p className="text-[1.05rem] text-muted-foreground">
                Requires the{" "}
                <a
                  href="https://f-droid.org/en/packages/com.termux.api/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Termux:API
                </a>{" "}
                companion app installed from F-Droid for hardware access. Both{" "}
                <a
                  href="https://f-droid.org/en/packages/com.termux/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Termux
                </a>{" "}
                and Termux:API must be installed from F-Droid — mixing
                Play Store and F-Droid versions causes signature mismatch errors.
              </p>
              <div className="flex flex-col items-start gap-3 rounded-lg border border-border bg-code-block p-3 sm:p-4 shadow-premium-sm md:flex-row md:items-center">
                <span className="hidden shrink-0 select-none font-mono text-sm text-primary md:block">
                  $
                </span>
                <code className="flex-1 overflow-x-auto break-all sm:break-normal sm:whitespace-nowrap font-mono text-[0.75rem] sm:text-[0.82rem] text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {SKILLS_CMD}
                </code>
                <CopyButton text={SKILLS_CMD} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-7">
                <span className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Smartphone className="size-5" />
                </span>
                <h3 className="mb-2 text-base font-semibold">
                  Device &amp; Sensors
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                  Battery status, brightness, torch, vibrate, volume, sensors,
                  fingerprint, GPS location, WiFi, clipboard, notifications,
                  dialogs, toasts, wake lock, wallpaper, and downloads.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-7">
                <span className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <MessageSquare className="size-5" />
                </span>
                <h3 className="mb-2 text-base font-semibold">
                  Comms &amp; Media
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                  SMS send &amp; receive, contacts, call log, camera photos,
                  microphone recording, text-to-speech, media playback, file
                  sharing, storage picker, and calendar access.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-7">
                <span className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Settings className="size-5" />
                </span>
                <h3 className="mb-2 text-base font-semibold">
                  System &amp; Automation
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                  Job scheduling, infrared transmit, USB device access, NFC tag
                  read/write, and hardware keystore crypto.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What Gets Installed */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              What Gets <span className="text-primary">Installed</span>
            </h2>
            <p className="mb-12 max-w-[600px] text-[1.05rem] text-muted-foreground">
              Here&apos;s exactly what the setup script does — no surprises.
            </p>
          </AnimatedDiv>
          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {installSteps.map((step, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-3.5 rounded-lg border border-border bg-card px-5 py-[18px]">
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-primary/15 font-mono text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="mb-0.5 text-[0.95rem] font-semibold">
                      {step.title}
                    </h4>
                    <p className="text-[0.85rem] text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Footer */}
      <AnimatedDiv>
        <footer className="border-t border-border py-10 text-center text-[0.9rem] text-muted-foreground">
          <div className="mx-auto max-w-[1100px] space-y-2 px-6">
            <p>
              <a
                href="https://github.com/perminder-klair/ruuh"
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
                href="https://www.klair.co"
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
