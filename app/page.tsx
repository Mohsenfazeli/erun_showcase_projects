import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { ErunMark } from "@/components/brand";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden rounded-xl border border-line bg-surface animate-fade-up">
        <div aria-hidden className="grid-bg absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
        <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-14 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-xl">
            <p className="eyebrow">Erun Lab</p>
            <h1 className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[46px]">
              See the work, not just the pitch<span className="text-brand">.</span>
            </h1>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2">
              Three working products, one for each thing we do: data analytics, process automation and AI implementation. They all run on
              sample data for a fictional retailer, Northwind Coastal Supply, so you can see what each one would do with your own numbers.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/analytics"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Start with the dashboard <ArrowRight className="size-4" />
              </Link>
              <a
                href="https://www.erungroup.ca"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-line bg-surface px-5 text-[13px] font-semibold text-ink transition-colors hover:border-ink-3"
              >
                About Erun <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
          <div className="hidden justify-center md:flex">
            <ErunMark size={180} className="drop-shadow-[0_24px_40px_rgba(47,105,218,0.25)]" />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
          <h2 className="text-[18px] font-bold tracking-tight text-ink">The products</h2>
          <p className="text-xs text-ink-3">03 products · sample data</p>
        </div>
        <ol className="divide-y divide-line">
          {PRODUCTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <li key={p.slug} className="animate-fade-up" style={{ animationDelay: `${120 + i * 90}ms` }}>
                <Link
                  href={`/${p.slug}`}
                  className="group grid gap-4 py-7 sm:grid-cols-[72px_1fr_auto] sm:items-center"
                >
                  <span className="text-[13px] font-bold tabular-nums text-ink-3 transition-colors group-hover:text-brand">{p.number}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">{p.pillar}</p>
                    <h3 className="mt-1.5 flex items-center gap-2.5 text-[22px] font-bold tracking-[-0.02em] text-ink">
                      <Icon className="size-5 text-ink-3 transition-colors group-hover:text-brand" />
                      {p.name}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-ink-2">{p.tagline} {p.value}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink transition-colors group-hover:text-brand">
                    Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[11.5px] text-ink-3">
        <span>Data Analytics · Automation · AI Implementation</span>
        <span>All figures are sample data for a fictional company. © {new Date().getFullYear()} Erun Group</span>
      </footer>
    </div>
  );
}
