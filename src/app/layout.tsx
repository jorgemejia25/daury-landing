import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isValidLocale } from "@/i18n/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daury — Support, memory and care. All in one place.",
  description: "Daury helps families turn complex days into guided, manageable moments — for children, older adults, and anyone needing cognitive support.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const localeCookie = (await cookies()).get("locale")?.value;
  const activeLocale = localeCookie && isValidLocale(localeCookie) ? localeCookie : "en";

  return (
    <html lang={activeLocale} data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Geist:wght@300..700&family=Geist+Mono:wght@400..600&display=swap"
          rel="stylesheet"
        />
        {/* Prevent flash of unstyled theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('daury.theme');if(t)document.documentElement.setAttribute('data-theme',JSON.parse(t));}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
