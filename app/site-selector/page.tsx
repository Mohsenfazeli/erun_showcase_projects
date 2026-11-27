import type { Metadata } from "next";
import { DemoHeader } from "@/components/demo-header";
import { SiteSelector } from "@/components/demos/site-selector";

export const metadata: Metadata = { title: "Small Business Site Selector" };

export default function Page() {
  return (
    <>
      <DemoHeader slug="site-selector" />
      <SiteSelector />
    </>
  );
}
