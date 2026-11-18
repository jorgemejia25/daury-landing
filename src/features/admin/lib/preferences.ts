/** Cookie con el estado del sidebar (contraído o expandido), leída en el servidor para evitar parpadeos. */
export const SIDEBAR_COOKIE = "admin-sidebar";

/** Cookie con el tema elegido. Sin valor (o "system"), el admin sigue la preferencia del equipo. */
export const THEME_COOKIE = "admin-theme";
export const themes = ["system", "light", "dark"] as const;
export type Theme = (typeof themes)[number];
export const parseTheme = (value: string | undefined): Theme => (value === "light" || value === "dark" ? value : "system");
