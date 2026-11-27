import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site-chrome";
import { AIVisual, AnalyticsVisual, WorkflowVisual } from "@/components/service-visuals";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/products";

const VISUALS = {
  analytics: <AnalyticsVisual label="DASHBOARD / LIVE" />,
  reports: <WorkflowVisual label="REPORT / AUTOMATED" />,
  assistant: <AIVisual label="ASSISTANT / GROUNDED" />,
} as const;

const HOW = [
  { title: "Real products, not slides", text: "Each one is a working tool you can use right now, built the way we build for clients." },
  { title: "One fictional company", text: "All three run on sample data for Northwind Coastal Supply, an outdoor gear retailer." },
  { title: "Your data next", text: "In a real project, we connect the same approach to your own systems and documents." },
];

export default function LabHome() {
  return (
    <PageShell>
      <section className="page-intro animate-fade-up">
        <div className="eyebrow">
          <span className="small-rule" /> Erun Lab
        </div>
        <h1>
          See It Working<span className="text-primary">.</span>
        </h1>
        <p>
          Three working products, one for each thing we do: data analytics, automation and AI implementation. Open one, try it, and picture it
          running on your own numbers.
        </p>
        <Button variant="editorial" size="bare" asChild>
          <a href="#products">
            Explore the products <ArrowDown />
          </a>
        </Button>
      </section>

      <section id="products" className="scroll-mt-28 border-t border-line pt-14 pb-24" aria-labelledby="products-title">
        <div className="eyebrow">01 / The products</div>
        <h2 id="products-title" className="mt-6 text-[46px] font-[550] leading-[1.2] max-md:text-[32px]">
          Try Them Yourself<span className="text-primary">.</span>
        </h2>
        <div className="expertise-grid">
          {PRODUCTS.map((p) => (
            <article className="expertise-item" key={p.slug}>
              <Link href={`/${p.slug}`} className="expertise-link">
                {VISUALS[p.slug as keyof typeof VISUALS]}
                <div className="service-heading">
                  <span className="service-index">{p.number}</span>
                  <h3>{p.name}</h3>
                  <ArrowUpRight size={20} />
                </div>
                <p>
                  <span className="font-semibold text-ink">{p.pillar}.</span> {p.short}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="service-block" aria-labelledby="how-title">
        <div className="service-block-label">
          <span className="eyebrow">About the Lab</span>
          <h2 id="how-title">How it works</h2>
        </div>
        <ol className="capability-list">
          {HOW.map((item, i) => (
            <li key={item.title}>
              <span className="service-index">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
