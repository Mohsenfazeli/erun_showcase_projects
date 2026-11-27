/**
 * Builds the automated monthly report: numbers, signals and written commentary,
 * all derived from the sample sales data for the selected month.
 */
import { CHANNELS, REGIONS } from "@/data/company";
import { forecastSeries } from "@/lib/forecast";
import {
  METRIC_INFO,
  change,
  fmtChange,
  fmtMetric,
  monthName,
  monthly,
  windowValue,
  metricSeries,
  type MetricKey,
  type Series,
} from "@/lib/metrics";

export type Signal = "Accelerating" | "Steady" | "Slowing" | "Improving" | "Stable" | "Weakening";

export interface MetricAnalysis {
  metric: MetricKey;
  label: string;
  current: number;
  mom: number;
  yoy: number;
  ttm: number;
  ttmYoy: number;
  longTerm: number;
  longTermLabel: string;
  shortTerm: number;
  shortShift: number;
  signal: Signal;
  paragraphs: string[];
  chart: { label: string; value: number; trend: number | null }[];
}

const AMOUNT_METRICS: MetricKey[] = ["revenue", "orders", "aov"];
const pct = (v: number, d = 1) => `${Math.abs(v).toFixed(d)}%`;
const pts = (v: number, d = 1) => `${Math.abs(v).toFixed(d)} pts`;
const upDown = (v: number) => (v >= 0 ? "up" : "down");

function analyse(s: Series, metric: MetricKey, i: number): Omit<MetricAnalysis, "paragraphs" | "chart"> {
  const isPct = METRIC_INFO[metric].kind === "pct";
  const current = windowValue(s, metric, i, i);
  const mom = change(metric, current, windowValue(s, metric, i - 1, i - 1));
  const yoy = change(metric, current, windowValue(s, metric, i - 12, i - 12));
  const ttm = windowValue(s, metric, i - 11, i);
  const ttmPrev = windowValue(s, metric, i - 23, i - 12);
  const ttmYoy = change(metric, ttm, ttmPrev);
  const ttm3y = windowValue(s, metric, i - 47, i - 36);
  const longTerm = isPct ? ttm - ttm3y : ((ttm / ttm3y) ** (1 / 3) - 1) * 100;

  const q = windowValue(s, metric, i - 2, i);
  let shortTerm: number;
  let shortShift: number;
  let signal: Signal;
  if (isPct) {
    shortTerm = q;
    shortShift = q - ttm;
    signal = shortShift > 0.4 ? "Improving" : shortShift < -0.4 ? "Weakening" : "Stable";
  } else {
    shortTerm = change(metric, q, windowValue(s, metric, i - 14, i - 12));
    shortShift = shortTerm - ttmYoy;
    signal = shortShift > 2 ? "Accelerating" : shortShift < -2 ? "Slowing" : "Steady";
  }

  const longTermLabel = isPct
    ? longTerm > 1
      ? "rising"
      : longTerm < -1
        ? "eroding"
        : "broadly stable"
    : longTerm > 8
      ? "strong growth"
      : longTerm > 3
        ? "steady growth"
        : longTerm > 1
          ? "modest growth"
          : longTerm > -1
            ? "little change"
            : "decline";

  return { metric, label: METRIC_INFO[metric].label, current, mom, yoy, ttm, ttmYoy, longTerm, longTermLabel, shortTerm, shortShift, signal };
}

/** Channel 3-month YoY growth, used to explain short-term shifts. */
function channelShifts(i: number) {
  return CHANNELS.map((ch) => {
    const s = monthly({ channel: ch });
    const q = windowValue(s, "revenue", i - 2, i);
    const qLy = windowValue(s, "revenue", i - 14, i - 12);
    return { channel: ch, growth: change("revenue", q, qLy), delta: q - qLy };
  }).sort((a, b) => b.delta - a.delta);
}

