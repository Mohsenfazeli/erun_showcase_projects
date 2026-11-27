import type { Metadata } from "next";
import { ProductHeader } from "@/components/product-header";
import { Dashboard } from "@/components/products/dashboard";

export const metadata: Metadata = { title: "Performance Dashboard" };

export default function Page() {
  return (
    <>
      <ProductHeader slug="analytics" />
      <Dashboard />
    </>
  );
}
