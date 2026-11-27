"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, BookOpen, ChevronLeft, FileText, Info, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOCUMENTS, KB_COMPANY, STARTER_QUESTIONS } from "@/data/documents";
import { askAssistant } from "@/lib/ai-client";
import { MAX_INPUT_CHARS, type AssistantAnswer, type ChatTurn } from "@/lib/ai-types";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  text: string;
  answer?: AssistantAnswer;
  notice?: string;
  error?: boolean;
}

const GUARDRAILS = [
  "Answers only from the documents listed here",
  "Cites the exact section for every answer",
  "Says so when the handbook doesn't cover a question",
  "Declines off-topic, legal or medical questions",
];

const SECTION_COUNT = DOCUMENTS.reduce((s, d) => s + d.sections.length, 0);

function AssistantAvatar({ className }: { className?: string }) {
  return (
    <span className={cn("flex size-8 shrink-0 items-center justify-center bg-brand text-[11px] font-extrabold text-white", className)}>
      HR
    </span>
  );
}

export function PolicyAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDoc, setOpenDoc] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    const history: ChatTurn[] = messages.filter((m) => !m.error).map((m) => ({ role: m.role, content: m.answer ? m.answer.answer : m.text }));
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    const res = await askAssistant(q, history);
    setLoading(false);
    if (res.error || !res.data) {
      setMessages((m) => [...m, { role: "assistant", text: res.error ?? "Something went wrong. Please try again.", error: true }]);
      return;
    }
    setMessages((m) => [...m, { role: "assistant", text: res.data!.answer, answer: res.data, notice: res.notice }]);
    inputRef.current?.focus();
  };

  const showSection = (id: string) => {
    const doc = DOCUMENTS.find((d) => d.sections.some((s) => s.id === id));
    if (!doc) return;
    setOpenDoc(doc.id);
    setHighlight(id);
    setTimeout(() => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
  };

  const viewing = DOCUMENTS.find((d) => d.id === openDoc);

  return (
    <div className="grid gap-5 animate-fade-up xl:grid-cols-[1fr_320px]" style={{ animationDelay: "80ms" }}>
      {/* Chat */}
      <section className="flex h-[calc(100dvh-8rem)] min-h-[560px] flex-col overflow-hidden border border-line bg-surface lg:h-[calc(100dvh-6rem)] xl:max-h-[760px]">
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <AssistantAvatar />
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-bold text-ink">Northwind HR Assistant</p>
              <p className="flex items-center gap-1.5 truncate text-[11.5px] text-ink-2">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Trained on {DOCUMENTS.length} policy documents · {SECTION_COUNT} sections
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
              <RotateCcw /> New chat
            </Button>
          )}
        </header>

        <div ref={scrollRef} className="thin-scroll flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-xl animate-fade-in">
              <AssistantAvatar className="size-10 text-[13px]" />
              <h2 className="mt-5 text-[22px] font-[550] text-ink">Hi, I&apos;m Northwind&apos;s HR assistant.</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                Ask me anything about vacation, sick days, travel and expenses, or IT and security. I answer only from {KB_COMPANY}&apos;s
                policies and show you exactly where each answer comes from.
              </p>
              <p className="mt-7 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">Try asking</p>
              <ul className="mt-2 divide-y divide-line border border-line">
                {STARTER_QUESTIONS.map((q) => (
                  <li key={q}>
                    <button
                      onClick={() => send(q)}
                      className="group flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[13.5px] text-ink transition-colors hover:bg-canvas cursor-pointer"
                    >
                      {q}
                      <ArrowUp className="size-4 shrink-0 rotate-45 text-ink-3 transition-colors group-hover:text-brand" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-6">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end animate-fade-in">
                    <p className="max-w-[85%] whitespace-pre-wrap rounded-none bg-ink px-4 py-2.5 text-[14px] text-white">{m.text}</p>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3 animate-fade-up">
                    <AssistantAvatar className="mt-0.5 size-7 text-[10px]" />
                    <div className="min-w-0 flex-1">
                      <p className={cn("whitespace-pre-wrap text-[14px] leading-[1.7]", m.error ? "text-orange-700" : "text-ink")}>{m.text}</p>
                      {m.answer && m.answer.citations.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-ink-3">Sources</span>
                          {m.answer.citations.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => showSection(c.id)}
                              className="inline-flex items-center gap-1 border border-line bg-surface px-2 py-1 text-[11.5px] font-medium text-ink-2 transition-colors hover:border-brand/40 hover:text-brand cursor-pointer"
                              title="Show this section"
                            >
                              <FileText className="size-3" />
                              <span className="font-bold text-brand">{c.id}</span> {c.docTitle} · {c.heading}
                            </button>
                          ))}
                        </div>
                      )}
                      {m.notice && (
                        <p className="mt-2 flex items-start gap-1.5 text-[11.5px] text-ink-3">
                          <Info className="mt-px size-3.5 shrink-0" /> {m.notice}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              )}
              {loading && (
                <div className="flex gap-3">
                  <AssistantAvatar className="size-7 text-[10px]" />
                  <div className="flex items-center gap-1 py-3" aria-label="Thinking">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="size-1.5 animate-bounce rounded-full bg-ink-3" style={{ animationDelay: `${d * 140}ms` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-line p-3 sm:p-4"
        >
          <div className="mx-auto flex max-w-2xl items-end gap-2 border border-line bg-surface p-1.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask about a Northwind policy…"
              className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2.5 py-2 text-[14px] text-ink outline-none placeholder:text-ink-3"
              aria-label="Your question"
            />
            <Button type="submit" size="icon" className="size-9" disabled={!input.trim() || loading} aria-label="Send">
              <ArrowUp />
            </Button>
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-ink-3">
            Answers come from sample policies for a fictional company. Always confirm important decisions with HR.
          </p>
        </form>
      </section>

      {/* Knowledge base */}
      <aside className="space-y-5">
        <div className="border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
              {viewing ? (
                <button onClick={() => { setOpenDoc(null); setHighlight(null); }} className="flex items-center gap-1 text-ink-2 hover:text-ink cursor-pointer" aria-label="Back to documents">
                  <ChevronLeft className="size-4" />
                </button>
              ) : (
                <BookOpen className="size-4 text-brand" />
              )}
              {viewing ? viewing.title : "Trained on"}
            </p>
            <span className="text-[11px] text-ink-3">{viewing ? `${viewing.sections.length} sections` : "Knowledge base"}</span>
          </div>
          {!viewing ? (
            <ul className="divide-y divide-line">
              {DOCUMENTS.map((d) => (
                <li key={d.id}>
                  <button onClick={() => setOpenDoc(d.id)} className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-canvas cursor-pointer">
                    <span className="flex size-8 items-center justify-center bg-brand-light text-brand">
                      <FileText className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-ink">{d.title}</span>
                      <span className="block text-[11.5px] text-ink-3">{d.sections.length} sections · PDF</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="thin-scroll max-h-[420px] space-y-1 overflow-y-auto p-3">
              {viewing.sections.map((s) => (
                <div
                  id={`sec-${s.id}`}
                  key={s.id}
                  className={cn("px-3 py-2.5 transition-colors", highlight === s.id ? "bg-brand-light ring-1 ring-brand/25" : "")}
                >
                  <p className="text-[12px] font-bold text-ink">
                    <span className="text-brand">{s.id}</span> · {s.heading}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-2">{s.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-line bg-surface px-5 py-4">
          <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
            <ShieldCheck className="size-4 text-brand" /> Guardrails
          </p>
          <ul className="mt-3 space-y-2">
            {GUARDRAILS.map((g) => (
              <li key={g} className="flex gap-2.5 text-[12.5px] leading-relaxed text-ink-2">
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-brand" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
