"use client";

import { useState } from "react";
import { AlertOctagon, Check, Copy, Gauge, Inbox, Loader2, Send, Smile, Tag, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form";
import { DemoModeNote } from "@/components/chat-shell";
import { SAMPLE_EMAILS, type TriageResult } from "@/data/support";
import { callAi } from "@/lib/ai-client";
import { MAX_INPUT_CHARS } from "@/lib/ai-types";
import { cn } from "@/lib/utils";

const URGENCY_STYLE: Record<TriageResult["urgency"], string> = {
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-brand-soft text-brand",
  High: "bg-amber-100 text-amber-800",
  Critical: "bg-rose-100 text-rose-700",
};
const SENTIMENT_STYLE: Record<TriageResult["sentiment"], string> = {
  Positive: "bg-emerald-50 text-emerald-700",
  Neutral: "bg-slate-100 text-slate-700",
  Frustrated: "bg-amber-50 text-amber-800",
  Angry: "bg-rose-50 text-rose-700",
};

function emailText(id: string) {
  const e = SAMPLE_EMAILS.find((s) => s.id === id)!;
  return e.body;
}

export function SupportTriage() {
  const [selected, setSelected] = useState<string | null>(SAMPLE_EMAILS[0].id);
  const [text, setText] = useState(emailText(SAMPLE_EMAILS[0].id));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [notice, setNotice] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const pick = (id: string) => {
    setSelected(id);
    setText(emailText(id));
    setResult(null);
    setError(null);
  };

  const analyze = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await callAi<TriageResult>("triage", text);
    setLoading(false);
    if (res.error || !res.data) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setResult(res.data);
    setNotice(res.notice);
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sample = SAMPLE_EMAILS.find((s) => s.id === selected);

  return (
    <div className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="size-4 text-brand" /> Sample inbox
            </CardTitle>
            <CardDescription>Pick an email, or paste your own.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-1">
            {SAMPLE_EMAILS.map((e) => (
              <button
                key={e.id}
                onClick={() => pick(e.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left transition cursor-pointer",
                  selected === e.id ? "border-brand bg-brand-soft/50" : "border-border hover:border-brand/40",
                )}
              >
                <span className="block truncate text-sm font-medium text-navy">{e.subject}</span>
                <span className="block truncate text-xs text-muted">{e.from} · {e.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>{sample ? sample.subject : "Your email"}</CardTitle>
            <CardDescription>{sample ? `From ${sample.from} (sample)` : "Pasted email"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={text}
              rows={8}
              onChange={(e) => {
                setText(e.target.value.slice(0, MAX_INPUT_CHARS));
                setSelected(null);
              }}
              placeholder="Paste a customer email here…"
              aria-label="Customer email"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-muted">
                {text.length}/{MAX_INPUT_CHARS} characters · Don&apos;t paste real personal information.
              </span>
              <Button onClick={analyze} disabled={!text.trim() || loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Send />} {loading ? "Triaging…" : "Triage email"}
              </Button>
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200/60" />
          ))}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Category", value: result.category, icon: Tag, style: "bg-slate-100 text-navy" },
              { label: "Urgency", value: result.urgency, icon: result.urgency === "Critical" ? AlertOctagon : Gauge, style: URGENCY_STYLE[result.urgency] },
              { label: "Sentiment", value: result.sentiment, icon: Smile, style: SENTIMENT_STYLE[result.sentiment] },
              { label: "Route to", value: result.team, icon: Users, style: "bg-navy text-white" },
            ].map((c, i) => (
              <div key={c.label} className="rounded-xl border border-border bg-white p-4 animate-fade-up" style={{ animationDelay: `${i * 90}ms` }}>
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
                  <c.icon className="size-3.5" /> {c.label}
                </p>
                <span className={cn("mt-2 inline-block rounded-lg px-2.5 py-1 text-sm font-semibold", c.style)}>{c.value}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <Card className="animate-fade-up" style={{ animationDelay: "360ms" }}>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>{result.summary}</p>
                <p className="text-xs text-muted">
                  <span className="font-medium text-slate-600">Why this urgency:</span> {result.reasoning}
                </p>
              </CardContent>
            </Card>
            <Card className="animate-fade-up" style={{ animationDelay: "450ms" }}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Drafted reply</CardTitle>
                <Button variant="outline" size="sm" onClick={copy}>
                  {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
                </Button>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{result.reply}</p>
                <p className="mt-2 text-[11px] text-muted">An agent reviews and edits before sending. AI drafts, people decide.</p>
              </CardContent>
            </Card>
          </div>
          {notice && <DemoModeNote text={notice} />}
        </div>
      )}
    </div>
  );
}
