import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <>
      {/* Future: <CustomerNav user={user} /> */}
      <main className="flex flex-1 flex-col px-6 py-8">{children}</main>
    </>
  );
}
