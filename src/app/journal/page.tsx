import Link from "next/link";
import { getEntries } from "@/lib/journal/repository";
import { EntryCard } from "@/components/journal/EntryCard";
import { Plus, BookOpen, Lock, Globe, Feather, Brain } from "lucide-react";

export const dynamic = "force-dynamic";

interface JournalPageProps {
  searchParams: Promise<{
    status?: "all" | "private" | "published";
  }>;
}

export default async function JournalDashboard({ searchParams }: JournalPageProps) {
  const { status } = await searchParams;
  const filterStatus = status || "all";

  const allEntries = await getEntries({}, false);
  const totalCount = allEntries.length;
  const privateCount = allEntries.filter((e) => e.status === "private").length;
  const publishedCount = allEntries.filter((e) => e.status === "published").length;

  const filteredEntries =
    filterStatus === "all"
      ? allEntries
      : allEntries.filter((e) => e.status === filterStatus);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-journal-border">
        <div>
          <h1 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text mb-1.5">
            Nithh&apos;s Journal
          </h1>
          <p className="text-sm text-journal-muted italic font-journal-serif">
            A quiet space for reflection and memories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/journal/headspace"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white text-journal-text border border-journal-border hover:bg-journal-tag transition-colors shadow-xs"
          >
            <Brain className="w-3.5 h-3.5 text-journal-accent" />
            <span>Edit Headspace</span>
          </Link>

          <Link
            href="/journal/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-journal-accent text-white hover:bg-journal-accent-hover transition-colors shadow-xs hover:shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write for Today</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs with embedded counts */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Link
          href="/journal"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterStatus === "all"
              ? "bg-journal-text text-white shadow-xs"
              : "bg-white text-journal-muted border border-journal-border hover:text-journal-text hover:bg-journal-tag"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>All Pages</span>
          <span className="tabular-nums px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
            {totalCount}
          </span>
        </Link>

        <Link
          href="/journal?status=private"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterStatus === "private"
              ? "bg-amber-900 text-white shadow-xs"
              : "bg-white text-journal-muted border border-journal-border hover:text-journal-text hover:bg-journal-tag"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Private to Me</span>
          <span className="tabular-nums px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
            {privateCount}
          </span>
        </Link>

        <Link
          href="/journal?status=published"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterStatus === "published"
              ? "bg-emerald-900 text-white shadow-xs"
              : "bg-white text-journal-muted border border-journal-border hover:text-journal-text hover:bg-journal-tag"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Shared Publicly</span>
          <span className="tabular-nums px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
            {publishedCount}
          </span>
        </Link>
      </div>

      {/* Entries Section */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white border border-dashed border-journal-border rounded-2xl p-16 text-center max-w-lg mx-auto">
            <Feather className="w-8 h-8 text-journal-accent mx-auto mb-3 opacity-60" />
            <h3 className="font-journal-serif text-lg font-bold text-journal-text mb-1">
              {filterStatus === "all"
                ? "No entries yet"
                : `No ${filterStatus} entries`}
            </h3>
            <p className="text-journal-muted text-xs sm:text-sm mb-6 leading-relaxed">
              {filterStatus === "all"
                ? "This quiet room awaits your first thoughts and reflections."
                : `No entries are currently set to ${filterStatus}.`}
            </p>
            <Link
              href="/journal/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-journal-accent hover:bg-journal-accent-hover rounded-full transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write First Reflection</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} showStatus={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
