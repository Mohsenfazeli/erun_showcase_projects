import { Database, Sparkles } from "lucide-react";
import { getDemo } from "@/lib/demos";
import { Badge } from "@/components/ui/badge";

export function DemoHeader({ slug }: { slug: string }) {
  const demo = getDemo(slug);
  if (!demo) return null;
  const Icon = demo.icon;
  return (
    <header className="mb-6 animate-fade-up">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-brand">
        {demo.pillar}
      </div>
      <div className="mt-2 flex items-start gap-3">
        <span className="mt-0.5 hidden size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand sm:flex">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-navy sm:text-[28px]">{demo.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">{demo.problem}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="neutral">
              <Database className="size-3" /> Sample data
            </Badge>
            {demo.ai && (
              <Badge>
                <Sparkles className="size-3" /> Powered by Gemini
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/** Small footnote used under charts and tables. */
export function SampleNote({ children }: { children?: React.ReactNode }) {
  return (
    <p className="mt-3 text-[11px] text-muted">
      {children ?? "Sample data for demonstration only. Figures are illustrative, not real statistics."}
    </p>
  );
}
