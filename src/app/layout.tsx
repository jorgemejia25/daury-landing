import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Plus_Jakarta_Sans } from "next/font/google";
import { defaultLocale, isValidLocale } from "@/i18n/config";
import AOSInit from "@/components/AOSInit";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daury",
  description: "Localized cognitive support experiences in multiple languages.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localeCookie = (await cookies()).get("locale")?.value;
  const activeLocale = localeCookie && isValidLocale(localeCookie) ? localeCookie : defaultLocale;

  return (
    <html lang={activeLocale} className={plusJakartaSans.className}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="selection:bg-primary selection:text-on-primary">
        <AOSInit />
        {children}
      </body>
    </html>
  );
}
