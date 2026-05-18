'use client';
import { useReveal, useElementParallax, useLocalMouse } from '@/hooks/useDaury';
import { RevealText } from './Approach';
import type { I18nContent } from '@/lib/daury-i18n';

/* ─── Story ─── */
export function Story({ t }: { t: I18nContent }) {
  return (
    <section id="story" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 96, alignItems: 'start' }} className="story-grid">
          {/* LEFT: meta panel */}
          <div style={{ position: 'sticky', top: 140 }} className="story-meta">
            <span className="eyebrow">{t.story.eyebrow}</span>
            <RevealText as="h2" className="display" style={{ fontSize: 'clamp(40px, 5.2vw, 68px)', fontWeight: 500, margin: '24px 0 40px', lineHeight: 1, letterSpacing: '-0.035em' }}>
              {t.story.title}
            </RevealText>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 28, borderTop: '1px solid var(--rule)' }}>
              {t.story.meta.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{m.l}</span>
                  <span style={{ fontSize: 16, color: 'var(--ink)', fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.01em' }}>{m.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {t.story.paragraphs.map((para, i) => (
              <StoryParagraph key={i} text={para} index={i} />
            ))}
            <PullQuote text={t.story.pull} label={t.story.pullLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryParagraph({ text, index }: { text: string; index: number }) {
  const [revealRef, seen] = useReveal({ threshold: 0.25 });
  const [parRef, parY] = useElementParallax(0.025 + index * 0.012);

  const setRef = (el: HTMLDivElement | null) => {
    (revealRef as React.MutableRefObject<HTMLElement | null>).current = el;
    (parRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  return (
    <div ref={setRef} style={{
      padding: '32px 0',
      borderTop: index === 0 ? '1px solid var(--rule)' : 'none',
      borderBottom: '1px solid var(--rule)',
      opacity: seen ? 1 : 0,
      transform: seen ? `translate3d(0, ${parY}px, 0)` : 'translateY(16px)',
      transition: 'opacity var(--dur-reveal) var(--ease), transform 0.5s var(--ease-out)',
      display: 'flex', gap: 28, alignItems: 'flex-start',
    }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink-mute)', flexShrink: 0, paddingTop: 8, width: 28 }}>
        {String(index + 1).padStart(2, '0')}
      </div>
      <p style={{
        fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500,
        fontSize: 'clamp(20px, 2.1vw, 28px)', lineHeight: 1.3,
        letterSpacing: '-0.015em', margin: 0, color: 'var(--ink)', flex: 1, textWrap: 'pretty',
      }}>{text}</p>
    </div>
  );
}

function PullQuote({ text, label }: { text: string; label: string }) {
  const [revealRef, seen] = useReveal({ threshold: 0.3 });
  const [parRef, parY] = useElementParallax(0.08);

  const setRef = (el: HTMLDivElement | null) => {
    (revealRef as React.MutableRefObject<HTMLElement | null>).current = el;
    (parRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  return (
    <div ref={setRef} style={{
      padding: '56px 0 0', opacity: seen ? 1 : 0,
      transform: seen ? `translate3d(0, ${parY}px, 0)` : 'translateY(16px)',
      transition: 'opacity var(--dur-reveal) var(--ease), transform 0.5s var(--ease-out)',
    }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 18 }}>{label}</div>
      <p style={{
        fontFamily: "'Bricolage Grotesque', sans-serif", fontStyle: 'italic', fontWeight: 400,
        fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.15,
        letterSpacing: '-0.02em', margin: 0, color: 'var(--ink-2)', textWrap: 'balance', maxWidth: 600,
      }}>{text}</p>
    </div>
  );
}

/* ─── Scale ─── */
export function Scale({ t }: { t: I18nContent }) {
  const [headRef, headY] = useElementParallax(0.06);
  return (
    <section id="scale" style={{ position: 'relative' }}>
      <div className="container">
        <div ref={headRef as React.Ref<HTMLDivElement>} className="section-head" style={{ marginBottom: 'clamp(64px, 9vw, 120px)', transform: `translate3d(0, ${headY}px, 0)` }}>
          <span className="eyebrow">{t.scale.eyebrow}</span>
          <RevealText as="h2" className="display" style={{ fontSize: 'clamp(40px, 5.6vw, 76px)', fontWeight: 500, margin: 0, letterSpacing: '-0.035em', lineHeight: 0.98, maxWidth: 900 }}>
            {t.scale.title}
          </RevealText>
          <p style={{ fontSize: 'clamp(16px, 1.2vw, 19px)', color: 'var(--ink-soft)', margin: 0 }}>{t.scale.lead}</p>
        </div>

        {/* Delivers / Is Not */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--rule)', border: '1px solid var(--rule)', borderRadius: 28, overflow: 'hidden', marginBottom: 96 }} className="versus-grid">
          <VersusList title={t.scale.delivers.t} label={t.scale.labels.delivers} list={t.scale.delivers.list} positive />
          <VersusList title={t.scale.isnot.t} label={t.scale.labels.isnot} list={t.scale.isnot.list} positive={false} />
        </div>

        {/* Phases */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 96 }} className="phases-grid">
          {t.scale.phases.map((ph, i) => <PhaseCard key={i} phase={ph} i={i} />)}
        </div>

        <VisionQuote text={t.scale.vision} label={t.scale.labels.vision} />
      </div>
    </section>
  );
}

function VersusList({ title, label, list, positive }: { title: string; label: string; list: string[]; positive: boolean }) {
  const [ref, seen] = useReveal({ threshold: 0.2 });
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} style={{
      padding: '48px 44px', background: 'var(--bg-elev)',
      opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity var(--dur-reveal) var(--ease), transform var(--dur-reveal) var(--ease)',
      transitionDelay: positive ? '0ms' : 'var(--stagger)',
      display: 'flex', flexDirection: 'column', gap: 28, minHeight: 360,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span aria-hidden style={{ width: 8, height: 8, borderRadius: 999, background: positive ? 'var(--green)' : 'var(--ink-mute)' }}/>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500, fontSize: 'clamp(24px, 2.6vw, 34px)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: 0, maxWidth: 380 }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 'auto 0 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {list.map((item, i) => (
          <li key={i} style={{
            display: 'flex', gap: 16, alignItems: 'flex-start',
            padding: '14px 0', borderTop: '1px solid var(--rule)',
            opacity: seen ? 1 : 0, transform: seen ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'opacity 0.5s var(--ease), transform 0.5s var(--ease)',
            transitionDelay: `calc(160ms + ${i} * var(--stagger))`,
          }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: positive ? 'var(--green)' : 'var(--ink-mute)', flexShrink: 0, paddingTop: 4, width: 18 }}>
              {positive ? '+' : '—'}
            </span>
            <span style={{ fontSize: 15, lineHeight: 1.55, color: positive ? 'var(--ink-2)' : 'var(--ink-soft)', flex: 1 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhaseCard({ phase, i }: { phase: { n: string; t: string; points: string[] }; i: number }) {
  const [revealRef, seen] = useReveal({ threshold: 0.2 });
  const [parRef, parY] = useElementParallax(0.05 + i * 0.03);
  const [mouseRef, m] = useLocalMouse(5);
  const featured = i === 1;

  const setRef = (el: HTMLDivElement | null) => {
    (revealRef as React.MutableRefObject<HTMLElement | null>).current = el;
    (parRef as React.MutableRefObject<HTMLElement | null>).current = el;
    (mouseRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  return (
    <div ref={setRef} style={{
      padding: '44px 40px', borderRadius: 28,
      background: featured ? 'var(--ink)' : 'var(--bg-elev)',
      color: featured ? 'var(--bg)' : 'var(--ink)',
      border: featured ? '1px solid var(--ink)' : '1px solid var(--rule)',
      opacity: seen ? 1 : 0,
      transform: seen ? `translate3d(${m.x * 0.4}px, ${parY + m.y * 0.4}px, 0)` : 'translateY(20px)',
      transition: 'opacity var(--dur-reveal) var(--ease), transform 0.4s var(--ease-out)',
      transitionDelay: seen ? `calc(${i} * var(--stagger)), 0ms` : `calc(${i} * var(--stagger))`,
      position: 'relative', overflow: 'hidden', minHeight: 320,
      display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      {featured && (
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at ${50 + m.x * 6}% ${50 + m.y * 6}%, color-mix(in oklab, var(--violet) 22%, transparent), transparent 55%)`,
          opacity: m.hover ? 1 : 0.4, transition: 'opacity 0.6s var(--ease)', pointerEvents: 'none',
        }}/>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: featured ? 'color-mix(in oklab, var(--bg) 55%, transparent)' : 'var(--ink-mute)', textTransform: 'uppercase' }}>{phase.n}</span>
        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500, fontSize: 22, opacity: featured ? 0.22 : 0.18, letterSpacing: '-0.04em' }}>{String(i + 1).padStart(2, '0')}</span>
      </div>
      <h3 style={{
        fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500,
        fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.02em', lineHeight: 1.05,
        margin: 0, maxWidth: 360, position: 'relative',
        transform: `translate3d(${m.x * 0.3}px, ${m.y * 0.2}px, 0)`, transition: 'transform 0.4s var(--ease-out)',
      }}>{phase.t}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 'auto 0 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {phase.points.map((pt, j) => (
          <li key={j} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            padding: '12px 0',
            borderTop: featured ? '1px solid color-mix(in oklab, var(--bg) 10%, transparent)' : '1px solid var(--rule)',
            opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s var(--ease), transform 0.5s var(--ease)',
            transitionDelay: `calc(200ms + ${j} * var(--stagger))`,
          }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: featured ? 'color-mix(in oklab, var(--bg) 55%, transparent)' : 'var(--ink-mute)', flexShrink: 0, paddingTop: 3, width: 22 }}>{String(j + 1).padStart(2, '0')}</span>
            <span style={{ fontSize: 15, lineHeight: 1.55, color: featured ? 'color-mix(in oklab, var(--bg) 86%, transparent)' : 'var(--ink-2)', flex: 1 }}>{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VisionQuote({ text, label }: { text: string; label: string }) {
  const [revealRef, seen] = useReveal({ threshold: 0.2 });
  const [parRef, parY] = useElementParallax(0.1);

  const setRef = (el: HTMLDivElement | null) => {
    (revealRef as React.MutableRefObject<HTMLElement | null>).current = el;
    (parRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  return (
    <div ref={setRef} style={{
      padding: 'clamp(56px, 8vw, 96px) 0 24px', borderTop: '1px solid var(--rule)',
      opacity: seen ? 1 : 0,
      transform: seen ? `translate3d(0, ${parY}px, 0)` : 'translateY(20px)',
      transition: 'opacity var(--dur-reveal) var(--ease), transform 0.5s var(--ease-out)',
      display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64, alignItems: 'start',
    }} className="vision-grid">
      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{label}</div>
      <p style={{
        fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 400, fontStyle: 'italic',
        fontSize: 'clamp(28px, 3.4vw, 48px)', lineHeight: 1.18,
        letterSpacing: '-0.02em', margin: 0, maxWidth: 920, color: 'var(--ink-2)', textWrap: 'balance',
      }}>{text}</p>
    </div>
  );
}
