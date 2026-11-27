"use client";

import { useMemo, useRef, useState } from "react";
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
import { Download, RotateCcw, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Select, SliderField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi-card";
import { SampleNote } from "@/components/demo-header";
import { COLORS, axisProps, tooltipStyle } from "@/components/chart-theme";
import { SALES_DATASETS, SAMPLE_CSV, type SalesDataset } from "@/data/sales";
import { MONTHS, forecastSeries, monthLabels } from "@/lib/forecast";
import { cn, downloadFile, fmtNumber, fmtPct } from "@/lib/utils";

const ELASTICITY = -1.3;

function parseCsv(text: string): SalesDataset | string {
  const rows = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split(/[,;\t]/).map((c) => c.trim().replace(/^"|"$/g, "")));
  const data = rows.filter((r) => r.length >= 2 && r[r.length - 1] !== "" && !isNaN(Number(r[r.length - 1].replace(/[$ ]/g, ""))));
  if (data.length < 24) return "Need at least 24 monthly rows with a numeric value in the last column.";
  if (data.length > 240) return "Please upload at most 240 months of data.";
  const values = data.map((r) => Number(r[r.length - 1].replace(/[$ ]/g, "")));
  let startYear = 2024;
  let startMonth = 0;
  const first = data[0][0];
  const iso = first.match(/^(\d{4})[-/](\d{1,2})/);
  if (iso) {
    startYear = Number(iso[1]);
    startMonth = Number(iso[2]) - 1;
  } else {
    const d = new Date(first);
    if (!isNaN(d.getTime())) {
      startYear = d.getFullYear();
      startMonth = d.getMonth();
    }
  }
  return { id: "upload", name: "Your uploaded data", unit: "units", startYear, startMonth, values };
}

