import { getHeadspace } from "@/lib/journal/repository";
import { HeadspaceEditor } from "@/components/journal/HeadspaceEditor";
import { Brain } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Current Headspace | Dear Me",
  description: "Update your current headspace and mental reflections shown on the home page.",
};

export default async function HeadspacePage() {
  const headspace = await getHeadspace();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-journal-border">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-journal-accent bg-journal-accent-light mb-2 border border-journal-accent/20">
          <Brain className="w-3.5 h-3.5" />
          <span>Mindset & Presence</span>
        </div>
        <h1 className="font-journal-serif text-2xl sm:text-4xl font-bold tracking-tight text-journal-text mb-1.5">
          Current Headspace
        </h1>
        <p className="text-xs sm:text-sm text-journal-muted italic font-journal-serif">
          These 4 reflections update the &ldquo;Inside My Mind Right Now&rdquo; card on your public home page.
        </p>
      </div>

      <HeadspaceEditor initialData={headspace} />
    </div>
  );
}
