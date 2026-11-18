import type { Tone } from "@/ui/lib/tones";

/** Tono de color de cada sección de la wiki (IconTile, chips, tarjetas). */
const tones: Record<string, Tone> = {
  "": "blue",
  documentacion: "blue",
  kanban: "violet",
  calendarios: "amber",
  producto: "coral",
  diseno: "violet",
  tecnologia: "green",
};

export const entryTone = (slug: string): Tone => tones[slug] ?? "blue";

/** Tono de los calendarios según el color declarado en `content/calendars.json`. */
export const calendarTone = (color: string): Tone =>
  (["blue", "green", "amber", "violet", "coral"] as const).find((tone) => tone === color) ?? "blue";
