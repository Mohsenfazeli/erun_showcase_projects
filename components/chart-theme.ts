export const COLORS = {
  brand: "#3268D9",
  navy: "#14253D",
  band: "#3268D9",
  slate: "#94A3B8",
  grid: "#E2E8F0",
  teal: "#0F9F94",
  amber: "#E39B2B",
  rose: "#D9485F",
  series: ["#3268D9", "#14253D", "#0F9F94", "#E39B2B", "#8B5CF6", "#94A3B8"],
};

export const axisProps = {
  tick: { fontSize: 11, fill: "#64748B" },
  tickLine: false,
  axisLine: false,
} as const;

export const tooltipStyle = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid #E2E8F0",
    boxShadow: "0 8px 24px rgba(20,37,61,0.08)",
    fontSize: 12,
    padding: "8px 10px",
  },
  labelStyle: { color: "#14253D", fontWeight: 600, marginBottom: 4 },
} as const;
