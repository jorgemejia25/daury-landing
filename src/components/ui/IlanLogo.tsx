import Image from "next/image";

/** Logo de ILAN (Israel Innovation Network). Cuadrado, con su fondo azul original. */
export function IlanLogo({ alt, size = 72, className }: { alt: string; size?: number; className?: string }) {
  return (
    <Image
      src="/images/ilan-logo.jpg"
      alt={alt}
      width={size}
      height={size}
      quality={85}
      className={className ? `ilan-logo ${className}` : "ilan-logo"}
    />
  );
}
