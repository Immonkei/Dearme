import Link from "next/link";
import { JournalEntry } from "@/types/journal";
import { Lock, Globe, Calendar, ArrowRight, Sparkles } from "lucide-react";

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
    <article className="group bg-white border border-journal-border hover:border-journal-accent/60 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 transition-all shadow-xs hover:shadow-sm flex flex-col justify-between">
      <div>
        {/* Header metadata row */}
        <div className="flex items-center justify-between gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-journal-muted">
            <Calendar className="w-3.5 h-3.5 text-journal-accent" />
            <time dateTime={entry.entry_date} className="tabular-nums">
              {formattedDate}
            </time>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {entry.mood && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-journal-accent bg-journal-accent-light px-2 sm:px-2.5 py-0.5 rounded-full capitalize">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{entry.mood}</span>
              </span>
            )}

            {showStatus && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full border ${
                  isPublished
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                    : "bg-amber-50 text-amber-950 border-amber-300"
                }`}
              >
                {isPublished ? (
                  <>
                    <Globe className="w-3 h-3 text-emerald-700" />
                    <span>Published</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-amber-800" />
                    <span>Private</span>
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-journal-serif text-lg sm:text-xl md:text-2xl font-bold text-journal-text group-hover:text-journal-accent transition-colors mb-2 leading-snug line-clamp-2 text-balance">
          <Link href={`/journal/entries/${entry.id}`}>{entry.title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="text-xs sm:text-sm text-journal-muted line-clamp-3 mb-4 leading-relaxed font-journal-sans">
          {previewText}
        </p>
      </div>

      {/* Footer: Category & Tags & Action */}
      <div className="pt-3 sm:pt-4 border-t border-journal-border/70 flex items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 overflow-hidden">
          {entry.category && (
            <span className="font-medium text-journal-text bg-journal-tag px-2 py-0.5 rounded-md text-[11px]">
              {entry.category}
            </span>
          )}
          {entry.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-journal-muted bg-journal-bg px-1.5 sm:px-2 py-0.5 rounded-md border border-journal-border/60 text-[11px]"
            >
              #{tag}
            </span>
          ))}
          {entry.tags?.length > 2 && (
            <span className="text-journal-muted tabular-nums text-[11px]">+{entry.tags.length - 2}</span>
          )}
        </div>

        <Link
          href={`/journal/entries/${entry.id}`}
          className="inline-flex items-center gap-1 text-journal-accent font-semibold hover:text-journal-accent-hover transition-colors shrink-0 py-1"
        >
          <span>Open</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
