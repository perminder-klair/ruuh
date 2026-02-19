import Link from "next/link";
import { Github } from "lucide-react";

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/sheet", label: "Cheatsheet" },
];

const resourceLinks = [
  {
    href: "https://github.com/perminder-klair/ruuh",
    label: "GitHub",
    external: true,
  },
  {
    href: "https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent",
    label: "pi-coding-agent",
    external: true,
  },
  {
    href: "https://f-droid.org/en/packages/com.termux/",
    label: "Termux (F-Droid)",
    external: true,
  },
  {
    href: "https://f-droid.org/en/packages/com.termux.api/",
    label: "Termux:API",
    external: true,
  },
];

export function Footer() {
  return (
    <footer className="border-t-soft mt-8">
      <div className="mx-auto max-w-[1100px] px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="font-bold tracking-tight text-foreground">
              <span className="text-primary">ruuh</span>
            </Link>
            <p className="mt-3 max-w-[260px] text-[0.85rem] leading-relaxed text-muted-foreground">
              A personal AI assistant that lives on your Android device. Open
              source, privacy-first.
            </p>
            <a
              href="https://github.com/perminder-klair/ruuh"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[0.85rem] text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="size-4" />
              Star on GitHub
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-[0.82rem] font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.88rem] text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-[0.82rem] font-semibold uppercase tracking-wider text-muted-foreground">
              Resources
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.88rem] text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-[0.82rem] text-muted-foreground">
            Built by{" "}
            <a
              href="https://www.klair.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Parminder Klair
            </a>
          </p>
          <p className="text-[0.82rem] text-muted-foreground">
            Open source under MIT License
          </p>
        </div>
      </div>
    </footer>
  );
}
