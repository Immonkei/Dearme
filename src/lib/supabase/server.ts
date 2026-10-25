import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient(url, anonKey, {
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
 * Check if the current requester is the authorized owner
 */
export async function getAuthorizedOwner() {
  const cookieStore = await cookies();
  
  // Dev cookie check
  const devAuth = cookieStore.get("dearme_dev_auth");
  if (devAuth?.value === "authenticated") {
    return {
      id: "owner-dev-uuid",
      email: process.env.OWNER_EMAIL || "owner@example.com",
      role: "authenticated",
    };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url.includes("placeholder")) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const ownerEmail = process.env.OWNER_EMAIL;
    if (ownerEmail && user.email?.toLowerCase() !== ownerEmail.toLowerCase()) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("Error verifying owner:", err);
    return null;
  }
}
