"use client";

import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import type { ReactNode } from "react";
import styles from "./ToggleRow.styles";

type ToggleRowProps = { icon: ReactNode; title: string; subtitle?: string; checked: boolean; onChange: (checked: boolean) => void };

/** Fila de ajuste de la app: azulejo de ícono · título y descripción · interruptor. Toda la fila lo activa. */
export function ToggleRow({ icon, title, subtitle, checked, onChange }: ToggleRowProps) {
  return (
    <label className={styles.row}>
      <span className={styles.tile} data-on={checked || undefined} aria-hidden="true">{icon}</span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
      </span>
      <Switch className={styles.switch} checked={checked} onCheckedChange={(value) => onChange(value === true)}>
        <SwitchThumb className={styles.thumb} />
      </Switch>
    </label>
  );
}
