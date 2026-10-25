import { notFound } from "next/navigation";
import { getEntryById } from "@/lib/journal/repository";
import { EntryEditor } from "@/components/journal/EntryEditor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EntryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewOrEditEntryPage({ params }: EntryPageProps) {
  const { id } = await params;
  const entry = await getEntryById(id);

  if (!entry) {
    notFound();
  }

  return <EntryEditor entry={entry} />;
}
