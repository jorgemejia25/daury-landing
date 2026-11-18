"use client";

import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from "@ui-sdk/react/segmented-control";
import type { ReactNode } from "react";
import type { Tone } from "@/ui/lib/tones";
import styles from "./FormControls.styles";

type Option = { value: string; label: string; icon?: ReactNode; tone?: Tone };

/** Elección entre pocas opciones (ToggleSelector de la app), con etiqueta visible. */
export function SegmentedField({ label, value, options, onChange, hideLabel = false }: { label: string; value: string; options: Option[]; onChange: (value: string) => void; hideLabel?: boolean }) {
  return (
    <div className={styles.field}>
      {hideLabel ? null : <span className={styles.label} aria-hidden="true">{label}</span>}
      <SegmentedControl className={styles.segmented} aria-label={label} value={value} onValueChange={(next) => { if (next) onChange(next); }}>
        <SegmentedControlIndicator className={styles.segmentedIndicator} />
        {options.map((option) => (
          <SegmentedControlItem key={option.value} value={option.value} className={styles.segmentedItem} data-tone={option.tone}>
            {option.icon}
            {option.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  );
}
