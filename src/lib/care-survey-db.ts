import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { CareSurveyPayload } from "@/lib/care-survey";

function getConvexClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  }

  return new ConvexHttpClient(convexUrl);
}

function parseMonthlyPrice(value: string): number | null {
  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) return null;

  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) return null;

  return amount * 100;
}

export async function saveCareSurveyResponse(payload: CareSurveyPayload, userAgent: string) {
  const convex = getConvexClient();

  await convex.mutation(api.careSurvey.submit, {
    locale: payload.locale,
    hasManagedCare: payload.hasManagedCare,
    careTarget: payload.careTarget,
    caredPersonAge: payload.caredPersonAge,
    familyCaregivers: payload.familyCaregivers,
    coordinationFrequency: payload.coordinationFrequency,
    organizationMethod: payload.organizationMethod,
    organizationOther: payload.organizationOther,
    organizationAppName: payload.organizationAppName,
    careChallenges: payload.careChallenges,
    careChallengesOther: payload.careChallengesOther,
    priorCareAppUse: payload.priorCareAppUse,
    priorCareAppName: payload.priorCareAppName,
    hadIncident: payload.hadIncident,
    incidentStory: payload.incidentStory,
    currentlyPaysCare: payload.currentlyPaysCare,
    paidCareDetails: payload.paidCareDetails,
    carePayer: payload.carePayer,
    appTrust: payload.appTrust,
    trustConcerns: payload.trustConcerns,
    trustConcernsOther: payload.trustConcernsOther,
    appInterest: payload.appInterest,
    interestNoReason: payload.interestNoReason,
    interestRequirements: payload.interestRequirements,
    interestRequirementOther: payload.interestRequirementOther,
    whatsappPreference: payload.whatsappPreference,
    essentialFeatures: payload.essentialFeatures,
    essentialFeaturesOther: payload.essentialFeaturesOther,
    discoveryChannel: payload.discoveryChannel,
    discoveryOther: payload.discoveryOther,
    conditionDuration: payload.conditionDuration,
    priceTooExpensiveCents: parseMonthlyPrice(payload.priceTooExpensive),
    priceExpensiveButPayCents: parseMonthlyPrice(payload.priceExpensiveButPay),
    priceBargainCents: parseMonthlyPrice(payload.priceBargain),
    priceTooCheapCents: parseMonthlyPrice(payload.priceTooCheap),
    priceCurrency: "GTQ",
    closingExperience: payload.closingExperience,
    completedPath: payload.completedPath,
    userAgent,
  });
}
