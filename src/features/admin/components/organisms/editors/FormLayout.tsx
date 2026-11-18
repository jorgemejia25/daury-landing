import type { ReactNode } from "react";
import styles from "./FormLayout.styles";

/** Hoja principal de un formulario: título y descripción sin caja, con un pie opcional (resumen). */
export function FormSheet({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className={styles.sheet}>
      <div className={styles.sheetBody}>{children}</div>
      {footer ? <div className={styles.sheetFooter}>{footer}</div> : null}
    </div>
  );
}

/** Lista de propiedades: filas alineadas con la etiqueta a la izquierda y el control a la derecha. */
export function PropertyList({ title, children }: { title: string; children: ReactNode }) {
  const id = `props-${title.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/g, "-")}`;
  return (
    <section className={styles.props} aria-labelledby={id}>
      <h2 id={id} className={styles.propsTitle}>{title}</h2>
      <div className={styles.propsGrid}>{children}</div>
    </section>
  );
}

/** Fila de propiedad. El control lleva su propia etiqueta accesible (oculta); aquí se muestra la visible. */
export function PropertyRow({ label, icon, wide = false, children }: { label: string; icon: ReactNode; wide?: boolean; children: ReactNode }) {
  return (
    <div className={styles.prop} data-wide={wide || undefined}>
      <span className={styles.propLabel} aria-hidden="true">{icon}{label}</span>
      <div className={styles.propControl}>{children}</div>
    </div>
  );
}
