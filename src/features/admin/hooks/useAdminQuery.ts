"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

type UpdateOptions = {
  /** Agrega una entrada al historial (abrir una vista a pantalla completa) en vez de reemplazarla. */
  push?: boolean;
};

const OVERLAY = "adminOverlay";

/**
 * Filtros, vistas y elementos abiertos guardados en la URL.
 *
 * Lee con `useSearchParams` y escribe con `history.replaceState`/`pushState`,
 * que Next.js integra en su router. Un estado local refleja el cambio en el
 * mismo render (los componentes controlados de UI SDK lo necesitan) hasta que
 * el router entrega los parámetros nuevos.
 */
export function useAdminQuery() {
  const routerParams = useSearchParams();
  const routerSearch = routerParams.toString();
  const [pending, setPending] = useState<{ from: string; search: string } | null>(null);
  const search = pending && pending.from === routerSearch ? pending.search : routerSearch;
  const params = new URLSearchParams(search);

  function update(values: Record<string, string | null>, options: UpdateOptions = {}) {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(values)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    const query = next.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    setPending({ from: routerSearch, search: query });
    if (options.push) window.history.pushState({ ...window.history.state, [OVERLAY]: true }, "", url);
    else window.history.replaceState(window.history.state, "", url);
  }

  /** Cierra una vista abierta con `push`: vuelve en el historial si la abrió esta página; si no, quita los parámetros. */
  function close(keys: string[]) {
    if (window.history.state?.[OVERLAY]) {
      setPending({ from: routerSearch, search: (() => { const next = new URLSearchParams(search); keys.forEach((key) => next.delete(key)); return next.toString(); })() });
      window.history.back();
    } else {
      update(Object.fromEntries(keys.map((key) => [key, null])));
    }
  }

  return { params, update, close };
}
