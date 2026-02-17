import http from "node:http";
import os from "node:os";
import { execSync } from "node:child_process";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface ActivityEntry {
  timestamp: string;
  type: "session" | "agent" | "turn" | "tool" | "message";
  text: string;
}

interface DashboardState {
  agentStatus: "idle" | "thinking" | "executing_tool";
  currentToolName: string | null;
  sessionStartTime: string | null;
  turnCount: number;
  sessionName: string | null;
  activityLog: ActivityEntry[];
  customStatus: string | null;
}

const state: DashboardState = {
  agentStatus: "idle",
  currentToolName: null,
  sessionStartTime: null,
  turnCount: 0,
  sessionName: null,
  activityLog: [],
  customStatus: null,
};

const MAX_LOG_ENTRIES = 50;

function pushLog(type: ActivityEntry["type"], text: string) {
  state.activityLog.unshift({
    timestamp: new Date().toISOString(),
    type,
    text,
  });
  if (state.activityLog.length > MAX_LOG_ENTRIES) {
    state.activityLog.length = MAX_LOG_ENTRIES;
  }
  broadcastSSE({ type: "state", data: state });
}

// ---------------------------------------------------------------------------
// SSE
// ---------------------------------------------------------------------------

const sseClients = new Set<http.ServerResponse>();

