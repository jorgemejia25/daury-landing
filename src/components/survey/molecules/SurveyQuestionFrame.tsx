import type { ReactNode } from "react";

type SurveyQuestionFrameProps = {
  title: string;
  helper?: string;
  error?: string | null;
  children: ReactNode;
};

export default function SurveyQuestionFrame({
  title,
  helper,
  error,
  children,
}: SurveyQuestionFrameProps) {
  return (
    <article
      style={{
        display: "grid",
        gap: 18,
        minHeight: "clamp(360px, 58vh, 460px)",
        padding: "clamp(22px, 3.2vw, 34px)",
        borderRadius: 28,
        border: "1px solid var(--survey-border)",
        background: "var(--survey-surface)",
        boxShadow: "0 30px 80px -46px rgba(61, 58, 80, 0.45)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div style={{ display: "grid", gap: 16, alignSelf: "start" }}>
        <div style={{ display: "grid", gap: 10 }}>
          <h3
            className="display"
            style={{
              margin: 0,
              color: "var(--survey-ink)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              textWrap: "balance",
            }}
          >
            {title}
          </h3>
          {helper && <p style={{ margin: 0, color: "var(--survey-soft)", fontSize: 15, lineHeight: 1.5 }}>{helper}</p>}
        </div>
      </div>

      <div style={{ display: "grid", gap: 16, alignSelf: "center" }}>
        {children}
        {error && (
          <p role="alert" style={{ margin: 0, color: "#C75E8A", fontSize: 14, lineHeight: 1.45 }}>
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
