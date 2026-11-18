"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { Menu, MenuContent, MenuContextTrigger, MenuItem, MenuSeparator, MenuSub, MenuSubContent, MenuSubTrigger, MenuTrigger } from "@ui-sdk/react/menu";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/react/toolbar";
import { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger } from "@ui-sdk/react/tooltip";
import { Archive, ArchiveRestore, ChevronRight, Circle, Copy, Eraser, Hand, LayoutGrid, Lightbulb, MousePointer2, MousePointerClick, MoveUpRight, Palette, Pencil, PenLine, Plus, Square, SquarePlus, StickyNote as StickyIcon, Trash2, Type, X, CircleHelp, AlignStartVertical, AlignCenterVertical, AlignEndVertical, AlignStartHorizontal, AlignCenterHorizontal, AlignEndHorizontal, AlignHorizontalSpaceAround, AlignVerticalSpaceAround } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { Button } from "@/ui/atoms/Button";
import { StatusDot } from "@/ui/atoms/StatusDot";
import { ActionMenu } from "@/ui/molecules/ActionMenu";
import menuStyles from "@/ui/molecules/ActionMenu.styles";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { saveWorkspaceItem } from "@/features/admin/actions/workspace";
import { bulkWorkspaceAction } from "@/features/admin/actions/bulk";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { getAdminFirebase } from "@/features/admin/lib/firebase-client";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import type { BulkAction } from "@/features/admin/lib/bulk";
import { personName } from "@/features/admin/lib/people";
import { canvasSize, colors as boardColors, stickyColors, strokeColors, textSizes, type ElementKind, type Entity, type StickyColor, type StickyNote, type WorkspaceColor } from "@/features/admin/lib/workspace";
import { toggleArchive, WorkspaceStatus } from "./WorkspaceParts";
import boardStyles from "./Board.styles";

const NOTE_W = 200, NOTE_H = 176, GRID = 24;
type Element = Entity<"stickyNotes">;
type TextSize = typeof textSizes[number];
type Tool = "select" | "hand" | "note" | "text" | "pen" | "rect" | "ellipse" | "arrow" | "eraser";
const tools: { value: Tool; label: string; key: string; icon: ReactNode }[] = [
  { value: "select", label: "Seleccionar", key: "v", icon: <MousePointer2 size={17} aria-hidden="true" /> },
  { value: "hand", label: "Mover el lienzo", key: "h", icon: <Hand size={17} aria-hidden="true" /> },
  { value: "note", label: "Post-it", key: "n", icon: <StickyIcon size={17} aria-hidden="true" /> },
  { value: "text", label: "Texto", key: "t", icon: <Type size={17} aria-hidden="true" /> },
  { value: "pen", label: "Lápiz", key: "p", icon: <PenLine size={17} aria-hidden="true" /> },
  { value: "rect", label: "Rectángulo", key: "r", icon: <Square size={17} aria-hidden="true" /> },
  { value: "ellipse", label: "Elipse", key: "o", icon: <Circle size={17} aria-hidden="true" /> },
  { value: "arrow", label: "Flecha", key: "a", icon: <MoveUpRight size={17} aria-hidden="true" /> },
  { value: "eraser", label: "Borrador", key: "e", icon: <Eraser size={17} aria-hidden="true" /> },
];
/** Papel de cada post-it (legible en tema claro y oscuro). */
const paper: Record<string, { bg: string; fold: string; ink: string }> = {
  yellow: { bg: "#FFE98F", fold: "#F5D65C", ink: "#3A2F06" },
  pink: { bg: "#FFC9D6", fold: "#F8A9BC", ink: "#4A1323" },
  blue: { bg: "#C9DCFF", fold: "#A9C4FA", ink: "#0F2557" },
  green: { bg: "#C8EFCF", fold: "#A3E0AF", ink: "#0E3B19" },
  violet: { bg: "#E2D6FF", fold: "#CBB8FA", ink: "#2A1563" },
};
const paperOf = (color: string) => paper[color] ?? paper[{ coral: "pink", amber: "yellow" }[color] ?? "yellow"];
/** Color de trazo (sigue el tema) para texto, lápiz, figuras y flechas. */
const strokeOf = (color: string) => `var(--${{ ink: "ink", yellow: "amber", pink: "coral" }[color] ?? color})`;
const fontPx: Record<TextSize, number> = { sm: 16, md: 22, lg: 32 };
const isNote = (element: Pick<StickyNote, "kind">) => !element.kind || element.kind === "note";
const canHoldText = (element: Pick<StickyNote, "kind">) => isNote(element) || element.kind === "text" || element.kind === "rect" || element.kind === "ellipse";
const resizable = (element: Pick<StickyNote, "kind">) => element.kind === "text" || element.kind === "rect" || element.kind === "ellipse";
const boxOf = (element: StickyNote) => ({ x: element.x, y: element.y, w: isNote(element) ? NOTE_W : element.w ?? 0, h: isNote(element) ? NOTE_H : element.h ?? 0 });
const clampTo = (value: number, size: number) => Math.round(Math.min(Math.max(value, 0), canvasSize - size));
const snap = (value: number, free = false) => (free ? Math.round(value) : Math.round(value / GRID) * GRID);
/** Alto de un texto según su ancho, para la selección por área. */
const textHeight = (text: string, width: number, size: TextSize) => {
  const px = fontPx[size], perLine = Math.max(1, Math.floor(width / (px * 0.55)));
  const lines = (text || " ").split("\n").reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / perLine)), 0);
  return Math.round(lines * px * 1.3 + 8);
};
/** Trazo suave con curvas por los puntos medios. */
const smoothPath = (points: number[]) => {
  if (points.length < 4) return points.length === 2 ? `M${points[0]} ${points[1]}l0.1 0` : "";
  let path = `M${points[0]} ${points[1]}`;
  for (let i = 2; i < points.length - 2; i += 2) path += ` Q${points[i]} ${points[i + 1]} ${(points[i] + points[i + 2]) / 2} ${(points[i + 1] + points[i + 3]) / 2}`;
  return `${path} L${points.at(-2)} ${points.at(-1)}`;
};
type Point = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };
const centerOf = (box: Box): Point => ({ x: box.x + box.w / 2, y: box.y + box.h / 2 });
/** Punto del borde de un elemento en dirección a otro punto, con un pequeño margen (como Excalidraw). */
const edgeToward = (element: Pick<StickyNote, "kind">, box: Box, toward: Point): Point => {
  const c = centerOf(box), dx = toward.x - c.x, dy = toward.y - c.y, length = Math.hypot(dx, dy);
  if (!length) return c;
  const t = element.kind === "ellipse"
    ? 1 / Math.sqrt((dx / Math.max(box.w / 2, 1)) ** 2 + (dy / Math.max(box.h / 2, 1)) ** 2)
    : Math.min(Math.abs(box.w / 2 / (dx || 1e-9)), Math.abs(box.h / 2 / (dy || 1e-9)));
  const gap = 8 / length;
  return { x: c.x + dx * (t + gap), y: c.y + dy * (t + gap) };
};
const bindable = (element?: Pick<StickyNote, "kind">) => Boolean(element && (isNote(element) || element.kind === "text" || element.kind === "rect" || element.kind === "ellipse"));
const SNAP = 6;
const tilt = (id: string) => ((Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 7) - 3) * 0.45;
const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const keyHint = (text: string) => <span className="ml-auto pl-[16px] text-ink-soft text-[12px] font-normal font-mono">{text}</span>;
const toolClass = "inline-grid place-items-center min-w-[34px] h-[34px] px-[8px] rounded-[9px] border-0 bg-transparent text-ink cursor-pointer hover:bg-[var(--surface-2)] data-[pressed]:bg-[var(--blue-soft)] data-[pressed]:text-[var(--blue)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--blue)]";
const swatchClass = "grid place-items-center w-[26px] h-[26px] rounded-[7px] border-0 bg-transparent cursor-pointer hover:bg-[var(--surface-2)] data-[pressed]:[box-shadow:inset_0_0_0_1.5px_var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--blue)]";
const tipClass = "z-[90] flex items-center gap-[8px] px-[8px] py-[5px] rounded-[7px] bg-[var(--ink)] text-[var(--bg)] text-[12px] font-medium leading-[1.2] [box-shadow:var(--shadow-pop)]";
const barClass = "flex items-center gap-[2px] p-[4px] rounded-[12px] border border-rule bg-surface [box-shadow:var(--shadow-pop)]";
const sep = <ToolbarSeparator className="w-px h-[20px] mx-[4px] bg-[var(--rule-strong)]" />;

/** Botón o interruptor con tooltip de UI SDK: nombre y, si hay, atajo de teclado. */
function Tip({ label, shortcut, children }: { label: string; shortcut?: string; children: React.ReactElement<Record<string, unknown>> }) {
  return (
    <Tooltip shortcut={shortcut} delay={250}>
      <TooltipTrigger render={children} />
      <TooltipContent className={tipClass} sideOffset={8}>
        {label}
        {shortcut ? <TooltipShortcut className="font-mono text-[11px] opacity-70" /> : null}
      </TooltipContent>
    </Tooltip>
  );
}
const swatch = (color: string, note = false) => (
  <span aria-hidden="true" className="block w-[15px] h-[15px] rounded-[5px] [box-shadow:inset_0_0_0_1px_rgba(0,0,0,0.12)]" style={{ background: note ? paperOf(color).bg : strokeOf(color) }} />
);

