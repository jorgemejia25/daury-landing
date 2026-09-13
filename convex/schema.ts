import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const surveyKind = v.union(v.literal("nursing"), v.literal("professional"));

export default defineSchema({
  careSurveyResponses: defineTable({
    locale: v.string(), careTarget: v.optional(v.string()), organizationMethod: v.string(), organizationOther: v.string(), careChallenges: v.array(v.string()), careChallengesOther: v.string(), hadIncident: v.string(), incidentStory: v.string(), appTrust: v.string(), trustConcerns: v.array(v.string()), trustConcernsOther: v.string(), appInterest: v.string(), interestNoReason: v.string(), essentialFeatures: v.array(v.string()), essentialFeaturesOther: v.string(), priceTooExpensiveCents: v.union(v.number(), v.null()), priceExpensiveButPayCents: v.union(v.number(), v.null()), priceBargainCents: v.union(v.number(), v.null()), priceTooCheapCents: v.union(v.number(), v.null()), priceCurrency: v.string(), completedPath: v.array(v.string()), userAgent: v.string(),
  }),
  surveyResponses: defineTable({ survey: surveyKind, answers: v.any(), createdAt: v.number() }).index("by_survey_created_at", ["survey", "createdAt"]),
  surveyContacts: defineTable({ survey: surveyKind, kind: v.union(v.literal("phone"), v.literal("email")), value: v.string(), createdAt: v.number() }).index("by_survey_created_at", ["survey", "createdAt"]),
});
