/**
 * SAMPLE DATA. Synthetic monthly sales series for the forecasting demo.
 * Generated from a fixed seed; not real company data.
 */
import { seededRandom } from "@/lib/utils";

export interface SalesDataset {
  id: string;
  name: string;
  unit: string;
  startYear: number;
  /** 0 = January */
  startMonth: number;
  values: number[];
}

function generate(seed: number, base: number, growth: number, seasonShape: number[], noise: number) {
  const rand = seededRandom(seed);
  return Array.from({ length: 36 }, (_, t) => {
    const month = (10 + t) % 12; // series starts in November
    const trend = base * (1 + growth) ** (t / 12);
    const v = trend * seasonShape[month] * (1 + (rand() - 0.5) * noise);
    return Math.round(v);
  });
}

export const SALES_DATASETS: SalesDataset[] = [
  {
    id: "outdoor",
    name: "Outdoor gear retailer (units)",
    unit: "units",
    startYear: 2023,
    startMonth: 10,
    values: generate(11, 4200, 0.08, [0.78, 0.74, 0.86, 0.98, 1.1, 1.24, 1.32, 1.22, 0.98, 0.88, 0.9, 1.0], 0.08),
  },
  {
    id: "coffee",
    name: "Coffee roaster, wholesale (kg)",
    unit: "kg",
    startYear: 2023,
    startMonth: 10,
    values: generate(23, 2600, 0.14, [1.08, 1.02, 1.04, 0.98, 0.94, 0.9, 0.86, 0.88, 1.0, 1.06, 1.1, 1.14], 0.06),
  },
  {
    id: "services",
    name: "Home services bookings (jobs)",
    unit: "jobs",
    startYear: 2023,
    startMonth: 10,
    values: generate(37, 640, 0.05, [0.82, 0.8, 0.96, 1.12, 1.18, 1.16, 1.08, 1.06, 1.04, 1.02, 0.94, 0.82], 0.1),
  },
];

export const SAMPLE_CSV = [
  "month,sales",
  ...SALES_DATASETS[0].values.map((v, i) => {
    const m = (10 + i) % 12;
    const y = 2023 + Math.floor((10 + i) / 12);
    return `${y}-${String(m + 1).padStart(2, "0")},${v}`;
  }),
].join("\n");
