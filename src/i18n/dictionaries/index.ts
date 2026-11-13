import type { Locale } from "../config";
import es, { type Dictionary } from "./es";
import en from "./en";
import it from "./it";
import pt from "./pt";
import de from "./de";
import ru from "./ru";

const dictionaries: Record<Locale, Dictionary> = { es, en, it, pt, de, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
