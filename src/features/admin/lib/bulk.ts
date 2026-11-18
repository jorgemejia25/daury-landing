/** Acciones masivas sobre tareas y eventos (ver actions/bulk.ts). */
export type BulkKind = "tasks" | "events";
export type BulkAction =
  | { type: "archive" }
  | { type: "restore" }
  | { type: "delete" }
  | { type: "status"; value: string }
  | { type: "priority"; value: string }
  | { type: "assignee"; value: string }
  | { type: "calendar"; value: string };
export type BulkResult = { ok: true; count: number } | { ok: false; error: string };
