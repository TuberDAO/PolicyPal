import Link from "next/link";
import { HeroSection } from "@/components/marketing/hero-section";
import { OutcomesSection } from "@/components/marketing/outcomes-section";
import { ExamplesSection } from "@/components/marketing/examples-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { WhatYouGetSection } from "@/components/marketing/what-you-get-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { TrustedSourcesSection } from "@/components/marketing/trusted-sources-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <HeroSection user={user} />
      {/* Scrolling source strip — sits flush beneath the hero */}
      <TrustedSourcesSection />
      <OutcomesSection />
      <ExamplesSection />
      <HowItWorksSection />
      <WhatYouGetSection />
      <PricingSection />

      {/* Bottom CTA */}
      <section className="px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="mx-auto max-w-md text-lg text-muted">
          Ready to get started?
        </p>
        {user ? (
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/case/new"
              className="inline-block rounded-lg bg-cta px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-cta-hover"
            >
              Start a new case
            </Link>
            <Link
              href="/dashboard"
              className="inline-block rounded-lg border border-border px-8 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-surface-raised"
            >
              View current cases
            </Link>
          </div>
        ) : (
          <Link
            href="/start"
            className="mt-6 inline-block rounded-lg bg-cta px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-cta-hover"
          >
            Start your review
          </Link>
        )}
      </section>

      <TestimonialsSection />

      <FaqSection />
    </>
  );
}
