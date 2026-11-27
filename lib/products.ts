export interface Product {
  slug: string;
  number: string;
  pillar: "Data Analytics" | "Automation" | "AI Implementation";
  name: string;
  /** One line for the Lab home grid. */
  short: string;
  tagline: string;
  problem: string;
  solution: string;
  value: string;
  yourData: string;
  cta: string;
}

/** The three Erun Lab products, one per service on erungroup.ca. */
export const PRODUCTS: Product[] = [
  {
    slug: "analytics",
    number: "01",
    pillar: "Data Analytics",
    name: "Performance Dashboard",
    short: "Live KPIs, a six-month forecast and where revenue comes from.",
    tagline: "See how the business is performing and where it is heading, in one view. Filter by region and time range, and read the forecast.",
    problem: "Sales data sits in spreadsheets, so trends and slowdowns are spotted weeks late.",
    solution: "One dashboard with KPIs, a six-month forecast with a confidence range, and revenue by channel and region.",
    value: "Earlier warning on slowdowns and faster, better-informed decisions for the leadership team.",
    yourData: "Connected to your sales, finance or operations systems and refreshed automatically.",
    cta: "Want a dashboard like this for your business",
  },
  {
    slug: "reports",
    number: "02",
    pillar: "Automation",
    name: "Automated Monthly Report",
    short: "A board-ready report, calculated and written in seconds.",
    tagline: "Pick a month and generate a complete performance report: the figures, the charts and the written commentary, ready to share.",
    problem: "Analysts spend days each month copying figures into reports and writing the same commentary.",
    solution: "Reads the month's data, runs every comparison and writes plain-language commentary on each metric.",
    value: "Days of manual work become one click, with consistent numbers and no copy-paste errors.",
    yourData: "Scheduled to run each month on your data and delivered to your team's inbox as a PDF.",
    cta: "Let’s automate your reporting",
  },
  {
    slug: "assistant",
    number: "03",
    pillar: "AI Implementation",
    name: "HR Policy Assistant",
    short: "An AI assistant trained on the company's own policies.",
    tagline: "Ask a question in plain language. The assistant answers only from the company's policy documents and shows exactly where each answer comes from.",
    problem: "Staff can't find answers in long handbooks, so HR answers the same questions all week.",
    solution: "An AI assistant grounded in your own documents, citing the exact section for every answer.",
    value: "Instant, consistent answers for staff and fewer routine requests for HR.",
    yourData: "Trained on your handbooks, policies or procedures, with guardrails set for your organization.",
    cta: "Let’s put AI to work on your documents",
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug)!;
