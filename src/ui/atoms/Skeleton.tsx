import styles from "./Skeleton.styles";

type SkeletonProps = {
  width?: number | string;
  height?: number;
  radius?: number;
  circle?: boolean;
  /** `surface`: sobre una tarjeta blanca. `bg`: sobre el fondo cálido. */
  tone?: "surface" | "bg";
};

/** Bloque de carga con un pulso suave (un único reloj CSS para toda la pantalla). */
export function Skeleton({ width = "100%", height = 16, radius = 10, circle = false, tone = "bg" }: SkeletonProps) {
  return (
    <span
      className={styles.skeleton}
      data-tone={tone}
      style={{ width: circle ? height : width, height, borderRadius: circle ? "50%" : radius }}
      aria-hidden="true"
    />
  );
}
