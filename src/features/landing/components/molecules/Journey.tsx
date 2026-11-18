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
    <div ref={rootRef} className={"l-journey [--progress:0] grid [grid-template-columns:280px_1fr] [gap:clamp(40px,_7vw,_120px)] max-[960.02px]:[grid-template-columns:1fr] max-[960.02px]:gap-[8px]"}>
      <aside className={"l-journey--aside sticky [top:calc(var(--header-h)_+_56px)] [align-self:start] z-[5] max-[960.02px]:[top:calc(var(--header-h)_+_12px)]"}>
        <nav className={"l-spy relative flex flex-col gap-[18px] max-[960.02px]:hidden"} aria-label={label}>
          <span className={"l-spy--label text-[14px] font-bold [color:var(--muted)]"}>{label}</span>
          <div className={"l-spy--rail absolute left-[19px] top-[58px] bottom-[20px] w-[2px] rounded-[2px] [background:var(--rule)]"} aria-hidden="true">
            <span className={"l-spy--fill absolute [inset:0_0_auto] [height:calc(var(--progress)_*_100%)] [border-radius:inherit] bg-brand"} />
          </div>
          <ol className={"l-spy--list relative flex flex-col gap-[6px] l-list-reset m-0 p-0 list-none"}>
            {chapters.map((c, i) => (
              <li key={c.kicker}>
                <a
                  href={`#capitulo-${i + 1}`}
                  className={"l-spy--link flex items-center gap-[16px] [padding:6px_0] [color:var(--muted)] text-[17px] font-semibold no-underline [transition:color_.3s] [&:hover]:text-ink [&[data-past=true]_.l-spy--num]:[background:var(--blue-50)] [&[data-past=true]_.l-spy--num]:text-brand [&[data-past=true]_.l-spy--num]:[box-shadow:none] [&[aria-current=step]]:text-ink [&[aria-current=step]_.l-spy--num]:bg-brand [&[aria-current=step]_.l-spy--num]:[color:#fff] [&[aria-current=step]_.l-spy--num]:[box-shadow:0_0_0_6px_var(--blue-100)] [&[aria-current=step]_.l-spy--num]:[transform:scale(1.06)] [&[aria-current=step]_.l-spy--text]:[transform:translateX(4px)] [&[aria-current=step]_.l-spy--text]:font-bold"}
                  aria-current={i === active ? "step" : undefined}
                  data-past={i < active}
                  onClick={go(i)}
                >
                  <span className={"l-spy--num grid place-items-center w-[40px] h-[40px] flex-none rounded-full bg-canvas [box-shadow:inset_0_0_0_2px_var(--rule)] font-mono text-[13px] font-semibold [transition:background-color_.35s,_color_.35s,_box-shadow_.35s,_transform_.45s_var(--spring)]"}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={"l-spy--text [transition:transform_.45s_var(--ease)]"}>{c.kicker}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {/* Móvil: barra compacta con el capítulo actual */}
        <div className={"l-spy-mobile hidden max-[960.02px]:relative max-[960.02px]:overflow-hidden max-[960.02px]:flex max-[960.02px]:items-center max-[960.02px]:gap-[10px] max-[960.02px]:[padding:14px_20px] max-[960.02px]:rounded-full max-[960.02px]:[background:rgba(255,_255,_255,_.92)] max-[960.02px]:[-webkit-backdrop-filter:blur(14px)] max-[960.02px]:[backdrop-filter:blur(14px)] max-[960.02px]:[box-shadow:var(--shadow-soft)] max-[960.02px]:font-bold"} aria-hidden="true">
          <span className={"l-spy-mobile--num max-[960.02px]:font-mono max-[960.02px]:text-brand"}>{String(active + 1).padStart(2, "0")}</span>
          <span className={"l-spy-mobile--text max-[960.02px]:[flex:1]"}>{chapters[active].kicker}</span>
          <span className={"l-spy-mobile--count max-[960.02px]:font-mono max-[960.02px]:[color:var(--muted)] max-[960.02px]:font-medium"}>/ {String(chapters.length).padStart(2, "0")}</span>
          <span className={"l-spy-mobile--bar max-[960.02px]:absolute max-[960.02px]:left-0 max-[960.02px]:bottom-0 max-[960.02px]:h-[3px] max-[960.02px]:[width:calc(var(--progress)_*_100%)] max-[960.02px]:bg-brand"} />
        </div>
      </aside>

      <div className={"l-journey--chapters flex flex-col"}>
        {chapters.map((c, i) => (
          <article
            key={c.kicker}
            id={`capitulo-${i + 1}`}
            data-chapter=""
            className={"l-chapter flex flex-col gap-[20px] min-h-[78vh] [padding:24px_0_96px] opacity-28 [transition:opacity_.6s_var(--ease)] [&[data-active=true]]:opacity-100 [&:last-child]:min-h-[60vh] [&_.l-chapter--visual]:[transform:translateY(24px)] [&_.l-chapter--visual]:[transition:transform_.9s_var(--ease)] [&[data-active=true]_.l-chapter--visual]:[transform:none] max-[960.02px]:min-h-0 max-[960.02px]:[padding:56px_0_40px] max-[960.02px]:opacity-45 max-[960.02px]:[&:last-child]:min-h-0"}
            data-active={i === active}
          >
            <span className={"l-chapter--num font-display text-[clamp(80px,_10vw,_140px)] font-bold tracking-[-.06em] leading-[.8] [color:var(--blue-100)]"} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={"l-eyebrow inline-flex items-center self-start [padding:8px_14px] rounded-full bg-surface [color:var(--ink-2)] text-[14px] font-semibold tracking-[-.005em] leading-[1]  "}>{c.kicker}</span>
            <h3 className={"l-chapter--title m-0 font-display text-[clamp(34px,_4.4vw,_60px)] font-semibold tracking-[-.045em] leading-[1] text-balance"}>{c.title}</h3>
            <p className={"l-chapter--text m-0 max-w-[640px] text-[clamp(18px,_1.6vw,_21px)] leading-[1.6] [color:var(--ink-2)] text-pretty"}>{c.text}</p>
            {visuals[i] && <div className={"l-chapter--visual mt-[20px] max-w-[680px]"}>{visuals[i]}</div>}
          </article>
        ))}
      </div>
    </div>
  );
}
