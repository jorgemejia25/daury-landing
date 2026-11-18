import { personName } from "@/features/admin/lib/people";
import type { Metadata } from "@/features/admin/lib/workspace";
import styles from "./Workspace.styles";

/** Quién creó y quién editó por última vez un elemento, con nombre y fecha. */
export function Attribution({ item, detailed = false }: { item: Metadata; detailed?: boolean }) {
  const date = (value: string) => new Date(value).toLocaleDateString("es-GT", { day: "numeric", month: "short", year: "numeric", timeZone: "America/Guatemala" });
  return (
    <div className={styles.meta}>
      <span>Creado por {personName(item.createdBy)} · {date(item.createdAt)}</span>
      {detailed && item.updatedAt !== item.createdAt ? <><br /><span>Última edición: {personName(item.updatedBy)} · {date(item.updatedAt)}</span></> : null}
    </div>
  );
}
