"use client";

import { DialogClose, DialogContent, DialogTitle } from "@ui-sdk/react/dialog";
import { X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { iconButtonClass } from "@/ui/atoms/IconButton";
import { cx } from "@/ui/lib/tones";
import styles from "./Modal.styles";

type ModalProps = Omit<ComponentProps<typeof DialogContent>, "title" | "className"> & {
  title: ReactNode;
  /** Oculta el título visualmente (sigue nombrando el diálogo). */
  hideTitle?: boolean;
  /** Nombre accesible del botón de cierre. */
  closeLabel: string;
  /** Contenido extra junto al título (logo, insignias). */
  heading?: ReactNode;
  /** `center`: hoja flotante. `side`: panel lateral izquierdo (navegación móvil). */
  placement?: "center" | "side";
  className?: string;
  children: ReactNode;
};

/**
 * Hoja modal de la app: superficie blanca de radio 28 con sombra `pop`,
 * título en Bricolage y botón de cierre cuadrado. Va dentro de `<Dialog>`.
 */
export function Modal({
  title,
  hideTitle = false,
  closeLabel,
  heading,
  placement = "center",
  className,
  children,
  ...props
}: ModalProps) {
  return (
    <DialogContent {...props} className={cx(styles.modal, className)} data-placement={placement}>
      <div className={styles.heading}>
        {heading}
        <DialogTitle className={hideTitle ? "sr-only" : styles.title}>{title}</DialogTitle>
        <DialogClose className={cx(iconButtonClass, styles.close)} data-variant="soft" aria-label={closeLabel}>
          <X size={22} strokeWidth={2.2} aria-hidden="true" />
        </DialogClose>
      </div>
      {children}
    </DialogContent>
  );
}
