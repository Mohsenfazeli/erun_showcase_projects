import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  deltaLabel,
  invert = false,
  className,
  sub,
}: {
  label: string;
  value: string;
  /** Percent change. Positive is good unless `invert`. */
  delta?: number;
  deltaLabel?: string;
  invert?: boolean;
  className?: string;
  sub?: string;
}) {
  const good = delta === undefined ? null : invert ? delta < 0 : delta > 0;
  const flat = delta !== undefined && Math.abs(delta) < 0.05;
  const Icon = flat ? Minus : delta !== undefined && delta > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <div className={cn("rounded-xl border border-border bg-white p-4", className)}>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums text-navy">{value}</p>
      {delta !== undefined && (
        <p
          className={cn(
            "mt-1 inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
            flat ? "text-slate-500" : good ? "text-emerald-600" : "text-rose-600",
          )}
        >
          <Icon className="size-3.5" />
          {delta > 0 ? "+" : ""}
          {delta.toFixed(1)}% <span className="font-normal text-muted">{deltaLabel}</span>
        </p>
      )}
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}
