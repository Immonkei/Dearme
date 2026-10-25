import { createClient } from "@supabase/supabase-js";

/**
 * Supabase admin client using SERVICE_ROLE_KEY.
 * Must ONLY be used in secure server contexts (e.g. background sync or public image sync).
 * NEVER expose this to client code.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
