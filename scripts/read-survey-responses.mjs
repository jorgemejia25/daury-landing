import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.error("NEXT_PUBLIC_CONVEX_URL is not set. Run `npx convex dev` first or set it in .env.local.");
  process.exit(1);
}

const convex = new ConvexHttpClient(convexUrl);
const rows = await convex.query(api.careSurvey.list, {});

console.table(
  rows.map((row) => ({
    id: row._id,
    createdAt: new Date(row._creationTime).toISOString(),
    locale: row.locale,
    organizationMethod: row.organizationMethod,
    careChallenges: row.careChallenges.join(", "),
    hadIncident: row.hadIncident,
    appTrust: row.appTrust,
    appInterest: row.appInterest,
    essentialFeatures: row.essentialFeatures.join(", "),
    priceTooExpensiveCents: row.priceTooExpensiveCents,
    priceExpensiveButPayCents: row.priceExpensiveButPayCents,
    priceBargainCents: row.priceBargainCents,
    priceTooCheapCents: row.priceTooCheapCents,
  })),
);
