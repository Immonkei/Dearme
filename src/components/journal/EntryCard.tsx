import Link from "next/link";
import { JournalEntry } from "@/types/journal";
import { Lock, Globe, Calendar, Tag, Sparkles } from "lucide-react";

interface EntryCardProps {
  entry: JournalEntry;
  showStatus?: boolean;
}

export function EntryCard({ entry, showStatus = true }: EntryCardProps) {
  const formattedDate = new Date(entry.entry_date + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const previewText =
    entry.excerpt ||
    (entry.content?.blocks?.find((b) => "text" in b)?.text as string) ||
    "No preview available.";

  const isPublished = entry.status === "published";

  return (
    <article className="group bg-white border border-journal-border hover:border-journal-accent/50 rounded-xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Header metadata row */}
        <div className="flex items-center justify-between gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-journal-muted">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={entry.entry_date}>{formattedDate}</time>
          </div>

          <div className="flex items-center gap-2">
            {entry.mood && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-journal-accent bg-journal-accent-light px-2 py-0.5 rounded-full capitalize">
                <Sparkles className="w-2.5 h-2.5" />
                {entry.mood}
              </span>
            )}

            {showStatus && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  isPublished
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-900 border-amber-200"
                }`}
              >
                {isPublished ? (
                  <>
                    <Globe className="w-2.5 h-2.5" />
                    Published
                  </>
                ) : (
                  <>
                    <Lock className="w-2.5 h-2.5" />
                    Private
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-journal-serif text-xl sm:text-2xl font-semibold text-journal-text group-hover:text-journal-accent transition-colors mb-2 line-clamp-2">
          <Link href={`/journal/entries/${entry.id}`}>{entry.title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-journal-muted line-clamp-3 mb-4 leading-relaxed font-journal-sans">
          {previewText}
        </p>
      </div>

      {/* Footer: Category & Tags & Action */}
      <div className="pt-4 border-t border-journal-border/60 flex items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
          {entry.category && (
            <span className="font-medium text-journal-text bg-journal-tag px-2 py-0.5 rounded-md">
              {entry.category}
            </span>
          )}
          {entry.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-journal-muted bg-journal-bg px-2 py-0.5 rounded-md border border-journal-border/60"
            >
              #{tag}
            </span>
          ))}
          {entry.tags?.length > 3 && (
            <span className="text-journal-muted">+{entry.tags.length - 3}</span>
          )}
        </div>

        <Link
          href={`/journal/entries/${entry.id}`}
          className="text-journal-accent font-medium hover:underline shrink-0"
        >
          Open &rarr;
        </Link>
      </div>
    </article>
  );
}
