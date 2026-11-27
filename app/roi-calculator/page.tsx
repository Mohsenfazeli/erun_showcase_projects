import type { Metadata } from "next";
import { DemoHeader } from "@/components/demo-header";
import { RoiCalculator } from "@/components/demos/roi-calculator";

export const metadata: Metadata = { title: "Workflow ROI Calculator" };

export default function Page() {
  return (
    <>
      <DemoHeader slug="roi-calculator" />
      <RoiCalculator />
    </>
  );
}
