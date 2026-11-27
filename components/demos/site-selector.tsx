"use client";

import { useMemo, useState } from "react";
import { MapPin, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Select, SliderField } from "@/components/ui/form";
import { SampleNote } from "@/components/demo-header";
import { BUSINESS_TYPES, NEIGHBOURHOODS, SEGMENT_WEIGHTS, type BusinessType, type Neighbourhood } from "@/data/neighbourhoods";
import { cn } from "@/lib/utils";

type FactorKey = "foot" | "competition" | "demo" | "rent";

const FACTORS: { key: FactorKey; label: string; color: string; hint: string }[] = [
  { key: "foot", label: "Foot traffic", color: "#3268D9", hint: "More passers-by" },
  { key: "competition", label: "Low competition", color: "#0F9F94", hint: "Fewer similar businesses" },
  { key: "demo", label: "Customer fit", color: "#14253D", hint: "Local demographics match your customers" },
  { key: "rent", label: "Affordable rent", color: "#E39B2B", hint: "Lower commercial rents" },
];

// Schematic (not to scale) positions on a 560x380 canvas, roughly following geography.
const MAP_W = 560;
const MAP_H = 380;
const POS: Record<string, { x: number; y: number }> = {
  Lonsdale: { x: 250, y: 52 },
  Gastown: { x: 232, y: 122 },
  Yaletown: { x: 160, y: 146 },
  Kitsilano: { x: 70, y: 180 },
  "Mount Pleasant": { x: 250, y: 196 },
  "Commercial Drive": { x: 335, y: 160 },
  Brentwood: { x: 440, y: 120 },
  "Main Street": { x: 250, y: 270 },
  Kerrisdale: { x: 110, y: 262 },
  Metrotown: { x: 385, y: 228 },
  "New Westminster": { x: 470, y: 262 },
  "Richmond Centre": { x: 160, y: 322 },
  "Surrey Central": { x: 505, y: 326 },
};

function subscores(nb: Neighbourhood, type: BusinessType): Record<FactorKey, number> {
  const w = SEGMENT_WEIGHTS[type];
  const demo =
    (nb.segments.youngPros * w.youngPros + nb.segments.families * w.families + nb.segments.students * w.students + nb.segments.affluent * w.affluent) /
    (w.youngPros + w.families + w.students + w.affluent);
  return { foot: nb.footTraffic, competition: 100 - nb.competition[type], demo, rent: 100 - nb.rent };
}

