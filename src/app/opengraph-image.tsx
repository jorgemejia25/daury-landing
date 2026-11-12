import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = "Daury: la forma fácil de cuidar a quien quieres, en familia.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadBricolage(text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const title = "Cuidar es como armar un rompecabezas.";
  const logo = await readFile(join(process.cwd(), "public/logo.svg"));
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const font = await loadBricolage(`${title}daury${site.shortDescription}`);

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
          fontFamily: font ? "Bricolage" : "sans-serif",
          background:
            "radial-gradient(70% 60% at 10% 6%, #3566F0 0%, rgba(53,102,240,0) 70%), radial-gradient(60% 70% at 94% 98%, #7257E8 0%, rgba(114,87,232,0) 66%), linear-gradient(180deg,#2358E8 0%,#1F4FD6 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src={logoSrc} width={76} height={64} alt="" />
          <span style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.045em" }}>daury</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.05em", maxWidth: 1000 }}>
            {title}
          </div>
          <div style={{ fontSize: 34, opacity: 0.92 }}>{site.shortDescription}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Bricolage", data: font, weight: 800, style: "normal" }] : undefined,
    },
  );
}
