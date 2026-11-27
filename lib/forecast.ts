/**
 * Lightweight trend + seasonality forecasting used by the analytics demos.
 * Linear trend fitted by least squares, monthly seasonal indices, and a
 * prediction band that widens with the forecast horizon.
 */

export interface ForecastResult {
  /** Fitted trend+season for each historical point. */
  fitted: number[];
  /** Point forecasts for each step of the horizon. */
  forecast: number[];
  lower: number[];
  upper: number[];
  /** Seasonal component by position in cycle (index or additive offset). */
  seasonal: number[];
  residualStd: number;
  slope: number;
}

export function linearFit(y: number[]) {
  const n = y.length;
  const xMean = (n - 1) / 2;
  const yMean = y.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (y[i] - yMean);
    den += (i - xMean) ** 2;
  }
  const b = den === 0 ? 0 : num / den;
  return { a: yMean - b * xMean, b };
}

export function forecastSeries(
  y: number[],
  horizon: number,
  {
    period = 12,
    mode = "multiplicative",
    z = 1.28,
    startOffset = 0,
  }: {
    period?: number;
    mode?: "multiplicative" | "additive";
    /** z-score for the band (1.28 ≈ 80%, 1.96 ≈ 95%). */
    z?: number;
    /** Position in the seasonal cycle of y[0] (e.g. calendar month index). */
    startOffset?: number;
  } = {},
): ForecastResult {
  const n = y.length;
  const { a, b } = linearFit(y);
  const trend = (t: number) => a + b * t;

  const sums = new Array(period).fill(0);
  const counts = new Array(period).fill(0);
  for (let t = 0; t < n; t++) {
    const k = (t + startOffset) % period;
    const tr = trend(t);
    sums[k] += mode === "multiplicative" ? (tr === 0 ? 1 : y[t] / tr) : y[t] - tr;
    counts[k]++;
  }
  let seasonal = sums.map((s, k) => (counts[k] ? s / counts[k] : mode === "multiplicative" ? 1 : 0));
  // Normalise so seasonality averages to 1 (or 0).
  const mean = seasonal.reduce((s, v) => s + v, 0) / period;
  seasonal = seasonal.map((v) => (mode === "multiplicative" ? v / (mean || 1) : v - mean));

  const apply = (t: number) => {
    const k = (t + startOffset) % period;
    return mode === "multiplicative" ? trend(t) * seasonal[k] : trend(t) + seasonal[k];
  };

  const fitted = y.map((_, t) => apply(t));
  const resid = y.map((v, t) => v - fitted[t]);
  const residualStd = Math.sqrt(resid.reduce((s, r) => s + r * r, 0) / Math.max(1, n - 2));

  const forecast: number[] = [];
  const lower: number[] = [];
  const upper: number[] = [];
  for (let h = 1; h <= horizon; h++) {
    const f = apply(n - 1 + h);
    const width = z * residualStd * Math.sqrt(h);
    forecast.push(f);
    lower.push(f - width);
    upper.push(f + width);
  }

  return { fitted, forecast, lower, upper, seasonal, residualStd, slope: b };
}

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Build "Mon YY" labels starting at a given year and month index. */
export function monthLabels(startYear: number, startMonth: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const m = (startMonth + i) % 12;
    const y = startYear + Math.floor((startMonth + i) / 12);
    return `${MONTHS[m]} ${String(y).slice(2)}`;
  });
}
