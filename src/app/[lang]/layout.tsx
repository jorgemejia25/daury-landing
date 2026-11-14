import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/lib/site";
import { isLocale, locales, ogLocales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Motion } from "@/components/layout/Motion";
import "@/styles/globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  variable: "--font-bricolage",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

// Subconjunto de Material Symbols Rounded con solo los íconos usados (~13 KB).
const icons = localFont({
  src: "../fonts/material-symbols-rounded.woff2",
  variable: "--font-icons",
  weight: "100 700",
  display: "block",
});

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    metadataBase: new URL(site.url),
    title: { default: t.title, template: `%s · ${site.name}` },
    description: t.description,
    applicationName: site.name,
    keywords: t.keywords,
    authors: [{ name: "Daury" }],
    creator: "Daury",
    publisher: "Daury",
    category: "health",
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": "/",
      },
    },
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      type: "website",
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
      url: `/${lang}`,
      siteName: site.name,
      title: t.title,
      description: t.shortDescription,
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.shortDescription },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
  };
}

export const viewport: Viewport = {
  themeColor: site.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html
      lang={lang satisfies Locale}
      className={`${bricolage.variable} ${geist.variable} ${geistMono.variable} ${icons.variable}`}
    >
      <body>
        <a href="#contenido" className="skip-link">
          {t.nav.skip}
        </a>
        <Header lang={lang} t={t.nav} />
        <main id="contenido">{children}</main>
        <Footer t={t} lang={lang} />
        <Motion />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
