import type { Metadata } from "next";
import {
  AnimatedDiv,
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  GlowIcon,
} from "@/components/motion";
import { CopyButton } from "@/components/copy-button";
import {
  Smartphone,
  Globe,
  Cpu,
  Shield,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ruuh vs OpenClaw on Android — Comparison",
  description:
    "How Ruuh compares to OpenClaw for running AI agents on Android. Both use Termux + proot-distro, but Ruuh is Android-first with deep device integration and one-command setup.",
};

const INSTALL_CMD =
  "curl -fsSL https://raw.githubusercontent.com/perminder-klair/ruuh/main/scripts/setup.sh | bash";

const comparisonRows = [
  {
    label: "Focus",
    openclaw: "General-purpose personal AI assistant across many platforms",
    ruuh: "Android-first AI coding agent",
  },
  {
    label: "Channels",
    openclaw: "WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Teams",
    ruuh: "Terminal-based (Termux)",
  },
  {
    label: "Architecture",
    openclaw: "WebSocket Gateway with multi-agent routing",
    ruuh: "Simple proot Ubuntu + pi-coding-agent",
  },
  {
    label: "Android setup",
    openclaw: "Requires patching Node.js to fix os.networkInterfaces() kernel crash",
    ruuh: "Single curl command, no patches needed",
  },
  {
    label: "Hardware access",
    openclaw: "Camera/screen via device node pairing",
    ruuh: "Deep Termux API skills (SMS, sensors, GPS, camera, NFC, etc.)",
  },
  {
    label: "Voice",
    openclaw: "ElevenLabs voice + wake word",
    ruuh: "No voice (terminal-focused)",
  },
  {
    label: "Skills",
    openclaw: "100+ AgentSkills via ClawHub registry",
    ruuh: "Termux API skills auto-discovered from SKILL.md files",
  },
];

const differentiators = [
  {
    icon: Smartphone,
    title: "Deep Android Integration",
    description:
      "Ruuh's Termux API skills give it native access to SMS, sensors, GPS, camera, NFC, clipboard, notifications, and more. OpenClaw's device access is limited to camera and screen via node pairing.",
  },
  {
    icon: Cpu,
    title: "Fully Offline with Ollama",
    description:
      "Run local models like Llama 3, CodeGemma, and DeepSeek Coder entirely on-device via Ollama. No API keys, no internet required. OpenClaw primarily relies on cloud APIs.",
  },
  {
    icon: Shield,
    title: "Simple Architecture",
    description:
      "Ruuh runs pi-coding-agent inside a proot Ubuntu container. No WebSocket gateway, no multi-agent routing layer, no daemon processes. Fewer moving parts means fewer things to break.",
  },
  {
    icon: Globe,
    title: "OpenClaw's Strengths",
    description:
      "OpenClaw shines for multi-platform messaging (WhatsApp, Telegram, Slack, etc.), voice interaction with ElevenLabs, and its massive ClawHub skill ecosystem with 100+ community skills.",
  },
];

