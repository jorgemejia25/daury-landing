import type { ButtonHTMLAttributes, ReactNode } from "react";

type SurveyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const variantClasses = {
  primary:
    "bg-[var(--survey-ink)] border-[var(--survey-ink)] text-[var(--survey-cream)] shadow-[0_18px_44px_-24px_rgba(61,58,80,0.48)]",
  secondary:
    "bg-[var(--survey-surface)] border-[var(--survey-border-strong)] text-[var(--survey-ink)]",
  ghost:
    "bg-transparent border-transparent text-[var(--survey-soft)]",
} as const;

export default function SurveyButton({
  children,
  variant = "primary",
  disabled,
  className,
  ...props
}: SurveyButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2.5 min-h-[46px] px-[18px] py-3 rounded-full border",
        "text-sm font-[650] leading-none",
        "transition-[transform,opacity,box-shadow] duration-300 ease-[var(--ease)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        className ?? "",
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}