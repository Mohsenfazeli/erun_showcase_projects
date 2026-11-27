import type { AiResponse, AssistantAnswer, ChatTurn } from "@/lib/ai-types";

export async function askAssistant(input: string, history: ChatTurn[] = []): Promise<AiResponse<AssistantAnswer>> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, history }),
    });
    return (await res.json()) as AiResponse<AssistantAnswer>;
  } catch {
    return { demoMode: true, error: "Couldn't reach the server. Check your connection and try again." };
  }
}