type Pending = Partial<StickyNote> & { until: number };
type Gesture =
  | { type: "move"; ids: string[]; origin: Record<string, { x: number; y: number }>; sx: number; sy: number; dx: number; dy: number; moved: boolean; free: boolean }
  | { type: "marquee"; x0: number; y0: number; x1: number; y1: number; base: string[] }
  | { type: "pan"; sx: number; sy: number; left: number; top: number }
  | { type: "draw"; kind: "pen"; points: number[] }
  | { type: "shape"; kind: "rect" | "ellipse" | "arrow"; x0: number; y0: number; x1: number; y1: number; free: boolean; from: string; to: string }
  | { type: "arrowEnd"; id: string; end: "start" | "end"; x: number; y: number; target: string }
  | { type: "erase"; ids: string[] }
  | { type: "resize"; id: string; box: { x: number; y: number; w: number; h: number }; sx: number; sy: number; dx: number; dy: number };

/** Brainstorm: pizarras con post-its, texto, lápiz, figuras y flechas. Todo se edita en el lugar. */
export function BrainstormWorkspace() {
  const { params, update } = useAdminQuery();
  const whiteboards = useWorkspace("whiteboards");
  const archived = params.get("archived") === "yes";
  const options = whiteboards.items.filter((item) => item.archived === archived).toSorted((a, b) => a.createdAt.localeCompare(b.createdAt));
  const board = options.find((item) => item.id === params.get("pizarra")) ?? options[0];
  const notes = useWorkspace("stickyNotes", "whiteboardId", board?.id);
  const editable = Boolean(board && !board.archived);

  const [tool, setTool] = useState<Tool>("select");
  const [noteColor, setNoteColor] = useState<string>("yellow");
  const [strokeColor, setStrokeColor] = useState<string>("ink");
  const [textSize, setTextSize] = useState<TextSize>("md");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, Pending>>({});
  /** Elementos recién creados que se muestran antes de que Firestore los confirme. */
  const [optimistic, setOptimistic] = useState<Record<string, Element>>({});
  /** Una sola escritura a la vez por cliente: evita choques en el registro de control de la pizarra. */
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const enqueue = <T,>(task: () => Promise<T>) => { const next = queue.current.then(task, task); queue.current = next.catch(() => undefined); return next; };
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [gesture, setGesture] = useState<Gesture | null>(null);
  const [spacePan, setSpacePan] = useState(false);
  const [menuTarget, setMenuTarget] = useState<"notes" | "canvas">("canvas");
  const [focusTitle, setFocusTitle] = useState(false);
  const menuPoint = useRef({ x: 0, y: 0 });
  const stage = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLInputElement>(null);

  // Lo que ya llegó de Firestore deja de ser provisional.
  // Se compara por ids (no por referencia: el hook entrega una lista nueva mientras carga).
  const serverIds = notes.items.map((note) => note.id).join("|");
  const [seenIds, setSeenIds] = useState(serverIds);
  if (seenIds !== serverIds) {
    setSeenIds(serverIds);
    if (Object.keys(optimistic).some((id) => notes.items.some((note) => note.id === id))) setOptimistic((current) => Object.fromEntries(Object.entries(current).filter(([id]) => !notes.items.some((note) => note.id === id))));
  }
  const live = useMemo(() => [...notes.items, ...Object.values(optimistic).filter((item) => !notes.items.some((note) => note.id === item.id))].filter((note) => !note.archived && !removed.has(note.id)).map((note) => {
    const local = pending[note.id];
    return local && note.revision < local.until ? { ...note, ...local } : note;
  }).toSorted((a, b) => a.createdAt.localeCompare(b.createdAt)), [notes.items, optimistic, pending, removed]);
  const byId = useMemo(() => new Map(live.map((note) => [note.id, note])), [live]);
  const selection = live.filter((note) => selected.has(note.id));
  const width = Math.max(2400, ...live.map((note) => { const box = boxOf(note); return box.x + box.w + 320; }));
  const height = Math.max(1500, ...live.map((note) => { const box = boxOf(note); return box.y + box.h + 320; }));
  const activeTool: Tool = spacePan ? "hand" : tool;

  // Al mover: imán a los bordes y centros de otros elementos (con guías); si no hay, a la cuadrícula.
  let shiftX = 0, shiftY = 0;
  const guides: { x1: number; y1: number; x2: number; y2: number }[] = [];
  if (gesture?.type === "move" && gesture.moved) {
    shiftX = gesture.dx; shiftY = gesture.dy;
    const moving = gesture.ids.map((id) => byId.get(id)).filter((note): note is Element => Boolean(note) && note!.kind !== "arrow");
    if (moving.length && !gesture.free) {
      const boxes = moving.map((note) => ({ ...boxOf(note), ...gesture.origin[note.id] }));
      const left = Math.min(...boxes.map((b) => b.x)), top = Math.min(...boxes.map((b) => b.y));
      const union = { x: left, y: top, w: Math.max(...boxes.map((b) => b.x + b.w)) - left, h: Math.max(...boxes.map((b) => b.y + b.h)) - top };
      const raw = { ...union, x: union.x + gesture.dx, y: union.y + gesture.dy };
      const others = live.filter((note) => !gesture.ids.includes(note.id) && note.kind !== "arrow" && note.kind !== "pen").map(boxOf);
      const lines = (b: Box, axis: "x" | "y") => (axis === "x" ? [b.x, b.x + b.w / 2, b.x + b.w] : [b.y, b.y + b.h / 2, b.y + b.h]);
      for (const axis of ["x", "y"] as const) {
        let best: { d: number; line: number; target: Box } | null = null;
        for (const target of others) for (const a of lines(raw, axis)) for (const b of lines(target, axis)) if (Math.abs(b - a) <= SNAP && (!best || Math.abs(b - a) < Math.abs(best.d))) best = { d: b - a, line: b, target };
        if (axis === "x") {
          if (best) { shiftX = gesture.dx + best.d; guides.push({ x1: best.line, y1: Math.min(raw.y, best.target.y) - 12, x2: best.line, y2: Math.max(raw.y + raw.h, best.target.y + best.target.h) + 12 }); }
          else shiftX = snap(union.x + gesture.dx) - union.x;
        } else {
          if (best) { shiftY = gesture.dy + best.d; guides.push({ x1: Math.min(raw.x, best.target.x) - 12, y1: best.line, x2: Math.max(raw.x + raw.w, best.target.x + best.target.w) + 12, y2: best.line }); }
          else shiftY = snap(union.y + gesture.dy) - union.y;
        }
      }
    }
  }
  /** Caja en pantalla: con el gesto en curso aplicado (mover o cambiar tamaño). */
  const boxNow = (note: Element) => {
    const box = boxOf(note);
    if (gesture?.type === "move" && gesture.moved && gesture.ids.includes(note.id)) {
      const origin = gesture.origin[note.id];
      return { ...box, x: clampTo(origin.x + shiftX, box.w), y: clampTo(origin.y + shiftY, box.h) };
    }
    if (gesture?.type === "resize" && gesture.id === note.id) {
      const w = Math.max(note.kind === "text" ? 80 : 32, snap(gesture.box.w + gesture.dx));
      const h = note.kind === "text" ? textHeight(note.text, w, note.size ?? "md") : Math.max(32, snap(gesture.box.h + gesture.dy));
      return { ...gesture.box, w: Math.min(w, canvasSize - gesture.box.x), h: Math.min(h, canvasSize - gesture.box.y) };
    }
    return box;
  };

  /** Extremos de una flecha: si está unida a elementos, sale y llega a sus bordes y los sigue al moverlos. */
  const arrowEnds = (arrow: Element) => {
    const pts = arrow.points?.length === 4 ? arrow.points : [0, 0, arrow.w ?? 0, arrow.h ?? 0];
    let start: Point = { x: arrow.x + pts[0], y: arrow.y + pts[1] }, end: Point = { x: arrow.x + pts[2], y: arrow.y + pts[3] };
    let fromEl = arrow.from ? byId.get(arrow.from) : undefined, toEl = arrow.to ? byId.get(arrow.to) : undefined;
    if (!bindable(fromEl)) fromEl = undefined;
    if (!bindable(toEl)) toEl = undefined;
    if (gesture?.type === "move" && gesture.moved && gesture.ids.includes(arrow.id)) {
      // Si la flecha se mueve sin el elemento al que estaba unida, se suelta de él.
      if (fromEl && !gesture.ids.includes(fromEl.id)) fromEl = undefined;
      if (toEl && !gesture.ids.includes(toEl.id)) toEl = undefined;
      if (!fromEl) start = { x: start.x + shiftX, y: start.y + shiftY };
      if (!toEl) end = { x: end.x + shiftX, y: end.y + shiftY };
    }
    if (gesture?.type === "arrowEnd" && gesture.id === arrow.id) {
      const target = gesture.target ? byId.get(gesture.target) : undefined;
      if (gesture.end === "start") { fromEl = target; start = { x: gesture.x, y: gesture.y }; } else { toEl = target; end = { x: gesture.x, y: gesture.y }; }
    }
    const fromBox = fromEl ? boxNow(fromEl) : undefined, toBox = toEl ? boxNow(toEl) : undefined;
    const ref0 = fromBox ? centerOf(fromBox) : start, ref1 = toBox ? centerOf(toBox) : end;
    return { start: fromEl && fromBox ? edgeToward(fromEl, fromBox, ref1) : start, end: toEl && toBox ? edgeToward(toEl, toBox, ref0) : end, from: fromEl?.id ?? "", to: toEl?.id ?? "" };
  };
  const arrowBox = (arrow: Element): Box => { const { start, end } = arrowEnds(arrow); return { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), w: Math.abs(end.x - start.x), h: Math.abs(end.y - start.y) }; };
  const hitBox = (note: Element) => (note.kind === "arrow" ? arrowBox(note) : boxOf(note));

  const boardId = board?.id;
  const [seenBoard, setSeenBoard] = useState(boardId);
  if (seenBoard !== boardId) { setSeenBoard(boardId); setSelected(new Set()); setEditingId(null); }
  useEffect(() => {
    if (!focusTitle || !title.current) return;
    title.current.focus();
    title.current.select();
  }, [focusTitle, boardId]);

  // ——— Persistencia: cambios al instante, confirmados por Firestore ———
  function applyLocal(changes: Record<string, Partial<StickyNote>>) {
    setPending((current) => {
      const next = { ...current };
      for (const [id, values] of Object.entries(changes)) {
        const revision = notes.items.find((note) => note.id === id)?.revision ?? (optimistic[id] ? 1 : undefined);
        if (revision !== undefined) next[id] = { ...next[id], ...values, until: Math.max(next[id]?.until ?? 0, revision) + 1 };
      }
      return next;
    });
  }
  async function run(ids: string[], action: BulkAction, fallback: string) {
    if (!ids.length) return true;
    setError("");
    try {
      const result = await enqueue(() => bulkWorkspaceAction("stickyNotes", ids, action));
      if (result.ok) return true;
      setError(result.error);
    } catch {
      setError(fallback);
    }
    setPending((current) => { const next = { ...current }; for (const id of ids) delete next[id]; return next; });
    return false;
  }
  function move(positions: { id: string; x: number; y: number }[]) {
    const changed = positions.filter((item) => { const note = byId.get(item.id); return note && (note.x !== item.x || note.y !== item.y); });
    if (!changed.length) return;
    applyLocal(Object.fromEntries(changed.map(({ id, x, y }) => [id, { x, y }])));
    void run(changed.map((item) => item.id), { type: "stickyPositions", positions: changed }, "No se pudieron mover los elementos.");
  }
  function resize(id: string, box: { x: number; y: number; w: number; h: number }) {
    applyLocal({ [id]: box });
    void run([id], { type: "stickyBox", boxes: [{ id, ...box }] }, "No se pudo cambiar el tamaño.");
  }
  function recolor(ids: string[], color: string) {
    const changed = ids.filter((id) => byId.get(id)?.color !== color);
    if (!changed.length) return;
    applyLocal(Object.fromEntries(changed.map((id) => [id, { color: color as StickyColor }])));
    void run(changed, { type: "stickyColor", value: color }, "No se pudo cambiar el color.");
  }
  function retext(id: string, text: string) {
    const note = byId.get(id);
    if (!note) return;
    if (note.kind === "text" && !text.trim()) { void remove([id]); return; }
    const h = note.kind === "text" ? textHeight(text, note.w ?? 240, note.size ?? "md") : undefined;
    if (note.text === text && (h === undefined || h === note.h)) return;
    applyLocal({ [id]: { text, ...(h === undefined ? {} : { h }) } });
    void run([id], { type: "stickyText", value: text, ...(h === undefined ? {} : { h }) }, "No se pudo guardar el texto.");
  }
  async function remove(ids: string[]) {
    if (!ids.length) return;
    setRemoved((current) => new Set([...current, ...ids]));
    setSelected(new Set());
    setEditingId(null);
    if (!(await run(ids, { type: "delete" }, "No se pudieron eliminar los elementos."))) setRemoved((current) => { const next = new Set(current); for (const id of ids) next.delete(id); return next; });
  }
  /** Crea al instante con un id del navegador; Firestore lo confirma en segundo plano, en orden. */
  function create(items: Omit<StickyNote, "whiteboardId">[], edit = false) {
    if (!board || !editable || !items.length) return [];
    setError("");
    const now = new Date().toISOString();
    let email = "";
    try { email = getAdminFirebase().auth.currentUser?.email ?? ""; } catch { /* sin Firebase (pruebas): el servidor pone el autor real */ }
    const created = items.map((item) => ({ ...item, whiteboardId: board.id, id: crypto.randomUUID(), revision: 0, archived: false, createdAt: now, updatedAt: now, createdBy: email, updatedBy: email }) as Element);
    setOptimistic((current) => ({ ...current, ...Object.fromEntries(created.map((item) => [item.id, item])) }));
    setSelected(new Set(created.map((item) => item.id)));
    if (edit && created.length === 1) setEditingId(created[0].id);
    for (const item of created) {
      const { id, whiteboardId, text, color, x, y, kind, w, h, points, size, from, to } = item;
      const data = { whiteboardId, text, color, x, y, ...(kind ? { kind, w, h, points, size } : {}), ...(from !== undefined || to !== undefined ? { from: from ?? "", to: to ?? "" } : {}) };
      void enqueue(() => saveWorkspaceItem({ collection: "stickyNotes", id, revision: 0, data })).then((result) => {
        if (!result.ok) throw new Error(result.error);
      }).catch(() => {
        setOptimistic((current) => { const next = { ...current }; delete next[id]; return next; });
        setError("No se pudo guardar un elemento nuevo. Revisa tu conexión.");
      });
    }
    return created.map((item) => item.id);
  }
  const element = (kind: Exclude<ElementKind, "note">, x: number, y: number, w: number, h: number, points: number[] = []): Omit<StickyNote, "whiteboardId"> =>
    ({ text: "", color: strokeColor as StickyColor, kind, x: clampTo(x, w), y: clampTo(y, h), w, h, points, size: textSize });
  function addNote(x: number, y: number) {
    create([{ text: "", color: noteColor as StickyColor, x: clampTo(snap(x - NOTE_W / 2), NOTE_W), y: clampTo(snap(y - 24), NOTE_H) }], true);
  }
  function addText(x: number, y: number) {
    create([element("text", Math.round(x), Math.round(y - fontPx[textSize] * 0.7), 260, textHeight("", 260, textSize))], true);
  }
  function addInView() {
    const view = scroller.current, nudge = (live.length % 5) * GRID;
    addNote(view ? view.scrollLeft + view.clientWidth / 2 + nudge : 240, view ? view.scrollTop + view.clientHeight / 2 - NOTE_H / 2 + nudge : 120);
  }
  function duplicate(ids: string[]) {
    create(ids.map((id) => byId.get(id)).filter((note): note is Element => Boolean(note)).map(({ text, color, x, y, kind, w, h, points, size }) => {
      const box = boxOf({ x, y, kind, w, h } as StickyNote);
      return { text, color, x: clampTo(x + GRID, box.w), y: clampTo(y + GRID, box.h), ...(kind ? { kind, w, h, points, size } : {}) };
    }));
  }
  function arrange(ids: string[]) {
    const list = ids.map((id) => byId.get(id)).filter((note): note is Element => Boolean(note)).toSorted((a, b) => a.y - b.y || a.x - b.x);
    if (!list.length) return;
    const columns = Math.min(6, Math.ceil(Math.sqrt(list.length)));
    const cellW = Math.max(...list.map((note) => boxOf(note).w)) + GRID, cellH = Math.max(...list.map((note) => boxOf(note).h)) + GRID;
    const x0 = snap(Math.min(...list.map((note) => note.x))), y0 = snap(Math.min(...list.map((note) => note.y)));
    move(list.map((note, index) => ({ id: note.id, x: clampTo(x0 + (index % columns) * cellW, boxOf(note).w), y: clampTo(y0 + Math.floor(index / columns) * cellH, boxOf(note).h) })));
  }

  function saveArrow(id: string, ends: { start: Point; end: Point; from: string; to: string }) {
    const clamp = (value: number) => Math.min(Math.max(Math.round(value), 0), canvasSize);
    const x = clamp(Math.min(ends.start.x, ends.end.x)), y = clamp(Math.min(ends.start.y, ends.end.y));
    const points = [ends.start.x - x, ends.start.y - y, ends.end.x - x, ends.end.y - y].map((value) => Math.max(-canvasSize, Math.min(canvasSize, Math.round(value))));
    const box = { x, y, w: Math.min(Math.max(1, Math.abs(points[2] - points[0])), canvasSize), h: Math.min(Math.max(1, Math.abs(points[3] - points[1])), canvasSize) };
    applyLocal({ [id]: { ...box, points, from: ends.from, to: ends.to } });
    void run([id], { type: "stickyArrow", ...box, points, from: ends.from, to: ends.to }, "No se pudo guardar la flecha.");
  }
  /** Alinear o repartir la selección (las flechas unidas los siguen solas). */
  function align(mode: string) {
    const items = selection.filter((note) => note.kind !== "arrow").map((note) => ({ note, box: boxOf(note) }));
    if (items.length < 2) return;
    const left = Math.min(...items.map((i) => i.box.x)), right = Math.max(...items.map((i) => i.box.x + i.box.w));
    const top = Math.min(...items.map((i) => i.box.y)), bottom = Math.max(...items.map((i) => i.box.y + i.box.h));
    const at = (item: { note: Element; box: Box }, x: number, y: number) => ({ id: item.note.id, x: clampTo(x, item.box.w), y: clampTo(y, item.box.h) });
    if (mode === "left") move(items.map((i) => at(i, left, i.box.y)));
    if (mode === "center") move(items.map((i) => at(i, (left + right) / 2 - i.box.w / 2, i.box.y)));
    if (mode === "right") move(items.map((i) => at(i, right - i.box.w, i.box.y)));
    if (mode === "top") move(items.map((i) => at(i, i.box.x, top)));
    if (mode === "middle") move(items.map((i) => at(i, i.box.x, (top + bottom) / 2 - i.box.h / 2)));
    if (mode === "bottom") move(items.map((i) => at(i, i.box.x, bottom - i.box.h)));
    if (mode === "spread-x" && items.length > 2) {
      const sorted = items.toSorted((a, b) => a.box.x - b.box.x), gap = (right - left - sorted.reduce((sum, i) => sum + i.box.w, 0)) / (sorted.length - 1);
      let cursor = left;
      move(sorted.map((i) => { const position = at(i, cursor, i.box.y); cursor += i.box.w + gap; return position; }));
    }
    if (mode === "spread-y" && items.length > 2) {
      const sorted = items.toSorted((a, b) => a.box.y - b.box.y), gap = (bottom - top - sorted.reduce((sum, i) => sum + i.box.h, 0)) / (sorted.length - 1);
      let cursor = top;
      move(sorted.map((i) => { const position = at(i, i.box.x, cursor); cursor += i.box.h + gap; return position; }));
    }
  }

  // ——— Pizarras ———
  async function saveBoard(changes: Partial<{ name: string; description: string; color: WorkspaceColor }>) {
    if (!board) return;
    const data = { name: board.name, description: board.description, color: board.color, ...changes };
    if (!data.name.trim() || (data.name === board.name && data.description === board.description && data.color === board.color)) return;
    setError("");
    const result = await saveWorkspaceItem({ collection: "whiteboards", id: board.id, revision: board.revision, data }).catch(() => ({ ok: false as const, error: "No se pudo guardar la pizarra." }));
    if (!result.ok) setError(result.error);
  }
  async function newBoard() {
    setError("");
    const color = boardColors[whiteboards.items.length % boardColors.length].value;
    const result = await saveWorkspaceItem({ collection: "whiteboards", data: { name: "Nueva pizarra", description: "", color } }).catch(() => ({ ok: false as const, error: "No se pudo crear la pizarra." }));
    if (!result.ok) { setError(result.error); return; }
    update({ pizarra: result.id, archived: null });
    setFocusTitle(true);
  }
  async function onBoardAction(value: string) {
    if (value === "new") return newBoard();
    if (value === "rename") return setFocusTitle(true);
    if (value === "archived") return update({ archived: archived ? null : "yes", pizarra: null });
    if (value === "archive" && board) return setError(await toggleArchive("whiteboards", board));
    if (value.startsWith("color:")) return saveBoard({ color: value.slice(6) as WorkspaceColor });
  }

  // ——— Puntero ———
  const point = (event: { clientX: number; clientY: number }) => {
    const box = stage.current!.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };
  const elementAt = (target: EventTarget | null) => (target as HTMLElement | null)?.closest<HTMLElement>("[data-note]")?.dataset.note;
  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.button !== 0 && event.button !== 1) || !stage.current) return;
    const target = event.target as HTMLElement;
    if (target.closest("textarea:not([readonly])")) return;
    const { x, y } = point(event);
    const capture = () => event.currentTarget.setPointerCapture(event.pointerId);
    if (activeTool === "hand" || event.button === 1) {
      const view = scroller.current!;
      capture();
      setGesture({ type: "pan", sx: event.clientX, sy: event.clientY, left: view.scrollLeft, top: view.scrollTop });
      return;
    }
    const handle = target.closest<HTMLElement | SVGElement>("[data-handle]")?.getAttribute("data-handle");
    if (handle && editable) {
      const note = selection[0];
      if (note && (handle === "start" || handle === "end")) {
        const ends = arrowEnds(note), pointNow = handle === "start" ? ends.start : ends.end;
        capture();
        setGesture({ type: "arrowEnd", id: note.id, end: handle, x: pointNow.x, y: pointNow.y, target: handle === "start" ? ends.from : ends.to });
      } else if (note) { capture(); setGesture({ type: "resize", id: note.id, box: boxOf(note), sx: x, sy: y, dx: 0, dy: 0 }); }
      return;
    }
    if (editingId) setEditingId(null);
    if (!editable && activeTool !== "select") return;
    if (activeTool === "note") { addNote(x, y); setTool("select"); return; }
    if (activeTool === "text") { addText(x, y); setTool("select"); return; }
    if (activeTool === "pen") { capture(); setSelected(new Set()); setGesture({ type: "draw", kind: "pen", points: [Math.round(x), Math.round(y)] }); return; }
    if (activeTool === "rect" || activeTool === "ellipse" || activeTool === "arrow") {
      const over = elementAt(event.target);
      capture();
      setSelected(new Set());
      setGesture({ type: "shape", kind: activeTool, x0: x, y0: y, x1: x, y1: y, free: event.altKey, from: activeTool === "arrow" && over && bindable(byId.get(over)) ? over : "", to: "" });
      return;
    }
    if (activeTool === "eraser") { capture(); const id = elementAt(event.target); setGesture({ type: "erase", ids: id ? [id] : [] }); return; }
    const id = elementAt(event.target);
    const additive = event.shiftKey || event.metaKey || event.ctrlKey;
    if (id) {
      let next = selected;
      if (additive) { next = new Set(selected); if (next.has(id)) next.delete(id); else next.add(id); }
      else if (!selected.has(id)) next = new Set([id]);
      setSelected(next);
      if (!editable || !next.has(id)) return;
      capture();
      const ids = [...next];
      setGesture({ type: "move", ids, origin: Object.fromEntries(ids.map((item) => [item, { x: byId.get(item)?.x ?? 0, y: byId.get(item)?.y ?? 0 }])), sx: x, sy: y, dx: 0, dy: 0, moved: false, free: event.altKey });
      return;
    }
    if (event.pointerType === "touch") { if (!additive) setSelected(new Set()); return; }
    capture();
    setGesture({ type: "marquee", x0: x, y0: y, x1: x, y1: y, base: additive ? [...selected] : [] });
    if (!additive) setSelected(new Set());
  }
  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!gesture) return;
    const { x, y } = point(event);
    if (gesture.type === "pan") {
      scroller.current!.scrollLeft = gesture.left - (event.clientX - gesture.sx);
      scroller.current!.scrollTop = gesture.top - (event.clientY - gesture.sy);
    } else if (gesture.type === "move") {
      const dx = x - gesture.sx, dy = y - gesture.sy;
      if (!gesture.moved && Math.hypot(dx, dy) < 4) return;
      setGesture({ ...gesture, dx, dy, moved: true, free: event.altKey });
    } else if (gesture.type === "resize") {
      setGesture({ ...gesture, dx: x - gesture.sx, dy: y - gesture.sy });
    } else if (gesture.type === "marquee") {
      const box = { left: Math.min(gesture.x0, x), right: Math.max(gesture.x0, x), top: Math.min(gesture.y0, y), bottom: Math.max(gesture.y0, y) };
      setGesture({ ...gesture, x1: x, y1: y });
      const hits = live.filter((note) => { const b = hitBox(note); return b.x < box.right && b.x + b.w > box.left && b.y < box.bottom && b.y + b.h > box.top; }).map((note) => note.id);
      setSelected(new Set([...gesture.base, ...hits]));
    } else if (gesture.type === "draw") {
      const last = gesture.points.slice(-2);
      if (Math.hypot(x - last[0], y - last[1]) >= 3 && gesture.points.length < 1000) setGesture({ ...gesture, points: [...gesture.points, Math.round(x), Math.round(y)] });
    } else if (gesture.type === "shape") {
      const over = gesture.kind === "arrow" ? elementAt(document.elementFromPoint?.(event.clientX, event.clientY) ?? null) : undefined;
      setGesture({ ...gesture, x1: x, y1: y, free: event.altKey, to: over && over !== gesture.from && bindable(byId.get(over)) ? over : "" });
    } else if (gesture.type === "arrowEnd") {
      const over = elementAt(document.elementFromPoint?.(event.clientX, event.clientY) ?? null);
      setGesture({ ...gesture, x, y, target: over && over !== gesture.id && bindable(byId.get(over)) ? over : "" });
    } else if (gesture.type === "erase") {
      const id = elementAt(document.elementFromPoint?.(event.clientX, event.clientY) ?? null);
      if (id && !gesture.ids.includes(id)) setGesture({ ...gesture, ids: [...gesture.ids, id] });
    }
  }
  function onPointerUp() {
    const done = gesture;
    setGesture(null);
    if (!done) return;
    if (done.type === "move" && done.moved) {
      const arrows = done.ids.map((id) => byId.get(id)).filter((note): note is Element => note?.kind === "arrow");
      move(done.ids.filter((id) => byId.get(id)?.kind !== "arrow").map((id) => { const box = boxNow(byId.get(id)!); return { id, x: box.x, y: box.y }; }));
      for (const arrow of arrows) saveArrow(arrow.id, arrowEnds(arrow));
    }
    if (done.type === "arrowEnd") { const arrow = byId.get(done.id); if (arrow) saveArrow(arrow.id, arrowEnds(arrow)); }
    if (done.type === "resize") { const note = byId.get(done.id); if (note) { const box = boxNow(note); const old = boxOf(note); if (box.w !== old.w || box.h !== old.h) resize(done.id, box); } }
    if (done.type === "erase") void remove(done.ids);
    if (done.type === "draw" && done.points.length >= 2) {
      const xs = done.points.filter((_, i) => i % 2 === 0), ys = done.points.filter((_, i) => i % 2 === 1);
      const left = Math.min(...xs), top = Math.min(...ys);
      create([element("pen", left, top, Math.max(1, Math.max(...xs) - left), Math.max(1, Math.max(...ys) - top), done.points.map((value, i) => value - (i % 2 === 0 ? left : top)))]);
      setSelected(new Set());
    }
    if (done.type === "shape") {
      const sx = done.kind === "arrow" ? done.x0 : snap(done.x0, done.free), sy = done.kind === "arrow" ? done.y0 : snap(done.y0, done.free);
      const ex = done.kind === "arrow" ? done.x1 : snap(done.x1, done.free), ey = done.kind === "arrow" ? done.y1 : snap(done.y1, done.free);
      const left = Math.round(Math.min(sx, ex)), top = Math.round(Math.min(sy, ey));
      let w = Math.round(Math.abs(ex - sx)), h = Math.round(Math.abs(ey - sy));
      if (done.kind !== "arrow" && w < 16 && h < 16) { w = 160; h = 112; }
      if (done.kind === "arrow" && Math.hypot(w, h) < 12 && !(done.from && done.to)) return;
      const points = done.kind === "arrow" ? [Math.round(sx) - left, Math.round(sy) - top, Math.round(ex) - left, Math.round(ey) - top] : [];
      create([{ ...element(done.kind, left, top, Math.max(1, w), Math.max(1, h), points), ...(done.kind === "arrow" ? { from: done.from, to: done.to } : {}) }]);
      setTool("select");
    }
  }
  function onDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!editable || activeTool !== "select") return;
    const id = elementAt(event.target);
    if (id) { const note = byId.get(id); if (note && canHoldText(note)) { setSelected(new Set([id])); setEditingId(id); } return; }
    const { x, y } = point(event);
    addNote(x, y);
  }

  // ——— Teclado: atajos de herramientas y de la selección ———
  const keys = useRef<(event: KeyboardEvent) => void>(() => {});
  useEffect(() => {
    keys.current = (event) => {
      const target = event.target as HTMLElement | null;
      if (event.key === " " && !target?.closest("input,textarea,button,[role=menu]")) { event.preventDefault(); setSpacePan(event.type === "keydown"); return; }
      if (event.type !== "keydown" || editingId || target?.closest("input,textarea,[role=menu],[contenteditable]")) return;
      const mod = isMac() ? event.metaKey : event.ctrlKey;
      const ids = selection.map((note) => note.id);
      if (mod && event.key.toLowerCase() === "a") { event.preventDefault(); setSelected(new Set(live.map((note) => note.id))); return; }
      if (event.key === "Escape") { setSelected(new Set()); setTool("select"); return; }
      if (!mod && !event.altKey && editable) {
        const shortcut = tools.find((item) => item.key === event.key.toLowerCase());
        if (shortcut) { setTool(shortcut.value); return; }
      }
      if (!editable) return;
      if (mod && event.key.toLowerCase() === "d" && ids.length) { event.preventDefault(); duplicate(ids); return; }
      if ((event.key === "Delete" || event.key === "Backspace") && ids.length) { event.preventDefault(); void remove(ids); return; }
      if (event.key === "Enter" && ids.length === 1 && canHoldText(selection[0])) { event.preventDefault(); setEditingId(ids[0]); return; }
      const step = event.shiftKey ? GRID * 4 : GRID;
      const delta = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, number[]>)[event.key];
      if (delta && ids.length) { event.preventDefault(); move(selection.map((note) => { const box = boxOf(note); return { id: note.id, x: clampTo(note.x + delta[0], box.w), y: clampTo(note.y + delta[1], box.h) }; })); }
    };
  });
  useEffect(() => {
    const listener = (event: KeyboardEvent) => keys.current(event);
    window.addEventListener("keydown", listener);
    window.addEventListener("keyup", listener);
    return () => { window.removeEventListener("keydown", listener); window.removeEventListener("keyup", listener); };
  }, []);

  function onContextMenuCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!stage.current) return;
    menuPoint.current = point(event);
    const id = elementAt(event.target);
    if (id) {
      if (!selected.has(id)) setSelected(new Set([id]));
      setMenuTarget("notes");
    } else {
      setSelected(new Set());
      setEditingId(null);
      setMenuTarget("canvas");
    }
  }
  function onMenu(value: string) {
    const ids = selection.map((note) => note.id);
    if (value === "add") addNote(menuPoint.current.x, menuPoint.current.y);
    if (value === "add-text") addText(menuPoint.current.x, menuPoint.current.y);
    if (value === "select-all") setSelected(new Set(live.map((note) => note.id)));
    if (value === "arrange-all") arrange(live.map((note) => note.id));
    if (value === "arrange") arrange(ids);
    if (value === "edit" && ids.length === 1) setEditingId(ids[0]);
    if (value === "duplicate") duplicate(ids);
    if (value === "delete") void remove(ids);
    if (value === "clear") setSelected(new Set());
    if (value.startsWith("color:")) recolor(ids, value.slice(6));
  }

  if (whiteboards.loading || whiteboards.error) return <WorkspaceStatus loading={whiteboards.loading} errors={[whiteboards.error]} />;
  const modLabel = isMac() ? "⌘" : "Ctrl+";
  const selectionHasNotes = selection.some(isNote);
  const palette = activeTool === "note" || (activeTool === "select" && selectionHasNotes) ? stickyColors : strokeColors;
  const paletteIsNote = palette === stickyColors;
  const shared = selection.length && selection.every((note) => note.color === selection[0].color) ? [selection[0].color] : [];
  const single = selection.length === 1 ? selection[0] : undefined;
  const bindTargets = new Set(gesture?.type === "shape" && gesture.kind === "arrow" ? [gesture.from, gesture.to] : gesture?.type === "arrowEnd" ? [gesture.target] : []);
  const draftArrow = (() => {
    if (gesture?.type !== "shape" || gesture.kind !== "arrow") return undefined;
    const fromEl = gesture.from ? byId.get(gesture.from) : undefined, toEl = gesture.to ? byId.get(gesture.to) : undefined;
    const p0 = { x: gesture.x0, y: gesture.y0 }, p1 = { x: gesture.x1, y: gesture.y1 };
    const start = fromEl ? edgeToward(fromEl, boxOf(fromEl), toEl ? centerOf(boxOf(toEl)) : p1) : p0;
    return { start, end: toEl ? edgeToward(toEl, boxOf(toEl), fromEl ? centerOf(boxOf(fromEl)) : p0) : p1 };
  })();
  const cursor = { select: gesture?.type === "move" && gesture.moved ? "grabbing" : "default", hand: gesture?.type === "pan" ? "grabbing" : "grab", note: "copy", text: "text", pen: "crosshair", rect: "crosshair", ellipse: "crosshair", arrow: "crosshair", eraser: "cell" }[activeTool];

  return (
    <section className="min-w-0">
      <header className="flex items-end gap-[16px] mb-[20px] max-[720px]:flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="m-0 mb-[6px] text-ink-soft font-medium text-[11.5px] leading-[14px] font-mono tracking-[0.08em] uppercase">{archived ? "Pizarras archivadas" : "Brainstorm"}</p>
          {board ? (
            <>
              <InlineText key={`name-${board.id}`} inputRef={title} value={board.name} readOnly={!editable} label="Nombre de la pizarra" maxLength={120} required onFocused={() => setFocusTitle(false)} onCommit={(name) => void saveBoard({ name })} className="w-full m-0 -ml-[6px] px-[6px] py-[2px] rounded-[8px] font-semibold text-[28px] leading-[1.15] font-display tracking-[-0.025em] max-[720px]:text-[24px]" />
              <InlineText key={`description-${board.id}`} value={board.description} readOnly={!editable} label="Descripción de la pizarra" maxLength={3000} placeholder={editable ? "Añade una descripción…" : ""} onCommit={(description) => void saveBoard({ description })} className="w-full mt-[4px] -ml-[6px] px-[6px] py-[2px] rounded-[7px] text-ink-soft text-[14.5px] leading-[21px] font-sans" />
            </>
          ) : <h1 className="m-0 font-semibold text-[28px] font-display tracking-[-0.025em]">Brainstorm</h1>}
        </div>
        <div className="flex items-center gap-[8px] flex-none">
          {editable ? <Button icon={<Plus size={17} strokeWidth={2.4} aria-hidden="true" />} onClick={addInView}>Nuevo post-it</Button> : null}
          <ActionMenu
            label="Opciones de brainstorm"
            onAction={(value) => void onBoardAction(value)}
            actions={[
              { value: "new", label: "Nueva pizarra", icon: <SquarePlus size={16} aria-hidden="true" /> },
              ...(board && editable ? [{ value: "rename", label: "Renombrar pizarra", icon: <Pencil size={16} aria-hidden="true" /> }] : []),
              { value: "archived", label: archived ? "Ver pizarras activas" : "Ver archivadas", icon: <Archive size={16} aria-hidden="true" />, separatorBefore: true },
              ...(board ? [{ value: "archive", label: board.archived ? "Restaurar pizarra" : "Archivar pizarra", icon: board.archived ? <ArchiveRestore size={16} aria-hidden="true" /> : <Archive size={16} aria-hidden="true" />, danger: !board.archived }] : []),
            ]}
          />
        </div>
      </header>
      <WorkspaceStatus loading={false} errors={[notes.error, error]} />

      {board ? (
        <>
          <div className={boardStyles.boardBar}>
            <Menu onAction={(value) => void onBoardAction(value)}>
              <MenuContextTrigger className={boardStyles.boardTabs} aria-label="Pizarras: clic derecho para opciones, doble clic para renombrar">
                {options.map((item) => (
                  <button key={item.id} type="button" className={boardStyles.boardTab} aria-current={item.id === board.id ? "page" : undefined} onClick={() => update({ pizarra: item.id })} onContextMenuCapture={() => update({ pizarra: item.id })} onDoubleClick={() => { update({ pizarra: item.id }); if (editable) setFocusTitle(true); }}>
                    <StatusDot tone={item.color} size={8} />
                    {item.name}
                  </button>
                ))}
                {!archived ? <button type="button" className={`${boardStyles.newBoard} border-0 bg-transparent p-0 cursor-pointer hover:bg-[var(--surface-2)]`} aria-label="Nueva pizarra" title="Nueva pizarra" onClick={() => void newBoard()}><Plus size={15} strokeWidth={2.4} aria-hidden="true" /></button> : null}
              </MenuContextTrigger>
              <MenuContent className={`${menuStyles.content} outline-none`} sideOffset={4}>
                {editable ? <MenuItem value="rename" className={menuStyles.item}><Pencil size={16} aria-hidden="true" />Renombrar</MenuItem> : null}
                {editable ? (
                  <MenuSub>
                    <MenuSubTrigger className={menuStyles.item}><Palette size={16} aria-hidden="true" />Color<ChevronRight size={15} aria-hidden="true" className="ml-auto" /></MenuSubTrigger>
                    <MenuSubContent className={`${menuStyles.content} outline-none`}>
                      {boardColors.map((option) => <MenuItem key={option.value} value={`color:${option.value}`} className={menuStyles.item}><StatusDot tone={option.value} size={9} />{option.label}</MenuItem>)}
                    </MenuSubContent>
                  </MenuSub>
                ) : null}
                <MenuItem value="new" className={menuStyles.item}><SquarePlus size={16} aria-hidden="true" />Nueva pizarra</MenuItem>
                <MenuSeparator className={menuStyles.separator} />
                <MenuItem value="archive" className={menuStyles.item} data-danger={editable || undefined}>{editable ? <Archive size={16} aria-hidden="true" /> : <ArchiveRestore size={16} aria-hidden="true" />}{editable ? "Archivar pizarra" : "Restaurar pizarra"}</MenuItem>
              </MenuContent>
            </Menu>
          </div>

          <div className="relative">
            {/* Herramientas, flotando sobre el lienzo como en una pizarra */}
            <div className="absolute z-40 top-[12px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[8px] w-max max-w-[calc(100%-24px)]">
              <Toolbar aria-label="Herramientas" className={`${barClass} max-w-full overflow-x-auto [scrollbar-width:none]`}>
                <ToggleGroup aria-label="Herramienta" value={[activeTool]} deselectable={false} onValueChange={([value]) => value && setTool(value as Tool)} className="flex items-center gap-[2px]">
                  {tools.filter((item) => editable || item.value === "select" || item.value === "hand").map((item, index) => (
                    <span key={item.value} className="contents">
                      {index === 2 ? sep : null}
                      <Tip label={item.label} shortcut={item.key}>
                        <Toggle value={item.value} aria-label={item.label} className={toolClass}>{item.icon}</Toggle>
                      </Tip>
                    </span>
                  ))}
                </ToggleGroup>
                {editable ? (
                  <>
                    {sep}
                    <ToggleGroup
                      aria-label={selection.length && activeTool === "select" ? "Color de la selección" : "Color"}
                      value={activeTool === "select" && selection.length ? shared : [paletteIsNote ? noteColor : strokeColor]}
                      onValueChange={([value]) => {
                        if (!value) return;
                        if (activeTool === "select" && selection.length) recolor(selection.map((note) => note.id), value);
                        else if (paletteIsNote) setNoteColor(value);
                        else setStrokeColor(value);
                      }}
                      className="flex items-center gap-[1px]"
                    >
                      {palette.map((option) => (
                        <Tip key={option.value} label={option.label}>
                          <Toggle value={option.value} aria-label={`Color ${option.label.toLowerCase()}`} className={swatchClass}>{swatch(option.value, paletteIsNote)}</Toggle>
                        </Tip>
                      ))}
                    </ToggleGroup>
                    {activeTool === "text" ? (
                      <>
                        {sep}
                        <ToggleGroup aria-label="Tamaño del texto" value={[textSize]} deselectable={false} onValueChange={([value]) => value && setTextSize(value as TextSize)} className="flex items-center gap-[1px]">
                          {textSizes.map((size) => <Tip key={size} label={{ sm: "Texto pequeño", md: "Texto mediano", lg: "Texto grande" }[size]}><Toggle value={size} aria-label={{ sm: "Pequeño", md: "Mediano", lg: "Grande" }[size]} className={`${toolClass} font-semibold`} style={{ fontSize: { sm: 12, md: 14, lg: 17 }[size] }}>A</Toggle></Tip>)}
                        </ToggleGroup>
                      </>
                    ) : null}
                  </>
                ) : null}
                {sep}
                <Tip label="Doble clic: post-it o editar · Clic derecho: opciones · Espacio + arrastrar: mover el lienzo · Alt: sin imán">
                  <ToolbarButton aria-label="Ayuda" className={`${toolClass} text-ink-soft`}><CircleHelp size={17} aria-hidden="true" /></ToolbarButton>
                </Tip>
              </Toolbar>

              {selection.length && editable && activeTool === "select" ? (
                <Toolbar aria-label={`${selection.length} elementos seleccionados`} className={`${barClass} pl-[12px] animate-[tw-bulk-in_0.16s_var(--ease)]`}>
                  <span className="text-[13px] font-semibold whitespace-nowrap mr-[6px]">{selection.length} {selection.length === 1 ? "seleccionado" : "seleccionados"}</span>
                  {sep}
                  {single && canHoldText(single) ? <Tip label="Editar texto" shortcut="enter"><ToolbarButton onClick={() => setEditingId(single.id)} className={toolClass} aria-label="Editar texto"><Pencil size={15} aria-hidden="true" /></ToolbarButton></Tip> : null}
                  <Tip label="Duplicar" shortcut="mod+d"><ToolbarButton onClick={() => duplicate(selection.map((note) => note.id))} className={toolClass} aria-label="Duplicar"><Copy size={15} aria-hidden="true" /></ToolbarButton></Tip>
                  {selection.filter((note) => note.kind !== "arrow").length > 1 ? (
                    <Menu onAction={align}>
                      <Tip label="Alinear y repartir">
                        <MenuTrigger className={toolClass} aria-label="Alinear y repartir"><AlignCenterVertical size={15} aria-hidden="true" /></MenuTrigger>
                      </Tip>
                      <MenuContent className={`${menuStyles.content} outline-none`} sideOffset={8}>
                        <MenuItem value="left" className={menuStyles.item}><AlignStartVertical size={16} aria-hidden="true" />Alinear a la izquierda</MenuItem>
                        <MenuItem value="center" className={menuStyles.item}><AlignCenterVertical size={16} aria-hidden="true" />Centrar en horizontal</MenuItem>
                        <MenuItem value="right" className={menuStyles.item}><AlignEndVertical size={16} aria-hidden="true" />Alinear a la derecha</MenuItem>
                        <MenuSeparator className={menuStyles.separator} />
                        <MenuItem value="top" className={menuStyles.item}><AlignStartHorizontal size={16} aria-hidden="true" />Alinear arriba</MenuItem>
                        <MenuItem value="middle" className={menuStyles.item}><AlignCenterHorizontal size={16} aria-hidden="true" />Centrar en vertical</MenuItem>
                        <MenuItem value="bottom" className={menuStyles.item}><AlignEndHorizontal size={16} aria-hidden="true" />Alinear abajo</MenuItem>
                        <MenuSeparator className={menuStyles.separator} />
                        <MenuItem value="spread-x" className={menuStyles.item} disabled={selection.filter((note) => note.kind !== "arrow").length < 3}><AlignHorizontalSpaceAround size={16} aria-hidden="true" />Repartir en horizontal</MenuItem>
                        <MenuItem value="spread-y" className={menuStyles.item} disabled={selection.filter((note) => note.kind !== "arrow").length < 3}><AlignVerticalSpaceAround size={16} aria-hidden="true" />Repartir en vertical</MenuItem>
                      </MenuContent>
                    </Menu>
                  ) : null}
                  {selection.length > 1 ? <Tip label="Ordenar en cuadrícula"><ToolbarButton onClick={() => arrange(selection.map((note) => note.id))} className={toolClass} aria-label="Ordenar en cuadrícula"><LayoutGrid size={15} aria-hidden="true" /></ToolbarButton></Tip> : null}
                  <Tip label="Eliminar" shortcut="delete"><ToolbarButton onClick={() => void remove(selection.map((note) => note.id))} className={`${toolClass} text-[var(--coral)]!`} aria-label="Eliminar selección"><Trash2 size={15} aria-hidden="true" /></ToolbarButton></Tip>
                  <Tip label="Quitar selección" shortcut="escape"><ToolbarButton onClick={() => setSelected(new Set())} className={toolClass} aria-label="Quitar selección"><X size={15} aria-hidden="true" /></ToolbarButton></Tip>
                </Toolbar>
              ) : null}
            </div>

            <Menu onAction={onMenu}>
              <MenuContextTrigger
                className="block rounded-[var(--r-xl)] border border-rule bg-surface [box-shadow:var(--shadow-xs)] focus-visible:outline-2 focus-visible:outline-[var(--blue)] focus-visible:outline-offset-2"
                tabIndex={0}
                aria-label={`Lienzo de ${board.name}. ${live.length} elementos. Clic derecho o Mayús+F10 para opciones; ${modLabel}A selecciona todo, Supr elimina, flechas mueven.`}
                onContextMenuCapture={onContextMenuCapture}
              >
                <div ref={scroller} className="relative h-[calc(100dvh-300px)] min-h-[480px] overflow-auto rounded-[var(--r-xl)] max-[960px]:h-[68dvh]">
                  <div
                    ref={stage}
                    className="relative select-none [background-image:radial-gradient(var(--rule-strong)_1px,transparent_1.2px)] [background-size:24px_24px] [touch-action:pan-x_pan-y]"
                    style={{ width, height, cursor, touchAction: activeTool === "select" || activeTool === "hand" ? undefined : "none" }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={() => setGesture(null)}
                    onDoubleClick={onDoubleClick}
                  >
                    {live.filter((note) => note.kind !== "arrow").map((note) => (
                      <CanvasElement
                        key={note.id}
                        note={note}
                        box={boxNow(note)}
                        selected={selected.has(note.id)}
                        dragging={gesture?.type === "move" && gesture.moved && gesture.ids.includes(note.id)}
                        erasing={gesture?.type === "erase" && gesture.ids.includes(note.id)}
                        editing={editingId === note.id}
                        editable={editable}
                        handle={editable && activeTool === "select" && single?.id === note.id && resizable(note) && editingId !== note.id}
                        highlight={bindTargets.has(note.id)}
                        onCommit={(text) => retext(note.id, text)}
                        onDone={() => setEditingId(null)}
                      />
                    ))}
                    <svg className="absolute left-0 top-0 overflow-visible pointer-events-none" width={width} height={height} style={{ zIndex: 2 }}>
                      {live.filter((note) => note.kind === "arrow").map((arrow) => {
                        const { start, end } = arrowEnds(arrow), isSelected = selected.has(arrow.id);
                        const erasing = gesture?.type === "erase" && gesture.ids.includes(arrow.id);
                        return (
                          <g key={arrow.id} data-note={arrow.id} role="group" aria-label={`Flecha${isSelected ? " (seleccionada)" : ""}`} opacity={erasing ? 0.25 : 1}>
                            {isSelected ? <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="var(--blue)" strokeOpacity={0.22} strokeWidth={12} strokeLinecap="round" /> : null}
                            <Arrow x0={start.x} y0={start.y} x1={end.x} y1={end.y} color={arrow.color} hit />
                            {isSelected && single?.id === arrow.id && editable && activeTool === "select"
                              ? ([["start", start], ["end", end]] as const).map(([key, at]) => <circle key={key} data-handle={key} cx={at.x} cy={at.y} r={6} fill="var(--surface)" stroke="var(--blue)" strokeWidth={2} pointerEvents="all" style={{ cursor: "move" }} />)
                              : null}
                          </g>
                        );
                      })}
                    </svg>
                    {guides.length ? (
                      <svg aria-hidden="true" className="absolute left-0 top-0 overflow-visible pointer-events-none" width={width} height={height} style={{ zIndex: 60 }}>
                        {guides.map((guide, index) => <line key={index} {...guide} stroke="var(--coral)" strokeWidth={1} strokeDasharray="4 3" />)}
                      </svg>
                    ) : null}
                    <DraftLayer gesture={gesture} color={strokeColor} arrow={draftArrow} />
                    {!notes.loading && live.length === 0 ? (
                      <div className="absolute left-[min(50%,560px)] top-[200px] -translate-x-1/2 w-[min(420px,90%)] pointer-events-none">
                        <EmptyState icon={<Lightbulb size={26} aria-hidden="true" />} tone="amber" title={editable ? "Pizarra en blanco" : "Sin elementos"}>
                          {editable ? "Elige una herramienta arriba o haz doble clic para añadir un post-it." : "Esta pizarra está archivada."}
                        </EmptyState>
                      </div>
                    ) : null}
                  </div>
                </div>
              </MenuContextTrigger>
              <MenuContent className={`${menuStyles.content} outline-none`}>
                {menuTarget === "notes" && selection.length ? (
                  <>
                    {editable && single && canHoldText(single) ? <MenuItem value="edit" className={menuStyles.item}><Pencil size={16} aria-hidden="true" />Editar texto{keyHint("Enter")}</MenuItem> : null}
                    {editable ? (
                      <MenuSub>
                        <MenuSubTrigger className={menuStyles.item}><Palette size={16} aria-hidden="true" />Color<ChevronRight size={15} aria-hidden="true" className="ml-auto" /></MenuSubTrigger>
                        <MenuSubContent className={`${menuStyles.content} outline-none`}>
                          {(selectionHasNotes ? stickyColors : strokeColors).map((option) => <MenuItem key={option.value} value={`color:${option.value}`} className={menuStyles.item}>{swatch(option.value, selectionHasNotes)}{option.label}</MenuItem>)}
                        </MenuSubContent>
                      </MenuSub>
                    ) : null}
                    {editable ? <MenuItem value="duplicate" className={menuStyles.item}><Copy size={16} aria-hidden="true" />Duplicar{keyHint(`${modLabel}D`)}</MenuItem> : null}
                    {editable && selection.length > 1 ? <MenuItem value="arrange" className={menuStyles.item}><LayoutGrid size={16} aria-hidden="true" />Ordenar en cuadrícula</MenuItem> : null}
                    <MenuItem value="clear" className={menuStyles.item}><X size={16} aria-hidden="true" />Quitar selección{keyHint("Esc")}</MenuItem>
                    {editable ? (
                      <>
                        <MenuSeparator className={menuStyles.separator} />
                        <MenuItem value="delete" className={menuStyles.item} data-danger=""><Trash2 size={16} aria-hidden="true" />{selection.length === 1 ? "Eliminar" : `Eliminar ${selection.length} elementos`}{keyHint("Supr")}</MenuItem>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    {editable ? <MenuItem value="add" className={menuStyles.item}><StickyIcon size={16} aria-hidden="true" />Post-it aquí{keyHint("Doble clic")}</MenuItem> : null}
                    {editable ? <MenuItem value="add-text" className={menuStyles.item}><Type size={16} aria-hidden="true" />Texto aquí</MenuItem> : null}
                    <MenuItem value="select-all" className={menuStyles.item} disabled={!live.length}><MousePointerClick size={16} aria-hidden="true" />Seleccionar todo{keyHint(`${modLabel}A`)}</MenuItem>
                    {editable ? <MenuItem value="arrange-all" className={menuStyles.item} disabled={live.length < 2}><LayoutGrid size={16} aria-hidden="true" />Ordenar todo en cuadrícula</MenuItem> : null}
                  </>
                )}
              </MenuContent>
            </Menu>
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Lightbulb size={26} aria-hidden="true" />}
          tone="amber"
          title={archived ? "No hay pizarras archivadas" : "Crea tu primera pizarra"}
          action={archived ? <Button variant="secondary" onClick={() => update({ archived: null })}>Ver pizarras activas</Button> : <Button icon={<Plus size={17} aria-hidden="true" />} onClick={() => void newBoard()}>Nueva pizarra</Button>}
        >
          Una pizarra por tema: nombre de la mascota, ideas de contenido, funciones para el MVP…
        </EmptyState>
      )}
    </section>
  );
}

/** Vista previa de lo que se está dibujando o seleccionando. */
function DraftLayer({ gesture, color, arrow }: { gesture: Gesture | null; color: string; arrow?: { start: Point; end: Point } }) {
  if (gesture?.type === "marquee") {
    return <div aria-hidden="true" className="absolute z-50 rounded-[4px] border border-[var(--blue)] bg-[color-mix(in_srgb,var(--blue)_10%,transparent)] pointer-events-none" style={{ left: Math.min(gesture.x0, gesture.x1), top: Math.min(gesture.y0, gesture.y1), width: Math.abs(gesture.x1 - gesture.x0), height: Math.abs(gesture.y1 - gesture.y0) }} />;
  }
  if (gesture?.type === "draw") {
    return <svg aria-hidden="true" className="absolute inset-0 z-50 pointer-events-none overflow-visible" width="100%" height="100%"><path d={smoothPath(gesture.points)} fill="none" stroke={strokeOf(color)} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (gesture?.type === "shape") {
    const x = Math.min(gesture.x0, gesture.x1), y = Math.min(gesture.y0, gesture.y1), w = Math.abs(gesture.x1 - gesture.x0), h = Math.abs(gesture.y1 - gesture.y0);
    return (
      <svg aria-hidden="true" className="absolute inset-0 z-50 pointer-events-none overflow-visible" width="100%" height="100%">
        {gesture.kind === "rect" ? <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={strokeOf(color)} strokeWidth={2.5} strokeDasharray="6 5" /> : null}
        {gesture.kind === "ellipse" ? <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill="none" stroke={strokeOf(color)} strokeWidth={2.5} strokeDasharray="6 5" /> : null}
        {gesture.kind === "arrow" && arrow ? <Arrow x0={arrow.start.x} y0={arrow.start.y} x1={arrow.end.x} y1={arrow.end.y} color={color} /> : null}
      </svg>
    );
  }
  return null;
}

function Arrow({ x0, y0, x1, y1, color, hit = false }: { x0: number; y0: number; x1: number; y1: number; color: string; hit?: boolean }) {
  // Punta abierta, como en Excalidraw.
  const angle = Math.atan2(y1 - y0, x1 - x0), size = Math.min(16, Math.max(8, Math.hypot(x1 - x0, y1 - y0) / 3));
  const wing = (offset: number) => `${x1 - size * Math.cos(angle + offset)} ${y1 - size * Math.sin(angle + offset)}`;
  const line = `M${x0} ${y0} L${x1} ${y1}`, head = `M${wing(-0.5)} L${x1} ${y1} L${wing(0.5)}`;
  return (
    <>
      {hit ? <path d={`${line} ${head}`} fill="none" stroke="transparent" strokeWidth={16} strokeLinecap="round" pointerEvents="stroke" /> : null}
      <path d={`${line} ${head}`} fill="none" stroke={strokeOf(color)} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" pointerEvents={hit ? "stroke" : "none"} />
    </>
  );
}

/** Texto que se edita en el lugar: Enter o salir guarda, Escape descarta. */
function InlineText({ value, onCommit, onFocused, label, className, readOnly, maxLength, placeholder, required, inputRef }: { value: string; onCommit: (value: string) => void; onFocused?: () => void; label: string; className: string; readOnly?: boolean; maxLength: number; placeholder?: string; required?: boolean; inputRef?: React.RefObject<HTMLInputElement | null> }) {
  const [draft, setDraft] = useState<string | null>(null);
  const cancel = useRef(false);
  const finish = () => {
    const next = (draft ?? value).trim();
    if (!cancel.current && next !== value && (!required || next)) onCommit(next);
    cancel.current = false;
    setDraft(null);
  };
  return (
    <input
      ref={inputRef}
      aria-label={label}
      value={draft ?? value}
      readOnly={readOnly}
      maxLength={maxLength}
      placeholder={placeholder}
      onFocus={() => { if (!readOnly) setDraft(value); onFocused?.(); }}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={finish}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") { cancel.current = true; event.currentTarget.blur(); }
      }}
      className={`block border-0 bg-transparent text-inherit outline-none ${readOnly ? "" : "hover:bg-[var(--surface-2)] focus:bg-surface focus:[box-shadow:inset_0_0_0_1.5px_var(--blue)]"} placeholder:text-[var(--ink-mute)] ${className}`}
    />
  );
}

