import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/constants";

/**
 * Admin layout — wraps all admin/reviewer pages.
 *
 * Enforces two checks:
 * 1. User must be authenticated (redirect to /login).
 * 2. User must have staff role (return 404 — not 403 — to avoid revealing
 *    admin routes to non-staff users).
 *
 * Role is checked via the profiles table with RLS.
 */
export default async function AdminLayout({
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

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = data as { role: string } | null;
  const isStaff = profile?.role === "admin" || profile?.role === "reviewer";

  if (!isStaff) {
    notFound();
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
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="font-heading text-base font-semibold tracking-tight"
            >
              {BRAND.name}
            </Link>
            <span className="rounded bg-accent-light px-2 py-0.5 text-xs font-medium text-accent">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Case Queue
            </Link>
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
