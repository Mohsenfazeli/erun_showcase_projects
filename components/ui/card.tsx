import * as React from "react";
import { cn } from "@/lib/utils";

/** Square, hairline-bordered surface in the website's visual language. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border border-line bg-surface", className)} {...props} />;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3 px-6 pt-6", className)}>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        {subtitle && <p className="mt-1 text-xs leading-relaxed text-ink-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}
