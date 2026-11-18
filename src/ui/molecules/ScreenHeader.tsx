import type { ReactNode } from "react";
import styles from "./ScreenHeader.styles";

type ScreenHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Texto pequeño en mayúsculas sobre el título (fecha, contexto). */
  eyebrow?: ReactNode;
  /** Botón de volver u otro nodo a la izquierda. */
  back?: ReactNode;
  right?: ReactNode;
  size?: "large" | "compact";
  id?: string;
};

/** Encabezado de pantalla: título grande en Bricolage con acciones opcionales. */
export function ScreenHeader({ title, subtitle, eyebrow, back, right, size = "large", id }: ScreenHeaderProps) {
  return (
    <header className={styles.header} data-size={size}>
      {back ? <div className={styles.back}>{back}</div> : null}
      <div className={styles.text}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 id={id} className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {right ? <div className={styles.right}>{right}</div> : null}
    </header>
  );
}
