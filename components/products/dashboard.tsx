"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Lightbulb } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Segmented } from "@/components/ui/form";
import { SampleTag } from "@/components/product-header";
import { Delta } from "@/components/delta";
import { C, SERIES, axis, tooltip } from "@/components/chart-theme";
import { COMPANY } from "@/data/company";
import {
  CHANNELS,
  LABELS,
  N_MONTHS,
  REGIONS,
  change,
  fmtChange,
  fmtMetric,
  metricSeries,
  monthName,
  monthly,
  windowValue,
  type MetricKey,
} from "@/lib/metrics";
import { forecastSeries } from "@/lib/forecast";
import { cn } from "@/lib/utils";
import type { Region } from "@/data/company";

type RegionFilter = "All" | Region;
type Range = "12" | "24" | "36";

const LAST = N_MONTHS - 1;
const HORIZON = 6;
const KPIS: MetricKey[] = ["revenue", "orders", "aov", "margin"];
const KPI_LABEL: Record<MetricKey, string> = {
  revenue: "Revenue",
  orders: "Orders",
  aov: "Avg. order value",
  margin: "Gross margin",
};

function Sparkline({ data, id }: { data: number[]; id: string }) {
  const rows = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.brand} stopOpacity={0.18} />
              <stop offset="100%" stopColor={C.brand} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Area type="monotone" dataKey="v" stroke={C.brand} strokeWidth={1.5} fill={`url(#sp-${id})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Dashboard() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [range, setRange] = useState<Range>("24");

  const series = useMemo(() => monthly(region === "All" ? {} : { region }), [region]);

  const kpis = useMemo(
    () =>
      KPIS.map((m) => {
        const now = windowValue(series, m, LAST - 11, LAST);
        const before = windowValue(series, m, LAST - 23, LAST - 12);
        return { m, now, delta: change(m, now, before), spark: metricSeries(series, m).slice(-24) };
      }),
    [series],
  );

  const trend = useMemo(() => {
    const fc = forecastSeries(series.revenue, HORIZON, { startOffset: 10, z: 1.28 });
    const from = N_MONTHS - Number(range);
    const rows: { label: string; actual?: number; forecast?: number; band?: [number, number] }[] = series.revenue
      .slice(from)
      .map((v, i) => ({ label: LABELS[from + i], actual: v }));
    const last = rows[rows.length - 1];
    last.forecast = last.actual;
    last.band = [last.actual!, last.actual!];
    fc.forecast.forEach((v, h) => rows.push({ label: LABELS[N_MONTHS + h], forecast: Math.round(v), band: [Math.round(fc.lower[h]), Math.round(fc.upper[h])] }));
    const next = fc.forecast.reduce((s, v) => s + v, 0);
    const sameLastYear = series.revenue.slice(N_MONTHS - 12, N_MONTHS - 12 + HORIZON).reduce((s, v) => s + v, 0);
    return { rows, next, growth: ((next - sameLastYear) / sameLastYear) * 100 };
  }, [series, range]);

  const mix = useMemo(() => {
    const total = windowValue(series, "revenue", LAST - 11, LAST);
    return CHANNELS.map((ch, i) => {
      const s = monthly(region === "All" ? { channel: ch } : { region, channel: ch });
      const now = windowValue(s, "revenue", LAST - 11, LAST);
      const before = windowValue(s, "revenue", LAST - 23, LAST - 12);
      return { name: ch, value: now, share: (now / total) * 100, yoy: change("revenue", now, before), color: SERIES[i] };
    });
  }, [series, region]);

  const regions = useMemo(
    () =>
      REGIONS.map((r) => {
        const s = monthly({ region: r });
        const now = windowValue(s, "revenue", LAST - 11, LAST);
        const before = windowValue(s, "revenue", LAST - 23, LAST - 12);
        return { region: r, value: now, yoy: change("revenue", now, before) };
      }).sort((a, b) => b.value - a.value),
    [],
  );

  const margin = useMemo(() => {
    const m = metricSeries(series, "margin").slice(-Number(range));
    const avg = windowValue(series, "margin", LAST - 11, LAST);
    return { rows: m.map((v, i) => ({ label: LABELS[N_MONTHS - m.length + i], v: +v.toFixed(2) })), avg };
  }, [series, range]);

  const insights = useMemo(() => {
    const fastest = [...mix].sort((a, b) => b.yoy - a.yoy)[0];
    const slowest = [...mix].sort((a, b) => a.yoy - b.yoy)[0];
    const recent = windowValue(series, "margin", LAST - 2, LAST);
    const ttm = windowValue(series, "margin", LAST - 11, LAST);
    return [
      `${fastest.name} is the fastest-growing channel, up ${fastest.yoy.toFixed(1)}% over the last 12 months and now ${fastest.share.toFixed(0)}% of revenue.`,
      slowest.yoy < 3
        ? `${slowest.name} is lagging at ${fmtChange("revenue", slowest.yoy)} year over year. Worth a closer look.`
        : `All channels are growing; ${slowest.name} is the slowest at ${fmtChange("revenue", slowest.yoy)}.`,
      `The next ${HORIZON} months are forecast at ${fmtMetric("revenue", trend.next, true)}, ${fmtChange("revenue", trend.growth)} on the same period last year.`,
      `Gross margin averaged ${recent.toFixed(1)}% over the last 3 months, ${fmtChange("margin", recent - ttm)} against the 12-month average.`,
    ];
  }, [mix, series, trend]);

  return (
    <div className="space-y-5 animate-fade-up" style={{ animationDelay: "80ms" }}>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border border-line bg-surface px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center bg-ink text-[13px] font-extrabold text-white">NC</span>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-bold text-ink">{COMPANY.name}</p>
            <p className="truncate text-[11.5px] text-ink-2">
              {COMPANY.description} · Data to {monthName(LAST)}
            </p>
          </div>
          <SampleTag className="hidden sm:inline-flex" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="max-w-full overflow-x-auto thin-scroll">
            <Segmented<RegionFilter>
              label="Region"
              value={region}
              onChange={setRegion}
              options={[{ value: "All", label: "All regions" }, ...REGIONS.map((r) => ({ value: r, label: r }))]}
            />
          </div>
          <Segmented<Range>
            label="Range"
            value={range}
            onChange={setRange}
            options={[
              { value: "12", label: "12M" },
              { value: "24", label: "24M" },
              { value: "36", label: "36M" },
            ]}
          />
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.m} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[12px] font-semibold text-ink-2">{KPI_LABEL[k.m]}</p>
              <Delta value={k.delta} text={fmtChange(k.m, k.delta)} />
            </div>
            <p className="mt-2 text-[26px] font-bold leading-none tracking-[-0.02em] tabular-nums text-ink">{fmtMetric(k.m, k.now, true)}</p>
            <p className="mt-1.5 text-[11px] text-ink-3">Last 12 months vs prior year</p>
            <div className="mt-3">
              <Sparkline data={k.spark} id={k.m} />
            </div>
          </Card>
        ))}
      </div>

      {/* Trend + mix */}
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Card className="min-w-0">
          <CardHeader
            title="Monthly revenue and 6-month forecast"
            subtitle={`${region === "All" ? "All regions" : region} · shaded band shows the 80% forecast range`}
            action={
              <div className="text-right">
                <p className="text-[11px] text-ink-3">Next 6 months</p>
                <p className="text-[15px] font-bold tabular-nums text-ink">
                  {fmtMetric("revenue", trend.next, true)} <span className="text-[11px] font-semibold text-brand">{fmtChange("revenue", trend.growth)}</span>
                </p>
              </div>
            }
          />
          <CardBody>
            <div className="h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trend.rows} margin={{ top: 8, right: 4, left: -6, bottom: 0 }}>
                  <CartesianGrid stroke={C.line} vertical={false} />
                  <XAxis dataKey="label" {...axis} interval={range === "12" ? 1 : range === "24" ? 3 : 5} />
                  <YAxis {...axis} width={50} domain={["auto", "auto"]} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                  <Tooltip
                    {...tooltip}
                    formatter={(v, name) => {
                      if (Array.isArray(v)) return [`${fmtMetric("revenue", Number(v[0]), true)} to ${fmtMetric("revenue", Number(v[1]), true)}`, "Forecast range"];
                      return [fmtMetric("revenue", Number(v)), name === "actual" ? "Actual" : "Forecast"];
                    }}
                  />
                  <ReferenceLine x={LABELS[LAST]} stroke={C.ink3} strokeDasharray="3 3" label={{ value: "Forecast →", position: "insideTopRight", fontSize: 10, fill: C.ink3 }} />
                  <Area dataKey="band" stroke="none" fill={C.brand} fillOpacity={0.1} animationDuration={450} />
                  <Line dataKey="actual" stroke={C.ink} strokeWidth={2} dot={false} animationDuration={450} />
                  <Line dataKey="forecast" stroke={C.brand} strokeWidth={2.25} strokeDasharray="5 4" dot={false} animationDuration={450} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-5 text-[11px] text-ink-2">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-ink" /> Actual</span>
              <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-brand" /> Forecast</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 bg-brand/15" /> 80% range</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Revenue by channel" subtitle="Last 12 months" />
          <CardBody>
            <div className="relative mx-auto h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mix} dataKey="value" nameKey="name" innerRadius={62} outerRadius={86} paddingAngle={2} stroke="none" animationDuration={450}>
                    {mix.map((m) => (
                      <Cell key={m.name} fill={m.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltip} formatter={(v, n) => [fmtMetric("revenue", Number(v), true), String(n)]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] text-ink-3">Total</span>
                <span className="text-[17px] font-bold tabular-nums text-ink">{fmtMetric("revenue", mix.reduce((s, m) => s + m.value, 0), true)}</span>
              </div>
            </div>
            <ul className="mt-5 divide-y divide-line">
              {mix.map((m) => (
                <li key={m.name} className="flex items-center gap-3 py-2.5 text-[13px]">
                  <span className="size-2.5" style={{ background: m.color }} />
                  <span className="flex-1 font-medium text-ink">{m.name}</span>
                  <span className="tabular-nums text-ink-2">{m.share.toFixed(0)}%</span>
                  <Delta value={m.yoy} text={fmtChange("revenue", m.yoy)} className="w-[62px] justify-center" />
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {/* Region, margin, insights */}
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader title="Revenue by region" subtitle="Last 12 months, with year-over-year change" />
          <CardBody>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regions} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="region" {...axis} width={76} tick={{ ...axis.tick, fill: C.ink2, fontSize: 12 }} />
                  <Tooltip {...tooltip} cursor={{ fill: C.brandLight }} formatter={(v) => [fmtMetric("revenue", Number(v), true), "Revenue"]} />
                  <Bar
                    dataKey="value"
                    radius={[0, 3, 3, 0]}
                    barSize={18}
                    animationDuration={450}
                    label={{ position: "right", fontSize: 11, fill: C.ink2, formatter: (v: unknown) => fmtMetric("revenue", Number(v), true) }}
                    onClick={(d) => setRegion((d as unknown as { region: Region }).region)}
                    className="cursor-pointer"
                  >
                    {regions.map((r) => (
                      <Cell key={r.region} fill={region === "All" || region === r.region ? C.brand : C.soft} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1 text-center">
              {regions.map((r) => (
                <div key={r.region}>
                  <p className="truncate text-[10.5px] text-ink-3">{r.region}</p>
                  <p className={cn("text-[12px] font-bold tabular-nums", r.yoy >= 0 ? "text-emerald-700" : "text-orange-700")}>{fmtChange("revenue", r.yoy)}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Gross margin" subtitle={`Monthly, against the 12-month average (${margin.avg.toFixed(1)}%)`} />
          <CardBody>
            <div className="h-[236px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={margin.rows} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                  <CartesianGrid stroke={C.line} vertical={false} />
                  <XAxis dataKey="label" {...axis} interval={range === "12" ? 2 : range === "24" ? 5 : 8} />
                  <YAxis {...axis} domain={["dataMin - 0.5", "dataMax + 0.5"]} tickCount={5} tickFormatter={(v) => `${Number(v).toFixed(1)}%`} width={52} />
                  <Tooltip {...tooltip} formatter={(v) => [`${Number(v).toFixed(1)}%`, "Gross margin"]} />
                  <ReferenceLine y={margin.avg} stroke={C.ink3} strokeDasharray="4 4" />
                  <Line dataKey="v" stroke={C.brand} strokeWidth={2} dot={false} animationDuration={450} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader title="What the data says" subtitle="Generated from the figures on this page" />
          <CardBody>
            <ul className="space-y-3.5">
              {insights.map((t, i) => (
                <li key={`${region}-${i}`} className="flex gap-3 text-[13px] leading-relaxed text-ink animate-fade-in">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center bg-brand-light text-brand">
                    {i === 0 ? <Lightbulb className="size-3" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <p className="text-[11px] text-ink-3">{COMPANY.note} Forecast uses a trend and seasonality model fitted to five years of monthly sales.</p>
    </div>
  );
}
