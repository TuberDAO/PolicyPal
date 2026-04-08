import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { BRAND } from "@/constants";

export function MarketingHeader({
  user,
  logoutAction,
}: {
  user: User | null;
  logoutAction?: () => Promise<void>;
}) {
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
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="whitespace-nowrap rounded-lg bg-cta px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-cta-hover sm:px-4 sm:py-2 sm:text-sm"
              >
                Dashboard
              </Link>
              {logoutAction && (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-xs text-muted transition-colors hover:text-foreground sm:text-sm"
                  >
                    Log out
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs text-muted transition-colors hover:text-foreground sm:text-sm"
              >
                Sign in
              </Link>
              <Link
                href="/start"
                className="whitespace-nowrap rounded-lg bg-cta px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-cta-hover sm:px-4 sm:py-2 sm:text-sm"
              >
                Start review
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
