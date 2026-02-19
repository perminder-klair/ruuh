import type { ReactNode } from "react";

function WifiIcon() {
  return (
    <svg width="12" height="10" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM3.46 7.04a6.25 6.25 0 019.08 0l-.94.94a5 5 0 00-7.2 0l-.94-.94zM.64 4.22a10 10 0 0114.72 0l-.94.94a8.75 8.75 0 00-12.84 0l-.94-.94z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="18" height="10" viewBox="0 0 25 12" fill="currentColor">
      <rect x="0" y="0.5" width="21" height="11" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="2" y="2.5" width="17" height="7" rx="1" fill="currentColor" opacity="0.8" />
      <path d="M23 4v4a2 2 0 000-4z" />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg width="12" height="10" viewBox="0 0 16 12" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="0.5" />
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
      <rect x="9" y="3" width="3" height="9" rx="0.5" />
      <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.3" />
    </svg>
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-[280px] sm:w-[300px] md:w-[320px] mx-auto">
      {/* Outer bezel */}
      <div className="rounded-[1.2rem] bg-[#1a1816] p-[6px] shadow-terminal">
        {/* Inner bezel */}
        <div className="rounded-[0.9rem] bg-[#0e0c0a] overflow-hidden border border-[#2a2725]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 py-2 bg-[#0e0c0a]">
            <span className="font-mono text-[10px] text-[#999] font-medium">9:41</span>
            <div className="flex items-center gap-1.5 text-[#999]">
              <SignalIcon />
              <WifiIcon />
              <BatteryIcon />
            </div>
          </div>

          {/* Camera notch */}
          <div className="flex justify-center -mt-0.5 mb-1">
            <div className="h-[6px] w-[6px] rounded-full bg-[#1a1816] ring-1 ring-[#2a2725]" />
          </div>

          {/* Screen content */}
          <div className="bg-code-block min-h-[380px] max-h-[420px]">
            {children}
          </div>

          {/* Bottom nav hint */}
          <div className="flex justify-center py-2.5 bg-[#0e0c0a]">
            <div className="h-[4px] w-[100px] rounded-full bg-[#333]" />
          </div>
        </div>
      </div>
    </div>
  );
}
