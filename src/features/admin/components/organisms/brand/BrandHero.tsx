import { BrandMark } from "@/ui/atoms/BrandMark";
import styles from "./BrandGuide.styles";

/** Portada de la guía: tarjeta azul con el logo y accesos a cada sección. */
export function BrandHero() {
  return (
    <div className={styles.hero}>
      <p className={styles.heroLockup}>
        <BrandMark width={40} color="#FFFFFF" />
        daury
      </p>
      <p className={styles.heroTitle}>Guía de marca</p>
      <p className={styles.heroLede}>
        Logo, colores, fuentes, componentes y mascota de Daury, con sus reglas para la app y las redes sociales.
      </p>
    </div>
  );
}
