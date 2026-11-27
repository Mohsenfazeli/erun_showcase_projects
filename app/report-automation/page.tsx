import type { Metadata } from "next";
import { DemoHeader } from "@/components/demo-header";
import { ReportAutomation } from "@/components/demos/report-automation";

export const metadata: Metadata = { title: "Report Automation" };

export default function Page() {
  return (
    <>
      <DemoHeader slug="report-automation" />
      <ReportAutomation />
    </>
  );
}
