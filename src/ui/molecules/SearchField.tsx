"use client";

import { Input } from "@ui-sdk/react/input";
import { Search } from "lucide-react";
import type { ComponentProps } from "react";
import { cx } from "@/ui/lib/tones";
import styles from "./SearchField.styles";

type SearchFieldProps = Omit<ComponentProps<typeof Input>, "type" | "className" | "size"> & {
  /** Etiqueta visible sobre el campo. Sin ella, usa `aria-label`. */
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Campo de búsqueda con el estilo de entrada de la app: blanco, borde de 2 px y foco azul. */
export function SearchField({ label, id, size = "md", className, ...props }: SearchFieldProps) {
  return (
    <div className={cx(styles.field, className)} data-size={size}>
      {label ? <label className={styles.label} htmlFor={id}>{label}</label> : null}
      <div className={styles.box}>
        <Search size={size === "lg" ? 20 : 16} strokeWidth={2.2} aria-hidden="true" />
        <Input {...props} id={id} type="search" className={styles.input} />
      </div>
    </div>
  );
}
