export const MAX_INPUT_CHARS = 1500;

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface Citation {
  id: string;
  docTitle: string;
  heading: string;
}

export interface AssistantAnswer {
  answer: string;
  /** False when the handbook doesn't cover the question. */
  found: boolean;
  citations: Citation[];
}

export interface AiResponse<T> {
  data?: T;
  /** True when the answer came from the offline fallback rather than Gemini. */
  demoMode: boolean;
  notice?: string;
  error?: string;
}
