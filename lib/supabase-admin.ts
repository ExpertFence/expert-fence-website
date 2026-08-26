import { createClient } from "@supabase/supabase-js";

// Server-only client using the service role key. NEVER import this from a
// client component — it must only be used inside app/api/* route handlers.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