export function SiteSelector() {
  const [type, setType] = useState<BusinessType>("Café");
  const [weights, setWeights] = useState<Record<FactorKey, number>>({ foot: 35, competition: 25, demo: 25, rent: 15 });
  const [selected, setSelected] = useState<string | null>(null);

  const ranked = useMemo(() => {
    const total = Object.values(weights).reduce((s, v) => s + v, 0) || 1;
    return NEIGHBOURHOODS.map((nb) => {
      const s = subscores(nb, type);
      const parts = FACTORS.map((f) => ({ ...f, value: (s[f.key] * weights[f.key]) / total }));
      return { nb, sub: s, parts, score: parts.reduce((acc, p) => acc + p.value, 0) };
    }).sort((a, b) => b.score - a.score);
  }, [type, weights]);

  const active = ranked.find((r) => r.nb.name === selected) ?? ranked[0];
  const maxScore = ranked[0].score;
  const minScore = ranked[ranked.length - 1].score;

  return (
    <div className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>What are you opening?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="btype">Business type</Label>
              <Select id="btype" value={type} onChange={(e) => setType(e.target.value as BusinessType)}>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </div>
            <div className="border-t border-border pt-4 space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">How much does each factor matter?</p>
              {FACTORS.map((f) => (
                <SliderField
                  key={f.key}
                  label={f.label}
                  value={weights[f.key]}
                  onChange={(v) => setWeights((w) => ({ ...w, [f.key]: v }))}
                  min={0}
                  max={50}
                  hint={f.hint}
                  format={(v) => {
                    const total = Object.values(weights).reduce((s, x) => s + x, 0) || 1;
                    return `${Math.round((v / total) * 100)}%`;
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schematic map (not to scale)</CardTitle>
              <CardDescription>Bubble size and colour show the overall score. Click a location for details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-border bg-gradient-to-br from-sky-50 to-slate-50">
                <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-auto w-full" role="img" aria-label="Schematic map of ranked neighbourhoods">
                  <defs>
                    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#E2E8F0" strokeWidth="0.6" />
                    </pattern>
                  </defs>
                  <rect width={MAP_W} height={MAP_H} fill="url(#grid)" />
                  <text x={345} y={78} className="fill-sky-400 text-[11px] italic">Burrard Inlet</text>
                  <text x={30} y={112} className="fill-sky-400 text-[11px] italic">English Bay</text>
                  <text x={300} y={318} className="fill-sky-400 text-[11px] italic">Fraser River</text>
                  {[...ranked].reverse().map((r) => {
                    const { x, y } = POS[r.nb.name];
                    const t = maxScore === minScore ? 1 : (r.score - minScore) / (maxScore - minScore);
                    const radius = 9 + t * 17;
                    const rank = ranked.indexOf(r) + 1;
                    const isActive = active.nb.name === r.nb.name;
                    return (
                      <g
                        key={r.nb.name}
                        onClick={() => setSelected(r.nb.name)}
                        className="cursor-pointer"
                        role="button"
                        aria-label={`${r.nb.name}, rank ${rank}`}
                      >
                        <circle
                          cx={x}
                          cy={y}
                          r={radius}
                          fill="#3268D9"
                          fillOpacity={0.18 + t * 0.62}
                          stroke={isActive ? "#14253D" : "#fff"}
                          strokeWidth={isActive ? 2.5 : 1.5}
                          style={{ transition: "r 0.4s ease, fill-opacity 0.4s ease" }}
                        />
                        <text x={x} y={y + 3.5} textAnchor="middle" className={cn("text-[10px] font-semibold", t > 0.45 ? "fill-white" : "fill-navy")}>
                          {rank}
                        </text>
                        <text x={x} y={y + radius + 12} textAnchor="middle" className="fill-slate-600 text-[9.5px] font-medium">
                          {r.nb.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="border-brand/30">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-[auto_1fr]">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-white">
                {ranked[0].nb.name === active.nb.name ? <Trophy className="size-5" /> : <MapPin className="size-5" />}
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                  #{ranked.indexOf(active) + 1} for a {type.toLowerCase()}
                </p>
                <h3 className="font-semibold text-navy">
                  {active.nb.name} <span className="font-normal text-muted">· {active.nb.area}</span>
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {FACTORS.map((f) => (
                    <div key={f.key}>
                      <p className="text-[11px] text-muted">{f.label}</p>
                      <p className="text-lg font-semibold tabular-nums text-navy">{Math.round(active.sub[f.key])}<span className="text-xs font-normal text-muted">/100</span></p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted">Indicative retail rent: ~${active.nb.rentPsf}/sq ft/yr (sample figure)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Ranking</CardTitle>
            <CardDescription>Bars show how much each factor contributes to the overall score.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-3 pt-2 text-[11px] text-muted sm:pt-0">
            {FACTORS.map((f) => (
              <span key={f.key} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm" style={{ background: f.color }} /> {f.label}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-1">
            {ranked.map((r, i) => (
              <li key={r.nb.name}>
                <button
                  onClick={() => setSelected(r.nb.name)}
                  className={cn(
                    "grid w-full grid-cols-[24px_1fr_44px] items-center gap-3 rounded-lg px-2 py-2 text-left transition sm:grid-cols-[24px_170px_1fr_44px] cursor-pointer",
                    active.nb.name === r.nb.name ? "bg-brand-soft/70" : "hover:bg-slate-50",
                  )}
                >
                  <span className="text-xs font-semibold tabular-nums text-muted">{i + 1}</span>
                  <span className="truncate text-sm font-medium text-navy">
                    {r.nb.name}
                    <span className="block text-[11px] font-normal text-muted">{r.nb.area}</span>
                  </span>
                  <span className="col-span-3 col-start-2 row-start-2 flex h-2.5 overflow-hidden rounded-full bg-slate-100 sm:col-span-1 sm:col-start-3 sm:row-start-1">
                    {r.parts.map((p) => (
                      <span key={p.key} style={{ width: `${p.value}%`, background: p.color, transition: "width 0.4s ease" }} />
                    ))}
                  </span>
                  <span className="col-start-3 row-start-1 text-right text-sm font-semibold tabular-nums text-navy sm:col-start-4">{Math.round(r.score)}</span>
                </button>
              </li>
            ))}
          </ol>
          <SampleNote>Sample scores for demonstration only. A real study would use census, foot-traffic and lease data.</SampleNote>
        </CardContent>
      </Card>
    </div>
  );
}
