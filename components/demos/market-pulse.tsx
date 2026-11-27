"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/form";
import { KpiCard } from "@/components/kpi-card";
import { SampleNote } from "@/components/demo-header";
import { COLORS, axisProps, tooltipStyle } from "@/components/chart-theme";
import {
  HISTORY_MONTHS,
  LABELS,
  METRICS,
  REGIONS,
  SECTORS,
  getSeries,
  type MetricKey,
  type Region,
  type Sector,
} from "@/data/market";
import { forecastSeries } from "@/lib/forecast";
import { cn } from "@/lib/utils";

const HORIZON = 6;
const START_MONTH = 10;

function fmtValue(v: number, unit: "index" | "k$" | "pct") {
  if (unit === "pct") return `${v.toFixed(1)}%`;
  if (unit === "k$") return `$${v.toFixed(1)}k`;
  return v.toFixed(1);
}

function yoy(series: number[]) {
  const n = series.length;
  return ((series[n - 1] - series[n - 13]) / series[n - 13]) * 100;
}

export function MarketPulse() {
  const [region, setRegion] = useState<Region>("Metro Vancouver");
  const [sector, setSector] = useState<Sector>("Retail");
  const [metric, setMetric] = useState<MetricKey>("activity");

  const series = useMemo(() => getSeries(region, sector), [region, sector]);

  const forecasts = useMemo(() => {
    const out = {} as Record<MetricKey, ReturnType<typeof forecastSeries>>;
    (Object.keys(METRICS) as MetricKey[]).forEach((k) => {
      out[k] = forecastSeries(series[k], HORIZON, { mode: METRICS[k].mode, startOffset: START_MONTH });
    });
    return out;
  }, [series]);

  const chartData = useMemo(() => {
    const s = series[metric];
    const f = forecasts[metric];
    const rows: { label: string; actual?: number; forecast?: number; band?: [number, number] }[] = s.map((v, i) => ({
      label: LABELS[i],
      actual: +v.toFixed(2),
    }));
    // Connect the forecast line to the last actual point.
    rows[rows.length - 1].forecast = rows[rows.length - 1].actual;
    rows[rows.length - 1].band = [rows[rows.length - 1].actual!, rows[rows.length - 1].actual!];
    f.forecast.forEach((v, h) => {
      rows.push({
        label: LABELS[HISTORY_MONTHS + h],
        forecast: +v.toFixed(2),
        band: [+f.lower[h].toFixed(2), +f.upper[h].toFixed(2)],
      });
    });
    return rows;
  }, [series, forecasts, metric]);

  const sectorCompare = useMemo(
    () =>
      SECTORS.map((sec) => ({
        sector: sec,
        growth: +yoy(getSeries(region, sec).activity).toFixed(1),
      })).sort((a, b) => b.growth - a.growth),
    [region],
  );

  const kpis = (Object.keys(METRICS) as MetricKey[]).map((k) => {
    const s = series[k];
    const latest = s[s.length - 1];
    const delta = METRICS[k].unit === "pct" ? latest - s[s.length - 13] : yoy(s);
    return { key: k, latest, delta };
  });

  const summary = useMemo(() => {
    const act = yoy(series.activity);
    const emp = yoy(series.employment);
    const costNow = series.costs[series.costs.length - 1];
    const costPrev = series.costs[series.costs.length - 13];
    const fa = forecasts.activity;
    const last = series.activity[series.activity.length - 1];
    // Compare like-for-like months to strip seasonality from the outlook.
    const outlookChange = ((fa.forecast[HORIZON - 1] - series.activity[HISTORY_MONTHS - 12 + HORIZON - 1]) /
      series.activity[HISTORY_MONTHS - 12 + HORIZON - 1]) * 100;
    const outlook =
      outlookChange > 2.5 ? "continued expansion" : outlookChange > 0.5 ? "modest growth" : outlookChange > -0.5 ? "a broadly flat path" : "some softening";
    const momentum = act > 3 && emp > 0.5 ? "Strong" : act > 0 ? "Steady" : "Cooling";
    const rank = sectorCompare.findIndex((s) => s.sector === sector) + 1;
    return {
      momentum,
      text: `In ${region}, ${sector.toLowerCase()} activity is ${act >= 0 ? "up" : "down"} ${Math.abs(act).toFixed(1)}% year over year, ranking ${rank} of ${SECTORS.length} sectors in the region. Employment is ${emp >= 0 ? "up" : "down"} ${Math.abs(emp).toFixed(1)}%, and input cost inflation is ${costNow.toFixed(1)}%, ${costNow > costPrev ? "higher" : "lower"} than a year ago (${costPrev.toFixed(1)}%). The six-month outlook points to ${outlook}, with activity expected between ${fa.lower[HORIZON - 1].toFixed(0)} and ${fa.upper[HORIZON - 1].toFixed(0)} by ${LABELS[HISTORY_MONTHS + HORIZON - 1]} (latest: ${last.toFixed(0)}).`,
    };
  }, [series, forecasts, region, sector, sectorCompare]);

  const m = METRICS[metric];

  return (
    <div className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
      <Card>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2 md:max-w-xl">
          <div className="space-y-1.5">
            <Label htmlFor="region">Region</Label>
            <Select id="region" value={region} onChange={(e) => setRegion(e.target.value as Region)}>
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sector">Sector</Label>
            <Select id="sector" value={sector} onChange={(e) => setSector(e.target.value as Sector)}>
              {SECTORS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((k) => (
          <button
            key={k.key}
            onClick={() => setMetric(k.key)}
            className={cn(
              "text-left rounded-xl transition cursor-pointer",
              metric === k.key ? "ring-2 ring-brand ring-offset-2 ring-offset-background" : "hover:-translate-y-0.5",
            )}
          >
            <KpiCard
              label={METRICS[k.key].label}
              value={fmtValue(k.latest, METRICS[k.key].unit)}
              delta={k.delta}
              invert={k.key === "costs"}
              deltaLabel={METRICS[k.key].unit === "pct" ? "pts vs last year" : "YoY"}
              className="h-full"
            />
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card className="min-w-0">
          <CardHeader className="sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>{m.label}</CardTitle>
              <CardDescription>
                {region} · {sector} · last 36 months with a 6-month forecast (80% band)
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-1 pt-2 sm:pt-0">
              {(Object.keys(METRICS) as MetricKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setMetric(k)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer",
                    metric === k ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-100",
                  )}
                >
                  {METRICS[k].short}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="label" {...axisProps} interval={5} />
                  <YAxis {...axisProps} domain={["auto", "auto"]} width={48} tickFormatter={(v) => (m.unit === "pct" ? `${v}%` : m.unit === "k$" ? `$${v}k` : `${v}`)} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(v, name) => {
                      if (Array.isArray(v)) return [`${fmtValue(Number(v[0]), m.unit)} to ${fmtValue(Number(v[1]), m.unit)}`, "80% band"];
                      return [fmtValue(Number(v), m.unit), name === "actual" ? "Actual" : "Forecast"];
                    }}
                  />
                  <ReferenceLine x={LABELS[HISTORY_MONTHS - 1]} stroke={COLORS.slate} strokeDasharray="3 3" label={{ value: "Today", position: "insideTopRight", fontSize: 10, fill: "#64748B" }} />
                  <Area dataKey="band" stroke="none" fill={COLORS.band} fillOpacity={0.14} animationDuration={500} />
                  <Line dataKey="actual" stroke={COLORS.navy} strokeWidth={2} dot={false} animationDuration={500} />
                  <Line dataKey="forecast" stroke={COLORS.brand} strokeWidth={2.5} strokeDasharray="5 4" dot={false} animationDuration={500} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-muted">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-navy" /> Actual</span>
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t-2 border-dashed border-brand" /> Forecast</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-brand/15" /> 80% forecast band</span>
            </div>
            <SampleNote />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sector activity growth</CardTitle>
            <CardDescription>{region}, year over year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorCompare} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                  <XAxis type="number" {...axisProps} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="sector" {...axisProps} width={92} />
                  <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "YoY growth"]} cursor={{ fill: "#F1F5F9" }} />
                  <ReferenceLine x={0} stroke={COLORS.slate} />
                  <Bar dataKey="growth" radius={[0, 4, 4, 0]} animationDuration={500} onClick={(d) => setSector((d as unknown as { sector: Sector }).sector)} className="cursor-pointer">
                    {sectorCompare.map((s) => (
                      <Cell key={s.sector} fill={s.sector === sector ? COLORS.brand : "#CBD5E1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-brand/30">
        <CardContent className="flex gap-4 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <FileText className="size-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">Generated summary</p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  summary.momentum === "Strong" ? "bg-emerald-50 text-emerald-700" : summary.momentum === "Steady" ? "bg-brand-soft text-brand" : "bg-amber-50 text-amber-700",
                )}
              >
                Momentum: {summary.momentum}
              </span>
            </div>
            <p key={region + sector} className="mt-1.5 text-sm leading-relaxed text-slate-700 animate-fade-in">
              {summary.text}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
