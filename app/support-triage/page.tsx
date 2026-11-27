import type { Metadata } from "next";
import { DemoHeader } from "@/components/demo-header";
import { SupportTriage } from "@/components/demos/support-triage";

export const metadata: Metadata = { title: "Customer Support Triage Agent" };

export default function Page() {
  return (
    <>
      <DemoHeader slug="support-triage" />
      <SupportTriage />
    </>
  );
}
