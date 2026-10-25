import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  OWNER_EMAIL,
} from "@/lib/config/env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Can be ignored if middleware is refreshing sessions
        }
      },
    },
  });
}

/**
 * Admin client with service role for trusted server actions
 */
export function createAdminClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Check if the current requester is the authorized owner
 */
export async function getAuthorizedOwner() {
  const cookieStore = await cookies();

  // Dev cookie check
  const devAuth = cookieStore.get("dearme_dev_auth");
  if (devAuth?.value === "authenticated") {
    return {
      id: "owner-dev-uuid",
      email: OWNER_EMAIL,
      role: "authenticated",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    if (OWNER_EMAIL && user.email?.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("Error verifying owner:", err);
    return null;
  }
}
