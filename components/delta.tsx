import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Change indicator. `good` decides colour (defaults to positive = good). */
export function Delta({ value, text, good, className }: { value: number; text: string; good?: boolean; className?: string }) {
  const isGood = good ?? value >= 0;
  const flat = Math.abs(value) < 0.05;
  const Icon = value >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[4px] px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
        flat ? "bg-canvas text-ink-2" : isGood ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700",
        className,
      )}
    >
      {!flat && <Icon className="size-3" />}
      {text}
    </span>
  );
}
