"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { ErunMark, Wordmark } from "@/components/brand";
import { cn } from "@/lib/utils";

function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5" aria-label="Erun Lab home">
      <ErunMark size={30} />
      <Wordmark className="text-[24px] leading-none" />
      <span className="ml-0.5 rounded-[4px] border border-line px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-2">
        Lab
      </span>
    </Link>
  );
}

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-7 pb-8">
        <Logo onNavigate={onNavigate} />
      </div>

      <nav className="flex-1 px-3" aria-label="Products">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">Products</p>
        <ul className="space-y-1">
          {PRODUCTS.map((p) => {
            const active = pathname === `/${p.slug}`;
            return (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}`}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex gap-3 rounded-md px-3 py-2.5 transition-colors",
                    active ? "bg-brand-light" : "hover:bg-canvas",
                  )}
                >
                  {active && <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-brand" />}
                  <span className={cn("pt-px text-[11px] font-bold tabular-nums", active ? "text-brand" : "text-ink-3")}>{p.number}</span>
                  <span className="min-w-0">
                    <span className={cn("block text-[13.5px] font-semibold leading-tight", active ? "text-ink" : "text-ink-2 group-hover:text-ink")}>
                      {p.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-ink-3">{p.pillar}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-lg border border-line bg-canvas p-4">
        <p className="text-[12.5px] font-semibold text-ink">Want this for your business?</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-ink-2">Each product here is built on sample data. We build the real thing on yours.</p>
        <a
          href="https://www.erungroup.ca"
          className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand hover:text-brand-dark"
        >
          Visit erungroup.ca <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-line bg-surface lg:block">
        <Nav />
      </aside>

      <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-ink-2 hover:bg-canvas cursor-pointer"
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu className="size-5" />
        </button>
      </header>

      <div className={cn("no-print fixed inset-0 z-40 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")} inert={!open}>
        <div
          className={cn("absolute inset-0 bg-ink/30 transition-opacity duration-200", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-surface transition-transform duration-200 ease-out",
            open ? "translate-x-0 shadow-xl" : "-translate-x-full",
          )}
          role="dialog"
          aria-label="Navigation"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-6 rounded-md p-1.5 text-ink-2 hover:bg-canvas cursor-pointer"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
          <Nav onNavigate={() => setOpen(false)} />
        </aside>
      </div>
    </>
  );
}
