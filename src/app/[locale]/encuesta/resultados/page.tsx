import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import SurveyResultsView from "@/components/survey/results/SurveyResultsView";

export const metadata: Metadata = {
  title: "Resultados de la encuesta | Daury",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SurveyResultsPage() {
  return <SurveyResultsView />;
}
