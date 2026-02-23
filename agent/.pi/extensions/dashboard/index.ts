import fs from "node:fs";
import path from "node:path";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { state, MAX_CHAT_MESSAGES, pushLog } from "./state.js";
import { sseClients, broadcastSSE } from "./sse.js";
import { startServer, stopServer, boundPort } from "./server.js";
import { getLocalIP } from "./network.js";

let piRef: ExtensionAPI | null = null;

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

    // Model info
    if (ctx.model) {
      state.modelName = ctx.model.name ?? null;
      state.modelId = ctx.model.id ?? null;
    }

    // Agent home
    state.agentHome = ctx.cwd ?? null;

    // Scan loaded resources
    const base = ctx.cwd ?? ".";
    try {
      state.skills = fs.readdirSync(path.join(base, ".pi", "skills")).filter(
        (f) => fs.statSync(path.join(base, ".pi", "skills", f)).isDirectory()
      ).sort();
    } catch { state.skills = []; }
    try {
      state.extensions = fs.readdirSync(path.join(base, ".pi", "extensions")).filter(
        (f) => !fs.statSync(path.join(base, ".pi", "extensions", f)).isDirectory()
      ).sort();
    } catch { state.extensions = []; }
    try {
      state.prompts = fs.readdirSync(path.join(base, ".pi", "prompts")).filter(
        (f) => !fs.statSync(path.join(base, ".pi", "prompts", f)).isDirectory()
      ).sort();
    } catch { state.prompts = []; }

    try {
      const port = await startServer(piRef);
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
    stopServer();
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
    const role = (msg as any)?.role;
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

    // Only add assistant messages to chat (user messages are added via /api/chat)
    if (role !== "user" && text.trim()) {
      // Detect skill/prompt content (YAML frontmatter) — show brief notice instead
      const skillMatch = text.match(/^---\s*\nname:\s*(.+)/);
      const chatText = skillMatch
        ? `Loaded skill: ${skillMatch[1].trim()}`
        : text;

      state.chatMessages.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        role: "agent",
        text: chatText,
        timestamp: new Date().toISOString(),
      });
      if (state.chatMessages.length > MAX_CHAT_MESSAGES) {
        state.chatMessages.splice(0, state.chatMessages.length - MAX_CHAT_MESSAGES);
      }
      broadcastSSE({ type: "state", data: state });
    }
  });

  // ---- model_select ----
  pi.on("model_select", async (ev) => {
    state.modelName = ev.model?.name ?? null;
    state.modelId = ev.model?.id ?? null;
    pushLog("session", `Model changed: ${state.modelName ?? "unknown"}`);
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
