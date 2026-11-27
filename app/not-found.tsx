import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-up">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <FlaskConical className="size-6" />
      </span>
      <h1 className="mt-4 text-xl font-semibold text-navy">This experiment doesn&apos;t exist (yet)</h1>
      <p className="mt-1 text-sm text-muted">The page you&apos;re looking for isn&apos;t in the Lab.</p>
      <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
        <ArrowLeft className="size-4" /> Back to all demos
      </Link>
    </div>
  );
}
