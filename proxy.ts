import { NextResponse, type NextRequest } from "next/server";
import { detectLocaleFromAcceptLanguage, isValidLocale, locales } from "@/i18n/config";

const PUBLIC_FILE = /\.[^/]+$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocalePrefix) {
    const localeInPath = pathname.split("/")[1];
    const response = NextResponse.next();

    if (localeInPath && isValidLocale(localeInPath)) {
      response.cookies.set("locale", localeInPath, { path: "/" });
    }

    return response;
  }

  const locale = detectLocaleFromAcceptLanguage(request.headers.get("accept-language"));
  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(nextUrl);
  response.cookies.set("locale", locale, { path: "/" });
  return response;
}

export const proxyConfig = {
  matcher: ["/((?!_next).*)"],
};
