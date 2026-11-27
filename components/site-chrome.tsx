"use client";

/*
 * Header, footer and closing call to action ported from erungroup.ca
 * (src/components/site-chrome.tsx) so the Lab reads as a page of the website.
 * Website sections are absolute links back to the main site; "Lab" is this app.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONSULTATION_LABEL, CONTACT_EMAIL, NAV_ITEMS, SITE_URL, siteLink } from "@/lib/site";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header no-print">
      <a href={SITE_URL} className="wordmark brand-mark" aria-label="Erun home">
        {/* eslint-disable-next-line @next/next/no-img-element -- same plain image as the website header */}
        <img src="/brand/erun-mark-160.png" alt="Erun Group" width={160} height={159} />
      </a>
      <nav className={menuOpen ? "desktop-nav open" : "desktop-nav"} aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <Button key={item.label} variant="nav" size="bare" asChild>
            <a href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          </Button>
        ))}
        <Button variant="nav" size="bare" className="nav-active" asChild>
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} onClick={() => setMenuOpen(false)}>
            Lab
          </Link>
        </Button>
      </nav>
      <Button variant="editorial" className="header-contact" asChild>
        <a href={siteLink("contact")}>
          {CONSULTATION_LABEL} <ArrowUpRight />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="mobile-menu"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X /> : <Menu />}
      </Button>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer page-footer no-print">
      <a href={SITE_URL} className="wordmark">
        erun<span>.</span>
      </a>
      <span>Data Analytics · Automation · AI Implementation</span>
      <span>© {new Date().getFullYear()} Erun Group</span>
      <Button variant="nav" size="icon" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <ArrowRight className="back-top-icon" />
      </Button>
    </footer>
  );
}

/** Closing call to action, same as the website's inner pages. */
export function ConsultationCta({
  title = "Let’s talk about your challenge",
  text = "Tell us what you are working on. We will reply by email to arrange a conversation.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="page-cta no-print" aria-labelledby="page-cta-title">
      <div className="eyebrow">
        <span className="small-rule" /> Start a conversation
      </div>
      <h2 id="page-cta-title">
        {title}
        <span className="text-primary">.</span>
      </h2>
      <p>{text}</p>
      <div className="page-cta-actions">
        <Button variant="editorial" size="bare" asChild>
          <a href={siteLink("contact")}>
            {CONSULTATION_LABEL} <ArrowUpRight />
          </a>
        </Button>
        <a href={`mailto:${CONTACT_EMAIL}`} className="page-cta-email">
          {CONTACT_EMAIL}
        </a>
      </div>
    </section>
  );
}

/** Frame for every Lab page: website header, content, call to action, footer. */
export function PageShell({ children, cta = <ConsultationCta /> }: { children: ReactNode; cta?: ReactNode }) {
  return (
    <div className="erun-site page-site">
      <SiteHeader />
      <main className="page-main">
        {children}
        {cta}
      </main>
      <SiteFooter />
    </div>
  );
}
