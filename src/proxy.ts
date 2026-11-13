import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  defaultLocale,
  isLocale,
  localeFromAcceptLanguage,
  localeFromCountry,
  locales,
  type Locale,
} from "@/i18n/config";

/**
 * Detección de idioma:
 * 1. Idioma elegido por la persona en el selector (cookie).
 * 2. Idioma del navegador (Accept-Language) si es uno de los soportados.
 * 3. País del visitante (geolocalización de Vercel: x-vercel-ip-country).
 * 4. Español por defecto.
 */
function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;
  return (
    localeFromAcceptLanguage(request.headers.get("accept-language")) ??
    localeFromCountry(request.headers.get("x-vercel-ip-country")) ??
    defaultLocale
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.redirect(url, 307);
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
}

export const config = {
  // Todo excepto internos de Next, Vercel, API y archivos/metadatos de la raíz.
  matcher: [
    "/((?!_next|_vercel|api|apple-icon|icon|manifest|robots|sitemap|favicon|images|.*\\.[\\w]+$).*)",
  ],
};
