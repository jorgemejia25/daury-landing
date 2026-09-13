import type { Metadata } from "next";
import SurveyResults from "@/components/SurveyResults";

export const metadata: Metadata = { title: "Resultados de encuesta | Daury", robots: { index: false, follow: false } };

export default async function NursingResultsPage({ params, searchParams }: { params: Promise<{ locale: "es" | "en" }>; searchParams: Promise<{ key?: string }> }) {
  const [{ locale }, { key }] = await Promise.all([params, searchParams]);
  return <SurveyResults survey="nursing" locale={locale} accessKey={key} />;
}
