"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { submitCareSurvey } from "@/actions/submit-care-survey";
import {
  careChallengeOptions,
  emptyCareSurveyPayload,
  essentialFeatureOptions,
  interestOptions,
  organizationMethodOptions,
  trustConcernOptions,
  trustOptions,
  yesNoOptions,
  type CareSurveyPayload,
} from "@/lib/care-survey";
import SurveyButton from "../atoms/SurveyButton";
import SurveyPriceField from "../atoms/SurveyPriceField";
import SurveyTextField from "../atoms/SurveyTextField";
import SurveyChoiceGroup from "../molecules/SurveyChoiceGroup";
import SurveyNavigation from "../molecules/SurveyNavigation";
import SurveyQuestionFrame from "../molecules/SurveyQuestionFrame";

type StepId =
  | "intro"
  | "p3"
  | "p4"
  | "p5"
  | "p5Story"
  | "p6"
  | "p7"
  | "p8"
  | "p8Reason"
  | "p9"
  | "p10"
  | "p11"
  | "p12"
  | "p13";

type ProgressiveCareSurveyProps = {
  locale: string;
};

const stepMeta: Record<StepId, { tone: "mint" | "lavender" | "peach" | "sky" }> = {
  intro: { tone: "lavender" },
  p3: { tone: "mint" },
  p4: { tone: "mint" },
  p5: { tone: "mint" },
  p5Story: { tone: "mint" },
  p6: { tone: "lavender" },
  p7: { tone: "lavender" },
  p8: { tone: "peach" },
  p8Reason: { tone: "peach" },
  p9: { tone: "peach" },
  p10: { tone: "sky" },
  p11: { tone: "sky" },
  p12: { tone: "sky" },
  p13: { tone: "sky" },
};

const questionMotion = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 72 : -72,
    scale: 0.985,
    filter: "blur(6px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -72 : 72,
    scale: 0.985,
    filter: "blur(6px)",
  }),
};

type SurveyToneVars = CSSProperties & {
  "--survey-accent": string;
  "--survey-accent-soft": string;
  "--survey-accent-text": string;
};

const toneVars: Record<"mint" | "lavender" | "peach" | "sky", SurveyToneVars> = {
  mint: {
    "--survey-accent": "#6BBE95",
    "--survey-accent-soft": "#DCF2E6",
    "--survey-accent-text": "#4FA87D",
  },
  lavender: {
    "--survey-accent": "#A78BDF",
    "--survey-accent-soft": "#E9E3F7",
    "--survey-accent-text": "#8F6FD1",
  },
  peach: {
    "--survey-accent": "#F09B6E",
    "--survey-accent-soft": "#FFE8D9",
    "--survey-accent-text": "#E07E4D",
  },
  sky: {
    "--survey-accent": "#68A9D8",
    "--survey-accent-soft": "#DCEEFB",
    "--survey-accent-text": "#4A8CC0",
  },
};

function getVisibleSteps(data: CareSurveyPayload): StepId[] {
  const steps: StepId[] = ["intro", "p3", "p4", "p5"];

  if (data.hadIncident === "yes") {
    steps.push("p5Story");
  }

  steps.push("p6");

  if (data.appTrust === "no" || data.appTrust === "maybe") {
    steps.push("p7");
  }

  steps.push("p8");

  if (data.appInterest === "no") {
    steps.push("p8Reason");
    return steps;
  }

  if (data.appInterest === "yes" || data.appInterest === "maybe") {
    steps.push("p9", "p10", "p11", "p12", "p13");
  }

  return steps;
}

function hasOther(values: string[]) {
  return values.includes("other");
}

function isValidPrice(value: string) {
  return /^\d+$/.test(value.trim());
}

