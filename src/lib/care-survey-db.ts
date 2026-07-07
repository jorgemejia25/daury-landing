import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { CareSurveyPayload } from "@/lib/care-survey";
import type { DatabaseSync as SqliteDatabaseSync } from "node:sqlite";

const DEFAULT_DATABASE_PATH = path.join(process.cwd(), "data", "care-survey.sqlite");
const nodeRequire = createRequire(path.join(process.cwd(), "package.json"));

function getDatabaseSync() {
  const sqlite = nodeRequire("node:sqlite") as typeof import("node:sqlite");
  return sqlite.DatabaseSync;
}

function getDatabasePath() {
  return process.env.DAURY_SURVEY_DATABASE_PATH ?? DEFAULT_DATABASE_PATH;
}

function ensureDatabaseDirectory(databasePath: string) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
}

function createSchema(database: SqliteDatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS care_survey_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      locale TEXT NOT NULL,
      organization_method TEXT NOT NULL,
      organization_other TEXT NOT NULL,
      care_challenges_json TEXT NOT NULL,
      care_challenges_other TEXT NOT NULL,
      had_incident TEXT NOT NULL,
      incident_story TEXT NOT NULL,
      app_trust TEXT NOT NULL,
      trust_concerns_json TEXT NOT NULL,
      trust_concerns_other TEXT NOT NULL,
      app_interest TEXT NOT NULL,
      interest_no_reason TEXT NOT NULL,
      essential_features_json TEXT NOT NULL,
      essential_features_other TEXT NOT NULL,
      price_too_expensive_cents INTEGER,
      price_expensive_but_pay_cents INTEGER,
      price_bargain_cents INTEGER,
      price_too_cheap_cents INTEGER,
      price_currency TEXT NOT NULL,
      completed_path_json TEXT NOT NULL,
      user_agent TEXT NOT NULL
    )
  `);
}

function parseMonthlyPrice(value: string): number | null {
  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) return null;

  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) return null;

  return amount * 100;
}

export function saveCareSurveyResponse(payload: CareSurveyPayload, userAgent: string) {
  const databasePath = getDatabasePath();
  ensureDatabaseDirectory(databasePath);

  const DatabaseSync = getDatabaseSync();
  const database = new DatabaseSync(databasePath);

  try {
    createSchema(database);

    database.prepare(`
      INSERT INTO care_survey_responses (
        created_at,
        locale,
        organization_method,
        organization_other,
        care_challenges_json,
        care_challenges_other,
        had_incident,
        incident_story,
        app_trust,
        trust_concerns_json,
        trust_concerns_other,
        app_interest,
        interest_no_reason,
        essential_features_json,
        essential_features_other,
        price_too_expensive_cents,
        price_expensive_but_pay_cents,
        price_bargain_cents,
        price_too_cheap_cents,
        price_currency,
        completed_path_json,
        user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      new Date().toISOString(),
      payload.locale,
      payload.organizationMethod,
      payload.organizationOther,
      JSON.stringify(payload.careChallenges),
      payload.careChallengesOther,
      payload.hadIncident,
      payload.incidentStory,
      payload.appTrust,
      JSON.stringify(payload.trustConcerns),
      payload.trustConcernsOther,
      payload.appInterest,
      payload.interestNoReason,
      JSON.stringify(payload.essentialFeatures),
      payload.essentialFeaturesOther,
      parseMonthlyPrice(payload.priceTooExpensive),
      parseMonthlyPrice(payload.priceExpensiveButPay),
      parseMonthlyPrice(payload.priceBargain),
      parseMonthlyPrice(payload.priceTooCheap),
      "GTQ",
      JSON.stringify(payload.completedPath),
      userAgent,
    );
  } finally {
    database.close();
  }
}
