"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, FlaskConical, Menu, X } from "lucide-react";
import { DEMOS, PILLARS } from "@/lib/demos";
import { cn } from "@/lib/utils";

function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5 group">
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white shadow-sm shadow-brand/30 transition group-hover:scale-105">
        <FlaskConical className="size-4" />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-white">
        Erun <span className="text-brand-soft/70 font-normal">Lab</span>
      </span>
    </Link>
  );
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-5">
        <Wordmark onNavigate={onNavigate} />
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Interactive demos by Erun Consulting Group
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Demos">
        {PILLARS.map((pillar) => (
          <div key={pillar} className="mb-5">
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              {pillar}
            </p>
            <ul className="space-y-0.5">
              {DEMOS.filter((d) => d.pillar === pillar).map((demo) => {
                const active = pathname === `/${demo.slug}`;
                const Icon = demo.icon;
                return (
                  <li key={demo.slug}>
                    <Link
                      href={`/${demo.slug}`}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] transition-colors",
                        active
                          ? "bg-brand text-white shadow-sm shadow-brand/20"
                          : "text-slate-300 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          active ? "text-white" : "text-slate-500 group-hover:text-slate-300",
                        )}
                      />
                      <span className="leading-snug">{demo.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <a
          href="https://www.erungroup.ca"
          className="flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-white"
        >
          Back to erungroup.ca <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-[17.5rem] bg-navy lg:block">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between bg-navy px-4 lg:hidden">
        <Wordmark />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-slate-200 hover:bg-white/10 cursor-pointer"
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu className="size-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "no-print fixed inset-0 z-40 lg:hidden transition",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        inert={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-navy-900/60 backdrop-blur-[2px] transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-navy transition-transform duration-200 ease-out",
            open ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          )}
          role="dialog"
          aria-label="Navigation"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-5 rounded-lg p-1.5 text-slate-300 hover:bg-white/10 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
          <NavContent onNavigate={() => setOpen(false)} />
        </aside>
      </div>
    </>
  );
}
