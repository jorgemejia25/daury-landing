"use client";

import { Button as SdkButton } from "@ui-sdk/react/button";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/ui/lib/tones";
import styles from "./IconButton.styles";

type SdkProps = ComponentProps<typeof SdkButton>;

export type IconButtonProps = Omit<SdkProps, "className" | "children"> & {
  /** Nombre accesible obligatorio: el botón solo muestra un icono. */
  "aria-label": string;
  /** `surface`: cuadrado blanco con sombra (BackButton de la app). `plain`: sin fondo. `soft`: bg-2. */
  variant?: "surface" | "plain" | "soft";
  size?: "md" | "lg";
  className?: string;
  children: ReactNode;
};

/** Botón cuadrado de icono: 48 px con radio 15 y sombra suave, como el BackButton de la app. */
export function IconButton({ variant = "surface", size = "md", className, children, ...props }: IconButtonProps) {
  return (
    <SdkButton {...props} className={cx(styles.iconButton, className)} data-variant={variant} data-size={size}>
      {children}
    </SdkButton>
  );
}

/** Clases para aplicar el mismo aspecto a disparadores de UI SDK (DialogTrigger, DialogClose). */
export const iconButtonClass = styles.iconButton;
