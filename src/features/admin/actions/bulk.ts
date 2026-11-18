"use server";

import { workspaceStore, WorkspaceConflict, type RestDocument } from "../server/firestore-rest";
import { adminAllowedEmails } from "../lib/access";
import { validId } from "../lib/workspace";
import type { BulkAction, BulkKind, BulkResult } from "../lib/bulk";

const MAX_ITEMS = 100;
const priorities = ["high", "medium", "low"];

/**
 * Aplica una acción a varias tareas o eventos en un solo commit atómico: o se aplica a todos o a ninguno.
 * Cada cambio sube la revisión y registra quién lo hizo, igual que una edición individual.
 */
async function bulkAttempt(kind: BulkKind, ids: string[], action: BulkAction): Promise<BulkResult & { retryable?: boolean }> {
  try {
    if (kind !== "tasks" && kind !== "events") throw new Error("Colección no válida.");
    if (!Array.isArray(ids) || !ids.length) throw new Error("Selecciona al menos un elemento.");
    if (ids.length > MAX_ITEMS) throw new Error(`Selecciona como máximo ${MAX_ITEMS} elementos a la vez.`);
    const unique = [...new Set(ids)];
    unique.forEach((id) => validId(id));
    const store = await workspaceStore();
    const items = await Promise.all(unique.map((id) => store.get(kind, id)));
    if (items.some((item) => !item)) throw new Error("Algún elemento ya no existe. Recarga la página.");
    const docs = items as RestDocument[];
    const now = new Date().toISOString();
    const parentCache = new Map<string, RestDocument | null>();
    const parent = async (collection: string, id: unknown) => {
      if (typeof id !== "string" || !id) return null;
      const key = `${collection}/${id}`;
      if (!parentCache.has(key)) parentCache.set(key, await store.get(collection, id));
      return parentCache.get(key)!;
    };
    const touch = (doc: RestDocument, changes: Record<string, unknown>) => ({
      collection: kind,
      id: doc.name.split("/").pop()!,
      previous: doc,
      data: { ...doc.data, ...changes, revision: Number(doc.data.revision) + 1, updatedAt: now, updatedBy: store.user.email },
    });
    const writes: Parameters<typeof store.commit>[0] = [];

    for (const doc of docs) {
      const data = doc.data;
      switch (action.type) {
        case "archive":
          if (!data.archived) writes.push(touch(doc, { archived: true }));
          break;
        case "restore": {
          if (!data.archived) break;
          const container = kind === "tasks" ? await parent("boards", data.boardId) : await parent("calendars", data.calendarId);
          if (!container || container.data.archived) throw new Error(`Restaura primero el ${kind === "tasks" ? "tablero" : "calendario"} de “${data.title}”.`);
          if (kind === "tasks" && !(container.data.columnOrder as string[]).includes(data.status as string)) throw new Error(`La columna original de “${data.title}” ya no existe.`);
          writes.push(touch(doc, { archived: false }));
          break;
        }
        case "delete":
          writes.push({ collection: kind, id: doc.name.split("/").pop()!, previous: doc, data: doc.data, remove: true });
          break;
        case "status": {
          if (kind !== "tasks") throw new Error("Acción no válida.");
          if (data.archived) throw new Error("Restaura las tareas archivadas antes de moverlas.");
          const board = await parent("boards", data.boardId);
          if (!(board?.data.columnOrder as string[] | undefined)?.includes(action.value)) throw new Error("La columna no pertenece al tablero de todas las tareas seleccionadas.");
          if (data.status !== action.value) writes.push(touch(doc, { status: action.value }));
          break;
        }
        case "priority":
          if (kind !== "tasks" || !priorities.includes(action.value)) throw new Error("Prioridad no válida.");
          if (data.archived) throw new Error("Restaura las tareas archivadas antes de editarlas.");
          if (data.priority !== action.value) writes.push(touch(doc, { priority: action.value }));
          break;
        case "assignee":
          if (kind !== "tasks" || (action.value !== "" && !adminAllowedEmails.some((email) => email === action.value))) throw new Error("Responsable no válido.");
          if (data.archived) throw new Error("Restaura las tareas archivadas antes de editarlas.");
          if (data.assignee !== action.value) writes.push(touch(doc, { assignee: action.value }));
          break;
        case "calendar": {
          if (kind !== "events") throw new Error("Acción no válida.");
          if (data.archived) throw new Error("Restaura los eventos archivados antes de moverlos.");
          const calendar = await parent("calendars", action.value);
          if (!calendar || calendar.data.archived) throw new Error("El calendario no existe o está archivado.");
          if (data.calendarId !== action.value) writes.push(touch(doc, { calendarId: action.value }));
          break;
        }
        default:
          throw new Error("Acción no válida.");
      }
    }
    if (writes.length) await store.commit(writes);
    return { ok: true, count: writes.length };
  } catch (error) {
    return {
      ok: false,
      retryable: error instanceof WorkspaceConflict,
      error: error instanceof Error && !error.message.startsWith("NEXT_") ? error.message : "La sesión no está disponible. Vuelve a iniciar sesión.",
    };
  }
}

export async function bulkWorkspaceAction(kind: BulkKind, ids: string[], action: BulkAction): Promise<BulkResult> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await bulkAttempt(kind, ids, action);
    if (result.ok || !result.retryable || attempt === 2) return result.ok ? result : { ok: false, error: result.error };
    await new Promise((resolve) => setTimeout(resolve, 100 + attempt * 150 + Math.random() * 100));
  }
  return { ok: false, error: "No se pudo completar la acción. Inténtalo de nuevo." };
}
