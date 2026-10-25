import Link from "next/link";
import { JournalEntry } from "@/types/journal";
import { ArrowLeft, Calendar, Tag, Sparkles } from "lucide-react";

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

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Return Link */}
      <div className="mb-10">
        <Link
          href="/entries"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-journal-muted hover:text-journal-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Archive</span>
        </Link>
      </div>

      {/* Entry Header */}
      <header className="mb-10 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-journal-muted mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-journal-accent" />
            <time dateTime={entry.entry_date}>{formattedDate}</time>
          </div>

          {entry.category && (
            <>
              <span>•</span>
              <span className="font-medium text-journal-text bg-journal-tag px-2.5 py-0.5 rounded-full">
                {entry.category}
              </span>
            </>
          )}

          {entry.mood && (
            <>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-journal-accent bg-journal-accent-light px-2.5 py-0.5 rounded-full capitalize">
                <Sparkles className="w-3 h-3" />
                {entry.mood}
              </span>
            </>
          )}
        </div>

        <h1 className="font-journal-serif text-3xl sm:text-5xl font-bold text-journal-text leading-tight mb-4">
          {entry.title}
        </h1>

        {entry.excerpt && (
          <p className="text-lg text-journal-muted font-journal-serif italic leading-relaxed pt-2 border-t border-journal-border/60">
            {entry.excerpt}
          </p>
        )}
      </header>

      {/* Entry Content Blocks */}
      <div className="journal-prose pt-4 border-t border-journal-border">
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
                  <img
                    src={imageUrl}
                    alt={block.altText || "Journal photograph"}
                    className="w-full rounded-2xl shadow-sm object-cover max-h-[550px]"
                    loading="lazy"
                  />
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
        <div className="mt-12 pt-6 border-t border-journal-border flex flex-wrap items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-journal-muted" />
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
    </article>
  );
}
