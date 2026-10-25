import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import { BookOpen, ShieldCheck, Heart } from "lucide-react";

export const metadata = {
  title: "About Dear Me",
  description: "The philosophy and intention behind Dear Me: letters to the person I am becoming.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text selection:bg-journal-accent/20">
      <PublicNav />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 sm:py-28 flex-1">
        <header className="text-center mb-14">
          <h1 className="font-journal-serif text-4xl sm:text-6xl font-bold tracking-tight text-journal-text mb-4 text-balance">
            About Dear Me
          </h1>
          <p className="font-journal-serif text-xl text-journal-muted italic">
            Letters to the person I am becoming.
          </p>
        </header>

        <div className="bg-white border border-journal-border rounded-2xl p-8 sm:p-12 shadow-xs space-y-8 font-journal-serif text-lg text-journal-text leading-relaxed">
          <p>
            Dear Me is an intimate personal daily journal. It was created from a quiet wish to escape the noise, performance, and instant reactions of modern digital platforms.
          </p>

          <blockquote className="border-l-2 border-journal-accent pl-5 my-8 italic text-journal-muted text-xl">
            &ldquo;Your life, your memories, your words — you decide what the world gets to see.&rdquo;
          </blockquote>

          <p>
            Unlike social feeds, there are no follower counts here. There are no algorithms optimizing for agitation, no like buttons, and no public comment threads. Every reflection begins completely in private — protected by default.
          </p>

          <p>
            When a lesson is learned, a quiet joy is felt, or a memory asks to be held under open light, it is published with intention.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-journal-border not-italic font-journal-sans text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-journal-accent font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Private by Default</span>
              </div>
              <p className="text-xs text-journal-muted leading-relaxed">
                Writing is personal first. Sharing is always an explicit, deliberate choice.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-journal-accent font-semibold">
                <Heart className="w-4 h-4 shrink-0" />
                <span>Quiet & Unrushed</span>
              </div>
              <p className="text-xs text-journal-muted leading-relaxed">
                No metrics chasing, no vanity counters, no notifications. Just your words and memories.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-journal-accent font-semibold">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Literary Craft</span>
              </div>
              <p className="text-xs text-journal-muted leading-relaxed">
                Generous typography and comfortable whitespace for distraction-free reading.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
