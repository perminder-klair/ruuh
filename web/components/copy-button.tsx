"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex-shrink-0 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-xs transition-all cursor-pointer ${
        copied
          ? "border-primary text-primary"
          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {copied ? (
        <Check className="size-3.5" />
      ) : (
        <Copy className="size-3.5" />
      )}
      <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
