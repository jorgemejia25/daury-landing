"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { navLinks } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ lang, t }: { lang: Locale; t: Dictionary["nav"] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const menuOpenRef = useRef(menuOpen);
  const lastY = useRef<number | null>(null);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const header = headerRef.current;
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!header || !nav || !pill) return;

    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a"));
    let active: HTMLAnchorElement | null = null;

    const move = (a: HTMLAnchorElement | null) => {
      if (!a) {
        pill.style.opacity = "0";
        return;
      }
      pill.style.opacity = "1";
      pill.style.width = `${a.offsetWidth}px`;
      pill.style.transform = `translateX(${a.offsetLeft}px)`;
    };

    const enters = links.map((a) => {
      const fn = () => move(a);
      a.addEventListener("mouseenter", fn);
      return fn;
    });
    const onLeave = () => move(active);
    nav.addEventListener("mouseleave", onLeave);

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      header.dataset.scrolled = String(y > 40);
      // El color del lienzo sigue al borde visible: azul arriba (hero), azul oscuro abajo (footer),
      // para que el rebote de iOS y las barras de Safari no muestren otro color.
      const nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.backgroundColor = nearBottom ? "#1740A8" : "";
      let cur: HTMLAnchorElement | null = null;
      links.forEach((a) => {
        const t = document.querySelector(a.getAttribute("href") ?? "");
        if (t && t.getBoundingClientRect().top < window.innerHeight * 0.4) cur = a;
      });
      active = cur;
      links.forEach((a) => (a === cur ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
      if (!nav.matches(":hover")) move(active);
      if (menuOpenRef.current && Math.abs(y - (lastY.current ?? y)) > 60) setMenuOpen(false);
      if (!menuOpenRef.current) lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    const mq = window.matchMedia("(max-width: 960px)");
    const onMq = () => setMenuOpen(false);
    mq.addEventListener("change", onMq);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && typeof header.animate === "function") {
      header.animate([{ transform: "translateY(-100%)" }, { transform: "none" }], {
        duration: 700,
        easing: "cubic-bezier(.16,1,.3,1)",
      });
      const brand = header.querySelector<HTMLElement>(".header__brand");
      const cta = header.querySelector<HTMLElement>(".header__actions");
      [brand, ...links, cta].forEach((el, i) =>
        el?.animate(
          [
            { opacity: 0, transform: "translateY(-14px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 600, delay: 200 + i * 80, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" },
        ),
      );
    }

    return () => {
      links.forEach((a, i) => a.removeEventListener("mouseenter", enters[i]));
      nav.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="header" data-scrolled="false">
      <div className="header__inner">
        <a href="#top" className="header__brand" aria-label={t.home} onClick={closeMenu}>
          <Logo />
        </a>

        <nav ref={navRef} className="header__nav" aria-label={t.main}>
          <span ref={pillRef} aria-hidden="true" className="header__pill" />
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="header__link">
              {t[l.key]}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <LanguageSwitcher lang={lang} label={t.language} variant="header" />
          <a href="#acceso" className="btn btn--white header__cta">
            {t.earlyAccess}
          </a>
        </div>

        <button
          type="button"
          className="header__toggle"
          aria-label={menuOpen ? t.closeMenu : t.openMenu}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={28} />
        </button>

        <div id="menu-movil" className="header__menu" data-open={menuOpen} inert={!menuOpen}>
          <nav aria-label={t.mobile}>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="header__menu-link" onClick={closeMenu}>
                <Icon name={l.icon} size={24} />
                {t[l.key]}
              </a>
            ))}
          </nav>
          <a href="#acceso" className="header__menu-cta" onClick={closeMenu}>
            {t.earlyAccess}
            <Icon name="arrow_forward" size={22} />
          </a>
          <LanguageSwitcher lang={lang} label={t.language} variant="menu" onPick={closeMenu} />
        </div>
      </div>
    </header>
  );
}
