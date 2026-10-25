"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OWNER_EMAIL } from "@/lib/config/env";

export async function signIn(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/journal";

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const isOwnerEmail = email.toLowerCase() === OWNER_EMAIL.toLowerCase();

  // Try signing in via Supabase Auth
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      if (!isOwnerEmail) {
        await supabase.auth.signOut();
        return { error: "This account is not authorized as the journal owner." };
      }
      redirect(redirectTo);
    }
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
  }

  // Fallback owner direct password check (nithh123, devpassword, or admin123)
  if (
    isOwnerEmail &&
    (password === "nithh123" || password === "devpassword" || password === "admin123")
  ) {
    const cookieStore = await cookies();
    cookieStore.set("dearme_dev_auth", "authenticated", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    redirect(redirectTo);
  }

  return { error: "Invalid email or password." };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("dearme_dev_auth");

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore
  }

  redirect("/login");
}
