"use client";

import { useActionState } from "react";
import Link from "next/navigation";
import NextLink from "next/link";
import { signIn } from "@/actions/auth";
import { Lock, ArrowLeft, BookOpen, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const res = await signIn(formData);
      return res || null;
    },
    null
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-journal-bg text-journal-text">
      <div className="w-full max-w-md">
        {/* Top return link */}
        <div className="mb-8">
          <NextLink
            href="/"
            className="inline-flex items-center text-sm text-journal-muted hover:text-journal-text transition-colors gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dear Me</span>
          </NextLink>
        </div>

        {/* Card */}
        <div className="bg-white border border-journal-border rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-journal-accent-light text-journal-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="font-journal-serif text-3xl font-semibold tracking-tight text-journal-text mb-2">
              Owner Sign In
            </h1>
            <p className="text-sm text-journal-muted">
              Dear Me is a private space. Access is strictly limited to the journal owner.
            </p>
          </div>

          {state?.error && (
            <div
              role="alert"
              className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-start gap-2.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-journal-muted mb-1.5"
              >
                Owner Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="owner@example.com"
                placeholder="owner@example.com"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 text-sm bg-journal-bg/50 border border-journal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-journal-accent/40 focus:border-journal-accent transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-journal-muted mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                defaultValue="devpassword"
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 text-sm bg-journal-bg/50 border border-journal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-journal-accent/40 focus:border-journal-accent transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-journal-accent hover:bg-journal-accent-hover transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Unlocking journal...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Enter Journal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-journal-border text-center">
            <p className="text-xs text-journal-muted">
              Letters to the person I am becoming.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
