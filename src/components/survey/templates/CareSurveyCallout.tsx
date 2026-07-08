"use client";

import type { Ref } from "react";
import Link from "next/link";
import { useReveal } from "@/hooks/useDaury";

type CareSurveyCalloutProps = {
  locale: string;
};

export default function CareSurveyCallout({ locale }: CareSurveyCalloutProps) {
  const [ref, seen] = useReveal({ threshold: 0.14 });

  return (
    <section id="survey-invite" ref={ref as Ref<HTMLElement>} className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[16%_-10%_auto_auto] w-[420px] h-[420px] rounded-full bg-[#E9E3F7] blur-[90px] opacity-40"
      />
      <div className="container">
        <div
          className={[
            "survey-callout grid grid-cols-1 items-start sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end gap-8 sm:gap-8",
            "p-[clamp(28px,5vw,56px)] rounded-[28px] border border-[var(--survey-border)] bg-[var(--survey-surface)] backdrop-blur-xl",
            "shadow-[0_30px_80px_-48px_rgba(61,58,80,0.5)]",
            "transition-[opacity,transform] duration-[550ms] ease-[var(--ease)]",
            seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ].join(" ")}
        >
          <div className="grid gap-[18px]">
            <span className="eyebrow">Encuesta</span>
            <h2
              className="display m-0 text-[var(--survey-ink)] text-[clamp(36px,5vw,70px)] leading-[0.98] tracking-[-0.03em] max-w-[820px] text-balance"
            >
              Ayúdanos a entender cómo se organiza el cuidado en casa.
            </h2>
            <p className="m-0 text-[var(--survey-soft)] max-w-[620px] text-[17px] leading-[1.55]">
              La encuesta se abre en una página aparte para responder sin distracciones.
            </p>
          </div>

          <Link href={`/${locale}/encuesta`} className="btn btn-primary justify-self-start px-6 py-4">
            Responder encuesta
            <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}