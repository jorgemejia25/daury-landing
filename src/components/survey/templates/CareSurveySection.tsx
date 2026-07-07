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
      className="survey-section"
      style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "grid", alignItems: "center", padding: "clamp(72px, 8vw, 104px) 0 clamp(40px, 6vw, 72px)" }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 460,
          height: 460,
          left: "min(8vw, 120px)",
          top: 60,
          borderRadius: 999,
          background: "#E9E3F7",
          filter: "blur(86px)",
          opacity: 0.56,
          animation: "surveyFloatA 16s var(--ease) infinite alternate",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          right: "min(5vw, 90px)",
          bottom: 60,
          borderRadius: 999,
          background: "#DCF2E6",
          filter: "blur(88px)",
          opacity: 0.5,
          animation: "surveyFloatB 18s var(--ease) infinite alternate",
        }}
      />

      <div className="container">
        <div
          className="survey-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 0.76fr) minmax(360px, 1fr)",
            gap: "clamp(28px, 5vw, 64px)",
            alignItems: "center",
            opacity: seen ? 1 : 0,
            transform: seen ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.55s var(--ease), transform 0.55s var(--ease)",
          }}
        >
          <div style={{ display: "grid", gap: 16, position: "sticky", top: 88, alignSelf: "center" }}>
            <h2
              className="display"
              style={{
                margin: 0,
                color: "var(--survey-ink)",
                fontSize: "clamp(34px, 5vw, 62px)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
                textWrap: "balance",
              }}
            >
              Cuidado en casa, con menos carga mental.
            </h2>
            <div
              style={{
                display: "grid",
                gap: 10,
                padding: "clamp(12px, 1.6vw, 18px)",
                borderRadius: 24,
                border: "1px solid var(--survey-border)",
                background: "var(--survey-surface)",
                boxShadow: "0 28px 70px -54px rgba(61, 58, 80, 0.52)",
                backdropFilter: "blur(18px)",
              }}
            >
              <img
                src={medicalCareIllustration.src}
                alt=""
                aria-hidden
                style={{
                  width: "100%",
                  maxHeight: 280,
                  objectFit: "contain",
                  filter: "drop-shadow(0 24px 34px rgba(61, 58, 80, 0.12))",
                  animation: "surveyImageFloat 7s var(--ease) infinite alternate",
                }}
              />
              <a
                href="https://storyset.com/health"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--survey-faint)", fontSize: 12, justifySelf: "center" }}
              >
                Health illustrations by Storyset
              </a>
            </div>
          </div>

          <ProgressiveCareSurvey locale={locale} />
        </div>
      </div>

      <style>{`
        @keyframes surveyFloatA {
          from { transform: translate3d(-18px, -12px, 0) scale(0.98); }
          to { transform: translate3d(34px, 28px, 0) scale(1.04); }
        }

        @keyframes surveyFloatB {
          from { transform: translate3d(28px, 18px, 0) scale(1); }
          to { transform: translate3d(-24px, -26px, 0) scale(1.05); }
        }

        @keyframes surveyImageFloat {
          from { transform: translate3d(0, 6px, 0) rotate(-0.8deg); }
          to { transform: translate3d(0, -10px, 0) rotate(0.8deg); }
        }

        @media (max-width: 1024px) {
          .survey-layout {
            grid-template-columns: 1fr !important;
            align-items: start !important;
          }

          .survey-layout > div:first-child {
            position: static !important;
            max-width: 620px;
            margin: 0 auto;
          }
        }

        @media (max-width: 640px) {
          .survey-section {
            padding-top: 72px !important;
            padding-bottom: 52px !important;
          }
        }
      `}</style>
    </section>
  );
}
