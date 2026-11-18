export const WIKI_TIME_ZONE = "America/Guatemala";

export function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function localDate(value: Date | string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: WIKI_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function addDays(value: string, amount: number): string {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function shiftMonth(month: string, offset: number): string {
  const date = new Date(`${month}-01T12:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 7);
}

export const isMonth = (value: string) =>
  /^\d{4}-\d{2}$/.test(value) && isDateOnly(`${value}-01`);

export function monthDays(month: string): string[] {
  const first = `${month}-01`;
  const offset = (new Date(`${first}T12:00:00Z`).getUTCDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, index) =>
    addDays(first, index - offset),
  );
}

export function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
): string {
  return new Intl.DateTimeFormat("es-GT", {
    ...options,
    timeZone: WIKI_TIME_ZONE,
  }).format(new Date(isDateOnly(value) ? `${value}T12:00:00Z` : value));
}

export function formatTime(value: string): string {
  return new Intl.DateTimeFormat("es-GT", {
    timeZone: WIKI_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
