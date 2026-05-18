import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isValidLocale } from "@/i18n/config";
import { parseTheme, THEME_COOKIE } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daury - Indicaciones claras para cuidar en casa",
  description: "Daury organiza indicaciones profesionales en rutinas diarias, guías paso a paso, registros rápidos e historiales semanales para cuidadores informales.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value;
  const activeLocale = localeCookie && isValidLocale(localeCookie) ? localeCookie : "en";
  const theme = parseTheme(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <html lang={activeLocale} data-theme={theme} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Geist:wght@300..700&family=Geist+Mono:wght@400..600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
