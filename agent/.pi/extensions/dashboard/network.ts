import os from "node:os";
import { execSync } from "node:child_process";

export function getLocalIP(): string {
  // Try Node's os.networkInterfaces first
  const ifaces = os.networkInterfaces();
  for (const entries of Object.values(ifaces)) {
    if (!entries) continue;
    for (const entry of entries) {
      if (!entry.internal && entry.family === "IPv4") {
        return entry.address;
      }
    }
  }

  // Fallback: parse ip command (works inside proot)
  try {
    const output = execSync("ip -4 addr show 2>/dev/null", {
      encoding: "utf-8",
      timeout: 3000,
    });
    const match = output.match(/inet (\d+\.\d+\.\d+\.\d+).*scope global/);
    if (match) return match[1];
  } catch {
    // ignore
  }

  return "localhost";
}
