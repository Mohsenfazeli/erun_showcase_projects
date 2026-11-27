import type { Metadata } from "next";
import { ProductPage } from "@/components/product-page";
import { PolicyAssistant } from "@/components/products/assistant";

export const metadata: Metadata = { title: "HR Policy Assistant" };

export default function Page() {
  return (
    <ProductPage slug="assistant" stage="Try it: ask a question about company policy">
      <PolicyAssistant />
    </ProductPage>
  );
}
