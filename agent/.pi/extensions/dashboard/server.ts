import http from "node:http";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { state, MAX_CHAT_MESSAGES } from "./state.js";
import { sseClients, broadcastSSE } from "./sse.js";
import { dashboardHTML } from "./template.js";

let server: http.Server | null = null;
export let boundPort: number | null = null;

export function handleRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  piRef: ExtensionAPI | null,
) {
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
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      };
      try {
        const parsed = JSON.parse(body);
        const msg =
          typeof parsed.message === "string" ? parsed.message.trim() : "";
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
          id:
            Date.now().toString(36) +
            Math.random().toString(36).slice(2, 6),
          role: "user",
          text: msg,
          timestamp: new Date().toISOString(),
        });
        if (state.chatMessages.length > MAX_CHAT_MESSAGES) {
          state.chatMessages.splice(
            0,
            state.chatMessages.length - MAX_CHAT_MESSAGES,
          );
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
      name: "Ruuh",
      short_name: "Ruuh",
      start_url: "/",
      display: "standalone",
      orientation: "portrait",
      background_color: "#0b0907",
      theme_color: "#0b0907",
      icons: [
        {
          src: "/icon.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
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

export async function startServer(
  piRef: ExtensionAPI | null,
): Promise<number> {
  const ports = [3000, 3001, 3002, 3003, 3004];
  for (const port of ports) {
    try {
      const p = await tryListen(port, piRef);
      return p;
    } catch {
      // port busy, try next
    }
  }
  throw new Error("Could not bind to any port in range 3000-3004");
}

function tryListen(port: number, piRef: ExtensionAPI | null): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) =>
      handleRequest(req, res, piRef),
    );
    srv.once("error", reject);
    srv.listen(port, "0.0.0.0", () => {
      server = srv;
      boundPort = port;
      resolve(port);
    });
  });
}

export function stopServer() {
  if (server) {
    server.close();
    server = null;
    boundPort = null;
  }
}
