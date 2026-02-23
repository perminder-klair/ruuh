"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
      style={{ borderBottomColor: "rgba(251,170,25,0.08)" }}
    >
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-6">
        <Link href="/" className="font-bold tracking-tight text-foreground">
          <span className="text-primary animate-text-glow">Ruuh</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/docs"
            className={`text-sm transition-colors hover:text-primary ${
              pathname === "/docs" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Docs
          </Link>
          <Link
            href="/sheet"
            className={`text-sm transition-colors hover:text-primary ${
              pathname === "/sheet" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Cheatsheet
          </Link>
          <a
            href="https://github.com/perminder-klair/ruuh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
          >
            <Github className="size-[18px]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.shields.io/github/stars/perminder-klair/ruuh?style=flat&color=fbaa19&labelColor=1a1a1a&logo=github&logoColor=white"
              alt="GitHub stars"
              className="h-5"
            />
          </a>
        </nav>
      </div>
    </header>
  );
}
