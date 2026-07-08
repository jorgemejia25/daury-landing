"use client";

import type { Ref } from "react";
import medicalCareIllustration from "@/assets/Medical care-cuate.svg";
import { useReveal } from "@/hooks/useDaury";
import ProgressiveCareSurvey from "../organisms/ProgressiveCareSurvey";

type CareSurveySectionProps = {
  locale: string;
};

export default function CareSurveySection({ locale }: CareSurveySectionProps) {
  const [ref, seen] = useReveal({ threshold: 0.12 });

  return (
    <section
      id="survey"
      ref={ref as Ref<HTMLElement>}
      className="survey-section relative overflow-hidden min-h-screen grid items-center pt-[72px] pb-[52px] sm:pt-[clamp(72px,8vw,104px)] sm:pb-[clamp(40px,6vw,72px)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute w-[460px] h-[460px] left-[min(8vw,120px)] top-[60px] rounded-full bg-[#E9E3F7] blur-[86px] opacity-55 animate-[surveyFloatA_16s_var(--ease)_infinite_alternate]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute w-[420px] h-[420px] right-[min(5vw,90px)] bottom-[60px] rounded-full bg-[#DCF2E6] blur-[88px] opacity-50 animate-[surveyFloatB_18s_var(--ease)_infinite_alternate]"
      />

      <div className="container">
        <div
          className={[
            "survey-layout grid grid-cols-1 items-start gap-[clamp(28px,5vw,64px)]",
            "lg:grid-cols-[minmax(280px,0.76fr)_minmax(360px,1fr)] lg:items-center",
            "transition-[opacity,transform] duration-[550ms] ease-[var(--ease)]",
            seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
        >
          <div className="grid gap-4 max-w-[620px] mx-auto lg:sticky lg:top-[88px] lg:max-w-none lg:self-center">
            <h2 className="display m-0 text-[var(--survey-ink)] text-[clamp(34px,5vw,62px)] leading-[0.98] tracking-[-0.03em] text-balance">
              Cuidado en casa, con menos carga mental.
            </h2>
            <div className="grid gap-2.5 p-[clamp(12px,1.6vw,18px)] rounded-3xl border border-[var(--survey-border)] bg-[var(--survey-surface)] shadow-[0_28px_70px_-54px_rgba(61,58,80,0.52)] backdrop-blur-xl">
              <img
                src={medicalCareIllustration.src}
                alt=""
                aria-hidden
                className="w-full max-h-[280px] object-contain drop-shadow-[0_24px_34px_rgba(61,58,80,0.12)] animate-[surveyImageFloat_7s_var(--ease)_infinite_alternate]"
              />
              <a
                href="https://storyset.com/health"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--survey-faint)] text-xs justify-self-center"
              >
                Health illustrations by Storyset
              </a>
            </div>
          </div>

          <ProgressiveCareSurvey locale={locale} />
        </div>
      </div>
    </section>
  );
}