import Link from "next/link";
import { getEntries } from "@/lib/journal/repository";
import { EntryCard } from "@/components/journal/EntryCard";
import { Plus, BookOpen, Lock, Globe, Calendar } from "lucide-react";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-journal-border">
        <div>
          <h1 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text mb-1.5">
            Journal Workspace
          </h1>
          <p className="text-sm text-journal-muted italic">
            Letters to the person I am becoming.
          </p>
        </div>

        <Link
          href="/journal/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-journal-accent text-white hover:bg-journal-accent-hover transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write Today</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/journal"
          className={`p-4 rounded-xl border transition-all ${
            filterStatus === "all"
              ? "bg-white border-journal-accent shadow-xs"
              : "bg-white/60 border-journal-border hover:bg-white"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-journal-muted mb-1">
            <span>Total Memories</span>
            <BookOpen className="w-4 h-4 text-journal-accent" />
          </div>
          <p className="font-journal-serif text-2xl font-bold text-journal-text">
            {totalCount}
          </p>
        </Link>

        <Link
          href="/journal?status=private"
          className={`p-4 rounded-xl border transition-all ${
            filterStatus === "private"
              ? "bg-white border-amber-400 shadow-xs"
              : "bg-white/60 border-journal-border hover:bg-white"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-journal-muted mb-1">
            <span>Private Entries</span>
            <Lock className="w-4 h-4 text-amber-700" />
          </div>
          <p className="font-journal-serif text-2xl font-bold text-journal-text">
            {privateCount}
          </p>
        </Link>

        <Link
          href="/journal?status=published"
          className={`p-4 rounded-xl border transition-all ${
            filterStatus === "published"
              ? "bg-white border-emerald-400 shadow-xs"
              : "bg-white/60 border-journal-border hover:bg-white"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-journal-muted mb-1">
            <span>Shared with the World</span>
            <Globe className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="font-journal-serif text-2xl font-bold text-journal-text">
            {publishedCount}
          </p>
        </Link>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-journal-serif text-xl font-semibold text-journal-text">
            {filterStatus === "all" && "All Entries"}
            {filterStatus === "private" && "Private Entries"}
            {filterStatus === "published" && "Published Entries"}
          </h2>
          <span className="text-xs text-journal-muted">
            {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="bg-white border border-dashed border-journal-border rounded-2xl p-12 text-center">
            <p className="text-journal-muted text-sm mb-4">
              {filterStatus === "all"
                ? "No journal entries written yet. Begin recording your story."
                : `No ${filterStatus} entries found.`}
            </p>
            <Link
              href="/journal/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-journal-accent hover:bg-journal-accent-hover rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Write First Entry</span>
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
