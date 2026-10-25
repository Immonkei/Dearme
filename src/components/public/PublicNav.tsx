"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Feather, Menu, X } from "lucide-react";

export function PublicNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/entries", label: "Letters" },
    { href: "/about", label: "Why I Write" },
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

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium py-1 ${
                  isActive
                    ? "text-journal-text border-b-2 border-journal-accent font-semibold"
                    : "text-journal-muted hover:text-journal-text"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-journal-text bg-white border border-journal-border hover:bg-journal-tag transition-colors min-h-[36px] cursor-pointer"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="sm:hidden border-t border-journal-border/80 bg-journal-bg/98 backdrop-blur-md px-4 py-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? "bg-journal-accent text-white font-semibold shadow-xs"
                      : "text-journal-text hover:bg-white/80 active:bg-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-journal-border/70 py-6 text-center text-xs text-journal-muted">
      <p className="font-journal-serif">Dear Me • Written by Nithh</p>
    </footer>
  );
}
