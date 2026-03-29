import messages from "@/i18n/messages.json";

export const locales = ["en", "es"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export const localeNames: Record<AppLocale, string> = {
  en: "English",
  es: "Español",
};

export type AppMessages = (typeof messages)[AppLocale];
export type LocaleDictionary = AppMessages;

export function isValidLocale(locale: string): locale is AppLocale {
  return locales.includes(locale as AppLocale);
}

export function getDictionary(locale: AppLocale): LocaleDictionary {
  return messages[locale];
}

export function getMessages(locale: AppLocale): AppMessages {
  return messages[locale];
}

export function detectLocaleFromAcceptLanguage(
  acceptLanguage: string | null | undefined
): AppLocale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const tokens = acceptLanguage
    .toLowerCase()
    .split(",")
    .map((part) => part.trim().split(";")[0]?.split("-")[0]);

  for (const token of tokens) {
    if (token && isValidLocale(token)) {
      return token;
    }
  }

  return defaultLocale;
}
