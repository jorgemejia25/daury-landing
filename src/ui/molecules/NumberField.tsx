"use client";

import { Field, FieldLabel } from "@ui-sdk/react/field";
import { NumberInput, NumberInputControl, NumberInputDecrement, NumberInputGroup, NumberInputIncrement } from "@ui-sdk/react/number-input";
import { Minus, Plus } from "lucide-react";
import styles from "./FormControls.styles";

type NumberFieldProps = { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; suffix?: string; hideLabel?: boolean };

/** Número con botones − y + a los lados, en el estilo de entrada de la app. */
export function NumberField({ label, value, onChange, min = 0, max = 100, suffix, hideLabel = false }: NumberFieldProps) {
  return (
    <Field className={styles.field}>
      <FieldLabel className={hideLabel ? "sr-only" : styles.label}>{label}</FieldLabel>
      <NumberInput min={min} max={max} step={1} value={value} onValueChange={(next) => onChange(next ?? min)}>
        <NumberInputGroup className={styles.stepper}>
          <NumberInputDecrement className={styles.stepButton} aria-label={`Restar a ${label.toLowerCase()}`}>
            <Minus size={16} strokeWidth={2.4} aria-hidden="true" />
          </NumberInputDecrement>
          <NumberInputControl className={styles.stepInput} />
          {suffix ? <span className={styles.stepSuffix} aria-hidden="true">{suffix}</span> : null}
          <NumberInputIncrement className={styles.stepButton} aria-label={`Sumar a ${label.toLowerCase()}`}>
            <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
          </NumberInputIncrement>
        </NumberInputGroup>
      </NumberInput>
    </Field>
  );
}
