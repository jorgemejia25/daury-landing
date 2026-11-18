import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { parseTheme, THEME_COOKIE } from "@/features/admin/lib/preferences";
import "@/ui/tokens/index.css";

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
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: { default: "Inicio · Daury Admin", template: "%s · Daury Admin" },
  description: "El espacio de documentación, conocimiento y organización de Daury.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0e12" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
};

/** Layout raíz del admin: independiente de la landing (sin header, footer ni animaciones de marketing). */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // El tema se aplica en el servidor (data-theme) para que no haya parpadeo al cargar.
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);
  return (
    <html lang="es" data-theme={theme === "system" ? undefined : theme} className={`${bricolage.variable} ${geist.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
