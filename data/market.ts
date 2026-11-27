/**
 * SAMPLE DATA. Synthetic monthly indicators generated from a fixed seed.
 * These are illustrative only and are NOT real economic statistics.
 */
import { hashString, seededRandom } from "@/lib/utils";
import { monthLabels } from "@/lib/forecast";

export const REGIONS = ["Metro Vancouver", "British Columbia", "Alberta", "Ontario", "Canada"] as const;
export const SECTORS = ["Retail", "Technology", "Construction", "Hospitality", "Manufacturing"] as const;
export type Region = (typeof REGIONS)[number];
export type Sector = (typeof SECTORS)[number];

export type MetricKey = "activity" | "employment" | "sales" | "costs";

export const METRICS: Record<
  MetricKey,
  { label: string; short: string; unit: "index" | "k$" | "pct"; mode: "multiplicative" | "additive" }
> = {
  activity: { label: "Business activity index", short: "Activity", unit: "index", mode: "multiplicative" },
  employment: { label: "Employment index", short: "Employment", unit: "index", mode: "multiplicative" },
  sales: { label: "Avg. weekly sales per business", short: "Weekly sales", unit: "k$", mode: "multiplicative" },
  costs: { label: "Input cost inflation (YoY)", short: "Cost inflation", unit: "pct", mode: "additive" },
};

export const HISTORY_MONTHS = 36;
export const START = { year: 2023, month: 10 }; // Nov 2023
export const LABELS = monthLabels(START.year, START.month, HISTORY_MONTHS + 12);

const REGION_DRIFT: Record<Region, number> = {
  "Metro Vancouver": 0.0032,
  "British Columbia": 0.0024,
  Alberta: 0.0036,
  Ontario: 0.0016,
  Canada: 0.002,
};

const SECTOR_PROFILE: Record<Sector, { drift: number; season: number; salesBase: number; costBase: number }> = {
  Retail: { drift: 0.0012, season: 0.09, salesBase: 18, costBase: 3.1 },
  Technology: { drift: 0.0042, season: 0.025, salesBase: 42, costBase: 2.2 },
  Construction: { drift: -0.0008, season: 0.07, salesBase: 64, costBase: 4.6 },
  Hospitality: { drift: 0.0022, season: 0.14, salesBase: 12, costBase: 3.8 },
  Manufacturing: { drift: -0.0016, season: 0.035, salesBase: 85, costBase: 3.4 },
};

const cache = new Map<string, Record<MetricKey, number[]>>();

export function getSeries(region: Region, sector: Sector): Record<MetricKey, number[]> {
  const key = `${region}|${sector}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const rand = seededRandom(hashString(key));
  const p = SECTOR_PROFILE[sector];
  const drift = REGION_DRIFT[region] + p.drift + (rand() - 0.5) * 0.002;
  const regionScale = region === "Canada" ? 1 : 0.9 + rand() * 0.25;
  // A mid-series turning point makes each combination tell a slightly different story.
  const bend = (rand() - 0.5) * 0.004;

  const activity: number[] = [];
  const employment: number[] = [];
  const sales: number[] = [];
  const costs: number[] = [];

  let level = 100;
  let emp = 100;
  let cost = p.costBase + (rand() - 0.5);
  for (let t = 0; t < HISTORY_MONTHS; t++) {
    const month = (START.month + t) % 12;
    const season = Math.sin(((month - 3) / 12) * Math.PI * 2) * p.season * 0.6; // peaks in summer
    const d = drift + (t > 18 ? bend : 0);
    level *= 1 + d + (rand() - 0.5) * 0.018;
    emp *= 1 + d * 0.45 + (rand() - 0.5) * 0.004;
    cost += (rand() - 0.55) * 0.28;
    cost = Math.max(0.4, Math.min(7.5, cost));

    activity.push(level * (1 + season));
    employment.push(emp * (1 + season * 0.25));
    sales.push(p.salesBase * regionScale * (level / 100) * (1 + season * 1.1));
    costs.push(cost);
  }

  const out = { activity, employment, sales, costs };
  cache.set(key, out);
  return out;
}
