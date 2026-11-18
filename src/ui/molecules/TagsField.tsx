"use client";

import { Input } from "@ui-sdk/react/input";
import { X } from "lucide-react";
import { useState } from "react";
import styles from "./FormControls.styles";

type TagsFieldProps = { label: string; value: string[]; onChange: (value: string[]) => void; max?: number; placeholder?: string; hideLabel?: boolean };

/** Etiquetas como chips: Enter o coma agrega, el botón de cada chip la quita. */
export function TagsField({ label, value, onChange, max = 12, placeholder = "Escribe y presiona Enter", hideLabel = false }: TagsFieldProps) {
  const [draft, setDraft] = useState("");
  function add() {
    const tag = draft.trim().replace(/,$/, "").slice(0, 40);
    if (tag && !value.includes(tag) && value.length < max) onChange([...value, tag]);
    setDraft("");
  }
  return (
    <div className={styles.field}>
      <label className={hideLabel ? "sr-only" : styles.label} htmlFor={`tags-${label}`}>{label}</label>
      <div className={styles.tagsBox}>
        {value.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
            <button type="button" aria-label={`Quitar etiqueta ${tag}`} onClick={() => onChange(value.filter((item) => item !== tag))}>
              <X size={13} strokeWidth={2.6} aria-hidden="true" />
            </button>
          </span>
        ))}
        <Input
          id={`tags-${label}`}
          className={styles.tagsInput}
          value={draft}
          placeholder={value.length ? "" : placeholder}
          disabled={value.length >= max}
          onValueChange={(next) => (next.endsWith(",") ? (setDraft(next), queueMicrotask(add)) : setDraft(next))}
          onKeyDown={(event) => {
            if (event.key === "Enter") { event.preventDefault(); add(); }
            if (event.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={add}
        />
      </div>
    </div>
  );
}
