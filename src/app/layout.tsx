import type { Metadata } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import { isValidLocale } from "@/i18n/config";
import { parseTheme, THEME_COOKIE, THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daury — Support, memory and care. All in one place.",
  description: "Daury helps families turn complex days into guided, manageable moments — for children, older adults, and anyone needing cognitive support.",
};

const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t){var v=JSON.parse(t);if(v==="dark"||v==="light"){document.documentElement.setAttribute("data-theme",v);document.cookie=${JSON.stringify(THEME_COOKIE)}+"="+v+"; path=/; max-age=31536000; SameSite=Lax";}}}catch(e){}})();`;

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
      <body>
        <Script id="daury-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
