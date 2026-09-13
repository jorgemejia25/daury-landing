import type { Metadata } from "next";
import ProfessionalSurvey from "@/components/ProfessionalSurvey";

export const metadata: Metadata = { title: "Validación profesional | Daury", description: "Encuesta anónima para profesionales de salud.", robots: { index: false, follow: false } };

export default function ProfessionalSurveyPage() { return <ProfessionalSurvey />; }
