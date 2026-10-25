"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/actions/auth";
import { ArrowLeft, BookOpen, KeyRound, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const res = await signIn(formData);
      return res || null;
    },
    null
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-journal-bg text-journal-text selection:bg-journal-accent/20">
      <div className="w-full max-w-md">
        {/* Top return link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-journal-muted hover:text-journal-text transition-colors gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-journal-border rounded-2xl p-8 sm:p-10 shadow-xs">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-journal-accent-light text-journal-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-journal-serif text-3xl font-bold tracking-tight text-journal-text mb-2 text-balance">
              Private Journal
            </h1>
            <p className="text-xs sm:text-sm text-journal-muted leading-relaxed">
              Sign in to write and reflect in your personal space.
            </p>
          </div>

          {state?.error && (
            <div
              role="alert"
              className="mb-6 p-3.5 bg-red-50/80 border border-red-200 text-red-900 text-xs rounded-xl flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold tracking-wider uppercase text-journal-muted mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="owner@example.com"
                placeholder="owner@example.com"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 text-sm bg-journal-bg/50 border border-journal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-journal-accent/30 focus:border-journal-accent transition-colors text-journal-text"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold tracking-wider uppercase text-journal-muted mb-1.5"
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
                className="w-full px-3.5 py-2.5 text-sm bg-journal-bg/50 border border-journal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-journal-accent/30 focus:border-journal-accent transition-colors text-journal-text"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-journal-accent hover:bg-journal-accent-hover transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
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
            <p className="text-xs text-journal-muted italic font-journal-serif">
              Letters to the person I am becoming.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
