import Link from "next/link";
import { Logo } from "@/ui/atoms/Logo";
import { Icon } from "@/ui/atoms/Icon";
import { LanguageSwitcher } from "@/features/landing/components/molecules/LanguageSwitcher";
import { pages, site } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Footer({ t, lang }: { t: Dictionary; lang: Locale }) {
  const n = t.nav;
  return (
    <footer className={"l-footer relative overflow-hidden [margin-top:clamp(40px,_6vw,_80px)] [padding:clamp(64px,_8vw,_104px)_var(--gutter)_max(24px,_env(safe-area-inset-bottom))] [border-radius:48px_48px_0_0] [background:var(--navy)] [color:#fff] [&_.l-logo]:[color:#fff] max-[760.02px]:[border-radius:32px_32px_0_0]"}>
      <div className={"l-footer--inner max-w-[1240px] [margin:0_auto]"}>
        <div className={"l-footer--top flex flex-wrap justify-between gap-[48px]"}>
          <div className={"l-footer--brand flex flex-col items-start gap-[20px] max-w-[360px]"}>
            <Logo size="lg" />
            <p className={"l-footer--claim m-0 text-[18px] leading-[1.5] [color:rgba(255,_255,_255,_.68)]"}>{t.footer.claim}</p>
            <a href={`mailto:${site.email}`} className={"l-footer--mail inline-flex items-center gap-[10px] [padding:12px_18px] rounded-full [background:rgba(255,_255,_255,_.08)] [color:#fff] font-semibold no-underline [transition:background-color_.2s] [&:hover]:[background:rgba(255,_255,_255,_.16)] [&:hover]:[color:#fff]"}>
              <Icon name="mail" size={20} />
              {site.email}
            </a>
          </div>
          <div className={"l-footer--cols flex flex-wrap [gap:48px_clamp(40px,_6vw,_96px)]"}>
            <nav className={"l-footer--col flex flex-col gap-[10px] [&_a]:[color:rgba(255,_255,_255,_.62)] [&_a]:no-underline [&_a]:text-[16px] [&_a]:font-medium [&_a]:[transition:color_.2s] [&_a:hover]:[color:#fff]"} aria-label={t.footer.pages}>
              <b className={"l-footer--heading mb-[6px] text-[14px] font-bold [color:#fff]"}>{t.footer.pages}</b>
              {pages.map((p) => (
                <Link key={p.key} href={`/${lang}${p.path}`}>
                  {n[p.key]}
                </Link>
              ))}
            </nav>
            <nav className={"l-footer--col flex flex-col gap-[10px] [&_a]:[color:rgba(255,_255,_255,_.62)] [&_a]:no-underline [&_a]:text-[16px] [&_a]:font-medium [&_a]:[transition:color_.2s] [&_a:hover]:[color:#fff]"} aria-label={t.footer.help}>
              <b className={"l-footer--heading mb-[6px] text-[14px] font-bold [color:#fff]"}>{t.footer.help}</b>
              <Link href={`/${lang}/pricing#preguntas`}>{t.faq.title}</Link>
              <Link href={`/${lang}/contact#acceso`}>{n.earlyAccess}</Link>
              <a href={`mailto:${site.email}`}>{n.contact}</a>
            </nav>
            <LanguageSwitcher lang={lang} label={n.language} variant="footer" />
          </div>
        </div>
      </div>
      <p aria-hidden="true" className={"l-footer--word [margin:clamp(48px,_7vw,_96px)_0_0] text-center select-none font-display text-[clamp(110px,_27vw,_400px)] font-extrabold tracking-[-.07em] leading-[.78] [color:#1b2350]"}>
        daury
      </p>
      <div className={"l-footer--bottom flex flex-wrap justify-between gap-[8px] max-w-[1240px] [margin:24px_auto_0] text-[14px] [color:rgba(255,_255,_255,_.5)] max-[760.02px]:flex-col"}>
        <span>
          © {new Date().getFullYear()} {site.name} · {t.footer.country}
        </span>
        <span>{t.footer.madeWith}</span>
      </div>
    </footer>
  );
}
