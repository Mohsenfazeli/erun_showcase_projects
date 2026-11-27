import { FileText, LayoutDashboard, MessagesSquare, type LucideIcon } from "lucide-react";

export interface Product {
  slug: string;
  number: string;
  pillar: "Data Analytics" | "Process Automation" | "AI Implementation";
  name: string;
  icon: LucideIcon;
  tagline: string;
  problem: string;
  solution: string;
  value: string;
  ai?: boolean;
}

/** The three Erun Lab products. Used by the sidebar, the home page and each product header. */
export const PRODUCTS: Product[] = [
  {
    slug: "analytics",
    number: "01",
    pillar: "Data Analytics",
    name: "Performance Dashboard",
    icon: LayoutDashboard,
    tagline: "See how the business is performing and where it is heading, in one view.",
    problem: "Sales data sits in spreadsheets, so trends are spotted weeks late.",
    solution: "One live dashboard with KPIs, a six-month forecast, and revenue by channel and region.",
    value: "Earlier warning on slowdowns and faster, better-informed decisions.",
  },
  {
    slug: "reports",
    number: "02",
    pillar: "Process Automation",
    name: "Automated Monthly Report",
    icon: FileText,
    tagline: "A board-ready performance report, calculated and written in seconds.",
    problem: "Analysts spend days each month copying figures into reports and writing commentary.",
    solution: "Reads the month's data, runs every comparison and writes the commentary automatically.",
    value: "Days of manual work become one click, with consistent numbers every month.",
  },
  {
    slug: "assistant",
    number: "03",
    pillar: "AI Implementation",
    name: "HR Policy Assistant",
    icon: MessagesSquare,
    tagline: "An AI assistant trained on your company's own policies.",
    problem: "Staff can't find answers in long handbooks, so HR answers the same questions all week.",
    solution: "Answers employee questions in plain language, only from the company handbook, citing the exact section.",
    value: "Instant, consistent answers for staff and fewer routine HR requests.",
    ai: true,
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug)!;
