import Link from "next/link";
import { getEntries } from "@/lib/journal/repository";
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

  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text selection:bg-journal-accent/20">
      <PublicNav />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
        {/* =========================================================================
            HERO
            ========================================================================= */}
        <section className="text-center mb-20 relative">
          <div
            aria-hidden="true"
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-journal-accent/5 rounded-full blur-3xl pointer-events-none"
          />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-journal-accent bg-journal-accent-light mb-6 border border-journal-accent/20 shadow-xs">
            <Feather className="w-3.5 h-3.5" />
            <span>Dear Me</span>
            <span className="text-journal-muted/40 font-normal">•</span>
            <span className="italic font-journal-serif">for me, by me</span>
            <span className="text-journal-muted/40 font-normal">•</span>
            <span className="font-semibold text-journal-text">Nithh</span>
          </div>

          <h1 className="font-journal-serif text-4xl sm:text-6xl font-bold tracking-tight text-journal-text leading-[1.14] mb-6 text-balance">
            Letters to the person I am becoming.
          </h1>

          <p className="text-lg sm:text-xl text-journal-muted max-w-xl mx-auto leading-relaxed mb-6 font-journal-serif italic">
            &ldquo;Your life, your memories, your words — you decide what the world gets to see.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-journal-muted max-w-lg mx-auto leading-relaxed mb-10 font-journal-sans">
            Welcome to my personal corner. I’m Nithh. I write here not to perform for an audience, but to slow down, make sense of my thoughts, and stay honest with who I am.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/entries"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-journal-accent text-white hover:bg-journal-accent-hover transition-all duration-200 shadow-xs hover:-translate-y-0.5"
            >
              <span>Read My Letters</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white text-journal-text border border-journal-border hover:bg-journal-tag transition-all duration-200 shadow-xs hover:-translate-y-0.5"
            >
              <span>Why I Write</span>
            </Link>
          </div>
        </section>

        {/* =========================================================================
            INSIDE MY HEAD RIGHT NOW (HEADSPACE)
            ========================================================================= */}
        <section className="mb-20">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent mb-1.5 block">
              Current Headspace
            </span>
            <h2 className="font-journal-serif text-2xl sm:text-3xl font-bold text-journal-text">
              Inside My Mind Right Now
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-journal-border rounded-2xl p-6 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-journal-accent uppercase tracking-wider">
                <Brain className="w-4 h-4 shrink-0" />
                <span>State of Mind</span>
              </div>
              <p className="font-journal-serif text-base text-journal-text italic leading-relaxed">
                &ldquo;Learning to quiet the 2:00 AM overthinking and trust that doing my best today was enough.&rdquo;
              </p>
            </div>

            <div className="bg-white border border-journal-border rounded-2xl p-6 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-journal-accent uppercase tracking-wider">
                <Coffee className="w-4 h-4 shrink-0" />
                <span>Daily Ritual</span>
              </div>
              <p className="font-journal-serif text-base text-journal-text italic leading-relaxed">
                &ldquo;Early morning silence before anyone speaks. Hot coffee, cool air, and zero screens for 30 minutes.&rdquo;
              </p>
            </div>

            <div className="bg-white border border-journal-border rounded-2xl p-6 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-journal-accent uppercase tracking-wider">
                <Wind className="w-4 h-4 shrink-0" />
                <span>Letting Go Of</span>
              </div>
              <p className="font-journal-serif text-base text-journal-text italic leading-relaxed">
                &ldquo;The pressure to have my entire twenties figured out. Closed doors that I tried too hard to keep open.&rdquo;
              </p>
            </div>

            <div className="bg-white border border-journal-border rounded-2xl p-6 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-journal-accent uppercase tracking-wider">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Holding Onto</span>
              </div>
              <p className="font-journal-serif text-base text-journal-text italic leading-relaxed">
                &ldquo;Gentleness with my own mistakes. Friends who love me in my quiet seasons. The person I am becoming.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            RECENT LETTERS PREVIEW
            ========================================================================= */}
        <section className="mb-20">
          <div className="flex items-end justify-between pb-4 border-b border-journal-border mb-8">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent mb-1 block">
                Selected Writings
              </span>
              <h2 className="font-journal-serif text-2xl sm:text-3xl font-bold text-journal-text">
                Recent Letters
              </h2>
            </div>

            <Link
              href="/entries"
              className="text-xs font-semibold text-journal-accent hover:text-journal-accent-hover flex items-center gap-1.5 transition-colors"
            >
              <span>View all letters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-6">
            {recentEntries.map((entry) => {
              const formattedDate = new Date(
                entry.entry_date + "T00:00:00"
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });

              const wordCount = entry.content.blocks.reduce((acc, b) => {
                return acc + ("text" in b ? b.text.split(/\s+/).length : 0);
              }, 0);
              const readTime = Math.max(1, Math.ceil(wordCount / 180));

              return (
                <article
                  key={entry.id}
                  className="bg-white border border-journal-border rounded-2xl p-6 sm:p-8 shadow-xs hover:border-journal-accent/40 transition-all duration-200 group"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-journal-muted mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-journal-accent" />
                      <time dateTime={entry.entry_date} className="tabular-nums">
                        {formattedDate}
                      </time>
                    </div>
                    {entry.category && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-journal-text bg-journal-tag px-2 py-0.5 rounded-full text-[11px]">
                          {entry.category}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <Clock className="w-3 h-3" />
                      {readTime} min read
                    </span>
                  </div>

                  <h3 className="font-journal-serif text-xl sm:text-2xl font-bold text-journal-text group-hover:text-journal-accent transition-colors mb-3 leading-snug">
                    <Link href={`/entries/${entry.slug}`}>{entry.title}</Link>
                  </h3>

                  {entry.excerpt && (
                    <p className="text-sm text-journal-muted font-journal-sans line-clamp-2 leading-relaxed mb-4">
                      {entry.excerpt}
                    </p>
                  )}

                  <Link
                    href={`/entries/${entry.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-journal-accent hover:text-journal-accent-hover transition-colors"
                  >
                    <span>Read letter</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            A THOUGHT ON PEACE
            ========================================================================= */}
        <section className="bg-white border border-journal-border rounded-3xl p-8 sm:p-12 shadow-xs text-center">
          <p className="font-journal-serif text-lg sm:text-xl text-journal-text italic leading-relaxed max-w-xl mx-auto mb-4">
            &ldquo;Nobody warns you about the quiet grief of outgrowing people, habits, and places you once loved. Growth isn’t always loud victories; sometimes it’s sitting alone on a Friday night realizing you finally prefer peace over company that drains you.&rdquo;
          </p>
          <p className="text-xs text-journal-muted font-journal-serif italic">
            — Nithh • Dear Me • for me, by me
          </p>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
