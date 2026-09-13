"use server";

import { nursingSurvey, type Answer } from "@/lib/nursing-survey";
import { storeSurveyContact, storeSurveyResponse, surveyStorageConfigured } from "@/lib/survey-storage";

type Payload = { answers: Record<string, Answer>; contact?: string };
export type SubmitNursingSurveyResult = { ok: true } | { ok: false; error: "not_configured" | "network" | "server" };

export async function submitNursingSurvey({ answers, contact }: Payload): Promise<SubmitNursingSurveyResult> {
  if (!surveyStorageConfigured()) return { ok: false, error: "not_configured" };

  const allowedIds = new Set(nursingSurvey.map((question) => question.id));
  const surveyAnswers = Object.fromEntries(
    Object.entries(answers)
      .filter(([key]) => key !== "telefono_contacto" && allowedIds.has(key))
      .map(([key, value]) => [key, Array.isArray(value) ? value.slice(0, 12).map((item) => item.slice(0, 300)) : value.slice(0, 2_000)]),
  );
  try {
    await storeSurveyResponse("nursing", surveyAnswers);
    if (contact?.trim()) await storeSurveyContact("nursing", "phone", contact.trim());
    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function submitNursingIneligibleCount(): Promise<void> {
  // Screening answers are intentionally not retained.
}
