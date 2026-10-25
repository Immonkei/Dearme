"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Feather } from "lucide-react";

export function PublicNav() {
  const pathname = usePathname();

  const links = [
    { href: "/#headspace", label: "Headspace" },
    { href: "/#about", label: "Why I Write" },
    { href: "/#letters", label: "Letters" },
    { href: "/#thoughts", label: "My Mind" },
    { href: "/#rules", label: "Rules" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-journal-bg/95 backdrop-blur-md border-b border-journal-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Feather className="w-5 h-5 text-journal-accent transition-transform duration-300 group-hover:-rotate-12" />
          <span className="font-journal-serif text-2xl font-bold tracking-tight text-journal-text group-hover:text-journal-accent transition-colors">
            Dear Me
          </span>
          <span className="hidden sm:inline-block text-xs font-journal-serif italic text-journal-muted pl-2 border-l border-journal-border">
            by Nithh
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
                className={`transition-colors font-medium py-1 ${
                  isActive
                    ? "text-journal-text border-b-2 border-journal-accent"
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
    <footer className="mt-auto border-t border-journal-border/80 bg-journal-bg/60 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-journal-muted">
        <div>
          <p className="font-journal-serif text-base font-semibold text-journal-text flex flex-wrap items-center gap-2">
            <span>Dear Me</span>
            <span className="text-journal-muted/50 font-normal" aria-hidden="true">•</span>
            <span className="text-journal-muted font-normal italic font-journal-serif">for me, by me</span>
          </p>
          <p className="italic font-journal-serif text-journal-muted mt-1">
            Written by Nithh. Letters to the person I am becoming.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          <Link
            href="/#headspace"
            className="hover:text-journal-text transition-colors font-medium"
          >
            Headspace
          </Link>
          <span aria-hidden="true" className="text-journal-muted/40">•</span>
          <Link
            href="/#about"
            className="hover:text-journal-text transition-colors font-medium"
          >
            Why I Write
          </Link>
          <span aria-hidden="true" className="text-journal-muted/40">•</span>
          <Link
            href="/#letters"
            className="hover:text-journal-text transition-colors font-medium"
          >
            Letters
          </Link>
          <span aria-hidden="true" className="text-journal-muted/40">•</span>
          <Link
            href="/#thoughts"
            className="hover:text-journal-text transition-colors font-medium"
          >
            My Mind
          </Link>
          <span aria-hidden="true" className="text-journal-muted/40">•</span>
          <Link
            href="/#rules"
            className="hover:text-journal-text transition-colors font-medium"
          >
            Rules
          </Link>
          <span aria-hidden="true" className="text-journal-muted/40">•</span>
          <Link
            href="/#top"
            className="hover:text-journal-text transition-colors font-medium text-journal-accent"
          >
            ↑ Top
          </Link>
        </div>
      </div>
    </footer>
  );
}
