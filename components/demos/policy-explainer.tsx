"use client";

import { ExternalLink, Scale } from "lucide-react";
import { ChatShell } from "@/components/chat-shell";
import { POLICY_STARTERS } from "@/data/policy";
import type { PolicyResult } from "@/lib/ai-types";

export function PolicyExplainer() {
  return (
    <div className="space-y-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <Scale className="mt-0.5 size-4 shrink-0" />
        <p>
          <strong>Not legal advice.</strong> This tool gives general, plain-language information about common BC business topics. Rules change, so
          always confirm with the official sources linked in each answer, and speak to a lawyer or accountant about your specific situation.
        </p>
      </div>
      <ChatShell<PolicyResult>
        mode="policy"
        starters={POLICY_STARTERS}
        placeholder="Ask about BC employment standards, licensing, GST/PST…"
        emptyTitle="BC business rules, in plain language"
        emptyBody="Ask about employment standards, business licences, registering a business, sales tax, hiring or privacy."
        toText={(d) => d.answer}
        renderAnswer={(d) => (
          <div>
            <p className="whitespace-pre-wrap">{d.answer}</p>
            {d.keyPoints.length > 0 && (
              <ul className="mt-3 space-y-1 rounded-lg bg-slate-50 p-3">
                {d.keyPoints.map((k) => (
                  <li key={k} className="flex gap-2 text-[13px]">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" /> {k}
                  </li>
                ))}
              </ul>
            )}
            {d.sources.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                {d.sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                    {s.title} <ExternalLink className="size-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
