import Link from "next/link";
import { getEntries } from "@/lib/journal/repository";
import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import { Calendar, ArrowRight, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const publishedEntries = await getEntries({ sort: "date_desc" }, true);
  const featured = publishedEntries.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text selection:bg-journal-accent/20">
      <PublicNav />

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 text-center">
        <h1 className="font-journal-serif text-4xl sm:text-6xl font-bold tracking-tight text-journal-text leading-[1.15] mb-6 text-balance">
          Letters to the person I am becoming.
        </h1>

        <p className="text-lg sm:text-xl text-journal-muted max-w-xl mx-auto leading-relaxed mb-8 font-journal-serif italic">
          &ldquo;Your life, your memories, your words — you decide what the world gets to see.&rdquo;
        </p>

        <p className="text-sm sm:text-base text-journal-muted max-w-lg mx-auto leading-relaxed mb-10 font-journal-sans">
          A personal corner for my thoughts, quiet mornings, and the lessons I am learning as I grow. Most of what I write is private; only these few reflections are shared with the open world.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/entries"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-journal-accent text-white hover:bg-journal-accent-hover transition-colors shadow-xs hover:shadow-sm"
          >
            <span>Read My Letters</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white text-journal-text border border-journal-border hover:bg-journal-tag transition-colors"
          >
            <span>Why I Write</span>
          </Link>
        </div>
      </section>

      {/* Featured Published Entries */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="flex items-center justify-between pb-4 border-b border-journal-border mb-8">
          <h2 className="font-journal-serif text-2xl font-bold text-journal-text">
            Letters from My Days
          </h2>
          <Link
            href="/entries"
            className="text-xs font-semibold text-journal-accent hover:text-journal-accent-hover flex items-center gap-1.5 transition-colors"
          >
            <span>Browse all letters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="bg-white border border-journal-border rounded-2xl p-12 text-center text-sm text-journal-muted italic font-journal-serif">
            I haven&apos;t shared any public reflections yet.
          </div>
        ) : (
          <div className="divide-y divide-journal-border/80">
            {featured.map((entry) => {
              const formattedDate = new Date(
                entry.entry_date + "T00:00:00"
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });

              const preview =
                entry.excerpt ||
                entry.content.blocks.find((b) => "text" in b)?.text ||
                "";

              const wordCount = entry.content.blocks.reduce((acc, b) => {
                return acc + ("text" in b ? b.text.split(/\s+/).length : 0);
              }, 0);
              const readTime = Math.max(1, Math.ceil(wordCount / 180));

              return (
                <article key={entry.id} className="py-8 first:pt-0 group">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-journal-muted mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-journal-accent" />
                      <time dateTime={entry.entry_date} className="tabular-nums">
                        {formattedDate}
                      </time>
                    </div>

                    {entry.category && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span className="font-medium text-journal-text bg-journal-tag px-2 py-0.5 rounded-md">
                          {entry.category}
                        </span>
                      </>
                    )}

                    <span aria-hidden="true">•</span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <Clock className="w-3 h-3" />
                      {readTime} min read
                    </span>
                  </div>

                  <h3 className="font-journal-serif text-2xl sm:text-3xl font-bold text-journal-text group-hover:text-journal-accent transition-colors mb-3 leading-snug text-balance">
                    <Link href={`/entries/${entry.slug}`}>{entry.title}</Link>
                  </h3>

                  <p className="text-sm sm:text-base text-journal-muted line-clamp-3 mb-4 leading-relaxed font-journal-sans">
                    {preview}
                  </p>

                  <Link
                    href={`/entries/${entry.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-journal-accent hover:text-journal-accent-hover gap-1.5 transition-colors"
                  >
                    <span>Read letter</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <PublicFooter />
    </div>
  );
}
