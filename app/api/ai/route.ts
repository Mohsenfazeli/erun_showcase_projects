import { NextResponse, type NextRequest } from "next/server";
import { handleDocChat, handlePolicy, handleTriage } from "@/lib/ai-handlers";
import { hasGeminiKey } from "@/lib/gemini";
import { MAX_INPUT_CHARS, type AiMode, type AiResponse, type ChatTurn } from "@/lib/ai-types";

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

const MODES: AiMode[] = ["doc-chat", "triage", "policy"];

function sanitizeHistory(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t): t is ChatTurn => !!t && (t.role === "user" || t.role === "assistant") && typeof t.content === "string")
    .slice(-6)
    .map((t) => ({ role: t.role, content: t.content.slice(0, 800) }));
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
  if (rateLimited(ip)) {
    return NextResponse.json<AiResponse<never>>(
      { demoMode: true, error: "You're sending requests quickly. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: { mode?: string; input?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<AiResponse<never>>({ demoMode: true, error: "Invalid request." }, { status: 400 });
  }

  const mode = body.mode as AiMode;
  const input = typeof body.input === "string" ? body.input.trim() : "";
  if (!MODES.includes(mode)) return NextResponse.json<AiResponse<never>>({ demoMode: true, error: "Unknown mode." }, { status: 400 });
  if (!input) return NextResponse.json<AiResponse<never>>({ demoMode: true, error: "Please enter some text." }, { status: 400 });
  if (input.length > MAX_INPUT_CHARS) {
    return NextResponse.json<AiResponse<never>>(
      { demoMode: true, error: `Please keep it under ${MAX_INPUT_CHARS.toLocaleString()} characters.` },
      { status: 400 },
    );
  }

  const history = sanitizeHistory(body.history);
  const result =
    mode === "doc-chat" ? await handleDocChat(input, history) : mode === "triage" ? await handleTriage(input) : await handlePolicy(input, history);

  const notice = result.demoMode
    ? hasGeminiKey()
      ? "Demo mode: the AI service is busy or unavailable, so this is an offline response."
      : "Demo mode: no AI key is configured, so this is an offline response."
    : undefined;

  return NextResponse.json({ data: result.data, demoMode: result.demoMode, notice });
}
