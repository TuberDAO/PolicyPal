import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { UtmCapture } from "@/components/analytics/utm-capture";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AppealSupportPro — Bills, claims & coverage help",
    template: "%s | AppealSupportPro",
  },
  description:
    "Expert help with denied claims, confusing medical bills, and health insurance problems. A real person reviews your case and delivers a step-by-step action plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground font-sans">
        {children}
        <Analytics />
        <UtmCapture />
      </body>
    </html>
  );
}
