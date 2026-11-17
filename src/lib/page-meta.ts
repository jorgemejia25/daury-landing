import type { Metadata } from "next";
import { isLocale, locales, ogLocales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

type PageKey = "about" | "pricing" | "contact";

/** Metadatos de una subpágina: título, descripción y alternativas por idioma. */
export async function pageMetadata(params: Promise<{ lang: string }>, key: PageKey): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = getDictionary(lang).pages[key];
  const path = `/${key}`;
  const image = `/${lang}/opengraph-image/og`;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
        "x-default": path,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
      siteName: site.name,
      title: m.title,
      description: m.description,
      url: `/${lang}${path}`,
      images: [{ url: image, width: 1200, height: 630, alt: `${site.name}: ${m.title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [{ url: image, alt: `${site.name}: ${m.title}` }],
    },
  };
}
