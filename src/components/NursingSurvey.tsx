"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import SurveySelect from "@/components/SurveySelect";
import { submitNursingIneligibleCount, submitNursingSurvey } from "@/actions/submit-nursing-survey";
import {
  conditionMatches,
  departments,
  getNursingSurvey,
  type Answer,
  type SurveyOption,
  type SurveyQuestion,
} from "@/lib/nursing-survey";

type Completion = "complete" | "declined" | "ineligible" | null;

function asList(value: Answer | undefined): string[] {
  return Array.isArray(value) ? value : [];
}

const pastCareLabels: Record<"es" | "en", Record<string, string>> = {
  es: {
    departamento: "¿En qué departamento brindó el cuidado?",
    area: "¿El cuidado lo brindó en un área urbana o rural?",
    antiguedad: "¿Cuánto tiempo cuidó a esa persona?",
    horas_dia: "Cuando cuidaba a esa persona, en un día normal, ¿cuántas horas dedicaba al cuidado?",
    comparte_rol: "¿Compartía el cuidado con otras personas?",
    edad_cuidado: "¿Qué edad tenía aproximadamente la persona que cuidó?",
    tareas: "¿Qué tareas realizaba para cuidar a esa persona?",
    n_medicamentos: "En un día normal, ¿cuántos medicamentos distintos administraba?",
    organizacion: "¿Cómo organizaba la información del cuidado?",
    frec_registro: "Cuando realizaba una tarea de cuidado, ¿anotaba que ya la había hecho?",
    donde_anota: "¿Dónde anotaba?",
    revision: "¿Alguien más revisaba lo que anotaba?",
    barreras_registro: "¿Qué le dificultaba llevar un control escrito?",
    dificultad_abierta: "¿Qué fue lo más difícil de cuidar a alguien en casa?",
  },
  en: {
    antiguedad: "How long did you care for this person?",
    horas_dia: "When you were caring for this person, how many hours did you spend providing care on a typical day?",
    comparte_rol: "Did you share care responsibilities with other people?",
    edad_cuidado: "How old was the person you cared for, approximately?",
    tareas: "Which tasks did you perform while caring for this person?",
    n_medicamentos: "On a typical day, how many different medications did you administer?",
    organizacion: "How did you organize care information?",
    frec_registro: "When you performed a care task, did you record that you had completed it?",
    donde_anota: "Where did you keep these records?",
    revision: "Did anyone else review what you recorded?",
    barreras_registro: "What made it difficult to keep written records?",
    dificultad_abierta: "What was the most difficult part of caring for someone at home?",
  },
};

function questionLabel(question: SurveyQuestion, answers: Record<string, Answer>, locale: "es" | "en") {
  return answers.cuida_actualmente === "no" ? pastCareLabels[locale][question.id] ?? question.label : question.label;
}

