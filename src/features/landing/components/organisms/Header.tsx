"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/ui/atoms/Icon";
import { Logo } from "@/ui/atoms/Logo";
import { Arrow } from "@/ui/atoms/Arrow";
import { LanguageSwitcher } from "@/features/landing/components/molecules/LanguageSwitcher";
import { pages } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Header({ lang, t }: { lang: Locale; t: Dictionary["nav"] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [prevPath, setPrevPath] = useState(pathname);

  // Cierra el menú al navegar.
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
  }

  const current = pages.find((p) => p.path && pathname.startsWith(`/${lang}${p.path}`)) ?? pages[0];

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => {
      const y = window.scrollY;
      header.dataset.scrolled = String(y > 24);
      // El lienzo toma el color del borde visible para el rebote de iOS y las barras de Safari.
      const nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.dataset.edge = nearBottom ? "bottom" : "top";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const mq = window.matchMedia("(min-width: 961px)");
    const onMq = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.menu = String(menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header ref={headerRef} className={"l-header fixed [inset:0_0_auto] z-[50] [padding:max(12px,_env(safe-area-inset-top))_var(--gutter)_0] pointer-events-none [&[data-scrolled=true]_.l-header--bar]:[background:rgba(255,_255,_255,_.9)] [&[data-scrolled=true]_.l-header--bar]:[box-shadow:0_14px_40px_-20px_rgba(15,_16,_29,_.35)] [&[data-open=true]_.l-menu]:[visibility:visible] [&[data-open=true]_.l-menu]:pointer-events-auto [&[data-open=true]_.l-menu]:[transition:none] [&[data-open=true]_.l-menu--scrim]:opacity-100 [&[data-open=true]_.l-menu--panel]:opacity-100 [&[data-open=true]_.l-menu--panel]:[transform:none] [&[data-open=true]_.l-menu--link]:opacity-100 [&[data-open=true]_.l-menu--link]:[transform:none] [&[data-open=true]_.l-menu--link]:[transition-delay:calc(var(--i)_*_40ms_+_60ms),_calc(var(--i)_*_40ms_+_60ms),_0s,_0s]"} data-scrolled="false" data-open={menuOpen}>
      <div className={"l-header--bar relative z-[2] flex items-center justify-between gap-[16px] max-w-[1240px] [margin:0_auto] [padding:8px_8px_8px_12px] rounded-full [background:rgba(255,_255,_255,_.78)] [-webkit-backdrop-filter:saturate(1.6)_blur(18px)] [backdrop-filter:saturate(1.6)_blur(18px)] pointer-events-auto [transition:box-shadow_.4s_var(--ease),_background-color_.4s] max-[960.02px]:[padding:6px_6px_6px_8px]"}>
        <Link href={`/${lang}`} className={"l-header--brand flex rounded-full no-underline [&:hover_.l-logo--badge]:[transform:rotate(-10deg)_scale(1.06)]"} aria-label={t.brand}>
          <Logo />
        </Link>

        <nav className={"l-header--nav flex items-center gap-[4px] max-[960.02px]:hidden"} aria-label={t.main}>
          {pages.map((p) => (
            <Link
              key={p.key}
              href={`/${lang}${p.path}`}
              className={"l-header--link relative [padding:12px_18px] rounded-full [color:var(--ink-2)] text-[15px] font-semibold no-underline [transition:background-color_.25s,_color_.25s] [&:hover]:bg-canvas [&:hover]:text-ink [&[aria-current=page]]:bg-brand [&[aria-current=page]]:[color:#fff]"}
              aria-current={p === current ? "page" : undefined}
            >
              {t[p.key]}
            </Link>
          ))}
        </nav>

        <div className={"l-header--actions flex items-center gap-[8px] max-[960.02px]:[&_.l-lang--header]:hidden"}>
          <LanguageSwitcher lang={lang} label={t.language} variant="header" />
          <Link href={`/${lang}/contact#acceso`} className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--blue [&.l-btn--blue]:bg-brand [&.l-btn--blue]:[color:#fff] [&.l-btn--blue]:[box-shadow:0_12px_28px_-12px_rgba(35,_88,_232,_.7)] [&.l-btn--blue:hover]:[background:var(--blue-600)] [&.l-btn--blue:hover]:[color:#fff] l-btn--sm [&.l-btn--sm]:min-h-[44px] [&.l-btn--sm]:text-[15px] [&.l-btn--sm]:pl-[18px] [&_.l-arrow]:w-[32px] [&_.l-arrow]:h-[32px] l-header--cta max-[960.02px]:hidden"}>
            {t.earlyAccess}
            <Arrow />
          </Link>
          <button
            type="button"
            className={"l-header--toggle hidden place-items-center w-[48px] h-[48px] [border:0] rounded-full bg-ink [color:#fff] cursor-pointer max-[960.02px]:grid"}
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={26} />
          </button>
        </div>
      </div>

      <div id="menu-movil" className={"l-menu fixed [inset:0] z-[1] pointer-events-none [visibility:hidden] [transition:visibility_0s_.4s]"} inert={!menuOpen}>
        <div className={"l-menu--scrim absolute [inset:0] [background:rgba(15,_16,_29,_.34)] [-webkit-backdrop-filter:blur(6px)] [backdrop-filter:blur(6px)] opacity-0 [transition:opacity_.35s_var(--ease)]"} aria-hidden="true" onClick={() => setMenuOpen(false)} />
        <div className={"l-menu--panel absolute left-[var(--gutter)] right-[var(--gutter)] [top:calc(max(12px,_env(safe-area-inset-top))_+_var(--header-h)_-_2px)] [max-height:calc(100dvh_-_max(12px,_env(safe-area-inset-top))_-_var(--header-h)_-_max(14px,_env(safe-area-inset-bottom)))] flex flex-col gap-[10px] p-[10px] overflow-y-auto [overscroll-behavior:contain] rounded-[32px] [background:#fff] [box-shadow:var(--shadow-float)] opacity-0 [transform:translateY(-14px)_scale(.97)] [transform-origin:85%_0] [transition:opacity_.25s_var(--ease),_transform_.45s_var(--ease)]"}>
          <nav aria-label={t.mobile} className={"l-menu--nav flex flex-col gap-[2px]"}>
            {pages.map((p, i) => (
              <Link
                key={p.key}
                href={`/${lang}${p.path}`}
                className={"l-menu--link flex items-center justify-between gap-[12px] min-h-[62px] [padding:0_14px_0_20px] rounded-[22px] text-ink no-underline font-display text-[26px] font-semibold tracking-[-.035em] leading-[1] opacity-0 [transform:translateY(-8px)] [transition:opacity_.35s_var(--ease),_transform_.45s_var(--ease),_background-color_.2s,_color_.2s] [-webkit-tap-highlight-color:transparent] [&:active]:bg-canvas [&:active_.l-menu--go]:[transform:translateX(3px)] [&[aria-current=page]]:[background:var(--blue-50)] [&[aria-current=page]]:text-brand [&[aria-current=page]_.l-menu--go]:bg-brand [&[aria-current=page]_.l-menu--go]:[color:#fff]"}
                style={{ ["--i" as string]: i }}
                aria-current={p === current ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {t[p.key]}
                <Icon name="arrow_forward" size={22} className={"l-menu--go grid place-items-center w-[40px] h-[40px] rounded-full bg-canvas [color:var(--ink-2)] [transition:transform_.35s_var(--spring)]"} />
              </Link>
            ))}
          </nav>
          <div className={"l-menu--foot flex flex-col gap-[14px] [padding:12px_6px_6px] [border-top:1px_solid_var(--soft)]"}>
            <Link
              href={`/${lang}/contact#acceso`}
              className={"l-btn inline-flex items-center justify-center gap-[12px] min-h-[52px] [padding:6px_8px_6px_24px] [border:0] rounded-full font-semibold text-[16px] leading-[1] font-sans tracking-[-.01em] no-underline whitespace-nowrap cursor-pointer [transition:transform_.35s_var(--ease),_background-color_.25s,_color_.25s,_box-shadow_.35s_var(--ease)] [&:not(:has(.l-arrow))]:[padding:6px_26px] [@media(hover:_hover)]:[&:hover]:[transform:translateY(-2px)] [&:active]:[transform:scale(.97)] [&:disabled]:opacity-70 [&:disabled]:cursor-progress [&:disabled]:[transform:none] [&:hover_.l-arrow]:[transform:rotate(45deg)]  l-btn--blue [&.l-btn--blue]:bg-brand [&.l-btn--blue]:[color:#fff] [&.l-btn--blue]:[box-shadow:0_12px_28px_-12px_rgba(35,_88,_232,_.7)] [&.l-btn--blue:hover]:[background:var(--blue-600)] [&.l-btn--blue:hover]:[color:#fff] l-btn--lg [&.l-btn--lg]:min-h-[60px] [&.l-btn--lg]:text-[17px] [&.l-btn--lg]:pl-[28px] [&.l-btn--lg:not(:has(.l-arrow))]:[padding:6px_30px] l-btn--block [&.l-btn--block]:flex [&.l-btn--block]:w-full"}
              onClick={() => setMenuOpen(false)}
            >
              {t.earlyAccess}
              <Arrow />
            </Link>
            <LanguageSwitcher lang={lang} label={t.language} variant="menu" onPick={() => setMenuOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
}
