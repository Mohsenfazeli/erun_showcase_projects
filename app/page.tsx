import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { DEMOS, PILLARS } from "@/lib/demos";

const PILLAR_COPY: Record<string, string> = {
  "Data Analytics": "Turn raw numbers into decisions: dashboards, forecasts and location analysis.",
  "Process Automation": "Remove repetitive manual work from finance, reporting and operations.",
  "AI Implementation": "Practical, guard-railed AI assistants grounded in your own content.",
};

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl bg-navy px-6 py-10 text-white sm:px-10 sm:py-14 animate-fade-up">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 right-32 size-72 rounded-full bg-brand/20 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-soft/80">Erun Lab</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            See what data, automation and AI can do for your business.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
            Nine small, hands-on demos built by Erun Consulting Group. Each one tackles a common business
            problem. Try them with the built-in sample data, then imagine them running on yours.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/market-pulse"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-sm font-medium text-white shadow-lg shadow-brand/30 transition hover:bg-brand-600"
            >
              Start exploring <ArrowRight className="size-4" />
            </Link>
            <a
              href="https://www.erungroup.ca"
              className="inline-flex h-10 items-center rounded-lg border border-white/20 px-5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              About Erun
            </a>
          </div>
        </div>
      </section>

      {PILLARS.map((pillar, pi) => (
        <section key={pillar} className="mt-10 animate-fade-up" style={{ animationDelay: `${120 + pi * 80}ms` }}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-navy">{pillar}</h2>
            <p className="text-sm text-muted">{PILLAR_COPY[pillar]}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {DEMOS.filter((d) => d.pillar === pillar).map((demo) => {
              const Icon = demo.icon;
              return (
                <Link
                  key={demo.slug}
                  href={`/${demo.slug}`}
                  className="group flex flex-col rounded-xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-navy/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white">
                      <Icon className="size-5" />
                    </span>
                    {demo.ai && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-medium text-brand">
                        <Sparkles className="size-3" /> AI
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-semibold text-navy">{demo.title}</h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">{demo.problem}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                    Try it <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <p className="mt-12 border-t border-border pt-6 text-xs text-muted">
        All demos use built-in sample data for illustration. No figures shown here are real statistics.
      </p>
    </div>
  );
}
