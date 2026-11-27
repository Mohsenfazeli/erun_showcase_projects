import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Erun Lab: data, automation and AI products by Erun Group",
    template: "%s · Erun Lab",
  },
  description:
    "Try three working products from Erun Group, Vancouver: a performance dashboard, an automated monthly report and an AI policy assistant.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <Sidebar />
        <main className="lg:pl-[260px]">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</div>
        </main>
      </body>
    </html>
  );
}
