import Link from "next/link";
import { getEntries } from "@/lib/journal/repository";
import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import { Calendar, Feather, ArrowRight, Sparkles } from "lucide-react";

export default async function HomePage() {
  const publishedEntries = await getEntries({ sort: "date_desc" }, true);
  const featured = publishedEntries.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text">
      <PublicNav />

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-journal-accent bg-journal-accent-light border border-journal-accent/30 mb-6">
          <Feather className="w-3.5 h-3.5" />
          <span>A Personal Journal</span>
        </div>

        <h1 className="font-journal-serif text-4xl sm:text-6xl font-bold tracking-tight text-journal-text leading-tight mb-6">
          Letters to the person I am becoming.
        </h1>

        <p className="text-base sm:text-lg text-journal-muted max-w-xl mx-auto leading-relaxed mb-8 font-journal-serif italic">
          &ldquo;Your life, your memories, your words — you decide what the world gets to see.&rdquo;
        </p>

        <p className="text-sm text-journal-muted max-w-lg mx-auto leading-relaxed mb-10">
          This is a personal sanctuary of thoughts, milestones, and quiet days. Only selected entries are illuminated for the world to read.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/entries"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-journal-accent text-white hover:bg-journal-accent-hover transition-colors shadow-xs"
          >
            <span>Explore the Archive</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-white text-journal-text border border-journal-border hover:bg-journal-tag transition-colors"
          >
            <span>About Dear Me</span>
          </Link>
        </div>
      </section>

      {/* Recent Published Entries */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="flex items-center justify-between pb-4 border-b border-journal-border mb-8">
          <h2 className="font-journal-serif text-2xl font-bold text-journal-text">
            Recent Letters
          </h2>
          <Link
            href="/entries"
            className="text-xs font-medium text-journal-accent hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="bg-white border border-journal-border rounded-2xl p-12 text-center text-sm text-journal-muted italic">
            No letters have been published to the world yet.
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

              return (
                <article key={entry.id} className="py-8 first:pt-0 group">
                  <div className="flex items-center gap-2 text-xs text-journal-muted mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <time dateTime={entry.entry_date}>{formattedDate}</time>
                    {entry.category && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-journal-text">
                          {entry.category}
                        </span>
                      </>
                    )}
                    {entry.mood && (
                      <>
                        <span>•</span>
                        <span className="capitalize text-journal-accent">
                          {entry.mood}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-journal-serif text-2xl font-bold text-journal-text group-hover:text-journal-accent transition-colors mb-2">
                    <Link href={`/entries/${entry.slug}`}>{entry.title}</Link>
                  </h3>

                  <p className="text-sm text-journal-muted line-clamp-3 mb-4 leading-relaxed font-journal-sans">
                    {preview}
                  </p>

                  <Link
                    href={`/entries/${entry.slug}`}
                    className="inline-flex items-center text-xs font-medium text-journal-accent hover:underline gap-1"
                  >
                    <span>Read reflection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
