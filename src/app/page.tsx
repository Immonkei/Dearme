import Link from "next/link";
import { getEntries, getHeadspace } from "@/lib/journal/repository";
import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import {
  Calendar,
  Clock,
  ArrowRight,
  Brain,
  Coffee,
  Wind,
  Sparkles,
  Feather,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const publishedEntries = await getEntries({ sort: "date_desc" }, true);
  const recentEntries = publishedEntries.slice(0, 3);
  const headspace = await getHeadspace();

  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text selection:bg-journal-accent/20">
      <PublicNav />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 w-full">
        {/* =========================================================================
            HERO — COMPACT & AIRY
            ========================================================================= */}
        <section className="text-center mb-12 sm:mb-16 relative">
          <div
            aria-hidden="true"
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-journal-accent/5 rounded-full blur-3xl pointer-events-none"
          />

          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium text-journal-accent bg-journal-accent-light mb-4 sm:mb-5 border border-journal-accent/20 shadow-xs">
            <Feather className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Dear Me</span>
            <span className="text-journal-muted/40 font-normal">•</span>
            <span className="italic font-journal-serif">for me, by me</span>
            <span className="text-journal-muted/40 font-normal">•</span>
            <span className="font-semibold text-journal-text">Nithh</span>
          </div>

          <h1 className="font-journal-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-journal-text leading-[1.18] mb-3 sm:mb-4 text-balance">
            Letters to the person I am becoming.
          </h1>

          <p className="text-base sm:text-lg text-journal-muted max-w-lg mx-auto leading-relaxed mb-3 sm:mb-4 font-journal-serif italic">
            &ldquo;Your life, your memories, your words — you decide what the world gets to see.&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-journal-muted/90 max-w-md mx-auto leading-relaxed mb-6 sm:mb-8 font-journal-sans">
            Welcome to my personal corner. I’m Nithh. I write here not to perform for an audience, but to slow down, make sense of my thoughts, and stay honest with who I am.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/entries"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-journal-accent text-white hover:bg-journal-accent-hover transition-all duration-200 shadow-xs hover:-translate-y-0.5 active:translate-y-0 min-h-[40px]"
            >
              <span>Read My Letters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-journal-text border border-journal-border hover:bg-journal-tag transition-all duration-200 shadow-xs hover:-translate-y-0.5 active:translate-y-0 min-h-[40px]"
            >
              <span>Why I Write</span>
            </Link>
          </div>
        </section>

        {/* =========================================================================
            INSIDE MY HEAD RIGHT NOW (HEADSPACE)
            ========================================================================= */}
        <section className="mb-12 sm:mb-16">
          <div className="text-center mb-5 sm:mb-6">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-journal-accent mb-1 block">
              Current Headspace
            </span>
            <h2 className="font-journal-serif text-xl sm:text-2xl font-bold text-journal-text">
              Inside My Mind Right Now
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white border border-journal-border rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-journal-accent uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5 shrink-0" />
                <span>State of Mind</span>
              </div>
              <p className="font-journal-serif text-sm sm:text-base text-journal-text italic leading-relaxed">
                &ldquo;{headspace.stateOfMind}&rdquo;
              </p>
            </div>

            <div className="bg-white border border-journal-border rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-journal-accent uppercase tracking-wider">
                <Coffee className="w-3.5 h-3.5 shrink-0" />
                <span>Daily Ritual</span>
              </div>
              <p className="font-journal-serif text-sm sm:text-base text-journal-text italic leading-relaxed">
                &ldquo;{headspace.dailyRitual}&rdquo;
              </p>
            </div>

            <div className="bg-white border border-journal-border rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-journal-accent uppercase tracking-wider">
                <Wind className="w-3.5 h-3.5 shrink-0" />
                <span>Letting Go Of</span>
              </div>
              <p className="font-journal-serif text-sm sm:text-base text-journal-text italic leading-relaxed">
                &ldquo;{headspace.lettingGoOf}&rdquo;
              </p>
            </div>

            <div className="bg-white border border-journal-border rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-journal-accent uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Holding Onto</span>
              </div>
              <p className="font-journal-serif text-sm sm:text-base text-journal-text italic leading-relaxed">
                &ldquo;{headspace.holdingOnto}&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            RECENT LETTERS PREVIEW
            ========================================================================= */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-end justify-between pb-3 border-b border-journal-border mb-5 sm:mb-6">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-journal-accent mb-0.5 block">
                Selected Writings
              </span>
              <h2 className="font-journal-serif text-xl sm:text-2xl font-bold text-journal-text">
                Recent Letters
              </h2>
            </div>

            <Link
              href="/entries"
              className="text-xs font-semibold text-journal-accent hover:text-journal-accent-hover flex items-center gap-1 transition-colors py-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentEntries.map((entry) => {
              const formattedDate = new Date(
                entry.entry_date + "T00:00:00"
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              const blocks = Array.isArray(entry.content?.blocks)
                ? entry.content.blocks
                : [];
              const wordCount = blocks.reduce((acc, b) => {
                return acc + ("text" in b && typeof b.text === "string" ? b.text.split(/\s+/).length : 0);
              }, 0);
              const readTime = Math.max(1, Math.ceil(wordCount / 180));

              return (
                <article
                  key={entry.id}
                  className="bg-white border border-journal-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xs hover:border-journal-accent/40 transition-all duration-200 group"
                >
                  <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-journal-muted mb-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-journal-accent" />
                      <time dateTime={entry.entry_date} className="tabular-nums">
                        {formattedDate}
                      </time>
                    </div>
                    {entry.category && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span className="font-medium text-journal-text bg-journal-tag px-2 py-0.2 rounded-full text-[10px] sm:text-[11px]">
                          {entry.category}
                        </span>
                      </>
                    )}
                    <span aria-hidden="true">•</span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {readTime}m read
                    </span>
                  </div>

                  <h3 className="font-journal-serif text-lg sm:text-xl font-bold text-journal-text group-hover:text-journal-accent transition-colors mb-2 leading-snug">
                    <Link href={`/entries/${entry.slug}`}>{entry.title}</Link>
                  </h3>

                  {entry.excerpt && (
                    <p className="text-xs sm:text-sm text-journal-muted font-journal-sans line-clamp-2 leading-relaxed mb-3">
                      {entry.excerpt}
                    </p>
                  )}

                  <Link
                    href={`/entries/${entry.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-journal-accent hover:text-journal-accent-hover transition-colors py-0.5"
                  >
                    <span>Read letter</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            A THOUGHT ON PEACE
            ========================================================================= */}
        <section className="bg-white border border-journal-border rounded-2xl p-6 sm:p-8 shadow-xs text-center">
          <p className="font-journal-serif text-base sm:text-lg text-journal-text italic leading-relaxed max-w-md mx-auto mb-3">
            &ldquo;Nobody warns you about the quiet grief of outgrowing people, habits, and places you once loved. Growth isn’t always loud victories; sometimes it’s sitting alone on a Friday night realizing you finally prefer peace over company that drains you.&rdquo;
          </p>
          <p className="text-xs text-journal-muted font-journal-serif italic">
            — Nithh
          </p>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
