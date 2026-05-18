'use client';
import { useState } from 'react';
import { useReveal, useCounter } from '@/hooks/useDaury';
import { RevealText } from './Approach';
import type { I18nContent, TeamMember } from '@/lib/daury-i18n';

function TeamStat({ label, value }: { label: string; value: string }) {
  const isNumber = /^\d+$/.test(value);
  const [ref, current] = useCounter(isNumber ? parseInt(value) : 0);
  return (
    <div ref={isNumber ? (ref as React.Ref<HTMLDivElement>) : null} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 500, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
        {isNumber ? Math.round(current) : value}
      </span>
    </div>
  );
}

export default function TeamSection({ t }: { t: I18nContent }) {
  const members = t.team.members;
  return (
    <section id="team" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <header style={{
          display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 80,
          alignItems: 'end', marginBottom: 72,
          paddingBottom: 28, borderBottom: '1px solid var(--rule)',
        }} className="team-head">
          <div>
            <span className="eyebrow">{t.team.eyebrow}</span>
            <RevealText as="h2" className="display" style={{
              fontSize: 'clamp(40px, 5.6vw, 76px)', fontWeight: 500,
              margin: '20px 0 0', whiteSpace: 'pre-line',
              letterSpacing: '-0.035em', lineHeight: 0.98,
            }}>
              {t.team.title}
            </RevealText>
          </div>
          <div>
            <p style={{ fontSize: 'clamp(16px, 1.2vw, 19px)', lineHeight: 1.55, color: 'var(--ink-soft)', margin: '0 0 28px', maxWidth: 420 }}>{t.team.lead}</p>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              {t.team.stats.map((s, i) => <TeamStat key={i} label={s.l} value={s.v} />)}
            </div>
          </div>
        </header>

        <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {members.map((m, i) => <MemberCard key={m.i} m={m} idx={i} />)}
        </div>

        <div style={{
          marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--rule)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }} className="team-rail">
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--green)' }}/>
            {t.team.origin}
          </span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            01 — {String(members.length).padStart(2, '0')} · {t.team.stats[1].v}
          </span>
        </div>
      </div>
    </section>
  );
}

function MemberCard({ m, idx }: { m: TeamMember; idx: number }) {
  const [ref, seen] = useReveal({ threshold: 0.15 });
  const [hover, setHover] = useState(false);
  const isLead = m.role === 'lead';
  const leadLabel = m.r.includes('Master') ? 'Process Lead' : 'Tech Lead';

  return (
    <article
      ref={ref as React.Ref<HTMLElement>}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s var(--ease) calc(${idx} * var(--stagger)), transform 0.6s var(--ease) calc(${idx} * var(--stagger))`,
      }}
    >
      {/* Photo frame */}
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '4 / 5',
        overflow: 'hidden', borderRadius: 14, background: 'var(--bg-2)',
        border: '1px solid var(--rule)', transition: 'border-color 0.3s var(--ease)',
        borderColor: hover ? 'var(--rule-2)' : 'var(--rule)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={m.img}
          alt={m.n}
          loading="lazy"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 28%',
            filter: hover ? 'saturate(1) contrast(1)' : 'saturate(0.7) contrast(0.96)',
            transform: hover ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 1s var(--ease), filter 0.6s var(--ease)',
          }}
        />
        <div className="mono" style={{
          position: 'absolute', top: 12, left: 12, fontSize: 10, letterSpacing: '0.2em',
          color: 'var(--photo-index-fg)', background: 'var(--photo-index-bg)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          padding: '4px 8px', borderRadius: 6,
        }}>
          {String(idx + 1).padStart(2, '0')}
        </div>
        {isLead && (
          <div className="mono" style={{
            position: 'absolute', top: 12, right: 12, fontSize: 9.5,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--photo-badge-fg)', background: 'var(--photo-badge-bg)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            padding: '4px 9px', borderRadius: 6, fontWeight: 500,
          }}>
            {leadLabel}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500, fontSize: 19, letterSpacing: '-0.015em', lineHeight: 1.15, margin: 0, color: 'var(--ink)' }}>{m.n}</h3>
        <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.4 }}>{m.r}</div>
      </div>

      {/* Meta */}
      <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{m.p}</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.14em' }}>{m.o}</span>
      </div>
    </article>
  );
}
