"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, localeNames, locales, type Locale } from "@/i18n/config";
import { Icon } from "../ui/Icon";

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
      className="lang__opt"
      onClick={() => {
        remember(l);
        onPick?.();
      }}
    >
      <span className="lang__code" aria-hidden="true">
        {l.toUpperCase()}
      </span>
      {localeNames[l]}
    </a>
  ));

  if (variant === "header") {
    return (
      <details ref={detailsRef} className="lang lang--header">
        <summary className="lang__trigger" aria-label={`${label}: ${localeNames[lang]}`}>
          <Icon name="language" size={22} />
          <span aria-hidden="true">{lang.toUpperCase()}</span>
          <Icon name="expand_more" size={20} className="lang__chev" />
        </summary>
        <nav className="lang__panel" aria-label={label}>
          {links}
        </nav>
      </details>
    );
  }

  return (
    <nav className={`lang lang--${variant}`} aria-label={label}>
      <b className={variant === "footer" ? "footer__heading" : "lang__heading"}>{label}</b>
      <div className="lang__list">{links}</div>
    </nav>
  );
}
