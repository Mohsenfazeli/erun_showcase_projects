import { getProduct } from "@/lib/products";
import { cn } from "@/lib/utils";

/** Page header: editorial eyebrow, title, and a three-part use-case strip. */
export function ProductHeader({ slug, children }: { slug: string; children?: React.ReactNode }) {
  const p = getProduct(slug);
  const uses = [
    { label: "The problem", text: p.problem },
    { label: "What it does", text: p.solution },
    { label: "Business value", text: p.value },
  ];
  return (
    <header className="no-print mb-8 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="eyebrow">
            {p.number} / {p.pillar}
          </p>
          <h1 className="mt-3 text-[30px] font-bold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[36px]">
            {p.name}
            <span className="text-brand">.</span>
          </h1>
          <p className="mt-2 text-[15px] text-ink-2">{p.tagline}</p>
        </div>
        {children}
      </div>
      <dl className="mt-6 grid overflow-hidden rounded-lg border border-line bg-surface sm:grid-cols-3">
        {uses.map((u, i) => (
          <div key={u.label} className={cn("px-5 py-4", i > 0 && "border-t border-line sm:border-t-0 sm:border-l")}>
            <dt className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">{u.label}</dt>
            <dd className="mt-1.5 text-[13px] leading-relaxed text-ink">{u.text}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

export function SampleTag({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-[4px] border border-line bg-surface px-2 py-1 text-[11px] font-medium text-ink-2", className)}>
      <span className="size-1.5 rounded-full bg-ink-3" /> Sample data
    </span>
  );
}
