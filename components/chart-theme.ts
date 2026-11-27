export const C = {
  brand: "#2F69DA",
  brandDark: "#2455B8",
  brandLight: "#EAF1FC",
  sky: "#8FB0EC",
  ink: "#1E2A44",
  ink2: "#74819A",
  ink3: "#94A3B8",
  line: "#E2E8F0",
  soft: "#CBD5E1",
  up: "#0F8A5F",
  down: "#C2410C",
};

/** Categorical palette: brand first, then navy, light blue and grey. */
export const SERIES = [C.brand, C.ink, C.sky, C.soft];

export const axis = {
  tick: { fontSize: 11, fill: C.ink3, fontFamily: "inherit" },
  tickLine: false,
  axisLine: false,
} as const;

export const tooltip = {
  contentStyle: {
    borderRadius: 6,
    border: `1px solid ${C.line}`,
    boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
    fontSize: 12,
    padding: "8px 10px",
    fontFamily: "inherit",
  },
  labelStyle: { color: C.ink, fontWeight: 700, marginBottom: 4 },
  itemStyle: { color: C.ink2, padding: 0 },
} as const;
