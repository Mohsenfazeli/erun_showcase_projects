import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { Dashboard } from "@/components/products/dashboard";

export const metadata: Metadata = { title: "Performance Dashboard" };

export default function Page() {
  return (
    <ProductPage slug="analytics" stage="Try it: filter by region and time range">
      <Dashboard />
    </ProductPage>
  );
}
