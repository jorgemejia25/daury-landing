import type { ReactNode } from "react";
import { cx, type Tone } from "@/ui/lib/tones";
import styles from "./Chip.styles";

type ChipProps = {
  children: ReactNode;
  tone?: Tone;
  /** Relleno sólido con texto blanco. */
  solid?: boolean;
  /** Punto de estado a la izquierda (color del tono). */
  dot?: boolean;
  icon?: ReactNode;
  size?: "sm" | "md";
  className?: string;
};

/** Píldora de estado o filtro ("Alta", "En curso", "Producto"). */
export function Chip({ children, tone = "neutral", solid = false, dot = false, icon, size = "md", className }: ChipProps) {
  return (
    <span className={cx(styles.chip, className)} data-tone={tone} data-solid={solid || undefined} data-size={size}>
      {dot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {icon}
      <span className={styles.text}>{children}</span>
    </span>
  );
}
