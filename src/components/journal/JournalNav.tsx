"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth";
import {
  BookOpen,
  Plus,
  Calendar,
  Clock,
  Search,
  ExternalLink,
  LogOut,
  Lock,
} from "lucide-react";

export function JournalNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/journal", label: "Entries", icon: BookOpen },
    { href: "/journal/new", label: "Write", icon: Plus, highlight: true },
    { href: "/journal/calendar", label: "Calendar", icon: Calendar },
    { href: "/journal/timeline", label: "Timeline", icon: Clock },
    { href: "/journal/search", label: "Search", icon: Search },
  ];

  return (
    <header className="sticky top-0 z-40 bg-journal-bg/95 backdrop-blur-md border-b border-journal-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Privacy indicator */}
        <div className="flex items-center gap-3">
          <Link
            href="/journal"
            className="flex items-center gap-2 group"
          >
            <span className="font-journal-serif text-2xl font-bold tracking-tight text-journal-text group-hover:text-journal-accent transition-colors">
              Dear Me
            </span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium tracking-wide text-journal-muted bg-journal-tag px-2 py-0.5 rounded-full border border-journal-border">
            <Lock className="w-3 h-3 text-journal-accent" />
            Private Workspace
          </span>
        </div>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/journal"
                ? pathname === "/journal"
                : pathname.startsWith(link.href);

            if (link.highlight) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium bg-journal-accent text-white hover:bg-journal-accent-hover transition-colors shadow-xs ml-1 mr-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-journal-text bg-white shadow-xs font-semibold"
                    : "text-journal-muted hover:text-journal-text hover:bg-white/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right actions: Public link & Sign Out */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-journal-muted hover:text-journal-text transition-colors"
            title="View public journal site"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-journal-muted hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
              title="Sign out of journal workspace"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-journal-border/60 py-2 bg-journal-bg">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/journal"
              ? pathname === "/journal"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 text-xs py-1 px-2 rounded-md ${
                isActive
                  ? "text-journal-accent font-semibold"
                  : "text-journal-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