function validateStep(step: StepId, data: CareSurveyPayload) {
  if (step === "p3") {
    if (!data.organizationMethod) return "Elegí una opción para continuar.";
    if (data.organizationMethod === "other" && !data.organizationOther.trim()) return "Contanos cuál método usás.";
  }

  if (step === "p4") {
    if (data.careChallenges.length === 0) return "Elegí al menos un reto.";
    if (hasOther(data.careChallenges) && !data.careChallengesOther.trim()) return "Contanos cuál otro reto aparece.";
  }

  if (step === "p5" && !data.hadIncident) return "Elegí sí o no para continuar.";
  if (step === "p6" && !data.appTrust) return "Elegí una opción para continuar.";

  if (step === "p7") {
    if (data.trustConcerns.length === 0) return "Elegí al menos una razón.";
    if (hasOther(data.trustConcerns) && !data.trustConcernsOther.trim()) return "Contanos cuál otra razón te preocupa.";
  }

  if (step === "p8" && !data.appInterest) return "Elegí una opción para continuar.";
  if (step === "p8Reason" && !data.interestNoReason.trim()) return "Escribí una razón breve para cerrar esta respuesta.";

  if (step === "p9") {
    if (data.essentialFeatures.length === 0) return "Elegí al menos una función.";
    if (hasOther(data.essentialFeatures) && !data.essentialFeaturesOther.trim()) return "Contanos qué otra función sería indispensable.";
  }

  if (step === "p10" && !isValidPrice(data.priceTooExpensive)) return "Ingresá un precio mensual válido.";
  if (step === "p11" && !isValidPrice(data.priceExpensiveButPay)) return "Ingresá un precio mensual válido.";
  if (step === "p12" && !isValidPrice(data.priceBargain)) return "Ingresá un precio mensual válido.";
  if (step === "p13" && !isValidPrice(data.priceTooCheap)) return "Ingresá un precio mensual válido.";

  return null;
}

