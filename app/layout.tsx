import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./site.css";

// Same family as erungroup.ca; the variable font supports its 550/650 weights.
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Lab | Erun Consulting Group",
    template: "%s | Erun Lab",
  },
  description:
    "Try three working products from Erun Consulting Group, Vancouver: a performance dashboard, an automated monthly report and an AI policy assistant.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
