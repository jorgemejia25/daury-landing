"use client";

import { Check } from "lucide-react";
import { CopyButton } from "@/ui/molecules/CopyButton";
import { useCopy } from "@/ui/lib/useCopy";
import { hexToRgb, type Swatch } from "@/features/admin/lib/brand";
import styles from "./BrandGuide.styles";

/** Muestra de color: el bloque copia el HEX al tocarlo; abajo, HEX y RGB. */
export function SwatchCard({ swatch }: { swatch: Swatch }) {
  const { copied, copy } = useCopy();
  const rgb = hexToRgb(swatch.hex);
  return (
    <div className={styles.swatch}>
      <button
        type="button"
        className={styles.swatchChip}
        style={{ background: swatch.hex }}
        aria-label={`Copiar ${swatch.hex} (${swatch.name})`}
        onClick={() => void copy(swatch.hex)}
      >
        <span>
          {copied ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : null}
          {copied ? "Copiado" : swatch.hex}
        </span>
      </button>
      <span className="sr-only" role="status">{copied ? `Copiado: ${swatch.hex}` : ""}</span>
      <div className={styles.swatchMeta}>
        <b>{swatch.name}</b>
        <span className={styles.swatchValues}>RGB {rgb}</span>
        <span className={styles.swatchUse}>{swatch.use}</span>
        <div className={styles.copies}>
          <CopyButton value={swatch.hex} label="HEX" description={swatch.hex} />
          <CopyButton value={`rgb(${rgb})`} label="RGB" description={`rgb(${rgb})`} />
        </div>
      </div>
    </div>
  );
}
