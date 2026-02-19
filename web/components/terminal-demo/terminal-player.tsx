"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { DEMO_SCRIPT, TIMING } from "@/lib/terminal-script";
import type { TerminalLine, ScriptStep } from "@/lib/terminal-script";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randRange(base: number, variance: number) {
  return base + (Math.random() - 0.5) * variance;
}

export function TerminalPlayer({ playing }: { playing: boolean }) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [done, setDone] = useState(false);
  const abortRef = useRef(false);
  const hasPlayedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const addLine = useCallback(
    (line: TerminalLine) => {
      setLines((prev) => [...prev, line]);
      // Scroll after state update
      setTimeout(scrollToBottom, 10);
    },
    [scrollToBottom],
  );

  const updateLastLine = useCallback(
    (updater: (line: TerminalLine) => TerminalLine) => {
      setLines((prev) => {
        if (prev.length === 0) return prev;
        const copy = [...prev];
        copy[copy.length - 1] = updater(copy[copy.length - 1]);
        return copy;
      });
      setTimeout(scrollToBottom, 10);
    },
    [scrollToBottom],
  );

  const play = useCallback(async () => {
    abortRef.current = false;
    setLines([]);
    setDone(false);
    setCursorVisible(false);

    for (const step of DEMO_SCRIPT) {
      if (abortRef.current) return;

      switch (step.type) {
        case "prompt": {
          // Add the prompt line with empty text
          addLine({
            text: "",
            isPrompt: true,
            prefix: step.prefix,
            revealed: 0,
          });
          await sleep(200);

          // Type each character
          for (let i = 0; i < step.text.length; i++) {
            if (abortRef.current) return;
            const charIndex = i;
            updateLastLine((line) => ({
              ...line,
              text: step.text.slice(0, charIndex + 1),
              revealed: charIndex + 1,
            }));
            await sleep(randRange(TIMING.userChar, TIMING.userCharVariance));
          }
          await sleep(TIMING.postPrompt);
          break;
        }

        case "output": {
          for (const text of step.lines) {
            if (abortRef.current) return;
            addLine({ text, isPrompt: false, revealed: -1 });
            await sleep(randRange(TIMING.botLine, TIMING.botLineVariance));
          }
          await sleep(TIMING.postOutput);
          break;
        }

        case "pause": {
          await sleep(step.ms);
          break;
        }

        case "cursor": {
          addLine({
            text: "",
            isPrompt: true,
            prefix: step.prefix,
            revealed: 0,
          });
          setCursorVisible(true);
          break;
        }
      }
    }

    if (!abortRef.current) {
      setDone(true);
    }
  }, [addLine, updateLastLine]);

  useEffect(() => {
    if (playing && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      play();
    }
  }, [playing, play]);

  const replay = useCallback(() => {
    abortRef.current = true;
    setCursorVisible(false);
    // Small delay to let current play() exit
    setTimeout(() => {
      play();
    }, 50);
  }, [play]);

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        className="overflow-y-auto p-4 font-mono text-[0.72rem] sm:text-[0.78rem] leading-[1.7] text-muted-foreground min-h-[420px] max-h-[420px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {lines.map((line, i) => (
          <div key={i} className="min-h-[1.7em]">
            {line.isPrompt ? (
              <>
                <span className="text-primary">{line.prefix} </span>
                <span className="text-foreground">{line.text}</span>
                {/* Inline cursor while typing */}
                {i === lines.length - 1 && !done && (
                  <span className="inline-block h-[1em] w-[0.5em] bg-primary align-text-bottom animate-blink ml-px" />
                )}
              </>
            ) : (
              <span>
                {line.text.startsWith("\u2713") ? (
                  <span className="text-green-400">{line.text}</span>
                ) : (
                  line.text
                )}
              </span>
            )}
          </div>
        ))}

        {/* Blinking cursor on final line */}
        {cursorVisible && done && (
          <span className="inline-block h-[1em] w-[0.5em] bg-primary animate-blink" />
        )}
      </div>

      {/* Replay button */}
      {done && (
        <button
          onClick={replay}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-primary/15 px-2.5 py-1.5 text-[0.7rem] font-medium text-primary hover:bg-primary/25 transition-colors"
          aria-label="Replay demo"
        >
          <RotateCcw className="size-3" />
          Replay
        </button>
      )}
    </div>
  );
}
