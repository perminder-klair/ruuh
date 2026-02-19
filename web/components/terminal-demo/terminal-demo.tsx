"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { PhoneFrame } from "./phone-frame";
import { TerminalPlayer } from "./terminal-player";

export function TerminalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref}>
      <PhoneFrame>
        <TerminalPlayer playing={isInView} />
      </PhoneFrame>
    </div>
  );
}
