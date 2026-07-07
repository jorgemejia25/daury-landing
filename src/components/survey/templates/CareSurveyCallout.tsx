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
    <section id="survey-invite" ref={ref as Ref<HTMLElement>} style={{ position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "16% -10% auto auto",
          width: 420,
          height: 420,
          borderRadius: 999,
          background: "#E9E3F7",
          filter: "blur(90px)",
          opacity: 0.42,
        }}
      />
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: 32,
            alignItems: "end",
            padding: "clamp(28px, 5vw, 56px)",
            borderRadius: 28,
            border: "1px solid var(--survey-border)",
            background: "var(--survey-surface)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 30px 80px -48px rgba(61, 58, 80, 0.5)",
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.55s var(--ease), transform 0.55s var(--ease)",
          }}
          className="survey-callout"
        >
          <div style={{ display: "grid", gap: 18 }}>
            <span className="eyebrow">Encuesta</span>
            <h2
              className="display"
              style={{
                margin: 0,
                color: "var(--survey-ink)",
                fontSize: "clamp(36px, 5vw, 70px)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
                maxWidth: 820,
                textWrap: "balance",
              }}
            >
              Ayúdanos a entender cómo se organiza el cuidado en casa.
            </h2>
            <p style={{ margin: 0, color: "var(--survey-soft)", maxWidth: 620, fontSize: 17, lineHeight: 1.55 }}>
              La encuesta se abre en una página aparte para responder sin distracciones.
            </p>
          </div>

          <Link href={`/${locale}/encuesta`} className="btn btn-primary" style={{ padding: "16px 24px", justifySelf: "start" }}>
            Responder encuesta
            <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .survey-callout {
            grid-template-columns: 1fr !important;
            align-items: start !important;
          }
        }
      `}</style>
    </section>
  );
}
