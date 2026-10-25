"use client";

import { useState } from "react";
import Link from "next/link";
import { JournalEntry } from "@/types/journal";
import { EntryCard } from "@/components/journal/EntryCard";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";

interface CalendarViewProps {
  entries: JournalEntry[];
  initialDate?: string;
}

export function CalendarView({ entries, initialDate }: CalendarViewProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (initialDate) {
      return new Date(initialDate + "T00:00:00");
    }
    return new Date();
  });

  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || today.toISOString().split("T")[0]
  );

  // Group entries by date
  const entriesByDate = entries.reduce<Record<string, JournalEntry[]>>(
    (acc, entry) => {
      acc[entry.entry_date] = acc[entry.entry_date] || [];
      acc[entry.entry_date].push(entry);
      return acc;
    },
    {}
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now.toISOString().split("T")[0]);
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedEntries = entriesByDate[selectedDate] || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Calendar Card */}
      <div className="bg-white border border-journal-border rounded-xl sm:rounded-2xl p-3.5 sm:p-6 md:p-8 shadow-xs">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-journal-border">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <h2 className="font-journal-serif text-xl sm:text-2xl md:text-3xl font-bold text-journal-text">
              {monthName}
            </h2>
            <button
              onClick={goToToday}
              className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 font-semibold text-journal-muted hover:text-journal-text bg-journal-bg border border-journal-border rounded-lg hover:bg-journal-tag transition-colors min-h-[32px] inline-flex items-center"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-2 text-journal-muted hover:text-journal-text rounded-lg hover:bg-journal-bg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-journal-muted hover:text-journal-text rounded-lg hover:bg-journal-bg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs font-semibold text-journal-muted mb-2 sm:mb-3 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-2.5">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="h-12 sm:h-18 md:h-22 bg-journal-bg/25 rounded-lg sm:rounded-xl"
            />
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
              dayNum
            ).padStart(2, "0")}`;
            const dayEntries = entriesByDate[dateStr] || [];
            const hasEntries = dayEntries.length > 0;
            const isSelected = selectedDate === dateStr;
            const isToday = today.toISOString().split("T")[0] === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`h-12 sm:h-18 md:h-22 p-1 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl text-left flex flex-col justify-between border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-journal-accent-light/60 border-journal-accent ring-2 ring-journal-accent/30"
                    : hasEntries
                    ? "bg-white border-journal-border hover:border-journal-accent/60 hover:bg-journal-bg/40"
                    : "bg-white/50 border-journal-border/50 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[11px] sm:text-xs md:text-sm font-semibold tabular-nums ${
                      isToday
                        ? "w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-journal-accent text-white flex items-center justify-center font-bold text-[10px] sm:text-xs"
                        : isSelected
                        ? "text-journal-accent font-bold"
                        : "text-journal-text"
                    }`}
                  >
                    {dayNum}
                  </span>

                  {hasEntries && (
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-journal-accent" />
                  )}
                </div>

                {hasEntries && (
                  <span className="hidden sm:inline text-[10px] md:text-[11px] text-journal-muted font-medium truncate tabular-nums">
                    {dayEntries.length}{" "}
                    {dayEntries.length === 1 ? "entry" : "entries"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-journal-border">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-journal-accent" />
            <h3 className="font-journal-serif text-xl sm:text-2xl font-bold text-journal-text">
              Entries for{" "}
              {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </h3>
          </div>

          <Link
            href="/journal/new"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-journal-accent hover:text-journal-accent-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Write for this date</span>
          </Link>
        </div>

        {selectedEntries.length === 0 ? (
          <div className="bg-white border border-journal-border rounded-xl p-10 text-center text-sm text-journal-muted italic font-journal-serif">
            No entries recorded on this date.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} showStatus={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
