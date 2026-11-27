"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, FileJson, FileText, Loader2, ScanLine, Sheet, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SAMPLE_INVOICES, type SampleInvoice } from "@/data/invoices";
import { cn, downloadFile, fmtCurrency } from "@/lib/utils";

const STEPS = ["Reading document (OCR)", "Detecting layout and tables", "Extracting fields", "Validating totals and tax"];
const STEP_MS = 700;

type Flag = { level: "error" | "warning" | "ok"; text: string };

function validate(inv: SampleInvoice): Flag[] {
  const flags: Flag[] = [];
  const lineSum = +inv.items.reduce((s, i) => s + i.amount, 0).toFixed(2);
  const p = inv.printed;
  if (Math.abs(lineSum - p.subtotal) > 0.01) {
    flags.push({ level: "error", text: `Line items add up to ${fmtCurrency(lineSum, 2)}, but the subtotal shows ${fmtCurrency(p.subtotal, 2)} (difference ${fmtCurrency(p.subtotal - lineSum, 2)}).` });
  } else {
    flags.push({ level: "ok", text: "Line items match the subtotal." });
  }
  if (Math.abs(p.subtotal + p.gst + p.pst - p.total) > 0.01) {
    flags.push({ level: "error", text: "Subtotal plus taxes does not equal the total." });
  } else {
    flags.push({ level: "ok", text: "Subtotal + taxes = total." });
  }
  if (Math.abs(p.gst - p.subtotal * 0.05) > 0.02) {
    flags.push({ level: "warning", text: "GST is not 5% of the subtotal. Check for exempt items." });
  }
  if (!inv.gstNumber) {
    flags.push({ level: "warning", text: "No GST registration number found. It is usually needed to claim input tax credits." });
  }
  if (inv.dueDate && inv.dueDate < inv.date) {
    flags.push({ level: "error", text: "Due date is before the invoice date." });
  }
  if (inv.previouslyProcessed) {
    flags.push({ level: "error", text: `Possible duplicate: ${inv.invoiceNumber} from this vendor was already processed.` });
  }
  Object.entries(inv.confidence)
    .filter(([, c]) => c < 0.85)
    .forEach(([k, c]) => flags.push({ level: "warning", text: `Low read confidence on “${k}” (${Math.round(c * 100)}%). Please review.` }));
  return flags;
}

function toJson(inv: SampleInvoice) {
  return JSON.stringify(
    {
      vendor: inv.vendor,
      vendor_address: inv.vendorAddress,
      invoice_number: inv.invoiceNumber,
      invoice_date: inv.date,
      due_date: inv.dueDate ?? null,
      gst_number: inv.gstNumber ?? null,
      line_items: inv.items.map((i) => ({ description: i.description, quantity: i.qty, unit_price: i.unitPrice, amount: i.amount })),
      subtotal: inv.printed.subtotal,
      gst: inv.printed.gst,
      pst: inv.printed.pst,
      total: inv.printed.total,
      currency: "CAD",
      validation: validate(inv).filter((f) => f.level !== "ok").map((f) => ({ level: f.level, message: f.text })),
    },
    null,
    2,
  );
}

