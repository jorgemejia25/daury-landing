export const site = {
  name: "Daury",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://daury.app").replace(/\/$/, ""),
  email: "info@daury.cloud",
  themeColor: "#2358E8",
} as const;

export const navLinks = [
  { href: "#funciones", key: "features", icon: "auto_awesome" },
  { href: "#planes", key: "plans", icon: "sell" },
  { href: "#preguntas", key: "faq", icon: "help" },
  { href: "#contacto", key: "contact", icon: "mail" },
] as const;

export const ROLES = ["family", "center", "professional"] as const;
export type Role = (typeof ROLES)[number];

/** Precios fijos (los textos van en los diccionarios). */
export const prices = { plus: "7.99", business: "116" } as const;
