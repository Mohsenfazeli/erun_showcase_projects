/**
 * SAMPLE DATA. Illustrative scores (0–100) for Metro Vancouver neighbourhoods.
 * Values are invented for demonstration and are NOT survey or census figures.
 */

export const BUSINESS_TYPES = ["Café", "Fitness studio", "Boutique retail", "Family restaurant", "Professional services"] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

type Segment = "youngPros" | "families" | "students" | "affluent";

export interface Neighbourhood {
  name: string;
  area: string;
  lon: number;
  lat: number;
  footTraffic: number;
  /** Relative commercial rent level; higher means more expensive. */
  rent: number;
  /** Indicative retail rent, $/sq ft/year. */
  rentPsf: number;
  segments: Record<Segment, number>;
  /** Existing competitors per business type (higher = more crowded). */
  competition: Record<BusinessType, number>;
}

export const SEGMENT_WEIGHTS: Record<BusinessType, Record<Segment, number>> = {
  "Café": { youngPros: 0.4, students: 0.3, families: 0.1, affluent: 0.2 },
  "Fitness studio": { youngPros: 0.5, students: 0.1, families: 0.1, affluent: 0.3 },
  "Boutique retail": { youngPros: 0.3, students: 0.05, families: 0.15, affluent: 0.5 },
  "Family restaurant": { youngPros: 0.15, students: 0.1, families: 0.5, affluent: 0.25 },
  "Professional services": { youngPros: 0.3, students: 0, families: 0.3, affluent: 0.4 },
};

const n = (
  name: string,
  area: string,
  lon: number,
  lat: number,
  footTraffic: number,
  rent: number,
  rentPsf: number,
  seg: [number, number, number, number],
  comp: [number, number, number, number, number],
): Neighbourhood => ({
  name,
  area,
  lon,
  lat,
  footTraffic,
  rent,
  rentPsf,
  segments: { youngPros: seg[0], families: seg[1], students: seg[2], affluent: seg[3] },
  competition: {
    "Café": comp[0],
    "Fitness studio": comp[1],
    "Boutique retail": comp[2],
    "Family restaurant": comp[3],
    "Professional services": comp[4],
  },
});

export const NEIGHBOURHOODS: Neighbourhood[] = [
  n("Gastown", "Vancouver", -123.108, 49.284, 92, 88, 68, [85, 20, 45, 60], [90, 55, 80, 50, 70]),
  n("Yaletown", "Vancouver", -123.121, 49.275, 84, 95, 74, [92, 35, 30, 85], [80, 85, 70, 55, 75]),
  n("Kitsilano", "Vancouver", -123.162, 49.268, 80, 82, 62, [80, 55, 55, 75], [75, 80, 60, 60, 50]),
  n("Mount Pleasant", "Vancouver", -123.1, 49.263, 78, 70, 52, [88, 40, 60, 50], [85, 60, 55, 50, 40]),
  n("Commercial Drive", "Vancouver", -123.069, 49.27, 75, 58, 44, [70, 50, 70, 35], [60, 45, 50, 65, 30]),
  n("Main Street", "Vancouver", -123.101, 49.24, 62, 60, 46, [65, 70, 40, 50], [55, 40, 45, 45, 35]),
  n("Kerrisdale", "Vancouver", -123.157, 49.234, 55, 74, 55, [35, 75, 25, 92], [40, 45, 55, 40, 60]),
  n("Lonsdale", "North Vancouver", -123.077, 49.315, 66, 62, 48, [60, 70, 30, 65], [50, 50, 45, 50, 45]),
  n("Brentwood", "Burnaby", -123.001, 49.266, 70, 56, 45, [75, 55, 50, 45], [45, 40, 50, 55, 35]),
  n("Metrotown", "Burnaby", -123.004, 49.226, 88, 66, 52, [65, 65, 65, 45], [75, 55, 85, 80, 50]),
  n("New Westminster", "New Westminster", -122.911, 49.205, 58, 46, 36, [55, 65, 45, 40], [40, 35, 35, 45, 40]),
  n("Richmond Centre", "Richmond", -123.137, 49.167, 76, 60, 47, [55, 75, 50, 60], [70, 50, 75, 75, 55]),
  n("Surrey Central", "Surrey", -122.849, 49.188, 64, 40, 32, [45, 72, 55, 35], [55, 30, 35, 50, 35]),
];
