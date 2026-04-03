import Link from "next/link";
import { HeroSection } from "@/components/marketing/hero-section";
import { ExamplesSection } from "@/components/marketing/examples-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { WhatYouGetSection } from "@/components/marketing/what-you-get-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { TrustedSourcesSection } from "@/components/marketing/trusted-sources-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ExamplesSection />
      <HowItWorksSection />
      <WhatYouGetSection />
      <PricingSection />
      <TrustedSourcesSection />

      {/* Bottom CTA */}
      <section className="px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="mx-auto max-w-md text-lg text-muted">
          Ready to get started?
        </p>
        <Link
          href="/start"
          className="mt-6 inline-block rounded-lg bg-cta px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-cta-hover"
        >
          Start your review
        </Link>
      </section>
    </>
  );
}
