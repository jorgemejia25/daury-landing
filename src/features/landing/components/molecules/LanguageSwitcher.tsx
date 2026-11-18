"use client";

import { landingClasses } from "@/features/landing/landing-styles";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, localeNames, locales, type Locale } from "@/i18n/config";
import { Icon } from "@/ui/atoms/Icon";

/** Guarda la elección para que el proxy la respete en las próximas visitas. */
function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

type Props = {
  lang: Locale;
  label: string;
  variant: "header" | "menu" | "footer";
  onPick?: () => void;
};

export function LanguageSwitcher({ lang, label, variant, onPick }: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  // Conserva la página actual al cambiar de idioma: /es/about → /en/about.
  const rest = usePathname().replace(/^\/[^/]+/, "");

  // Cierra el desplegable al hacer clic fuera o con Escape.
  useEffect(() => {
    if (variant !== "header") return;
    const el = detailsRef.current;
    if (!el) return;
    const onDoc = (e: MouseEvent) => {
      if (el.open && !el.contains(e.target as Node)) el.open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        el.open = false;
        el.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [variant]);

  const links = locales.map((l) => (
    <a
      key={l}
      href={`/${l}${rest}`}
      hrefLang={l}
      lang={l}
      aria-current={l === lang ? "true" : undefined}
      className={"l-lang--opt flex items-center gap-[12px] [padding:10px_12px] rounded-[14px] [color:var(--ink-2)] text-[15px] font-semibold no-underline [&:hover]:bg-canvas [&:hover]:text-ink [&[aria-current=true]]:text-brand [&[aria-current=true]_.l-lang--code]:bg-brand [&[aria-current=true]_.l-lang--code]:[color:#fff]"}
      onClick={() => {
        remember(l);
        onPick?.();
      }}
    >
      <span className={"l-lang--code grid place-items-center w-[34px] h-[26px] rounded-[8px] bg-canvas text-[12px] font-extrabold tracking-[.04em]"} aria-hidden="true">
        {l.toUpperCase()}
      </span>
      {localeNames[l]}
    </a>
  ));

  if (variant === "header") {
    return (
      <details ref={detailsRef} className={"l-lang--header [&.l-lang--header]:relative [&[open]_.l-lang--trigger]:bg-canvas [&[open]_.l-lang--chev]:[transform:rotate(180deg)] "}>
        <summary className={"l-lang--trigger flex items-center gap-[4px] h-[44px] [padding:0_10px_0_12px] rounded-full [color:var(--ink-2)] text-[14px] font-bold list-none cursor-pointer [transition:background-color_.2s] [&::-webkit-details-marker]:hidden [&:hover]:bg-canvas"} aria-label={`${label}: ${localeNames[lang]}`}>
          <Icon name="language" size={22} />
          <span aria-hidden="true">{lang.toUpperCase()}</span>
          <Icon name="expand_more" size={20} className={"l-lang--chev [transition:transform_.3s_var(--spring)]"} />
        </summary>
        <nav className={"l-lang--panel absolute right-0 [top:calc(100%_+_10px)] z-[10] min-w-[200px] p-[8px] flex flex-col gap-[2px] rounded-[22px] [background:#fff] [box-shadow:var(--shadow-float)] [animation:landing-lang-in_.3s_var(--ease)]"} aria-label={label}>
          {links}
        </nav>
      </details>
    );
  }

  return (
    <nav className={landingClasses(`lang--${variant}`)} aria-label={label}>
      <b className={landingClasses(variant === "footer" ? "footer__heading" : "lang__heading")}>{label}</b>
      <div className="l-lang--list">{links}</div>
    </nav>
  );
}