function write(a: Omit<MetricAnalysis, "paragraphs" | "chart">, i: number): string[] {
  const m = a.metric;
  const month = monthName(i);
  const prevMonth = monthName(i - 1);
  const lyMonth = monthName(i - 12);
  const since = monthName(i - 36);
  const isPct = METRIC_INFO[m].kind === "pct";
  const name = m === "aov" ? "Average order value" : a.label;
  const lower = m === "aov" ? "average order value" : a.label.toLowerCase();
  const was = m === "orders" ? "were" : "was";
  const has = m === "orders" ? "have" : "has";

  const current = isPct
    ? `${name} was ${fmtMetric(m, a.current)} in ${month}, ${pts(a.yoy)} ${a.yoy >= 0 ? "higher" : "lower"} than in ${lyMonth} and ${pts(a.mom)} ${a.mom >= 0 ? "above" : "below"} ${prevMonth}.`
    : `${name} ${was} ${fmtMetric(m, a.current)} in ${month}, ${upDown(a.yoy)} ${pct(a.yoy)} on ${lyMonth} and ${pct(a.mom)} ${a.mom >= 0 ? "above" : "below"} ${prevMonth}.`;

  const longTerm = isPct
    ? `Over the longer term, the twelve-month margin has been ${a.longTermLabel}, moving ${a.longTerm >= 0 ? "up" : "down"} ${pts(a.longTerm)} since ${since}.`
    : `Over the longer term, twelve-month ${lower} ${has} ${a.longTerm >= 0 ? "grown" : "fallen"} by an average of ${pct(a.longTerm)} a year since ${since}, a pattern of ${a.longTermLabel}.`;

  let shortTerm: string;
  if (isPct) {
    shortTerm =
      a.signal === "Stable"
        ? `In the short term it has held steady: the last three months averaged ${fmtMetric(m, a.shortTerm)}, in line with the twelve-month average of ${fmtMetric(m, a.ttm)}.`
        : `In the short term it has ${a.signal === "Improving" ? "improved" : "weakened"}: the last three months averaged ${fmtMetric(m, a.shortTerm)}, ${pts(a.shortShift)} ${a.shortShift >= 0 ? "above" : "below"} the twelve-month average of ${fmtMetric(m, a.ttm)}.`;
  } else {
    const verb = a.signal === "Accelerating" ? "picked up" : a.signal === "Slowing" ? "slowed" : "held steady";
    shortTerm = `In the short term, momentum has ${verb}: the last three months were ${pct(a.shortTerm)} ${a.shortTerm >= 0 ? "ahead of" : "behind"} the same period last year, compared with ${fmtChange(m, a.ttmYoy)} across the full twelve months.`;
  }

  const out = [current, longTerm, shortTerm];

  if (m === "revenue") {
    const ch = channelShifts(i);
    const top = ch[0];
    const bottom = ch[ch.length - 1];
    out.push(
      bottom.growth < 0
        ? `The main driver was ${top.channel} (${fmtChange("revenue", top.growth)}), partly offset by a ${pct(bottom.growth)} decline in ${bottom.channel}.`
        : `${top.channel} contributed most of the growth (${fmtChange("revenue", top.growth)}); ${bottom.channel} grew the least (${fmtChange("revenue", bottom.growth)}).`,
    );
  }
  if (m === "margin" && a.signal === "Weakening") {
    out.push("This is the main item to watch next month. Pricing, discounting and input costs should be reviewed to confirm the cause.");
  }
  return out;
}

function chartFor(s: Series, m: MetricKey, i: number) {
  const values = metricSeries(s, m);
  return Array.from({ length: 24 }, (_, k) => {
    const t = i - 23 + k;
    const trend = t >= 11 ? windowValue(s, m, t - 11, t) / (AMOUNT_METRICS.includes(m) && m !== "aov" ? 12 : 1) : null;
    return { label: monthName(t, false), value: +values[t].toFixed(2), trend: trend === null ? null : +trend.toFixed(2) };
  });
}

