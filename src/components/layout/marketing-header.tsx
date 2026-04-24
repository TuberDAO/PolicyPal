import Link from "next/link";
import type { User } from "@supabase/supabase-js";

export function MarketingHeader({
  user,
  logoutAction,
}: {
  user: User | null;
  logoutAction?: () => Promise<void>;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex h-9 shrink-0 items-center font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          WinYourAppeal
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="#examples"
            className="hidden text-sm text-muted transition-colors hover:text-foreground sm:inline"
          >
            Examples
          </a>
          <a
            href="#pricing"
            className="hidden text-sm text-muted transition-colors hover:text-foreground sm:inline"
          >
            Pricing
          </a>

          {user ? (
            /* Logged-in state: Dashboard button + Log out link (exactly one of each) */
            <>
              <Link
                href="/dashboard"
                className="rounded-lg bg-cta px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-cta-hover hover:shadow-xl sm:px-4 sm:py-2"
              >
                Dashboard
              </Link>
              {logoutAction && (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    Log out
                  </button>
                </form>
              )}
            </>
          ) : (
            /* Logged-out state: Sign in link + Start review button */
            <>
              <Link
                href="/login"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/start"
                className="rounded-full bg-cta px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-cta-hover hover:shadow-xl sm:px-4 sm:py-2"
              >
                Start your case
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
