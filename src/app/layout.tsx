import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import Script from "next/script";
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
    default: "WinYourAppeal — Bills, claims & coverage help",
    template: "%s | WinYourAppeal",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18128855589"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18128855589');
          `}
        </Script>
      </body>
    </html>
  );
}
