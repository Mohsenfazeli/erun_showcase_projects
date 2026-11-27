import type { Metadata } from "next";
import { ProductHeader } from "@/components/product-header";
import { AutomatedReport } from "@/components/products/report";

export const metadata: Metadata = { title: "Automated Monthly Report" };

export default function Page() {
  return (
    <>
      <ProductHeader slug="reports" />
      <AutomatedReport />
    </>
  );
}