export default function OpenClawComparisonPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-6 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(251,170,25,0.08),transparent_70%)]" />
        <div className="relative max-w-[740px]">
          <AnimatedDiv>
            <span className="mb-6 inline-block animate-breathe rounded-full border border-primary/25 bg-primary/15 px-3.5 py-1 font-mono text-xs tracking-wide text-primary">
              Comparison
            </span>
          </AnimatedDiv>
          <AnimatedDiv delay={0.1}>
            <h1 className="mb-5 text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight">
              <span className="text-primary">Ruuh</span> vs OpenClaw on Android
            </h1>
          </AnimatedDiv>
          <AnimatedDiv delay={0.2}>
            <p className="mx-auto mb-6 max-w-[560px] text-lg leading-relaxed text-muted-foreground">
              Both projects let you run AI agents on Android via Termux +
              proot-distro. Ruuh is inspired by{" "}
              <a
                href="https://github.com/openclaw/openclaw"
                className="font-semibold text-foreground hover:text-primary transition-colors underline decoration-primary/40 underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenClaw
              </a>
              &apos;s vision of AI agents on phones — here&apos;s how they
              differ.
            </p>
          </AnimatedDiv>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-t-soft py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Side-by-Side <span className="text-primary">Comparison</span>
            </h2>
            <p className="mb-12 max-w-[600px] text-[1.05rem] text-muted-foreground">
              Feature-by-feature breakdown of how the two projects compare.
            </p>
          </AnimatedDiv>
          <AnimatedSection>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-card">
                    <th className="px-5 py-4 text-[0.85rem] font-semibold text-muted-foreground">
                      Feature
                    </th>
                    <th className="px-5 py-4 text-[0.85rem] font-semibold text-muted-foreground">
                      OpenClaw
                    </th>
                    <th className="px-5 py-4 text-[0.85rem] font-semibold text-primary">
                      Ruuh
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.label}
                      className={
                        i < comparisonRows.length - 1
                          ? "border-b border-border"
                          : ""
                      }
                    >
                      <td className="px-5 py-4 text-[0.88rem] font-medium text-foreground whitespace-nowrap">
                        {row.label}
                      </td>
                      <td className="px-5 py-4 text-[0.88rem] text-muted-foreground">
                        {row.openclaw}
                      </td>
                      <td className="px-5 py-4 text-[0.88rem] text-foreground">
                        {row.ruuh}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Key Differences */}
      <section className="border-t-soft py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Key <span className="text-primary">Differences</span>
            </h2>
            <p className="mb-12 max-w-[600px] text-[1.05rem] text-muted-foreground">
              The biggest ways Ruuh and OpenClaw diverge in approach.
            </p>
          </AnimatedDiv>
          <StaggerContainer className="mx-auto grid max-w-[400px] grid-cols-1 gap-6 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((item) => (
              <HoverCard
                key={item.title}
                className="rounded-lg border border-border bg-card p-7"
              >
                <GlowIcon className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <item.icon className="size-5" />
                </GlowIcon>
                <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
                <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </HoverCard>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why Ruuh */}
      <section className="border-t-soft py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              When to Choose <span className="text-primary">Ruuh</span>
            </h2>
          </AnimatedDiv>
          <AnimatedSection className="grid items-start gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-7">
              <h3 className="mb-4 text-[1.1rem] font-semibold">
                Choose <span className="text-primary">Ruuh</span> if you want
              </h3>
              <ul className="space-y-3">
                {[
                  "One-command setup with zero patches",
                  "Deep Android hardware access (SMS, sensors, GPS, NFC)",
                  "Fully offline local models via Ollama",
                  "A terminal-native coding agent experience",
                  "Simple architecture with fewer moving parts",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[0.92rem] text-muted-foreground"
                  >
                    <ArrowRight className="mt-0.5 size-4 flex-shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-7">
              <h3 className="mb-4 text-[1.1rem] font-semibold">
                Choose <span className="text-muted-foreground">OpenClaw</span>{" "}
                if you want
              </h3>
              <ul className="space-y-3">
                {[
                  "Multi-platform messaging (WhatsApp, Telegram, Slack, etc.)",
                  "Voice interaction with wake word detection",
                  "100+ community skills from ClawHub",
                  "Multi-agent routing and WebSocket architecture",
                  "Cross-platform support beyond Android",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[0.92rem] text-muted-foreground"
                  >
                    <ArrowRight className="mt-0.5 size-4 flex-shrink-0 text-muted-foreground/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-soft py-24">
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <AnimatedDiv>
            <h2 className="mb-4 text-[1.75rem] font-bold tracking-tight">
              Try <span className="text-primary">Ruuh</span>
            </h2>
            <p className="mx-auto mb-8 max-w-[480px] text-[1.05rem] text-muted-foreground">
              One command. Five minutes. No root, no patches, no configuration.
            </p>
          </AnimatedDiv>
          <AnimatedDiv delay={0.1}>
            <div className="mx-auto flex max-w-[620px] flex-col items-center gap-3 rounded-lg border border-border bg-code-block p-3 sm:p-4 shadow-premium-sm text-left md:flex-row">
              <span className="hidden shrink-0 select-none font-mono text-sm text-primary md:block">
                $
              </span>
              <code className="flex-1 overflow-x-auto break-all sm:break-normal sm:whitespace-nowrap font-mono text-[0.75rem] sm:text-[0.82rem] text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {INSTALL_CMD}
              </code>
              <CopyButton text={INSTALL_CMD} />
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
              <a
                href="/docs"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Read the docs &rarr;
              </a>
              <a
                href="https://github.com/perminder-klair/ruuh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                View on GitHub &rarr;
              </a>
            </div>
          </AnimatedDiv>
        </div>
      </section>
    </main>
  );
}
