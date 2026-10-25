"use client";

import { useState, useTransition } from "react";
import { HeadspaceData } from "@/types/journal";
import { updateHeadspaceAction } from "@/actions/headspace";
import {
  Brain,
  Coffee,
  Wind,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface HeadspaceEditorProps {
  initialData: HeadspaceData;
}

export function HeadspaceEditor({ initialData }: HeadspaceEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [stateOfMind, setStateOfMind] = useState(initialData.stateOfMind);
  const [dailyRitual, setDailyRitual] = useState(initialData.dailyRitual);
  const [lettingGoOf, setLettingGoOf] = useState(initialData.lettingGoOf);
  const [holdingOnto, setHoldingOnto] = useState(initialData.holdingOnto);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("stateOfMind", stateOfMind);
    formData.set("dailyRitual", dailyRitual);
    formData.set("lettingGoOf", lettingGoOf);
    formData.set("holdingOnto", holdingOnto);

    startTransition(async () => {
      const res = await updateHeadspaceAction(formData);
      if (res.error) {
        setToast({ type: "error", text: res.error });
      } else {
        setToast({
          type: "success",
          text: "Headspace updated successfully! It is now live on your home page.",
        });
        setTimeout(() => setToast(null), 4000);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-xl border flex items-center justify-between shadow-xs transition-all ${
            toast.type === "success"
              ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
              : "bg-red-50/90 border-red-300 text-red-950"
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold text-journal-accent hover:underline inline-flex items-center gap-1 shrink-0 ml-3"
          >
            <span>View Home</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Editor Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-journal-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xs space-y-5"
          >
            <div className="pb-3 border-b border-journal-border">
              <h2 className="font-journal-serif text-lg sm:text-xl font-bold text-journal-text">
                Edit Current Headspace
              </h2>
              <p className="text-xs text-journal-muted mt-1 font-journal-sans leading-relaxed">
                Update what’s occupying your thoughts. Changes appear immediately on the public home page for visitors to read your state of mind.
              </p>
            </div>

            {/* Field 1: State of Mind */}
            <div className="space-y-1.5">
              <label
                htmlFor="stateOfMind"
                className="flex items-center gap-2 text-xs font-semibold text-journal-accent uppercase tracking-wider"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>1. State of Mind</span>
              </label>
              <textarea
                id="stateOfMind"
                rows={3}
                value={stateOfMind}
                onChange={(e) => setStateOfMind(e.target.value)}
                required
                placeholder="What is your primary mental or emotional feeling right now?"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-journal-bg/50 border border-journal-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journal-accent/30 focus:border-journal-accent transition-colors text-journal-text resize-y font-journal-serif"
              />
            </div>

            {/* Field 2: Daily Ritual */}
            <div className="space-y-1.5">
              <label
                htmlFor="dailyRitual"
                className="flex items-center gap-2 text-xs font-semibold text-journal-accent uppercase tracking-wider"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>2. Daily Ritual</span>
              </label>
              <textarea
                id="dailyRitual"
                rows={3}
                value={dailyRitual}
                onChange={(e) => setDailyRitual(e.target.value)}
                required
                placeholder="What quiet habit or routine is anchoring your days?"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-journal-bg/50 border border-journal-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journal-accent/30 focus:border-journal-accent transition-colors text-journal-text resize-y font-journal-serif"
              />
            </div>

            {/* Field 3: Letting Go Of */}
            <div className="space-y-1.5">
              <label
                htmlFor="lettingGoOf"
                className="flex items-center gap-2 text-xs font-semibold text-journal-accent uppercase tracking-wider"
              >
                <Wind className="w-3.5 h-3.5" />
                <span>3. Letting Go Of</span>
              </label>
              <textarea
                id="lettingGoOf"
                rows={3}
                value={lettingGoOf}
                onChange={(e) => setLettingGoOf(e.target.value)}
                required
                placeholder="What habits, anxieties, or past expectations are you releasing?"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-journal-bg/50 border border-journal-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journal-accent/30 focus:border-journal-accent transition-colors text-journal-text resize-y font-journal-serif"
              />
            </div>

            {/* Field 4: Holding Onto */}
            <div className="space-y-1.5">
              <label
                htmlFor="holdingOnto"
                className="flex items-center gap-2 text-xs font-semibold text-journal-accent uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>4. Holding Onto</span>
              </label>
              <textarea
                id="holdingOnto"
                rows={3}
                value={holdingOnto}
                onChange={(e) => setHoldingOnto(e.target.value)}
                required
                placeholder="What affirmations, people, or quiet joys are keeping you grounded?"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-journal-bg/50 border border-journal-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journal-accent/30 focus:border-journal-accent transition-colors text-journal-text resize-y font-journal-serif"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg text-white bg-journal-accent hover:bg-journal-accent-hover transition-colors shadow-xs disabled:opacity-60 cursor-pointer min-h-[42px]"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving headspace...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Headspace</span>
                  </>
                )}
              </button>

              <Link
                href="/"
                target="_blank"
                className="text-xs text-journal-muted hover:text-journal-text inline-flex items-center gap-1 font-medium transition-colors"
              >
                <span>Preview live on Home</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </form>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-journal-muted uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 text-journal-accent" />
              <span>Live Public Preview</span>
            </div>
            <span className="text-[11px] text-journal-muted italic">Updates as you type</span>
          </div>

          <div className="space-y-3">
            {/* Tile 1 */}
            <div className="bg-white border border-journal-border rounded-xl p-4 shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-journal-accent uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5 shrink-0" />
                <span>State of Mind</span>
              </div>
              <p className="font-journal-serif text-xs sm:text-sm text-journal-text italic leading-relaxed">
                &ldquo;{stateOfMind || "..."}&rdquo;
              </p>
            </div>

            {/* Tile 2 */}
            <div className="bg-white border border-journal-border rounded-xl p-4 shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-journal-accent uppercase tracking-wider">
                <Coffee className="w-3.5 h-3.5 shrink-0" />
                <span>Daily Ritual</span>
              </div>
              <p className="font-journal-serif text-xs sm:text-sm text-journal-text italic leading-relaxed">
                &ldquo;{dailyRitual || "..."}&rdquo;
              </p>
            </div>

            {/* Tile 3 */}
            <div className="bg-white border border-journal-border rounded-xl p-4 shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-journal-accent uppercase tracking-wider">
                <Wind className="w-3.5 h-3.5 shrink-0" />
                <span>Letting Go Of</span>
              </div>
              <p className="font-journal-serif text-xs sm:text-sm text-journal-text italic leading-relaxed">
                &ldquo;{lettingGoOf || "..."}&rdquo;
              </p>
            </div>

            {/* Tile 4 */}
            <div className="bg-white border border-journal-border rounded-xl p-4 shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-journal-accent uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Holding Onto</span>
              </div>
              <p className="font-journal-serif text-xs sm:text-sm text-journal-text italic leading-relaxed">
                &ldquo;{holdingOnto || "..."}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
