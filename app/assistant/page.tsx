import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { HrAssistant } from "@/components/products/assistant";

export const metadata: Metadata = { title: "HR Assistant" };

export default function Page() {
  return (
    <ProductPage slug="assistant" stage="Try it: ask a question about company policy">
      <HrAssistant />
    </ProductPage>
  );
}
