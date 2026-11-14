import type { Metadata } from "next";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

type PageKey = "about" | "pricing" | "contact";

/** Metadatos de una subpágina: título, descripción y alternativas por idioma. */
export async function pageMetadata(params: Promise<{ lang: string }>, key: PageKey): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = getDictionary(lang).pages[key];
  const path = `/${key}`;
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
    openGraph: { type: "website", siteName: site.name, title: m.title, description: m.description, url: `/${lang}${path}` },
  };
}
