/** Acciones masivas sobre tareas y eventos (ver actions/bulk.ts). */
export type BulkKind = "tasks" | "events" | "stickyNotes";
export type BulkAction =
  | { type: "archive" }
  | { type: "restore" }
  | { type: "delete" }
  | { type: "status"; value: string }
  | { type: "priority"; value: string }
  | { type: "assignee"; value: string }
  | { type: "calendar"; value: string }
  /** Post-its: varias posiciones en un solo commit, color o texto. */
  | { type: "stickyPositions"; positions: { id: string; x: number; y: number }[] }
  | { type: "stickyColor"; value: string }
  | { type: "stickyText"; value: string; h?: number }
  /** Tamaño y posición de figuras y textos. */
  | { type: "stickyBox"; boxes: { id: string; x: number; y: number; w: number; h: number }[] }
  /** Una flecha: extremos (puntos relativos) y elementos a los que se une. */
  /** Cambios de varios elementos (validados completos en el servidor): base de deshacer y rehacer. */
  | { type: "stickyPatch"; items: { id: string; changes: Record<string, unknown> }[] }
  | { type: "stickyArrow"; x: number; y: number; w: number; h: number; points: number[]; from: string; to: string };
export type BulkResult = { ok: true; count: number } | { ok: false; error: string };
