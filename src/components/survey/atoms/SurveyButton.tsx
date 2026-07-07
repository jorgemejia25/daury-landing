import type { ButtonHTMLAttributes, ReactNode } from "react";

type SurveyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const variantStyles = {
  primary: {
    background: "var(--survey-ink)",
    borderColor: "var(--survey-ink)",
    color: "var(--survey-cream)",
    boxShadow: "0 18px 44px -24px rgba(61, 58, 80, 0.48)",
  },
  secondary: {
    background: "var(--survey-surface)",
    borderColor: "var(--survey-border-strong)",
    color: "var(--survey-ink)",
    boxShadow: "none",
  },
  ghost: {
    background: "transparent",
    borderColor: "transparent",
    color: "var(--survey-soft)",
    boxShadow: "none",
  },
};

export default function SurveyButton({
  children,
  variant = "primary",
  disabled,
  style,
  ...props
}: SurveyButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        minHeight: 46,
        padding: "12px 18px",
        borderRadius: 999,
        border: "1px solid",
        fontSize: 14,
        fontWeight: 650,
        lineHeight: 1,
        transition: "transform 0.25s var(--ease), opacity 0.25s var(--ease), box-shadow 0.25s var(--ease)",
        opacity: disabled ? 0.48 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
