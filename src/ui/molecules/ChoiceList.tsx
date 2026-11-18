"use client";

import { Radio, RadioGroup } from "@ui-sdk/react/radio";
import { Circle, CircleDot } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./ChoiceList.styles";

type Choice = { value: string; label: string; hint?: string; leading?: ReactNode };

type ChoiceListProps = { label: string; value: string; options: Choice[]; onChange: (value: string) => void };

/**
 * Lista de opciones excluyentes (como «Frecuencia» al configurar una actividad en la app):
 * filas en gris suave; la elegida se llena de azul con texto blanco.
 */
export function ChoiceList({ label, value, options, onChange }: ChoiceListProps) {
  return (
    <RadioGroup className={styles.list} aria-label={label} value={value} onValueChange={(next) => { if (typeof next === "string") onChange(next); }}>
      {options.map((option) => (
        <label key={option.value} className={styles.row} data-checked={option.value === value || undefined}>
          <Radio value={option.value} className={styles.radio}>
            {option.value === value ? <CircleDot size={17} strokeWidth={2.2} aria-hidden="true" /> : <Circle size={17} strokeWidth={2} aria-hidden="true" />}
          </Radio>
          {option.leading}
          <span className={styles.text}>
            <span className={styles.label}>{option.label}</span>
            {option.hint ? <span className={styles.hint}>{option.hint}</span> : null}
          </span>
        </label>
      ))}
    </RadioGroup>
  );
}
