import type { Metadata } from "next";
import {
  Download,
  Smartphone,
  ExternalLink,
  Plug,
  MessageSquare,
  Settings,
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
  title: "Docs — Ruuh Setup Guide",
  description:
    "Step-by-step guide to install and use Ruuh, your personal AI assistant on Android via Termux.",
};

const INSTALL_CMD =
  "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/setup.sh | bash";

const SKILLS_CMD =
  "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/skills-setup.sh | bash";

const prerequisites = [
  {
    icon: Smartphone,
    title: "Android Device",
    description: "Any Android phone or tablet.",
  },
  {
    icon: Download,
    title: "Download Termux",
    description:
      "Download Termux from F-Droid (recommended for Termux:API) or the Play Store.",
    link: "https://f-droid.org/en/packages/com.termux/",
    playStoreLink: "https://play.google.com/store/apps/details?id=com.termux",
  },
  {
    icon: Download,
    title: "Download Termux:API (Optional)",
    description: "Install the Termux:API companion app for hardware access.",
    link: "https://f-droid.org/en/packages/com.termux.api/",
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
      "Paste the one-liner below into Termux. It runs one command with three steps — the Termux + Ubuntu environment installs automatically, then Ollama and Termux API skills each prompt Y/n so you can skip them.",
    terminal: {
      lines: [
        {
          prompt: true,
          text: "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/setup.sh | bash",
        },
        { prompt: false, text: "[1/3] Running ruuh-setup.sh..." },
        { prompt: false, text: "  Install Ollama + model? [Y/n] y" },
        { prompt: false, text: "[2/3] Running ollama-setup.sh..." },
        { prompt: false, text: "  Install Termux API skills? [Y/n] y" },
        { prompt: false, text: "[3/3] Running skills-setup.sh..." },
        { prompt: false, text: "" },
        { prompt: false, text: "Full setup complete!" },
      ],
    },
  },
  {
    step: 3,
    title: "Grant Storage Permission",
    description:
      "During setup, Android will ask for storage permission. Grant it so Ruuh can store config files in Internal Storage > ruuh, accessible from any file manager or text editor.",
    terminal: null,
  },
  {
    step: 4,
    title: "Start Ruuh",
    description: (
      <>
        Once the install finishes, type ruuh to launch the agent. Use{" "}
        <code className="rounded bg-code-block px-2 py-0.5 font-mono text-[0.82rem] text-primary">
          ruuh --ollama
        </code>{" "}
        to start with a local model via Ollama. It logs into the Ubuntu proot
        environment and starts pi-coding-agent from the shared config directory.
        A web dashboard starts automatically at{" "}
        <a
          href="http://localhost:3000"
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          localhost:3000
        </a>{" "}
        — open it in your device browser while the agent is running.
      </>
    ),
    terminal: {
      lines: [
        { prompt: true, text: "ruuh --ollama" },
        { prompt: false, text: "Starting Ollama server..." },
        { prompt: false, text: "Ollama ready" },
        { prompt: false, text: "" },
        { prompt: false, text: "Starting Ruuh agent..." },
        { prompt: false, text: "Web dashboard: http://localhost:3000" },
        { prompt: false, text: "" },
        { prompt: false, text: "Ready. What do you need?" },
      ],
    },
  },
];

