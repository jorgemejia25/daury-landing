import { getSurveyResult, resultsCsv } from "@/lib/survey-results";
import type { SurveyKind } from "@/lib/survey-storage";

export const dynamic = "force-dynamic";

function isSurveyKind(value: string): value is SurveyKind { return value === "nursing" || value === "professional"; }

export async function GET(request: Request, { params }: { params: Promise<{ survey: string }> }) {
  const { survey } = await params;
  if (!isSurveyKind(survey)) return new Response("Not found", { status: 404 });
  const key = new URL(request.url).searchParams.get("key") ?? undefined;
  const results = await getSurveyResult(survey, key);
  if (!results) return new Response("Unauthorized", { status: 401 });
  return new Response(resultsCsv(results), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="daury-${survey}-results.csv"`, "Cache-Control": "no-store" } });
}
