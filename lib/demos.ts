import {
  Activity,
  Calculator,
  FileSpreadsheet,
  Inbox,
  LineChart,
  MapPin,
  MessagesSquare,
  ReceiptText,
  Scale,
  type LucideIcon,
} from "lucide-react";

export type Pillar = "Data Analytics" | "Process Automation" | "AI Implementation";

export interface Demo {
  slug: string;
  title: string;
  pillar: Pillar;
  icon: LucideIcon;
  /** One-line business problem shown on cards and demo headers. */
  problem: string;
  /** Whether the demo calls Gemini. */
  ai?: boolean;
}

export const PILLARS: Pillar[] = ["Data Analytics", "Process Automation", "AI Implementation"];

export const DEMOS: Demo[] = [
  {
    slug: "market-pulse",
    title: "Economic & Market Pulse",
    pillar: "Data Analytics",
    icon: Activity,
    problem: "Leaders need a quick read on how their region and sector are trending, without digging through reports.",
  },
  {
    slug: "forecasting",
    title: "Demand Forecasting Playground",
    pillar: "Data Analytics",
    icon: LineChart,
    problem: "Planning inventory and staff is guesswork without a forecast you can stress-test.",
  },
  {
    slug: "site-selector",
    title: "Small Business Site Selector",
    pillar: "Data Analytics",
    icon: MapPin,
    problem: "Choosing where to open is a big bet. Compare neighbourhoods on the factors that matter to you.",
  },
  {
    slug: "invoice-extractor",
    title: "Invoice & Receipt Extractor",
    pillar: "Process Automation",
    icon: ReceiptText,
    problem: "Staff spend hours retyping invoices into spreadsheets and accounting systems.",
  },
  {
    slug: "report-automation",
    title: "Report Automation",
    pillar: "Process Automation",
    icon: FileSpreadsheet,
    problem: "The monthly report takes a day of copy-paste. It could take one click.",
  },
  {
    slug: "roi-calculator",
    title: "Workflow ROI Calculator",
    pillar: "Process Automation",
    icon: Calculator,
    problem: "Is automating this workflow worth it? Estimate the savings and the payback period.",
  },
  {
    slug: "doc-chat",
    title: "Chat with Your Documents",
    pillar: "AI Implementation",
    icon: MessagesSquare,
    problem: "Employees can't find answers buried in long policy documents.",
    ai: true,
  },
  {
    slug: "support-triage",
    title: "Customer Support Triage Agent",
    pillar: "AI Implementation",
    icon: Inbox,
    problem: "Support inboxes pile up. Sorting, routing and drafting replies eats the team's day.",
    ai: true,
  },
  {
    slug: "policy-explainer",
    title: "Policy & Regulation Explainer",
    pillar: "AI Implementation",
    icon: Scale,
    problem: "BC business rules are hard to parse. Get plain-language explanations of common topics.",
    ai: true,
  },
];

export const getDemo = (slug: string) => DEMOS.find((d) => d.slug === slug);
