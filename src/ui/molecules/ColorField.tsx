"use client";

import { SegmentedControl, SegmentedControlItem } from "@ui-sdk/react/segmented-control";
import { Check } from "lucide-react";
import type { Tone } from "@/ui/lib/tones";
import styles from "./FormControls.styles";

/** Selector de color con muestras redondas de los tonos de la app. */
export function ColorField({ label, value, options, onChange }: { label: string; value: string; options: readonly { value: string; label: string }[]; onChange: (value: string) => void }) {
  return (
    <div className={styles.field}>
      <span className={styles.label} aria-hidden="true">{label}</span>
      <SegmentedControl className={styles.swatches} aria-label={label} value={value} onValueChange={(next) => { if (next) onChange(next); }}>
        {options.map((option) => (
          <SegmentedControlItem key={option.value} value={option.value} className={styles.swatch} data-tone={option.value as Tone} aria-label={option.label}>
            <Check size={16} strokeWidth={3} aria-hidden="true" />
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  );
}
