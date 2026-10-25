import { MetadataRoute } from "next";
import { getEntries } from "@/lib/journal/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const publishedEntries = await getEntries({}, true);

  const entriesUrls = publishedEntries.map((entry) => ({
    url: `${baseUrl}/entries/${entry.slug}`,
    lastModified: new Date(entry.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/entries`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...entriesUrls,
  ];
}
