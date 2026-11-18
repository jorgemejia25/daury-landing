import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "@/ui/lib/tones";
import styles from "./Card.styles";

type CardProps = HTMLAttributes<HTMLElement> & {
  /** Fondo: `surface` (blanco) por defecto. */
  tone?: "surface" | "soft" | "blue" | "ink" | "warm" | "amber";
  /** Padding interior: `none` para listas con filas a sangre. */
  padding?: "none" | "sm" | "md" | "lg";
  as?: ElementType;
  children: ReactNode;
};

/** Tarjeta base: fondo blanco, radio 24 y sombra suave. */
export function Card({ tone = "surface", padding = "md", as: Tag = "div", className, children, ...rest }: CardProps) {
  return (
    <Tag {...rest} className={cx("relative min-w-0 overflow-hidden border border-solid border-rule rounded-[var(--r-xl)] bg-surface text-ink shadow-[var(--shadow-soft)]", styles.card, className)} data-tone={tone} data-padding={padding}>
      {children}
    </Tag>
  );
}

/** Línea divisoria entre filas dentro de una Card. */
export function Divider({ inset = 0 }: { inset?: number }) {
  return <hr className={styles.divider} style={{ marginInline: inset }} />;
}
