import type { ButtonHTMLAttributes, ReactNode } from "react";

type SurveyOptionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  selected: boolean;
};

export default function SurveyOption({ children, selected, disabled, className, style, ...props }: SurveyOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      style={style}
      className={[
        "flex items-center justify-between gap-3.5 w-full min-h-[56px] px-4 py-3.5 rounded-[18px] text-left",
        "border transition-[background,border-color,transform] duration-300 ease-[var(--ease)]",
        selected
          ? "border-[var(--survey-accent)] bg-[var(--survey-accent-soft)] text-[var(--survey-accent-text)] shadow-[0_14px_36px_-28px_var(--survey-accent)]"
          : "border-[var(--survey-border)] bg-[var(--survey-surface)] text-[var(--survey-ink)]",
        disabled ? "opacity-45 cursor-not-allowed" : "cursor-pointer",
        className ?? "",
      ].join(" ")}
      {...props}
    >
      <span className="leading-[1.28]">{children}</span>
      <span
        aria-hidden
        className={[
          "grid place-items-center flex-none w-[22px] h-[22px] rounded-full border text-white text-[13px] font-bold",
          selected
            ? "border-[var(--survey-accent)] bg-[var(--survey-accent)]"
            : "border-[var(--survey-border-strong)] bg-transparent",
        ].join(" ")}
      >
        {selected ? "✓" : ""}
      </span>
    </button>
  );
}