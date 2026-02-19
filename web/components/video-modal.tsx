"use client";

import { useState, useCallback, useEffect } from "react";
import { Play, X } from "lucide-react";

const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // TODO: replace with real demo video

export function WatchDemoButton() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
      >
        <Play className="size-4 fill-primary" />
        Watch Demo
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative w-[90vw] max-w-[800px] aspect-video rounded-xl overflow-hidden border border-border bg-code-block shadow-terminal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute -top-10 right-0 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close video"
            >
              <X className="size-4" />
              Close
            </button>
            <iframe
              src={open ? VIDEO_URL : undefined}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
