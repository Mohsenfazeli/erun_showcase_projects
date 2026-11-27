import { CHANNELS, N_MONTHS, REGIONS, SALES, START, type Channel, type Region } from "@/data/company";
import { MONTHS, monthLabels } from "@/lib/forecast";

export type MetricKey = "revenue" | "orders" | "aov" | "margin";

export const METRIC_INFO: Record<MetricKey, { label: string; short: string; kind: "money" | "count" | "pct" }> = {
  revenue: { label: "Revenue", short: "Revenue", kind: "money" },
  orders: { label: "Orders", short: "Orders", kind: "count" },
  aov: { label: "Average order value", short: "Avg. order", kind: "money" },
  margin: { label: "Gross margin", short: "Margin", kind: "pct" },
};

export const LABELS = monthLabels(START.year, START.month, N_MONTHS + 12);

export function monthName(t: number, long = true) {
  const m = (START.month + t) % 12;
  const y = START.year + Math.floor((START.month + t) / 12);
  const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return long ? `${names[m]} ${y}` : `${MONTHS[m]} ${y}`;
}

export interface Series {
  revenue: number[];
  orders: number[];
  cost: number[];
}

const cache = new Map<string, Series>();

/** Monthly totals, optionally filtered to one region and/or channel. */
export function monthly(filter: { region?: Region; channel?: Channel } = {}): Series {
  const key = `${filter.region ?? "*"}|${filter.channel ?? "*"}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const s: Series = { revenue: new Array(N_MONTHS).fill(0), orders: new Array(N_MONTHS).fill(0), cost: new Array(N_MONTHS).fill(0) };
  for (const r of SALES) {
    if (filter.region && r.region !== filter.region) continue;
    if (filter.channel && r.channel !== filter.channel) continue;
    s.revenue[r.t] += r.revenue;
    s.orders[r.t] += r.orders;
    s.cost[r.t] += r.cost;
  }
  cache.set(key, s);
  return s;
}

const sum = (a: number[], from: number, to: number) => {
  let s = 0;
  for (let i = Math.max(0, from); i <= to; i++) s += a[i];
  return s;
};

/** Value of a metric over a window of months [from, to] (inclusive). */
export function windowValue(s: Series, metric: MetricKey, from: number, to: number) {
  const rev = sum(s.revenue, from, to);
  const ord = sum(s.orders, from, to);
  const cost = sum(s.cost, from, to);
  switch (metric) {
    case "revenue":
      return rev;
    case "orders":
      return ord;
    case "aov":
      return rev / ord;
    case "margin":
      return ((rev - cost) / rev) * 100;
  }
}

/** Monthly series of a metric. */
export function metricSeries(s: Series, metric: MetricKey) {
  return s.revenue.map((_, i) => windowValue(s, metric, i, i));
}

/** Change between two values: % for amounts, percentage points for margin. */
export function change(metric: MetricKey, now: number, before: number) {
  return METRIC_INFO[metric].kind === "pct" ? now - before : ((now - before) / before) * 100;
}

export function fmtMetric(metric: MetricKey, v: number, compact = false) {
  const kind = METRIC_INFO[metric].kind;
  if (kind === "pct") return `${v.toFixed(1)}%`;
  if (kind === "count") return compact && v >= 10_000 ? `${(v / 1000).toFixed(1)}k` : Math.round(v).toLocaleString("en-CA");
  if (metric === "aov") return `$${v.toFixed(0)}`;
  if (compact || v >= 1_000_000) {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    return `$${(v / 1000).toFixed(0)}k`;
  }
  return `$${Math.round(v).toLocaleString("en-CA")}`;
}

export function fmtChange(metric: MetricKey, d: number, digits = 1) {
  const sign = d > 0 ? "+" : d < 0 ? "−" : "";
  return METRIC_INFO[metric].kind === "pct" ? `${sign}${Math.abs(d).toFixed(digits)} pts` : `${sign}${Math.abs(d).toFixed(digits)}%`;
}

export { REGIONS, CHANNELS, N_MONTHS };
