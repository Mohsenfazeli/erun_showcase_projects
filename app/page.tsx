import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-chrome";
import { AIVisual, AnalyticsVisual, WorkflowVisual } from "@/components/service-visuals";
import { PRODUCTS } from "@/lib/products";

const VISUALS = {
  analytics: <AnalyticsVisual label="DASHBOARD / LIVE" />,
  reports: <WorkflowVisual label="REPORT / AUTOMATED" />,
  assistant: <AIVisual label="ASSISTANT / GROUNDED" />,
} as const;

/** The Lab is a single screen, like the website's hero: a headline and three ways in. */
export default function LabHome() {
  return (
    <div className="erun-site">
      <SiteHeader />
      <main>
        <section className="lab-hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="lab-hero-text animate-fade-up">
            <div className="eyebrow">
              <span className="small-rule" /> Erun Lab
            </div>
            <h1>
              See It <span className="clarity-word">Working</span>
              <span className="headline-period">.</span>
            </h1>
            <p>Three working prototypes, one for each thing we do. Choose one to try it.</p>
          </div>

          <nav className="lab-products" aria-label="Lab prototypes">
            {PRODUCTS.map((p, i) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="lab-product animate-fade-up"
                style={{ animationDelay: `${150 + i * 100}ms` }}
              >
                {VISUALS[p.slug as keyof typeof VISUALS]}
                <span className="lab-product-heading">
                  <span className="service-index">{p.number}</span>
                  <span className="lab-product-name">{p.name}</span>
                  <ArrowUpRight size={20} />
                </span>
                <span className="lab-product-copy">
                  <span className="lab-product-pillar">{p.pillar}.</span> {p.short}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hero-bottom">
            <span className="hero-bottom-note">
              <span className="live-dot" /> Live prototypes · sample data for a fictional company
            </span>
            <span className="hero-bottom-note lab-hide-mobile">Analytical thinking. Practical progress.</span>
            <span className="section-counter">
              03 <span>prototypes</span>
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
