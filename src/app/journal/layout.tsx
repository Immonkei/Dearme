import { JournalNav } from "@/components/journal/JournalNav";

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-journal-bg text-journal-text">
      <JournalNav />
      <main className="flex-1 pb-16">{children}</main>
    </div>
  );
}
