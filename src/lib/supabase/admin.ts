import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import { getClientEnv, getServerEnv } from "@/env";

/**
 * Supabase admin client — uses the service-role key and bypasses RLS.
 *
 * ONLY for trusted server-side work that genuinely needs elevated access:
 *   - Webhook handlers
 *   - Background jobs
 *   - Admin status transitions
 *
 * NEVER import this module from client code or use it for normal user operations.
 * Prefer the session-aware server client + RLS for anything user-facing.
 */
export function createAdminClient() {
  const { NEXT_PUBLIC_SUPABASE_URL } = getClientEnv();
  const { SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();

  return createClient<Database>(
    NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
