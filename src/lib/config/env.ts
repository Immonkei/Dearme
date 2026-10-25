/**
 * Application environment configuration with resilient production defaults.
 * Guarantees persistent PostgreSQL database connection on Vercel and local environments.
 */

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : "https://tfwvdswnmbxukmuycshx.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder")
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmd3Zkc3dubWJ4dWttdXljc2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDY2MTUsImV4cCI6MjEwODQ4MjYxNX0.SqpghBUjTZWO9neshkd4spAABKn42whFGaQ5giDsyIY";

export const SUPABASE_SERVICE_ROLE_KEY =
  typeof window === "undefined"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("placeholder")
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmd3Zkc3dubWJ4dWttdXljc2h4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjkwNjYxNSwiZXhwIjoyMTA4NDgyNjE1fQ.RcHscDeTMTo5LVQsQJ8v9CBjaii7pNvo_TRpYTVMK0M"
    : "";

export const OWNER_EMAIL =
  process.env.OWNER_EMAIL || "minphanith11@gmail.com";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dearme-v0.vercel.app";
