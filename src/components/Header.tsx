"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { navLinks } from "@/lib/site";

export function Header() {
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
      const cta = header.querySelector<HTMLElement>(".header__cta");
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
        <a href="#top" className="header__brand" aria-label="Daury, ir al inicio" onClick={closeMenu}>
          <Logo />
        </a>

        <nav ref={navRef} className="header__nav" aria-label="Principal">
          <span ref={pillRef} aria-hidden="true" className="header__pill" />
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="header__link">
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#acceso" className="btn btn--white header__cta">
          Acceso anticipado
        </a>

        <button
          type="button"
          className="header__toggle"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={28} />
        </button>

        <div id="menu-movil" className="header__menu" data-open={menuOpen} inert={!menuOpen}>
          <nav aria-label="Menú móvil">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="header__menu-link" onClick={closeMenu}>
                <Icon name={l.icon} size={24} />
                {l.label}
              </a>
            ))}
          </nav>
          <a href="#acceso" className="header__menu-cta" onClick={closeMenu}>
            Acceso anticipado
            <Icon name="arrow_forward" size={22} />
          </a>
        </div>
      </div>
    </header>
  );
}
