import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

export type SurveyKind = "nursing" | "professional";
export type StoredSurveyResponse = { _id: string; survey: SurveyKind; answers: Record<string, unknown>; createdAt: number };

const submit = makeFunctionReference<"mutation", { survey: SurveyKind; answers: Record<string, unknown> }, string>("surveyResponses:submit");
const saveContact = makeFunctionReference<"mutation", { survey: SurveyKind; kind: "phone" | "email"; value: string }, string>("surveyResponses:saveContact");
const list = makeFunctionReference<"query", { survey: SurveyKind; adminKey: string }, StoredSurveyResponse[]>("surveyResponses:list");

function client() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  return new ConvexHttpClient(url, { logger: false });
}

export function surveyStorageConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
}

export function validSurveyAdminKey(key: string | undefined) {
  const expected = process.env.SURVEY_ADMIN_KEY;
  return Boolean(expected && key && key === expected);
}

export async function storeSurveyResponse(survey: SurveyKind, answers: Record<string, unknown>) {
  const convex = client();
  if (!convex) throw new Error("Survey storage is not configured.");
  return await convex.mutation(submit, { survey, answers });
}

export async function storeSurveyContact(survey: SurveyKind, kind: "phone" | "email", value: string) {
  const convex = client();
  if (!convex) throw new Error("Survey storage is not configured.");
  return await convex.mutation(saveContact, { survey, kind, value });
}

export async function listSurveyResponses(survey: SurveyKind, adminKey: string) {
  const convex = client();
  if (!convex) throw new Error("Survey storage is not configured.");
  return await convex.query(list, { survey, adminKey });
}
