import type { Metadata } from "next";
import SurveyResults from "@/components/SurveyResults";

export const metadata: Metadata = { title: "Resultados profesionales | Daury", robots: { index: false, follow: false } };

export default async function ProfessionalResultsPage({ params, searchParams }: { params: Promise<{ locale: "es" | "en" }>; searchParams: Promise<{ key?: string }> }) {
  const [{ locale }, { key }] = await Promise.all([params, searchParams]);
  return <SurveyResults survey="professional" locale={locale} accessKey={key} />;
}
