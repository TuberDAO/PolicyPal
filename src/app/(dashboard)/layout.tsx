import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/constants";

/**
 * Dashboard layout — wraps all authenticated customer pages.
 *
 * Verifies the session server-side and redirects to /login if missing.
 * The proxy also checks auth, so this is a defense-in-depth layer.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <>
      <header className="border-b border-border bg-surface px-6 py-3">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
          <Link
            href="/"
            className="font-heading text-base font-semibold tracking-tight"
          >
            {BRAND.name}
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted sm:inline">
              {user.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm font-medium text-accent hover:underline"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col px-6 py-8">{children}</main>
    </>
  );
}
