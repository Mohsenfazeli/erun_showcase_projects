"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUp, Info, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { callAi } from "@/lib/ai-client";
import { MAX_INPUT_CHARS, type AiMode, type ChatTurn } from "@/lib/ai-types";
import { cn } from "@/lib/utils";

interface Message<T> {
  role: "user" | "assistant";
  text: string;
  data?: T;
  notice?: string;
  error?: boolean;
}

export function DemoModeNote({ text }: { text: string }) {
  return (
    <p className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-700">
      <Info className="mt-px size-3.5 shrink-0" /> {text}
    </p>
  );
}

export function ChatShell<T>({
  mode,
  starters,
  placeholder,
  emptyTitle,
  emptyBody,
  toText,
  renderAnswer,
}: {
  mode: AiMode;
  starters: string[];
  placeholder: string;
  emptyTitle: string;
  emptyBody: string;
  /** Converts an answer to plain text for conversation history. */
  toText: (data: T) => string;
  renderAnswer: (data: T) => ReactNode;
}) {
  const [messages, setMessages] = useState<Message<T>[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    const history: ChatTurn[] = messages.filter((m) => !m.error).map((m) => ({ role: m.role, content: m.data ? toText(m.data) : m.text }));
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    const res = await callAi<T>(mode, q, history);
    setLoading(false);
    if (res.error || !res.data) {
      setMessages((m) => [...m, { role: "assistant", text: res.error ?? "Something went wrong.", error: true }]);
      return;
    }
    setMessages((m) => [...m, { role: "assistant", text: "", data: res.data, notice: res.notice }]);
  };

  return (
    <Card className="flex h-[calc(100dvh-15rem)] min-h-[480px] flex-col overflow-hidden lg:h-[calc(100dvh-17rem)]">
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 && (
          <div className="mx-auto flex max-w-lg flex-col items-center pt-6 text-center animate-fade-in">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <Sparkles className="size-6" />
            </span>
            <h2 className="mt-4 font-semibold text-navy">{emptyTitle}</h2>
            <p className="mt-1 text-sm text-slate-600">{emptyBody}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {starters.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs text-slate-700 transition hover:border-brand/50 hover:text-brand cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end animate-fade-in">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-navy px-4 py-2.5 text-sm text-white">{m.text}</p>
            </div>
          ) : (
            <div key={i} className="flex gap-3 animate-fade-up">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                <Sparkles className="size-3.5" />
              </span>
              <div className={cn("min-w-0 max-w-[90%] text-sm leading-relaxed", m.error ? "text-rose-700" : "text-slate-700")}>
                {m.data ? renderAnswer(m.data) : m.text}
                {m.notice && <DemoModeNote text={m.notice} />}
              </div>
            </div>
          ),
        )}

        {loading && (
          <div className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
              <Sparkles className="size-3.5" />
            </span>
            <div className="flex items-center gap-1 rounded-2xl bg-slate-100 px-4 py-3" aria-label="Thinking">
              {[0, 1, 2].map((d) => (
                <span key={d} className="size-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${d * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-border bg-slate-50/60 p-3 sm:p-4"
      >
        <div className="flex items-end gap-2">
          {messages.length > 0 && (
            <Button type="button" variant="ghost" size="icon" onClick={() => setMessages([])} aria-label="New conversation" title="New conversation">
              <RotateCcw />
            </Button>
          )}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder={placeholder}
            className="max-h-32 min-h-10 flex-1 resize-none rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            aria-label="Your question"
          />
          <Button type="submit" size="icon" className="size-10 rounded-xl" disabled={!input.trim() || loading} aria-label="Send">
            <ArrowUp />
          </Button>
        </div>
      </form>
    </Card>
  );
}
