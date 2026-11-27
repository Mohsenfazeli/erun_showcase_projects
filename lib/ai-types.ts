import type { TriageResult } from "@/data/support";

export type AiMode = "doc-chat" | "triage" | "policy";

export const MAX_INPUT_CHARS = 2000;

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface DocChatResult {
  answer: string;
  found: boolean;
  citations: { id: string; docTitle: string; heading: string }[];
}

export interface PolicyResult {
  answer: string;
  keyPoints: string[];
  sources: { title: string; url: string }[];
  outOfScope?: boolean;
}

export type { TriageResult };

export interface AiResponse<T> {
  data?: T;
  /** True when the response came from the offline fallback rather than Gemini. */
  demoMode: boolean;
  notice?: string;
  error?: string;
}
