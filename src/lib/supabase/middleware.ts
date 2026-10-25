import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  OWNER_EMAIL,
} from "@/lib/config/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  let isAuthenticated = false;

  // 1. Check for dev auth cookie (useful for offline / owner password login)
  const devAuthCookie = request.cookies.get("dearme_dev_auth");
  if (devAuthCookie?.value === "authenticated") {
    isAuthenticated = true;
  }

  // 2. Verify with Supabase Auth
  if (!isAuthenticated && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        if (!OWNER_EMAIL || user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
          isAuthenticated = true;
        }
      }
    } catch (err) {
      console.warn("Supabase auth check failed in middleware:", err);
    }
  }

  const pathname = request.nextUrl.pathname;

  // Protect /journal and subpaths
  if (pathname.startsWith("/journal") && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated user from /login to /journal
  if (pathname === "/login" && isAuthenticated) {
    const journalUrl = request.nextUrl.clone();
    journalUrl.pathname = "/journal";
    return NextResponse.redirect(journalUrl);
  }

  return supabaseResponse;
}
