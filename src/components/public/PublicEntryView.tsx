import Link from "next/link";
import { JournalEntry } from "@/types/journal";
import { ArrowLeft, Calendar, Tag, Sparkles, Clock } from "lucide-react";

interface PublicEntryViewProps {
  entry: JournalEntry;
}

export function PublicEntryView({ entry }: PublicEntryViewProps) {
  const formattedDate = new Date(entry.entry_date + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  // Word count & read time calculation
  const wordCount = entry.content?.blocks?.reduce((acc, b) => {
    return acc + ("text" in b ? b.text.split(/\s+/).length : 0);
  }, 0) || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Return Link */}
      <div className="mb-10">
        <Link
          href="/#letters"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-journal-muted hover:text-journal-text transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dear Me</span>
        </Link>
      </div>

      {/* Entry Header */}
      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-journal-muted mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-journal-accent" />
            <time dateTime={entry.entry_date} className="tabular-nums">
              {formattedDate}
            </time>
          </div>

          {entry.category && (
            <>
              <span aria-hidden="true">•</span>
              <span className="font-medium text-journal-text bg-journal-tag px-2.5 py-0.5 rounded-full">
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

        <h1 className="font-journal-serif text-3xl sm:text-5xl font-bold text-journal-text leading-[1.18] mb-6 text-balance">
          {entry.title}
        </h1>

        {entry.excerpt && (
          <p className="text-lg sm:text-xl text-journal-muted font-journal-serif italic leading-relaxed pt-4 border-t border-journal-border/80">
            {entry.excerpt}
          </p>
        )}
      </header>

      {/* Entry Content Blocks */}
      <div className="journal-prose pt-6 border-t border-journal-border">
        {entry.content?.blocks?.map((block) => {
          if (block.type === "heading-2") {
            return <h2 key={block.id}>{block.text}</h2>;
          }
          if (block.type === "heading-3") {
            return <h3 key={block.id}>{block.text}</h3>;
          }
          if (block.type === "blockquote") {
            return <blockquote key={block.id}>{block.text}</blockquote>;
          }
          if (block.type === "image") {
            const imageUrl =
              block.publicPath || block.previewUrl || block.storagePath;
            return (
              <figure key={block.id} className="my-10">
                {imageUrl && (
                  <div className="overflow-hidden rounded-2xl border border-journal-border bg-white shadow-xs">
                    <img
                      src={imageUrl}
                      alt={block.altText || "Journal photograph"}
                      className="w-full object-cover max-h-[550px]"
                      loading="lazy"
                    />
                  </div>
                )}
                {block.caption && (
                  <figcaption className="text-center text-xs text-journal-muted mt-3 font-journal-sans italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
          return <p key={block.id}>{block.text}</p>;
        })}
      </div>

      {/* Footer Tags */}
      {entry.tags?.length > 0 && (
        <div className="mt-14 pt-6 border-t border-journal-border flex flex-wrap items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-journal-muted shrink-0" />
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-journal-muted bg-journal-tag px-2.5 py-1 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Author Byline */}
      <div className="mt-12 pt-8 border-t border-journal-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-journal-muted font-journal-serif">
        <span className="font-medium text-journal-text">Written by Nithh</span>
        <span className="italic">Dear Me • for me, by me</span>
      </div>
    </article>
  );
}
