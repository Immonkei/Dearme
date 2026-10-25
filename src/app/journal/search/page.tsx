import { getEntries } from "@/lib/journal/repository";
import { EntryCard } from "@/components/journal/EntryCard";
import { SearchFilterBar } from "@/components/journal/SearchFilterBar";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    tag?: string;
    mood?: string;
    sort?: "date_desc" | "date_asc" | "updated_desc";
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const entries = await getEntries(
    {
      query: params.query,
      category: params.category,
      tag: params.tag,
      mood: params.mood,
      sort: params.sort,
    },
    false
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text mb-2 text-balance">
          Search & Filter
        </h1>
        <p className="text-sm sm:text-base text-journal-muted font-journal-serif italic">
          Find entries across dates, themes, feelings, and reflections.
        </p>
      </div>

      <div className="space-y-8">
        <SearchFilterBar />

        {/* Results */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-journal-border mb-6">
            <h2 className="font-journal-serif text-xl font-semibold text-journal-text">
              Results
            </h2>
            <span className="text-xs text-journal-muted tabular-nums">
              {entries.length} {entries.length === 1 ? "entry" : "entries"} found
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="bg-white border border-dashed border-journal-border rounded-2xl p-14 text-center text-sm text-journal-muted font-journal-serif italic">
              No journal entries match your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} showStatus={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
