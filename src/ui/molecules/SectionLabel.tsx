import type { ReactNode } from "react";
import styles from "./SectionLabel.styles";

type SectionLabelProps = {
  children: ReactNode;
  /** Acción o valor pequeño alineado a la derecha. */
  right?: ReactNode;
  id?: string;
  as?: "h2" | "h3" | "p";
  first?: boolean;
};

/** Etiqueta corta en negrita de sección ("Herramientas", "Documentos"). */
export function SectionLabel({ children, right, id, as: Tag = "h2", first = false }: SectionLabelProps) {
  return (
    <div className={styles.wrap} data-first={first || undefined}>
      <Tag id={id} className={styles.text}>{children}</Tag>
      {right}
    </div>
  );
}
