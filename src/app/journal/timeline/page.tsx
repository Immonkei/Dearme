import { getEntries } from "@/lib/journal/repository";
import { TimelineView } from "@/components/journal/TimelineView";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const entries = await getEntries({ sort: "date_desc" }, false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <h1 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text mb-2 text-balance">
          Chronological Timeline
        </h1>
        <p className="text-sm sm:text-base text-journal-muted font-journal-serif italic">
          A continuous river of days, thoughts, milestones, and quiet moments.
        </p>
      </div>

      <TimelineView entries={entries} />
    </div>
  );
}
