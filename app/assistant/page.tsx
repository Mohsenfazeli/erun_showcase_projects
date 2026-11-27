import type { Metadata } from "next";
import { ProductHeader } from "@/components/product-header";
import { PolicyAssistant } from "@/components/products/assistant";

export const metadata: Metadata = { title: "HR Policy Assistant" };

export default function Page() {
  return (
    <>
      <ProductHeader slug="assistant" />
      <PolicyAssistant />
    </>
  );
}