export default function DocsPage() {
  return (
    <main>
      {/* Header */}
      <section className="border-b-soft py-24 px-6 relative bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(251,170,25,0.04),transparent_70%)]">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv delay={0.1}>
            <h1 className="mb-4 text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight">
              Getting Started with <span className="text-primary">Ruuh</span>
            </h1>
          </AnimatedDiv>
          <AnimatedDiv delay={0.2}>
            <p className="max-w-[560px] text-lg leading-relaxed text-muted-foreground">
              Everything you need to install and run Ruuh on your Android
              device. The entire process takes about five minutes.
            </p>
          </AnimatedDiv>
        </div>
      </section>

      {/* Prerequisites */}
      <section className="border-b-soft py-24 px-6">
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
                  <GlowIcon className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <item.icon className="size-5" />
                  </GlowIcon>
                  <h3 className="mb-1.5 text-[0.95rem] font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-[0.88rem] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  {(item.link || item.playStoreLink) && (
                    <div className="mt-3 flex items-center gap-3">
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[0.85rem] text-primary hover:underline"
                        >
                          F-Droid <ExternalLink className="size-3" />
                        </a>
                      )}
                      {item.playStoreLink && (
                        <a
                          href={item.playStoreLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[0.85rem] text-primary hover:underline"
                        >
                          Play Store <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Installation */}
      <section className="border-b-soft py-24 px-6">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Installation
            </h2>
            <p className="mb-6 text-[1.05rem] text-muted-foreground">
              Once Termux and Termux:API are installed, open Termux and run a
              single command to set up everything automatically — Ubuntu
              environment, Ollama, and device skills.
            </p>
          </AnimatedDiv>
          <AnimatedDiv delay={0.1}>
            <div className="mb-12 flex flex-col items-start gap-3 rounded-lg border border-border bg-code-block p-3 sm:p-4 shadow-premium-sm md:flex-row md:items-center">
              <span className="hidden shrink-0 select-none font-mono text-sm text-primary md:block">
                $
              </span>
              <code className="flex-1 overflow-x-auto break-all sm:break-normal sm:whitespace-nowrap font-mono text-[0.75rem] sm:text-[0.82rem] text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                      <div className="overflow-hidden rounded-lg border border-border bg-code-block shadow-terminal">
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

      {/* Termux API Skills */}
      <section className="border-b-soft py-24 px-6">
        <div className="mx-auto max-w-[860px]">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Termux API <span className="text-primary">Skills</span>
            </h2>
            <p className="mb-4 text-[1.05rem] text-muted-foreground">
              Teach Ruuh how to use your Android device features. Skills are
              auto-discovered on startup — install once, use everywhere. If you
              skipped skills during setup or want to reinstall them, run the
              command below.
            </p>
            <blockquote className="mb-6 border-l-2 border-primary/40 pl-4 text-[0.95rem] leading-relaxed text-muted-foreground">
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
              and Termux:API must be installed from F-Droid — mixing Play Store
              and F-Droid versions causes signature mismatch errors.
            </blockquote>
          </AnimatedDiv>
          <AnimatedDiv delay={0.1}>
            <div className="mb-10 flex flex-col items-start gap-3 rounded-lg border border-border bg-code-block p-3 sm:p-4 shadow-premium-sm md:flex-row md:items-center">
              <span className="hidden shrink-0 select-none font-mono text-sm text-primary md:block">
                $
              </span>
              <code className="flex-1 overflow-x-auto break-all sm:break-normal sm:whitespace-nowrap font-mono text-[0.75rem] sm:text-[0.82rem] text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SKILLS_CMD}
              </code>
              <CopyButton text={SKILLS_CMD} />
            </div>
          </AnimatedDiv>
          <StaggerContainer className="space-y-4">
            <StaggerItem>
              <div className="flex items-start gap-4 rounded-lg border border-border bg-card px-6 py-5">
                <GlowIcon className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Plug className="size-5" />
                </GlowIcon>
                <div>
                  <h3 className="mb-1 font-mono text-[0.95rem] font-semibold text-primary">
                    termux-device
                  </h3>
                  <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                    Device hardware, sensors, and UI — battery status,
                    brightness, torch, vibrate, volume, sensors, fingerprint,
                    GPS location, WiFi, clipboard, notifications, dialogs,
                    toasts, wake lock, wallpaper, and downloads.
                  </p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-start gap-4 rounded-lg border border-border bg-card px-6 py-5">
                <GlowIcon className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <MessageSquare className="size-5" />
                </GlowIcon>
                <div>
                  <h3 className="mb-1 font-mono text-[0.95rem] font-semibold text-primary">
                    termux-comms
                  </h3>
                  <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                    Communication and media — SMS send &amp; receive, contacts,
                    call log, camera photos, microphone recording,
                    text-to-speech, media playback, file sharing, storage
                    picker, and calendar access.
                  </p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-start gap-4 rounded-lg border border-border bg-card px-6 py-5">
                <GlowIcon className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Settings className="size-5" />
                </GlowIcon>
                <div>
                  <h3 className="mb-1 font-mono text-[0.95rem] font-semibold text-primary">
                    termux-system
                  </h3>
                  <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                    System integration and automation — job scheduling, infrared
                    transmit, USB device access, NFC tag read/write, and
                    hardware keystore crypto.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Using Ollama */}
      <section className="border-b-soft py-24 px-6">
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
                    Already installed?
                  </h3>
                  <p className="mb-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                    If you chose &ldquo;Y&rdquo; when prompted during setup,
                    Ollama is already installed with a model. Just run:
                  </p>
                  <div className="overflow-hidden rounded-lg border border-border bg-code-block shadow-terminal">
                    <div className="flex gap-2 border-b border-border px-4 py-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="p-5 font-mono text-[0.8rem] leading-[1.8] text-muted-foreground">
                      <div>
                        <span className="text-primary">~ $</span>{" "}
                        <span className="text-foreground">ruuh --ollama</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-bold text-primary">
                  2
                </span>
                <div className="flex-1">
                  <h3 className="mb-2 text-[1.05rem] font-semibold">
                    Install separately
                  </h3>
                  <p className="mb-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                    If you skipped Ollama during setup, run the Ollama setup
                    script manually. It installs Ollama, signs you in, and pulls
                    a model.
                  </p>
                  <div className="overflow-hidden rounded-lg border border-border bg-code-block shadow-terminal">
                    <div className="flex gap-2 border-b border-border px-4 py-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="p-5 font-mono text-[0.8rem] leading-[1.8] text-muted-foreground">
                      <div>
                        <span className="text-primary">~ $</span>{" "}
                        <span className="text-foreground break-all">
                          curl -fsSL
                          https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/ollama-setup.sh
                          | bash
                        </span>
                      </div>
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
                    How it works
                  </h3>
                  <p className="text-[0.92rem] leading-relaxed text-muted-foreground">
                    <code className="rounded bg-code-block px-1.5 py-0.5 text-[0.82rem]">
                      ruuh --ollama
                    </code>{" "}
                    starts the Ollama server, launches the agent with the local
                    model, and stops Ollama when you exit. No API keys needed.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedDiv className="mt-8">
            <blockquote className="border-l-2 border-primary/40 pl-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              To switch models, pull a new one and restart:{" "}
              <code className="rounded bg-code-block px-1.5 py-0.5 text-[0.82rem]">
                ollama pull llama3
              </code>{" "}
              then{" "}
              <code className="rounded bg-code-block px-1.5 py-0.5 text-[0.82rem]">
                ruuh --ollama
              </code>
              . Ruuh automatically uses the latest model you pulled.
            </blockquote>
            <blockquote className="mt-4 border-l-2 border-primary/40 pl-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Ollama supports both local and cloud models depending on your
              device. Run a cloud model with{" "}
              <code className="rounded bg-code-block px-1.5 py-0.5 text-[0.82rem]">
                ollama pull qwen3:1.7b
              </code>{" "}
              for on-device or{" "}
              <code className="rounded bg-code-block px-1.5 py-0.5 text-[0.82rem]">
                ollama pull qwen3.5:cloud
              </code>{" "}
              to run via Ollama&apos;s cloud infrastructure.
            </blockquote>
          </AnimatedDiv>
        </div>
      </section>

      {/* Useful Commands */}
      <section className="border-b-soft py-24 px-6">
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
                cmd: "ruuh",
              },
              {
                label: "Start with Ollama (local model)",
                cmd: "ruuh --ollama",
              },
              {
                label: "Switch Ollama model",
                cmd: "ollama pull llama3 && ruuh --ollama",
              },
              {
                label: "Set default provider",
                cmd: 'Edit ~/.pi/agent/settings.json → "defaultProvider"',
              },
              {
                label: "Set default model",
                cmd: 'Edit ~/.pi/agent/settings.json → "defaultModel"',
              },
              {
                label: "Open web dashboard",
                cmd: "http://localhost:3000",
              },
              {
                label: "Log into Ubuntu manually",
                cmd: "proot-distro login ubuntu",
              },
              {
                label: "Run Pi manually inside Ubuntu",
                cmd: "cd ~/agent && pi",
              },
              {
                label: "Check battery (Termux API)",
                cmd: "termux-battery-status",
              },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[0.9rem] text-muted-foreground">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <code className="overflow-x-auto break-all sm:break-normal sm:whitespace-nowrap rounded bg-code-block px-3 py-1.5 font-mono text-[0.75rem] sm:text-[0.8rem] text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {item.cmd}
                    </code>
                    <CopyButton text={item.cmd} />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <AnimatedDiv className="mt-6">
            <p className="text-[0.92rem] text-muted-foreground">
              For the full list of commands, providers, and configuration
              options, see the{" "}
              <a
                href="https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                pi-coding-agent documentation
              </a>
              .
            </p>
          </AnimatedDiv>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="border-b-soft py-24 px-6">
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
                q: "ruuh command not found",
                a: "The setup script may not have completed. Re-run the full install command from the top of this page.",
              },
              {
                q: "Ollama connection refused",
                a: "Make sure Ollama is running and accessible. If it's on another machine, ensure the network allows the connection and OLLAMA_HOST is set correctly.",
              },
              {
                q: "Config files not showing in file manager",
                a: "Look for Internal Storage > ruuh in your Android file manager. The files are plain Markdown (.md) and can be opened with any text editor.",
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
    </main>
  );
}
