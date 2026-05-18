import type { Metadata } from "next";
import { cookies } from "next/headers";
import LandingPage from "@/components/LandingPage";
import { getDictionary, isValidLocale, locales, type AppLocale } from "@/i18n/config";
import { parseTheme, THEME_COOKIE } from "@/lib/theme";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale: AppLocale = isValidLocale(locale) ? locale : "en";
  const dictionary = getDictionary(activeLocale);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: {
      languages: {
        en: "/en",
        es: "/es",
      },
    },
  };
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  const activeLocale: AppLocale = isValidLocale(locale) ? locale : "en";
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

  return <LandingPage key={activeLocale} locale={activeLocale} initialTheme={theme} />;
}
