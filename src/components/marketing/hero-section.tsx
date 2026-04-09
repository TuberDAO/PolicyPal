import Link from "next/link";
import type { User } from "@supabase/supabase-js";

export function HeroSection({ user }: { user: User | null }) {
  return (
    <section className="px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Need help with a denied claim, medical bill, or insurance problem?
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
          We review your situation and build a step-by-step plan — who to
          contact, what to say, and how to escalate when needed.
        </p>

        <p className="mt-4 text-base leading-relaxed text-muted">
          Tell us what happened, upload anything useful, and we&rsquo;ll map out
          the best path forward for your case.
        </p>

        <p className="mt-4 text-sm font-medium text-accent">
          A real person handles the case from start to finish.
        </p>

        {user ? (
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
            className="mt-8 inline-block rounded-lg bg-cta px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-cta-hover"
          >
            Start your review
          </Link>
        )}
      </div>
    </section>
  );
}
