"use server";

import { headers } from "next/headers";
import {
  careChallengeOptions,
  carePayerOptions,
  careTargetOptions,
  caredPersonAgeOptions,
  conditionDurationOptions,
  coordinationFrequencyOptions,
  discoveryChannelOptions,
  essentialFeatureOptions,
  familyCaregiverOptions,
  interestRequirementOptions,
  organizationMethodOptions,
  trustConcernOptions,
  whatsappPreferenceOptions,
  type CareSurveyPayload,
} from "@/lib/care-survey";
import { saveCareSurveyResponse } from "@/lib/care-survey-db";

export type SubmitCareSurveyResult =
  | { ok: true }
  | { ok: false; error: "validation" | "server" };

const organizationValues = new Set(organizationMethodOptions.map((option) => option.value));
const careTargetValues = new Set(careTargetOptions.map((option) => option.value));
const caredPersonAgeValues = new Set(caredPersonAgeOptions.map((option) => option.value));
const familyCaregiverValues = new Set(familyCaregiverOptions.map((option) => option.value));
const coordinationFrequencyValues = new Set(coordinationFrequencyOptions.map((option) => option.value));
const careChallengeValues = new Set(careChallengeOptions.map((option) => option.value));
const carePayerValues = new Set(carePayerOptions.map((option) => option.value));
const trustConcernValues = new Set(trustConcernOptions.map((option) => option.value));
const interestRequirementValues = new Set(interestRequirementOptions.map((option) => option.value));
const whatsappPreferenceValues = new Set(whatsappPreferenceOptions.map((option) => option.value));
const essentialFeatureValues = new Set(essentialFeatureOptions.map((option) => option.value));
const discoveryChannelValues = new Set(discoveryChannelOptions.map((option) => option.value));
const conditionDurationValues = new Set(conditionDurationOptions.map((option) => option.value));

function cleanText(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength);
}

function cleanChoice(value: string, allowedValues: Set<string>) {
  const clean = value.trim();
  return allowedValues.has(clean) ? clean : "";
}

function cleanChoices(values: string[], allowedValues: Set<string>) {
  const unique = Array.from(new Set(values.map((value) => value.trim())));
  return unique.filter((value) => allowedValues.has(value));
}

function hasValidPrice(value: string) {
  return /^\d+$/.test(value.trim());
}

