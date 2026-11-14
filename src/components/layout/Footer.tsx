import Link from "next/link";
import { Logo } from "../ui/Logo";
import { Icon } from "../ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { pages, site } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Footer({ t, lang }: { t: Dictionary; lang: Locale }) {
  const n = t.nav;
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo size="lg" />
            <p className="footer__claim">{t.footer.claim}</p>
            <a href={`mailto:${site.email}`} className="footer__mail">
              <Icon name="mail" size={20} />
              {site.email}
            </a>
          </div>
          <div className="footer__cols">
            <nav className="footer__col" aria-label={t.footer.pages}>
              <b className="footer__heading">{t.footer.pages}</b>
              {pages.map((p) => (
                <Link key={p.key} href={`/${lang}${p.path}`}>
                  {n[p.key]}
                </Link>
              ))}
            </nav>
            <nav className="footer__col" aria-label={t.footer.help}>
              <b className="footer__heading">{t.footer.help}</b>
              <Link href={`/${lang}/pricing#preguntas`}>{t.faq.title}</Link>
              <Link href={`/${lang}/contact#acceso`}>{n.earlyAccess}</Link>
              <a href={`mailto:${site.email}`}>{n.contact}</a>
            </nav>
            <LanguageSwitcher lang={lang} label={n.language} variant="footer" />
          </div>
        </div>
      </div>
      <p aria-hidden="true" className="footer__word">
        daury
      </p>
      <div className="footer__bottom">
        <span>
          © {new Date().getFullYear()} {site.name} · {t.footer.country}
        </span>
        <span>{t.footer.madeWith}</span>
      </div>
    </footer>
  );
}
