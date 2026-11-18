"use client";

import { Field, FieldLabel } from "@ui-sdk/react/field";
import { TimeInput } from "@ui-sdk/react/time-input";
import { Clock } from "lucide-react";
import styles from "./DateField.styles";

type TimeFieldProps = { label: string; value: string; onChange: (value: string) => void; hideLabel?: boolean };

/** Hora por segmentos (Time Input de UI SDK), con reloj de 12 horas como en la app. */
export function TimeField({ label, value, onChange, hideLabel = false }: TimeFieldProps) {
  return (
    <Field className={styles.field}>
      <FieldLabel className={hideLabel ? "sr-only" : styles.label}>{label}</FieldLabel>
      <div className={styles.box}>
        <span className={styles.trigger} aria-hidden="true">
          <Clock size={19} strokeWidth={2.2} />
        </span>
        <TimeInput className={styles.input} hourCycle={12} value={value || null} onValueChange={(next) => onChange(next ?? "")} />
      </div>
    </Field>
  );
}