type ElementProps = {
  note: Element;
  box: { x: number; y: number; w: number; h: number };
  selected: boolean;
  dragging: boolean;
  erasing: boolean;
  editing: boolean;
  editable: boolean;
  handle: boolean;
  /** Destino al que se unirá una flecha. */
  highlight?: boolean;
  onCommit: (text: string) => void;
  onDone: () => void;
};

/** Un elemento de la pizarra: post-it, texto, trazo, rectángulo, elipse o flecha. */
function CanvasElement({ note, box, selected, dragging, erasing, editing, editable, handle, highlight = false, onCommit, onDone }: ElementProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const kind = note.kind ?? "note";
  const author = personName(note.createdBy);
  const size = note.size ?? "md";

  useEffect(() => {
    if (!editing || !area.current) return;
    const element = area.current;
    element.focus();
    element.setSelectionRange(element.value.length, element.value.length);
  }, [editing]);
  const finish = () => {
    if (draft !== null) onCommit(draft);
    setDraft(null);
    onDone();
  };
  const textArea = (className: string, style?: React.CSSProperties) => (
    <textarea
      ref={area}
      value={draft ?? note.text}
      readOnly={!editing}
      tabIndex={editing ? 0 : -1}
      maxLength={500}
      aria-label={kind === "note" ? "Texto del post-it" : "Texto"}
      placeholder={editable && kind === "note" ? "Doble clic para escribir…" : editing ? "Escribe…" : ""}
      onFocus={() => { if (editing) setDraft(note.text); }}
      onBlur={finish}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Escape" || (event.key === "Enter" && (event.metaKey || event.ctrlKey))) { event.preventDefault(); event.currentTarget.blur(); }
        event.stopPropagation();
      }}
      className={`resize-none border-0 bg-transparent outline-none [color:inherit] [font-family:var(--font-sans)] placeholder:text-current placeholder:opacity-45 ${editing ? "cursor-text pointer-events-auto" : "pointer-events-none select-none"} ${className}`}
      style={style}
    />
  );
  const wrapper: React.CSSProperties = {
    left: box.x,
    top: box.y,
    width: Math.max(box.w, 1),
    height: Math.max(box.h, 1),
    zIndex: dragging ? 30 : editing ? 25 : selected ? 20 : kind === "note" ? 3 : kind === "text" ? 2 : 1,
    opacity: erasing ? 0.25 : 1,
    outline: highlight ? "2px dashed var(--blue)" : selected ? "2px solid var(--blue)" : "2px solid transparent",
    outlineOffset: kind === "pen" || kind === "arrow" ? 6 : 3,
  };
  const label = kind === "note" ? `Post-it de ${author}` : { text: "Texto", pen: "Trazo", rect: "Rectángulo", ellipse: "Elipse", arrow: "Flecha" }[kind];
  const common = { "data-note": note.id, role: "group", "aria-label": `${label}${note.text ? `: ${note.text}` : ""}${selected ? " (seleccionado)" : ""}` };
  const resizeHandle = handle ? <span data-handle="" aria-hidden="true" className="absolute -right-[7px] -bottom-[7px] w-[12px] h-[12px] rounded-[3px] bg-surface border-2 border-[var(--blue)] cursor-nwse-resize pointer-events-auto" /> : null;

  if (kind === "note") {
    const colors = paperOf(note.color);
    return (
      <div {...common} className="absolute flex flex-col rounded-[3px] [touch-action:none] [transition:box-shadow_0.15s,transform_0.15s,outline-color_0.1s]" style={{ ...wrapper, background: colors.bg, color: colors.ink, transform: `rotate(${dragging || editing ? 0 : tilt(note.id)}deg) scale(${dragging ? 1.03 : 1})`, boxShadow: dragging ? "0 18px 34px -12px rgba(0,0,0,0.38), 0 2px 4px rgba(0,0,0,0.1)" : "0 1px 2px rgba(0,0,0,0.08), 0 10px 18px -10px rgba(0,0,0,0.3)" }}>
        <div className="h-[22px] flex items-center px-[10px] rounded-t-[3px] text-[10.5px] font-semibold uppercase tracking-[0.06em]" style={{ background: colors.fold }}>
          <span className="opacity-70">{note.createdAt.slice(5, 10).split("-").reverse().join("/")}</span>
        </div>
        {textArea("flex-1 w-full min-h-0 px-[12px] pt-[8px] pb-[4px] text-[15px] leading-[1.35] font-medium")}
        <div className="flex items-center gap-[6px] px-[10px] pb-[8px] text-[11px] font-medium opacity-75 pointer-events-none">
          <Avatar name={author} size={16} tone="violet" />
          <span className="truncate">{author}</span>
        </div>
      </div>
    );
  }
  if (kind === "text") {
    const px = fontPx[size];
    return (
      <div {...common} className="absolute [touch-action:none]" style={{ ...wrapper, color: strokeOf(note.color), height: editing ? "auto" : wrapper.height }}>
        {editing
          ? textArea("block w-full overflow-hidden font-semibold [field-sizing:content]", { fontSize: px, lineHeight: 1.3, minHeight: px * 1.3 + 8 })
          : <p className="m-0 whitespace-pre-wrap [overflow-wrap:anywhere] font-semibold font-sans" style={{ fontSize: px, lineHeight: 1.3 }}>{note.text}</p>}
        {resizeHandle}
      </div>
    );
  }
  if (kind === "rect" || kind === "ellipse") {
    return (
      <div {...common} className="absolute grid place-items-center [touch-action:none]" style={{ ...wrapper, color: strokeOf(note.color) }}>
        <svg aria-hidden="true" className="absolute inset-0 overflow-visible" width="100%" height="100%">
          {kind === "rect"
            ? <rect x={1.25} y={1.25} width={Math.max(box.w - 2.5, 1)} height={Math.max(box.h - 2.5, 1)} rx={10} fill={`color-mix(in srgb, ${strokeOf(note.color)} 8%, transparent)`} stroke={strokeOf(note.color)} strokeWidth={2.5} />
            : <ellipse cx={box.w / 2} cy={box.h / 2} rx={Math.max(box.w / 2 - 1.25, 1)} ry={Math.max(box.h / 2 - 1.25, 1)} fill={`color-mix(in srgb, ${strokeOf(note.color)} 8%, transparent)`} stroke={strokeOf(note.color)} strokeWidth={2.5} />}
        </svg>
        {editing || note.text ? textArea("relative w-[86%] max-h-[90%] text-center text-[15px] leading-[1.35] font-semibold overflow-hidden [field-sizing:content]") : null}
        {resizeHandle}
      </div>
    );
  }
  // Trazo: el contenedor no captura el puntero; solo la línea (con un margen para atinarle).
  const points = note.points ?? [];
  return (
    <div {...common} className="absolute pointer-events-none" style={wrapper}>
      <svg aria-hidden="true" className="absolute inset-0 overflow-visible" width="100%" height="100%">
        <path d={smoothPath(points)} fill="none" stroke="transparent" strokeWidth={16} strokeLinecap="round" pointerEvents="stroke" />
        <path d={smoothPath(points)} fill="none" stroke={strokeOf(note.color)} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pointerEvents="stroke" />
      </svg>
    </div>
  );
}
