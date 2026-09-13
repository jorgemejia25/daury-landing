import "server-only";

import { nursingSurvey } from "@/lib/nursing-survey";
import { professionalSurvey } from "@/lib/professional-survey";
import { listSurveyResponses, type StoredSurveyResponse, type SurveyKind, validSurveyAdminKey } from "@/lib/survey-storage";

type SurveyColumn = { id: string; label: string };
export type SurveyResultRow = { createdAt: number; values: Record<string, string> };
export type SurveyResult = { columns: SurveyColumn[]; rows: SurveyResultRow[] };

function columnsFor(survey: SurveyKind): SurveyColumn[] {
  const questions = survey === "nursing" ? nursingSurvey : professionalSurvey;
  return questions.filter((question) => question.kind !== "info").map((question) => ({ id: question.id, label: question.label }));
}

function formatAnswer(value: unknown): string {
  if (Array.isArray(value)) return value.join(" | ");
  if (value && typeof value === "object") return Object.entries(value as Record<string, unknown>).map(([key, entry]) => `${key}: ${formatAnswer(entry)}`).join(" | ");
  return typeof value === "string" ? value : "";
}

function rowFrom(record: StoredSurveyResponse, columns: SurveyColumn[]): SurveyResultRow {
  return { createdAt: record.createdAt, values: Object.fromEntries(columns.map((column) => [column.id, formatAnswer(record.answers[column.id])])) };
}

export async function getSurveyResult(survey: SurveyKind, key: string | undefined): Promise<SurveyResult | null> {
  if (!key || !validSurveyAdminKey(key)) return null;
  const columns = columnsFor(survey);
  const responses = await listSurveyResponses(survey, key);
  return { columns, rows: responses.map((response) => rowFrom(response, columns)) };
}

function escapeCsv(value: string) { return `"${value.replaceAll('"', '""')}"`; }

export function resultsCsv(results: SurveyResult) {
  const headers = ["Fecha de envío", ...results.columns.map((column) => column.label)];
  const rows = results.rows.map((row) => [new Date(row.createdAt).toISOString(), ...results.columns.map((column) => row.values[column.id] ?? "")]);
  return [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
}
