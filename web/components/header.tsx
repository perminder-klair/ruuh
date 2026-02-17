"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-6">
        <Link href="/" className="font-bold tracking-tight text-foreground">
          <span className="text-primary">Ruuh</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/docs"
            className={`text-sm transition-colors hover:text-primary ${
              pathname === "/docs"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Docs
          </Link>
          <a
            href="https://github.com/perminder-klair/ruuh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Github className="size-[18px]" />
          </a>
        </nav>
      </div>
    </header>
  );
}
