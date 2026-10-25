import Link from "next/link";
import { getEntries } from "@/lib/journal/repository";
import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import { Calendar, Tag, ArrowRight } from "lucide-react";

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
    true // Strictly public only!
  );

  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text">
      <PublicNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <header className="mb-10 pb-6 border-b border-journal-border">
          <h1 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text mb-2">
            Published Archive
          </h1>
          <p className="text-sm text-journal-muted">
            The collection of reflections and memories shared with the open world.
          </p>
        </header>

        {entries.length === 0 ? (
          <div className="bg-white border border-journal-border rounded-2xl p-12 text-center text-sm text-journal-muted">
            No published entries found in this archive.
          </div>
        ) : (
          <div className="space-y-8">
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

              return (
                <article
                  key={entry.id}
                  className="bg-white border border-journal-border hover:border-journal-accent/50 rounded-2xl p-6 sm:p-8 transition-all shadow-xs hover:shadow-md group"
                >
                  <div className="flex items-center gap-2 text-xs text-journal-muted mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <time dateTime={entry.entry_date}>{formattedDate}</time>
                    {entry.category && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-journal-text bg-journal-tag px-2 py-0.5 rounded-md">
                          {entry.category}
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="font-journal-serif text-2xl sm:text-3xl font-bold text-journal-text group-hover:text-journal-accent transition-colors mb-3">
                    <Link href={`/entries/${entry.slug}`}>{entry.title}</Link>
                  </h2>

                  <p className="text-sm text-journal-muted leading-relaxed line-clamp-3 mb-6 font-journal-sans">
                    {preview}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-journal-border/60 text-xs">
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
                      className="inline-flex items-center gap-1 text-journal-accent font-medium hover:underline"
                    >
                      <span>Read Entry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
