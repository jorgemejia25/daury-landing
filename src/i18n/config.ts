export const locales = ["es", "en", "it", "pt", "de", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);

/** Nombre de cada idioma en su propio idioma (para el selector). */
export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  it: "Italiano",
  pt: "Português",
  de: "Deutsch",
  ru: "Русский",
};

/** Código Open Graph / hreflang regional. */
export const ogLocales: Record<Locale, string> = {
  es: "es_GT",
  en: "en_US",
  it: "it_IT",
  pt: "pt_BR",
  de: "de_DE",
  ru: "ru_RU",
};

/** País (ISO 3166-1 alfa-2) → idioma. Respaldo cuando el navegador no indica un idioma soportado. */
const countryLocale: Record<string, Locale> = {
  // Inglés
  US: "en", GB: "en", CA: "en", AU: "en", NZ: "en", IE: "en", ZA: "en", IN: "en", SG: "en",
  PH: "en", NG: "en", KE: "en", JM: "en", BZ: "en", MT: "en",
  // Italiano
  IT: "it", SM: "it", VA: "it",
  // Portugués
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt", CV: "pt", GW: "pt", ST: "pt", TL: "pt",
  // Alemán
  DE: "de", AT: "de", CH: "de", LI: "de", LU: "de",
  // Ruso
  RU: "ru", BY: "ru", KZ: "ru", KG: "ru",
};

export function localeFromCountry(country: string | null | undefined): Locale | null {
  return country ? (countryLocale[country.toUpperCase()] ?? null) : null;
}

/** Elige el primer idioma soportado del encabezado Accept-Language, respetando los pesos q. */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, i) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.trim().slice(2)) || 0 : 1, i };
    })
    .filter((x) => x.tag && x.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}
