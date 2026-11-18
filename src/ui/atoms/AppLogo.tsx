import Image from "next/image";
import styles from "./AppLogo.styles";

type AppLogoProps = {
  /** Lado del cuadro azul en px. */
  size?: number;
  /** Texto junto al logo ("Daury", "Daury Admin"). Vacío para mostrar solo el icono. */
  word?: string;
};

/** Logo de la app: cuadro azul redondeado (radio ~31 %) con sombra azul y la palabra en Bricolage. */
export function AppLogo({ size = 40, word = "Daury" }: AppLogoProps) {
  return (
    <span className={styles.logo} data-size={size >= 72 ? "lg" : "md"}>
      <span className={styles.tile} style={{ width: size, height: size, borderRadius: size * 0.31 }}>
        <Image src="/logo.svg" alt="" width={Math.round(size * 0.6)} height={Math.round(size * 0.5)} unoptimized />
      </span>
      {word ? <span className={styles.word}>{word}</span> : null}
    </span>
  );
}
