import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getEntryBySlug } from "@/lib/journal/repository";
import { PublicNav, PublicFooter } from "@/components/public/PublicNav";
import { PublicEntryView } from "@/components/public/PublicEntryView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EntryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: EntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Entry Not Found",
    };
  }

  const blocks = Array.isArray(entry.content?.blocks) ? entry.content.blocks : [];
  const excerpt =
    entry.excerpt ||
    (blocks.find((b) => "text" in b)?.text as string)?.slice(0, 160) ||
    "A personal reflection from Dear Me.";

  return {
    title: `${entry.title} | Dear Me`,
    description: excerpt,
    openGraph: {
      title: entry.title,
      description: excerpt,
      type: "article",
      publishedTime: entry.published_at || undefined,
    },
  };
}

export default async function PublishedEntryPage({ params }: EntryPageProps) {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);

  if (!entry || entry.status !== "published") {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text">
      <PublicNav />
      <main className="flex-1">
        <PublicEntryView entry={entry} />
      </main>
      <PublicFooter />
    </div>
  );
}
