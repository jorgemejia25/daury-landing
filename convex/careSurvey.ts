import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    locale: v.string(),
    careTarget: v.string(),
    organizationMethod: v.string(),
    organizationOther: v.string(),
    careChallenges: v.array(v.string()),
    careChallengesOther: v.string(),
    hadIncident: v.string(),
    incidentStory: v.string(),
    appTrust: v.string(),
    trustConcerns: v.array(v.string()),
    trustConcernsOther: v.string(),
    appInterest: v.string(),
    interestNoReason: v.string(),
    essentialFeatures: v.array(v.string()),
    essentialFeaturesOther: v.string(),
    priceTooExpensiveCents: v.union(v.number(), v.null()),
    priceExpensiveButPayCents: v.union(v.number(), v.null()),
    priceBargainCents: v.union(v.number(), v.null()),
    priceTooCheapCents: v.union(v.number(), v.null()),
    priceCurrency: v.string(),
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

/**
 * Wipes every survey response. Not part of the public API — only callable via
 * `npx convex run careSurvey:clearAll` (deploy-key auth), never from the browser.
 * Used to reset dev/demo data before reseeding.
 */
export const clearAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("careSurveyResponses").collect();
    await Promise.all(docs.map((doc) => ctx.db.delete(doc._id)));
    return { deleted: docs.length };
  },
});
