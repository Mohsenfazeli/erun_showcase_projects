"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Check, FileSpreadsheet, Loader2, Printer, RotateCcw, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi-card";
import { COLORS, axisProps, tooltipStyle } from "@/components/chart-theme";
import { COMPANY, CURRENT_MONTH, PREVIOUS_MONTH, REGIONS, type Txn } from "@/data/transactions";
import { cn, fmtCurrency, fmtNumber } from "@/lib/utils";

const STEPS = [`Cleaning and validating ${CURRENT_MONTH.data.length} rows`, "Calculating KPIs vs last month", "Building charts", "Writing commentary"];

function summarise(data: Txn[]) {
  const revenue = data.reduce((s, t) => s + t.revenue, 0);
  const cost = data.reduce((s, t) => s + t.cost, 0);
  const units = data.reduce((s, t) => s + t.units, 0);
  return { revenue, cost, units, orders: data.length, margin: ((revenue - cost) / revenue) * 100, aov: revenue / data.length };
}

function groupSum(data: Txn[], key: (t: Txn) => string) {
  const m = new Map<string, number>();
  data.forEach((t) => m.set(key(t), (m.get(key(t)) ?? 0) + t.revenue));
  return m;
}

export function ReportAutomation() {
  const [stage, setStage] = useState<"idle" | "running" | "done">("idle");
  const [step, setStep] = useState(0);

  const report = useMemo(() => {
    const cur = summarise(CURRENT_MONTH.data);
    const prev = summarise(PREVIOUS_MONTH.data);
    const pct = (a: number, b: number) => ((a - b) / b) * 100;

    const weekly = [1, 2, 3, 4, 5].map((w) => ({
      week: `Wk ${w}`,
      revenue: Math.round(
        CURRENT_MONTH.data.filter((t) => Math.min(5, Math.ceil(Number(t.date.slice(8)) / 7)) === w).reduce((s, t) => s + t.revenue, 0),
      ),
    }));

    const regCur = groupSum(CURRENT_MONTH.data, (t) => t.region);
    const regPrev = groupSum(PREVIOUS_MONTH.data, (t) => t.region);
    const regions = REGIONS.map((r) => ({
      region: r,
      revenue: Math.round(regCur.get(r) ?? 0),
      change: pct(regCur.get(r) ?? 0, regPrev.get(r) ?? 1),
    })).sort((a, b) => b.revenue - a.revenue);

    const prodCur = groupSum(CURRENT_MONTH.data, (t) => t.product);
    const products = [...prodCur.entries()]
      .map(([name, revenue]) => ({
        name,
        revenue,
        units: CURRENT_MONTH.data.filter((t) => t.product === name).reduce((s, t) => s + t.units, 0),
        share: (revenue / cur.revenue) * 100,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const chCur = groupSum(CURRENT_MONTH.data, (t) => t.channel);
    const topChannel = [...chCur.entries()].sort((a, b) => b[1] - a[1])[0];
    const bestRegion = [...regions].sort((a, b) => b.change - a.change)[0];
    const worstRegion = [...regions].sort((a, b) => a.change - b.change)[0];

    const revChange = pct(cur.revenue, prev.revenue);
    const commentary = [
      `Revenue ${revChange >= 0 ? "grew" : "fell"} ${Math.abs(revChange).toFixed(1)}% to ${fmtCurrency(cur.revenue)} on ${cur.orders} orders (${cur.orders - prev.orders >= 0 ? "+" : ""}${cur.orders - prev.orders} vs ${PREVIOUS_MONTH.label}).`,
      `Gross margin was ${cur.margin.toFixed(1)}%, ${cur.margin >= prev.margin ? "up" : "down"} ${Math.abs(cur.margin - prev.margin).toFixed(1)} pts. ${topChannel[0]} was the largest channel at ${((topChannel[1] / cur.revenue) * 100).toFixed(0)}% of revenue.`,
      `${bestRegion.region} led growth (${bestRegion.change >= 0 ? "+" : ""}${bestRegion.change.toFixed(1)}%), while ${worstRegion.region} ${worstRegion.change < 0 ? `declined ${Math.abs(worstRegion.change).toFixed(1)}%` : `grew more slowly (+${worstRegion.change.toFixed(1)}%)`} and is worth a closer look.`,
      `${products[0].name} remained the top product with ${products[0].share.toFixed(0)}% of revenue.`,
    ];

    return {
      cur,
      prev,
      revChange,
      marginChange: cur.margin - prev.margin,
      ordersChange: pct(cur.orders, prev.orders),
      aovChange: pct(cur.aov, prev.aov),
      weekly,
      regions,
      products,
      commentary,
    };
  }, []);

  const generate = () => {
    setStage("running");
    setStep(0);
    STEPS.forEach((_, i) => setTimeout(() => setStep(i + 1), 450 * (i + 1)));
    setTimeout(() => setStage("done"), 450 * STEPS.length + 250);
  };

  return (
    <div className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
      <div className="no-print grid gap-6 xl:grid-cols-[1fr_300px]">
        <Card className="min-w-0">
          <CardHeader className="flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="size-4 text-emerald-600" /> sales_export_oct2026.csv
              </CardTitle>
              <CardDescription>
                Raw export: {CURRENT_MONTH.data.length} rows for {CURRENT_MONTH.label}, plus {PREVIOUS_MONTH.data.length} rows from last month for comparison.
              </CardDescription>
            </div>
            <Badge variant="neutral">Sample data</Badge>
          </CardHeader>
          <CardContent>
            <div className="max-h-72 overflow-auto rounded-lg border border-border">
              <table className="w-full min-w-[640px] font-mono text-[11px]">
                <thead className="sticky top-0 bg-slate-100 text-left text-slate-500">
                  <tr>
                    {["date", "order_id", "region", "product", "channel", "units", "revenue", "cost"].map((h) => (
                      <th key={h} className="px-2.5 py-1.5 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CURRENT_MONTH.data.map((t) => (
                    <tr key={t.orderId} className="border-t border-border text-slate-700 odd:bg-white even:bg-slate-50/60">
                      <td className="px-2.5 py-1">{t.date}</td>
                      <td className="px-2.5 py-1">{t.orderId}</td>
                      <td className="px-2.5 py-1">{t.region}</td>
                      <td className="px-2.5 py-1 whitespace-nowrap">{t.product}</td>
                      <td className="px-2.5 py-1">{t.channel}</td>
                      <td className="px-2.5 py-1 text-right">{t.units}</td>
                      <td className="px-2.5 py-1 text-right">{t.revenue.toFixed(2)}</td>
                      <td className="px-2.5 py-1 text-right">{t.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Automate the monthly report</CardTitle>
            <CardDescription>What used to be a day of copy-paste becomes one click.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stage === "idle" && (
              <Button className="w-full" size="lg" onClick={generate}>
                <Wand2 /> Generate report
              </Button>
            )}
            {stage !== "idle" && (
              <ul className="space-y-2.5">
                {STEPS.map((s, i) => {
                  const done = step > i;
                  const running = stage === "running" && step === i;
                  return (
                    <li key={s} className={cn("flex items-center gap-2.5 text-sm transition", done || running ? "text-navy" : "text-slate-400")}>
                      <span className={cn("flex size-5 items-center justify-center rounded-full", done ? "bg-emerald-500 text-white" : "bg-slate-100")}>
                        {done ? <Check className="size-3" /> : running ? <Loader2 className="size-3 animate-spin text-brand" /> : null}
                      </span>
                      {s}
                    </li>
                  );
                })}
              </ul>
            )}
            {stage === "done" && (
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => window.print()}>
                  <Printer /> Download PDF
                </Button>
                <Button variant="outline" size="icon" onClick={() => setStage("idle")} aria-label="Reset" title="Reset">
                  <RotateCcw />
                </Button>
              </div>
            )}
            <p className="text-[11px] text-muted">In production this runs on a schedule and emails the PDF to your team automatically.</p>
          </CardContent>
        </Card>
      </div>

      {stage === "done" && (
        <article className="print-area mx-auto max-w-4xl rounded-xl border border-border bg-white p-6 shadow-xl shadow-navy/5 sm:p-10 animate-fade-up">
          <header className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-navy pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Monthly performance report</p>
              <h2 className="mt-1 text-2xl font-semibold text-navy">{CURRENT_MONTH.label}</h2>
              <p className="text-sm text-muted">{COMPANY}</p>
            </div>
            <p className="text-xs text-muted">Generated automatically · Sample data</p>
          </header>

          <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <KpiCard label="Revenue" value={fmtCurrency(report.cur.revenue)} delta={report.revChange} deltaLabel="MoM" />
            <KpiCard label="Gross margin" value={`${report.cur.margin.toFixed(1)}%`} delta={report.marginChange} deltaLabel="pts" />
            <KpiCard label="Orders" value={fmtNumber(report.cur.orders)} delta={report.ordersChange} deltaLabel="MoM" />
            <KpiCard label="Avg. order value" value={fmtCurrency(report.cur.aov)} delta={report.aovChange} deltaLabel="MoM" />
          </section>

          <section className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-navy">Revenue by week</h3>
              <div className="mt-2 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.weekly} margin={{ top: 8, right: 0, left: -8, bottom: 0 }}>
                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="week" {...axisProps} />
                    <YAxis {...axisProps} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                    <Tooltip {...tooltipStyle} formatter={(v) => [fmtCurrency(Number(v)), "Revenue"]} cursor={{ fill: "#F1F5F9" }} />
                    <Bar dataKey="revenue" fill={COLORS.brand} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy">Revenue by region</h3>
              <div className="mt-2 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.regions} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                    <XAxis type="number" {...axisProps} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                    <YAxis type="category" dataKey="region" {...axisProps} width={70} />
                    <Tooltip {...tooltipStyle} formatter={(v) => [fmtCurrency(Number(v)), "Revenue"]} cursor={{ fill: "#F1F5F9" }} />
                    <Bar dataKey="revenue" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                      {report.regions.map((r, i) => (
                        <Cell key={r.region} fill={i === 0 ? COLORS.navy : "#94A3B8"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 md:grid-cols-[1.1fr_1fr]">
            <div>
              <h3 className="text-sm font-semibold text-navy">Top products</h3>
              <table className="mt-2 w-full text-sm">
                <thead className="text-left text-[11px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="py-1.5 font-medium">Product</th>
                    <th className="py-1.5 text-right font-medium">Units</th>
                    <th className="py-1.5 text-right font-medium">Revenue</th>
                    <th className="py-1.5 text-right font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {report.products.map((p) => (
                    <tr key={p.name} className="border-t border-border">
                      <td className="py-1.5 text-navy">{p.name}</td>
                      <td className="py-1.5 text-right tabular-nums">{p.units}</td>
                      <td className="py-1.5 text-right tabular-nums">{fmtCurrency(p.revenue)}</td>
                      <td className="py-1.5 text-right tabular-nums text-muted">{p.share.toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-navy">Commentary</h3>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700">
                {report.commentary.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <footer className="mt-8 border-t border-border pt-3 text-[10px] text-muted">
            Sample data for demonstration only. Built with Erun Lab · erungroup.ca
          </footer>
        </article>
      )}
    </div>
  );
}
