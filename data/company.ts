/**
 * SAMPLE DATA for a fictional company, "Northwind Coastal Supply", an outdoor gear
 * retailer in BC and Alberta. Monthly sales by region and channel, Nov 2021 to Oct 2026,
 * generated from a fixed seed. Illustrative only; not real figures.
 */
import { seededRandom } from "@/lib/utils";

export const COMPANY = {
  name: "Northwind Coastal Supply",
  description: "Outdoor gear retailer · BC & Alberta",
  note: "Fictional company. All figures are sample data.",
};

export const REGIONS = ["Vancouver", "Victoria", "Kelowna", "Calgary"] as const;
export const CHANNELS = ["Online", "Retail stores", "Wholesale"] as const;
export type Region = (typeof REGIONS)[number];
export type Channel = (typeof CHANNELS)[number];

/** First month in the series (0 = January). */
export const START = { year: 2021, month: 10 };
export const N_MONTHS = 60;

export interface SalesRow {
  t: number;
  region: Region;
  channel: Channel;
  revenue: number;
  orders: number;
  cost: number;
}

const SEASON_CONSUMER = [0.8, 0.76, 0.88, 0.96, 1.05, 1.16, 1.22, 1.15, 0.98, 0.92, 1.02, 1.24];
const SEASON_WHOLESALE = [1.12, 1.18, 1.16, 1.02, 0.92, 0.84, 0.8, 0.86, 1.04, 1.1, 0.98, 0.88];

const CHANNEL_PROFILE: Record<Channel, { base: number; growth: number; margin: number; aov: number; season: number[] }> = {
  Online: { base: 70_000, growth: 0.17, margin: 0.53, aov: 112, season: SEASON_CONSUMER },
  "Retail stores": { base: 115_000, growth: 0.045, margin: 0.47, aov: 84, season: SEASON_CONSUMER },
  Wholesale: { base: 62_000, growth: 0.07, margin: 0.32, aov: 1380, season: SEASON_WHOLESALE },
};

const REGION_PROFILE: Record<Region, { share: number; growth: number }> = {
  Vancouver: { share: 0.44, growth: 0 },
  Victoria: { share: 0.18, growth: -0.015 },
  Kelowna: { share: 0.14, growth: 0.04 },
  Calgary: { share: 0.24, growth: 0.015 },
};

function generate(): SalesRow[] {
  const rand = seededRandom(20261031);
  const rows: SalesRow[] = [];
  for (let t = 0; t < N_MONTHS; t++) {
    const month = (START.month + t) % 12;
    for (const region of REGIONS) {
      for (const channel of CHANNELS) {
        const c = CHANNEL_PROFILE[channel];
        const r = REGION_PROFILE[region];
        let factor = 1;
        // A soft patch for stores in the first half of 2023.
        if (channel === "Retail stores" && t >= 14 && t <= 19) factor *= 0.95;
        // Recent shift: online accelerating, wholesale softening (last four months).
        if (t >= 56) {
          if (channel === "Online") factor *= 1 + 0.05 * (t - 55);
          if (channel === "Wholesale") factor *= 1 - 0.035 * (t - 55);
        }
        const revenue =
          c.base * r.share * (1 + c.growth + r.growth) ** (t / 12) * c.season[month] * factor * (1 + (rand() - 0.5) * 0.08);
        const aov = c.aov * 1.025 ** (t / 12) * (1 + (rand() - 0.5) * 0.05);
        // Margin pressure in recent months.
        const marginShift = t >= 55 ? -Math.min(0.02, 0.0045 * (t - 54)) : 0;
        const margin = c.margin + marginShift + (rand() - 0.5) * 0.012;
        rows.push({
          t,
          region,
          channel,
          revenue: Math.round(revenue),
          orders: Math.max(1, Math.round(revenue / aov)),
          cost: Math.round(revenue * (1 - margin)),
        });
      }
    }
  }
  return rows;
}

export const SALES: SalesRow[] = generate();
