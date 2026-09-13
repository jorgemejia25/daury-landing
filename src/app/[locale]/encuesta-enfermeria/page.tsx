import type { Metadata } from "next";
import NursingSurvey from "@/components/NursingSurvey";

export async function generateMetadata({ params }: { params: Promise<{ locale: "es" | "en" }> }): Promise<Metadata> {
  const { locale } = await params;
  const english = locale === "en";
  return {
    title: english ? "Home Care Survey | Daury" : "Encuesta sobre cuidado en casa | Daury",
    description: english ? "An anonymous survey about providing care at home." : "Encuesta anónima sobre el cuidado de una persona en casa.",
    robots: { index: false, follow: false },
  };
}

export default async function NursingSurveyPage({ params }: { params: Promise<{ locale: "es" | "en" }> }) {
  const { locale } = await params;
  return <NursingSurvey locale={locale} />;
}
