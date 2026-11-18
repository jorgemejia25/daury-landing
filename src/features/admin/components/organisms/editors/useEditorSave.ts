"use client";

import { useRef, useState } from "react";
import { saveWorkspaceItem } from "@/features/admin/actions/workspace";
import type { Metadata, WorkspaceCollection } from "@/features/admin/lib/workspace";

/** Guarda con la Server Action, evita dobles envíos y conserva la revisión para detectar conflictos. */
export function useEditorSave(kind: WorkspaceCollection, initial?: Metadata & { id: string }) {
  const [revision, setRevision] = useState(initial?.revision);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);

  async function run(task: () => Promise<{ ok: true; id: string; revision: number } | { ok: false; error: string }>, done?: (id: string, revision: number) => void) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await task();
      if (!result.ok) setError(result.error);
      else { setRevision(result.revision); done?.(result.id, result.revision); }
    } catch {
      setError("No se pudieron guardar los cambios. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  const save = (data: Record<string, unknown>, done: (id: string) => void) =>
    run(() => saveWorkspaceItem({ collection: kind, id: initial?.id, revision, data }), (id) => done(id));

  return { revision, busy, error, setError, save, run, stale: Boolean(initial && initial.revision !== revision) };
}
