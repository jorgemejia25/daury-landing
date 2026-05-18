'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Scroll singleton (lazy init on client) ─── */
const scrollListeners = new Set<(y: number) => void>();
let scrollY = 0;
let scrollRafPending = false;
let scrollAttached = false;

function ensureScroll() {
  if (scrollAttached || typeof window === 'undefined') return;
  scrollAttached = true;
  scrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (!scrollRafPending) {
      scrollRafPending = true;
      requestAnimationFrame(() => {
        scrollY = window.scrollY;
        scrollListeners.forEach(fn => fn(scrollY));
        scrollRafPending = false;
      });
    }
  }, { passive: true });
}

export function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    ensureScroll();
    setY(window.scrollY);
    scrollListeners.add(setY);
    return () => { scrollListeners.delete(setY); };
  }, []);
  return y;
}

/* ─── Reveal on scroll (IntersectionObserver) ─── */
export function useReveal(opts: { threshold?: number; rootMargin?: string } = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.willChange = 'transform, opacity';
    // Trigger earlier on mobile so fast-scrolling doesn't skip elements
    const mobile = window.innerWidth < 768;
    const threshold = opts.threshold ?? (mobile ? 0.06 : 0.12);
    const rootMargin = opts.rootMargin ?? (mobile ? '0px 0px 0px 0px' : '0px 0px -5% 0px');
    // If already in viewport, show immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.style.willChange = '';
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setSeen(true);
          if (el) el.style.willChange = '';
          io.disconnect();
        }
      });
    }, { threshold, rootMargin });
    io.observe(el);
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, seen] as const;
}

/* ─── Element-relative parallax (disabled on mobile for performance) ─── */
export function useElementParallax(factor = 0.12) {
  const ref = useRef<HTMLElement | null>(null);
  const [y, setY] = useState(0);
  useEffect(() => {
    if (window.innerWidth < 768) return; // skip parallax on mobile
    const el = ref.current;
    if (el) el.style.willChange = 'transform';
    const compute = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2 - vh / 2;
      setY(-center * factor);
    };
    ensureScroll();
    scrollListeners.add(compute);
    compute();
    window.addEventListener('resize', compute);
    return () => {
      scrollListeners.delete(compute);
      window.removeEventListener('resize', compute);
      if (el) el.style.willChange = '';
    };
  }, [factor]);
  return [ref, y] as const;
}

/* ─── Mouse parallax (global) ─── */
export function useMouseParallax(strength = 20) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * strength;
      const y = (e.clientY / window.innerHeight - 0.5) * strength;
      setPos({ x, y });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [strength]);
  return pos;
}

/* ─── Per-element mouse parallax ─── */
export function useLocalMouse(strength = 12) {
  const ref = useRef<HTMLElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, hover: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = (e.clientX - cx) / (r.width / 2);
      const ny = (e.clientY - cy) / (r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPos({ x: nx * strength, y: ny * strength, hover: true }));
    };
    const onLeave = () => setPos({ x: 0, y: 0, hover: false });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);
  return [ref, pos] as const;
}

/* ─── Persistent state via localStorage ─── */
export function usePersist<T>(key: string, def: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === 'undefined') return def;
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : def;
    } catch { return def; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, setV];
}

/* ─── Animated counter ─── */
export function useCounter(target: number, duration = 1200) {
  const [ref, seen] = useReveal({ threshold: 0.3 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, target, duration]);
  return [ref, val] as const;
}

/* ─── Scroll progress (element 0→1) ─── */
export function useScrollProgress() {
  const ref = useRef<HTMLElement | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const compute = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh;
      const passed = vh - r.top;
      setP(Math.min(1, Math.max(0, passed / total)));
    };
    ensureScroll();
    scrollListeners.add(compute);
    compute();
    window.addEventListener('resize', compute);
    return () => { scrollListeners.delete(compute); window.removeEventListener('resize', compute); };
  }, []);
  return [ref, p] as const;
}
