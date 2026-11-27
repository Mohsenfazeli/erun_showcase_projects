import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { AutomatedReport } from "@/components/products/report";

export const metadata: Metadata = { title: "Automated Monthly Report" };

export default function Page() {
  return (
    <ProductPage slug="reports" stage="Try it: pick a month and generate the report">
      <AutomatedReport />
    </ProductPage>
  );
}
