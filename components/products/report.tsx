"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarClock, Check, Database, FileText, Loader2, Printer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form";
import { ErunMark, Wordmark } from "@/components/brand";
import { C, axis, tooltip } from "@/components/chart-theme";
import { COMPANY, SALES } from "@/data/company";
import { buildReport, type MetricAnalysis, type Signal } from "@/lib/report";
import { N_MONTHS, fmtChange, fmtMetric, monthName } from "@/lib/metrics";
import { cn } from "@/lib/utils";

const LAST = N_MONTHS - 1;
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, k) => LAST - k);
const STEPS = [
  "Connecting to sales data",
  `Validating ${SALES.length.toLocaleString()} rows`,
  "Calculating 48 comparisons",
  "Writing commentary",
  "Formatting report",
];

const SIGNAL_STYLE: Record<Signal, string> = {
  Accelerating: "bg-emerald-50 text-emerald-700",
  Improving: "bg-emerald-50 text-emerald-700",
  Steady: "bg-brand-light text-brand",
  Stable: "bg-brand-light text-brand",
  Slowing: "bg-orange-50 text-orange-700",
  Weakening: "bg-orange-50 text-orange-700",
};

function SectionTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-b border-ink pb-2">
      <span className="text-[11px] font-bold tabular-nums text-brand">{n}</span>
      <h3 className="text-[15px] font-bold tracking-tight text-ink">{children}</h3>
    </div>
  );
}

