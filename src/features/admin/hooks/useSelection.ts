"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * Selección múltiple para acciones masivas. Solo cuenta los ids que siguen visibles,
 * así un filtro o un cambio de tablero nunca deja seleccionado algo que no se ve.
 */
export function useSelection(visibleIds: string[]) {
  const [picked, setPicked] = useState<Set<string>>(() => new Set());
  const visibleKey = visibleIds.join("|");
  const selected = useMemo(() => {
    const visible = new Set(visibleKey ? visibleKey.split("|") : []);
    return [...picked].filter((id) => visible.has(id));
  }, [picked, visibleKey]);
  const toggle = useCallback((id: string, value?: boolean) => {
    setPicked((current) => {
      const next = new Set(current);
      if (value ?? !next.has(id)) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);
  const all = visibleIds.length > 0 && selected.length === visibleIds.length;
  const toggleAll = useCallback(() => setPicked(all ? new Set() : new Set(visibleKey ? visibleKey.split("|") : [])), [all, visibleKey]);
  const clear = useCallback(() => setPicked(new Set()), []);
  const has = useCallback((id: string) => selected.includes(id), [selected]);
  return { selected, count: selected.length, has, toggle, toggleAll, all, some: selected.length > 0 && !all, clear };
}
