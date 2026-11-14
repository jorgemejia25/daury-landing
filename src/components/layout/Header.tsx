"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import { Arrow } from "../ui/Arrow";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { pages } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Header({ lang, t }: { lang: Locale; t: Dictionary["nav"] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [prevPath, setPrevPath] = useState(pathname);

  // Cierra el menú al navegar.
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
  }

  const current = pages.find((p) => p.path && pathname.startsWith(`/${lang}${p.path}`)) ?? pages[0];

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => {
      const y = window.scrollY;
      header.dataset.scrolled = String(y > 24);
      // El lienzo toma el color del borde visible para el rebote de iOS y las barras de Safari.
      const nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.dataset.edge = nearBottom ? "bottom" : "top";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const mq = window.matchMedia("(min-width: 961px)");
    const onMq = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.menu = String(menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="header" data-scrolled="false" data-open={menuOpen}>
      <div className="header__bar">
        <Link href={`/${lang}`} className="header__brand" aria-label={t.brand}>
          <Logo />
        </Link>

        <nav className="header__nav" aria-label={t.main}>
          {pages.map((p) => (
            <Link
              key={p.key}
              href={`/${lang}${p.path}`}
              className="header__link"
              aria-current={p === current ? "page" : undefined}
            >
              {t[p.key]}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <LanguageSwitcher lang={lang} label={t.language} variant="header" />
          <Link href={`/${lang}/contact#acceso`} className="btn btn--blue btn--sm header__cta">
            {t.earlyAccess}
            <Arrow />
          </Link>
          <button
            type="button"
            className="header__toggle"
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={26} />
          </button>
        </div>
      </div>

      <div id="menu-movil" className="menu" inert={!menuOpen}>
        <div className="menu__scrim" aria-hidden="true" onClick={() => setMenuOpen(false)} />
        <div className="menu__panel">
          <nav aria-label={t.mobile} className="menu__nav">
            {pages.map((p, i) => (
              <Link
                key={p.key}
                href={`/${lang}${p.path}`}
                className="menu__link"
                style={{ ["--i" as string]: i }}
                aria-current={p === current ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {t[p.key]}
                <Icon name="arrow_forward" size={22} className="menu__go" />
              </Link>
            ))}
          </nav>
          <div className="menu__foot">
            <Link
              href={`/${lang}/contact#acceso`}
              className="btn btn--blue btn--lg btn--block"
              onClick={() => setMenuOpen(false)}
            >
              {t.earlyAccess}
              <Arrow />
            </Link>
            <LanguageSwitcher lang={lang} label={t.language} variant="menu" onPick={() => setMenuOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
}
