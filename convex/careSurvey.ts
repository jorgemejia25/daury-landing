import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    locale: v.string(),
    hasManagedCare: v.string(),
    careTarget: v.string(),
    caredPersonAge: v.string(),
    familyCaregivers: v.string(),
    coordinationFrequency: v.string(),
    organizationMethod: v.string(),
    organizationOther: v.string(),
    organizationAppName: v.string(),
    careChallenges: v.array(v.string()),
    careChallengesOther: v.string(),
    priorCareAppUse: v.string(),
    priorCareAppName: v.string(),
    hadIncident: v.string(),
    incidentStory: v.string(),
    currentlyPaysCare: v.string(),
    paidCareDetails: v.string(),
    carePayer: v.string(),
    appTrust: v.string(),
    trustConcerns: v.array(v.string()),
    trustConcernsOther: v.string(),
    appInterest: v.string(),
    interestNoReason: v.string(),
    interestRequirements: v.array(v.string()),
    interestRequirementOther: v.string(),
    whatsappPreference: v.string(),
    essentialFeatures: v.array(v.string()),
    essentialFeaturesOther: v.string(),
    discoveryChannel: v.string(),
    discoveryOther: v.string(),
    conditionDuration: v.string(),
    priceTooExpensiveCents: v.union(v.number(), v.null()),
    priceExpensiveButPayCents: v.union(v.number(), v.null()),
    priceBargainCents: v.union(v.number(), v.null()),
    priceTooCheapCents: v.union(v.number(), v.null()),
    priceCurrency: v.string(),
    closingExperience: v.string(),
    completedPath: v.array(v.string()),
    userAgent: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("careSurveyResponses", args);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("careSurveyResponses").order("desc").collect();
  },
});
