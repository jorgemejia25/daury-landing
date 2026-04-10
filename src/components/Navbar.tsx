"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMessages, locales, type AppLocale } from "@/i18n/config";
import Logo from "./Logo";

/** Matches `/en`, `/es`, or locale at the start of a path so we can swap the active locale segment. */
const LOCALE_PATH_PREFIX = new RegExp(`^\\/(${locales.join("|")})(?=\\/|$)`);

/**
 * Builds the target URL when switching UI language, preserving any path after the locale prefix.
 */
function hrefForLocale(pathname: string, target: AppLocale): string {
  const tail = pathname.replace(LOCALE_PATH_PREFIX, "") || "/";
  if (tail === "/") {
    return `/${target}`;
  }
  return `/${target}${tail}`;
}

type NavbarProps = { locale: AppLocale };

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Settings panel (shared between desktop popover and mobile sheet)
// ---------------------------------------------------------------------------

function SettingsPanel({
  locale,
  onNavigate,
}: {
  locale: AppLocale;
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const isES = locale === "es";
  const languageLabel = isES ? "Idioma" : "Language";

  /**
   * Defers closing the settings surface until after the browser processes the link navigation.
   * Closing synchronously unmounts the `<Link>` and can cancel client-side locale changes on mobile.
   */
  function scheduleClosePanel() {
    setTimeout(() => {
      onNavigate?.();
    }, 0);
  }

  return (
    <div className="w-56 p-4">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/60">
        {languageLabel}
      </p>
      <div className="relative flex items-center overflow-hidden rounded-full border border-outline-variant/40 bg-surface-container-low/50 p-0.5 text-sm font-semibold">
        <span
          className={`pointer-events-none absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-primary transition-[left] duration-300 ease-in-out ${
            isES ? "left-[calc(50%+2px)]" : "left-[2px]"
          }`}
          aria-hidden
        />
        <Link
          href={hrefForLocale(pathname, "en")}
          onClick={scheduleClosePanel}
          className={`relative z-10 flex flex-1 items-center justify-center rounded-full px-4 py-2 transition-colors duration-200 ${
            !isES ? "text-on-primary" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          English
        </Link>
        <Link
          href={hrefForLocale(pathname, "es")}
          onClick={scheduleClosePanel}
          className={`relative z-10 flex flex-1 items-center justify-center rounded-full px-4 py-2 transition-colors duration-200 ${
            isES ? "text-on-primary" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Español
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

export default function Navbar({ locale }: NavbarProps) {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const copy           = getMessages(locale).navbar;
  const popoverRef     = useRef<HTMLDivElement>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);
  const navHrefs       = ["#features", "#how-it-works", "#scope", "#about"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close desktop popover on outside click.
  // Excludes the mobile settings sheet so that tapping a language option there
  // isn't treated as an "outside click" before the Link navigation fires.
  useEffect(() => {
    if (!popoverOpen) return;
    function handler(e: MouseEvent) {
      const outsideDesktopPopover = popoverRef.current && !popoverRef.current.contains(e.target as Node);
      const insideMobileSheet     = mobileSheetRef.current && mobileSheetRef.current.contains(e.target as Node);
      if (outsideDesktopPopover && !insideMobileSheet) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [popoverOpen]);

  const pillClass = [
    "mx-auto w-full max-w-6xl rounded-full border px-5 py-3",
    "transition-[background-color,box-shadow,border-color] duration-300",
    "sm:px-7",
    "navbar-blur",
    scrolled
      ? "bg-white/90 border-slate-300/55 shadow-[0_4px_32px_rgba(15,28,56,0.09)]"
      : "bg-white/55 border-slate-300/25 shadow-none",
  ].join(" ");

  return (
    <div className="fixed inset-x-0 top-6 z-50 px-4 sm:px-6">
      {/* ------------------------------------------------------------------ */}
      {/* Pill bar                                                             */}
      {/* ------------------------------------------------------------------ */}
      <nav className={pillClass}>

        {/* DESKTOP (md+) */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
          {/* col 1 — logo */}
          <span className="flex items-center gap-2 justify-self-start text-2xl font-bold tracking-tighter text-on-surface">
            <Logo className="h-6 w-auto text-primary" />
            Daury
          </span>

          {/* col 2 — links (self-centered) */}
          <div className="flex items-center justify-center gap-8 font-medium tracking-tight">
            {copy.navLinks.map((label: string, i: number) => (
              <a
                key={label}
                href={navHrefs[i] ?? "#"}
                className="text-on-surface-variant transition-colors duration-200 hover:text-primary"
              >
                {label}
              </a>
            ))}
          </div>

          {/* col 3 — settings gear + CTA */}
          <div className="flex items-center gap-2 justify-self-end">
            <div ref={popoverRef} className="relative">
              <button
                type="button"
                onClick={() => setPopoverOpen((o) => !o)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 ${
                  popoverOpen
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-outline-variant/40 bg-surface-container/50 text-slate-600 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                }`}
                aria-label="Preferences"
                aria-expanded={popoverOpen}
              >
                <span className={`inline-flex transition-transform duration-300 ${popoverOpen ? "rotate-60" : "rotate-0"}`}>
                  <SettingsIcon />
                </span>
              </button>

              {popoverOpen && (
                <div className="absolute right-0 top-full mt-3 overflow-hidden rounded-2xl border border-outline-variant/25 bg-white shadow-xl shadow-slate-900/10">
                  <SettingsPanel
                    locale={locale}
                    onNavigate={() => setPopoverOpen(false)}
                  />
                </div>
              )}
            </div>

            <a
              href="#contact"
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 active:scale-95"
            >
              {copy.cta}
            </a>
          </div>
        </div>

        {/* MOBILE (< md) */}
        <div className="flex items-center justify-between md:hidden">
          <span className="flex items-center gap-2 text-xl font-bold tracking-tighter text-on-surface">
            <Logo className="h-5 w-auto text-primary" />
            Daury
          </span>

          <div className="flex items-center gap-2">
            {/* Settings */}
            <button
              type="button"
              onClick={() => { setMenuOpen(false); setPopoverOpen((o) => !o); }}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200 ${
                popoverOpen
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-outline-variant/40 bg-surface-container/70 text-slate-600"
              }`}
              aria-label="Preferences"
            >
              <SettingsIcon />
            </button>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => { setPopoverOpen(false); setMenuOpen((o) => !o); }}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-outline-variant/40 bg-surface-container/70"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <span className={`block h-px w-5 origin-center rounded-full bg-on-surface transition-transform duration-200 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 rounded-full bg-on-surface transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`block h-px w-5 origin-center rounded-full bg-on-surface transition-transform duration-200 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile settings sheet                                               */}
      {/* ------------------------------------------------------------------ */}
      {popoverOpen && (
        <div ref={mobileSheetRef} className="mx-auto mt-3 w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-outline-variant/25 bg-white shadow-xl shadow-slate-900/10 md:hidden">
          <SettingsPanel
            locale={locale}
            onNavigate={() => setPopoverOpen(false)}
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Mobile nav drawer                                                   */}
      {/* ------------------------------------------------------------------ */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="mx-auto mt-3 w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-outline-variant/30 bg-white shadow-xl shadow-slate-900/10"
        >
          <nav className="flex flex-col px-3 py-3" aria-label="Main">
            {copy.navLinks.map((label: string, i: number) => (
              <a
                key={label}
                href={navHrefs[i] ?? "#"}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[48px] items-center gap-3 rounded-2xl px-4 font-medium text-on-surface-variant transition-colors hover:bg-primary/5 hover:text-primary"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                {label}
              </a>
            ))}
          </nav>

          <div className="mx-4 h-px bg-outline-variant/20" />

          <div className="p-4">
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center min-h-[48px] w-full rounded-full bg-primary py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90"
            >
              {copy.cta}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
