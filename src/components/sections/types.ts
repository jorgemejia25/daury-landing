import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/** Props comunes de todas las secciones: diccionario del idioma y el idioma activo. */
export type SectionProps = { t: Dictionary; lang: Locale };
