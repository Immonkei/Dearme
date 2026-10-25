import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isPlaceholder = !url || url.includes("placeholder");

  let isAuthenticated = false;

  // 1. Check for dev auth cookie (useful for offline / local testing before Supabase project is linked)
  const devAuthCookie = request.cookies.get("dearme_dev_auth");
  if (devAuthCookie?.value === "authenticated") {
    isAuthenticated = true;
  }

  // 2. If valid Supabase credentials exist, verify with Supabase Auth
  if (!isAuthenticated && !isPlaceholder) {
    try {
      const supabase = createServerClient(url, anonKey!, {
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
        const ownerEmail = process.env.OWNER_EMAIL;
        if (!ownerEmail || user.email?.toLowerCase() === ownerEmail.toLowerCase()) {
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
