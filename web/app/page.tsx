import {
  Brain,
  Plug,
  Cpu,
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
  GlowIcon,
} from "@/components/motion";

const INSTALL_CMD =
  "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/setup.sh | bash";

const SKILLS_CMD =
  "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/skills-setup.sh | bash";

const features = [
  {
    icon: Cpu,
    title: "Run Local with Ollama",
    description:
      "Run models like Llama 3, CodeGemma, and DeepSeek Coder directly on your device via Ollama — no API keys, no internet, no data leaving your phone.",
  },
  {
    icon: Brain,
    title: "Persistent Memory",
    description:
      "MEMORY.md preserves context across sessions. Ruuh remembers what you're working on and picks up where you left off.",
  },
  {
    icon: Smartphone,
    title: "Run on Any Android",
    description:
      "Works on any Android 7+ phone or tablet. No root required — runs in a full Ubuntu environment via Termux and proot-distro.",
  },
  {
    icon: Plug,
    title: "Termux API Skills",
    description:
      "Ruuh knows how to use your Android hardware — camera, SMS, sensors, location, notifications, and more via auto-discovered Termux API skills.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(251,170,25,0.08),transparent_70%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] animate-breathe rounded-full bg-[radial-gradient(circle,rgba(251,170,25,0.07),transparent_70%)] blur-3xl" />
        <div className="relative max-w-[740px]">
          <AnimatedDiv>
            <span className="mb-6 inline-block animate-breathe rounded-full border border-primary/25 bg-primary/15 px-3.5 py-1 font-mono text-xs tracking-wide text-primary">
              Open Source
            </span>
          </AnimatedDiv>
          <AnimatedDiv delay={0.1}>
            <h1 className="mb-5 text-[clamp(2.2rem,6vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight">
              <span className="text-primary">Ruuh</span> — Your Personal AI
              Agent on Android
            </h1>
          </AnimatedDiv>
          <AnimatedDiv delay={0.2}>
            <p className="mx-auto mb-10 max-w-[520px] text-lg leading-relaxed text-muted-foreground">
              A personal AI assistant that lives on your Android device — chat,
              code, control your phone, and automate your life. Powered by cloud
              APIs or local models via Ollama. One command to install.
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
      <section className="border-t-soft py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              What is <span className="text-primary">Ruuh</span>?
            </h2>
          </AnimatedDiv>
          <AnimatedSection className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-[1.05rem] text-muted-foreground">
                Ruuh is a personal AI assistant powered by the{" "}
                <a
                  href="https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent"
                  className="font-semibold text-foreground hover:text-primary transition-colors underline decoration-primary/40 underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pi-coding-agent
                </a>{" "}
                npm package. It runs inside a full Ubuntu environment on your
                Android device via Termux and proot-distro —{" "}
                <span className="font-semibold text-primary">
                  no root required
                </span>
                .
                Connect to cloud APIs like OpenAI and Anthropic, or run models
                locally with <strong className="text-foreground">Ollama</strong>{" "}
                for fully offline use.
              </p>
              <p className="text-[1.05rem] text-muted-foreground">
                It remembers context across sessions, follows custom
                instructions you define, and can access your Android&apos;s file
                system so you can edit configs from any text editor on your
                phone.
              </p>
              <p className="text-[1.05rem] text-muted-foreground">
                Think of it as having a sharp, thoughtful personal assistant in
                your pocket — one that actually listens, remembers, and gets
                better over time.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg border border-border bg-code-block shadow-terminal">
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
                <div>Ready. What do you need?</div>
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
      <section className="border-t-soft py-24">
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
                  </a>{" "}
                  (recommended) or the{" "}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.termux"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Play Store
                  </a>
                  .
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
                  everything automatically.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-mono text-xs font-bold text-primary">
                  3
                </span>
                <h3 className="mb-2 text-[1.1rem] font-semibold">
                  Start Using Ruuh
                </h3>
                <p className="text-[0.92rem] text-muted-foreground">
                  Type{" "}
                  <code className="rounded bg-code-block px-2 py-0.5 font-mono text-[0.82rem] text-primary">
                    ruuh
                  </code>{" "}
                  and you&apos;re in. Ruuh is ready with anything like messages,
                  reminders, your phone, your life.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Features */}
      <section className="border-t-soft py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              <span className="text-primary">Features</span>
            </h2>
            <p className="mb-12 max-w-[600px] text-[1.05rem] text-muted-foreground">
              Everything you need for a capable AI assistant that lives on your
              phone.
            </p>
          </AnimatedDiv>
          <StaggerContainer className="mx-auto grid max-w-[400px] grid-cols-1 gap-6 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <HoverCard
                key={feature.title}
                className="rounded-lg border border-border bg-card p-7"
              >
                <GlowIcon className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <feature.icon className="size-5" />
                </GlowIcon>
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

      {/* Termux API Skills */}
      <section className="border-t-soft py-24">
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
                single command and Ruuh immediately knows how to use every
                Termux API command on your device.
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
                and Termux:API must be installed from F-Droid — mixing Play
                Store and F-Droid versions causes signature mismatch errors.
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
                <GlowIcon className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Smartphone className="size-5" />
                </GlowIcon>
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
                <GlowIcon className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <MessageSquare className="size-5" />
                </GlowIcon>
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
                <GlowIcon className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Settings className="size-5" />
                </GlowIcon>
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

      {/* Footer */}
      <AnimatedDiv>
        <footer className="border-t-soft py-10 text-center text-[0.9rem] text-muted-foreground">
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
