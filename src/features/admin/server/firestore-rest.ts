import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { requireAdminSession, adminSessionCookie } from "./session";
import { validId } from "../lib/workspace";

export class WorkspaceConflict extends Error {}

type Value = { stringValue: string } | { integerValue: string } | { booleanValue: boolean } | { doubleValue: number } | { nullValue: null } | { arrayValue: { values: Value[] } } | { mapValue: { fields: Record<string, Value> } };
export function encodeValue(value: unknown): Value {
  if (value === null) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number" && Number.isFinite(value)) return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (value && typeof value === "object") return { mapValue: { fields: encodeFields(value as Record<string, unknown>) } };
  throw new Error("No se puede guardar este valor.");
}
export const encodeFields = (data: Record<string, unknown>): Record<string, Value> => Object.fromEntries(Object.entries(data).map(([key, value]) => [key, encodeValue(value)]));
export function decodeValue(value: Value): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("arrayValue" in value) return (value.arrayValue.values ?? []).map(decodeValue);
  if ("mapValue" in value) return decodeFields(value.mapValue.fields ?? {});
  return null;
}
const decodeFields = (fields: Record<string, Value>) => Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
export type RestDocument = { name: string; data: Record<string, unknown>; updateTime: string };
const allowedCollections = new Set(["boards", "tasks", "calendars", "events", "folders", "wikiPages", "wikiContent", "workspaceGuards", "financeEntries"]);
export async function workspaceStore() {
  const user = await requireAdminSession();
  const token = (await cookies()).get(adminSessionCookie)?.value;
  if (!token) throw new Error("La sesión ha vencido. Vuelve a iniciar sesión.");
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!project) throw new Error("Falta configurar Firebase.");
  const resource = `projects/${project}/databases/(default)/documents`;
  const url = `https://firestore.googleapis.com/v1/${resource}`;
  async function request(path: string, init?: RequestInit) {
    const response = await fetch(url + path, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(20000) });
    if (response.status === 404) return null;
    if (response.status === 409) throw new WorkspaceConflict("Otra persona está guardando cambios. Inténtalo de nuevo.");
    if (response.status === 412) throw new WorkspaceConflict("Otra persona modificó este elemento. Recarga los datos antes de guardar.");
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      const diagnostic = { operation: path.split("?")[0], status: response.status, code: detail.error?.status, message: detail.error?.message };
      console.error("[wiki.firestore]", diagnostic);
      throw new Error(response.status === 403 ? "No tienes permiso para guardar estos cambios." : response.status === 401 ? "Tu sesión ha vencido. Vuelve a iniciar sesión." : "Firebase no pudo completar la operación. Inténtalo de nuevo.");
    }
    return response.json();
  }
  const reads = new Map<string, RestDocument | null>();
  function name(collection: string, id: string) { if (!allowedCollections.has(collection)) throw new Error("Colección no válida."); validId(id); return `${resource}/${collection}/${id}`; }
  function document(raw: { name: string; fields?: Record<string, Value>; updateTime: string }): RestDocument { return { name: raw.name, updateTime: raw.updateTime, data: decodeFields(raw.fields ?? {}) }; }
  function remember(key: string, item: RestDocument | null) {
    if (reads.has(key) && reads.get(key)?.updateTime !== item?.updateTime) throw new WorkspaceConflict("Los datos cambiaron durante el guardado. Inténtalo de nuevo.");
    reads.set(key, item);
    return item;
  }
  async function get(collection: string, id: string): Promise<RestDocument | null> {
    const key = name(collection, id);
    if (reads.has(key)) return reads.get(key)!;
    const raw = await request(`/${collection}/${id}`);
    return remember(key, raw ? document(raw) : null);
  }
  const guardId = (kind: string, id: string) => createHash("sha256").update(`${kind}/${id}`).digest("hex");
  return {
    user,
    get,
    async list(collection: string, field: string, value: string): Promise<RestDocument[]> {
      if (!allowedCollections.has(collection) || !["boardId", "calendarId", "folderId", "parentId"].includes(field)) throw new Error("Consulta no válida.");
      const parentKind = field === "boardId" ? "boards" : field === "calendarId" ? "calendars" : "folders";
      if (value) await get("workspaceGuards", guardId(parentKind, value));
      const result = await request(":runQuery", { method: "POST", body: JSON.stringify({ structuredQuery: { from: [{ collectionId: collection }], where: { fieldFilter: { field: { fieldPath: field }, op: "EQUAL", value: { stringValue: value } } } } }) });
      return (result ?? []).filter((item: { document?: unknown }) => item.document).map((item: { document: Parameters<typeof document>[0] }) => { const value = document(item.document); return remember(value.name, value)!; });
    },
    async commit(input: { collection: string; id: string; data: Record<string, unknown>; previous: RestDocument | null }[]) {
      const writes = [...input];
      const parents = new Map<string, { parentKind: string; parentId: string }>();
      for (const write of input) {
        const relation = write.collection === "tasks" ? ["boards", "boardId"] : write.collection === "events" ? ["calendars", "calendarId"] : write.collection === "wikiPages" ? ["folders", "folderId"] : write.collection === "folders" ? ["folders", "parentId"] : null;
        if (relation) for (const source of [write.previous?.data, write.data]) {
          const id = source?.[relation[1]];
          if (typeof id === "string" && id) parents.set(guardId(relation[0], id), { parentKind: relation[0], parentId: id });
        }
      }
      for (const [id, parent] of parents) {
        const previous = await get("workspaceGuards", id), now = new Date().toISOString();
        writes.push({ collection: "workspaceGuards", id, previous, data: { ...parent, revision: Number(previous?.data.revision ?? 0) + 1, archived: false, createdBy: previous?.data.createdBy ?? user.email, createdAt: previous?.data.createdAt ?? now, updatedBy: user.email, updatedAt: now } });
      }
      const names = new Set(writes.map((write) => name(write.collection, write.id)));
      const verify = [...reads].filter(([key]) => !names.has(key)).map(([key, item]) => ({ verify: key, currentDocument: item ? { updateTime: item.updateTime } : { exists: false } }));
      // Los guards cambian con cada mutación de un hijo, protegiendo las consultas vacías.
      await request(":commit", { method: "POST", body: JSON.stringify({ writes: [...writes.map((write) => ({ update: { name: name(write.collection, write.id), fields: encodeFields(write.data) }, currentDocument: write.previous ? { updateTime: write.previous.updateTime } : { exists: false } })), ...verify] }) });
    },
  };
}
