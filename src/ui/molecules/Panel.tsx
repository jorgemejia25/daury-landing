import type { ElementType, ReactNode } from "react";
import { cx } from "@/ui/lib/tones";
import styles from "./Panel.styles";

type PanelProps = {
  /** Título de la cabecera. Sin título, el panel no muestra cabecera. */
  title?: ReactNode;
  /** Texto secundario bajo el título. */
  note?: ReactNode;
  /** Acción o valor a la derecha de la cabecera. */
  action?: ReactNode;
  /** `none`: el contenido va a sangre (listas con filas). */
  padding?: "none" | "md";
  as?: ElementType;
  titleAs?: "h2" | "h3";
  id?: string;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

/** Superficie con cabecera fija (título, nota y acción) y cuerpo: el bloque base de las páginas del admin. */
export function Panel({ title, note, action, padding = "md", as: Tag = "section", titleAs: Title = "h2", id, className, bodyClassName, children }: PanelProps) {
  return (
    <Tag className={cx(styles.panel, className)} aria-labelledby={title && id ? id : undefined}>
      {title ? (
        <header className={styles.head}>
          <div className={styles.headText}>
            <Title id={id} className={styles.title}>{title}</Title>
            {note ? <p className={styles.note}>{note}</p> : null}
          </div>
          {action ? <div className={styles.action}>{action}</div> : null}
        </header>
      ) : null}
      <div className={cx(styles.body, bodyClassName)} data-padding={padding}>{children}</div>
    </Tag>
  );
}