function toCsv(inv: SampleInvoice) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const header = ["vendor", "invoice_number", "invoice_date", "due_date", "gst_number", "description", "quantity", "unit_price", "amount", "subtotal", "gst", "pst", "total"];
  const rows = inv.items.map((i) =>
    [inv.vendor, inv.invoiceNumber, inv.date, inv.dueDate ?? "", inv.gstNumber ?? "", i.description, i.qty, i.unitPrice, i.amount, inv.printed.subtotal, inv.printed.gst, inv.printed.pst, inv.printed.total].map(esc).join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

/* ---------- Document previews ---------- */

function DocumentPreview({ inv, scanning }: { inv: SampleInvoice; scanning: boolean }) {
  const p = inv.printed;
  if (inv.style === "thermal") {
    return (
      <div className="relative mx-auto w-full max-w-[280px] -rotate-1 bg-[#fdfcf7] px-5 py-6 font-mono text-[11px] leading-relaxed text-slate-700 shadow-lg shadow-navy/10 [clip-path:polygon(0_0,100%_0,100%_98%,95%_100%,90%_98%,85%_100%,80%_98%,75%_100%,70%_98%,65%_100%,60%_98%,55%_100%,50%_98%,45%_100%,40%_98%,35%_100%,30%_98%,25%_100%,20%_98%,15%_100%,10%_98%,5%_100%,0_98%)]">
        <p className="text-center text-sm font-bold tracking-wide">{inv.vendor.toUpperCase()}</p>
        <p className="text-center">{inv.vendorAddress}</p>
        <p className="mt-3">RECEIPT #{inv.invoiceNumber}</p>
        <p>{inv.date.replace(/-/g, "/")} 12:41</p>
        <p className="my-2 border-t border-dashed border-slate-400" />
        {inv.items.map((i) => (
          <div key={i.description} className="flex justify-between gap-2">
            <span>{i.qty} {i.description}</span>
            <span>{i.amount.toFixed(2)}</span>
          </div>
        ))}
        <p className="my-2 border-t border-dashed border-slate-400" />
        <div className="flex justify-between"><span>SUBTOTAL</span><span>{p.subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>GST 5%</span><span>{p.gst.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold"><span>TOTAL</span><span>{p.total.toFixed(2)}</span></div>
        <p className="mt-3 text-center">VISA ****4417 APPROVED</p>
        <p className="text-center">THANK YOU!</p>
        {scanning && <ScanBar />}
      </div>
    );
  }
  const modern = inv.style === "modern";
  return (
    <div className="relative mx-auto w-full max-w-[420px] bg-white p-6 text-[11px] text-slate-700 shadow-lg shadow-navy/10 ring-1 ring-slate-200">
      <div className={cn("flex items-start justify-between gap-3", modern && "rounded-md bg-slate-800 p-3 text-white")}>
        <div>
          <p className={cn("text-sm font-bold", modern ? "text-white" : "text-navy")}>{inv.vendor}</p>
          <p className={modern ? "text-slate-300" : "text-slate-500"}>{inv.vendorAddress}</p>
          {inv.gstNumber && <p className={modern ? "text-slate-300" : "text-slate-500"}>GST/HST No. {inv.gstNumber}</p>}
        </div>
        <p className={cn("text-lg font-light tracking-widest", modern ? "text-sky-300" : "text-slate-400")}>INVOICE</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase text-slate-400">Bill to</p>
          <p>{inv.billTo}</p>
        </div>
        <div className="text-right">
          <p><span className="text-slate-400">Invoice #</span> {inv.invoiceNumber}</p>
          <p><span className="text-slate-400">Date</span> {inv.date}</p>
          {inv.dueDate && <p><span className="text-slate-400">Due</span> {inv.dueDate}</p>}
        </div>
      </div>
      <table className="mt-4 w-full">
        <thead>
          <tr className={cn("text-left text-[10px] uppercase", modern ? "text-sky-700" : "text-slate-400")}>
            <th className="py-1 font-medium">Description</th>
            <th className="py-1 text-right font-medium">Qty</th>
            <th className="py-1 text-right font-medium">Price</th>
            <th className="py-1 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {inv.items.map((i) => (
            <tr key={i.description} className="border-t border-slate-100">
              <td className="py-1">{i.description}</td>
              <td className="py-1 text-right">{i.qty}</td>
              <td className="py-1 text-right">{i.unitPrice.toFixed(2)}</td>
              <td className="py-1 text-right">{i.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ml-auto mt-3 w-44 space-y-0.5">
        <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span>{p.subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">GST 5%</span><span>{p.gst.toFixed(2)}</span></div>
        {p.pst > 0 && <div className="flex justify-between"><span className="text-slate-400">PST 7%</span><span>{p.pst.toFixed(2)}</span></div>}
        <div className="flex justify-between border-t border-slate-300 pt-1 font-bold text-navy"><span>Total CAD</span><span>{p.total.toFixed(2)}</span></div>
      </div>
      <p className="mt-5 text-[10px] text-slate-400">Payment terms: Net {inv.dueDate ? Math.round((+new Date(inv.dueDate) - +new Date(inv.date)) / 86400000) : 0} days.</p>
      {scanning && <ScanBar />}
    </div>
  );
}

function ScanBar() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-brand/25 to-transparent animate-[scan_1.4s_ease-in-out_infinite]" />
      <style>{`@keyframes scan { 0% { top: -4rem } 100% { top: 100% } }`}</style>
    </div>
  );
}

/* ---------- Extraction panel ---------- */

function Field({ label, value, confidence, show }: { label: string; value?: string; confidence?: number; show: boolean }) {
  return (
    <div className={cn("rounded-lg border border-border px-3 py-2 transition-all duration-500", show ? "bg-white opacity-100" : "bg-slate-50 opacity-60")}>
      <p className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted">
        {label}
        {show && confidence !== undefined && (
          <span className={cn("normal-case tracking-normal", confidence < 0.85 ? "text-amber-600" : "text-emerald-600")}>{Math.round(confidence * 100)}%</span>
        )}
      </p>
      <p className={cn("mt-0.5 min-h-5 truncate text-sm font-medium", show ? "text-navy animate-fade-in" : "text-transparent")}>
        {show ? value ?? <span className="italic text-slate-400">Not found</span> : "—"}
      </p>
    </div>
  );
}

export function InvoiceExtractor() {
  const [invId, setInvId] = useState(SAMPLE_INVOICES[0].id);
  const [step, setStep] = useState(-1); // -1 idle, 0..STEPS.length running, STEPS.length done
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const inv = SAMPLE_INVOICES.find((i) => i.id === invId)!;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const choose = (id: string) => {
    clearTimers();
    setInvId(id);
    setStep(-1);
  };

  const extract = () => {
    clearTimers();
    setStep(0);
    STEPS.forEach((_, i) => timers.current.push(setTimeout(() => setStep(i + 1), STEP_MS * (i + 1))));
  };

  const done = step >= STEPS.length;
  const showFields = step >= 3;
  const flags = validate(inv);
  const issues = flags.filter((f) => f.level !== "ok");

  return (
    <div className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
      <div className="grid gap-3 sm:grid-cols-3">
        {SAMPLE_INVOICES.map((s) => (
          <button
            key={s.id}
            onClick={() => choose(s.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl border bg-white p-3 text-left transition cursor-pointer",
              s.id === invId ? "border-brand ring-2 ring-brand/20" : "border-border hover:border-brand/40",
            )}
          >
            <span className={cn("flex size-9 items-center justify-center rounded-lg", s.id === invId ? "bg-brand text-white" : "bg-slate-100 text-slate-500")}>
              <FileText className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-medium text-navy">{s.vendor}</span>
              <span className="block text-xs text-muted">{s.label}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,440px)_1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Document</CardTitle>
              <CardDescription>{inv.kind === "receipt" ? "Phone photo of a paper receipt" : "PDF invoice"}</CardDescription>
            </div>
            <Badge variant="neutral">Sample document</Badge>
          </CardHeader>
          <CardContent className="bg-slate-100/70 py-8">
            <DocumentPreview inv={inv} scanning={step >= 0 && step < 2} />
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>Extraction</CardTitle>
                <CardDescription>Structured data, ready for your accounting system.</CardDescription>
              </div>
              <Button onClick={extract} disabled={step >= 0 && !done}>
                {step >= 0 && !done ? <Loader2 className="animate-spin" /> : <ScanLine />}
                {done ? "Run again" : "Extract"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              <ol className="grid gap-2 sm:grid-cols-4">
                {STEPS.map((s, i) => {
                  const isDone = step > i;
                  const isRunning = step === i;
                  return (
                    <li
                      key={s}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition",
                        isDone ? "bg-emerald-50 text-emerald-800" : isRunning ? "bg-brand-soft text-brand" : "bg-slate-50 text-slate-400",
                      )}
                    >
                      {isDone ? <Check className="size-3.5 shrink-0" /> : isRunning ? <Loader2 className="size-3.5 shrink-0 animate-spin" /> : <span className="size-3.5 shrink-0 rounded-full border border-current" />}
                      {s}
                    </li>
                  );
                })}
              </ol>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Vendor" value={inv.vendor} confidence={inv.confidence.vendor} show={showFields} />
                <Field label="Invoice #" value={inv.invoiceNumber} confidence={inv.confidence.invoiceNumber} show={showFields} />
                <Field label="Date" value={inv.date} confidence={inv.confidence.date} show={showFields} />
                <Field label="Due date" value={inv.dueDate} confidence={inv.confidence.dueDate} show={showFields} />
                <Field label="GST number" value={inv.gstNumber} confidence={inv.confidence.gstNumber} show={showFields} />
                <Field label="Total" value={fmtCurrency(inv.printed.total, 2)} confidence={inv.confidence.totals} show={showFields} />
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[460px] text-sm">
                  <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-3 py-2 font-medium">Line item</th>
                      <th className="px-3 py-2 text-right font-medium">Qty</th>
                      <th className="px-3 py-2 text-right font-medium">Unit</th>
                      <th className="px-3 py-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showFields ? (
                      <>
                        {inv.items.map((i, k) => (
                          <tr key={i.description} className="border-t border-border animate-fade-in" style={{ animationDelay: `${k * 120}ms` }}>
                            <td className="px-3 py-1.5 text-navy">{i.description}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{i.qty}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{i.unitPrice.toFixed(2)}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{i.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                        {([["Subtotal", inv.printed.subtotal], ["GST", inv.printed.gst], ["PST", inv.printed.pst], ["Total", inv.printed.total]] as const).map(([k, v]) => (
                          <tr key={k} className={cn("border-t border-border", k === "Total" && "font-semibold text-navy")}>
                            <td className="px-3 py-1.5 text-right text-muted" colSpan={3}>{k}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{v.toFixed(2)}</td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-3 py-8 text-center text-sm text-muted">
                          {step < 0 ? "Click Extract to read this document." : "Reading…"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {done && (
            <Card className="animate-fade-up">
              <CardHeader className="flex-row items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {issues.some((f) => f.level === "error") ? (
                      <XCircle className="size-4 text-rose-600" />
                    ) : issues.length ? (
                      <AlertTriangle className="size-4 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    )}
                    Validation {issues.length ? `(${issues.length} to review)` : "passed"}
                  </CardTitle>
                  <CardDescription>Automatic checks before anything is posted.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadFile(`${inv.invoiceNumber}.csv`, toCsv(inv), "text/csv")}>
                    <Sheet /> CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(`${inv.invoiceNumber}.json`, toJson(inv), "application/json")}>
                    <FileJson /> JSON
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {flags.map((f) => (
                    <li
                      key={f.text}
                      className={cn(
                        "flex items-start gap-2 rounded-lg px-3 py-2 text-sm",
                        f.level === "error" ? "bg-rose-50 text-rose-800" : f.level === "warning" ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800",
                      )}
                    >
                      {f.level === "error" ? <XCircle className="mt-0.5 size-4 shrink-0" /> : f.level === "warning" ? <AlertTriangle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
                      {f.text}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
