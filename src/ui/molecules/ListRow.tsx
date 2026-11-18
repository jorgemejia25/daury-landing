import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/ui/lib/tones";
import styles from "./ListRow.styles";

type ListRowProps = {
  /** Nodo izquierdo, normalmente un `IconTile`. */
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Nodo derecho (valor, chip). Si se omite y hay `href`, se muestra un chevron. */
  trailing?: ReactNode;
  chevron?: boolean;
  href?: string;
  onClick?: () => void;
  /** Línea superior para apilar filas dentro de una Card. */
  divider?: boolean;
  /** Nivel del título cuando la fila encabeza contenido. */
  titleAs?: "span" | "h2" | "h3";
  className?: string;
};

/** Fila estándar: tile + título + meta + acción derecha. */
export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  chevron,
  href,
  onClick,
  divider = false,
  titleAs: Title = "span",
  className,
}: ListRowProps) {
  const showChevron = chevron ?? (Boolean(href) && trailing === undefined);
  const body = (
    <>
      {leading}
      <span className={styles.text}>
        <Title className={styles.title}>{title}</Title>
        {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
      </span>
      {trailing}
      {showChevron ? <ChevronRight className={styles.chevron} size={22} strokeWidth={2} aria-hidden="true" /> : null}
    </>
  );
  const classes = cx(styles.row, divider && styles.divider, (href || onClick) && styles.interactive, className);
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {body}
      </Link>
    );
  }
  return <div className={classes}>{body}</div>;
}

/** Clase de fila para disparadores de UI SDK con el mismo aspecto. */
export const listRowClasses = { row: styles.row, interactive: styles.interactive, divider: styles.divider, text: styles.text, title: styles.title, subtitle: styles.subtitle, chevron: styles.chevron };
