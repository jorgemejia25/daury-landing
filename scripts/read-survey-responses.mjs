import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = process.env.DAURY_SURVEY_DATABASE_PATH ?? path.join(process.cwd(), "data", "care-survey.sqlite");

if (!fs.existsSync(databasePath)) {
  console.log(`No survey database found at ${databasePath}`);
  process.exit(0);
}

const database = new DatabaseSync(databasePath);

try {
  const rows = database.prepare(`
    SELECT
      id,
      created_at,
      locale,
      organization_method,
      care_challenges_json,
      had_incident,
      app_trust,
      app_interest,
      essential_features_json,
      price_too_expensive_cents,
      price_expensive_but_pay_cents,
      price_bargain_cents,
      price_too_cheap_cents
    FROM care_survey_responses
    ORDER BY created_at DESC
  `).all();

  console.table(rows);
} finally {
  database.close();
}