export interface Report {
  index: number;
  month: string;
  metrics: MetricAnalysis[];
  summary: string;
  takeaways: { tone: "positive" | "watch" | "neutral"; text: string }[];
  channels: { name: string; value: number; yoy: number; share: number }[];
  regions: { name: string; value: number; yoy: number; share: number }[];
  outlook: { months: string; total: number; low: number; high: number; vsLastYear: number };
}

export function buildReport(i: number): Report {
  const s = monthly();
  const metrics: MetricAnalysis[] = (["revenue", "orders", "aov", "margin"] as MetricKey[]).map((m) => {
    const a = analyse(s, m, i);
    return { ...a, paragraphs: write(a, i), chart: chartFor(s, m, i) };
  });
  const [rev, ord, aov, mar] = metrics;

  const breakdown = (rows: { name: string; s: Series }[]) => {
    const total = windowValue(s, "revenue", i, i);
    return rows.map((r) => {
      const v = windowValue(r.s, "revenue", i, i);
      return { name: r.name, value: v, yoy: change("revenue", v, windowValue(r.s, "revenue", i - 12, i - 12)), share: (v / total) * 100 };
    });
  };
  const channels = breakdown(CHANNELS.map((c) => ({ name: c, s: monthly({ channel: c }) })));
  const regions = breakdown(REGIONS.map((r) => ({ name: r, s: monthly({ region: r }) }))).sort((a, b) => b.value - a.value);

  const fc = forecastSeries(s.revenue.slice(0, i + 1), 3, { startOffset: 10, z: 1.28 });
  const total = fc.forecast.reduce((a, b) => a + b, 0);
  const lastYear = s.revenue.slice(i - 11, i - 8).reduce((a, b) => a + b, 0);
  const outlook = {
    months: `${monthName(i + 1, false)} to ${monthName(i + 3, false)}`,
    total,
    low: fc.lower.reduce((a, b) => a + b, 0),
    high: fc.upper.reduce((a, b) => a + b, 0),
    vsLastYear: ((total - lastYear) / lastYear) * 100,
  };

  const lead = channelShifts(i)[0];
  const summary =
    `${monthName(i)} revenue was ${fmtMetric("revenue", rev.current)}, ${upDown(rev.yoy)} ${pct(rev.yoy)} year over year, ` +
    `with ${fmtMetric("orders", ord.current)} orders at an average of ${fmtMetric("aov", aov.current)}. ` +
    `The business is on a long-term path of ${rev.longTermLabel} (${pct(rev.longTerm)} a year over three years), and short-term revenue momentum is ${rev.signal.toLowerCase()}, ` +
    `led by ${lead.channel}. Gross margin was ${fmtMetric("margin", mar.current)}${mar.signal === "Weakening" ? ", and has slipped below its twelve-month average" : mar.signal === "Improving" ? ", ahead of its twelve-month average" : ", in line with its twelve-month average"}.`;

  const takeaways: Report["takeaways"] = [
    {
      tone: rev.yoy >= 0 ? "positive" : "watch",
      text: `Revenue ${fmtChange("revenue", rev.yoy)} year over year; three-month momentum is ${rev.signal.toLowerCase()} (${fmtChange("revenue", rev.shortTerm)}).`,
    },
    {
      tone: mar.signal === "Weakening" ? "watch" : "neutral",
      text: `Gross margin ${fmtMetric("margin", mar.current)} (${fmtChange("margin", mar.yoy)} vs last year); ${mar.signal === "Weakening" ? "below the twelve-month average, so review costs and discounting" : "within its normal range"}.`,
    },
    {
      tone: "neutral",
      text: `Outlook: ${fmtMetric("revenue", total, true)} expected for ${outlook.months} (${fmtChange("revenue", outlook.vsLastYear)} on last year).`,
    },
  ];

  return { index: i, month: monthName(i), metrics, summary, takeaways, channels, regions, outlook };
}
