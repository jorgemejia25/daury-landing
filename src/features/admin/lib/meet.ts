export function normalizeMeetUrl(value: unknown): string {
  if (value === undefined || value === "") return "";
  if (typeof value !== "string" || value.length > 500) throw new Error("El enlace de Google Meet no es válido.");
  const input = value.trim(); if (!input) return "";
  let url: URL;
  try { url = new URL(input); } catch { throw new Error("Usa un enlace completo de Google Meet, como https://meet.google.com/abc-defg-hij."); }
  if (url.href.length > 500 || url.protocol !== "https:" || url.hostname !== "meet.google.com" || url.port || url.username || url.password || !/^\/(?:[a-zA-Z0-9-]+|lookup\/[a-zA-Z0-9_-]+)\/?$/.test(url.pathname)) throw new Error("Usa un enlace HTTPS de meet.google.com.");
  return url.href;
}
export function safeMeetUrl(value: unknown) { try { return normalizeMeetUrl(value); } catch { return ""; } }
