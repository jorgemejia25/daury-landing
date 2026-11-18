import type { ReactNode } from "react";
import { Panel } from "@/ui/molecules/Panel";
import styles from "./EditorSection.styles";

type EditorSectionProps = {
  /** Título de la sección ("Subtareas", "Cuándo"). */
  label: string;
  /** Valor o acción pequeña a la derecha del título. */
  right?: ReactNode;
  /** Las secciones marcadas se reparten en dos columnas en pantallas muy anchas. */
  pair?: boolean;
  /** Se conserva por compatibilidad: el espaciado ya no depende de la posición. */
  first?: boolean;
  children: ReactNode;
};

/** Sección de una pantalla de edición: panel con el título en su cabecera y los campos debajo. */
export function EditorSection({ label, right, pair = false, children }: EditorSectionProps) {
  const id = `section-${label.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/g, "-")}`;
  return (
    <div className={styles.section} data-section={pair ? "" : undefined}>
      <Panel id={id} title={label} action={right}>{children}</Panel>
    </div>
  );
}
