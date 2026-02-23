"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Play, X } from "lucide-react";

function CRTStatic({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        className="absolute inset-0 w-full h-full opacity-40"
        style={{ imageRendering: "pixelated" }}
      />
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 120px 40px rgba(0,0,0,0.7)",
        }}
      />
      {/* Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="font-mono text-xl sm:text-2xl font-bold text-white/70 tracking-widest drop-shadow-[0_0_12px_rgba(251,170,25,0.4)]">
          NO SIGNAL
        </span>
        <span className="font-mono text-xs text-white/40 tracking-wide">
          demo coming soon
        </span>
      </div>
    </div>
  );
}

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
            className="relative w-[90vw] max-w-[800px] aspect-video rounded-xl overflow-hidden border border-border shadow-terminal"
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
            <CRTStatic active={open} />
          </div>
        </div>
      )}
    </>
  );
}
