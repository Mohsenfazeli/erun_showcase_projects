import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Erun Lab: interactive demos by Erun Consulting Group",
    template: "%s · Erun Lab",
  },
  description:
    "Hands-on demos of data analytics, process automation and AI implementation from Erun Consulting Group, Vancouver.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</div>
        </main>
      </body>
    </html>
  );
}
