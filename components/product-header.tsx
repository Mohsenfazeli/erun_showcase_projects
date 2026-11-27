import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProduct, PRODUCTS } from "@/lib/products";

/** Page intro above a live product, in the website's inner-page style. */
export function LabIntro({ slug }: { slug: string }) {
  const p = getProduct(slug);
  return (
    <section className="lab-intro no-print animate-fade-up">
      <div>
        <div className="eyebrow">
          <span className="small-rule" /> Lab / {p.number} {p.pillar}
        </div>
        <h1>
          {p.name}
          <span className="text-primary">.</span>
        </h1>
        <p>{p.tagline}</p>
      </div>
      <div className="lab-intro-meta">
        <span className="inline-flex items-center gap-2">
          <span className="live-dot" /> Live demo
        </span>
        <span>Sample data · fictional company</span>
      </div>
    </section>
  );
}

/** Bar that frames the interactive product. */
export function StageBar({ left, right }: { left: string; right?: string }) {
  return (
    <div className="lab-stage-bar no-print">
      <span>
        <span className="live-dot" /> {left}
      </span>
      {right && <span>{right}</span>}
    </div>
  );
}

/** "The use case" block, styled like the website's capability list. */
export function UseCase({ slug }: { slug: string }) {
  const p = getProduct(slug);
  const items = [
    { title: "The problem", text: p.problem },
    { title: "What it does", text: p.solution },
    { title: "Business value", text: p.value },
    { title: "Built on your data", text: p.yourData },
  ];
  return (
    <section className="service-block no-print" aria-labelledby="usecase-title">
      <div className="service-block-label">
        <span className="eyebrow">The use case</span>
        <h2 id="usecase-title">Why it matters</h2>
      </div>
      <ol className="capability-list">
        {items.map((item, i) => (
          <li key={item.title}>
            <span className="service-index">0{i + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Links to the other Lab products, like the website's "Other services" row. */
export function OtherProducts({ slug }: { slug: string }) {
  return (
    <nav className="other-services no-print" aria-label="Other Lab products">
      <span className="eyebrow">More from the Lab</span>
      {PRODUCTS.filter((p) => p.slug !== slug).map((p) => (
        <Link key={p.slug} href={`/${p.slug}`}>
          {p.name} <ArrowUpRight size={18} />
        </Link>
      ))}
    </nav>
  );
}

export function SampleTag({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-[650] uppercase text-ink-3 ${className ?? ""}`}>
      <span className="size-1.5 rounded-full bg-ink-3" /> Sample data
    </span>
  );
}
