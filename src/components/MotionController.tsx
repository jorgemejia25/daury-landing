"use client";

import { useEffect } from "react";

const EASE = "cubic-bezier(.16,1,.3,1)";
const SPRING = "cubic-bezier(.34,1.56,.64,1)";
const SOFT: Keyframe[] = [
  { opacity: 0, transform: "translateY(16px)" },
  { opacity: 1, transform: "none" },
];

type Animated = HTMLElement & { __anim?: Animation };

/**
 * Animaciones del prototipo (Web Animations API): entrada del hero,
 * revelado al hacer scroll, barras, contador y loops ambientales.
 * Respeta prefers-reduced-motion.
 */
export function MotionController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof document.body.animate !== "function") return;

    const all = <T extends Element = HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T & Element>(sel));
    const loops: Animation[] = [];

    const run = (sel: string, frames: Keyframe[], opts: KeyframeAnimationOptions) =>
      all<Animated>(sel).forEach((el) => {
        if (el.__anim) return;
        el.__anim = el.animate(frames, opts);
        loops.push(el.__anim);
      });

    // Loops ambientales
    run('[data-scan]', [{ top: "8%" }, { top: "86%" }], { duration: 1500, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
    run('[data-drift="a"]', [{ transform: "translate(0,0) scale(1)" }, { transform: "translate(10vw,-8vh) scale(1.15)" }], { duration: 14000, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
    run('[data-drift="b"]', [{ transform: "translate(0,0) scale(1)" }, { transform: "translate(-8vw,10vh) scale(.9)" }], { duration: 18000, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });

    // Entrada del hero
    all("[data-in]").forEach((el, i) =>
      el.animate([{ opacity: 0, transform: "translateY(32px)" }, { opacity: 1, transform: "none" }], {
        duration: 900,
        delay: 100 + i * 120,
        easing: EASE,
        fill: "backwards",
      }),
    );

    const play = (el: HTMLElement) => {
      el.style.opacity = "";
      const hasStagger = el.hasAttribute("data-stagger");
      el.animate(hasStagger ? [{ opacity: 0 }, { opacity: 1 }] : SOFT, { duration: 700, easing: EASE });
      if (hasStagger)
        Array.from(el.children).forEach((c, i) =>
          c.animate(SOFT, { duration: 700, delay: i * 80, easing: EASE, fill: "backwards" }),
        );
      el.querySelectorAll<HTMLElement>("[data-bar]").forEach((b, i) =>
        b.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], {
          duration: 900,
          delay: 250 + i * 80,
          easing: SPRING,
          fill: "backwards",
        }),
      );
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => {
        const to = Number(c.dataset.count);
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1400);
          c.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          play(e.target as HTMLElement);
        }),
      { threshold: 0.15 },
    );
    all("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.style.opacity = "0";
      io.observe(el);
    });

    const tio = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          tio.unobserve(e.target);
          const h = e.target as HTMLElement;
          h.style.opacity = "";
          h.animate(SOFT, { duration: 700, easing: EASE });
        }),
      { threshold: 0.4 },
    );
    all("section:not(#top) h2").forEach((h) => {
      if (h.closest("[data-reveal]") || h.getBoundingClientRect().top < window.innerHeight) return;
      h.style.opacity = "0";
      tio.observe(h);
    });

    return () => {
      io.disconnect();
      tio.disconnect();
      loops.forEach((a) => a.cancel());
      all<Animated>("[data-scan],[data-drift]").forEach((el) => delete el.__anim);
    };
  }, []);

  return null;
}
