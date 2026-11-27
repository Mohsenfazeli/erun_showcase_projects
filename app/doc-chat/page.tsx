import type { Metadata } from "next";
import { DemoHeader } from "@/components/demo-header";
import { DocChat } from "@/components/demos/doc-chat";

export const metadata: Metadata = { title: "Chat with Your Documents" };

export default function Page() {
  return (
    <>
      <DemoHeader slug="doc-chat" />
      <DocChat />
    </>
  );
}
