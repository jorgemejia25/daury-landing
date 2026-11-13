import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}`]));
  return locales.map((l) => ({
    url: `${site.url}/${l}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: l === "es" ? 1 : 0.9,
    alternates: { languages: { ...languages, "x-default": site.url } },
    images: [`${site.url}/images/equipo-daury.jpg`],
  }));
}
