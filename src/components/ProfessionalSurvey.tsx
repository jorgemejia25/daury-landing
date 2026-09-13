"use client";

import Link from "next/link";
import SurveySelect from "@/components/SurveySelect";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { submitProfessionalIneligibleCount, submitProfessionalSurvey } from "@/actions/submit-professional-survey";
import { professionalConditionMatches, professionalDepartments, professionalSurvey, type ProfessionalAnswer, type ProfessionalQuestion } from "@/lib/professional-survey";

type MatrixAnswer = Record<string, { frequency: string; severity: string }>;
type Completion = "complete" | "declined" | "ineligible" | null;
const frequencies = ["Nunca", "Rara vez", "A veces", "Frecuente", "Muy frecuente"];
const severities = ["Leve", "Moderada", "Grave"];
const situationQuestions: Record<string, string> = {
  a: "¿Con qué frecuencia el cuidador olvida darle al paciente una dosis del medicamento indicado?",
  b: "¿Con qué frecuencia el cuidador administra el medicamento en un horario distinto al indicado?",
  c: "¿Con qué frecuencia el cuidador administra una cantidad de medicamento distinta a la indicada?",
  d: "¿Con qué frecuencia el cuidador confunde un medicamento con otro?",
  e: "¿Con qué frecuencia el cuidador comete errores u omisiones al aplicar tratamientos tópicos o inyectables?",
  f: "¿Con qué frecuencia el cuidador repite una dosis ya administrada por duda o desconocimiento?",
  g: "¿Con qué frecuencia el cuidador olvida medir o registrar un dato relevante del cuidado (por ejemplo, signos vitales o glucosa)?",
  h: "¿Con qué frecuencia se pierde u olvida una cita médica del paciente?",
  i: "¿Con qué frecuencia hay fallas de comunicación entre las personas que se turnan para cuidar al paciente?",
  j: "¿Con qué frecuencia el cuidador no logra reconocer a tiempo una señal de alarma del paciente?",
};

function list(answer: ProfessionalAnswer | undefined): string[] { return Array.isArray(answer) ? answer : []; }
function matrix(answer: ProfessionalAnswer | undefined): MatrixAnswer { return answer && !Array.isArray(answer) && typeof answer === "object" ? answer : {}; }

