import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import { BookOpen, Compass, Heart, Feather } from "lucide-react";

export const metadata = {
  title: "Why I Write | Dear Me",
  description: "A personal letter by Nithh on why I keep this journal, quiet reflection, and becoming who I am.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text selection:bg-journal-accent/20">
      <PublicNav />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex-1">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium text-journal-accent bg-journal-accent-light mb-4 border border-journal-accent/20">
            <Feather className="w-3.5 h-3.5" />
            <span>A Personal Letter by Nithh</span>
          </div>

          <h1 className="font-journal-serif text-3xl sm:text-5xl font-bold tracking-tight text-journal-text mb-4 text-balance">
            Why I Keep This Journal
          </h1>
          <p className="font-journal-serif text-lg sm:text-xl text-journal-muted italic">
            Letters to the person I am becoming.
          </p>
        </header>

        <div className="bg-white border border-journal-border rounded-3xl p-8 sm:p-12 shadow-xs space-y-6 font-journal-serif text-base sm:text-lg text-journal-text leading-relaxed">
          <p>
            I’m Nithh. I started keeping this journal because my head was constantly getting too full, and I needed a place where I didn’t have to perform.
          </p>

          <blockquote className="border-l-3 border-journal-accent pl-5 my-6 italic text-journal-muted text-lg sm:text-xl font-journal-serif bg-journal-bg/50 py-3 rounded-r-xl">
            &ldquo;Your life, your memories, your words — you decide what the world gets to see.&rdquo;
          </blockquote>

          <p>
            In a world that constantly asks us to broadcast everything for feedback and applause, it is easy to lose track of what you actually feel. I wanted a quiet room where I could be completely honest with myself: to write through the heavy seasons, celebrate small quiet mornings, and untangle the lessons I keep having to learn.
          </p>

          <p>
            Most of what I write stays locked away in my private pages — just for me. But occasionally, when a thought feels tender and grounded enough to share, I leave it out in the open for anyone who might find comfort in it.
          </p>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-8 mt-8 border-t border-journal-border font-journal-sans text-sm">
            <div className="bg-journal-bg/60 p-4.5 rounded-2xl border border-journal-border/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-journal-accent-light text-journal-accent flex items-center justify-center mb-1">
                <Heart className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-journal-text text-sm">Honesty Over Polish</h2>
              <p className="text-xs text-journal-muted leading-relaxed">
                No performances or expectations. Just honest words on how life actually feels.
              </p>
            </div>

            <div className="bg-journal-bg/60 p-4.5 rounded-2xl border border-journal-border/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-journal-accent-light text-journal-accent flex items-center justify-center mb-1">
                <Compass className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-journal-text text-sm">At My Own Pace</h2>
              <p className="text-xs text-journal-muted leading-relaxed">
                No schedules, likes, or notifications. Writing when a moment calls to be remembered.
              </p>
            </div>

            <div className="bg-journal-bg/60 p-4.5 rounded-2xl border border-journal-border/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-journal-accent-light text-journal-accent flex items-center justify-center mb-1">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-journal-text text-sm">Letters to Myself</h2>
              <p className="text-xs text-journal-muted leading-relaxed">
                Keeping track of who I was, so I can appreciate how far I have come.
              </p>
            </div>
          </div>

          {/* Hand signature */}
          <div className="pt-8 mt-8 border-t border-journal-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <span className="italic font-journal-serif text-journal-muted">
              Dear Me — for me, by me.
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-journal-muted font-journal-sans">Written with love,</span>
              <span className="font-journal-serif font-bold text-journal-text text-lg">
                — Nithh
              </span>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
