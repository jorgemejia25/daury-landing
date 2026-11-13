import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { lang: string } | Promise<{ lang: string }>;

export async function generateImageMetadata({ params }: { params: Params }) {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : "es");
  return [{ id: "og", alt: t.meta.ogAlt, size, contentType }];
}

/** Bricolage no tiene cirílico: en ruso se usa Geist. */
async function loadFont(family: string, weight: number, text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage({ params }: { params: Params }) {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : "es");
  const title = t.hero.title;
  const logo = await readFile(join(process.cwd(), "public/logo.svg"));
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const family = lang === "ru" ? "Geist" : "Bricolage+Grotesque";
  const font = await loadFont(family, 800, `${title}daury${t.meta.shortDescription}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#fff",
          fontFamily: font ? "Display" : "sans-serif",
          background:
            "radial-gradient(70% 60% at 10% 6%, #3566F0 0%, rgba(53,102,240,0) 70%), radial-gradient(60% 70% at 94% 98%, #7257E8 0%, rgba(114,87,232,0) 66%), linear-gradient(180deg,#2358E8 0%,#1F4FD6 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src={logoSrc} width={76} height={64} alt="" />
          <span style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.045em" }}>daury</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: title.length > 42 ? 76 : 92, fontWeight: 800, lineHeight: 0.98, letterSpacing: "-0.05em", maxWidth: 1050 }}>
            {title}
          </div>
          <div style={{ fontSize: 34, opacity: 0.92 }}>{t.meta.shortDescription}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Display", data: font, weight: 800, style: "normal" }] : undefined,
    },
  );
}
