import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getDictionary } from "@/i18n/dictionaries";

export default function manifest(): MetadataRoute.Manifest {
  const t = getDictionary("es").meta;
  return {
    name: t.title,
    short_name: site.name,
    description: t.shortDescription,
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: site.themeColor,
    theme_color: site.themeColor,
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
