import { getEntries } from "@/lib/journal/repository";
import { TimelineView } from "@/components/journal/TimelineView";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const entries = await getEntries({ sort: "date_desc" }, false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-10">
        <h1 className="font-journal-serif text-3xl font-bold tracking-tight text-journal-text mb-1">
          Chronological Timeline
        </h1>
        <p className="text-sm text-journal-muted">
          A continuous river of days, thoughts, and milestones.
        </p>
      </div>

      <TimelineView entries={entries} />
    </div>
  );
}
