'use client';
import { useRef } from 'react';
import { useScrollY, useReveal, useElementParallax, useMouseParallax, useLocalMouse } from '@/hooks/useDaury';
import type { I18nContent } from '@/lib/daury-i18n';

/* ─── Shared RevealText ─── */
export function RevealText({ children, as: Tag = 'div', className = '', style = {} }: {
  children: React.ReactNode; as?: React.ElementType; className?: string; style?: React.CSSProperties;
}) {
  const [ref, seen] = useReveal();
  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={`${className} mask-reveal${seen ? ' in' : ''}`} style={style}>
      {children}
    </Tag>
  );
}

/* ─── Marquee Strip ─── */
export function MarqueeStrip({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const y = useScrollY();
  const loop = [...items, ...items, ...items];
  // Skip scroll-driven nudge on mobile to avoid jank
  const nudge = typeof window !== 'undefined' && window.innerWidth >= 768 ? (reverse ? 1 : -1) * (y * 0.08) : 0;
  return (
    <section style={{ padding: '40px 0', position: 'relative' }}>
      <div className="marquee">
        <div className="marquee-track" style={{
          animationDirection: reverse ? 'reverse' : 'normal',
          transform: `translate3d(${nudge}px, 0, 0)`,
        }}>
          {loop.map((it, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 56,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 'clamp(44px, 7vw, 104px)', fontWeight: 400,
              letterSpacing: '-0.035em', lineHeight: 1,
              color: 'var(--ink)',
              opacity: i % 2 === 0 ? 0.9 : 0.18,
              fontStyle: i % 2 === 1 ? 'italic' : 'normal',
            }}>
              {it}
              <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--ink-mute)', flexShrink: 0 }}/>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Connected (Problem) ─── */
export function Connected({ t }: { t: I18nContent }) {
  const [titleRef, titleY] = useElementParallax(0.08);
  const [leadRef, leadY] = useElementParallax(0.04);
  return (
    <section id="approach" style={{ position: 'relative' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'end', marginBottom: 96 }} className="connected-head">
          <div ref={titleRef as React.Ref<HTMLDivElement>} style={{ transform: `translate3d(0, ${titleY}px, 0)` }}>
            <span className="eyebrow" style={{ marginBottom: 28, display: 'inline-flex' }}>{t.connected.eyebrow}</span>
            <RevealText as="h2" className="display" style={{ fontSize: 'clamp(40px, 5.6vw, 76px)', fontWeight: 500, margin: '20px 0 0', maxWidth: 640, letterSpacing: '-0.035em', lineHeight: 0.98 }}>
              {t.connected.title}
            </RevealText>
          </div>
          <p ref={leadRef as React.Ref<HTMLParagraphElement>} style={{
            fontSize: 'clamp(16px, 1.2vw, 19px)', lineHeight: 1.55, color: 'var(--ink-soft)', margin: 0, maxWidth: 460,
            transform: `translate3d(0, ${leadY}px, 0)`,
          }}>
            {t.connected.lead}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="connected-grid">
          {t.connected.problems.map((p, i) => <ProblemCard key={i} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ p, i }: { p: { icon: string; t: string; d: string }; i: number }) {
  const [revealRef, seen] = useReveal({ threshold: 0.25 });
  const [mouseRef, m] = useLocalMouse(6);
  const [parRef, parY] = useElementParallax(0.04 + i * 0.015);

  const setRef = (el: HTMLDivElement | null) => {
    (revealRef as React.MutableRefObject<HTMLElement | null>).current = el;
    (mouseRef as React.MutableRefObject<HTMLElement | null>).current = el;
    (parRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  return (
    <div ref={setRef} style={{
      padding: '48px 44px', background: 'var(--bg-elev)',
      border: '1px solid var(--rule)', borderRadius: 28,
      display: 'flex', flexDirection: 'column', gap: 18, minHeight: 260,
      opacity: seen ? 1 : 0,
      transform: seen ? `translate3d(${m.x * 0.4}px, ${parY + m.y * 0.4}px, 0)` : 'translateY(28px)',
      transition: 'opacity var(--dur-reveal) var(--ease), transform 0.4s var(--ease-out), border-color 0.3s',
      transitionDelay: seen ? `calc(${i} * var(--stagger)), 0ms, 0ms` : `calc(${i} * var(--stagger))`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at ${50 + m.x * 4}% ${50 + m.y * 4}%, color-mix(in oklab, var(--ink) 4%, transparent), transparent 55%)`,
        opacity: m.hover ? 1 : 0, transition: 'opacity 0.5s var(--ease)', pointerEvents: 'none',
      }}/>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 16, position: 'relative' }}>
        {String(i + 1).padStart(2, '0')} / 02
      </div>
      <h3 style={{
        fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500,
        fontSize: 'clamp(24px, 2.4vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15,
        margin: 0, maxWidth: 420, position: 'relative',
        transform: `translate3d(${m.x * 0.3}px, 0, 0)`, transition: 'transform 0.4s var(--ease-out)',
      }}>{p.t}</h3>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.6, maxWidth: 440, position: 'relative' }}>{p.d}</p>
    </div>
  );
}

/* ─── Core Experience ─── */
export function CoreExperience({ t }: { t: I18nContent }) {
  const [headRef, headY] = useElementParallax(0.06);
  return (
    <section id="experience" style={{ position: 'relative' }}>
      <div className="container">
        <div ref={headRef as React.Ref<HTMLDivElement>} className="section-head" style={{ marginBottom: 'clamp(64px, 9vw, 120px)', transform: `translate3d(0, ${headY}px, 0)` }}>
          <span className="eyebrow">{t.core.eyebrow}</span>
          <RevealText as="h2" className="display" style={{ fontSize: 'clamp(40px, 5.6vw, 76px)', fontWeight: 500, margin: 0, letterSpacing: '-0.035em', lineHeight: 0.98 }}>
            {t.core.title}
          </RevealText>
          <p style={{ fontSize: 'clamp(16px, 1.2vw, 19px)', color: 'var(--ink-soft)', margin: 0, maxWidth: 520 }}>{t.core.lead}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'var(--rule)', border: '1px solid var(--rule)', borderRadius: 28, overflow: 'hidden' }} className="core-grid">
          {t.core.features.map((f, i) => <FeatureCard key={i} f={f} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ f, i }: { f: { k: string; t: string; d: string; tags: string[]; color: string }; i: number }) {
  const [revealRef, seen] = useReveal({ threshold: 0.2 });
  const [mouseRef, m] = useLocalMouse(5);
  const colorVar = `var(--${f.color})`;

  const setRef = (el: HTMLDivElement | null) => {
    (revealRef as React.MutableRefObject<HTMLElement | null>).current = el;
    (mouseRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  return (
    <div ref={setRef} style={{
      padding: '48px 44px', background: 'var(--bg-elev)',
      position: 'relative', overflow: 'hidden',
      opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(24px)',
      transitionDelay: `calc(${i % 2} * var(--stagger))`,
      transitionProperty: 'opacity, transform', transitionDuration: 'var(--dur-reveal)', transitionTimingFunction: 'var(--ease)',
      display: 'flex', flexDirection: 'column', gap: 16, minHeight: 280,
    }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at ${50 + m.x * 5}% ${50 + m.y * 5}%, color-mix(in oklab, ${colorVar} 7%, transparent), transparent 55%)`,
        opacity: m.hover ? 1 : 0, transition: 'opacity 0.6s var(--ease)', pointerEvents: 'none',
      }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, position: 'relative', transform: `translate3d(${m.x * 0.8}px, ${m.y * 0.8}px, 0)`, transition: 'transform 0.4s var(--ease-out)' }}>
        <span aria-hidden style={{ width: 8, height: 8, borderRadius: 999, background: colorVar, transform: m.hover ? 'scale(1.4)' : 'scale(1)', transition: 'transform 0.4s var(--ease-out)' }}/>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{f.k} · {f.tags[0]}</span>
      </div>
      <div style={{ marginTop: 'auto', position: 'relative', transform: `translate3d(${m.x * 0.3}px, ${m.y * 0.3}px, 0)`, transition: 'transform 0.5s var(--ease-out)' }}>
        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500, fontSize: 'clamp(26px, 2.8vw, 36px)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 12px' }}>{f.t}</h3>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.55, maxWidth: 420 }}>{f.d}</p>
      </div>
    </div>
  );
}

/* ─── Flow ─── */
export function Flow({ t }: { t: I18nContent }) {
  const [headRef, headSeen] = useReveal({ threshold: 0.4 });
  const [titleRef, titleY] = useElementParallax(0.06);

  const setRef = (el: HTMLDivElement | null) => {
    (headRef as React.MutableRefObject<HTMLElement | null>).current = el;
    (titleRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  return (
    <section id="flow" style={{ position: 'relative' }}>
      <div className="container">
        <div ref={setRef} className="section-head" style={{ marginBottom: 'clamp(64px, 9vw, 120px)', transform: `translate3d(0, ${titleY}px, 0)` }}>
          <span className="eyebrow">{t.flow.eyebrow}</span>
          <RevealText as="h2" className="display" style={{ fontSize: 'clamp(40px, 5.6vw, 76px)', fontWeight: 500, margin: 0, letterSpacing: '-0.035em', lineHeight: 0.98 }}>
            {t.flow.title}
          </RevealText>
          {t.flow.lead && <p style={{ fontSize: 'clamp(16px, 1.2vw, 19px)', color: 'var(--ink-soft)', margin: 0 }}>{t.flow.lead}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, position: 'relative' }} className="flow-grid">
          <div aria-hidden className="flow-line" style={{ position: 'absolute', top: 24, left: '8%', right: '8%', height: 1, zIndex: 0, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: headSeen ? '100%' : '0%', background: 'var(--rule-2)', transition: 'width 1.4s var(--ease) 0.3s' }}/>
          </div>
          {t.flow.steps.map((s, i) => <FlowStep key={i} step={s} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function FlowStep({ step, i }: { step: { n: string; t: string; d: string }; i: number }) {
  const [revealRef, seen] = useReveal({ threshold: 0.3 });
  const [parRef, parY] = useElementParallax(0.05 + i * 0.025);
  const mouse = useMouseParallax(6);

  const setRef = (el: HTMLDivElement | null) => {
    (revealRef as React.MutableRefObject<HTMLElement | null>).current = el;
    (parRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  return (
    <div ref={setRef} style={{
      display: 'flex', flexDirection: 'column', gap: 18,
      opacity: seen ? 1 : 0,
      transform: seen ? `translate3d(${mouse.x * (i - 1) * 0.3}px, ${parY}px, 0)` : 'translateY(24px)',
      transition: 'opacity 0.9s var(--ease), transform 0.5s var(--ease-out)',
      transitionDelay: seen ? `${i * 200 + 400}ms, 0ms` : `${i * 200 + 400}ms`,
      position: 'relative', zIndex: 1,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 999,
        background: 'var(--bg)', border: '1px solid var(--rule-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Geist Mono', monospace", fontWeight: 500, fontSize: 13, letterSpacing: '0.06em', color: 'var(--ink)',
      }}>
        {step.n}
      </div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500, fontSize: 'clamp(22px, 2.2vw, 28px)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '8px 0 0', maxWidth: 280 }}>{step.t}</h3>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.55, maxWidth: 320 }}>{step.d}</p>
    </div>
  );
}
