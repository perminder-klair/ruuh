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

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: string;
}

interface DashboardState {
  agentStatus: "idle" | "thinking" | "executing_tool";
  currentToolName: string | null;
  sessionStartTime: string | null;
  turnCount: number;
  sessionName: string | null;
  activityLog: ActivityEntry[];
  customStatus: string | null;
  chatMessages: ChatMessage[];
}

const state: DashboardState = {
  agentStatus: "idle",
  currentToolName: null,
  sessionStartTime: null,
  turnCount: 0,
  sessionName: null,
  activityLog: [],
  customStatus: null,
  chatMessages: [],
};

const MAX_LOG_ENTRIES = 50;
const MAX_CHAT_MESSAGES = 100;

let piRef: ExtensionAPI | null = null;

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

  // -- Chat endpoint --
  if (url === "/api/chat" && req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (url === "/api/chat" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
    req.on("end", () => {
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      };
      try {
        const parsed = JSON.parse(body);
        const msg = typeof parsed.message === "string" ? parsed.message.trim() : "";
        if (!msg) {
          res.writeHead(400, headers);
          res.end(JSON.stringify({ error: "Empty message" }));
          return;
        }
        if (!piRef) {
          res.writeHead(503, headers);
          res.end(JSON.stringify({ error: "Agent not ready" }));
          return;
        }

        // Add user message to chat
        state.chatMessages.push({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          role: "user",
          text: msg,
          timestamp: new Date().toISOString(),
        });
        if (state.chatMessages.length > MAX_CHAT_MESSAGES) {
          state.chatMessages.splice(0, state.chatMessages.length - MAX_CHAT_MESSAGES);
        }
        broadcastSSE({ type: "state", data: state });

        // Send to agent — queue as followUp if busy
        const isBusy = state.agentStatus !== "idle";
        if (isBusy) {
          piRef.sendUserMessage(msg, { deliverAs: "followUp" });
        } else {
          piRef.sendUserMessage(msg);
        }

        res.writeHead(200, headers);
        res.end(JSON.stringify({ ok: true, queued: isBusy }));
      } catch {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
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

  // -- PWA: Web App Manifest --
  if (url === "/manifest.json") {
    const manifest = {
      name: "Ruuh Dashboard",
      short_name: "Ruuh",
      start_url: "/",
      display: "standalone",
      background_color: "#0b0907",
      theme_color: "#0b0907",
      icons: [
        { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      ],
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(manifest));
    return;
  }

  // -- PWA: Service Worker --
  if (url === "/sw.js") {
    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.end(`self.addEventListener("fetch", function(event) {
  event.respondWith(fetch(event.request));
});
`);
    return;
  }

  // -- PWA: App Icon --
  if (url === "/icon.svg") {
    res.writeHead(200, { "Content-Type": "image/svg+xml" });
    res.end(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0b0907"/>
  <circle cx="256" cy="256" r="200" fill="#FBAA19"/>
  <text x="256" y="310" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="280" fill="#0b0907">R</text>
</svg>
`);
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
<meta name="theme-color" content="#0b0907">
<link rel="manifest" href="/manifest.json">
<title>Ruuh Dashboard</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #0b0907;
    color: #f0f0f0;
    min-height: 100vh;
    padding: 16px;
  }
  h1 { font-size: 1.4rem; font-weight: 600; margin-bottom: 16px; color: #f0f0f0; }
  .card {
    background: #141210;
    border: 1px solid #201e1b;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
  }
  .card-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #8a8480;
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
  .tool-name { color: #FBAA19; font-family: monospace; font-size: 0.9rem; margin-top: 4px; }

  /* Session info */
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .info-item label { font-size: 0.7rem; color: #8a8480; display: block; }
  .info-item span { font-size: 0.95rem; }

  /* Custom status */
  .custom-status { font-size: 1rem; color: #d4d0cc; font-style: italic; }
  .custom-status.empty { color: #5a5550; }

  /* Activity log */
  .log { max-height: 50vh; overflow-y: auto; }
  .log-entry {
    display: flex;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid #1a1816;
    font-size: 0.82rem;
    line-height: 1.4;
  }
  .log-time { color: #5a5550; flex-shrink: 0; font-family: monospace; font-size: 0.75rem; }
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
  .log-badge.turn    { background: #2a1d08; color: #FBAA19; }
  .log-badge.tool    { background: #3b1520; color: #f85149; }
  .log-badge.message { background: #2a1d08; color: #FBAA19; }
  .log-text { color: #d4d0cc; word-break: break-word; }

  .disconnected {
    background: #3b1520;
    color: #f85149;
    text-align: center;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 12px;
    display: none;
  }

  /* PWA install banner */
  .install-banner {
    display: none;
    background: #141210;
    border: 1px solid #FBAA19;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 12px;
    align-items: center;
    gap: 12px;
  }
  .install-banner.visible { display: flex; }
  .install-banner-text {
    flex: 1;
    font-size: 0.85rem;
    color: #f0f0f0;
    line-height: 1.4;
  }
  .install-banner-text strong { color: #FBAA19; }
  .install-btn {
    background: #FBAA19;
    color: #0b0907;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
  }
  .install-btn:active { opacity: 0.7; }
  .install-dismiss {
    background: none;
    border: none;
    color: #8a8480;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
  }

  /* Chat */
  .chat-messages {
    max-height: 45vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 0;
  }
  .chat-empty {
    color: #5a5550;
    font-size: 0.85rem;
    text-align: center;
    padding: 24px 0;
  }
  .chat-msg {
    max-width: 85%;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 0.88rem;
    line-height: 1.45;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .chat-msg.user {
    align-self: flex-end;
    background: #2a1d08;
    color: #FBAA19;
    border-bottom-right-radius: 4px;
  }
  .chat-msg.agent {
    align-self: flex-start;
    background: #1a1816;
    color: #d4d0cc;
    border-bottom-left-radius: 4px;
  }
  .chat-msg .chat-time {
    display: block;
    font-size: 0.65rem;
    color: #5a5550;
    margin-top: 4px;
  }
  .chat-input-row {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  .chat-input {
    flex: 1;
    background: #0b0907;
    border: 1px solid #201e1b;
    border-radius: 8px;
    padding: 8px 12px;
    color: #f0f0f0;
    font-size: 0.9rem;
    outline: none;
  }
  .chat-input:focus { border-color: #FBAA19; }
  .chat-send {
    background: #2a1d08;
    color: #FBAA19;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
  }
  .chat-send:active { opacity: 0.7; }
  .chat-hint {
    font-size: 0.7rem;
    color: #5a5550;
    margin-top: 4px;
    min-height: 1em;
  }

  /* Tabs */
  .top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .top-bar h1 { margin-bottom: 0; }
  .tabs { display: flex; gap: 4px; }
  .tab {
    background: transparent; border: 1px solid #201e1b; border-radius: 8px;
    color: #8a8480; padding: 6px 14px; font-size: 0.8rem; font-weight: 600;
    cursor: pointer;
  }
  .tab.active { background: #141210; color: #f0f0f0; border-color: #FBAA19; }
  .view { display: none; }
  .view.active { display: block; }
</style>
</head>
<body>
<div class="top-bar">
  <h1>Ruuh</h1>
  <nav class="tabs">
    <button class="tab active" data-tab="home">Home</button>
    <button class="tab" data-tab="chat">Chat</button>
  </nav>
</div>
<div class="disconnected" id="disconnected">Reconnecting...</div>

<div id="viewHome" class="view active">
  <div class="install-banner" id="installBanner">
    <div class="install-banner-text"><strong>Ruuh</strong> can be added to your home screen for an app-like experience.</div>
    <button class="install-btn" id="installBtn">Install</button>
    <button class="install-dismiss" id="installDismiss">&times;</button>
  </div>

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
</div>

<div id="viewChat" class="view">
  <!-- Chat -->
  <div class="card">
    <div class="card-title">Chat</div>
    <div class="chat-messages" id="chatMessages">
      <div class="chat-empty">Send a message to Ruuh</div>
    </div>
    <div class="chat-input-row">
      <input class="chat-input" id="chatInput" type="text" placeholder="Type a message..." autocomplete="off">
      <button class="chat-send" id="chatSend">Send</button>
    </div>
    <div class="chat-hint" id="chatHint"></div>
  </div>

  <!-- Activity Log -->
  <div class="card">
    <div class="card-title">Activity Log</div>
    <div class="log" id="log"></div>
  </div>
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

    // Chat messages
    var chatEl = $("chatMessages");
    var chatCount = (s.chatMessages || []).length;
    if (chatEl.dataset.count !== String(chatCount)) {
      chatEl.dataset.count = String(chatCount);
      if (chatCount === 0) {
        chatEl.innerHTML = '<div class="chat-empty">Send a message to Ruuh</div>';
      } else {
        // Safe: all text is escaped via escapeHtml before insertion
        chatEl.innerHTML = s.chatMessages.map(function(m) {
          var t = new Date(m.timestamp).toLocaleTimeString();
          return '<div class="chat-msg ' + m.role + '">' +
            escapeHtml(m.text) +
            '<span class="chat-time">' + t + '</span>' +
            '</div>';
        }).join("");
        chatEl.scrollTop = chatEl.scrollHeight;
      }
    }

    // Chat delivery hint
    $("chatHint").textContent = s.agentStatus !== "idle"
      ? "Agent is busy — message will be queued"
      : "";

    // Activity log — safe: all text escaped via escapeHtml
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

  // Chat
  async function sendChat() {
    var input = $("chatInput");
    var msg = input.value.trim();
    if (!msg) return;
    input.disabled = true;
    $("chatSend").disabled = true;
    try {
      var resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      if (resp.ok) input.value = "";
    } catch (e) {
      // network error — ignore, user can retry
    } finally {
      input.disabled = false;
      $("chatSend").disabled = false;
      input.focus();
    }
  }

  $("chatInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") sendChat();
  });
  $("chatSend").addEventListener("click", sendChat);

  // PWA: Service Worker registration
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(function() {});
  }

  // PWA: Install prompt
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function(e) {
    e.preventDefault();
    deferredPrompt = e;
    $("installBanner").classList.add("visible");
  });
  $("installBtn").addEventListener("click", function() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function() {
      deferredPrompt = null;
      $("installBanner").classList.remove("visible");
    });
  });
  $("installDismiss").addEventListener("click", function() {
    $("installBanner").classList.remove("visible");
    deferredPrompt = null;
  });

  // Tab switching
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  document.querySelectorAll(".tab").forEach(function(btn) {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".tab").forEach(function(b) { b.classList.remove("active"); });
      document.querySelectorAll(".view").forEach(function(v) { v.classList.remove("active"); });
      btn.classList.add("active");
      document.getElementById("view" + capitalize(btn.dataset.tab)).classList.add("active");
    });
  });
</script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Extension
// ---------------------------------------------------------------------------

export default function dashboardExtension(pi: ExtensionAPI) {
  piRef = pi;

  // ---- session_start ----
  pi.on("session_start", async (_ev, ctx) => {
    state.sessionStartTime = new Date().toISOString();
    state.agentStatus = "idle";
    state.turnCount = 0;
    state.activityLog = [];
    state.customStatus = null;
    state.currentToolName = null;
    state.chatMessages = [];

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
    const msg = ev.message;
    const text = msg && "content" in msg && Array.isArray((msg as any).content)
      ? (msg as any).content
          .filter((c: any) => c.type === "text")
          .map((c: any) => c.text as string)
          .join("")
      : "";
    const preview = text.length > 100 ? text.slice(0, 100) + "..." : text;
    if (preview) {
      pushLog("message", preview);
    }

    // Add agent response to chat
    if (text.trim()) {
      state.chatMessages.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        role: "agent",
        text: text,
        timestamp: new Date().toISOString(),
      });
      if (state.chatMessages.length > MAX_CHAT_MESSAGES) {
        state.chatMessages.splice(0, state.chatMessages.length - MAX_CHAT_MESSAGES);
      }
      broadcastSSE({ type: "state", data: state });
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
