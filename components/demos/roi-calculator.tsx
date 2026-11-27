"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Bot, Clock, Lightbulb, Users, Workflow } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SliderField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi-card";
import { SampleNote } from "@/components/demo-header";
import { COLORS, axisProps, tooltipStyle } from "@/components/chart-theme";
import { fmtCurrency, fmtNumber } from "@/lib/utils";

interface Inputs {
  hoursPerRun: number;
  runsPerMonth: number;
  hourlyCost: number;
  people: number;
  oneTimeCost: number;
  automationShare: number;
  monthlyRunCost: number;
}

const PRESETS: { name: string; inputs: Inputs }[] = [
  {
    name: "Invoice data entry",
    inputs: { hoursPerRun: 0.25, runsPerMonth: 160, hourlyCost: 38, people: 1, oneTimeCost: 9000, automationShare: 85, monthlyRunCost: 120 },
  },
  {
    name: "Monthly management report",
    inputs: { hoursPerRun: 6, runsPerMonth: 2, hourlyCost: 65, people: 2, oneTimeCost: 7500, automationShare: 80, monthlyRunCost: 60 },
  },
  {
    name: "Client onboarding",
    inputs: { hoursPerRun: 1.5, runsPerMonth: 25, hourlyCost: 48, people: 3, oneTimeCost: 18000, automationShare: 60, monthlyRunCost: 200 },
  },
];

function suggestApproach(i: Inputs, paybackMonths: number) {
  if (paybackMonths === Infinity || paybackMonths > 36) {
    return {
      icon: Lightbulb,
      title: "Start small before investing",
      body: "At these numbers a full build may not pay for itself within three years. Begin with a low-cost pilot (spreadsheet templates, macros or a no-code flow) and revisit once volume grows.",
    };
  }
  if (i.runsPerMonth >= 80 && i.hoursPerRun <= 0.75) {
    return {
      icon: Bot,
      title: "High-volume task automation",
      body: "Many short, repetitive runs are ideal for a scripted bot or document-extraction pipeline that processes items in batches, with people reviewing only the exceptions.",
    };
  }
  if (i.people >= 3) {
    return {
      icon: Users,
      title: "Workflow orchestration",
      body: "Several people touch each run, so most time is lost in hand-offs. A workflow tool with forms, approvals and automatic notifications (e.g. Power Automate or a custom app) removes the waiting and chasing.",
    };
  }
  if (i.hoursPerRun >= 3) {
    return {
      icon: Workflow,
      title: "Data pipeline + automated reporting",
      body: "Long, infrequent runs usually mean manual data gathering and formatting. Connect the data sources once, then let a scheduled pipeline build the output automatically.",
    };
  }
  return {
    icon: Clock,
    title: "Lightweight scripted automation",
    body: "A focused script or integration between your existing tools will remove most of the manual steps quickly, with a short payback period.",
  };
}

