"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Movimiento del sitio, sin dependencias:
 * - [data-speed]    parallax vertical (usa la propiedad `translate`, no choca con `transform`).
 * - [data-stack]    tarjetas apiladas con `position: sticky` que se encogen al quedar debajo.
 * - [data-reveal]   aparece al entrar en pantalla; con data-reveal="stagger" escalona a sus hijos.
 * - [data-count]    contador numérico al entrar en pantalla.
 * Se vuelve a montar en cada cambio de página. Respeta prefers-reduced-motion.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $$ = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel));

    /* ── Revelado ── */
    const reveals = $$("[data-reveal]");
    reveals.forEach((el) => {
      if (el.dataset.reveal === "stagger")
        Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i)));
    });

    const counters = $$("[data-count]");
    const count = (el: HTMLElement) => {
      const to = Number(el.dataset.count);
      if (reduced) return void (el.textContent = String(to));
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1600);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const el = e.target as HTMLElement;
          if (el.hasAttribute("data-count")) count(el);
          else el.classList.add("is-in");
        }),
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );

    if (!reduced) {
      root.classList.add("motion");
      reveals.forEach((el) => {
        // Lo que ya está en pantalla al cargar no se oculta (evita parpadeos).
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("is-in");
        else io.observe(el);
      });
    } else {
      reveals.forEach((el) => el.classList.add("is-in"));
    }
    counters.forEach((el) => io.observe(el));

    /* ── Parallax + pila sticky ── */
    const layers = reduced ? [] : $$("[data-speed]");
    const stacks = reduced ? [] : $$("[data-stack]");
    let raf = 0;

    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const mobile = window.innerWidth < 760;
      for (const el of layers) {
        const anchor = el.parentElement ?? el;
        const r = anchor.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const speed = Number(el.dataset.speed) * (mobile ? 0.5 : 1);
        const y = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.translate = `0 ${y.toFixed(1)}px`;
      }
      for (const stack of stacks) {
        const cards = Array.from(stack.children) as HTMLElement[];
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const top = parseFloat(getComputedStyle(card).top) || 0;
          const gap = next.getBoundingClientRect().top - top;
          const p = Math.min(1, Math.max(0, 1 - gap / card.offsetHeight));
          card.style.scale = String(1 - p * 0.06);
          card.style.setProperty("--shade", p.toFixed(3));
        });
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    if (layers.length || stacks.length) {
      frame();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
