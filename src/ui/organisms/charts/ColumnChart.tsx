import type { Tone } from "@/ui/lib/tones";
import styles from "./Charts.styles";

type Column = { key: string; label: string; short: string; value: number };

type ColumnChartProps = {
  /** Qué mide la serie, para la tabla accesible y el tooltip ("Tareas creadas"). */
  measure: string;
  data: Column[];
  tone?: Tone;
  /** Cada cuántas columnas mostrar la etiqueta del eje. */
  labelEvery?: number;
};

/** Columnas de una sola serie con línea base, rejilla tenue y tooltip por columna. */
export function ColumnChart({ measure, data, tone = "blue", labelEvery = 1 }: ColumnChartProps) {
  const max = Math.max(1, ...data.map((item) => item.value));
  const top = Math.max(1, Math.ceil(max / 2) * 2);
  return (
    <figure className={styles.figure}>
      <div className={styles.columns} data-tone={tone} aria-hidden="true">
        <span className={[styles.gridLine, "bottom-full!"].filter(Boolean).join(" ")}  data-value={top} />
        <span className={[styles.gridLine, "bottom-1/2!"].filter(Boolean).join(" ")}  data-value={top / 2} />
        {data.map((item, index) => (
          <span key={item.key} className={styles.columnSlot} tabIndex={-1}>
            <span className={styles.column} style={{ height: `${(item.value / top) * 100}%` }} data-zero={item.value === 0 || undefined} />
            <span className={styles.tip}>
              <b>{item.value}</b> {measure.toLowerCase()} · {item.label}
            </span>
            <span className={styles.axisLabel}>{index % labelEvery === 0 || index === data.length - 1 ? item.short : ""}</span>
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{measure}</caption>
        <thead><tr><th scope="col">Fecha</th><th scope="col">{measure}</th></tr></thead>
        <tbody>{data.map((item) => <tr key={item.key}><th scope="row">{item.label}</th><td>{item.value}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}
