"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export type CareSurveyResultRecord = {
  _id: string;
  _creationTime: number;
  locale: string;
  hasManagedCare?: string;
  careTarget?: string;
  caredPersonAge?: string;
  familyCaregivers?: string;
  coordinationFrequency?: string;
  organizationMethod: string;
  organizationOther: string;
  organizationAppName?: string;
  careChallenges: string[];
  careChallengesOther: string;
  priorCareAppUse?: string;
  priorCareAppName?: string;
  hadIncident: string;
  incidentStory: string;
  currentlyPaysCare?: string;
  paidCareDetails?: string;
  carePayer?: string;
  appTrust: string;
  trustConcerns: string[];
  trustConcernsOther: string;
  appInterest: string;
  interestNoReason: string;
  interestRequirements?: string[];
  interestRequirementOther?: string;
  whatsappPreference?: string;
  essentialFeatures: string[];
  essentialFeaturesOther: string;
  discoveryChannel?: string;
  discoveryOther?: string;
  conditionDuration?: string;
  priceTooExpensiveCents: number | null;
  priceExpensiveButPayCents: number | null;
  priceBargainCents: number | null;
  priceTooCheapCents: number | null;
  priceCurrency: string;
  closingExperience?: string;
  completedPath: string[];
  userAgent: string;
};

export type GetCareSurveyResultsResult =
  | { ok: true; records: CareSurveyResultRecord[] }
  | { ok: false; reason: "not-configured" | "unauthorized" | "server" };

/**
 * Fetches every survey response from Convex, gated by a shared admin key.
 *
 * The dashboard exposes free-text answers (incident stories, etc.), so the
 * results are never public: a key must be configured via SURVEY_ADMIN_KEY and
 * supplied by the caller. When the env var is missing we fail closed with
 * `not-configured` instead of leaking data.
 */
export async function getCareSurveyResults(
  key?: string,
): Promise<GetCareSurveyResultsResult> {
  const adminKey = process.env.SURVEY_ADMIN_KEY;

  if (!adminKey) {
    return { ok: false, reason: "not-configured" };
  }

  if (!key || key !== adminKey) {
    return { ok: false, reason: "unauthorized" };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not set");
    return { ok: false, reason: "server" };
  }

  try {
    const convex = new ConvexHttpClient(convexUrl);
    const records = (await convex.query(
      api.careSurvey.list,
      {},
    )) as CareSurveyResultRecord[];
    return { ok: true, records };
  } catch (error) {
    console.error("Failed to load care survey results", error);
    return { ok: false, reason: "server" };
  }
}
