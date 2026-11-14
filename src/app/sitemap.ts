import type { MetadataRoute } from "next";
import { pages, site } from "@/lib/site";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) => {
    const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${page.path}`]));
    return locales.map((l) => ({
      url: `${site.url}/${l}${page.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page.path ? 0.8 : l === "es" ? 1 : 0.9,
      alternates: { languages: { ...languages, "x-default": `${site.url}${page.path}` } },
      ...(page.path === "/about" ? { images: [`${site.url}/images/equipo-daury.jpg`] } : {}),
    }));
  });
}
