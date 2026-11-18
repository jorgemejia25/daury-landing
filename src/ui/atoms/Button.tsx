"use client";

import { Button as SdkButton } from "@ui-sdk/react/button";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/ui/lib/tones";
import styles from "./Button.styles";

export type ButtonVariant =
  /** Azul sólido, texto blanco. Acción principal de la pantalla. */
  | "primary"
  /** Fondo cálido (bg-2), tinta oscura. Acción secundaria. */
  | "secondary"
  /** Tinta oscura, texto claro. Confirmaciones tipo "Listo". */
  | "ink"
  /** Azul suave, texto azul. Acciones ligeras (Ver, Escuchar). */
  | "soft"
  /** Coral suave, texto coral. Acciones destructivas. */
  | "danger"
  /** Verde sólido. Confirmar / hecho. */
  | "success"
  /** Blanco con texto azul, para fondos azules. */
  | "onBlue"
  /** Superficie blanca con sombra suave. */
  | "surface"
  /** Sin fondo, texto azul. */
  | "text";

export type ButtonSize = "lg" | "md" | "sm";

type SdkProps = ComponentProps<typeof SdkButton>;

export type ButtonProps = Omit<SdkProps, "className" | "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Píldora por defecto; `rounded` usa radio 16. */
  shape?: "pill" | "rounded";
  /** Ocupa todo el ancho disponible. */
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "leading" | "trailing";
  className?: string;
  children: ReactNode;
};

/**
 * Botón estándar de Daury: píldora, etiqueta en negrita y elevación al pulsar.
 * Toda acción principal de una pantalla usa `variant="primary"`.
 * Para enlaces, pasa `render={<Link href="…" />}`.
 */
export function Button({
  variant = "primary",
  size = "md",
  shape = "pill",
  fullWidth = false,
  icon,
  iconPosition = "leading",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <SdkButton
      {...props}
      className={cx(styles.button, fullWidth && styles.full, className)}
      data-variant={variant}
      data-size={size}
      data-shape={shape}
    >
      {icon && iconPosition === "leading" ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.label}>{children}</span>
      {icon && iconPosition === "trailing" ? <span className={styles.icon}>{icon}</span> : null}
    </SdkButton>
  );
}
