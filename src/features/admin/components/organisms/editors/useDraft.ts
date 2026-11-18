"use client";

import { useRef, useState } from "react";

/**
 * Borrador de formulario con una referencia siempre al día: guardar justo
 * después de escribir (en el mismo tick, como hace un agente) usa el valor nuevo.
 */
export function useDraft<T extends object>(initial: () => T) {
  const [draft, setDraft] = useState(initial);
  const latest = useRef(draft);
  function set<K extends keyof T>(key: K, value: T[K]) {
    latest.current = { ...latest.current, [key]: value };
    setDraft(latest.current);
  }
  function patch(values: Partial<T>) {
    latest.current = { ...latest.current, ...values };
    setDraft(latest.current);
  }
  return { draft, set, patch, latest };
}
