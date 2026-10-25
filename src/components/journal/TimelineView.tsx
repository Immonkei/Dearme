import Link from "next/link";
import { JournalEntry } from "@/types/journal";
import { Lock, Globe, Sparkles, Calendar, ArrowRight } from "lucide-react";

interface TimelineViewProps {
  entries: JournalEntry[];
}

export function TimelineView({ entries }: TimelineViewProps) {
  // Group entries by Year & Month
  const grouped = entries.reduce<Record<string, JournalEntry[]>>((acc, entry) => {
    const date = new Date(entry.entry_date + "T00:00:00");
    const key = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    acc[key] = acc[key] || [];
    acc[key].push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([period, periodEntries]) => (
        <div key={period} className="relative">
          {/* Period Header */}
          <div className="sticky top-16 z-10 bg-journal-bg/95 backdrop-blur-md py-2.5 mb-6 border-b border-journal-border">
            <h2 className="font-journal-serif text-2xl font-bold text-journal-text">
              {period}
            </h2>
          </div>

          {/* Timeline Spine & Nodes */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-journal-border/80 space-y-8 ml-3">
            {periodEntries.map((entry) => {
              const formattedDate = new Date(
                entry.entry_date + "T00:00:00"
              ).toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
              });

              const isPublished = entry.status === "published";
              const preview =
                entry.excerpt ||
                entry.content.blocks.find((b) => "text" in b)?.text ||
                "";

              return (
                <div key={entry.id} className="relative group">
                  {/* Spine Node Dot */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-5 w-3.5 h-3.5 rounded-full border-2 bg-white transition-all ${
                      isPublished
                        ? "border-emerald-600 group-hover:scale-125"
                        : "border-journal-accent group-hover:scale-125"
                    }`}
                  />

                  {/* Entry Card */}
                  <div className="bg-white border border-journal-border hover:border-journal-accent/60 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 text-xs text-journal-muted">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-journal-text tabular-nums">
                          {formattedDate}
                        </span>
                        {entry.category && (
                          <span>• {entry.category}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {entry.mood && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-journal-accent bg-journal-accent-light px-2.5 py-0.5 rounded-full capitalize">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>{entry.mood}</span>
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-950 border-emerald-300"
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
                      </div>
                    </div>

                    <h3 className="font-journal-serif text-xl sm:text-2xl font-bold text-journal-text mb-2.5 group-hover:text-journal-accent transition-colors leading-snug text-balance">
                      <Link href={`/journal/entries/${entry.id}`}>
                        {entry.title}
                      </Link>
                    </h3>

                    <p className="text-sm text-journal-muted line-clamp-3 mb-5 leading-relaxed font-journal-sans">
                      {preview}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-journal-border/70 text-xs">
                      <div className="flex flex-wrap gap-1.5">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-journal-bg text-journal-muted px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/journal/entries/${entry.id}`}
                        className="inline-flex items-center gap-1 text-journal-accent font-semibold hover:text-journal-accent-hover transition-colors"
                      >
                        <span>Open &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
