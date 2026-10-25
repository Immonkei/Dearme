import { getEntries } from "@/lib/journal/repository";
import { CalendarView } from "@/components/journal/CalendarView";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const entries = await getEntries({}, false);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text mb-2 text-balance">
          Calendar Archive
        </h1>
        <p className="text-sm sm:text-base text-journal-muted font-journal-serif italic">
          Browse through the days, weeks, and seasons of your life.
        </p>
      </div>

      <CalendarView entries={entries} />
    </div>
  );
}
