import type { Metadata } from "next";
import { DemoHeader } from "@/components/demo-header";
import { InvoiceExtractor } from "@/components/demos/invoice-extractor";

export const metadata: Metadata = { title: "Invoice & Receipt Extractor" };

export default function Page() {
  return (
    <>
      <DemoHeader slug="invoice-extractor" />
      <InvoiceExtractor />
    </>
  );
}
