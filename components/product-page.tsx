import type { ReactNode } from "react";
import { ConsultationCta, PageShell } from "@/components/site-chrome";
import { LabIntro, OtherProducts, StageBar, UseCase } from "@/components/product-header";
import { getProduct } from "@/lib/products";

/** One template for all three Lab products, mirroring the website's service pages. */
export function ProductPage({ slug, stage, children }: { slug: string; stage: string; children: ReactNode }) {
  const p = getProduct(slug);
  return (
    <PageShell cta={<ConsultationCta title={p.cta} text="We build these on your own data and systems. Tell us what you are working on and we will reply by email to arrange a conversation." />}>
      <LabIntro slug={slug} />
      <section className="lab-stage" aria-label={`${p.name} demo`}>
        <StageBar left={stage} right={`Lab / ${p.number}`} />
        {children}
      </section>
      <UseCase slug={slug} />
      <OtherProducts slug={slug} />
    </PageShell>
  );
}
