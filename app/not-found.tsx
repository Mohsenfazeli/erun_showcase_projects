import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ErunMark } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-up">
      <ErunMark size={48} />
      <p className="eyebrow mt-6">404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">This page isn&apos;t in the Lab</h1>
      <p className="mt-2 text-sm text-ink-2">The product you&apos;re looking for may have moved.</p>
      <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark">
        <ArrowLeft className="size-4" /> Back to all products
      </Link>
    </div>
  );
}
