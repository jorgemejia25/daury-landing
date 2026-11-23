import { normalizeMeetUrl } from "./meet";
import { isDateOnly } from "./dates";
import { adminAllowedEmails } from "./access";

export const workspaceCollections = ["boards", "tasks", "calendars", "events", "folders", "wikiPages", "whiteboards", "stickyNotes"] as const;
export type WorkspaceCollection = typeof workspaceCollections[number];
export const colors = [{ value: "blue", label: "Azul" }, { value: "violet", label: "Violeta" }, { value: "green", label: "Verde" }, { value: "amber", label: "Ámbar" }, { value: "coral", label: "Coral" }] as const;
export type WorkspaceColor = typeof colors[number]["value"];
export type Column = { name: string; done: boolean };
export type Board = { name: string; description: string; color: WorkspaceColor; columns: Record<string, Column>; columnOrder: string[]; /** Lugar en las pestañas del kanban (1 = primero); sin valor, va después por fecha de creación. */ position?: number };
export type Calendar = { name: string; description: string; color: WorkspaceColor };
/** Pizarra de brainstorm. */
export type Whiteboard = { name: string; description: string; color: WorkspaceColor };
export const stickyColors = [{ value: "yellow", label: "Amarillo" }, { value: "pink", label: "Rosa" }, { value: "blue", label: "Azul" }, { value: "green", label: "Verde" }, { value: "violet", label: "Violeta" }] as const;
/** Colores de trazo para texto, lápiz, figuras y flechas. */
export const strokeColors = [{ value: "ink", label: "Tinta" }, { value: "blue", label: "Azul" }, { value: "coral", label: "Coral" }, { value: "green", label: "Verde" }, { value: "violet", label: "Violeta" }, { value: "amber", label: "Ámbar" }] as const;
export type StickyColor = typeof stickyColors[number]["value"] | typeof strokeColors[number]["value"];
export const elementColorValues: string[] = [...new Set([...stickyColors, ...strokeColors].map((item) => item.value))];
/** Tipos de elemento de la pizarra; sin `kind` (datos anteriores) es un post-it. */
export const elementKinds = ["note", "text", "pen", "rect", "ellipse", "arrow"] as const;
export type ElementKind = typeof elementKinds[number];
export const textSizes = ["sm", "md", "lg", "xl"] as const;
/** Estilo de un elemento de la pizarra (todas las claves son opcionales). */
export const elementStyleOptions = {
  arrowType: ["straight", "elbow", "curved"],
  head: ["none", "end", "start", "both"],
  stroke: ["solid", "dashed", "dotted"],
  weight: [1, 2, 4],
  fill: ["none", "soft", "solid"],
  font: ["sans", "display", "mono", "serif"],
  align: ["left", "center", "right"],
} as const;
type StyleOptions = typeof elementStyleOptions;
export type ElementStyle = { [K in keyof StyleOptions]?: StyleOptions[K][number] } & { /** Capa: mayor = encima. */ z?: number };
/** Elemento sobre una pizarra; x e y en píxeles del lienzo (0–4000). Lápiz y flecha guardan puntos relativos a x, y. */
export type StickyNote = { whiteboardId: string; text: string; color: StickyColor; x: number; y: number; kind?: ElementKind; w?: number; h?: number; points?: number[]; size?: typeof textSizes[number]; /** Flechas: elementos que unen (siguen al moverlos). */ from?: string; to?: string; style?: ElementStyle };
export const canvasSize = 4000;
export type Folder = { name: string; parentId: string; color: WorkspaceColor };
export type Page = { title: string; description: string; folderId: string; tags: string[] };
export type Comment = { id: string; body: string; author: string; createdAt: string };
export type WorkTask = { title: string; description: string; boardId: string; status: string; priority: "high" | "medium" | "low"; type: "task" | "bug" | "story" | "epic"; assignee: string; dueDate: string; tags: string[]; points: number; articleId: string; checklist: { id: string; title: string; done: boolean; createdBy?: string; createdAt?: string }[]; comments: Comment[] ; /** Orden manual dentro de la columna (menor = arriba); sin valor, por fecha de creación. */ rank?: number };
export type WorkEvent = { title: string; description: string; calendarId: string; allDay: boolean; start: string; end: string; location: string; articleId: string; meetUrl?: string; /** Aparece en el módulo de reuniones. Sin valor (datos anteriores): si tiene Meet. */ meeting?: boolean; /** Copia en el Google Calendar de `owner`; `revision` es la del evento cuando se envió. */ google?: GoogleLink };
export type GoogleLink = { id: string; url: string; owner: string; revision: number };
export type WorkspaceData = { boards: Board; tasks: WorkTask; calendars: Calendar; events: WorkEvent; folders: Folder; wikiPages: Page; wikiContent: { body: string }; whiteboards: Whiteboard; stickyNotes: StickyNote; financeEntries: import("./finance").FinanceData; meetings: import("./meetings").MeetingData; meetingQuestions: import("./meetings").MeetingQuestion };
export type Metadata = { revision: number; archived: boolean; createdAt: string; updatedAt: string; createdBy: string; updatedBy: string };
export type Entity<C extends keyof WorkspaceData> = WorkspaceData[C] & Metadata & { id: string };
export type AnyEntity = { [C in WorkspaceCollection]: Entity<C> }[WorkspaceCollection];
export type ActionResult = { ok: true; id: string; revision: number } | { ok: false; error: string };
export type SaveRequest = { collection: WorkspaceCollection; id?: string; revision?: number; data: unknown };
export const defaultColumns: Pick<Board, "columns" | "columnOrder"> = {
  columns: { todo: { name: "Pendiente", done: false }, progress: { name: "En curso", done: false }, review: { name: "En revisión", done: false }, done: { name: "Hecho", done: true } },
  columnOrder: ["todo", "progress", "review", "done"],
};
export const taskTypes = [{ value: "task", label: "Tarea" }, { value: "bug", label: "Error" }, { value: "story", label: "Historia" }, { value: "epic", label: "Épica" }];
export const memberOptions = [{ value: "", label: "Sin asignar" }, ...adminAllowedEmails.map((email) => ({ value: email, label: email }))];
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Los datos no son válidos.");
  return value as Record<string, unknown>;
}
export function validId(id: unknown): asserts id is string {
  if (typeof id !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id)) throw new Error("Identificador no válido.");
}
function text(data: Record<string, unknown>, key: string, max = 200, required = false) {
  const value = data[key];
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new Error(`Revisa ${key}: ${required ? "es obligatorio y " : ""}admite hasta ${max} caracteres.`);
  return value.trim();
}
function reference(data: Record<string, unknown>, key: string, required = false) {
  const value = text(data, key, 80, required); if (value) validId(value); return value;
}
function choice<T extends string>(value: unknown, options: readonly T[]): T {
  if (typeof value !== "string" || !options.includes(value as T)) throw new Error("Una de las opciones seleccionadas no es válida.");
  return value as T;
}
function tags(value: unknown) {
  if (!Array.isArray(value) || value.length > 12 || value.some((tag) => typeof tag !== "string" || !tag.trim() || tag.length > 40)) throw new Error("Usa hasta 12 etiquetas de 40 caracteres.");
  return [...new Set((value as string[]).map((tag) => tag.trim()))];
}
function parseStyle(value: unknown): ElementStyle {
  const style = object(value), result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(style)) {
    if (key === "z") { if (!Number.isInteger(item) || Math.abs(Number(item)) > 1_000_000) throw new Error("La capa no es válida."); result.z = item; continue; }
    const allowed = (elementStyleOptions as Record<string, readonly unknown[]>)[key];
    if (!allowed || !allowed.includes(item)) throw new Error("El estilo no es válido.");
    result[key] = item;
  }
  return result as ElementStyle;
}
function rank(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("El orden de la tarea no es válido.");
  return value;
}
export function parseWorkspaceData<C extends WorkspaceCollection>(collection: C, input: unknown): WorkspaceData[C] & { body?: string } {
  const data = object(input);
  const color = () => choice(data.color, colors.map((color) => color.value));
  let result: object;
  if (collection === "boards") {
    const columns = object(data.columns);
    const order = data.columnOrder;
    if (!Array.isArray(order) || order.length < 1 || order.length > 12 || new Set(order).size !== order.length || Object.keys(columns).length !== order.length) throw new Error("El tablero necesita entre 1 y 12 columnas diferentes.");
    const normalized: Record<string, Column> = {};
    for (const id of order) { validId(id); const column = object(columns[id]); if (typeof column.done !== "boolean") throw new Error("Revisa las columnas completadas."); normalized[id] = { name: text(column, "name", 60, true), done: column.done }; }
    if (data.position !== undefined && (!Number.isInteger(data.position) || Number(data.position) < 1 || Number(data.position) > 99)) throw new Error("La posición del tablero debe ser de 1 a 99.");
    result = { name: text(data, "name", 120, true), description: text(data, "description", 3000), color: color(), columns: normalized, columnOrder: order, ...(data.position === undefined ? {} : { position: Number(data.position) }) };
  } else if (collection === "whiteboards") {
    result = { name: text(data, "name", 120, true), description: text(data, "description", 3000), color: color() };
  } else if (collection === "stickyNotes") {
    const point = (key: string) => { const value = data[key]; if (!Number.isInteger(value) || Number(value) < 0 || Number(value) > canvasSize) throw new Error("La posición del post-it no es válida."); return Number(value); };
    if (typeof data.text !== "string") throw new Error("El texto del post-it no es válido.");
    const base = { whiteboardId: reference(data, "whiteboardId", true), text: text(data, "text", 500), color: choice(data.color, elementColorValues), x: point("x"), y: point("y") };
    if (data.kind === undefined) result = base;
    else {
      const points = data.points;
      if (!Array.isArray(points) || points.length > 1000 || points.length % 2 || points.some((value) => !Number.isInteger(value) || Math.abs(value) > canvasSize)) throw new Error("El trazo no es válido.");
      const link = (key: "from" | "to") => (data[key] === undefined ? "" : reference(data, key));
      const bound = data.style !== undefined ? { from: link("from"), to: link("to"), style: parseStyle(data.style) } : data.from !== undefined || data.to !== undefined ? { from: link("from"), to: link("to") } : {};
      result = { ...base, kind: choice(data.kind, elementKinds), w: point("w"), h: point("h"), points: points as number[], size: choice(data.size, textSizes), ...bound };
    }
  } else if (collection === "calendars") {
    result = { name: text(data, "name", 120, true), description: text(data, "description", 3000), color: color() };
  } else if (collection === "folders") {
    result = { name: text(data, "name", 120, true), parentId: reference(data, "parentId"), color: color() };
  } else if (collection === "wikiPages") {
    result = { title: text(data, "title", 200, true), description: text(data, "description", 3000), folderId: reference(data, "folderId"), tags: tags(data.tags), body: (text(data, "body", 100000, true), data.body as string) };
  } else if (collection === "tasks") {
    const dueDate = text(data, "dueDate", 10);
    if (dueDate && !isDateOnly(dueDate)) throw new Error("La fecha límite no es válida.");
    const assignee = text(data, "assignee", 200);
    if (assignee && !adminAllowedEmails.some((email) => email === assignee)) throw new Error("El responsable debe ser una cuenta autorizada.");
    if (!Number.isInteger(data.points) || Number(data.points) < 0 || Number(data.points) > 100) throw new Error("La estimación debe ser de 0 a 100 puntos.");
    if (!Array.isArray(data.checklist) || data.checklist.length > 30) throw new Error("Usa hasta 30 subtareas.");
    const checklist = data.checklist.map((item) => { const row = object(item); validId(row.id); if (typeof row.done !== "boolean") throw new Error("Subtarea inválida."); return { id: row.id, title: text(row, "title", 200, true), done: row.done }; });
    if (new Set(checklist.map((item) => item.id)).size !== checklist.length) throw new Error("Las subtareas tienen identificadores repetidos.");
    result = { title: text(data, "title", 200, true), description: text(data, "description", 12000), boardId: reference(data, "boardId", true), status: reference(data, "status", true), priority: choice(data.priority, ["high", "medium", "low"]), type: choice(data.type, ["task", "bug", "story", "epic"]), assignee, dueDate, tags: tags(data.tags), points: data.points, articleId: reference(data, "articleId"), checklist, comments: [], ...(data.rank === undefined ? {} : { rank: rank(data.rank) }) };
  } else {
    if (typeof data.allDay !== "boolean") throw new Error("Selecciona el tipo de evento.");
    const start = text(data, "start", 40, true), end = text(data, "end", 40, true);
    const validTimestamp = (value: string) => isDateOnly(value.slice(0, 10)) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
    if (data.allDay ? !isDateOnly(start) || !isDateOnly(end) || end <= start : !validTimestamp(start) || !validTimestamp(end) || Date.parse(end) <= Date.parse(start)) throw new Error("El fin debe ser posterior al inicio. En eventos de día completo, el fin es exclusivo.");
    result = { title: text(data, "title", 200, true), description: text(data, "description", 12000), calendarId: reference(data, "calendarId", true), allDay: data.allDay, start, end, location: text(data, "location", 500), articleId: reference(data, "articleId"), meetUrl: normalizeMeetUrl(data.meetUrl) };
    if (data.meeting !== undefined && typeof data.meeting !== "boolean") throw new Error("Indica si el evento es una reunión.");
    result = { ...result, meeting: data.meeting ?? Boolean((result as WorkEvent).meetUrl) };
  }
  return result as WorkspaceData[C] & { body?: string };
}
export function folderDescendants(folders: Entity<"folders">[], id: string): Set<string> {
  const descendants = new Set([id]);
  for (let i = 0; i < folders.length; i++) { let changed = false; for (const folder of folders) if (descendants.has(folder.parentId) && !descendants.has(folder.id)) { descendants.add(folder.id); changed = true; } if (!changed) break; }
  return descendants;
}

export function folderPath(folders: Entity<"folders">[], id: string): string {
  const names: string[] = [], visited = new Set<string>();
  let folder = folders.find((entry) => entry.id === id);
  while (folder && !visited.has(folder.id)) { visited.add(folder.id); names.unshift(folder.name); folder = folders.find((entry) => entry.id === folder!.parentId); }
  return names.join(" / ");
}