export function Forecasting() {
  const [datasetId, setDatasetId] = useState(SALES_DATASETS[0].id);
  const [upload, setUpload] = useState<SalesDataset | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [horizon, setHorizon] = useState(12);
  const [price, setPrice] = useState(0);
  const [promoLift, setPromoLift] = useState(12);
  const [promoMonths, setPromoMonths] = useState<number[]>([]);
  const [growth, setGrowth] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const dataset = datasetId === "upload" && upload ? upload : SALES_DATASETS.find((d) => d.id === datasetId)!;

  const model = useMemo(
    () => forecastSeries(dataset.values, horizon, { startOffset: dataset.startMonth, z: 1.28 }),
    [dataset, horizon],
  );

  const labels = useMemo(
    () => monthLabels(dataset.startYear, dataset.startMonth, dataset.values.length + horizon),
    [dataset, horizon],
  );

  const scenario = useMemo(() => {
    const n = dataset.values.length;
    const priceEffect = 1 + (ELASTICITY * price) / 100;
    return model.forecast.map((base, i) => {
      const h = i + 1;
      const month = (dataset.startMonth + n - 1 + h) % 12;
      const promo = promoMonths.includes(month) ? 1 + promoLift / 100 : 1;
      const g = (1 + growth / 100) ** (h / 12);
      const mult = priceEffect * promo * g;
      return { base, value: base * mult, lower: model.lower[i] * mult, upper: model.upper[i] * mult };
    });
  }, [model, dataset, price, promoLift, promoMonths, growth]);

  const chartData = useMemo(() => {
    const n = dataset.values.length;
    const rows: { label: string; actual?: number; base?: number; scenario?: number; band?: [number, number] }[] =
      dataset.values.map((v, i) => ({ label: labels[i], actual: v }));
    const last = dataset.values[n - 1];
    rows[n - 1] = { ...rows[n - 1], base: last, scenario: last, band: [last, last] };
    scenario.forEach((s, i) => {
      rows.push({
        label: labels[n + i],
        base: Math.round(s.base),
        scenario: Math.round(s.value),
        band: [Math.round(Math.max(0, s.lower)), Math.round(s.upper)],
      });
    });
    return rows;
  }, [dataset, labels, scenario]);

  const seasonData = MONTHS.map((m, k) => ({ month: m, index: +((model.seasonal[k] - 1) * 100).toFixed(1) }));

  const last12 = dataset.values.slice(-12).reduce((s, v) => s + v, 0);
  const next12 = scenario.slice(0, 12).reduce((s, v) => s + v.value, 0);
  const next12Base = scenario.slice(0, 12).reduce((s, v) => s + v.base, 0);
  const covered = Math.min(12, horizon);
  const scaledLast = (last12 / 12) * covered;
  const scenarioChanged = price !== 0 || growth !== 0 || promoMonths.length > 0;

  const onFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseCsv(text);
    if (typeof parsed === "string") {
      setUploadError(parsed);
      return;
    }
    setUploadError(null);
    setUpload(parsed);
    setDatasetId("upload");
  };

  const reset = () => {
    setPrice(0);
    setPromoMonths([]);
    setPromoLift(12);
    setGrowth(0);
  };

  return (
    <div className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-end">
          <div className="space-y-1.5 md:w-80">
            <Label htmlFor="dataset">Dataset</Label>
            <Select id="dataset" value={datasetId} onChange={(e) => setDatasetId(e.target.value)}>
              {SALES_DATASETS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
              {upload && <option value="upload">Your uploaded data</option>}
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.target.value = "";
              }}
            />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload /> Upload CSV
            </Button>
            <Button variant="ghost" onClick={() => downloadFile("sample-sales.csv", SAMPLE_CSV, "text/csv")}>
              <Download /> CSV template
            </Button>
          </div>
          <div className="md:ml-auto md:w-64 lg:w-72">
            <SliderField label="Forecast horizon" value={horizon} onChange={setHorizon} min={3} max={18} format={(v) => `${v} months`} />
          </div>
        </CardContent>
        {uploadError && <p className="px-4 pb-4 text-xs text-rose-600">{uploadError}</p>}
        {datasetId === "upload" && !uploadError && (
          <p className="px-4 pb-4 text-xs text-muted">Your file is processed in the browser only. Nothing is uploaded to a server.</p>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Last 12 months (actual)" value={fmtNumber(last12)} sub={dataset.unit} />
        <KpiCard
          label={`Next ${covered} months (scenario)`}
          value={fmtNumber(next12)}
          delta={((next12 - scaledLast) / scaledLast) * 100}
          deltaLabel="vs prior run-rate"
        />
        <KpiCard
          label="Scenario vs baseline"
          value={fmtPct(((next12 - next12Base) / next12Base) * 100)}
          sub={`${next12 - next12Base >= 0 ? "+" : ""}${fmtNumber(next12 - next12Base)} ${dataset.unit}`}
        />
        <KpiCard label="Underlying trend" value={fmtPct((model.slope * 12 * 100) / (dataset.values.reduce((s, v) => s + v, 0) / dataset.values.length))} sub="per year, before seasonality" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Sales history and forecast</CardTitle>
            <CardDescription>Trend + seasonality model with an 80% confidence band around the scenario.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="label" {...axisProps} interval={5} />
                  <YAxis {...axisProps} width={52} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(v, name) => {
                      if (Array.isArray(v)) return [`${fmtNumber(Number(v[0]))} to ${fmtNumber(Number(v[1]))}`, "80% band"];
                      const names: Record<string, string> = { actual: "Actual", base: "Baseline", scenario: "Scenario" };
                      return [fmtNumber(Number(v)), names[String(name)] ?? name];
                    }}
                  />
                  <ReferenceLine x={labels[dataset.values.length - 1]} stroke={COLORS.slate} strokeDasharray="3 3" />
                  <Area dataKey="band" stroke="none" fill={COLORS.band} fillOpacity={0.13} animationDuration={400} />
                  <Line dataKey="actual" stroke={COLORS.navy} strokeWidth={2} dot={false} animationDuration={400} />
                  {scenarioChanged && (
                    <Line dataKey="base" stroke={COLORS.slate} strokeWidth={1.5} strokeDasharray="4 4" dot={false} animationDuration={400} />
                  )}
                  <Line dataKey="scenario" stroke={COLORS.brand} strokeWidth={2.5} dot={false} animationDuration={400} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-muted">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-navy" /> Actual</span>
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-brand" /> Scenario forecast</span>
              {scenarioChanged && (
                <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t-2 border-dashed border-slate-400" /> Baseline</span>
              )}
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-brand/15" /> 80% band</span>
            </div>
            <SampleNote />
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>What-if scenario</CardTitle>
              <CardDescription>The forecast updates live.</CardDescription>
            </div>
            <Button size="icon" variant="ghost" onClick={reset} aria-label="Reset scenario" title="Reset">
              <RotateCcw />
            </Button>
          </CardHeader>
          <CardContent className="space-y-5">
            <SliderField
              label="Price change"
              value={price}
              onChange={setPrice}
              min={-20}
              max={20}
              format={(v) => `${v > 0 ? "+" : ""}${v}%`}
              hint={`Assumes price elasticity of ${ELASTICITY}: a 10% price rise cuts volume by about 13%.`}
            />
            <SliderField label="Extra annual growth" value={growth} onChange={setGrowth} min={-15} max={25} format={(v) => `${v > 0 ? "+" : ""}${v}%`} hint="e.g. new channel, marketing push or a downturn." />
            <div className="space-y-2">
              <SliderField label="Promotion lift" value={promoLift} onChange={setPromoLift} min={0} max={40} format={(v) => `+${v}%`} />
              <p className="text-[11px] text-muted">Promotion months:</p>
              <div className="grid grid-cols-6 gap-1">
                {MONTHS.map((m, k) => {
                  const on = promoMonths.includes(k);
                  return (
                    <button
                      key={m}
                      onClick={() => setPromoMonths((p) => (on ? p.filter((x) => x !== k) : [...p, k]))}
                      className={cn(
                        "rounded-md py-1 text-[11px] font-medium transition cursor-pointer",
                        on ? "bg-brand text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                      )}
                      aria-pressed={on}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seasonality</CardTitle>
          <CardDescription>How each calendar month typically differs from the trend.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => `${v}%`} />
                <Tooltip {...tooltipStyle} formatter={(v) => [`${Number(v) > 0 ? "+" : ""}${v}%`, "vs trend"]} cursor={{ fill: "#F1F5F9" }} />
                <ReferenceLine y={0} stroke={COLORS.slate} />
                <Bar dataKey="index" radius={[4, 4, 4, 4]} animationDuration={400}>
                  {seasonData.map((d) => (
                    <Cell key={d.month} fill={d.index >= 0 ? COLORS.brand : "#CBD5E1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
