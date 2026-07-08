"use server";

import { headers } from "next/headers";
import {
  careChallengeOptions,
  essentialFeatureOptions,
  organizationMethodOptions,
  trustConcernOptions,
  type CareSurveyPayload,
} from "@/lib/care-survey";
import { saveCareSurveyResponse } from "@/lib/care-survey-db";

export type SubmitCareSurveyResult =
  | { ok: true }
  | { ok: false; error: "validation" | "server" };

const organizationValues = new Set(organizationMethodOptions.map((option) => option.value));
const careChallengeValues = new Set(careChallengeOptions.map((option) => option.value));
const trustConcernValues = new Set(trustConcernOptions.map((option) => option.value));
const essentialFeatureValues = new Set(essentialFeatureOptions.map((option) => option.value));

function cleanText(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength);
}

function cleanChoice(value: string, allowedValues: Set<string>) {
  const clean = value.trim();
  return allowedValues.has(clean) ? clean : "";
}

function cleanLimitedChoices(values: string[], allowedValues: Set<string>, max: number) {
  const unique = Array.from(new Set(values.map((value) => value.trim())));
  return unique.filter((value) => allowedValues.has(value)).slice(0, max);
}

function hasValidPrice(value: string) {
  return /^\d+$/.test(value.trim());
}

function normalizePayload(payload: CareSurveyPayload): CareSurveyPayload | null {
  const normalized: CareSurveyPayload = {
    locale: payload.locale === "en" ? "en" : "es",
    organizationMethod: cleanChoice(payload.organizationMethod, organizationValues),
    organizationOther: cleanText(payload.organizationOther, 120),
    careChallenges: cleanLimitedChoices(payload.careChallenges, careChallengeValues, 2),
    careChallengesOther: cleanText(payload.careChallengesOther, 120),
    hadIncident: payload.hadIncident === "yes" || payload.hadIncident === "no" ? payload.hadIncident : "",
    incidentStory: cleanText(payload.incidentStory, 500),
    appTrust:
      payload.appTrust === "yes" || payload.appTrust === "no" || payload.appTrust === "maybe"
        ? payload.appTrust
        : "",
    trustConcerns: cleanLimitedChoices(payload.trustConcerns, trustConcernValues, 5),
    trustConcernsOther: cleanText(payload.trustConcernsOther, 120),
    appInterest:
      payload.appInterest === "yes" || payload.appInterest === "no" || payload.appInterest === "maybe"
        ? payload.appInterest
        : "",
    interestNoReason: cleanText(payload.interestNoReason, 280),
    essentialFeatures: cleanLimitedChoices(payload.essentialFeatures, essentialFeatureValues, 3),
    essentialFeaturesOther: cleanText(payload.essentialFeaturesOther, 120),
    priceTooExpensive: cleanText(payload.priceTooExpensive, 20),
    priceExpensiveButPay: cleanText(payload.priceExpensiveButPay, 20),
    priceBargain: cleanText(payload.priceBargain, 20),
    priceTooCheap: cleanText(payload.priceTooCheap, 20),
    completedPath: payload.completedPath.map((step) => cleanText(step, 30)).filter(Boolean).slice(0, 16),
  };

  if (!normalized.organizationMethod || normalized.careChallenges.length === 0) return null;
  if (normalized.organizationMethod === "other" && !normalized.organizationOther) return null;
  if (normalized.careChallenges.includes("other") && !normalized.careChallengesOther) return null;
  if (!normalized.hadIncident || !normalized.appTrust || !normalized.appInterest) return null;

  if ((normalized.appTrust === "no" || normalized.appTrust === "maybe") && normalized.trustConcerns.length === 0) {
    return null;
  }

  if (normalized.trustConcerns.includes("other") && !normalized.trustConcernsOther) return null;

  if (normalized.appInterest === "no") {
    if (!normalized.interestNoReason) return null;
    return {
      ...normalized,
      essentialFeatures: [],
      essentialFeaturesOther: "",
      priceTooExpensive: "",
      priceExpensiveButPay: "",
      priceBargain: "",
      priceTooCheap: "",
    };
  }

  if (normalized.essentialFeatures.length === 0) return null;
  if (normalized.essentialFeatures.includes("other") && !normalized.essentialFeaturesOther) return null;

  const prices = [
    normalized.priceTooExpensive,
    normalized.priceExpensiveButPay,
    normalized.priceBargain,
    normalized.priceTooCheap,
  ];

  if (!prices.every(hasValidPrice)) return null;

  return normalized;
}

export async function submitCareSurvey(payload: CareSurveyPayload): Promise<SubmitCareSurveyResult> {
  const normalized = normalizePayload(payload);

  if (!normalized) {
    return { ok: false, error: "validation" };
  }

  try {
    const headerStore = await headers();
    await saveCareSurveyResponse(normalized, headerStore.get("user-agent") ?? "");
    return { ok: true };
  } catch (error) {
    console.error("Care survey submission failed", error);
    return { ok: false, error: "server" };
  }
}
