import type { Metadata } from "next";
import { DemoHeader } from "@/components/demo-header";
import { Forecasting } from "@/components/demos/forecasting";

export const metadata: Metadata = { title: "Demand Forecasting Playground" };

export default function Page() {
  return (
    <>
      <DemoHeader slug="forecasting" />
      <Forecasting />
    </>
  );
}
