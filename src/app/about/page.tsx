import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import { BookOpen, ShieldCheck, Heart, Feather } from "lucide-react";

export const metadata = {
  title: "About Dear Me",
  description: "The philosophy and intention behind Dear Me: letters to the person I am becoming.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text">
      <PublicNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 flex-1">
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-full bg-journal-accent-light text-journal-accent flex items-center justify-center mx-auto mb-4">
            <Feather className="w-6 h-6" />
          </div>
          <h1 className="font-journal-serif text-4xl sm:text-5xl font-bold tracking-tight text-journal-text mb-4">
            About Dear Me
          </h1>
          <p className="font-journal-serif text-lg text-journal-muted italic">
            Letters to the person I am becoming.
          </p>
        </div>

        <div className="bg-white border border-journal-border rounded-2xl p-8 sm:p-12 shadow-xs space-y-8 font-journal-serif text-base sm:text-lg text-journal-text leading-relaxed">
          <p>
            Dear Me is an intimate personal journal. It was born from a desire to escape the noise, performance, and instant reactions of modern digital platforms.
          </p>

          <blockquote className="border-l-3 border-journal-accent pl-5 my-6 italic text-journal-muted">
            &ldquo;Your life, your memories, your words — you decide what the world gets to see.&rdquo;
          </blockquote>

          <p>
            Unlike social feeds, there are no follower counts here. There are no algorithms rewarding outrage, no like buttons, and no comment sections. Every entry begins completely in secret — private by default.
          </p>

          <p>
            When a lesson is learned, a joy is felt deeply, or a memory asks to be held under open light, it is published intentionally.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-journal-border not-italic font-journal-sans text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-journal-accent font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Private by Default</span>
              </div>
              <p className="text-xs text-journal-muted leading-relaxed">
                Writing is personal first. Publishing is always a conscious, deliberate choice.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-journal-accent font-semibold">
                <Heart className="w-4 h-4" />
                <span>Quiet & Unrushed</span>
              </div>
              <p className="text-xs text-journal-muted leading-relaxed">
                No metrics, no metrics chasing, no notifications. Just words and memories.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-journal-accent font-semibold">
                <BookOpen className="w-4 h-4" />
                <span>Literary Craft</span>
              </div>
              <p className="text-xs text-journal-muted leading-relaxed">
                Generous typography and thoughtful whitespace for comfortable reading.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
