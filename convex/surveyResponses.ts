import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const surveyKind = v.union(v.literal("nursing"), v.literal("professional"));

function requireAdminKey(key: string) {
  const expected = process.env.SURVEY_ADMIN_KEY;
  if (!expected || key !== expected) throw new Error("Unauthorized survey results request.");
}

export const submit = mutation({
  args: { survey: surveyKind, answers: v.any() },
  handler: (ctx, args) => ctx.db.insert("surveyResponses", { ...args, createdAt: Date.now() }),
});

export const saveContact = mutation({
  args: { survey: surveyKind, kind: v.union(v.literal("phone"), v.literal("email")), value: v.string() },
  handler: (ctx, args) => ctx.db.insert("surveyContacts", { ...args, createdAt: Date.now() }),
});

export const list = query({
  args: { survey: surveyKind, adminKey: v.string() },
  handler: async (ctx, args) => {
    requireAdminKey(args.adminKey);
    return await ctx.db.query("surveyResponses").withIndex("by_survey_created_at", (query) => query.eq("survey", args.survey)).order("desc").take(1_000);
  },
});
