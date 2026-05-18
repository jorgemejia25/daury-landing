'use client';
import { useState } from 'react';
import { useReveal, useElementParallax, useMouseParallax } from '@/hooks/useDaury';
import DauryMark from './Logo';
import type { I18nContent } from '@/lib/daury-i18n';

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '14px 18px',
  border: '1px solid var(--rule-2)', borderRadius: 999,
  background: 'var(--bg)', color: 'var(--ink)',
  font: 'inherit', fontSize: 15, outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s',
};

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{label}</span>
      {children}
    </label>
  );
}

export function GetInvolved({ t }: { t: I18nContent }) {
  const [data, setData] = useState({ name: '', email: '', how: '', role: t.involved.roles[0] });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ref, seen] = useReveal({ threshold: 0.15 });
  const [titleRef, titleY] = useElementParallax(0.06);
  const [formRef, formY] = useElementParallax(0.03);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await fetch('https://formsubmit.co/ajax/devjorgemejia@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          role: data.role,
          message: data.how,
          _subject: 'Daury — New Applicant',
          _captcha: 'false',
          _template: 'table',
        }),
      });
    } finally {
      setLoading(false);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
      setData({ name: '', email: '', how: '', role: t.involved.roles[0] });
    }
  };

  return (
    <section id="involved" ref={ref as React.Ref<HTMLElement>} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'start' }} className="involved-grid">
          {/* LEFT: pitch */}
          <div ref={titleRef as React.Ref<HTMLDivElement>} style={{
            opacity: seen ? 1 : 0,
            transform: seen ? `translate3d(0, ${titleY}px, 0)` : 'translateY(20px)',
            transition: 'opacity 0.9s var(--ease), transform 0.5s var(--ease-out)',
          }}>
            <span className="eyebrow">{t.involved.eyebrow}</span>
            <h2 className="display" style={{ fontSize: 'clamp(48px, 7vw, 110px)', fontWeight: 500, margin: '24px 0 24px', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
              <span style={{ color: 'var(--ink)' }}>{t.involved.title_a} </span>
              <span style={{ fontStyle: 'italic', color: 'var(--ink-2)' }}>{t.involved.title_b}</span>
            </h2>
            <p style={{ fontSize: 'clamp(16px, 1.3vw, 19px)', lineHeight: 1.55, color: 'var(--ink-2)', margin: 0, maxWidth: 540 }}>{t.involved.lead}</p>
          </div>

          {/* RIGHT: form */}
          <form ref={formRef as React.Ref<HTMLFormElement>} onSubmit={onSubmit} style={{
            padding: 'clamp(32px, 4vw, 48px)', borderRadius: 28,
            background: 'var(--bg-elev)', border: '1px solid var(--rule)',
            display: 'flex', flexDirection: 'column', gap: 24,
            opacity: seen ? 1 : 0,
            transform: seen ? `translate3d(0, ${formY}px, 0)` : 'translateY(20px)',
            transition: 'opacity 0.9s var(--ease) 150ms, transform 0.5s var(--ease-out)',
          }}>
            <FormField label={t.involved.fields.name}>
              <input type="text" required value={data.name} onChange={e => setData({ ...data, name: e.target.value })} style={fieldStyle} />
            </FormField>
            <FormField label={t.involved.fields.email}>
              <input type="email" required value={data.email} onChange={e => setData({ ...data, email: e.target.value })} style={fieldStyle} />
            </FormField>
            <FormField label={t.involved.fields.how}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {t.involved.roles.map(r => (
                  <button key={r} type="button" onClick={() => setData({ ...data, role: r })} style={{
                    padding: '8px 14px', borderRadius: 999,
                    border: '1px solid ' + (data.role === r ? 'var(--ink)' : 'var(--rule-2)'),
                    background: data.role === r ? 'var(--ink)' : 'transparent',
                    color: data.role === r ? 'var(--bg)' : 'var(--ink-2)',
                    fontSize: 13, transition: 'all 0.3s var(--ease)', cursor: 'pointer',
                  }}>{r}</button>
                ))}
              </div>
              <textarea
                placeholder={t.involved.fields.howPh}
                value={data.how}
                onChange={e => setData({ ...data, how: e.target.value })}
                rows={3}
                style={{ ...fieldStyle, borderRadius: 18, resize: 'vertical', minHeight: 90 }}
              />
            </FormField>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent: 'center', padding: '16px 28px', fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {sent ? t.involved.sent : loading ? '…' : t.involved.submit}
              {!sent && !loading && <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}
            </button>
            <p style={{ fontSize: 12, color: 'var(--ink-mute)', margin: 0, lineHeight: 1.55 }}>{t.involved.legal}</p>
          </form>
        </div>
      </div>
    </section>
  );
}

export function FooterSection({ t }: { t: I18nContent }) {
  const mouse = useMouseParallax(40);
  const [wmRef, wmY] = useElementParallax(0.18);

  return (
    <footer style={{ position: 'relative', padding: '96px 0 48px', borderTop: '1px solid var(--rule)', background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 48, marginBottom: 96 }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <DauryMark size={30} />
              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em' }}>Daury</span>
            </div>
            <p style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 22, fontWeight: 400, lineHeight: 1.3,
              letterSpacing: '-0.01em', margin: 0, maxWidth: 360,
              color: 'var(--ink-2)', fontStyle: 'italic',
            }}>{t.footer.tagline}</p>
          </div>

          {t.footer.cols.map((col, i) => (
            <div key={i}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 16 }}>{col.t}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.l.map((it, j) => (
                  <li key={j}><a href="#" className="link-u" style={{ fontSize: 14, color: 'var(--ink-2)' }}>{it}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant wordmark */}
        <div
          ref={wmRef as React.Ref<HTMLDivElement>}
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 'clamp(80px, 22vw, 340px)', fontWeight: 500,
            letterSpacing: '-0.055em', lineHeight: 0.85,
            color: 'var(--ink)', opacity: 0.92,
            paddingBottom: 16, borderBottom: '1px solid var(--rule)',
            marginBottom: 28, overflow: 'hidden',
            transform: `translate3d(${mouse.x * 0.6}px, ${wmY * 0.5}px, 0)`,
            transition: 'transform 0.5s var(--ease-out)',
            whiteSpace: 'nowrap',
          }}>
          daury<span style={{
            color: 'var(--blue)', display: 'inline-block',
            transform: `translate3d(${mouse.x * 1.4}px, ${mouse.y * 0.6}px, 0)`,
            transition: 'transform 0.4s var(--ease-out)',
          }}>.</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, fontSize: 12, color: 'var(--ink-mute)' }}>
          <span className="mono">{t.footer.copy}</span>
          <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--green)' }}/>
            ALL SYSTEMS NOMINAL
          </span>
        </div>
      </div>
    </footer>
  );
}
