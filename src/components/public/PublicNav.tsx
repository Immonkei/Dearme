"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sparkles, Feather } from "lucide-react";

export function PublicNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/entries", label: "Archive" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-journal-bg/95 backdrop-blur-md border-b border-journal-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Feather className="w-5 h-5 text-journal-accent transition-transform group-hover:-rotate-6" />
          <span className="font-journal-serif text-2xl font-bold tracking-tight text-journal-text group-hover:text-journal-accent transition-colors">
            Dear Me
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  isActive
                    ? "text-journal-text border-b-2 border-journal-accent pb-1"
                    : "text-journal-muted hover:text-journal-text"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-journal-border/80 bg-journal-bg/60 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-journal-muted">
        <div>
          <p className="font-journal-serif text-sm font-medium text-journal-text">
            Dear Me
          </p>
          <p className="italic">Letters to the person I am becoming.</p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="hover:text-journal-text transition-colors"
          >
            About
          </Link>
          <span>•</span>
          <Link
            href="/entries"
            className="hover:text-journal-text transition-colors"
          >
            Archive
          </Link>
          <span>•</span>
          <Link
            href="/login"
            className="text-journal-muted/70 hover:text-journal-text transition-colors"
          >
            Owner Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