export function RoiCalculator() {
  const [inputs, setInputs] = useState<Inputs>(PRESETS[0].inputs);
  const set = <K extends keyof Inputs>(k: K) => (v: Inputs[K]) => setInputs((p) => ({ ...p, [k]: v }));

  const r = useMemo(() => {
    const monthlyHours = inputs.hoursPerRun * inputs.runsPerMonth * inputs.people;
    const hoursSaved = monthlyHours * (inputs.automationShare / 100);
    const gross = hoursSaved * inputs.hourlyCost;
    const net = gross - inputs.monthlyRunCost;
    const payback = net > 0 ? inputs.oneTimeCost / net : Infinity;
    const chart = Array.from({ length: 37 }, (_, m) => ({
      month: m,
      cumulative: Math.round(net * m - inputs.oneTimeCost),
    }));
    const threeYear = net * 36 - inputs.oneTimeCost;
    const roi = inputs.oneTimeCost > 0 ? (threeYear / inputs.oneTimeCost) * 100 : null;
    return { monthlyHours, hoursSaved, gross, net, payback, chart, threeYear, roi };
  }, [inputs]);

  const approach = suggestApproach(inputs, r.payback);
  const ApproachIcon = approach.icon;
  const paybackLabel =
    r.payback === Infinity ? "Never" : r.payback < 1 ? "< 1 month" : `${r.payback.toFixed(1)} months`;

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_1fr] animate-fade-up" style={{ animationDelay: "80ms" }}>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Your workflow</CardTitle>
          <CardDescription>Start from an example, then adjust.</CardDescription>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {PRESETS.map((p) => (
              <Button
                key={p.name}
                size="sm"
                variant={JSON.stringify(p.inputs) === JSON.stringify(inputs) ? "soft" : "outline"}
                onClick={() => setInputs(p.inputs)}
              >
                {p.name}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderField label="Hours per run" value={inputs.hoursPerRun} onChange={set("hoursPerRun")} min={0.25} max={8} step={0.25} format={(v) => `${v} h`} />
          <SliderField label="Runs per month" value={inputs.runsPerMonth} onChange={set("runsPerMonth")} min={1} max={300} format={(v) => fmtNumber(v)} />
          <SliderField label="Staff hourly cost (loaded)" value={inputs.hourlyCost} onChange={set("hourlyCost")} min={20} max={150} format={(v) => fmtCurrency(v)} />
          <SliderField label="People involved per run" value={inputs.people} onChange={set("people")} min={1} max={10} />
          <SliderField label="One-time automation cost" value={inputs.oneTimeCost} onChange={set("oneTimeCost")} min={0} max={100000} step={500} format={(v) => fmtCurrency(v)} />
          <div className="border-t border-border pt-4 space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Assumptions</p>
            <SliderField label="Share of effort automated" value={inputs.automationShare} onChange={set("automationShare")} min={10} max={100} step={5} format={(v) => `${v}%`} hint="Rarely 100%: people still review exceptions." />
            <SliderField label="Ongoing running cost / month" value={inputs.monthlyRunCost} onChange={set("monthlyRunCost")} min={0} max={2000} step={10} format={(v) => fmtCurrency(v)} hint="Licences, hosting and maintenance." />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6 min-w-0">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <KpiCard label="Monthly savings" value={fmtCurrency(r.net)} sub={`${fmtNumber(r.hoursSaved, 0)} of ${fmtNumber(r.monthlyHours, 0)} hrs freed`} />
          <KpiCard label="Annual savings" value={fmtCurrency(r.net * 12)} sub="net of running costs" />
          <KpiCard label="Payback period" value={paybackLabel} sub={r.payback <= 12 ? "Within the first year" : r.payback <= 36 ? "Within three years" : "Beyond three years"} />
          <KpiCard label="3-year net return" value={fmtCurrency(r.threeYear)} sub={r.roi !== null ? `${fmtNumber(r.roi, 0)}% ROI` : "No upfront cost"} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative net savings over 3 years</CardTitle>
            <CardDescription>Savings minus the one-time cost and running costs. The line crosses zero at payback.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={r.chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="roiFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.brand} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={COLORS.brand} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="month" {...axisProps} ticks={[0, 6, 12, 18, 24, 30, 36]} tickFormatter={(m) => `M${m}`} />
                  <YAxis {...axisProps} width={64} tickFormatter={(v) => `${v < 0 ? "-" : ""}$${Math.abs(v) >= 1000 ? `${Math.round(Math.abs(v) / 1000)}k` : Math.abs(v)}`} />
                  <Tooltip {...tooltipStyle} labelFormatter={(m) => `Month ${m}`} formatter={(v) => [fmtCurrency(Number(v)), "Cumulative"]} />
                  <ReferenceLine y={0} stroke={COLORS.navy} strokeDasharray="4 4" strokeOpacity={0.5} />
                  <Area type="monotone" dataKey="cumulative" stroke={COLORS.brand} strokeWidth={2.5} fill="url(#roiFill)" animationDuration={500} />
                  {r.payback !== Infinity && r.payback <= 36 && (
                    <ReferenceDot x={Math.min(36, Math.ceil(r.payback))} y={r.chart[Math.min(36, Math.ceil(r.payback))].cumulative} r={5} fill={COLORS.navy} stroke="#fff" strokeWidth={2} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <SampleNote>Estimates only. Results depend on your actual process, volumes and implementation.</SampleNote>
          </CardContent>
        </Card>

        <Card className="border-brand/30 bg-gradient-to-br from-white to-brand-soft/60">
          <CardContent className="flex gap-4 p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
              <ApproachIcon className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">Suggested approach</p>
              <h3 className="mt-0.5 font-semibold text-navy">{approach.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{approach.body}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
