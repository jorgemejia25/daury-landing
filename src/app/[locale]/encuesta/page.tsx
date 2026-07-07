import type { Metadata } from "next";
import Link from "next/link";
import CareSurveySection from "@/components/survey/templates/CareSurveySection";
import { isValidLocale, locales, type AppLocale } from "@/i18n/config";

type SurveyPageProps = {
  params: Promise<{ locale: string }>;
};

export const runtime = "nodejs";

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
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <Link
        href={`/${activeLocale}`}
        style={{
          position: "fixed",
          top: 22,
          left: "var(--pad)",
          zIndex: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderRadius: 999,
          border: "1px solid var(--rule)",
          background: "color-mix(in oklab, var(--bg-elev) 78%, transparent)",
          backdropFilter: "blur(18px)",
          color: "var(--ink-2)",
          fontSize: 14,
          fontWeight: 600,
        }}
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
