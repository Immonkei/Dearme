import { getEntries } from "@/lib/journal/repository";
import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import { SinglePageHome } from "@/components/public/SinglePageHome";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const publishedEntries = await getEntries({ sort: "date_desc" }, true);

  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text selection:bg-journal-accent/20">
      <PublicNav />
      <main className="flex-1 flex flex-col">
        <SinglePageHome entries={publishedEntries} />
      </main>
      <PublicFooter />
    </div>
  );
}
