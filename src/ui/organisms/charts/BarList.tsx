import type { Tone } from "@/ui/lib/tones";
import styles from "./Charts.styles";

type Bar = { key: string; label: string; value: number; /** Texto a la derecha ("3 de 8"). */ display?: string; tone?: Tone };

/** Barras horizontales con etiqueta directa y valor: comparar magnitudes entre pocas categorías. */
export function BarList({ measure, data, max, tone = "blue" }: { measure: string; data: Bar[]; max?: number; tone?: Tone }) {
  const top = max ?? Math.max(1, ...data.map((item) => item.value));
  return (
    <figure className={styles.figure}>
      <ul className={`m-0 p-0 list-none ${styles.bars}`} aria-label={measure}>
        {data.map((item) => (
          <li key={item.key} className={styles.barRow}>
            <span className={styles.barLabel}>{item.label}</span>
            <span className={styles.barValue}>{item.display ?? item.value}</span>
            <span className={styles.barTrack} aria-hidden="true">
              <span className={styles.bar} data-tone={item.tone ?? tone} style={{ width: `${Math.max(item.value ? 2 : 0, (item.value / top) * 100)}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
