import type { AiMode, AiResponse, ChatTurn } from "@/lib/ai-types";

export async function callAi<T>(mode: AiMode, input: string, history: ChatTurn[] = []): Promise<AiResponse<T>> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, input, history }),
    });
    const json = (await res.json()) as AiResponse<T>;
    return json;
  } catch {
    return { demoMode: true, error: "Couldn't reach the server. Check your connection and try again." };
  }
}