export default function ProfessionalSurvey() {
  const reduceMotion = useReducedMotion();
  const [answers, setAnswers] = useState<Record<string, ProfessionalAnswer>>({});
  const [currentId, setCurrentId] = useState(professionalSurvey[0].id);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState<Completion>(null);
  const [submitting, setSubmitting] = useState(false);
  const [matrixPage, setMatrixPage] = useState(0);
  const question = professionalSurvey.find((item) => item.id === currentId) ?? professionalSurvey[0];
  const matrixPageCount = question.kind === "matrix" ? question.rows?.length ?? 0 : 0;
  const available = useMemo(() => professionalSurvey.filter((item) => item.kind !== "info" && professionalConditionMatches(item.showIf, answers)), [answers]);
  const earlier = professionalSurvey.slice(0, professionalSurvey.findIndex((item) => item.id === currentId)).filter((item) => item.kind !== "info" && professionalConditionMatches(item.showIf, answers)).length;
  const progress = Math.round(((earlier + (question.kind === "info" ? 0 : 1)) / available.length) * 100);

  const setAnswer = (id: string, value: ProfessionalAnswer) => { setError(null); setAnswers((previous) => ({ ...previous, [id]: value })); };
  const option = question.options?.find((item) => answers[question.id] === item.value);
  const nextQuestion = () => {
    if (option?.next) return professionalSurvey.find((item) => item.id === option.next);
    const index = professionalSurvey.findIndex((item) => item.id === question.id);
    return professionalSurvey.slice(index + 1).find((item) => professionalConditionMatches(item.showIf, answers));
  };
  const isAnswered = (item: ProfessionalQuestion) => {
    if (item.kind === "info") return true;
    if (item.kind === "matrix") return item.rows?.every((row) => Boolean(matrix(answers[item.id])[row.value]?.frequency && matrix(answers[item.id])[row.value]?.severity));
    const answer = answers[item.id];
    return Array.isArray(answer) ? answer.length > 0 : typeof answer === "string" && answer.trim().length > 0;
  };

  async function advance() {
    if (question.kind === "matrix") {
      const pageRows = question.rows?.slice(matrixPage, matrixPage + 1) ?? [];
      const selected = matrix(answers[question.id]);
      if (!pageRows.every((row) => Boolean(selected[row.value]?.frequency && selected[row.value]?.severity))) {
        setError("Complete frecuencia y gravedad para cada situación.");
        return;
      }
      if (matrixPage < matrixPageCount - 1) {
        setError(null);
        setMatrixPage((page) => page + 1);
        return;
      }
    }
    if (!isAnswered(question)) { setError(question.kind === "matrix" ? "Complete frecuencia y gravedad para cada situación." : "Seleccione o complete una respuesta para continuar."); return; }
    if (option?.next === "END_NO_CONSIENTE") { setCompletion("declined"); return; }
    if (option?.next === "END_NO_ELEGIBLE") { void submitProfessionalIneligibleCount(); setCompletion("ineligible"); return; }
    const next = nextQuestion();
    if (next) { setHistory((previous) => [...previous, currentId]); setCurrentId(next.id); setMatrixPage(0); return; }
    setSubmitting(true); setError(null);
    try {
      const email = typeof answers.correo_contacto === "string" ? answers.correo_contacto : undefined;
      const result = await submitProfessionalSurvey({ answers, email });
      if (!result.ok) { setError(result.error === "not_configured" ? "El envío seguro aún no está configurado. Inténtelo más tarde." : "No pudimos registrar la respuesta. Revise su conexión e inténtelo nuevamente."); return; }
      setCompletion("complete");
    } catch { setError("No pudimos registrar la respuesta. Revise su conexión e inténtelo nuevamente."); } finally { setSubmitting(false); }
  }
  function back() { if (question.kind === "matrix" && matrixPage > 0) { setError(null); setMatrixPage((page) => page - 1); return; } const previous = history.at(-1); if (!previous || submitting) return; setError(null); setHistory((items) => items.slice(0, -1)); setCurrentId(previous); setMatrixPage(0); }
  function toggle(optionValue: string) {
    const found = question.options?.find((item) => item.value === optionValue);
    const selected = list(answers[question.id]);
    if (found?.exclusive) { setAnswer(question.id, selected.includes(optionValue) ? [] : [optionValue]); return; }
    const withoutExclusive = selected.filter((value) => !question.options?.find((item) => item.value === value)?.exclusive);
    setAnswer(question.id, withoutExclusive.includes(optionValue) ? withoutExclusive.filter((value) => value !== optionValue) : [...withoutExclusive, optionValue]);
  }

  if (completion) {
    const message = completion === "complete" ? ["Gracias por participar.", "Su respuesta ha sido registrada."] : completion === "ineligible" ? ["Gracias por su tiempo.", "Este estudio no aplica a su caso."] : ["Gracias por su tiempo.", "No se ha guardado ninguna respuesta."];
    return <main className="survey-shell"><section className="survey-finish" aria-live="polite"><span className="survey-mark">✓</span><p className="survey-kicker">DAURY · VALIDACIÓN PROFESIONAL</p><h1>{message[0]}</h1><p>{message[1]}</p><Link className="survey-home" href="/es">Volver a Daury</Link></section></main>;
  }

  const previousLabel = question.kind === "matrix" && matrixPage > 0 ? "← Situaciones previas" : "← Anterior";
  const nextLabel = question.kind === "matrix" && matrixPage < matrixPageCount - 1 ? "Siguientes situaciones →" : question.kind === "info" ? "Continuar" : "Continuar →";

  return (
    <main className="survey-shell">
      <div className="survey-noise" aria-hidden="true" />
      <header className="survey-header">
        <Link className="survey-brand" href="/es" aria-label="Volver a Daury">daury<span>.</span></Link>
        <span className="survey-estimate">10 min · anónima</span>
      </header>
      <section className="survey-layout">
        <aside className="survey-aside">
          <p className="survey-kicker">DAURY · VALIDACIÓN PROFESIONAL</p>
          <h1>Encuesta para profesionales de salud</h1>
          <p>Sus respuestas describen lo que observa en cuidadores sin formación clínica.</p>
          <div className="survey-privacy">Las respuestas se analizan de forma agrupada. El correo voluntario se envía por separado y nunca se vincula a las respuestas.</div>
        </aside>
        <div className={`survey-card ${question.kind === "matrix" ? "survey-card--matrix" : ""}`}>
          <div className="survey-progress-meta"><span>{question.section}</span><span>{Math.min(100, progress)}%</span></div>
          <div className="survey-progress"><i style={{ width: `${Math.min(100, progress)}%` }} /></div>
          <AnimatePresence mode="wait" initial={!reduceMotion}>
            <motion.div
              key={`${question.id}-${question.kind === "matrix" ? matrixPage : ""}`}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {question.kind === "info" ? (
                <div className="survey-question survey-info survey-info--compact"><h2>{question.label}</h2></div>
              ) : (
                <fieldset className={`survey-question ${question.kind === "matrix" ? "survey-question--matrix" : ""}`}>
                  <legend className={question.kind === "matrix" ? "sr-only" : ""}>{question.label}</legend>
                  <ProfessionalControl question={question} answers={answers} setAnswer={setAnswer} toggle={toggle} matrixPage={matrixPage} reduceMotion={reduceMotion} />
                </fieldset>
              )}
            </motion.div>
          </AnimatePresence>
          {error && <p role="alert" className="survey-error">{error}</p>}
          <div className="survey-actions">
            <button type="button" onClick={back} className="survey-back" disabled={(!history.length && matrixPage === 0) || submitting}>{previousLabel}</button>
            <motion.button type="button" onClick={advance} className="survey-next" disabled={submitting} whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>{submitting ? "Enviando…" : nextLabel}</motion.button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfessionalControl({ question, answers, setAnswer, toggle, matrixPage, reduceMotion }: { question: ProfessionalQuestion; answers: Record<string, ProfessionalAnswer>; setAnswer: (id: string, value: ProfessionalAnswer) => void; toggle: (value: string) => void; matrixPage: number; reduceMotion: boolean | null }) {
  const currentValue = answers[question.id];
  const fieldValue = typeof currentValue === "string" ? currentValue : "";
  if (question.kind === "short" || question.kind === "long") return question.kind === "long" ? <textarea className="survey-input survey-textarea" rows={5} value={fieldValue} onChange={(event) => setAnswer(question.id, event.target.value)} /> : <input className="survey-input" type={question.id === "correo_contacto" ? "email" : "text"} value={fieldValue} onChange={(event) => setAnswer(question.id, event.target.value)} autoFocus />;
  if (question.kind === "department") return <SurveySelect value={fieldValue} options={professionalDepartments} placeholder="Seleccione un departamento" onChange={(value) => setAnswer(question.id, value)} />;
  if (question.kind === "matrix") {
    const selected = matrix(answers[question.id]);
    const pageRows = question.rows?.slice(matrixPage, matrixPage + 1) ?? [];
    const totalRows = question.rows?.length ?? 0;
    const update = (row: string, key: "frequency" | "severity", value: string) => setAnswer(question.id, { ...selected, [row]: { frequency: selected[row]?.frequency ?? "", severity: selected[row]?.severity ?? "", [key]: value } });
    return (
      <div className="professional-matrix" role="group" aria-label="Matriz de frecuencia y gravedad">
        <div className="professional-matrix-meta">Situación {matrixPage + 1} de {totalRows}</div>
        <div className="professional-matrix-segment" key={matrixPage}>
          {pageRows.map((row) => <SituationAssessment key={row.value} row={row} value={selected[row.value]} onChange={update} />)}
        </div>
      </div>
    );
  }
  const options = question.kind === "dynamic" ? professionalSurvey.find((item) => item.id === "matriz_errores")?.rows ?? [] : question.options ?? [];
  return <div className={`survey-options ${options.length >= 6 ? "survey-options--dense" : options.length >= 4 ? "survey-options--grid" : ""}`}>{options.map((item, index) => { const selected = question.kind === "multiple" ? list(answers[question.id]).includes(item.value) : answers[question.id] === item.value; return <motion.button type="button" className={`survey-option ${selected ? "is-selected" : ""}`} aria-pressed={selected} onClick={() => question.kind === "multiple" ? toggle(item.value) : setAnswer(question.id, item.value)} key={item.value} initial={reduceMotion ? false : { opacity: 0, scale: 0.99 }} animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.22, delay: reduceMotion ? 0 : index * 0.035 }} whileTap={reduceMotion ? undefined : { scale: 0.985 }}><span className="survey-option-check">{selected ? "✓" : ""}</span>{item.label}</motion.button>; })}</div>;
}

