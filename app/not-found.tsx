import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageShell cta={null}>
      <section className="page-intro not-found">
        <div className="eyebrow">
          <span className="small-rule" /> 404
        </div>
        <h1>
          Page Not Found<span className="text-primary">.</span>
        </h1>
        <p>This page isn&apos;t in the Lab. It may have moved.</p>
        <Button variant="editorial" size="bare" asChild>
          <Link href="/">
            Back to the Lab <ArrowUpRight />
          </Link>
        </Button>
      </section>
    </PageShell>
  );
}
