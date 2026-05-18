export type Theme = "light" | "dark";

export const THEME_COOKIE = "daury.theme";
export const THEME_STORAGE_KEY = "daury.theme";

/** Parses a cookie or storage value into a supported theme. */
export function parseTheme(value: string | undefined | null): Theme {
  return value === "dark" ? "dark" : "light";
}

/** Client-only: persists theme to cookie and `data-theme` on the document root. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}
