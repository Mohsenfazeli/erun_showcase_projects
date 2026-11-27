import type { Metadata } from "next";
import { DemoHeader } from "@/components/demo-header";
import { MarketPulse } from "@/components/demos/market-pulse";

export const metadata: Metadata = { title: "Economic & Market Pulse" };

export default function Page() {
  return (
    <>
      <DemoHeader slug="market-pulse" />
      <MarketPulse />
    </>
  );
}
