/**
 * SAMPLE DATA. Synthetic sales transactions for a fictional company
 * ("Northwind Coastal Supply"). Generated from a fixed seed; not real data.
 */
import { seededRandom } from "@/lib/utils";

export interface Txn {
  date: string; // YYYY-MM-DD
  orderId: string;
  region: string;
  product: string;
  channel: "Online" | "Retail" | "Wholesale";
  units: number;
  revenue: number;
  cost: number;
}

export const COMPANY = "Northwind Coastal Supply (fictional)";
export const REGIONS = ["Vancouver", "Victoria", "Kelowna", "Calgary"];
const PRODUCTS: { name: string; price: number; margin: number }[] = [
  { name: "Rain shell jacket", price: 189, margin: 0.46 },
  { name: "Trail pack 28L", price: 129, margin: 0.42 },
  { name: "Insulated bottle", price: 34, margin: 0.58 },
  { name: "Merino base layer", price: 89, margin: 0.5 },
  { name: "Camp stove kit", price: 149, margin: 0.36 },
  { name: "Headlamp", price: 49, margin: 0.55 },
];
const CHANNELS: Txn["channel"][] = ["Online", "Retail", "Wholesale"];

function generateMonth(year: number, month: number, count: number, seed: number, lift: number): Txn[] {
  const rand = seededRandom(seed);
  const days = new Date(year, month + 1, 0).getDate();
  const out: Txn[] = [];
  for (let i = 0; i < count; i++) {
    const day = 1 + Math.floor(rand() * days);
    const p = PRODUCTS[Math.floor(rand() ** 1.3 * PRODUCTS.length)];
    const c = rand();
    const channel = c < 0.5 ? CHANNELS[0] : c < 0.86 ? CHANNELS[1] : CHANNELS[2];
    const region = REGIONS[Math.floor(rand() ** 1.2 * REGIONS.length)];
    const units = channel === "Wholesale" ? 6 + Math.floor(rand() * 10) : 1 + Math.floor(rand() * 3);
    const discount = channel === "Wholesale" ? 0.78 : 1 - rand() * 0.1;
    const revenue = Math.round(units * p.price * discount * lift * 100) / 100;
    const cost = Math.round(units * p.price * (1 - p.margin) * 100) / 100;
    out.push({
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      orderId: `NW-${year % 100}${String(month + 1).padStart(2, "0")}-${String(1000 + i * 7 + Math.floor(rand() * 7))}`,
      region,
      product: p.name,
      channel,
      units,
      revenue,
      cost,
    });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export const CURRENT_MONTH = { label: "October 2026", data: generateMonth(2026, 9, 186, 2026_10, 1.03) };
export const PREVIOUS_MONTH = { label: "September 2026", data: generateMonth(2026, 8, 178, 2026_09, 1) };