export default function ProgressiveCareSurvey({ locale }: ProgressiveCareSurveyProps) {
  const [data, setData] = useState<CareSurveyPayload>({ ...emptyCareSurveyPayload, locale });
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [direction, setDirection] = useState(1);

  const steps = useMemo(() => getVisibleSteps(data), [data]);
  const activeStepIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep = steps[activeStepIndex];
  const meta = stepMeta[currentStep];
  const isLastStep = activeStepIndex === steps.length - 1;

  const updateAnswer = <Key extends keyof CareSurveyPayload>(key: Key, value: CareSurveyPayload[Key]) => {
    setData((currentData) => ({ ...currentData, [key]: value }));
    setError(null);
  };

  const goBack = () => {
    setError(null);
    setDirection(-1);
    setStepIndex(Math.max(0, activeStepIndex - 1));
  };

  const goNext = async () => {
    const stepError = validateStep(currentStep, data);

    if (stepError) {
      setError(stepError);
      return;
    }

    if (!isLastStep) {
      setError(null);
      setDirection(1);
      setStepIndex(activeStepIndex + 1);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await submitCareSurvey({
      ...data,
      completedPath: steps,
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.error === "validation" ? "Revisá la respuesta actual antes de enviar." : "No se pudo guardar. Intentá de nuevo en un momento.");
      return;
    }

    setSent(true);
  };

  const restart = () => {
    setData({ ...emptyCareSurveyPayload, locale });
    setStepIndex(0);
    setError(null);
    setSent(false);
  };

  if (sent) {
    return (
      <div
        style={{
          ...toneVars.mint,
          display: "grid",
          gap: 24,
          padding: "clamp(28px, 5vw, 48px)",
          borderRadius: 28,
          border: "1px solid var(--survey-border)",
          background: "var(--survey-surface)",
          boxShadow: "0 30px 80px -46px rgba(61, 58, 80, 0.45)",
          backdropFilter: "blur(18px)",
        }}
      >
        <span className="eyebrow">Encuesta recibida</span>
        <h3 className="display" style={{ margin: 0, color: "var(--survey-ink)", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1 }}>
          Gracias por compartir tu experiencia.
        </h3>
        <p style={{ margin: 0, color: "var(--survey-soft)", maxWidth: 560 }}>
          Tus respuestas ayudan a entender mejor cómo se organiza el cuidado en casa y qué tendría que resolver Daury primero.
        </p>
        <div>
          <SurveyButton variant="secondary" onClick={restart}>
            Enviar otra respuesta
          </SurveyButton>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...toneVars[meta.tone],
        display: "grid",
        gap: 18,
      }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={questionMotion}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <SurveyQuestionFrame title={getQuestionTitle(currentStep)} helper={getQuestionHelper(currentStep)} error={error}>
            {renderQuestion(currentStep, data, updateAnswer)}
          </SurveyQuestionFrame>
        </motion.div>
      </AnimatePresence>
      <SurveyNavigation
        canGoBack={activeStepIndex > 0}
        isLastStep={isLastStep}
        loading={loading}
        nextLabel={currentStep === "intro" ? "Empezar" : undefined}
        onBack={goBack}
        onNext={goNext}
      />
    </div>
  );
}

function getQuestionTitle(step: StepId) {
  const titles: Record<StepId, string> = {
    intro: "Hola, gracias por ayudarnos.",
    p3: "¿Cómo organizas actualmente su cuidado?",
    p4: "¿Cuál es tu mayor reto al cuidarlo/a?",
    p5: "¿Has tenido algún incidente por falta de organización?",
    p5Story: "Cuéntanos brevemente qué pasó.",
    p6: "¿Confiarías en una aplicación para llevar el control del cuidado de tu familiar?",
    p7: "¿Por qué no confiarías del todo?",
    p8: "¿Te gustaría usar una app que te ayude a gestionar esto?",
    p8Reason: "¿Por qué no?",
    p9: "¿Qué función te parece indispensable?",
    p10: "¿Desde qué precio mensual te parecería demasiado cara?",
    p11: "¿Desde qué precio mensual dirías que es cara, pero aún la pagarías si te convence?",
    p12: "¿Desde qué precio mensual dirías que es muy accesible?",
    p13: "¿Desde qué precio mensual dudarías de la calidad por ser demasiado barata?",
  };

  return titles[step];
}

function getQuestionHelper(step: StepId) {
  const helpers: Partial<Record<StepId, string>> = {
    intro: "Queremos conocer tu experiencia y tus opiniones sobre cómo se vive el cuidado en casa. Tus respuestas nos ayudan a diseñar algo más claro, útil y realista para las familias.",
    p4: "Opción múltiple, elige hasta 2.",
    p5Story: "Opcional.",
    p6: "Medicamentos, citas, contactos de emergencia.",
    p7: "Opción múltiple.",
    p8Reason: "Respuesta abierta corta.",
    p9: "Elige máximo 3.",
    p10: "Escribe un número entero en quetzales.",
    p11: "Escribe un número entero en quetzales.",
    p12: "Escribe un número entero en quetzales.",
    p13: "Escribe un número entero en quetzales.",
  };

  return helpers[step];
}

function renderQuestion(
  step: StepId,
  data: CareSurveyPayload,
  updateAnswer: <Key extends keyof CareSurveyPayload>(key: Key, value: CareSurveyPayload[Key]) => void,
) {
  if (step === "intro") {
    return (
      <div style={{ display: "grid", gap: 12 }}>
        {["Responde con tranquilidad, una pregunta a la vez.", "No hay respuestas correctas o incorrectas.", "La encuesta toma pocos minutos."].map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 18,
              border: "1px solid var(--survey-border)",
              background: "var(--survey-surface)",
              color: "var(--survey-soft)",
              fontSize: 15,
              lineHeight: 1.4,
            }}
          >
            <span
              aria-hidden
              style={{
                flex: "0 0 auto",
                width: 9,
                height: 9,
                borderRadius: 999,
                background: "var(--survey-accent)",
                boxShadow: "0 0 0 4px var(--survey-accent-soft)",
              }}
            />
            {item}
          </div>
        ))}
      </div>
    );
  }

  if (step === "p3") {
    return (
      <>
        <SurveyChoiceGroup
          options={organizationMethodOptions}
          value={data.organizationMethod}
          onChange={(value) => updateAnswer("organizationMethod", value as string)}
        />
        {data.organizationMethod === "other" && (
          <SurveyTextField label="Otro método" value={data.organizationOther} onChange={(event) => updateAnswer("organizationOther", event.target.value)} />
        )}
      </>
    );
  }

  if (step === "p4") {
    return (
      <>
        <SurveyChoiceGroup
          options={careChallengeOptions}
          multiple
          maxSelections={2}
          values={data.careChallenges}
          onChange={(values) => updateAnswer("careChallenges", values as string[])}
        />
        {hasOther(data.careChallenges) && (
          <SurveyTextField label="Otro reto" value={data.careChallengesOther} onChange={(event) => updateAnswer("careChallengesOther", event.target.value)} />
        )}
      </>
    );
  }

  if (step === "p5") {
    return <SurveyChoiceGroup options={yesNoOptions} value={data.hadIncident} onChange={(value) => updateAnswer("hadIncident", value as CareSurveyPayload["hadIncident"])} />;
  }

  if (step === "p5Story") {
    return (
      <SurveyTextField
        multiline
        label="Qué pasó"
        value={data.incidentStory}
        onChange={(event) => updateAnswer("incidentStory", event.target.value)}
        placeholder="Medicamento olvidado, cita perdida, confusión con horarios..."
      />
    );
  }

  if (step === "p6") {
    return <SurveyChoiceGroup options={trustOptions} value={data.appTrust} onChange={(value) => updateAnswer("appTrust", value as CareSurveyPayload["appTrust"])} />;
  }

  if (step === "p7") {
    return (
      <>
        <SurveyChoiceGroup
          options={trustConcernOptions}
          multiple
          values={data.trustConcerns}
          onChange={(values) => updateAnswer("trustConcerns", values as string[])}
        />
        {hasOther(data.trustConcerns) && (
          <SurveyTextField label="Otra razón" value={data.trustConcernsOther} onChange={(event) => updateAnswer("trustConcernsOther", event.target.value)} />
        )}
      </>
    );
  }

  if (step === "p8") {
    return <SurveyChoiceGroup options={interestOptions} value={data.appInterest} onChange={(value) => updateAnswer("appInterest", value as CareSurveyPayload["appInterest"])} />;
  }

  if (step === "p8Reason") {
    return (
      <SurveyTextField
        multiline
        label="Razón"
        value={data.interestNoReason}
        onChange={(event) => updateAnswer("interestNoReason", event.target.value)}
        placeholder="Contanos brevemente qué te detendría."
      />
    );
  }

  if (step === "p9") {
    return (
      <>
        <SurveyChoiceGroup
          options={essentialFeatureOptions}
          multiple
          maxSelections={3}
          values={data.essentialFeatures}
          onChange={(values) => updateAnswer("essentialFeatures", values as string[])}
        />
        {hasOther(data.essentialFeatures) && (
          <SurveyTextField label="Otra función" value={data.essentialFeaturesOther} onChange={(event) => updateAnswer("essentialFeaturesOther", event.target.value)} />
        )}
      </>
    );
  }

  const priceFields: Partial<Record<StepId, keyof CareSurveyPayload>> = {
    p10: "priceTooExpensive",
    p11: "priceExpensiveButPay",
    p12: "priceBargain",
    p13: "priceTooCheap",
  };
  const field = priceFields[step];

  if (!field) return null;

  return (
    <SurveyPriceField
      value={data[field] as string}
      onChange={(value) => updateAnswer(field, value as CareSurveyPayload[typeof field])}
    />
  );
}
