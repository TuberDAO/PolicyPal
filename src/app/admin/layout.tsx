import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  // Cast needed: placeholder Database types resolve to `never` until generated.
  const profile = data as { role: string } | null;
  const isStaff = profile?.role === "admin" || profile?.role === "reviewer";

  if (!isStaff) {
    notFound();
  }

  return (
    <>
      {/* Future: <AdminNav /> with notification bell */}
      <main className="flex flex-1 flex-col px-6 py-8">{children}</main>
    </>
  );
}
