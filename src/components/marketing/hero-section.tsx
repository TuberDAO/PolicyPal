import Link from "next/link";

export function HeroSection() {
  return (
    <section className="px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Need help with a denied claim, medical bill, or insurance problem?
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
          We review denied claims and medical bills and show you exactly what to
          do next.
        </p>

        <p className="mt-4 text-base leading-relaxed text-muted">
          Tell us what happened, upload anything useful, and we&rsquo;ll map out
          the best next steps for your case.
        </p>

        <p className="mt-4 text-sm font-medium text-accent">
          A real person handles the case from start to finish.
        </p>

        <Link
          href="/start"
          className="mt-8 inline-block rounded-lg bg-cta px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-cta-hover"
        >
          Start your review
        </Link>
      </div>
    </section>
  );
}
