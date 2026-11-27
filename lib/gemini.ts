/**
 * Server-only Gemini helper. Never import this from a client component:
 * it reads GEMINI_API_KEY from the server environment.
 */
import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const TIMEOUT_MS = 20_000;

let client: GoogleGenAI | null = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

export function hasGeminiKey() {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Ask Gemini for a JSON object matching `schema`.
 * Returns null on any failure (no key, quota hit, timeout, bad JSON) so callers can fall back.
 */
export async function generateJson<T>({
  system,
  prompt,
  schema,
  temperature = 0.3,
}: {
  system: string;
  prompt: string;
  schema: Record<string, unknown>;
  temperature?: number;
}): Promise<T | null> {
  const ai = getClient();
  if (!ai) return null;
  try {
    const res = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: system,
        temperature,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseJsonSchema: schema,
        abortSignal: AbortSignal.timeout(TIMEOUT_MS),
      },
    });
    const text = res.text;
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch (err) {
    console.warn("[gemini] falling back:", err instanceof Error ? err.message.slice(0, 200) : err);
    return null;
  }
}
