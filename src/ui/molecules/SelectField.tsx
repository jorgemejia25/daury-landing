"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select";
import { Check, ChevronDown } from "lucide-react";
import styles from "./SelectField.styles";

type Option = { value: string; label: string };

type SelectFieldProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  /** Valor al que volver si la selección queda vacía. */
  fallback?: string;
  /** Etiqueta solo para lectores de pantalla (filas de propiedades). */
  hideLabel?: boolean;
  /** `compact`: 42 px de alto, para paneles de propiedades. */
  size?: "md" | "compact";
};

/** Selector con etiqueta: disparador blanco con borde de 2 px y menú flotante con sombra. */
export function SelectField({ label, value, options, onChange, fallback = "all", hideLabel = false, size = "md" }: SelectFieldProps) {
  return (
    <div className={styles.field}>
      <Select
        value={value}
        items={options}
        onValueChange={(next) => onChange(typeof next === "string" ? next : fallback)}
      >
        <SelectLabel className={hideLabel ? "sr-only" : styles.label}>{label}</SelectLabel>
        <SelectTrigger className={styles.trigger} data-size={size}>
          <SelectValue />
          <ChevronDown size={18} strokeWidth={2.2} aria-hidden="true" />
        </SelectTrigger>
        <SelectContent className={styles.content}>
          {options.map((option) => (
            <SelectItem className={styles.item} value={option.value} key={option.value}>
              <span>{option.label}</span>
              <Check className={styles.check} size={16} strokeWidth={2.4} aria-hidden="true" />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
