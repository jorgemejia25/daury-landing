"use server";

import { professionalSurvey, type ProfessionalAnswer } from "@/lib/professional-survey";
import { storeSurveyContact, storeSurveyResponse, surveyStorageConfigured } from "@/lib/survey-storage";

export type SubmitProfessionalResult = { ok: true } | { ok: false; error: "not_configured" | "server" | "network" };

export async function submitProfessionalSurvey({ answers, email }: { answers: Record<string, ProfessionalAnswer>; email?: string }): Promise<SubmitProfessionalResult> {
  if (!surveyStorageConfigured()) return { ok: false, error: "not_configured" };
  const validIds = new Set(professionalSurvey.map((question) => question.id));
  const response = Object.fromEntries(Object.entries(answers).filter(([key]) => key !== "correo_contacto" && validIds.has(key)));
  try {
    await storeSurveyResponse("professional", response);
    if (email?.trim()) await storeSurveyContact("professional", "email", email.trim());
    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function submitProfessionalIneligibleCount(): Promise<void> {
  // Screening answers are intentionally not retained.
}