function normalizePayload(payload: CareSurveyPayload): CareSurveyPayload | null {
  const normalized: CareSurveyPayload = {
    locale: payload.locale === "en" ? "en" : "es",
    hasManagedCare: payload.hasManagedCare === "yes" || payload.hasManagedCare === "no" ? payload.hasManagedCare : "",
    careTarget: cleanChoice(payload.careTarget, careTargetValues),
    caredPersonAge: cleanChoice(payload.caredPersonAge, caredPersonAgeValues),
    familyCaregivers: cleanChoice(payload.familyCaregivers, familyCaregiverValues),
    coordinationFrequency: cleanChoice(payload.coordinationFrequency, coordinationFrequencyValues),
    organizationMethod: cleanChoice(payload.organizationMethod, organizationValues),
    organizationOther: cleanText(payload.organizationOther, 120),
    organizationAppName: cleanText(payload.organizationAppName, 120),
    careChallenges: cleanChoices(payload.careChallenges, careChallengeValues),
    careChallengesOther: cleanText(payload.careChallengesOther, 120),
    priorCareAppUse: payload.priorCareAppUse === "yes" || payload.priorCareAppUse === "no" ? payload.priorCareAppUse : "",
    priorCareAppName: cleanText(payload.priorCareAppName, 120),
    hadIncident: payload.hadIncident === "yes" || payload.hadIncident === "no" ? payload.hadIncident : "",
    incidentStory: cleanText(payload.incidentStory, 500),
    currentlyPaysCare: payload.currentlyPaysCare === "yes" || payload.currentlyPaysCare === "no" ? payload.currentlyPaysCare : "",
    paidCareDetails: cleanText(payload.paidCareDetails, 180),
    carePayer: cleanChoice(payload.carePayer, carePayerValues),
    appTrust:
      payload.appTrust === "yes" || payload.appTrust === "no" || payload.appTrust === "maybe"
        ? payload.appTrust
        : "",
    trustConcerns: cleanChoices(payload.trustConcerns, trustConcernValues),
    trustConcernsOther: cleanText(payload.trustConcernsOther, 120),
    appInterest:
      payload.appInterest === "yes" || payload.appInterest === "no" || payload.appInterest === "maybe"
        ? payload.appInterest
        : "",
    interestNoReason: cleanText(payload.interestNoReason, 280),
    interestRequirements: cleanChoices(payload.interestRequirements, interestRequirementValues),
    interestRequirementOther: cleanText(payload.interestRequirementOther, 120),
    whatsappPreference: cleanChoice(payload.whatsappPreference, whatsappPreferenceValues),
    essentialFeatures: cleanChoices(payload.essentialFeatures, essentialFeatureValues),
    essentialFeaturesOther: cleanText(payload.essentialFeaturesOther, 120),
    discoveryChannel: cleanChoice(payload.discoveryChannel, discoveryChannelValues),
    discoveryOther: cleanText(payload.discoveryOther, 120),
    conditionDuration: cleanChoice(payload.conditionDuration, conditionDurationValues),
    priceTooExpensive: cleanText(payload.priceTooExpensive, 20),
    priceExpensiveButPay: cleanText(payload.priceExpensiveButPay, 20),
    priceBargain: cleanText(payload.priceBargain, 20),
    priceTooCheap: cleanText(payload.priceTooCheap, 20),
    closingExperience: cleanText(payload.closingExperience, 600),
    completedPath: payload.completedPath.map((step) => cleanText(step, 30)).filter(Boolean),
  };

  if (normalized.hasManagedCare !== "yes") return null;
  if (!normalized.careTarget || !normalized.caredPersonAge || !normalized.coordinationFrequency) return null;
  if (normalized.careTarget === "third_party" && !normalized.familyCaregivers) return null;
  if (normalized.careTarget === "personal") normalized.familyCaregivers = "";

  if (!normalized.organizationMethod || normalized.careChallenges.length === 0) return null;
  if (normalized.organizationMethod === "other" && !normalized.organizationOther) return null;
  if (normalized.organizationMethod === "app" && !normalized.organizationAppName) return null;

  if (normalized.careChallenges.includes("other")) {
    if (!normalized.priorCareAppUse) return null;
    if (normalized.priorCareAppUse === "yes" && !normalized.priorCareAppName) return null;
  } else {
    normalized.priorCareAppUse = "";
    normalized.priorCareAppName = "";
  }

  if (!normalized.hadIncident || !normalized.currentlyPaysCare || !normalized.carePayer || !normalized.appTrust || !normalized.appInterest) return null;
  if (normalized.currentlyPaysCare === "yes" && !normalized.paidCareDetails) return null;

  if (normalized.appTrust === "yes") {
    normalized.trustConcerns = [];
    normalized.trustConcernsOther = "";
  } else {
    if (normalized.trustConcerns.length === 0) return null;
    if (normalized.trustConcerns.includes("other") && !normalized.trustConcernsOther) return null;
  }

  if (normalized.appInterest === "no" || normalized.appInterest === "maybe") {
    if (normalized.interestRequirements.length === 0) return null;
    if (normalized.interestRequirements.includes("other") && !normalized.interestRequirementOther) return null;
    normalized.conditionDuration = "";
    normalized.priceTooExpensive = "";
    normalized.priceExpensiveButPay = "";
    normalized.priceBargain = "";
    normalized.priceTooCheap = "";
  } else {
    normalized.interestRequirements = [];
    normalized.interestRequirementOther = "";
  }

  if (!normalized.whatsappPreference || !normalized.discoveryChannel) return null;
  if (normalized.discoveryChannel === "other" && !normalized.discoveryOther) return null;

  if (normalized.essentialFeatures.length === 0) return null;
  if (normalized.essentialFeatures.includes("other") && !normalized.essentialFeaturesOther) return null;

  if (normalized.appInterest === "no" || normalized.appInterest === "maybe") {
    return normalized;
  }

  if (!normalized.conditionDuration) return null;

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
