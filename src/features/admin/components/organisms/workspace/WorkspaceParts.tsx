"use client";

import { useState } from "react";
import { Button } from "@/ui/atoms/Button";
import { Skeleton } from "@/ui/atoms/Skeleton";
import { archiveWorkspaceItem } from "@/features/admin/actions/workspace";
import type { Metadata, WorkspaceCollection } from "@/features/admin/lib/workspace";
import styles from "./Workspace.styles";

export { Attribution } from "./Attribution";

/** Archiva o restaura un elemento y devuelve el error, si lo hay. */
export async function toggleArchive(kind: WorkspaceCollection, item: Metadata & { id: string }) {
  try {
    const result = await archiveWorkspaceItem(kind, item.id, item.revision, !item.archived);
    return result.ok ? "" : result.error;
  } catch {
    return "No se pudo completar la operación. Inténtalo de nuevo.";
  }
}

export function ArchiveButton({ kind, item, onDone }: { kind: WorkspaceCollection; item: Metadata & { id: string }; onDone?: () => void }) {
  const [error, setError] = useState("");
  async function toggle() {
    setError("");
    const message = await toggleArchive(kind, item);
    if (message) setError(message);
    else onDone?.();
  }
  return (
    <div className={styles.archive}>
      <Button variant={item.archived ? "soft" : "danger"} size="sm" onClick={toggle}>{item.archived ? "Restaurar" : "Archivar"}</Button>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
    </div>
  );
}

export function WorkspaceStatus({ loading, errors }: { loading: boolean; errors: string[] }) {
  const messages = [...new Set(errors.filter(Boolean))];
  if (messages.length) return <p className={styles.error} role="alert">{messages.join(" ")}</p>;
  if (!loading) return null;
  return (
    <div className={styles.loading} role="status" aria-label="Cargando desde Firebase">
      <Skeleton height={18} width="40%" />
      <Skeleton height={120} radius={20} />
    </div>
  );
}
