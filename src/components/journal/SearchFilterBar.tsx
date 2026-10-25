"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X, Filter } from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/types/journal";

export function SearchFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [tag, setTag] = useState(searchParams.get("tag") || "");
  const [mood, setMood] = useState(searchParams.get("mood") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "date_desc");

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (category) params.set("category", category);
    if (tag.trim()) params.set("tag", tag.trim());
    if (mood) params.set("mood", mood);
    if (sort) params.set("sort", sort);

    startTransition(() => {
      router.push(`/journal/search?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setQuery("");
    setCategory("");
    setTag("");
    setMood("");
    setSort("date_desc");
    router.push("/journal/search");
  };

  const hasFilters = Boolean(query || category || tag || mood || (sort && sort !== "date_desc"));

  return (
    <form
      onSubmit={handleApply}
      className="bg-white border border-journal-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
    >
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-journal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keywords, titles, or reflections..."
          className="w-full pl-10 pr-24 py-2.5 text-sm bg-journal-bg/60 border border-journal-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journal-accent/40"
        />
        <button
          type="submit"
          disabled={isPending}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-white bg-journal-accent hover:bg-journal-accent-hover rounded-lg transition-colors cursor-pointer"
        >
          {isPending ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Filter Selectors Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-journal-muted mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-journal-bg border border-journal-border rounded-lg focus:outline-none text-xs"
          >
            <option value="">All Categories</option>
            {DEFAULT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-journal-muted mb-1">
            Mood
          </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-journal-bg border border-journal-border rounded-lg focus:outline-none text-xs"
          >
            <option value="">All Moods</option>
            <option value="peaceful">Peaceful 🌿</option>
            <option value="reflective">Reflective 💭</option>
            <option value="joyful">Joyful ☀️</option>
            <option value="melancholy">Melancholy 🌧️</option>
            <option value="grateful">Grateful 🙏</option>
            <option value="contemplative">Contemplative 🕯️</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-journal-muted mb-1">
            Tag
          </label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. Morning"
            className="w-full px-2.5 py-1.5 bg-journal-bg border border-journal-border rounded-lg focus:outline-none text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-journal-muted mb-1">
            Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-journal-bg border border-journal-border rounded-lg focus:outline-none text-xs"
          >
            <option value="date_desc">Newest Date First</option>
            <option value="date_asc">Oldest Date First</option>
            <option value="updated_desc">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-journal-muted">
          {hasFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 text-journal-muted hover:text-red-700 font-medium"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleApply()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-journal-text bg-journal-tag hover:bg-journal-border rounded-lg transition-colors cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 text-journal-accent" />
          <span>Apply Filters</span>
        </button>
      </div>
    </form>
  );
}
