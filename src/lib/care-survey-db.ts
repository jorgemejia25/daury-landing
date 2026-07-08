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
    organizationMethod: payload.organizationMethod,
    organizationOther: payload.organizationOther,
    careChallenges: payload.careChallenges,
    careChallengesOther: payload.careChallengesOther,
    hadIncident: payload.hadIncident,
    incidentStory: payload.incidentStory,
    appTrust: payload.appTrust,
    trustConcerns: payload.trustConcerns,
    trustConcernsOther: payload.trustConcernsOther,
    appInterest: payload.appInterest,
    interestNoReason: payload.interestNoReason,
    essentialFeatures: payload.essentialFeatures,
    essentialFeaturesOther: payload.essentialFeaturesOther,
    priceTooExpensiveCents: parseMonthlyPrice(payload.priceTooExpensive),
    priceExpensiveButPayCents: parseMonthlyPrice(payload.priceExpensiveButPay),
    priceBargainCents: parseMonthlyPrice(payload.priceBargain),
    priceTooCheapCents: parseMonthlyPrice(payload.priceTooCheap),
    priceCurrency: "GTQ",
    completedPath: payload.completedPath,
    userAgent,
  });
}