function MetricBlock({ a }: { a: MetricAnalysis }) {
  const isPct = a.metric === "margin";
  return (
    <section className="avoid-break grid gap-6 border-b border-line py-6 last:border-b-0 md:grid-cols-[1fr_300px]">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-[14px] font-bold text-ink">{a.label}</h4>
          <span className={cn("rounded-[4px] px-1.5 py-0.5 text-[10.5px] font-bold", SIGNAL_STYLE[a.signal])}>{a.signal}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {[
            { k: "This month", v: fmtMetric(a.metric, a.current) },
            { k: "vs last year", v: fmtChange(a.metric, a.yoy) },
            { k: "3-yr trend", v: isPct ? fmtChange(a.metric, a.longTerm) : `${fmtChange(a.metric, a.longTerm)} / yr` },
            { k: "Last 3 months", v: isPct ? fmtMetric(a.metric, a.shortTerm) : fmtChange(a.metric, a.shortTerm) },
          ].map((x) => (
            <div key={x.k}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-3">{x.k}</p>
              <p className="text-[14px] font-bold tabular-nums text-ink">{x.v}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2.5 text-[13px] leading-[1.7] text-ink-2">
          {a.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <div>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={a.chart} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis dataKey="label" {...axis} tick={{ ...axis.tick, fontSize: 9.5 }} interval={7} />
              <YAxis
                {...axis}
                tick={{ ...axis.tick, fontSize: 9.5 }}
                domain={["auto", "auto"]}
                tickFormatter={(v) => (isPct ? `${Number(v).toFixed(1)}%` : a.metric === "revenue" ? `${Math.round(v / 1000)}k` : a.metric === "aov" ? `$${Math.round(v)}` : `${(v / 1000).toFixed(1)}k`)}
              />
              <Tooltip {...tooltip} formatter={(v, n) => [fmtMetric(a.metric, Number(v)), n === "value" ? "Monthly" : "12-month average"]} />
              <Line dataKey="trend" stroke={C.ink3} strokeWidth={1.5} strokeDasharray="4 3" dot={false} isAnimationActive={false} />
              <Line dataKey="value" stroke={C.brand} strokeWidth={1.75} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-1.5 flex gap-4 text-[10px] text-ink-3">
          <span className="flex items-center gap-1"><span className="h-0.5 w-3 bg-brand" /> Monthly</span>
          <span className="flex items-center gap-1"><span className="w-3 border-t border-dashed border-ink-3" /> 12-month average (trend)</span>
        </div>
      </div>
    </section>
  );
}

export function AutomatedReport() {
  const [month, setMonth] = useState(LAST);
  const [stage, setStage] = useState<"idle" | "running" | "done">("idle");
  const [step, setStep] = useState(0);
  const [generatedFor, setGeneratedFor] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  const report = useMemo(() => (generatedFor === null ? null : buildReport(generatedFor)), [generatedFor]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const generate = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage("running");
    setStep(0);
    STEPS.forEach((_, k) => timers.current.push(setTimeout(() => setStep(k + 1), 320 * (k + 1))));
    timers.current.push(
      setTimeout(() => {
        setGeneratedFor(month);
        setStage("done");
        setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }, 320 * STEPS.length + 200),
    );
  };

  const issued = report ? monthName(report.index + 1) : "";

  return (
    <div className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
      {/* Control panel */}
      <div className="no-print grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-full sm:w-56">
              <label htmlFor="month" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                Reporting month
              </label>
              <Select id="month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTH_OPTIONS.map((i) => (
                  <option key={i} value={i}>
                    {monthName(i)}
                  </option>
                ))}
              </Select>
            </div>
            <Button size="lg" onClick={generate} disabled={stage === "running"} className="h-9">
              {stage === "running" ? <Loader2 className="animate-spin" /> : stage === "done" ? <RefreshCw /> : <FileText />}
              {stage === "running" ? "Generating…" : stage === "done" ? "Regenerate" : "Generate report"}
            </Button>
            {stage === "done" && (
              <Button variant="outline" onClick={() => window.print()} className="h-9">
                <Printer /> Download PDF
              </Button>
            )}
          </div>

          <ol className="mt-5 grid gap-2 sm:grid-cols-5">
            {STEPS.map((s, k) => {
              const done = stage === "done" || step > k;
              const active = stage === "running" && step === k;
              return (
                <li
                  key={s}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-2.5 py-2 text-[11.5px] font-medium transition-colors",
                    done ? "border-brand/20 bg-brand-light text-ink" : active ? "border-brand/40 text-ink" : "border-line text-ink-3",
                  )}
                >
                  <span className={cn("flex size-4 shrink-0 items-center justify-center rounded-full", done ? "bg-brand text-white" : "border border-current")}>
                    {done ? <Check className="size-2.5" strokeWidth={3} /> : active ? <Loader2 className="size-2.5 animate-spin" /> : null}
                  </span>
                  <span className="leading-tight">{s}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5 text-[12.5px]">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Database className="size-4 text-brand" /> Data source
          </p>
          <p className="mt-1 text-ink-2">
            northwind_sales.xlsx · {SALES.length} rows · 60 months by region and channel <span className="text-ink-3">(sample)</span>
          </p>
          <p className="mt-4 flex items-center gap-2 font-semibold text-ink">
            <CalendarClock className="size-4 text-brand" /> In production
          </p>
          <p className="mt-1 text-ink-2">Runs automatically on the 2nd business day of each month and emails the PDF to the leadership team.</p>
        </div>
      </div>

      {stage === "idle" && (
        <div className="no-print flex flex-col items-center rounded-lg border border-dashed border-line bg-surface px-6 py-16 text-center">
          <FileText className="size-8 text-ink-3" />
          <p className="mt-3 text-[15px] font-bold text-ink">No report generated yet</p>
          <p className="mt-1 max-w-sm text-[13px] text-ink-2">
            Pick a month and click <strong className="text-ink">Generate report</strong>. The figures, charts and written commentary are all produced automatically.
          </p>
        </div>
      )}

      {/* The report document */}
      {report && (
        <div ref={reportRef} className={cn("scroll-mt-6 transition-opacity", stage === "running" && "opacity-40")}>
          <article className="print-area mx-auto max-w-[880px] rounded-lg border border-line bg-surface shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)] animate-fade-up">
            <div className="h-1 rounded-t-lg bg-brand" />
            <div className="px-6 py-8 sm:px-12 sm:py-11">
              {/* Letterhead */}
              <header className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-md bg-ink text-[14px] font-extrabold text-white">NC</span>
                  <div>
                    <p className="text-[14px] font-bold text-ink">{COMPANY.name}</p>
                    <p className="text-[11.5px] text-ink-2">{COMPANY.description}</p>
                  </div>
                </div>
                <div className="text-right text-[11px] leading-relaxed text-ink-3">
                  <p>
                    Report ref. NW-{report.month.split(" ")[1]}-{String(((10 + report.index) % 12) + 1).padStart(2, "0")}
                  </p>
                  <p>Issued {issued.replace(/^\w+/, (m) => `early ${m}`)}</p>
                  <p>Confidential · Sample data</p>
                </div>
              </header>

              <div className="mt-10">
                <p className="eyebrow">Monthly performance report</p>
                <h2 className="mt-2 text-[34px] font-bold leading-tight tracking-[-0.025em] text-ink">{report.month}</h2>
              </div>

              {/* 01 Executive summary */}
              <section className="mt-9">
                <SectionTitle n="01">Executive summary</SectionTitle>
                <p className="text-[14px] leading-[1.75] text-ink">{report.summary}</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                  {report.takeaways.map((t) => (
                    <li
                      key={t.text}
                      className={cn(
                        "rounded-md border-l-[3px] bg-canvas px-3.5 py-3 text-[12.5px] leading-relaxed text-ink",
                        t.tone === "positive" ? "border-emerald-600" : t.tone === "watch" ? "border-orange-600" : "border-brand",
                      )}
                    >
                      {t.text}
                    </li>
                  ))}
                </ul>
              </section>

              {/* 02 Key metrics */}
              <section className="avoid-break mt-10">
                <SectionTitle n="02">Key metrics</SectionTitle>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-[12.5px]">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-[0.1em] text-ink-3">
                        <th className="pb-2 font-semibold">Metric</th>
                        <th className="pb-2 text-right font-semibold">{report.month.split(" ")[0]}</th>
                        <th className="pb-2 text-right font-semibold">vs prior month</th>
                        <th className="pb-2 text-right font-semibold">vs last year</th>
                        <th className="pb-2 text-right font-semibold">3-yr trend</th>
                        <th className="pb-2 text-right font-semibold">Short-term signal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.metrics.map((a) => (
                        <tr key={a.metric} className="border-t border-line">
                          <td className="py-2.5 font-semibold text-ink">{a.label}</td>
                          <td className="py-2.5 text-right font-bold tabular-nums text-ink">{fmtMetric(a.metric, a.current)}</td>
                          <td className="py-2.5 text-right tabular-nums text-ink-2">{fmtChange(a.metric, a.mom)}</td>
                          <td className={cn("py-2.5 text-right font-semibold tabular-nums", a.yoy >= 0 ? "text-emerald-700" : "text-orange-700")}>{fmtChange(a.metric, a.yoy)}</td>
                          <td className="py-2.5 text-right tabular-nums text-ink-2">
                            {a.metric === "margin" ? fmtChange(a.metric, a.longTerm) : `${fmtChange(a.metric, a.longTerm)} / yr`}
                          </td>
                          <td className="py-2.5 text-right">
                            <span className={cn("rounded-[4px] px-1.5 py-0.5 text-[10.5px] font-bold", SIGNAL_STYLE[a.signal])}>{a.signal}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 03 Commentary */}
              <section className="print-break mt-10">
                <SectionTitle n="03">Performance commentary</SectionTitle>
                {report.metrics.map((a) => (
                  <MetricBlock key={a.metric} a={a} />
                ))}
              </section>

              {/* 04 Breakdown */}
              <section className="avoid-break mt-8">
                <SectionTitle n="04">Revenue breakdown</SectionTitle>
                <div className="grid gap-8 sm:grid-cols-2">
                  {[
                    { title: "By channel", rows: report.channels },
                    { title: "By region", rows: report.regions },
                  ].map((g) => (
                    <div key={g.title}>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3">{g.title}</p>
                      <table className="w-full text-[12.5px]">
                        <tbody>
                          {g.rows.map((r) => (
                            <tr key={r.name} className="border-t border-line">
                              <td className="py-2 text-ink">{r.name}</td>
                              <td className="w-24 py-2">
                                <div className="h-1.5 rounded-full bg-canvas">
                                  <div className="h-1.5 rounded-full bg-brand" style={{ width: `${r.share}%` }} />
                                </div>
                              </td>
                              <td className="py-2 pl-3 text-right tabular-nums text-ink-2">{fmtMetric("revenue", r.value, true)}</td>
                              <td className={cn("py-2 pl-3 text-right font-semibold tabular-nums", r.yoy >= 0 ? "text-emerald-700" : "text-orange-700")}>
                                {fmtChange("revenue", r.yoy)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </section>

              {/* 05 Outlook */}
              <section className="avoid-break mt-10">
                <SectionTitle n="05">Outlook</SectionTitle>
                <p className="text-[13px] leading-[1.75] text-ink-2">
                  Based on the trend and seasonal pattern of the last five years, revenue for <strong className="text-ink">{report.outlook.months}</strong> is forecast at{" "}
                  <strong className="text-ink">{fmtMetric("revenue", report.outlook.total, true)}</strong>, {fmtChange("revenue", report.outlook.vsLastYear)} on the same period last
                  year, with an 80% range of {fmtMetric("revenue", report.outlook.low, true)} to {fmtMetric("revenue", report.outlook.high, true)}.
                </p>
              </section>

              {/* Footer */}
              <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 text-[10.5px] text-ink-3">
                <span className="flex items-center gap-2">
                  <ErunMark size={16} /> Prepared automatically by <Wordmark className="text-[12px]" /> Lab
                </span>
                <span>
                  Method: year-over-year compares the same month; 3-year trend is the annualised change in twelve-month totals; short-term compares the last three months with the same
                  period a year earlier. {COMPANY.note}
                </span>
              </footer>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
