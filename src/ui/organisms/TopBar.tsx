import type { ReactNode } from "react";
import styles from "./TopBar.styles";

/**
 * Barra superior fija sobre el fondo de la pantalla. La sombra suave aparece
 * al desplazarse (animación ligada al scroll), como el TopBar de la app.
 */
export function TopBar({ left, center, right }: { left?: ReactNode; center?: ReactNode; right?: ReactNode }) {
  return (
    <header className={styles.bar}>
      {left ? <div className={styles.left}>{left}</div> : null}
      <div className={styles.center}>{center}</div>
      {right ? <div className={styles.right}>{right}</div> : null}
    </header>
  );
}
