"use server";

import { randomUUID } from "node:crypto";
import { workspaceStore, WorkspaceConflict, type RestDocument } from "../server/firestore-rest";
import { object, parseWorkspaceData, validId, workspaceCollections, type ActionResult, type SaveRequest, type WorkspaceCollection } from "../lib/workspace";

type MutationResult = ActionResult & { retryable?: boolean };
function errorResult(error: unknown): MutationResult { return { ok: false, retryable: error instanceof WorkspaceConflict, error: error instanceof Error && !error.message.startsWith("NEXT_") ? error.message : "La sesión no está disponible. Vuelve a iniciar sesión." }; }
function collectionName(value: unknown): asserts value is WorkspaceCollection { if (!workspaceCollections.some((name) => name === value)) throw new Error("Colección no válida."); }
function checkRevision(previous: RestDocument | null, revision: unknown) {
  if (!previous || !Number.isInteger(revision) || previous.data.revision !== revision) throw new Error("Otra persona modificó este elemento. Cierra el editor y vuelve a abrirlo para cargar la versión actual.");
}
async function saveAttempt(input: SaveRequest): Promise<MutationResult> {
  let store: Awaited<ReturnType<typeof workspaceStore>> | undefined;
  try {
    store = await workspaceStore();
    const request = object(input); collectionName(request.collection);
    const kind = request.collection;
    const id = request.id === undefined ? randomUUID() : request.id; validId(id);
    const previous = request.id === undefined ? null : await store.get(kind, id);
    if (request.id !== undefined) checkRevision(previous, request.revision);
    if (previous?.data.archived) throw new Error("Restaura el elemento antes de editarlo.");
    const parsed = parseWorkspaceData(kind, request.data);
    const data = { ...parsed } as Record<string, unknown>;
    async function requireReference(collection: string, value: unknown) {
      if (!value) return null;
      validId(value); const parent = await store!.get(collection, value);
      if (!parent || parent.data.archived) throw new Error("El elemento relacionado no existe o está archivado.");
      return parent;
    }
    if (kind === "tasks") {
      const board = await requireReference("boards", data.boardId);
      if (!(board?.data.columnOrder as string[])?.includes(data.status as string)) throw new Error("El estado no pertenece al tablero seleccionado.");
      data.comments = previous?.data.comments ?? [];
      const existingChecklist = (previous?.data.checklist ?? []) as { id: string; createdBy?: string; createdAt?: string }[];
      data.checklist = (data.checklist as { id: string; title: string; done: boolean }[]).map((item) => {
        const original = existingChecklist.find((entry) => entry.id === item.id);
        return { ...item, createdBy: original?.createdBy ?? store!.user.email, createdAt: original?.createdAt ?? new Date().toISOString() };
      });
      await requireReference("wikiPages", data.articleId);
    }
    if (kind === "events") { await requireReference("calendars", data.calendarId); await requireReference("wikiPages", data.articleId); }
    if (kind === "wikiPages") await requireReference("folders", data.folderId);
    if (kind === "stickyNotes" && !(await requireReference("whiteboards", data.whiteboardId))) throw new Error("La pizarra no existe o está archivada.");
    if (kind === "folders") {
      let parent = data.parentId as string; const visited = new Set([id]);
      for (let depth = 0; parent; depth++) { if (visited.has(parent) || depth >= 12) throw new Error("La carpeta no puede contenerse a sí misma ni superar 12 niveles."); visited.add(parent); const ancestor = await requireReference("folders", parent); parent = ancestor?.data.parentId as string; }
    }
    if (kind === "boards" && previous) {
      const tasks = await store.list("tasks", "boardId", id);
      if (tasks.some((task) => !task.data.archived && !(data.columnOrder as string[]).includes(task.data.status as string))) throw new Error("Mueve las tareas de una columna antes de eliminarla.");
    }
    const now = new Date().toISOString(), revision = Number(previous?.data.revision ?? 0) + 1;
    const metadata = { revision, archived: false, createdAt: previous?.data.createdAt ?? now, createdBy: previous?.data.createdBy ?? store.user.email, updatedAt: now, updatedBy: store.user.email };
    const body = data.body; delete data.body;
    const writes: Parameters<typeof store.commit>[0] = [{ collection: kind as string, id, data: { ...data, ...metadata }, previous }];
    if (kind === "wikiPages") writes.push({ collection: "wikiContent", id, data: { body, ...metadata }, previous: previous ? await store.get("wikiContent", id) : null });
    await store.commit(writes);
    return { ok: true, id, revision };
  } catch (error) { return errorResult(error); }
}
async function archiveAttempt(kind: WorkspaceCollection, id: string, revision: number, archived: boolean): Promise<MutationResult> {
  let store: Awaited<ReturnType<typeof workspaceStore>> | undefined;
  try {
    store = await workspaceStore(); collectionName(kind); validId(id);
    if (typeof archived !== "boolean") throw new Error("Acción no válida.");
    const previous = await store.get(kind, id); checkRevision(previous, revision);
    const data = previous!.data;
    if (kind === "folders" && archived) {
      const [folders, pages] = await Promise.all([store.list("folders", "parentId", id), store.list("wikiPages", "folderId", id)]);
      if ([...folders, ...pages].some((item) => !item.data.archived)) throw new Error("Mueve o archiva el contenido de esta carpeta primero.");
    }
    const relation = kind === "tasks" ? ["boards", data.boardId] : kind === "events" ? ["calendars", data.calendarId] : kind === "stickyNotes" ? ["whiteboards", data.whiteboardId] : kind === "wikiPages" ? ["folders", data.folderId] : kind === "folders" ? ["folders", data.parentId] : null;
    if (!archived && relation?.[1]) { const parent = await store.get(relation[0] as string, relation[1] as string); if (!parent || parent.data.archived) throw new Error("Restaura primero el tablero, calendario, pizarra o carpeta que lo contiene."); if (kind === "tasks" && !(parent.data.columnOrder as string[]).includes(data.status as string)) throw new Error("Restaura primero la columna original de esta tarea."); }
    const nextRevision = revision + 1;
    await store.commit([{ collection: kind, id, previous, data: { ...data, archived, revision: nextRevision, updatedAt: new Date().toISOString(), updatedBy: store.user.email } }]);
    return { ok: true, id, revision: nextRevision };
  } catch (error) { return errorResult(error); }
}
async function commentAttempt(id: string, revision: number, body: string): Promise<MutationResult> {
  let store: Awaited<ReturnType<typeof workspaceStore>> | undefined;
  try {
    store = await workspaceStore(); validId(id);
    if (typeof body !== "string" || !body.trim() || body.length > 3000) throw new Error("Escribe un comentario de hasta 3000 caracteres.");
    const previous = await store.get("tasks", id); checkRevision(previous, revision);
    if (previous!.data.archived) throw new Error("Restaura la tarea antes de comentar.");
    const comments = previous!.data.comments as unknown[];
    if (comments.length >= 100) throw new Error("Esta tarea alcanzó el límite de 100 comentarios.");
    const now = new Date().toISOString();
    await store.commit([{ collection: "tasks", id, previous, data: { ...previous!.data, comments: [...comments, { id: randomUUID(), body: body.trim(), author: store.user.email, createdAt: now }], revision: revision + 1, updatedAt: now, updatedBy: store.user.email } }]);
    return { ok: true, id, revision: revision + 1 };
  } catch (error) { return errorResult(error); }
}

async function retryMutation(action: () => Promise<MutationResult>): Promise<ActionResult> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await action();
    if (result.ok) return result;
    if (!result.retryable || attempt === 2) return { ok: false, error: result.error };
    await new Promise((resolve) => setTimeout(resolve, 100 + attempt * 150 + Math.random() * 100));
  }
  return { ok: false, error: "No se pudo guardar. Inténtalo de nuevo." };
}
export async function saveWorkspaceItem(input: SaveRequest): Promise<ActionResult> { return retryMutation(() => saveAttempt(input)); }
export async function archiveWorkspaceItem(kind: WorkspaceCollection, id: string, revision: number, archived: boolean): Promise<ActionResult> { return retryMutation(() => archiveAttempt(kind, id, revision, archived)); }
export async function addTaskComment(id: string, revision: number, body: string): Promise<ActionResult> { return retryMutation(() => commentAttempt(id, revision, body)); }
