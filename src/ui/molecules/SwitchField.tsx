"use client";

import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import styles from "./FormControls.styles";

type SwitchFieldProps = { label: string; description?: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean };

/** Interruptor de la app con su etiqueta: pista gris que se vuelve azul y pulgar blanco. */
export function SwitchField({ label, description, checked, onChange, disabled }: SwitchFieldProps) {
  return (
    <label className={styles.switchRow} data-disabled={disabled || undefined}>
      <span className={styles.switchText}>
        <span className={styles.switchLabel}>{label}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
      <Switch className={styles.switch} checked={checked} disabled={disabled} onCheckedChange={(value) => onChange(value === true)}>
        <SwitchThumb className={styles.thumb} />
      </Switch>
    </label>
  );
}
