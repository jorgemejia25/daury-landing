'use client';
import { useState, useRef } from 'react';
import { useScrollY, useMouseParallax } from '@/hooks/useDaury';
import type { I18nContent } from '@/lib/daury-i18n';

interface HeroProps { t: I18nContent; }

export default function Hero({ t }: HeroProps) {
  const y = useScrollY();
  const mouse = useMouseParallax(18);

  const eyebrowShift = `translate3d(${mouse.x * 0.6}px, ${-y * 0.08 + mouse.y * 0.5}px, 0)`;
  const titleShift   = `translate3d(${mouse.x * -0.25}px, ${-y * 0.05 + mouse.y * -0.2}px, 0)`;
  const ctaShift     = `translate3d(${mouse.x * -0.4}px, ${-y * 0.02 + mouse.y * -0.3}px, 0)`;

  return (
    <section id="hero" style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'stretch',
      paddingTop: 120, paddingBottom: 80,
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(40px, 6vh, 64px)', alignItems: 'center' }}>
        {/* eyebrow */}
        <div style={{ transform: eyebrowShift, animation: 'heroFade 1s var(--ease) 0.1s both', transition: 'transform 0.4s var(--ease-out)' }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)', display: 'inline-flex', alignItems: 'center', gap: 14 }}>
            <span style={{ display: 'inline-block', width: 28, height: 1, background: 'var(--ink-mute)' }}/>
            {t.hero.tag}
          </span>
        </div>

        {/* Title */}
        <h1 className="display display-tight" style={{
          fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500,
          fontSize: 'clamp(56px, 10vw, 144px)', margin: 0,
          transform: titleShift, textWrap: 'balance',
          letterSpacing: '-0.035em', lineHeight: 0.92, maxWidth: 1080,
          animation: 'heroFade 1.2s var(--ease) 0.3s both',
          transition: 'transform 0.5s var(--ease-out)',
        }}>
          {t.hero.title_a}
          <br/>
          <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--ink-2)' }}>{t.hero.title_b}</span>
        </h1>

        {/* lead + CTA */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'minmax(0, 520px) auto', gap: 48,
          alignItems: 'end', justifyContent: 'space-between', flexWrap: 'wrap',
          transform: ctaShift, animation: 'heroFade 1s var(--ease) 0.7s both',
          transition: 'transform 0.4s var(--ease-out)',
        }} className="hero-foot">
          <p style={{ fontSize: 'clamp(17px, 1.4vw, 21px)', lineHeight: 1.45, color: 'var(--ink-2)', margin: 0, maxWidth: 520 }}>
            {t.hero.lead}
          </p>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <MagneticButton href="#experience" variant="primary">
              {t.hero.cta1}
              <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </MagneticButton>
            <a href="#flow" className="link-u" style={{ fontSize: 14, color: 'var(--ink-2)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {t.hero.cta2}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div style={{
        position: 'absolute', bottom: 36, left: '50%',
        transform: `translateX(-50%) translate3d(0, ${-y * 0.4}px, 0)`,
        opacity: Math.max(0, 1 - y / 240), zIndex: 2,
      }}>
        <ScrollCue />
      </div>

      <style>{`
        @keyframes heroFade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </section>
  );
}

function ScrollCue() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--ink-mute) 0%, transparent 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 12, background: 'var(--ink)', animation: 'cuedown 2.4s ease-in-out infinite' }}/>
      </div>
      <style>{`@keyframes cuedown { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }`}</style>
    </div>
  );
}

export function MagneticButton({ href, variant = 'primary', children, ...rest }: {
  href: string; variant?: 'primary' | 'ghost'; children: React.ReactNode; [key: string]: unknown;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <a
      ref={ref}
      href={href}
      className={'btn ' + (variant === 'primary' ? 'btn-primary' : 'btn-ghost')}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setT({ x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.18 });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      style={{
        transform: `translate3d(${t.x}px, ${t.y}px, 0)`,
        transition: t.x === 0 && t.y === 0 ? 'transform 0.6s cubic-bezier(0.22,1,0.36,1)' : 'transform 0.18s ease-out',
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
