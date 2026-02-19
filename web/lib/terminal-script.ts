export type ScriptStep =
  | { type: "prompt"; prefix: string; text: string }
  | { type: "output"; lines: string[] }
  | { type: "pause"; ms: number }
  | { type: "cursor"; prefix: string };

export interface TerminalLine {
  text: string;
  isPrompt: boolean;
  prefix?: string;
  revealed: number; // chars revealed so far, -1 = fully revealed
}

export const TIMING = {
  userChar: 55,
  userCharVariance: 30,
  botLine: 200,
  botLineVariance: 150,
  postPrompt: 400,
  postOutput: 300,
} as const;

export const DEMO_SCRIPT: ScriptStep[] = [
  { type: "prompt", prefix: "~ $", text: "ruuh" },
  { type: "pause", ms: 600 },
  {
    type: "output",
    lines: [
      "Starting pi-coding-agent...",
      "Loading MEMORY.md...",
      "Loading SOUL.md persona...",
      "Discovering skills...",
      "  \u2713 termux-device",
      "  \u2713 termux-comms",
      "",
      "Ready. What do you need?",
      "",
    ],
  },
  {
    type: "prompt",
    prefix: "pi >",
    text: "send a good morning text to mom",
  },
  { type: "pause", ms: 800 },
  {
    type: "output",
    lines: [
      "",
      'Searching contacts for "mom"...',
      "Found: Mom (Sarah) \u2014 +1 (555) 234-5678",
      "",
      "Drafting message:",
      '  "Good morning Mom! \u2764\uFE0F Hope you have a',
      '   wonderful day."',
      "",
      "Sending SMS via termux-sms-send...",
      "\u2713 Message sent successfully!",
      "",
    ],
  },
  { type: "cursor", prefix: "pi >" },
];
