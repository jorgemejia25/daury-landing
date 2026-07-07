import type { ButtonHTMLAttributes, ReactNode } from "react";

type SurveyOptionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  selected: boolean;
};

export default function SurveyOption({ children, selected, style, ...props }: SurveyOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        width: "100%",
        minHeight: 56,
        padding: "14px 16px",
        borderRadius: 18,
        border: "1px solid",
        borderColor: selected ? "var(--survey-accent)" : "var(--survey-border)",
        background: selected ? "var(--survey-accent-soft)" : "var(--survey-surface)",
        color: selected ? "var(--survey-accent-text)" : "var(--survey-ink)",
        textAlign: "left",
        boxShadow: selected ? "0 14px 36px -28px var(--survey-accent)" : "none",
        transition: "background 0.25s var(--ease), border-color 0.25s var(--ease), transform 0.25s var(--ease)",
        ...style,
      }}
      {...props}
    >
      <span style={{ lineHeight: 1.28 }}>{children}</span>
      <span
        aria-hidden
        style={{
          display: "grid",
          placeItems: "center",
          flex: "0 0 auto",
          width: 22,
          height: 22,
          borderRadius: 999,
          border: "1px solid",
          borderColor: selected ? "var(--survey-accent)" : "var(--survey-border-strong)",
          background: selected ? "var(--survey-accent)" : "transparent",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {selected ? "✓" : ""}
      </span>
    </button>
  );
}
