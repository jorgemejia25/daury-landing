import Link from "next/link";
import type { SurveyKind } from "@/lib/survey-storage";
import { getSurveyResult } from "@/lib/survey-results";

type SurveyResultsProps = { survey: SurveyKind; locale: "es" | "en"; accessKey?: string };

export default async function SurveyResults({ survey, locale, accessKey }: SurveyResultsProps) {
  const english = locale === "en";
  const results = await getSurveyResult(survey, accessKey);
  const title = survey === "nursing" ? (english ? "Care survey results" : "Resultados · Encuesta de cuidado") : (english ? "Professional survey results" : "Resultados · Encuesta profesional");

  if (!results) return <main className="survey-results-shell"><section className="survey-results-empty"><p>{english ? "This results page requires a valid access key." : "Esta página de resultados requiere una clave de acceso válida."}</p></section></main>;

  const downloadUrl = `/api/survey-results/${survey}?key=${encodeURIComponent(accessKey ?? "")}`;
  return (
    <main className="survey-results-shell">
      <section className="survey-results-card">
        <div className="survey-results-toolbar">
          <div><p className="survey-kicker">DAURY · {english ? "RESULTS" : "RESULTADOS"}</p><h1>{title}</h1></div>
          <Link className="survey-results-download" href={downloadUrl}>{english ? "Download CSV" : "Descargar CSV"}</Link>
        </div>
        <div className="survey-results-table-wrap">
          <table className="survey-results-table">
            <thead><tr><th>{english ? "Submitted" : "Enviada"}</th>{results.columns.map((column) => <th key={column.id}>{column.label}</th>)}</tr></thead>
            <tbody>{results.rows.length ? results.rows.map((row) => <tr key={`${row.createdAt}-${row.values.consiente ?? ""}`}><td>{new Intl.DateTimeFormat(english ? "en-US" : "es-GT", { dateStyle: "medium", timeStyle: "short" }).format(row.createdAt)}</td>{results.columns.map((column) => <td key={column.id}>{row.values[column.id] || "—"}</td>)}</tr>) : <tr><td className="survey-results-no-data" colSpan={results.columns.length + 1}>{english ? "There are no responses yet." : "Aún no hay respuestas."}</td></tr>}</tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
