import type { Metadata } from "next";
import { DemoHeader } from "@/components/demo-header";
import { PolicyExplainer } from "@/components/demos/policy-explainer";

export const metadata: Metadata = { title: "Policy & Regulation Explainer" };

export default function Page() {
  return (
    <>
      <DemoHeader slug="policy-explainer" />
      <PolicyExplainer />
    </>
  );
}
