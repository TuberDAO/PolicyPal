import Link from "next/link";
import { BRAND } from "@/constants";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-heading text-base font-semibold tracking-tight sm:text-lg"
        >
          {BRAND.name}
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <a
            href="#examples"
            className="text-xs text-muted transition-colors hover:text-foreground sm:text-sm"
          >
            Examples
          </a>
          <a
            href="#pricing"
            className="text-xs text-muted transition-colors hover:text-foreground sm:text-sm"
          >
            Pricing
          </a>
          <Link
            href="/start"
            className="whitespace-nowrap rounded-lg bg-cta px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-cta-hover sm:px-4 sm:py-2 sm:text-sm"
          >
            Start review
          </Link>
        </div>
      </nav>
    </header>
  );
}
