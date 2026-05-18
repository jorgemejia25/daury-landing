'use client';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePersist, useScrollY } from '@/hooks/useDaury';
import { i18n } from '@/lib/daury-i18n';
import { applyTheme, type Theme } from '@/lib/theme';
import GradientField from './daury/GradientField';
import Nav from './daury/Nav';
import Hero from './daury/Hero';
import { MarqueeStrip, Connected, CoreExperience, Flow } from './daury/Approach';
import { Story, Scale } from './daury/StoryScale';
import TeamSection from './daury/TeamSection';
import { GetInvolved, FooterSection } from './daury/InvolvedFooter';
import type { AppLocale } from '@/i18n/config';

type LandingPageProps = {
  locale: AppLocale;
  initialTheme: Theme;
};

function ScrollProgressBar() {
  const y = useScrollY();
  const pct = typeof document !== 'undefined'
    ? Math.min(100, (y / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) * 100)
    : 0;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, height: 2,
      width: `${pct}%`,
      background: 'linear-gradient(90deg, var(--blue), var(--violet), var(--green))',
      zIndex: 200, transition: 'width 0.1s linear',
    }}/>
  );
}

export default function LandingPage({ locale, initialTheme }: LandingPageProps) {
  const router = useRouter();
  const [theme, setThemeState] = usePersist<Theme>('daury.theme', 'light', initialTheme);
  const [lang, setLangState] = usePersist<string>('daury.lang', locale, locale);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
  }, [setThemeState]);

  /* Keep document theme in sync after hydration (e.g. localStorage restore). */
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  /* Sync lang with html lang attribute */
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  /* On first load, sync persisted lang with URL locale */
  useEffect(() => {
    if (lang !== locale) {
      setLangState(locale);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (newLang: string) => {
    setLangState(newLang);
    document.cookie = `locale=${newLang}; path=/; max-age=31536000`;
    router.push(`/${newLang}`);
  };

  const t = i18n[lang as 'es' | 'en'] ?? i18n.en;

  return (
    <div id="top" style={{ position: 'relative' }}>
      <ScrollProgressBar />
      <GradientField />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} t={t} />
        <Hero t={t} />
        <MarqueeStrip items={t.marquee} />
        <Connected t={t} />
        <CoreExperience t={t} />
        <Flow t={t} />
        <Story t={t} />
        <Scale t={t} />
        <MarqueeStrip items={t.marquee} reverse />
        <TeamSection t={t} />
        <GetInvolved t={t} />
        <FooterSection t={t} />
      </div>
    </div>
  );
}
