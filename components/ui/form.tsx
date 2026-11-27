"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Underlined select, like the website's contact form inputs. */
export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-none border-0 border-b border-line bg-transparent pr-8 text-[14px] font-semibold text-ink outline-none transition-colors focus:border-brand cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg className="pointer-events-none absolute right-1 top-1/2 size-3.5 -translate-y-1/2 text-ink-3" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Text tabs with an underline on the active item, matching the website's nav. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex items-center gap-5", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "border-b pb-1.5 text-[12px] font-semibold whitespace-nowrap transition-colors cursor-pointer",
              active ? "border-brand text-ink" : "border-transparent text-ink-3 hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
