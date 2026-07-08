import type { Metadata } from "next";
import Link from "next/link";
import CareSurveySection from "@/components/survey/templates/CareSurveySection";
import { isValidLocale, locales, type AppLocale } from "@/i18n/config";

type SurveyPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: SurveyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale: AppLocale = isValidLocale(locale) ? locale : "es";

  return {
    title: activeLocale === "es" ? "Encuesta de cuidado en casa | Daury" : "Home care survey | Daury",
    description:
      activeLocale === "es"
        ? "Encuesta breve para entender cómo las familias organizan medicamentos, citas y cuidado en casa."
        : "A short survey to understand how families organize medication, appointments, and home care.",
  };
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const { locale } = await params;
  const activeLocale: AppLocale = isValidLocale(locale) ? locale : "es";

  return (
    <main className="min-h-screen relative">
      <Link
        href={`/${activeLocale}`}
        className="fixed top-[22px] left-[var(--pad)] z-20 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full border border-[var(--rule)] bg-[color-mix(in_oklab,var(--bg-elev)_78%,transparent)] backdrop-blur-xl text-[var(--ink-2)] text-sm font-semibold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Daury
      </Link>
      <CareSurveySection locale={activeLocale} />
    </main>
  );
}