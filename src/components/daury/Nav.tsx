'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useScrollY } from '@/hooks/useDaury';
import DauryMark from './Logo';
import type { I18nContent } from '@/lib/daury-i18n';
import type { Theme } from '@/lib/theme';

interface NavProps {
  lang: string;
  setLang: (lang: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: I18nContent;
}

function useMatchMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatch(e.matches);
    setMatch(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return match;
}

export default function Nav({ lang, setLang, theme, setTheme, t }: NavProps) {
  const y = useScrollY();
  const scrolled = y > 40;
  const isMobile = useMatchMedia('(max-width: 900px)');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  useEffect(() => { if (!isMobile) setOpen(false); }, [isMobile]);

  const links = [
    { href: '#experience', label: t.nav.experience },
    { href: '#approach',   label: t.nav.approach },
    { href: '#story',      label: t.nav.story },
    { href: '#team',       label: t.nav.team },
    { href: '#involved',   label: t.nav.involved },
  ];

  return (
    <>
      <div style={{
        position: 'fixed', top: 18, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        padding: isMobile ? '0 var(--pad)' : 0,
        transition: 'top 0.4s var(--ease)',
      }}>
        <nav style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 6 : 8,
          padding: isMobile ? '6px 6px 6px 14px' : '8px 10px 8px 18px',
          background: scrolled ? 'color-mix(in oklab, var(--bg-elev) 80%, transparent)' : 'var(--bg-elev)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--rule)',
          borderRadius: 999,
          boxShadow: scrolled ? 'var(--shadow-soft)' : '0 1px 2px rgba(7,9,26,0.04)',
          transition: 'all 0.4s var(--ease)',
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? '100%' : 'none',
        }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: isMobile ? 0 : 18, borderRight: isMobile ? 'none' : '1px solid var(--rule)' }}>
            <DauryMark size={isMobile ? 26 : 28} />
            <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, fontSize: isMobile ? 18 : 19, letterSpacing: '-0.02em' }}>Daury</span>
          </a>

          {!isMobile && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px' }}>
                {links.map(l => <NavLink key={l.href} href={l.href} label={l.label} />)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 8, borderLeft: '1px solid var(--rule)' }}>
                <LangToggle lang={lang} setLang={setLang} />
                <ThemeToggle theme={theme} setTheme={setTheme} />
                <a href="#involved" className="btn btn-blue" style={{ padding: '10px 18px', fontSize: 14 }}>
                  {t.nav.cta}
                  <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
              </div>
            </>
          )}

          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
              <ThemeToggle theme={theme} setTheme={setTheme} />
              <MenuButton open={open} setOpen={setOpen} />
            </div>
          )}
        </nav>
      </div>

      {isMobile && <MobileSheet open={open} setOpen={setOpen} links={links} lang={lang} setLang={setLang} t={t} />}
    </>
  );
}

function MobileSheet({ open, setOpen, links, lang, setLang, t }: {
  open: boolean; setOpen: (v: boolean) => void;
  links: {href: string; label: string}[];
  lang: string; setLang: (l: string) => void;
  t: I18nContent;
}) {
  return (
    <div
      aria-hidden={!open}
      style={{
        position: 'fixed', inset: 0, zIndex: 99,
        pointerEvents: open ? 'auto' : 'none',
        background: 'color-mix(in oklab, var(--bg) 96%, transparent)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        opacity: open ? 1 : 0, transition: 'opacity 0.4s var(--ease)',
        display: 'flex', flexDirection: 'column',
        padding: '92px 24px 28px', overflow: 'auto',
      }}
    >
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 28, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--green)' }}/>
        Menu
      </span>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4, borderTop: '1px solid var(--rule)' }}>
        {links.map((l, i) => (
          <li key={l.href} style={{
            borderBottom: '1px solid var(--rule)',
            transform: open ? 'translateY(0)' : 'translateY(12px)',
            opacity: open ? 1 : 0,
            transition: `opacity 0.5s var(--ease) ${120 + i * 60}ms, transform 0.5s var(--ease) ${120 + i * 60}ms`,
          }}>
            <a href={l.href} onClick={() => setOpen(false)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 4px',
              fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500,
              fontSize: 30, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 14 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.14em' }}>{String(i + 1).padStart(2, '0')}</span>
                {l.label}
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--ink-mute)' }}>
                <path d="M7 17L17 7M9 7h8v8"/>
              </svg>
            </a>
          </li>
        ))}
      </ul>

      <a href="#involved" onClick={() => setOpen(false)} className="btn btn-blue" style={{
        marginTop: 32, padding: '16px 24px', fontSize: 16,
        justifyContent: 'space-between', width: '100%',
        opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.6s var(--ease) 480ms, transform 0.6s var(--ease) 480ms',
      }}>
        {t.nav.cta}
        <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>

      <div style={{
        marginTop: 'auto', paddingTop: 32,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        opacity: open ? 1 : 0, transition: 'opacity 0.6s var(--ease) 560ms',
      }}>
        <LangToggle lang={lang} setLang={setLang} />
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>USAC · Guatemala</span>
      </div>
    </div>
  );
}

function MenuButton({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <button onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} style={{
      width: 40, height: 40, borderRadius: 999,
      background: open ? 'var(--ink)' : 'var(--bg-2)',
      color: open ? 'var(--bg)' : 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.3s var(--ease), color 0.3s var(--ease)',
      position: 'relative',
    }}>
      <span style={{ position: 'relative', width: 16, height: 12, display: 'block' }}>
        <span style={{
          position: 'absolute', left: 0, right: 0, height: 1.5, background: 'currentColor', borderRadius: 2,
          top: open ? '50%' : 2,
          transform: open ? 'translateY(-50%) rotate(45deg)' : 'none',
          transition: 'transform 0.35s var(--ease), top 0.35s var(--ease)',
        }}/>
        <span style={{
          position: 'absolute', left: 0, right: 0, height: 1.5, background: 'currentColor', borderRadius: 2,
          bottom: open ? '50%' : 2,
          transform: open ? 'translateY(50%) rotate(-45deg)' : 'none',
          transition: 'transform 0.35s var(--ease), bottom 0.35s var(--ease)',
        }}/>
      </span>
    </button>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="link-u" style={{ padding: '8px 12px', fontSize: 14, color: 'var(--ink-2)', borderRadius: 999, transition: 'background 0.3s' }}>
      {label}
    </a>
  );
}

export function LangToggle({ lang, setLang }: { lang: string; setLang: (l: string) => void }) {
  return (
    <div style={{ display: 'flex', background: 'var(--bg-2)', borderRadius: 999, padding: 3, fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.06em' }}>
      {(['es', 'en'] as const).map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding: '6px 10px', borderRadius: 999,
          background: lang === l ? 'var(--ink)' : 'transparent',
          color: lang === l ? 'var(--bg)' : 'var(--ink-soft)',
          textTransform: 'uppercase', transition: 'all 0.3s',
        }}>{l}</button>
      ))}
    </div>
  );
}

export function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = theme === 'dark';
  return (
    <button onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="Toggle theme" style={{
      width: 36, height: 36, borderRadius: 999, background: 'var(--bg-2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ transition: 'transform 0.5s var(--ease)', transform: mounted && isDark ? 'rotate(40deg)' : 'rotate(0)' }}>
        {mounted && isDark ? (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
        ) : (
          <>
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </>
        )}
      </svg>
    </button>
  );
}
