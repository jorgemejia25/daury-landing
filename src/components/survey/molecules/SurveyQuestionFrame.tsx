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
    <article className="grid gap-[18px] min-h-[clamp(360px,58vh,460px)] p-[clamp(22px,3.2vw,34px)] rounded-[28px] border border-[var(--survey-border)] bg-[var(--survey-surface)] shadow-[0_30px_80px_-46px_rgba(61,58,80,0.45)] backdrop-blur-xl">
      <div className="grid gap-4 self-start">
        <div className="grid gap-2.5">
          <h3 className="display m-0 text-[var(--survey-ink)] text-[clamp(28px,3.5vw,44px)] leading-[1.02] tracking-[-0.02em] text-balance">
            {title}
          </h3>
          {helper && <p className="m-0 text-[var(--survey-soft)] text-[15px] leading-[1.5]">{helper}</p>}
        </div>
      </div>

      <div className="grid gap-4 self-center">
        {children}
        {error && (
          <p role="alert" className="m-0 text-[#C75E8A] text-sm leading-[1.45]">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}