import Image from "next/image";
import { cn } from "@/lib/utils";

/** The Erun mark (two linked blocks) from erungroup.ca. */
export function ErunMark({ size = 28, className }: { size?: number; className?: string }) {
  return <Image src="/brand/erun-mark-160.png" alt="" width={size} height={size} className={cn("shrink-0", className)} priority />;
}

/** "erun." wordmark set in Manrope ExtraBold, as on the website. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-extrabold tracking-[-0.03em] text-ink", className)}>
      erun<span className="text-brand">.</span>
    </span>
  );
}
