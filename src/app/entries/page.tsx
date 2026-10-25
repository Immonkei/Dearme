import Link from "next/link";
import { getEntries } from "@/lib/journal/repository";
import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import { Calendar, Clock, ArrowRight, Filter, Feather } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EntriesPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function EntriesPage({ searchParams }: EntriesPageProps) {
  const { category } = await searchParams;

  const allPublished = await getEntries({ sort: "date_desc" }, true);
  const categories = [
    "All",
    ...Array.from(new Set(allPublished.map((e) => e.category).filter(Boolean))) as string[],
  ];

  const entries = category
    ? allPublished.filter((e) => e.category?.toLowerCase() === category.toLowerCase())
    : allPublished;

  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text selection:bg-journal-accent/20">
      <PublicNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 flex-1 w-full">
        {/* Header */}
        <header className="mb-8 pb-5 border-b border-journal-border text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium text-journal-accent bg-journal-accent-light mb-3 sm:mb-4 border border-journal-accent/20">
            <Feather className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Letters by Nithh</span>
          </div>
          <h1 className="font-journal-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-journal-text mb-2.5">
            Letters from My Days
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-journal-muted font-journal-serif italic">
            A quiet collection of reflections, memories, and lessons I felt ready to leave out in the open.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-5 pt-3.5 border-t border-journal-border/60 justify-center sm:justify-start">
            <span className="text-xs font-semibold text-journal-muted flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>

            {categories.map((cat) => {
              const isSelected = (!category && cat === "All") || category?.toLowerCase() === cat.toLowerCase();
              const href = cat === "All" ? "/entries" : `/entries?category=${encodeURIComponent(cat)}`;

              return (
                <Link
                  key={cat}
                  href={href}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors min-h-[30px] inline-flex items-center ${
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

        {/* Letters list */}
        {entries.length === 0 ? (
          <div className="bg-white border border-journal-border rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center text-sm text-journal-muted italic font-journal-serif">
            No public letters found in this category.
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {entries.map((entry) => {
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
                  className="bg-white border border-journal-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs hover:border-journal-accent/40 transition-all duration-200 group"
                >
                  <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-journal-muted mb-2 sm:mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-journal-accent" />
                      <time dateTime={entry.entry_date} className="tabular-nums">
                        {formattedDate}
                      </time>
                    </div>

                    {entry.category && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span className="font-medium text-journal-text bg-journal-tag px-2 py-0.5 rounded-full text-[10px] sm:text-[11px]">
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

                  <h2 className="font-journal-serif text-xl sm:text-2xl md:text-3xl font-bold text-journal-text group-hover:text-journal-accent transition-colors mb-2 sm:mb-3 leading-snug">
                    <Link href={`/entries/${entry.slug}`}>{entry.title}</Link>
                  </h2>

                  {entry.excerpt && (
                    <p className="text-xs sm:text-sm md:text-base text-journal-muted font-journal-sans line-clamp-3 leading-relaxed mb-4 sm:mb-5">
                      {entry.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-journal-border/60">
                    <Link
                      href={`/entries/${entry.slug}`}
                      className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-journal-accent hover:text-journal-accent-hover transition-colors py-1"
                    >
                      <span>Read letter</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <span className="text-xs text-journal-muted italic font-journal-serif">
                      by Nithh
                    </span>
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
