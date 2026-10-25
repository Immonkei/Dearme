import Link from "next/link";
import { getEntries } from "@/lib/journal/repository";
import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import { Calendar, ArrowRight, Clock, Filter } from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/types/journal";

export const dynamic = "force-dynamic";

interface EntriesPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function PublicArchivePage({ searchParams }: EntriesPageProps) {
  const { category } = await searchParams;
  const entries = await getEntries(
    {
      category: category || undefined,
      sort: "date_desc",
    },
    true
  );

  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text selection:bg-journal-accent/20">
      <PublicNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 flex-1 w-full">
        <header className="mb-10 pb-6 border-b border-journal-border">
          <h1 className="font-journal-serif text-3xl sm:text-5xl font-bold tracking-tight text-journal-text mb-3">
            Letters I&apos;ve Shared
          </h1>
          <p className="text-sm sm:text-base text-journal-muted font-journal-serif italic">
            A quiet collection of reflections, memories, and lessons written by Nithh — for me, by me.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-journal-border/60">
            <span className="text-xs font-semibold text-journal-muted flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>

            <Link
              href="/entries"
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !category
                  ? "bg-journal-accent text-white"
                  : "bg-white text-journal-muted border border-journal-border hover:text-journal-text hover:bg-journal-tag"
              }`}
            >
              All
            </Link>

            {DEFAULT_CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <Link
                  key={cat}
                  href={`/entries?category=${encodeURIComponent(cat)}`}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-journal-accent text-white"
                      : "bg-white text-journal-muted border border-journal-border hover:text-journal-text hover:bg-journal-tag"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </header>

        {entries.length === 0 ? (
          <div className="bg-white border border-journal-border rounded-2xl p-12 text-center text-sm text-journal-muted">
            <p className="font-journal-serif italic text-base mb-2">No letters found in this archive category.</p>
            {category && (
              <Link
                href="/entries"
                className="inline-flex items-center text-xs font-semibold text-journal-accent hover:underline mt-2"
              >
                Clear filter &rarr;
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => {
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
                <article
                  key={entry.id}
                  className="bg-white border border-journal-border hover:border-journal-accent/60 rounded-2xl p-6 sm:p-8 transition-all shadow-xs hover:shadow-sm group"
                >
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-journal-muted mb-3">
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

                  <h2 className="font-journal-serif text-2xl sm:text-3xl font-bold text-journal-text group-hover:text-journal-accent transition-colors mb-3 leading-snug text-balance">
                    <Link href={`/entries/${entry.slug}`}>{entry.title}</Link>
                  </h2>

                  <p className="text-sm sm:text-base text-journal-muted leading-relaxed line-clamp-3 mb-6 font-journal-sans">
                    {preview}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-journal-border/70 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-journal-muted bg-journal-bg px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/entries/${entry.slug}`}
                      className="inline-flex items-center gap-1.5 text-journal-accent font-semibold hover:text-journal-accent-hover transition-colors"
                    >
                      <span>Read Letter</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
