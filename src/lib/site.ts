export const site = {
  name: "Daury",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://daury.app").replace(/\/$/, ""),
  email: "info@daury.cloud",
  /** Fondo de la página (debe coincidir con --bg en styles/tokens.css). */
  themeColor: "#F4F3EF",
  /** Azul de marca (--blue). */
  brandColor: "#2358E8",
} as const;

/** Páginas del sitio. `path` se agrega después del idioma: /es, /es/about… */
export const pages = [
  { path: "", key: "home" },
  { path: "/about", key: "about" },
  { path: "/pricing", key: "plans" },
  { path: "/contact", key: "contact" },
] as const;

export const ROLES = ["family", "center", "professional"] as const;
export type Role = (typeof ROLES)[number];

/** Precios fijos (los textos van en los diccionarios). */
export const prices = { plus: "7.99", business: "116" } as const;
