"use client";

import { Check } from "lucide-react";
import { useCopy } from "@/ui/lib/useCopy";
import { luminance, textOn, type ColorChip } from "@/features/admin/lib/brand";
import styles from "./BrandGuide.styles";

/** Tarjeta de una pila de color: al tocarla copia el HEX. */
export function ColorChipButton({ color }: { color: ColorChip }) {
  const { copied, copy } = useCopy();
  return (
    <>
      <button
        type="button"
        className={styles.chip}
        style={{ background: color.hex, color: textOn(color.hex) }}
        data-light={luminance(color.hex) > 0.8 ? "" : undefined}
        aria-label={`Copiar ${color.hex} (${color.name})`}
        onClick={() => void copy(color.hex)}
      >
        <span>
          <b>{color.name}</b>
          <small>{color.use}</small>
        </span>
        <span className={styles.chipHex}>
          {copied ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : null}
          {copied ? "Copiado" : color.hex}
        </span>
      </button>
      <span className="sr-only" role="status">{copied ? `Copiado: ${color.hex}` : ""}</span>
    </>
  );
}

/** Muestra de la paleta de la mascota: nombre y HEX; copia al tocarla. */
export function PaletteChipButton({ color }: { color: ColorChip }) {
  const { copied, copy } = useCopy();
  return (
    <>
      <button
        type="button"
        className={styles.paletteChip}
        style={{ background: color.hex, color: textOn(color.hex) }}
        data-light={luminance(color.hex) > 0.8 ? "" : undefined}
        aria-label={`Copiar ${color.hex} (${color.name})`}
        onClick={() => void copy(color.hex)}
      >
        <b>{color.name}</b>
        <span className={styles.chipHex}>{copied ? "Copiado" : color.hex}</span>
      </button>
      <span className="sr-only" role="status">{copied ? `Copiado: ${color.hex}` : ""}</span>
    </>
  );
}
