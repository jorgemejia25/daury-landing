type SurveyPriceFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

export default function SurveyPriceField({ value, onChange }: SurveyPriceFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="mono text-[var(--survey-faint)] text-[11px] tracking-[0.12em] uppercase">
        Monto mensual en quetzales
      </span>
      <div className="relative">
        <span
          aria-hidden
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--survey-soft)] font-[inherit] text-[15px]"
        >
          Q
        </span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(onlyDigits(event.target.value))}
          placeholder="0"
          aria-label="Monto mensual en quetzales"
          className="w-full min-h-[50px] border border-[var(--survey-border-strong)] bg-[var(--survey-surface)] text-[var(--survey-ink)] outline-none font-[inherit] text-[15px] leading-[1.45] rounded-full px-4 py-3 pl-[30px] transition-[border-color,box-shadow] duration-300 ease-[var(--ease)]"
        />
      </div>
    </label>
  );
}