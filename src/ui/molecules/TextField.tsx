"use client";

import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";
import { Textarea } from "@ui-sdk/react/textarea";
import { cx } from "@/ui/lib/tones";
import styles from "./FormControls.styles";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
  /** `textarea` para varias líneas; `code` para Markdown. */
  multiline?: boolean | "code";
  rows?: number;
  type?: "text" | "date" | "time" | "number" | "search" | "url";
  maxLength?: number;
  required?: boolean;
  /** Muestra la etiqueta solo a lectores de pantalla. */
  hideLabel?: boolean;
  /** `big`: campo grande. `title`: título sin caja (hoja de un formulario). `plain`: texto libre sin caja. */
  appearance?: "field" | "big" | "title" | "plain";
  className?: string;
};

/** Campo de texto con etiqueta, en el estilo de entrada de la app (blanco, borde de 2 px, foco azul). */
export function TextField({
  label,
  value,
  onChange,
  description,
  placeholder,
  multiline = false,
  rows,
  type = "text",
  maxLength = 200,
  required = false,
  hideLabel = false,
  appearance = "field",
  className,
}: TextFieldProps) {
  const common = { className: cx(styles.input, multiline === "code" && styles.code, appearance === "big" && styles.big, appearance === "title" && styles.titleInput, appearance === "plain" && styles.plain), value, onValueChange: onChange, maxLength, required, placeholder };
  return (
    <Field className={cx(styles.field, className)}>
      <FieldLabel className={hideLabel ? "sr-only" : styles.label}>{label}</FieldLabel>
      {multiline ? <Textarea {...common} rows={rows ?? (multiline === "code" ? 16 : 3)} /> : <Input {...common} type={type} />}
      {description ? <FieldDescription className={styles.description}>{description}</FieldDescription> : null}
    </Field>
  );
}
