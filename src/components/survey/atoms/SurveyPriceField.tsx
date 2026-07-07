type SurveyPriceFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

export default function SurveyPriceField({ value, onChange }: SurveyPriceFieldProps) {
  return (
    <label style={{ display: "grid", gap: 10 }}>
      <span className="mono" style={{ color: "var(--survey-faint)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Monto mensual en quetzales
      </span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto minmax(0, 1fr)",
          alignItems: "center",
          minHeight: 68,
          borderRadius: 22,
          border: "1px solid var(--survey-border-strong)",
          background: "var(--survey-surface)",
          overflow: "hidden",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.4)",
        }}
      >
        <span
          aria-hidden
          style={{
            display: "grid",
            placeItems: "center",
            alignSelf: "stretch",
            minWidth: 64,
            borderRight: "1px solid var(--survey-border)",
            color: "var(--survey-accent-text)",
            background: "var(--survey-accent-soft)",
            fontSize: 22,
            fontWeight: 750,
          }}
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
          style={{
            width: "100%",
            minWidth: 0,
            border: 0,
            outline: 0,
            background: "transparent",
            color: "var(--survey-ink)",
            padding: "12px 18px",
            font: "inherit",
            fontSize: "clamp(28px, 6vw, 44px)",
            lineHeight: 1,
            fontWeight: 700,
          }}
        />
      </div>
      <span style={{ color: "var(--survey-faint)", fontSize: 13, lineHeight: 1.4 }}>
        Escribe solo números enteros, sin decimales.
      </span>
    </label>
  );
}
