"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/journal";

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const ownerEmail = process.env.OWNER_EMAIL || "owner@example.com";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Support local dev mode when Supabase is not connected yet
  if (!url || url.includes("placeholder")) {
    if (email.toLowerCase() === ownerEmail.toLowerCase()) {
      const cookieStore = await cookies();
      cookieStore.set("dearme_dev_auth", "authenticated", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      redirect(redirectTo);
    } else {
      return { error: `Unauthorized email. Access is reserved for ${ownerEmail}.` };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (ownerEmail && email.toLowerCase() !== ownerEmail.toLowerCase()) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized as the journal owner." };
  }

  redirect(redirectTo);
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("dearme_dev_auth");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url && !url.includes("placeholder")) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  }

  redirect("/login");
}
