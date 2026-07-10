"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { submitCareSurvey } from "@/actions/submit-care-survey";
import {
  careChallengeOptions,
  carePayerOptions,
  careTargetOptions,
  caredPersonAgeOptions,
  conditionDurationOptions,
  coordinationFrequencyOptions,
  discoveryChannelOptions,
  emptyCareSurveyPayload,
  essentialFeatureOptions,
  familyCaregiverOptions,
  interestOptions,
  interestRequirementOptions,
  organizationMethodOptions,
  trustConcernOptions,
  trustOptions,
  whatsappPreferenceOptions,
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
  | "p0"
  | "p1"
  | "p1Age"
  | "p2"
  | "p3"
  | "p4"
  | "p4App"
  | "p5"
  | "p5AppUse"
  | "p5AppName"
  | "p6"
  | "p6Story"
  | "p7"
  | "p7Details"
  | "p8"
  | "p9"
  | "p10"
  | "p11"
  | "p12"
  | "p12Extra"
  | "p13"
  | "p14"
  | "p15"
  | "p16"
  | "p17"
  | "p18"
  | "p19"
  | "p20"
  | "p21";

type ProgressiveCareSurveyProps = {
  locale: string;
};

const stepMeta: Record<StepId, { tone: "mint" | "lavender" | "peach" | "sky" }> = {
  intro: { tone: "lavender" },
  p0: { tone: "lavender" },
  p1: { tone: "mint" },
  p1Age: { tone: "mint" },
  p2: { tone: "mint" },
  p3: { tone: "mint" },
  p4: { tone: "mint" },
  p4App: { tone: "mint" },
  p5: { tone: "mint" },
  p5AppUse: { tone: "mint" },
  p5AppName: { tone: "mint" },
  p6: { tone: "lavender" },
  p6Story: { tone: "lavender" },
  p7: { tone: "lavender" },
  p7Details: { tone: "lavender" },
  p8: { tone: "peach" },
  p9: { tone: "peach" },
  p10: { tone: "peach" },
  p11: { tone: "sky" },
  p12: { tone: "sky" },
  p12Extra: { tone: "sky" },
  p13: { tone: "sky" },
  p14: { tone: "sky" },
  p15: { tone: "sky" },
  p16: { tone: "peach" },
  p17: { tone: "peach" },
  p18: { tone: "peach" },
  p19: { tone: "peach" },
  p20: { tone: "peach" },
  p21: { tone: "lavender" },
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
  if (data.hasManagedCare === "no") return ["intro", "p0"];

  const steps: StepId[] = ["intro", "p0"];

  if (data.hasManagedCare !== "yes") return steps;

  steps.push("p1", "p1Age");

  if (data.careTarget === "third_party") {
    steps.push("p2");
  }

  steps.push("p3", "p4");

  if (data.organizationMethod === "app") {
    steps.push("p4App");
  }

  steps.push("p5");

  if (hasOther(data.careChallenges)) {
    steps.push("p5AppUse");
    if (data.priorCareAppUse === "yes") {
      steps.push("p5AppName");
    }
  }

  steps.push("p6");

  if (data.hadIncident === "yes") {
    steps.push("p6Story");
  }

  steps.push("p7");

  if (data.currentlyPaysCare === "yes") {
    steps.push("p7Details");
  }

  steps.push("p8", "p9");

  if (data.appTrust === "no" || data.appTrust === "maybe") {
    steps.push("p10");
  }

  steps.push("p11");

  if (data.appInterest === "no" || data.appInterest === "maybe") {
    steps.push("p12", "p12Extra");
  }

  steps.push("p13", "p14", "p15");

  if (data.appInterest === "yes") {
    steps.push("p16", "p17", "p18", "p19", "p20");
  }

  steps.push("p21");
  return steps;
}

function hasOther(values: string[]) {
  return values.includes("other");
}

function isValidPrice(value: string) {
  return /^\d+$/.test(value.trim());
}

function isPersonalCare(data: CareSurveyPayload) {
  return data.careTarget === "personal";
}

function careNoun(data: CareSurveyPayload) {
  return isPersonalCare(data) ? "tu cuidado" : "su cuidado";
}

function careObject(data: CareSurveyPayload) {
  return isPersonalCare(data) ? "cuidarte" : "cuidarlo/a";
}

function validateStep(step: StepId, data: CareSurveyPayload) {
  if (step === "p0" && !data.hasManagedCare) return "Elegí una opción para continuar.";
  if (step === "p1" && !data.careTarget) return "Elegí una opción para continuar.";
  if (step === "p1Age" && !data.caredPersonAge) return "Elegí una opción para continuar.";
  if (step === "p2" && !data.familyCaregivers) return "Elegí una opción para continuar.";
  if (step === "p3" && !data.coordinationFrequency) return "Elegí una opción para continuar.";

  if (step === "p4") {
    if (!data.organizationMethod) return "Elegí una opción para continuar.";
    if (data.organizationMethod === "other" && !data.organizationOther.trim()) return "Contanos cuál método usaste.";
  }

  if (step === "p4App" && !data.organizationAppName.trim()) return "Contanos cuál app usaste.";

  if (step === "p5") {
    if (data.careChallenges.length === 0) return "Elegí al menos un reto.";
  }

  if (step === "p5AppUse" && !data.priorCareAppUse) return "Elegí sí o no para continuar.";
  if (step === "p5AppName" && !data.priorCareAppName.trim()) return "Contanos cuál app.";
  if (step === "p6" && !data.hadIncident) return "Elegí sí o no para continuar.";
  if (step === "p7" && !data.currentlyPaysCare) return "Elegí sí o no para continuar.";
  if (step === "p7Details" && !data.paidCareDetails.trim()) return "Contanos qué pagás y cuánto aproximadamente.";
  if (step === "p8" && !data.carePayer) return "Elegí una opción para continuar.";
  if (step === "p9" && !data.appTrust) return "Elegí una opción para continuar.";

  if (step === "p10") {
    if (data.trustConcerns.length === 0) return "Elegí al menos una razón.";
    if (hasOther(data.trustConcerns) && !data.trustConcernsOther.trim()) return "Contanos cuál otra razón te preocupa.";
  }

  if (step === "p11" && !data.appInterest) return "Elegí una opción para continuar.";

  if (step === "p12") {
    if (data.interestRequirements.length === 0) return "Elegí al menos una opción.";
    if (hasOther(data.interestRequirements) && !data.interestRequirementOther.trim()) return "Contanos qué otra cosa tendría que ofrecer.";
  }

  if (step === "p13" && !data.whatsappPreference) return "Elegí una opción para continuar.";

  if (step === "p14") {
    if (data.essentialFeatures.length === 0) return "Elegí al menos una función.";
    if (hasOther(data.essentialFeatures) && !data.essentialFeaturesOther.trim()) return "Contanos qué otra función sería indispensable.";
  }

  if (step === "p15") {
    if (!data.discoveryChannel) return "Elegí una opción para continuar.";
    if (data.discoveryChannel === "other" && !data.discoveryOther.trim()) return "Contanos dónde te habrías enterado.";
  }

  if (step === "p16" && !data.conditionDuration) return "Elegí una opción para continuar.";
  if (step === "p17" && !isValidPrice(data.priceTooExpensive)) return "Ingresá un precio mensual válido.";
  if (step === "p18" && !isValidPrice(data.priceExpensiveButPay)) return "Ingresá un precio mensual válido.";
  if (step === "p19" && !isValidPrice(data.priceBargain)) return "Ingresá un precio mensual válido.";
  if (step === "p20" && !isValidPrice(data.priceTooCheap)) return "Ingresá un precio mensual válido.";

  return null;
}

export default function ProgressiveCareSurvey({ locale }: ProgressiveCareSurveyProps) {
  const [data, setData] = useState<CareSurveyPayload>({ ...emptyCareSurveyPayload, locale });
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [screenedOut, setScreenedOut] = useState(false);
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

    if (currentStep === "p0" && data.hasManagedCare === "no") {
      setScreenedOut(true);
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
    setScreenedOut(false);
  };

  if (sent || screenedOut) {
    return (
      <div
        style={toneVars.mint}
        className="grid gap-6 p-[clamp(28px,5vw,48px)] rounded-[28px] border border-[var(--survey-border)] bg-[var(--survey-surface)] shadow-[0_30px_80px_-46px_rgba(61,58,80,0.45)] backdrop-blur-xl"
      >
        <span className="eyebrow">{sent ? "Encuesta recibida" : "Gracias por tu tiempo"}</span>
        <h3 className="display m-0 text-[var(--survey-ink)] text-[clamp(36px,5vw,64px)] leading-none">
          {sent ? "Gracias por compartir tu experiencia." : "Gracias, esta encuesta es para personas que administraron algún cuidado."}
        </h3>
        <p className="m-0 text-[var(--survey-soft)] max-w-[560px]">
          {sent
            ? "Tus respuestas ayudan a entender mejor cómo se organiza el cuidado en casa y qué tendría que resolver Daury primero."
            : "Igual nos ayuda saber que pasaste por aquí. Si en otro momento querés responder por una experiencia de cuidado, podés volver a empezar."}
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
    <div style={toneVars[meta.tone]} className="grid gap-[18px]">
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
          <SurveyQuestionFrame title={getQuestionTitle(currentStep, data)} helper={getQuestionHelper(currentStep)} error={error}>
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

function getQuestionTitle(step: StepId, data: CareSurveyPayload) {
  const titles: Record<StepId, string> = {
    intro: "Hola, gracias por ayudarnos.",
    p0: "¿Has administrado el cuidado de una persona?",
    p1: "¿El cuidado que llevaste fue personal o para alguien más?",
    p1Age: isPersonalCare(data) ? "¿Qué edad aproximada tenías durante ese cuidado?" : "¿Qué edad aproximada tenía la persona cuidada?",
    p2: "¿Cuántas personas participaron activamente en ese cuidado?",
    p3: "¿Con qué frecuencia se presentaba la necesidad de coordinar algo?",
    p4: `¿Cómo administraste ${careNoun(data)}?`,
    p4App: "¿Cuál app usaste?",
    p5: `¿Cuál fue tu mayor reto al ${careObject(data)}?`,
    p5AppUse: "¿Conocías o has usado alguna aplicación de este tipo antes?",
    p5AppName: "¿Cuál?",
    p6: "¿Tuviste algún incidente por falta de organización?",
    p6Story: "Contanos brevemente qué pasó.",
    p7: `¿Actualmente pagas por algo relacionado a ${careNoun(data)}?`,
    p7Details: "¿Qué pagas y cuánto aproximadamente?",
    p8: "Si hubiera un costo mensual por una herramienta que te ayudara con esto, ¿quién en la familia lo cubriría típicamente?",
    p9: "¿Habrías confiado en una aplicación para llevar el control del cuidado?",
    p10: "¿Por qué no habrías confiado del todo?",
    p11: `¿Te habría gustado usar una app que te ayudara a gestionar ${careNoun(data)}?`,
    p12: '¿Qué tendría que ofrecerte esta app para que tu respuesta fuera "Sí"?',
    p12Extra: "¿Algo más que quieras agregar sobre por qué no?",
    p13: "¿Usarías WhatsApp para recibir recordatorios o compartir información de cuidado, en lugar de una app aparte?",
    p14: "¿Qué función te habría parecido indispensable?",
    p15: "¿Cómo te habrías enterado de una app así?",
    p16: "¿El cuidado era por una condición temporal o de largo plazo?",
    p17: "¿Desde qué precio mensual te habría parecido demasiado cara?",
    p18: "¿Desde qué precio mensual habrías dicho que era cara, pero aún la pagarías si te convencía?",
    p19: "¿Desde qué precio mensual habrías dicho que era muy accesible?",
    p20: "¿Desde qué precio mensual habrías dudado de la calidad por ser demasiado barata?",
    p21: isPersonalCare(data)
      ? "¿Hay algo de tu experiencia cuidándote que no cubrimos en esta encuesta y creas que deberíamos saber?"
      : "¿Hay algo de tu experiencia cuidando a alguien que no cubrimos en esta encuesta y creas que deberíamos saber?",
  };

  return titles[step];
}

function getQuestionHelper(step: StepId) {
  const helpers: Partial<Record<StepId, string>> = {
    intro: "Queremos saber cómo llevaste el cuidado de una persona: puede haber sido tu cuidado personal, en casa, en un consultorio o dentro de una institución.",
    p0: "Medicamentos, citas médicas, rutinas diarias. Recordá que tu propio cuidado también cuenta.",
    p3: "Medicamento, cita médica o indicación del profesional.",
    p5: "Podés seleccionar varias opciones.",
    p6Story: "Opcional.",
    p7: "App, cuidadora, enfermera a domicilio o servicio similar.",
    p9: "Medicamentos, citas, contactos de emergencia.",
    p10: "Podés seleccionar varias opciones.",
    p12: "Podés seleccionar varias opciones.",
    p12Extra: "Opcional.",
    p14: "Podés seleccionar varias opciones.",
    p17: "Escribe un número entero en quetzales.",
    p18: "Escribe un número entero en quetzales.",
    p19: "Escribe un número entero en quetzales.",
    p20: "Escribe un número entero en quetzales.",
    p21: "Opcional.",
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
      <div className="grid gap-3">
        {["Respondé con tranquilidad, una pregunta a la vez.", "No hay respuestas correctas o incorrectas.", "La encuesta dura pocos minutos."].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 px-3.5 py-3 rounded-[18px] border border-[var(--survey-border)] bg-[var(--survey-surface)] text-[var(--survey-ink)] text-[15px] font-medium leading-[1.4]"
          >
            <span
              aria-hidden
              className="flex-none w-[9px] h-[9px] rounded-full bg-[var(--survey-accent)] shadow-[0_0_0_4px_var(--survey-accent-soft)]"
            />
            {item}
          </div>
        ))}
      </div>
    );
  }

  if (step === "p0") {
    return <SurveyChoiceGroup options={yesNoOptions} value={data.hasManagedCare} onChange={(value) => updateAnswer("hasManagedCare", value as CareSurveyPayload["hasManagedCare"])} />;
  }

  if (step === "p1") {
    return (
      <SurveyChoiceGroup
        options={careTargetOptions}
        value={data.careTarget}
        onChange={(value) => updateAnswer("careTarget", value as string)}
      />
    );
  }

  if (step === "p1Age") {
    return (
      <SurveyChoiceGroup
        options={caredPersonAgeOptions}
        value={data.caredPersonAge}
        onChange={(value) => updateAnswer("caredPersonAge", value as string)}
      />
    );
  }

  if (step === "p2") {
    return (
      <SurveyChoiceGroup
        options={familyCaregiverOptions}
        value={data.familyCaregivers}
        onChange={(value) => updateAnswer("familyCaregivers", value as string)}
      />
    );
  }

  if (step === "p3") {
    return (
      <SurveyChoiceGroup
        options={coordinationFrequencyOptions}
        value={data.coordinationFrequency}
        onChange={(value) => updateAnswer("coordinationFrequency", value as string)}
      />
    );
  }

  if (step === "p4") {
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

  if (step === "p4App") {
    return <SurveyTextField label="App utilizada" value={data.organizationAppName} onChange={(event) => updateAnswer("organizationAppName", event.target.value)} />;
  }

  if (step === "p5") {
    return (
      <SurveyChoiceGroup
        options={careChallengeOptions}
        multiple
        values={data.careChallenges}
        onChange={(values) => updateAnswer("careChallenges", values as string[])}
      />
    );
  }

  if (step === "p5AppUse") {
    return <SurveyChoiceGroup options={yesNoOptions} value={data.priorCareAppUse} onChange={(value) => updateAnswer("priorCareAppUse", value as CareSurveyPayload["priorCareAppUse"])} />;
  }

  if (step === "p5AppName") {
    return <SurveyTextField label="Nombre de la app" value={data.priorCareAppName} onChange={(event) => updateAnswer("priorCareAppName", event.target.value)} />;
  }

  if (step === "p6") {
    return <SurveyChoiceGroup options={yesNoOptions} value={data.hadIncident} onChange={(value) => updateAnswer("hadIncident", value as CareSurveyPayload["hadIncident"])} />;
  }

  if (step === "p6Story") {
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

  if (step === "p7") {
    return <SurveyChoiceGroup options={yesNoOptions} value={data.currentlyPaysCare} onChange={(value) => updateAnswer("currentlyPaysCare", value as CareSurveyPayload["currentlyPaysCare"])} />;
  }

  if (step === "p7Details") {
    return <SurveyTextField label="Pago aproximado" value={data.paidCareDetails} onChange={(event) => updateAnswer("paidCareDetails", event.target.value)} />;
  }

  if (step === "p8") {
    return <SurveyChoiceGroup options={carePayerOptions} value={data.carePayer} onChange={(value) => updateAnswer("carePayer", value as string)} />;
  }

  if (step === "p9") {
    return <SurveyChoiceGroup options={trustOptions} value={data.appTrust} onChange={(value) => updateAnswer("appTrust", value as CareSurveyPayload["appTrust"])} />;
  }

  if (step === "p10") {
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

  if (step === "p11") {
    return <SurveyChoiceGroup options={interestOptions} value={data.appInterest} onChange={(value) => updateAnswer("appInterest", value as CareSurveyPayload["appInterest"])} />;
  }

  if (step === "p12") {
    return (
      <>
        <SurveyChoiceGroup
          options={interestRequirementOptions}
          multiple
          values={data.interestRequirements}
          onChange={(values) => updateAnswer("interestRequirements", values as string[])}
        />
        {hasOther(data.interestRequirements) && (
          <SurveyTextField label="Otra condición" value={data.interestRequirementOther} onChange={(event) => updateAnswer("interestRequirementOther", event.target.value)} />
        )}
      </>
    );
  }

  if (step === "p12Extra") {
    return (
      <SurveyTextField
        multiline
        label="Comentario adicional"
        value={data.interestNoReason}
        onChange={(event) => updateAnswer("interestNoReason", event.target.value)}
        placeholder="Contanos brevemente qué te detendría."
      />
    );
  }

  if (step === "p13") {
    return <SurveyChoiceGroup options={whatsappPreferenceOptions} value={data.whatsappPreference} onChange={(value) => updateAnswer("whatsappPreference", value as string)} />;
  }

  if (step === "p14") {
    return (
      <>
        <SurveyChoiceGroup
          options={essentialFeatureOptions}
          multiple
          values={data.essentialFeatures}
          onChange={(values) => updateAnswer("essentialFeatures", values as string[])}
        />
        {hasOther(data.essentialFeatures) && (
          <SurveyTextField label="Otra función" value={data.essentialFeaturesOther} onChange={(event) => updateAnswer("essentialFeaturesOther", event.target.value)} />
        )}
      </>
    );
  }

  if (step === "p15") {
    return (
      <>
        <SurveyChoiceGroup
          options={discoveryChannelOptions}
          value={data.discoveryChannel}
          onChange={(value) => updateAnswer("discoveryChannel", value as string)}
        />
        {data.discoveryChannel === "other" && (
          <SurveyTextField label="Otro canal" value={data.discoveryOther} onChange={(event) => updateAnswer("discoveryOther", event.target.value)} />
        )}
      </>
    );
  }

  if (step === "p16") {
    return <SurveyChoiceGroup options={conditionDurationOptions} value={data.conditionDuration} onChange={(value) => updateAnswer("conditionDuration", value as string)} />;
  }

  if (step === "p21") {
    return (
      <SurveyTextField
        multiline
        label="Experiencia adicional"
        value={data.closingExperience}
        onChange={(event) => updateAnswer("closingExperience", event.target.value)}
        placeholder="Cualquier detalle que creás importante..."
      />
    );
  }

  const priceFields: Partial<Record<StepId, keyof CareSurveyPayload>> = {
    p17: "priceTooExpensive",
    p18: "priceExpensiveButPay",
    p19: "priceBargain",
    p20: "priceTooCheap",
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