function broadcastSSE(payload: unknown) {
  const message = `data: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

// ---------------------------------------------------------------------------
// HTTP Server
// ---------------------------------------------------------------------------

let server: http.Server | null = null;
let boundPort: number | null = null;

function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = req.url ?? "/";

  if (url === "/api/state") {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify(state));
    return;
  }

  if (url === "/api/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write(`data: ${JSON.stringify({ type: "state", data: state })}\n\n`);
    sseClients.add(res);
    req.on("close", () => sseClients.delete(res));
    return;
  }

  // Serve dashboard HTML for everything else
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(dashboardHTML());
}

async function startServer(): Promise<number> {
  const ports = [3000, 3001, 3002, 3003, 3004];
  for (const port of ports) {
    try {
      const p = await tryListen(port);
      return p;
    } catch {
      // port busy, try next
    }
  }
  throw new Error("Could not bind to any port in range 3000-3004");
}

function tryListen(port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = http.createServer(handleRequest);
    srv.once("error", reject);
    srv.listen(port, "0.0.0.0", () => {
      server = srv;
      resolve(port);
    });
  });
}

// ---------------------------------------------------------------------------
// IP Detection
// ---------------------------------------------------------------------------

function getLocalIP(): string {
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

// ---------------------------------------------------------------------------
// Dashboard HTML
// ---------------------------------------------------------------------------

function dashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ruuh Dashboard</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #0f1117;
    color: #e1e4e8;
    min-height: 100vh;
    padding: 16px;
  }
  h1 { font-size: 1.4rem; font-weight: 600; margin-bottom: 16px; color: #f0f3f6; }
  .card {
    background: #1a1e2a;
    border: 1px solid #2d3348;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
  }
  .card-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7394;
    margin-bottom: 8px;
  }

  /* Status indicator */
  .status-row { display: flex; align-items: center; gap: 12px; }
  .status-dot {
    width: 14px; height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .status-dot.idle     { background: #3fb950; box-shadow: 0 0 8px #3fb95088; animation: pulse 2s infinite; }
  .status-dot.thinking { background: #d29922; box-shadow: 0 0 8px #d2992288; animation: pulse 1s infinite; }
  .status-dot.executing_tool { background: #f85149; box-shadow: 0 0 8px #f8514988; animation: pulse 0.5s infinite; }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .status-label { font-size: 1.1rem; font-weight: 500; }
  .tool-name { color: #79c0ff; font-family: monospace; font-size: 0.9rem; margin-top: 4px; }

  /* Session info */
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .info-item label { font-size: 0.7rem; color: #6b7394; display: block; }
  .info-item span { font-size: 0.95rem; }

  /* Custom status */
  .custom-status { font-size: 1rem; color: #c9d1d9; font-style: italic; }
  .custom-status.empty { color: #484f5e; }

  /* Activity log */
  .log { max-height: 50vh; overflow-y: auto; }
  .log-entry {
    display: flex;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid #1e2235;
    font-size: 0.82rem;
    line-height: 1.4;
  }
  .log-time { color: #484f5e; flex-shrink: 0; font-family: monospace; font-size: 0.75rem; }
  .log-badge {
    font-size: 0.65rem;
    padding: 1px 6px;
    border-radius: 4px;
    flex-shrink: 0;
    font-weight: 600;
    text-transform: uppercase;
  }
  .log-badge.session { background: #1f3d2d; color: #3fb950; }
  .log-badge.agent   { background: #3b2e12; color: #d29922; }
  .log-badge.turn    { background: #1b2a4a; color: #58a6ff; }
  .log-badge.tool    { background: #3b1520; color: #f85149; }
  .log-badge.message { background: #272046; color: #bc8cff; }
  .log-text { color: #c9d1d9; word-break: break-word; }

  .disconnected {
    background: #3b1520;
    color: #f85149;
    text-align: center;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 12px;
    display: none;
  }
</style>
</head>
<body>
<h1>Ruuh Dashboard</h1>
<div class="disconnected" id="disconnected">Reconnecting...</div>

<!-- Status Card -->
<div class="card">
  <div class="card-title">Status</div>
  <div class="status-row">
    <div class="status-dot idle" id="statusDot"></div>
    <span class="status-label" id="statusLabel">Idle</span>
  </div>
  <div class="tool-name" id="toolName"></div>
</div>

<!-- Session Info -->
<div class="card">
  <div class="card-title">Session</div>
  <div class="info-grid">
    <div class="info-item"><label>Name</label><span id="sessionName">—</span></div>
    <div class="info-item"><label>Started</label><span id="sessionStart">—</span></div>
    <div class="info-item"><label>Turns</label><span id="turnCount">0</span></div>
    <div class="info-item"><label>Uptime</label><span id="uptime">—</span></div>
  </div>
</div>

<!-- Custom Status -->
<div class="card">
  <div class="card-title">What Ruuh is doing</div>
  <div class="custom-status empty" id="customStatus">No status set</div>
</div>

<!-- Activity Log -->
<div class="card">
  <div class="card-title">Activity Log</div>
  <div class="log" id="log"></div>
</div>

<script>
  const $ = (id) => document.getElementById(id);

  const statusLabels = {
    idle: "Idle",
    thinking: "Thinking",
    executing_tool: "Executing Tool"
  };

  function render(s) {
    // Status
    const dot = $("statusDot");
    dot.className = "status-dot " + s.agentStatus;
    $("statusLabel").textContent = statusLabels[s.agentStatus] || s.agentStatus;
    $("toolName").textContent = s.currentToolName ? "Tool: " + s.currentToolName : "";

    // Session
    $("sessionName").textContent = s.sessionName || "—";
    $("turnCount").textContent = s.turnCount;
    if (s.sessionStartTime) {
      const d = new Date(s.sessionStartTime);
      $("sessionStart").textContent = d.toLocaleTimeString();
      const secs = Math.floor((Date.now() - d.getTime()) / 1000);
      const m = Math.floor(secs / 60);
      const sec = secs % 60;
      $("uptime").textContent = m + "m " + sec + "s";
    }

    // Custom status
    const cs = $("customStatus");
    if (s.customStatus) {
      cs.textContent = s.customStatus;
      cs.className = "custom-status";
    } else {
      cs.textContent = "No status set";
      cs.className = "custom-status empty";
    }

    // Activity log
    const logEl = $("log");
    logEl.innerHTML = s.activityLog.map(function(e) {
      const t = new Date(e.timestamp);
      const time = t.toLocaleTimeString();
      return '<div class="log-entry">' +
        '<span class="log-time">' + time + '</span>' +
        '<span class="log-badge ' + e.type + '">' + e.type + '</span>' +
        '<span class="log-text">' + escapeHtml(e.text) + '</span>' +
        '</div>';
    }).join("");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Uptime ticker
  setInterval(function() {
    if (state && state.sessionStartTime) {
      const secs = Math.floor((Date.now() - new Date(state.sessionStartTime).getTime()) / 1000);
      const m = Math.floor(secs / 60);
      const sec = secs % 60;
      $("uptime").textContent = m + "m " + sec + "s";
    }
  }, 1000);

  // SSE
  let state = null;
  let reconnectDelay = 1000;

  function connect() {
    const es = new EventSource("/api/events");
    es.onmessage = function(ev) {
      $("disconnected").style.display = "none";
      reconnectDelay = 1000;
      const msg = JSON.parse(ev.data);
      if (msg.type === "state") {
        state = msg.data;
        render(state);
      }
    };
    es.onerror = function() {
      es.close();
      $("disconnected").style.display = "block";
      setTimeout(connect, reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 2, 10000);
    };
  }

  connect();
</script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Extension
// ---------------------------------------------------------------------------

export default function dashboardExtension(pi: ExtensionAPI) {
  // ---- session_start ----
  pi.on("session_start", async (_ev, ctx) => {
    state.sessionStartTime = new Date().toISOString();
    state.agentStatus = "idle";
    state.turnCount = 0;
    state.activityLog = [];
    state.customStatus = null;
    state.currentToolName = null;

    try {
      const port = await startServer();
      boundPort = port;
      const ip = getLocalIP();
      const url = `http://${ip}:${port}`;
      ctx.ui.setStatus(`Dashboard: ${url}`);
      pushLog("session", `Session started — dashboard at ${url}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      pushLog("session", `Failed to start dashboard server: ${msg}`);
    }
  });

  // ---- session_shutdown ----
  pi.on("session_shutdown", async () => {
    pushLog("session", "Session shutting down");
    for (const client of sseClients) {
      try { client.end(); } catch { /* ignore */ }
    }
    sseClients.clear();
    if (server) {
      server.close();
      server = null;
      boundPort = null;
    }
  });

  // ---- agent_start ----
  pi.on("agent_start", async () => {
    state.agentStatus = "thinking";
    pushLog("agent", "Agent started processing");
  });

  // ---- agent_end ----
  pi.on("agent_end", async () => {
    state.agentStatus = "idle";
    state.currentToolName = null;
    pushLog("agent", "Agent finished processing");
  });

  // ---- turn_start ----
  pi.on("turn_start", async () => {
    state.turnCount++;
    pushLog("turn", `Turn ${state.turnCount} started`);
  });

  // ---- turn_end ----
  pi.on("turn_end", async (ev) => {
    const summary = ev.summary ?? `Turn ${state.turnCount} completed`;
    pushLog("turn", summary);
  });

  // ---- tool_call ----
  pi.on("tool_call", async (ev) => {
    state.agentStatus = "executing_tool";
    state.currentToolName = ev.toolName ?? "unknown";
    pushLog("tool", `Calling tool: ${state.currentToolName}`);
  });

  // ---- tool_result ----
  pi.on("tool_result", async (ev) => {
    state.agentStatus = "thinking";
    const preview = ev.resultSummary ?? `${state.currentToolName} completed`;
    state.currentToolName = null;
    pushLog("tool", preview);
  });

  // ---- message_end ----
  pi.on("message_end", async (ev) => {
    const text = ev.text ?? "";
    const preview = text.length > 100 ? text.slice(0, 100) + "..." : text;
    if (preview) {
      pushLog("message", preview);
    }
  });

  // ---- /status command ----
  pi.registerCommand("status", {
    description: "Show dashboard URL and current agent status",
    async handler(_ctx) {
      const ip = getLocalIP();
      const url = boundPort ? `http://${ip}:${boundPort}` : "not running";
      const lines = [
        `Dashboard: ${url}`,
        `Status:    ${state.agentStatus}`,
        `Turns:     ${state.turnCount}`,
      ];
      if (state.currentToolName) {
        lines.push(`Tool:      ${state.currentToolName}`);
      }
      if (state.customStatus) {
        lines.push(`Doing:     ${state.customStatus}`);
      }
      return lines.join("\n");
    },
  });

  // ---- pi_status tool ----
  pi.registerTool({
    name: "pi_status",
    label: "Set Dashboard Status",
    description:
      "Set a human-readable status message on the Ruuh dashboard. " +
      "Use this to tell the user what you are currently working on.",
    parameters: Type.Object({
      status: Type.String({
        description:
          "A short description of what you are doing, e.g. 'Reviewing auth module'",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const { status } = params;
      state.customStatus = status;
      broadcastSSE({ type: "state", data: state });
      return `Dashboard status updated: ${status}`;
    },
  });
}
