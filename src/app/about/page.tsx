import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import { BookOpen, Compass, Heart } from "lucide-react";

export const metadata = {
  title: "Why I Write | Dear Me",
  description: "A personal letter on why I keep this journal, quiet reflection, and becoming who I am.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text selection:bg-journal-accent/20">
      <PublicNav />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 sm:py-28 flex-1">
        <header className="text-center mb-14">
          <h1 className="font-journal-serif text-4xl sm:text-6xl font-bold tracking-tight text-journal-text mb-4 text-balance">
            Why I Keep This Journal
          </h1>
          <p className="font-journal-serif text-xl text-journal-muted italic">
            Letters to the person I am becoming.
          </p>
        </header>

        <div className="bg-white border border-journal-border rounded-2xl p-8 sm:p-12 shadow-xs space-y-8 font-journal-serif text-lg text-journal-text leading-relaxed">
          <p>
            I started keeping this journal because my head was getting too full, and I needed a place where I didn&apos;t have to perform.
          </p>

          <blockquote className="border-l-2 border-journal-accent pl-5 my-8 italic text-journal-muted text-xl">
            &ldquo;Your life, your memories, your words — you decide what the world gets to see.&rdquo;
          </blockquote>

          <p>
            In a world that constantly asks us to broadcast everything for feedback and applause, it is easy to lose track of what you actually feel. I wanted a quiet room where I could be completely honest with myself: to write through the heavy seasons, celebrate small quiet mornings, and untangle the lessons I keep having to learn.
          </p>

          <p>
            Most of what I write stays locked away in my private pages — just for me. But occasionally, when a thought feels tender or grounded enough to share, I leave it out in the open for anyone who might find comfort in it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-journal-border not-italic font-journal-sans text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-journal-accent font-semibold">
                <Heart className="w-4 h-4 shrink-0" />
                <span>Honesty Over Polish</span>
              </div>
              <p className="text-xs text-journal-muted leading-relaxed">
                No performances or expectations. Just honest words on how life actually feels.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-journal-accent font-semibold">
                <Compass className="w-4 h-4 shrink-0" />
                <span>At My Own Pace</span>
              </div>
              <p className="text-xs text-journal-muted leading-relaxed">
                No schedules, likes, or notifications. Writing when a moment calls to be remembered.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-journal-accent font-semibold">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Letters to Myself</span>
              </div>
              <p className="text-xs text-journal-muted leading-relaxed">
                Keeping track of who I was, so I can appreciate how far I have come.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
