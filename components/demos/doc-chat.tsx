"use client";

import { useState } from "react";
import { BookOpen, FileText, X } from "lucide-react";
import { ChatShell } from "@/components/chat-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DOCUMENTS, DOC_COMPANY, STARTER_QUESTIONS } from "@/data/documents";
import type { DocChatResult } from "@/lib/ai-types";
import { cn } from "@/lib/utils";

export function DocChat() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openDoc, setOpenDoc] = useState<string | null>(null);

  const showSection = (id: string) => {
    const doc = DOCUMENTS.find((d) => d.sections.some((s) => s.id === id));
    if (!doc) return;
    setOpenDoc(doc.id);
    setOpenSection(id);
    setTimeout(() => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };

  const viewing = DOCUMENTS.find((d) => d.id === openDoc);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px] animate-fade-up" style={{ animationDelay: "80ms" }}>
      <ChatShell<DocChatResult>
        mode="doc-chat"
        starters={STARTER_QUESTIONS}
        placeholder="Ask about vacation, expenses, IT security…"
        emptyTitle="Ask the company handbook"
        emptyBody={`Answers come only from the ${DOCUMENTS.length} sample documents for ${DOC_COMPANY}, with the section cited.`}
        toText={(d) => d.answer}
        renderAnswer={(d) => (
          <div>
            <p className="whitespace-pre-wrap">{d.answer}</p>
            {d.citations.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {d.citations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => showSection(c.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-brand/25 bg-brand-soft/60 px-2 py-0.5 text-[11px] font-medium text-brand transition hover:bg-brand-soft cursor-pointer"
                    title="Show this section"
                  >
                    <FileText className="size-3" /> {c.docTitle} · {c.id} {c.heading}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      />

      <Card className="h-fit xl:sticky xl:top-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-4 text-brand" /> {viewing ? viewing.title : "Source documents"}
          </CardTitle>
          {viewing && (
            <button onClick={() => { setOpenDoc(null); setOpenSection(null); }} className="rounded-md p-1 text-muted hover:bg-slate-100 cursor-pointer" aria-label="Back to document list">
              <X className="size-4" />
            </button>
          )}
        </CardHeader>
        <CardContent>
          {!viewing ? (
            <ul className="space-y-2">
              {DOCUMENTS.map((d) => (
                <li key={d.id}>
                  <button onClick={() => setOpenDoc(d.id)} className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition hover:border-brand/40 cursor-pointer">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <FileText className="size-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-navy">{d.title}</span>
                      <span className="block text-xs text-muted">{d.sections.length} sections · sample</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
              {viewing.sections.map((s) => (
                <div
                  id={`sec-${s.id}`}
                  key={s.id}
                  className={cn("rounded-lg p-2.5 transition", openSection === s.id ? "bg-brand-soft ring-1 ring-brand/30" : "")}
                >
                  <p className="text-xs font-semibold text-navy">
                    <span className="text-brand">{s.id}</span> {s.heading}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{s.text}</p>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-[11px] text-muted">Sample documents for a fictional company.</p>
        </CardContent>
      </Card>
    </div>
  );
}
