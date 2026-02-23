import { broadcastSSE } from "./sse.js";

export interface ActivityEntry {
  timestamp: string;
  type: "session" | "agent" | "turn" | "tool" | "message";
  text: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: string;
}

export interface DashboardState {
  agentStatus: "idle" | "thinking" | "executing_tool";
  currentToolName: string | null;
  sessionStartTime: string | null;
  turnCount: number;
  sessionName: string | null;
  activityLog: ActivityEntry[];
  customStatus: string | null;
  chatMessages: ChatMessage[];
  modelName: string | null;
  modelId: string | null;
  skills: string[];
  extensions: string[];
  prompts: string[];
  agentHome: string | null;
}

export const state: DashboardState = {
  agentStatus: "idle",
  currentToolName: null,
  sessionStartTime: null,
  turnCount: 0,
  sessionName: null,
  activityLog: [],
  customStatus: null,
  chatMessages: [],
  modelName: null,
  modelId: null,
  skills: [],
  extensions: [],
  prompts: [],
  agentHome: null,
};

export const MAX_LOG_ENTRIES = 50;
export const MAX_CHAT_MESSAGES = 100;

export function pushLog(type: ActivityEntry["type"], text: string) {
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