function SituationAssessment({ row, value, onChange }: {
  row: { value: string; label: string };
  value: { frequency: string; severity: string } | undefined;
  onChange: (row: string, key: "frequency" | "severity", value: string) => void;
}) {
  return (
    <article className="situation-assessment">
      <h3>{situationQuestions[row.value] ?? row.label}</h3>
      <section className="situation-frequency" aria-label={`Frecuencia de ${row.label}`}>
        <span className="matrix-control-label">Frecuencia observada</span>
        <SurveySelect
          value={value?.frequency ? frequencies[Number(value.frequency)] ?? "" : ""}
          options={frequencies}
          placeholder="Seleccione la frecuencia"
          onChange={(frequency) => onChange(row.value, "frequency", String(frequencies.indexOf(frequency)))}
        />
      </section>
      <fieldset className="situation-severity"><legend>Gravedad estimada para el paciente</legend><div>{severities.map((label) => <label className={value?.severity === label ? "is-selected" : ""} key={label}><input className="situation-severity-input" type="radio" name={`${row.value}-gravedad`} checked={value?.severity === label} onChange={() => onChange(row.value, "severity", label)} /><span className="situation-severity-indicator" aria-hidden="true" /><span>{label}</span></label>)}</div></fieldset>
    </article>
  );
}
