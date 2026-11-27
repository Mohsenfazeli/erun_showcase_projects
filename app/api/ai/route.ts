import { NextResponse, type NextRequest } from "next/server";
import { answerQuestion } from "@/lib/ai-handlers";
import { hasGeminiKey } from "@/lib/gemini";
import { MAX_INPUT_CHARS, type AiResponse, type ChatTurn } from "@/lib/ai-types";

export const maxDuration = 30;

/* Simple in-memory per-IP rate limit. Per server instance; good enough for a demo. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

function sanitizeHistory(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t): t is ChatTurn => !!t && (t.role === "user" || t.role === "assistant") && typeof t.content === "string")
    .slice(-6)
    .map((t) => ({ role: t.role, content: t.content.slice(0, 800) }));
}

const fail = (error: string, status: number) => NextResponse.json<AiResponse<never>>({ demoMode: true, error }, { status });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
  if (rateLimited(ip)) return fail("You're sending messages quickly. Please wait a minute and try again.", 429);

  let body: { input?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  const input = typeof body.input === "string" ? body.input.trim() : "";
  if (!input) return fail("Please type a question.", 400);
  if (input.length > MAX_INPUT_CHARS) return fail(`Please keep questions under ${MAX_INPUT_CHARS.toLocaleString()} characters.`, 400);

  const result = await answerQuestion(input, sanitizeHistory(body.history));
  const notice = result.demoMode
    ? hasGeminiKey()
      ? "Offline mode: the AI service is busy, so this answer quotes the closest handbook section."
      : "Offline mode: no AI key is configured, so this answer quotes the closest handbook section."
    : undefined;

  return NextResponse.json({ data: result.data, demoMode: result.demoMode, notice });
}
