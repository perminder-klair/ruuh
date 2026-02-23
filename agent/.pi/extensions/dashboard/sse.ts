import http from "node:http";

export const sseClients = new Set<http.ServerResponse>();

export function broadcastSSE(payload: unknown) {
  const message = `data: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}