export default function NursingSurvey({ locale }: { locale: "es" | "en" }) {
  const reduceMotion = useReducedMotion();
  const survey = useMemo(() => getNursingSurvey(locale), [locale]);
  const copy = locale === "en" ? {
    study: "DAURY · CARE STUDY", title: "Home care survey", lead: "This survey collects care experiences at home to inform safer, more useful tools.", privacy: "Responses are analyzed in aggregate. If you provide a phone number, it is sent separately and is never linked to your answers.", estimate: "12 min · anonymous", next: "Continue", previous: "← Previous", sending: "Sending…", sectionInfo: "The next section asks about phone access and digital tools.", completeTitle: "Thank you for taking part.", completeMessage: "Your response has been recorded.", ineligibleTitle: "Thank you for your time.", ineligibleMessage: "This study does not apply to your situation.", declinedTitle: "Thank you for your time.", declinedMessage: "No response has been saved.", home: "Return to Daury", answerRequired: "Select or complete an answer to continue.", ageRequired: "Enter an age between 18 and 99.", selectionLimit: "You may select up to 3 options.", submitError: "We could not record your response. Check your connection and try again.", configurationError: "Secure submission is not configured yet. Please try again later.", department: "Select a department",
  } : {
    study: "DAURY · ESTUDIO DE CUIDADO", title: "Encuesta sobre cuidado en casa", lead: "", privacy: "Las respuestas se analizan de forma agrupada. Si deja un teléfono, se envía por separado y nunca se vincula a sus respuestas.", estimate: "12 min · anónima", next: "Continuar", previous: "← Anterior", sending: "Enviando…", sectionInfo: "La siguiente sección recopila información sobre acceso a teléfono y herramientas digitales.", completeTitle: "Gracias por participar.", completeMessage: "Su respuesta ha sido registrada.", ineligibleTitle: "Gracias por su tiempo.", ineligibleMessage: "Este estudio no aplica a su caso.", declinedTitle: "Gracias por su tiempo.", declinedMessage: "No se ha guardado ninguna respuesta.", home: "Volver a Daury", answerRequired: "Seleccione o complete una respuesta para continuar.", ageRequired: "Ingrese una edad entre 18 y 99 años.", selectionLimit: "Puede marcar un máximo de 3 opciones.", submitError: "No pudimos registrar la respuesta. Revise su conexión e inténtelo nuevamente.", configurationError: "El envío seguro aún no está configurado. Inténtelo más tarde.", department: "Seleccione un departamento",
  };
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentId, setCurrentId] = useState(survey[0].id);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState<Completion>(null);
  const [submitting, setSubmitting] = useState(false);

  const question = survey.find((item) => item.id === currentId) ?? survey[0];
  const visibleLabel = questionLabel(question, answers, locale);
  const visibleCount = useMemo(
    () => survey.filter((item) => item.kind !== "info" && conditionMatches(item.showIf, answers)).length,
    [answers, survey],
  );
  const answeredBefore = survey
    .slice(0, survey.findIndex((item) => item.id === currentId))
    .filter((item) => item.kind !== "info" && conditionMatches(item.showIf, answers)).length;
  const progress = question.kind === "info" ? Math.round((answeredBefore / visibleCount) * 100) : Math.round(((answeredBefore + 1) / visibleCount) * 100);

  function setAnswer(id: string, value: Answer) {
    setError(null);
    setAnswers((previous) => ({ ...previous, [id]: value }));
  }

  function optionFromAnswer(item: SurveyQuestion): SurveyOption | undefined {
    const answer = answers[item.id];
    const value = Array.isArray(answer) ? answer[0] : answer;
    return item.options?.find((option) => option.value === value);
  }

  function nextQuestion(): SurveyQuestion | undefined {
    const option = optionFromAnswer(question);
    if (option?.next) return survey.find((item) => item.id === option.next);
    const currentIndex = survey.findIndex((item) => item.id === question.id);
    return survey.slice(currentIndex + 1).find((item) => conditionMatches(item.showIf, answers));
  }

  function isAnswered(item: SurveyQuestion): boolean {
    if (item.kind === "info") return true;
    const answer = answers[item.id];
    if (Array.isArray(answer)) return answer.length > 0;
    if (item.kind === "number") {
      const parsed = Number(answer);
      return Boolean(answer) && Number.isInteger(parsed) && parsed >= (item.min ?? 0) && parsed <= (item.max ?? Number.MAX_SAFE_INTEGER);
    }
    return typeof answer === "string" && answer.trim().length > 0;
  }

  async function advance() {
    if (submitting) return;
    if (!isAnswered(question)) {
      setError(question.kind === "number" ? copy.ageRequired : copy.answerRequired);
      return;
    }

    const terminal = optionFromAnswer(question)?.next;
    if (terminal === "END_NO_CONSIENTE") {
      setCompletion("declined");
      return;
    }
    if (terminal === "END_NO_ELEGIBLE") {
      void submitNursingIneligibleCount();
      setCompletion("ineligible");
      return;
    }

    const next = nextQuestion();
    if (next) {
      setHistory((previous) => [...previous, currentId]);
      setCurrentId(next.id);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const contact = typeof answers.telefono_contacto === "string" ? answers.telefono_contacto : undefined;
      const result = await submitNursingSurvey({ answers, contact });
      if (!result.ok) {
        setError(result.error === "not_configured" ? copy.configurationError : copy.submitError);
        return;
      }
      setCompletion("complete");
    } catch {
      setError(copy.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  function goBack() {
    const previous = history.at(-1);
    if (!previous || submitting) return;
    setError(null);
    setHistory((items) => items.slice(0, -1));
    setCurrentId(previous);
  }

  function toggleMultiple(option: SurveyOption) {
    const selected = asList(answers[question.id]);
    const isSelected = selected.includes(option.value);
    if (option.exclusive) {
      setAnswer(question.id, isSelected ? [] : [option.value]);
      return;
    }
    const withoutExclusive = selected.filter((value) => !question.options?.find((item) => item.value === value)?.exclusive);
    const next = isSelected ? withoutExclusive.filter((value) => value !== option.value) : [...withoutExclusive, option.value];
    if (question.maxSelections && next.length > question.maxSelections) {
      setError(copy.selectionLimit);
      return;
    }
    setAnswer(question.id, next);
  }

  if (completion) {
    const content = completion === "complete"
      ? [copy.completeTitle, copy.completeMessage]
      : completion === "ineligible"
        ? [copy.ineligibleTitle, copy.ineligibleMessage]
        : [copy.declinedTitle, copy.declinedMessage];
    return (
      <main className="survey-shell">
        <section className="survey-finish" aria-live="polite">
          <span className="survey-mark" aria-hidden="true">✓</span>
          <p className="survey-kicker">{copy.study}</p>
          <h1>{content[0]}</h1>
          <p>{content[1]}</p>
          <Link className="survey-home" href={`/${locale}`}>{copy.home}</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="survey-shell">
      <div className="survey-noise" aria-hidden="true" />
      <header className="survey-header">
        <Link className="survey-brand" href={`/${locale}`} aria-label={copy.home}>daury<span>.</span></Link>
        <span className="survey-estimate">{copy.estimate}</span>
      </header>

      <section className="survey-layout">
        <aside className="survey-aside">
          <p className="survey-kicker">{copy.study}</p>
          <h1>{copy.title}</h1>
          {copy.lead && <p>{copy.lead}</p>}
          <div className="survey-privacy">{copy.privacy}</div>
        </aside>

        <div className="survey-card">
          <div className="survey-progress-meta">
            <span>{question.section}</span>
            <span>{Math.min(100, Math.max(0, progress))}%</span>
          </div>
          <div className="survey-progress" aria-label={`${progress}% completado`}><i style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} /></div>

          <AnimatePresence mode="wait" initial={!reduceMotion}>
            <motion.div
              key={question.id}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {question.kind === "info" ? (
                <div className="survey-question survey-info">
                  <h2>{visibleLabel}</h2>
                  <p>{copy.sectionInfo}</p>
                </div>
              ) : (
                <fieldset className="survey-question">
                  <legend>{visibleLabel}</legend>
                  <QuestionControl question={question} survey={survey} copy={copy} answers={answers} setAnswer={setAnswer} toggleMultiple={toggleMultiple} reduceMotion={reduceMotion} />
                </fieldset>
              )}
            </motion.div>
          </AnimatePresence>

          {error && <p role="alert" className="survey-error">{error}</p>}
          <div className="survey-actions">
            <button type="button" onClick={goBack} className="survey-back" disabled={!history.length || submitting}>{copy.previous}</button>
            <motion.button type="button" onClick={advance} className="survey-next" disabled={submitting} whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>{submitting ? copy.sending : question.kind === "info" ? copy.next : `${copy.next} →`}</motion.button>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuestionControl({ question, survey, copy, answers, setAnswer, toggleMultiple, reduceMotion }: {
  question: SurveyQuestion;
  survey: SurveyQuestion[];
  copy: { department: string };
  answers: Record<string, Answer>;
  setAnswer: (id: string, value: Answer) => void;
  toggleMultiple: (option: SurveyOption) => void;
  reduceMotion: boolean | null;
}) {
  const currentValue = answers[question.id];
  const textValue = typeof currentValue === "string" ? currentValue : "";
  if (question.kind === "short" || question.kind === "number") {
    return <input className="survey-input" type={question.kind === "number" ? "number" : "text"} min={question.min} max={question.max} value={textValue} onChange={(event) => setAnswer(question.id, event.target.value)} autoFocus />;
  }
  if (question.kind === "long") {
    return <textarea className="survey-input survey-textarea" rows={5} value={textValue} onChange={(event) => setAnswer(question.id, event.target.value)} />;
  }
  if (question.kind === "department") {
    return <SurveySelect value={textValue} options={departments} placeholder={copy.department} onChange={(value) => setAnswer(question.id, value)} />;
  }
  const options = question.kind === "dynamic"
    ? asList(answers.situaciones).map((value) => survey.find((item) => item.id === "situaciones")?.options?.find((option) => option.value === value)).filter((option): option is SurveyOption => Boolean(option))
    : question.options ?? [];
  return (
    <div className={`survey-options ${options.length >= 6 ? "survey-options--dense" : options.length >= 4 ? "survey-options--grid" : ""}`}>
      {options.map((option, index) => {
        const selected = question.kind === "multiple" ? asList(answers[question.id]).includes(option.value) : answers[question.id] === option.value;
        return <motion.button type="button" key={option.value} onClick={() => question.kind === "multiple" ? toggleMultiple(option) : setAnswer(question.id, option.value)} className={`survey-option ${selected ? "is-selected" : ""}`} aria-pressed={selected} initial={reduceMotion ? false : { opacity: 0, scale: 0.99 }} animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.22, delay: reduceMotion ? 0 : index * 0.035 }} whileTap={reduceMotion ? undefined : { scale: 0.985 }}><span className="survey-option-check" aria-hidden="true">{selected ? "✓" : ""}</span>{option.label}</motion.button>;
      })}
    </div>
  );
}
