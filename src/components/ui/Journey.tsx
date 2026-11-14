"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Chapter = { kicker: string; title: string; text: string };

/**
 * Trayectoria con scrollspy: índice fijo a la izquierda (o barra superior en móvil)
 * que marca el capítulo visible y una línea que se llena con el avance.
 */
export function Journey({ label, chapters, visuals }: { label: string; chapters: Chapter[]; visuals: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
    let raf = 0;
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const line = vh * 0.45;
      let cur = 0;
      items.forEach((el, i) => {
        if (el.getBoundingClientRect().top < line) cur = i;
      });
      setActive(cur);
      const r = root.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - r.top) / (r.height - vh * 0.35)));
      root.style.setProperty("--progress", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (i: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(`capitulo-${i + 1}`);
    if (!el) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: smooth ? "smooth" : "auto" });
    history.replaceState(null, "", `#capitulo-${i + 1}`);
  };

  return (
    <div ref={rootRef} className="journey">
      <aside className="journey__aside">
        <nav className="spy" aria-label={label}>
          <span className="spy__label">{label}</span>
          <div className="spy__rail" aria-hidden="true">
            <span className="spy__fill" />
          </div>
          <ol className="spy__list list-reset">
            {chapters.map((c, i) => (
              <li key={c.kicker}>
                <a
                  href={`#capitulo-${i + 1}`}
                  className="spy__link"
                  aria-current={i === active ? "step" : undefined}
                  data-past={i < active}
                  onClick={go(i)}
                >
                  <span className="spy__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="spy__text">{c.kicker}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {/* Móvil: barra compacta con el capítulo actual */}
        <div className="spy-mobile" aria-hidden="true">
          <span className="spy-mobile__num">{String(active + 1).padStart(2, "0")}</span>
          <span className="spy-mobile__text">{chapters[active].kicker}</span>
          <span className="spy-mobile__count">/ {String(chapters.length).padStart(2, "0")}</span>
          <span className="spy-mobile__bar" />
        </div>
      </aside>

      <div className="journey__chapters">
        {chapters.map((c, i) => (
          <article
            key={c.kicker}
            id={`capitulo-${i + 1}`}
            data-chapter=""
            className="chapter"
            data-active={i === active}
          >
            <span className="chapter__num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="eyebrow">{c.kicker}</span>
            <h3 className="chapter__title">{c.title}</h3>
            <p className="chapter__text">{c.text}</p>
            {visuals[i] && <div className="chapter__visual">{visuals[i]}</div>}
          </article>
        ))}
      </div>
    </div>
  );
}
