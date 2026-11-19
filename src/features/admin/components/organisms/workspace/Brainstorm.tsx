"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { Dialog, DialogBackdrop, DialogClose, DialogContent, DialogTitle } from "@ui-sdk/react/dialog";
import { Menu, MenuContent, MenuContextTrigger, MenuItem, MenuSeparator, MenuSub, MenuSubContent, MenuSubTrigger } from "@ui-sdk/react/menu";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/react/toolbar";
import { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger } from "@ui-sdk/react/tooltip";
import {
  AlignCenter, AlignCenterHorizontal, AlignCenterVertical, AlignEndHorizontal, AlignEndVertical, AlignHorizontalSpaceAround, AlignLeft, AlignRight,
  AlignStartHorizontal, AlignStartVertical, AlignVerticalSpaceAround, Archive, ArchiveRestore, ArrowDown, ArrowDownToLine, ArrowUp, ArrowUpToLine,
  ChevronRight, Circle, ClipboardPaste, Copy, Eraser, Hand, Keyboard, LayoutGrid, Lightbulb, Maximize, Minus, MousePointer2, MousePointerClick,
  MoveUpRight, Palette, Pencil, PenLine, Plus, Redo2, Scissors, Spline, Square, SquarePlus, StickyNote as StickyIcon, Trash2, Type, Undo2, X,
} from "lucide-react";
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
import { canvasSize, colors as boardColors, stickyColors, strokeColors, type ElementKind, type ElementStyle, type Entity, type StickyColor, type StickyNote, type WorkspaceColor } from "@/features/admin/lib/workspace";
import { toggleArchive, WorkspaceStatus } from "./WorkspaceParts";
import boardStyles from "./Board.styles";

// ——— Modelo ———
const NOTE_W = 200, NOTE_H = 176, GRID = 24, SNAP = 6;
type Element = Entity<"stickyNotes">;
type Data = Partial<StickyNote>;
type Entry = { id: string; before: Data | null; after: Data | null };
type TextSize = NonNullable<StickyNote["size"]>;
type Point = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };
type Tool = "select" | "hand" | "note" | "text" | "pen" | "rect" | "ellipse" | "arrow" | "eraser";
type Style = Required<Omit<ElementStyle, "z">> & { z: number };
const dataKeys = ["text", "color", "x", "y", "kind", "w", "h", "points", "size", "from", "to", "style"] as const;
const dataOf = (element: Data): Data => Object.fromEntries(dataKeys.filter((key) => element[key] !== undefined).map((key) => [key, structuredClone(element[key])])) as Data;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

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
const paper: Record<string, { bg: string; fold: string; ink: string }> = {
  yellow: { bg: "#FFE98F", fold: "#F5D65C", ink: "#3A2F06" },
  pink: { bg: "#FFC9D6", fold: "#F8A9BC", ink: "#4A1323" },
  blue: { bg: "#C9DCFF", fold: "#A9C4FA", ink: "#0F2557" },
  green: { bg: "#C8EFCF", fold: "#A3E0AF", ink: "#0E3B19" },
  violet: { bg: "#E2D6FF", fold: "#CBB8FA", ink: "#2A1563" },
};
const paperOf = (color: string) => paper[color] ?? paper[{ coral: "pink", amber: "yellow" }[color] ?? "yellow"];
const strokeOf = (color: string) => `var(--${{ ink: "ink", yellow: "amber", pink: "coral" }[color] ?? color})`;
const fontFamily: Record<Style["font"], string> = { sans: "var(--font-sans)", display: "var(--font-display)", mono: "var(--font-mono)", serif: "Georgia, 'Times New Roman', serif" };
const textPx: Record<TextSize, number> = { sm: 16, md: 22, lg: 32, xl: 48 };
const labelPx: Record<TextSize, number> = { sm: 13, md: 15, lg: 20, xl: 28 };
const weightPx: Record<Style["weight"], number> = { 1: 1.5, 2: 2.5, 4: 4.5 };
const dash = (stroke: Style["stroke"], width: number) => (stroke === "dashed" ? `${width * 4} ${width * 3}` : stroke === "dotted" ? `0.1 ${width * 3}` : undefined);
const isNote = (element: Pick<StickyNote, "kind">) => !element.kind || element.kind === "note";
const canHoldText = (element: Pick<StickyNote, "kind">) => isNote(element) || element.kind === "text" || element.kind === "rect" || element.kind === "ellipse";
const resizable = (element: Pick<StickyNote, "kind">) => element.kind === "text" || element.kind === "rect" || element.kind === "ellipse";
const bindable = (element?: Pick<StickyNote, "kind">) => Boolean(element && (isNote(element) || element.kind === "text" || element.kind === "rect" || element.kind === "ellipse"));
const styleOf = (element: Pick<StickyNote, "kind" | "style">): Style => ({ arrowType: "straight", head: "end", stroke: "solid", weight: 2, fill: "none", font: "sans", align: element.kind === "text" ? "left" : "center", z: 0, ...element.style });
const boxOf = (element: Data): Box => ({ x: element.x ?? 0, y: element.y ?? 0, w: isNote(element) ? NOTE_W : element.w ?? 0, h: isNote(element) ? NOTE_H : element.h ?? 0 });
const clampTo = (value: number, size: number) => Math.round(Math.min(Math.max(value, 0), canvasSize - size));
const snap = (value: number, free = false) => (free ? Math.round(value) : Math.round(value / GRID) * GRID);
const centerOf = (box: Box): Point => ({ x: box.x + box.w / 2, y: box.y + box.h / 2 });
const textHeight = (text: string, width: number, size: TextSize, font: Style["font"] = "sans") => {
  const px = textPx[size], perLine = Math.max(1, Math.floor(width / (px * (font === "mono" ? 0.62 : 0.55))));
  const lines = (text || " ").split("\n").reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / perLine)), 0);
  return Math.round(lines * px * 1.3 + 8);
};
/** Punto del borde de un elemento en dirección a otro punto, con un pequeño margen. */
const edgeToward = (element: Pick<StickyNote, "kind">, box: Box, toward: Point): Point => {
  const c = centerOf(box), dx = toward.x - c.x, dy = toward.y - c.y, length = Math.hypot(dx, dy);
  if (!length) return c;
  const t = element.kind === "ellipse"
    ? 1 / Math.sqrt((dx / Math.max(box.w / 2, 1)) ** 2 + (dy / Math.max(box.h / 2, 1)) ** 2)
    : Math.min(Math.abs(box.w / 2 / (dx || 1e-9)), Math.abs(box.h / 2 / (dy || 1e-9)));
  return { x: c.x + dx * (t + 8 / length), y: c.y + dy * (t + 8 / length) };
};
const smoothPath = (points: number[]) => {
  if (points.length < 4) return points.length === 2 ? `M${points[0]} ${points[1]}l0.1 0` : "";
  let path = `M${points[0]} ${points[1]}`;
  for (let i = 2; i < points.length - 2; i += 2) path += ` Q${points[i]} ${points[i + 1]} ${(points[i] + points[i + 2]) / 2} ${(points[i + 1] + points[i + 3]) / 2}`;
  return `${path} L${points.at(-2)} ${points.at(-1)}`;
};
/** Trazado de una flecha por sus puntos (extremos y vértices), con el ángulo de llegada a cada extremo para las puntas. */
const arrowGeometry = (pts: Point[], type: Style["arrowType"]) => {
  const s = pts[0], e = pts[pts.length - 1];
  if (pts.length === 2 && type === "curved") {
    const dx = e.x - s.x, dy = e.y - s.y, length = Math.hypot(dx, dy) || 1, c = { x: (s.x + e.x) / 2 - (dy / length) * length * 0.22, y: (s.y + e.y) / 2 + (dx / length) * length * 0.22 };
    return { d: `M${s.x} ${s.y} Q${c.x} ${c.y} ${e.x} ${e.y}`, endAngle: Math.atan2(e.y - c.y, e.x - c.x), startAngle: Math.atan2(s.y - c.y, s.x - c.x) };
  }
  if (type === "curved") {
    // Catmull-Rom: la curva pasa por cada vértice.
    let d = `M${s.x} ${s.y}`, c1 = s, c2 = e;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
      const a = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }, b = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
      if (i === 0) c1 = a;
      if (i === pts.length - 2) c2 = b;
      d += ` C${a.x} ${a.y} ${b.x} ${b.y} ${p2.x} ${p2.y}`;
    }
    return { d, endAngle: Math.atan2(e.y - c2.y, e.x - c2.x), startAngle: Math.atan2(s.y - c1.y, s.x - c1.x) };
  }
  if (type === "elbow") {
    // Cada tramo va en ángulo recto: primero por el eje dominante y luego por el otro.
    let d = `M${s.x} ${s.y}`, startAngle = 0, endAngle = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], dx = b.x - a.x, dy = b.y - a.y, across = Math.abs(dx) >= Math.abs(dy);
      if (pts.length === 2) {
        if (across) { const mid = (a.x + b.x) / 2; d += ` H${mid} V${b.y} H${b.x}`; } else { const mid = (a.y + b.y) / 2; d += ` V${mid} H${b.x} V${b.y}`; }
      } else d += across ? ` H${b.x} V${b.y}` : ` V${b.y} H${b.x}`;
      const firstLeg = across ? (dx ? Math.atan2(0, dx) : Math.atan2(dy, 0)) : (dy ? Math.atan2(dy, 0) : Math.atan2(0, dx));
      const lastLeg = pts.length === 2 ? firstLeg : across ? (dy ? Math.atan2(dy, 0) : Math.atan2(0, dx)) : (dx ? Math.atan2(0, dx) : Math.atan2(dy, 0));
      if (i === 0) startAngle = firstLeg + Math.PI;
      if (i === pts.length - 2) endAngle = lastLeg;
    }
    return { d, endAngle, startAngle };
  }
  const prev = pts[pts.length - 2], next = pts[1];
  return { d: `M${s.x} ${s.y}${pts.slice(1).map((pt) => ` L${pt.x} ${pt.y}`).join("")}`, endAngle: Math.atan2(e.y - prev.y, e.x - prev.x), startAngle: Math.atan2(s.y - next.y, s.x - next.x) };
};
/** Vértices intermedios de una flecha guardada (sus puntos, sin los extremos), en coordenadas del lienzo. */
const arrowVertices = (arrow: Pick<StickyNote, "x" | "y" | "points">): Point[] => {
  const pts = arrow.points ?? [], out: Point[] = [];
  for (let i = 2; i < pts.length - 2; i += 2) out.push({ x: arrow.x + pts[i], y: arrow.y + pts[i + 1] });
  return out;
};
const tilt = (id: string) => ((Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 7) - 3) * 0.45;
const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const keyHint = (text: string) => <span className="ml-auto pl-[16px] text-ink-soft text-[12px] font-normal font-mono">{text}</span>;
const toolClass = "inline-grid place-items-center min-w-[34px] h-[34px] px-[8px] rounded-[9px] border-0 bg-transparent text-ink cursor-pointer hover:bg-[var(--surface-2)] data-[pressed]:bg-[var(--blue-soft)] data-[pressed]:text-[var(--blue)] disabled:opacity-35 disabled:cursor-not-allowed aria-disabled:opacity-35 aria-disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--blue)]";
const optionClass = "inline-grid place-items-center min-w-[32px] h-[32px] px-[6px] rounded-[8px] border-0 bg-[var(--surface-2)] text-ink cursor-pointer hover:bg-[var(--bg-2)] data-[pressed]:bg-[var(--blue-soft)] data-[pressed]:text-[var(--blue)] data-[pressed]:[box-shadow:inset_0_0_0_1.5px_var(--blue)] disabled:opacity-35 aria-disabled:opacity-35 aria-disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--blue)]";
const tipClass = "z-[1200] flex items-center gap-[8px] px-[8px] py-[5px] rounded-[7px] bg-[var(--ink)] text-[var(--bg)] text-[12px] font-medium leading-[1.2] [box-shadow:var(--shadow-pop)]";
const barClass = "flex items-center gap-[2px] p-[4px] rounded-[12px] border border-rule bg-surface [box-shadow:var(--shadow-pop)]";
const sep = <ToolbarSeparator className="w-px h-[20px] mx-[4px] bg-[var(--rule-strong)]" />;
const contentClass = `${menuStyles.content} outline-none`;
const sectionTitle = "m-0 text-ink-soft text-[11px] font-semibold uppercase tracking-[0.06em] font-mono";

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
const swatch = (color: string, note = false) => <span aria-hidden="true" className="block w-[16px] h-[16px] rounded-[5px] [box-shadow:inset_0_0_0_1px_rgba(0,0,0,0.12)]" style={{ background: note ? paperOf(color).bg : strokeOf(color) }} />;
const lineIcon = (props: { width?: number; dash?: string; children?: ReactNode }) => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    {props.children ?? <line x1="3" y1="10" x2="17" y2="10" strokeWidth={props.width ?? 2} strokeDasharray={props.dash} />}
  </svg>
);

/** Grupo de opciones del panel (UI SDK ToggleGroup con tooltips). */
function OptionGroup({ args: [group, items, value, onChange] }: { args: [string, { value: string; label: string; icon: ReactNode }[], string[], (value: string) => void] }) {
  return (
    <section className="flex flex-col gap-[6px]">
      <h3 className={sectionTitle}>{group}</h3>
      <ToggleGroup aria-label={group} value={value} onValueChange={([next]) => next && onChange(next)} className="flex flex-wrap gap-[4px]">
        {items.map((item) => <Tip key={item.value} label={item.label}><Toggle value={item.value} aria-label={item.label} className={optionClass}>{item.icon}</Toggle></Tip>)}
      </ToggleGroup>
    </section>
  );
}
function ActionButton({ args: [label, icon, onClick, shortcut, extra = "", disabled = false] }: { args: [string, ReactNode, () => void, string?, string?, boolean?] }) {
  return <Tip label={label} shortcut={shortcut}><button type="button" className={`${optionClass} ${extra}`} aria-label={label} aria-disabled={disabled || undefined} onClick={() => { if (!disabled) onClick(); }}>{icon}</button></Tip>;
}

type Pending = Partial<StickyNote> & { until: number };
type Gesture =
  | { type: "move"; ids: string[]; origin: Record<string, Point>; sx: number; sy: number; dx: number; dy: number; moved: boolean; free: boolean }
  | { type: "marquee"; x0: number; y0: number; x1: number; y1: number; base: string[] }
  | { type: "pan"; sx: number; sy: number; left: number; top: number }
  | { type: "draw"; points: number[] }
  | { type: "shape"; kind: "rect" | "ellipse" | "arrow"; x0: number; y0: number; x1: number; y1: number; free: boolean; from: string; to: string }
  | { type: "arrowEnd"; id: string; end: "start" | "end"; x: number; y: number; target: string }
  | { type: "vertex"; id: string; index: number; insert: boolean; x: number; y: number; moved: boolean }
  | { type: "erase"; ids: string[] }
  | { type: "resize"; id: string; box: Box; sx: number; sy: number; dx: number; dy: number };
const CLIP = "daury/whiteboard";

/** Brainstorm: pizarra colaborativa con post-its, texto, lápiz, figuras y flechas. Todo se edita en el lugar. */
export function BrainstormWorkspace() {
  const { params, update } = useAdminQuery();
  const whiteboards = useWorkspace("whiteboards");
  const archived = params.get("archived") === "yes";
  const options = whiteboards.items.filter((item) => item.archived === archived).toSorted((a, b) => a.createdAt.localeCompare(b.createdAt));
  const board = options.find((item) => item.id === params.get("pizarra")) ?? options[0];
  const notes = useWorkspace("stickyNotes", "whiteboardId", board?.id);
  const editable = Boolean(board && !board.archived);

  const [tool, setToolState] = useState<Tool>("select");
  /** Estilo que usarán los elementos nuevos (como el «elemento actual» de una pizarra). */
  const [defaults, setDefaults] = useState({ noteColor: "yellow", strokeColor: "ink", size: "md" as TextSize, style: { arrowType: "straight", head: "end", stroke: "solid", weight: 2, fill: "none", font: "sans", align: "left" } as Omit<Style, "z"> });
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, Pending>>({});
  const [optimistic, setOptimistic] = useState<Record<string, Element>>({});
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [gesture, setGesture] = useState<Gesture | null>(null);
  const [spacePan, setSpacePan] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [menuTarget, setMenuTarget] = useState<"notes" | "canvas">("canvas");
  const [focusTitle, setFocusTitle] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [historySize, setHistorySize] = useState({ undo: 0, redo: 0 });
  const history = useRef<{ undo: Entry[][]; redo: Entry[][] }>({ undo: [], redo: [] });
  const clipboard = useRef<Data[]>([]);
  const pasteCount = useRef(0);
  const menuPoint = useRef<Point>({ x: 0, y: 0 });
  const lastPointer = useRef<Point | null>(null);
  const zoomRef = useRef(1);
  const stage = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLInputElement>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const enqueue = <T,>(task: () => Promise<T>) => { const next = queue.current.then(task, task); queue.current = next.catch(() => undefined); return next; };

  // Lo que ya llegó de Firestore deja de ser provisional (se compara por ids: el hook entrega listas nuevas al cargar).
  const serverIds = notes.items.map((note) => note.id).join("|");
  const [seenIds, setSeenIds] = useState(serverIds);
  if (seenIds !== serverIds) {
    setSeenIds(serverIds);
    if (Object.keys(optimistic).some((id) => notes.items.some((note) => note.id === id))) setOptimistic((current) => Object.fromEntries(Object.entries(current).filter(([id]) => !notes.items.some((note) => note.id === id))));
  }
  const boardId = board?.id;
  const [seenBoard, setSeenBoard] = useState(boardId);
  if (seenBoard !== boardId) { setSeenBoard(boardId); setSelected(new Set()); setEditingId(null); setHistorySize({ undo: 0, redo: 0 }); }
  useEffect(() => { history.current = { undo: [], redo: [] }; }, [boardId]);

  const live = useMemo(() => [...notes.items, ...Object.values(optimistic).filter((item) => !notes.items.some((note) => note.id === item.id))]
    .filter((note) => !note.archived && !removed.has(note.id))
    .map((note) => { const local = pending[note.id]; return local && note.revision < local.until ? { ...note, ...local } : note; })
    .toSorted((a, b) => styleOf(a).z - styleOf(b).z || a.createdAt.localeCompare(b.createdAt)), [notes.items, optimistic, pending, removed]);
  const byId = useMemo(() => new Map(live.map((note) => [note.id, note])), [live]);
  const order = useMemo(() => new Map(live.map((note, index) => [note.id, index])), [live]);
  const selection = live.filter((note) => selected.has(note.id));
  const width = Math.max(2400, ...live.map((note) => { const box = boxOf(note); return box.x + box.w + 320; }));
  const height = Math.max(1500, ...live.map((note) => { const box = boxOf(note); return box.y + box.h + 320; }));
  const activeTool: Tool = spacePan ? "hand" : tool;
  /** Al elegir una herramienta de dibujo se suelta la selección (el panel muestra sus opciones). */
  /** Cierra la edición guardando el borrador: desenfocar dispara su `onBlur` antes de desmontar el campo. */
  const stopEditing = () => {
    const field = document.activeElement;
    if (field instanceof HTMLTextAreaElement && field.closest("[data-note]")) field.blur();
    setEditingId(null);
  };
  const setTool = (next: Tool) => { setToolState(next); if (next !== "select" && next !== "hand") { setSelected(new Set()); stopEditing(); } };
  const topZ = live.reduce((max, note) => Math.max(max, styleOf(note).z), 0);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => {
    if (!focusTitle || !title.current) return;
    title.current.focus();
    title.current.select();
  }, [focusTitle, boardId]);

  // ——— Cambios: todo pasa por aquí (se muestra al instante, se guarda en orden y se puede deshacer) ———
  function applyLocal(changes: Record<string, Data>) {
    setPending((current) => {
      const next = { ...current };
      for (const [id, values] of Object.entries(changes)) {
        const revision = notes.items.find((note) => note.id === id)?.revision ?? 1;
        next[id] = { ...next[id], ...values, until: Math.max(next[id]?.until ?? 0, revision) + 1 };
      }
      return next;
    });
  }
  async function run(ids: string[], action: BulkAction, fallback: string) {
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
  function apply(entries: Entry[], record = true) {
    const real = entries.filter((entry) => !same(entry.before, entry.after));
    if (!real.length || !board || !editable) return;
    setError("");
    if (record) {
      history.current.undo.push(real);
      if (history.current.undo.length > 100) history.current.undo.shift();
      history.current.redo = [];
      setHistorySize({ undo: history.current.undo.length, redo: 0 });
    }
    const creates = real.filter((entry) => !entry.before && entry.after);
    const deletes = real.filter((entry) => entry.before && !entry.after);
    const updates = real.filter((entry) => entry.before && entry.after);
    if (creates.length) {
      const now = new Date().toISOString();
      let email = "";
      try { email = getAdminFirebase().auth.currentUser?.email ?? ""; } catch { /* sin Firebase (pruebas): el servidor pone el autor real */ }
      setRemoved((current) => { if (!creates.some((entry) => current.has(entry.id))) return current; const next = new Set(current); for (const entry of creates) next.delete(entry.id); return next; });
      setOptimistic((current) => ({ ...current, ...Object.fromEntries(creates.map((entry) => [entry.id, { ...entry.after, whiteboardId: board.id, id: entry.id, revision: 0, archived: false, createdAt: now, updatedAt: now, createdBy: email, updatedBy: email } as Element])) }));
      for (const entry of creates) {
        void enqueue(() => saveWorkspaceItem({ collection: "stickyNotes", id: entry.id, revision: 0, data: { ...entry.after, whiteboardId: board.id } })).then((result) => {
          if (!result.ok) throw new Error(result.error);
        }).catch(() => {
          setOptimistic((current) => { const next = { ...current }; delete next[entry.id]; return next; });
          setError("No se pudo guardar un elemento nuevo. Revisa tu conexión.");
        });
      }
    }
    if (deletes.length) {
      const ids = deletes.map((entry) => entry.id);
      setRemoved((current) => new Set([...current, ...ids]));
      setSelected((current) => { const next = new Set(current); for (const id of ids) next.delete(id); return next; });
      setEditingId((current) => (current && ids.includes(current) ? null : current));
      void run(ids, { type: "delete" }, "No se pudieron eliminar los elementos.").then((ok) => {
        if (!ok) setRemoved((current) => { const next = new Set(current); for (const id of ids) next.delete(id); return next; });
      });
    }
    if (updates.length) {
      const items = updates.map((entry) => ({ id: entry.id, changes: Object.fromEntries(dataKeys.filter((key) => entry.after![key] !== undefined && !same(entry.after![key], entry.before![key])).map((key) => [key, entry.after![key]])) }));
      applyLocal(Object.fromEntries(items.map((item) => [item.id, item.changes as Data])));
      void run(items.map((item) => item.id), { type: "stickyPatch", items }, "No se pudieron guardar los cambios.");
    }
  }
  /** Cambia elementos existentes a partir de su estado actual. */
  function change(ids: string[], next: (element: Element) => Data) {
    apply(ids.map((id) => byId.get(id)).filter((element): element is Element => Boolean(element)).map((element) => {
      const before = dataOf(element);
      return { id: element.id, before, after: { ...before, ...next(element) } };
    }));
  }
  function deleteIds(ids: string[]) {
    apply(ids.map((id) => byId.get(id)).filter((element): element is Element => Boolean(element)).map((element) => ({ id: element.id, before: dataOf(element), after: null })));
  }
  function undo() {
    const entries = history.current.undo.pop();
    if (!entries) return;
    history.current.redo.push(entries);
    setHistorySize({ undo: history.current.undo.length, redo: history.current.redo.length });
    apply(entries.map((entry) => ({ id: entry.id, before: entry.after, after: entry.before })), false);
    setSelected(new Set(entries.filter((entry) => entry.before).map((entry) => entry.id)));
  }
  function redo() {
    const entries = history.current.redo.pop();
    if (!entries) return;
    history.current.undo.push(entries);
    setHistorySize({ undo: history.current.undo.length, redo: history.current.redo.length });
    apply(entries, false);
    setSelected(new Set(entries.filter((entry) => entry.after).map((entry) => entry.id)));
  }

  /** Datos de un elemento nuevo con el estilo actual. */
  function newElement(kind: ElementKind, box: Box, extra: Data = {}): Data {
    const { style } = defaults;
    const pick: Partial<Record<ElementKind, (keyof Style)[]>> = { arrow: ["arrowType", "head", "stroke", "weight"], pen: ["stroke", "weight"], rect: ["stroke", "weight", "fill", "font"], ellipse: ["stroke", "weight", "fill", "font"], text: ["font", "align"] };
    return {
      text: "", color: (kind === "note" ? defaults.noteColor : defaults.strokeColor) as StickyColor, kind, x: clampTo(box.x, box.w), y: clampTo(box.y, box.h), w: box.w, h: box.h, points: [], size: defaults.size, from: "", to: "",
      style: { ...Object.fromEntries((pick[kind] ?? []).map((key) => [key, style[key as keyof typeof style]])), z: topZ + 1 } as ElementStyle,
      ...extra,
    };
  }
  function create(items: Data[], edit = false) {
    const ids = items.map(() => crypto.randomUUID());
    apply(items.map((after, index) => ({ id: ids[index], before: null, after })));
    setSelected(new Set(ids));
    if (edit && ids.length === 1) setEditingId(ids[0]);
    return ids;
  }
  const addNote = (x: number, y: number) => create([newElement("note", { x: snap(x - NOTE_W / 2), y: snap(y - 24), w: NOTE_W, h: NOTE_H })], true);
  const addText = (x: number, y: number, text = "") => {
    const w = 280, h = textHeight(text, w, defaults.size, defaults.style.font);
    return create([newElement("text", { x: Math.round(x), y: Math.round(y - textPx[defaults.size] * 0.7), w, h }, { text })], !text);
  };
  function viewCenter(): Point {
    const view = scroller.current, z = zoomRef.current;
    return view ? { x: (view.scrollLeft + view.clientWidth / 2) / z, y: (view.scrollTop + view.clientHeight / 2) / z } : { x: 240, y: 160 };
  }
  function addInView() { const c = viewCenter(), nudge = (live.length % 5) * GRID; addNote(c.x + nudge, c.y - NOTE_H / 2 + nudge); }

  // ——— Portapapeles ———
  function copy(ids = selection.map((note) => note.id)) {
    const items = ids.map((id) => byId.get(id)).filter((element): element is Element => Boolean(element)).map((element) => ({ ...dataOf(element), id: element.id }));
    if (!items.length) return;
    clipboard.current = items;
    pasteCount.current = 0;
    void navigator.clipboard?.writeText(JSON.stringify({ type: CLIP, elements: items })).catch(() => undefined);
  }
  function cut() { const ids = selection.map((note) => note.id); copy(ids); deleteIds(ids); }
  /** Pega elementos con ids nuevos; las flechas conservan las uniones dentro de lo pegado. */
  function pasteElements(items: (Data & { id?: string })[], at?: Point) {
    if (!items.length) return;
    pasteCount.current += 1;
    const boxes = items.map(boxOf), left = Math.min(...boxes.map((b) => b.x)), top = Math.min(...boxes.map((b) => b.y));
    const dx = at ? at.x - left : GRID * pasteCount.current, dy = at ? at.y - top : GRID * pasteCount.current;
    const ids = new Map(items.map((item) => [item.id ?? "", crypto.randomUUID()]));
    let z = topZ;
    const entries = items.map((item) => {
      const box = boxOf(item);
      const after: Data = { ...dataOf(item), x: clampTo(box.x + dx, box.w), y: clampTo(box.y + dy, box.h), style: { ...item.style, z: ++z } };
      if (item.kind === "arrow") { after.from = item.from && ids.has(item.from) ? ids.get(item.from) : ""; after.to = item.to && ids.has(item.to) ? ids.get(item.to) : ""; }
      if (!item.kind) Object.assign(after, { kind: "note", w: NOTE_W, h: NOTE_H, points: [], size: "md", from: "", to: "" });
      return { id: ids.get(item.id ?? "") ?? crypto.randomUUID(), before: null, after };
    });
    apply(entries);
    setSelected(new Set(entries.map((entry) => entry.id)));
  }
  function pasteText(text: string) {
    const raw = text.trim();
    if (!raw) { pasteElements(clipboard.current, lastPointer.current ?? undefined); return; }
    try {
      const parsed = JSON.parse(raw) as { type?: string; elements?: Data[] };
      if (parsed.type === CLIP && Array.isArray(parsed.elements)) { pasteElements(parsed.elements, lastPointer.current ?? undefined); return; }
    } catch { /* texto normal */ }
    const at = lastPointer.current ?? viewCenter();
    addText(at.x, at.y, raw.slice(0, 500));
  }
  async function pasteFromMenu() {
    const text = (await navigator.clipboard?.readText().catch(() => "")) ?? "";
    pasteText(text);
  }
  function duplicate(ids: string[]) {
    const items = ids.map((id) => byId.get(id)).filter((element): element is Element => Boolean(element)).map((element) => ({ ...dataOf(element), id: element.id }));
    pasteCount.current = 0;
    pasteElements(items);
  }

  // ——— Orden, alineación, capas, estilo ———
  function arrange(ids: string[]) {
    const list = ids.map((id) => byId.get(id)).filter((note): note is Element => Boolean(note) && note!.kind !== "arrow").toSorted((a, b) => a.y - b.y || a.x - b.x);
    if (list.length < 2) return;
    const columns = Math.min(6, Math.ceil(Math.sqrt(list.length)));
    const cellW = Math.max(...list.map((note) => boxOf(note).w)) + GRID, cellH = Math.max(...list.map((note) => boxOf(note).h)) + GRID;
    const x0 = snap(Math.min(...list.map((note) => note.x))), y0 = snap(Math.min(...list.map((note) => note.y)));
    const at = new Map(list.map((note, index) => [note.id, { x: clampTo(x0 + (index % columns) * cellW, boxOf(note).w), y: clampTo(y0 + Math.floor(index / columns) * cellH, boxOf(note).h) }]));
    change([...at.keys()], (note) => at.get(note.id)!);
  }
  function align(mode: string) {
    const items = selection.filter((note) => note.kind !== "arrow").map((note) => ({ note, box: boxOf(note) }));
    if (items.length < 2) return;
    const left = Math.min(...items.map((i) => i.box.x)), right = Math.max(...items.map((i) => i.box.x + i.box.w));
    const top = Math.min(...items.map((i) => i.box.y)), bottom = Math.max(...items.map((i) => i.box.y + i.box.h));
    const target = new Map<string, Point>();
    const place = (i: { note: Element; box: Box }, x: number, y: number) => target.set(i.note.id, { x: clampTo(x, i.box.w), y: clampTo(y, i.box.h) });
    for (const i of items) {
      if (mode === "left") place(i, left, i.box.y);
      if (mode === "center") place(i, (left + right) / 2 - i.box.w / 2, i.box.y);
      if (mode === "right") place(i, right - i.box.w, i.box.y);
      if (mode === "top") place(i, i.box.x, top);
      if (mode === "middle") place(i, i.box.x, (top + bottom) / 2 - i.box.h / 2);
      if (mode === "bottom") place(i, i.box.x, bottom - i.box.h);
    }
    if ((mode === "spread-x" || mode === "spread-y") && items.length > 2) {
      const horizontal = mode === "spread-x";
      const sorted = items.toSorted((a, b) => (horizontal ? a.box.x - b.box.x : a.box.y - b.box.y));
      const span = horizontal ? right - left : bottom - top, used = sorted.reduce((sum, i) => sum + (horizontal ? i.box.w : i.box.h), 0), gap = (span - used) / (sorted.length - 1);
      let cursor = horizontal ? left : top;
      for (const i of sorted) { if (horizontal) place(i, cursor, i.box.y); else place(i, i.box.x, cursor); cursor += (horizontal ? i.box.w : i.box.h) + gap; }
    }
    change([...target.keys()], (note) => target.get(note.id)!);
  }
  /** Los post-its antiguos (sin `kind`) pasan al modelo completo al recibir estilo. */
  const upgrade = (note: Element, changes: Data): Data => (note.kind ? changes : { kind: "note", w: NOTE_W, h: NOTE_H, points: [], size: "md", from: "", to: "", ...changes });
  /** Capas: al frente, adelante, atrás, al fondo. */
  function layer(mode: "front" | "forward" | "backward" | "back") {
    const chosen = selection.toSorted((a, b) => order.get(a.id)! - order.get(b.id)!);
    if (!chosen.length) return;
    const zs = live.map((note) => styleOf(note).z), max = Math.max(...zs), min = Math.min(...zs);
    const target = new Map<string, number>();
    chosen.forEach((note, index) => {
      if (mode === "front") target.set(note.id, max + 1 + index);
      if (mode === "back") target.set(note.id, min - chosen.length + index);
      if (mode === "forward") { const above = live[(order.get(note.id) ?? 0) + 1]; target.set(note.id, above && !selected.has(above.id) ? styleOf(above).z + 1 : styleOf(note).z); }
      if (mode === "backward") { const below = live[(order.get(note.id) ?? 0) - 1]; target.set(note.id, below && !selected.has(below.id) ? styleOf(below).z - 1 : styleOf(note).z); }
    });
    change([...target.keys()], (note) => upgrade(note, { style: { ...note.style, z: target.get(note.id)! } }));
  }
  /** Ajuste del panel: se aplica a la selección (si hay) y queda como estilo de los elementos nuevos. */
  function setStyle(patch: { color?: string; size?: TextSize; style?: Partial<Omit<Style, "z">> }) {
    const noteContext = activeTool === "note" || (selection.length > 0 && selection.every(isNote));
    setDefaults((current) => ({
      noteColor: patch.color && noteContext ? patch.color : current.noteColor,
      strokeColor: patch.color && !noteContext ? patch.color : current.strokeColor,
      size: patch.size ?? current.size,
      style: { ...current.style, ...patch.style },
    }));
    if (!selection.length) return;
    change(selection.map((note) => note.id), (note) => {
      const next: Data = {};
      if (patch.color) next.color = patch.color as StickyColor;
      if (patch.size && canHoldText(note) && !isNote(note)) next.size = patch.size;
      if (patch.style) next.style = { ...note.style, ...patch.style };
      if (note.kind === "text" && (patch.size || patch.style?.font)) next.h = textHeight(note.text, note.w ?? 280, next.size ?? note.size ?? "md", patch.style?.font ?? styleOf(note).font);
      return next.style ? upgrade(note, next) : next;
    });
  }

  // Imán al mover: bordes y centros de otros elementos (con guías); si no hay, la cuadrícula.
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
        for (const target of others) for (const a of lines(raw, axis)) for (const b of lines(target, axis)) if (Math.abs(b - a) <= SNAP / zoom && (!best || Math.abs(b - a) < Math.abs(best.d))) best = { d: b - a, line: b, target };
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
  const boxNow = (note: Element): Box => {
    const box = boxOf(note);
    if (gesture?.type === "move" && gesture.moved && gesture.ids.includes(note.id)) {
      const origin = gesture.origin[note.id];
      return { ...box, x: clampTo(origin.x + shiftX, box.w), y: clampTo(origin.y + shiftY, box.h) };
    }
    if (gesture?.type === "resize" && gesture.id === note.id) {
      const w = Math.max(note.kind === "text" ? 80 : 32, snap(gesture.box.w + gesture.dx));
      const h = note.kind === "text" ? textHeight(note.text, w, note.size ?? "md", styleOf(note).font) : Math.max(32, snap(gesture.box.h + gesture.dy));
      return { ...gesture.box, w: Math.min(w, canvasSize - gesture.box.x), h: Math.min(h, canvasSize - gesture.box.y) };
    }
    return box;
  };
  /** Extremos de una flecha: unida a elementos, sale y llega a sus bordes y los sigue. */
  const arrowEnds = (arrow: Element) => {
    const pts = (arrow.points?.length ?? 0) >= 4 ? arrow.points! : [0, 0, arrow.w ?? 0, arrow.h ?? 0];
    let start: Point = { x: arrow.x + pts[0], y: arrow.y + pts[1] }, end: Point = { x: arrow.x + pts[pts.length - 2], y: arrow.y + pts[pts.length - 1] };
    let mids = arrowVertices(arrow);
    let fromEl = arrow.from ? byId.get(arrow.from) : undefined, toEl = arrow.to ? byId.get(arrow.to) : undefined;
    if (!bindable(fromEl)) fromEl = undefined;
    if (!bindable(toEl)) toEl = undefined;
    if (gesture?.type === "move" && gesture.moved && gesture.ids.includes(arrow.id)) {
      if (fromEl && !gesture.ids.includes(fromEl.id)) fromEl = undefined;
      if (toEl && !gesture.ids.includes(toEl.id)) toEl = undefined;
      if (!fromEl) start = { x: start.x + shiftX, y: start.y + shiftY };
      if (!toEl) end = { x: end.x + shiftX, y: end.y + shiftY };
      mids = mids.map((pt) => ({ x: pt.x + shiftX, y: pt.y + shiftY }));
    }
    if (gesture?.type === "vertex" && gesture.id === arrow.id && (gesture.moved || !gesture.insert)) {
      mids = [...mids];
      if (gesture.insert) mids.splice(gesture.index, 0, { x: gesture.x, y: gesture.y }); else mids[gesture.index] = { x: gesture.x, y: gesture.y };
    }
    if (gesture?.type === "arrowEnd" && gesture.id === arrow.id) {
      const target = gesture.target ? byId.get(gesture.target) : undefined;
      if (gesture.end === "start") { fromEl = target; start = { x: gesture.x, y: gesture.y }; } else { toEl = target; end = { x: gesture.x, y: gesture.y }; }
    }
    const fromBox = fromEl ? boxNow(fromEl) : undefined, toBox = toEl ? boxNow(toEl) : undefined;
    const ref0 = mids.at(-1) ?? (fromBox ? centerOf(fromBox) : start), ref1 = mids[0] ?? (toBox ? centerOf(toBox) : end);
    return { start: fromEl && fromBox ? edgeToward(fromEl, fromBox, ref1) : start, end: toEl && toBox ? edgeToward(toEl, toBox, ref0) : end, mids, from: fromEl?.id ?? "", to: toEl?.id ?? "" };
  };
  const arrowData = (ends: { start: Point; end: Point; mids?: Point[]; from: string; to: string }): Data => {
    const clamp = (value: number) => Math.min(Math.max(Math.round(value), 0), canvasSize);
    const all = [ends.start, ...(ends.mids ?? []), ends.end];
    const x = clamp(Math.min(...all.map((pt) => pt.x))), y = clamp(Math.min(...all.map((pt) => pt.y)));
    const points = all.flatMap((pt) => [pt.x - x, pt.y - y]).map((value) => Math.max(-canvasSize, Math.min(canvasSize, Math.round(value))));
    const xs = points.filter((_, i) => i % 2 === 0), ys = points.filter((_, i) => i % 2 === 1);
    return { x, y, w: Math.min(Math.max(1, Math.max(...xs) - Math.min(...xs)), canvasSize), h: Math.min(Math.max(1, Math.max(...ys) - Math.min(...ys)), canvasSize), points, from: ends.from, to: ends.to };
  };
  const hitBox = (note: Element): Box => {
    if (note.kind !== "arrow") return boxOf(note);
    const { start, end, mids } = arrowEnds(note), all = [start, ...mids, end], xs = all.map((pt) => pt.x), ys = all.map((pt) => pt.y);
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  };
  /** Quita uno o todos los vértices de una flecha. */
  const removeVertex = (arrow: Element, index?: number) => {
    const ends = arrowEnds(arrow);
    change([arrow.id], () => arrowData({ ...ends, mids: index === undefined ? [] : ends.mids.filter((_, i) => i !== index) }));
  };

  // ——— Zoom ———
  function zoomTo(next: number, anchor?: { clientX: number; clientY: number }) {
    const view = scroller.current, current = zoomRef.current, value = Math.min(3, Math.max(0.25, Math.round(next * 100) / 100));
    if (!view || value === current) return;
    const rect = view.getBoundingClientRect(), ox = anchor ? anchor.clientX - rect.left : view.clientWidth / 2, oy = anchor ? anchor.clientY - rect.top : view.clientHeight / 2;
    const cx = (view.scrollLeft + ox) / current, cy = (view.scrollTop + oy) / current;
    zoomRef.current = value;
    setZoom(value);
    requestAnimationFrame(() => { view.scrollLeft = cx * value - ox; view.scrollTop = cy * value - oy; });
  }
  function fitToContent() {
    const view = scroller.current;
    if (!view || !live.length) { zoomTo(1); return; }
    const boxes = live.map(hitBox), left = Math.min(...boxes.map((b) => b.x)), top = Math.min(...boxes.map((b) => b.y));
    const right = Math.max(...boxes.map((b) => b.x + b.w)), bottom = Math.max(...boxes.map((b) => b.y + b.h));
    const value = Math.min(3, Math.max(0.25, Math.min(view.clientWidth / (right - left + 160), view.clientHeight / (bottom - top + 200))));
    zoomRef.current = value;
    setZoom(value);
    requestAnimationFrame(() => { view.scrollLeft = (left - 80) * value; view.scrollTop = (top - 120) * value; });
  }
  const wheel = useRef<(event: WheelEvent) => void>(() => {});
  useEffect(() => {
    wheel.current = (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoomTo(zoomRef.current * Math.exp(-event.deltaY * 0.0025), event);
    };
  });
  useEffect(() => {
    const view = scroller.current;
    if (!view) return;
    const listener = (event: WheelEvent) => wheel.current(event);
    view.addEventListener("wheel", listener, { passive: false });
    return () => view.removeEventListener("wheel", listener);
  }, [boardId]);

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
  const point = (event: { clientX: number; clientY: number }): Point => {
    const box = stage.current!.getBoundingClientRect(), z = zoomRef.current;
    return { x: (event.clientX - box.left) / z, y: (event.clientY - box.top) / z };
  };
  const elementAt = (target: EventTarget | null) => (target as HTMLElement | null)?.closest?.<HTMLElement>("[data-note]")?.dataset.note;
  const elementUnder = (event: { clientX: number; clientY: number }) => elementAt(document.elementFromPoint?.(event.clientX, event.clientY) ?? null);
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
    const handle = target.closest("[data-handle]")?.getAttribute("data-handle");
    if (handle && editable) {
      const note = selection[0];
      if (note && /^[vm]:\d+$/.test(handle)) {
        const index = Number(handle.slice(2)), ends = arrowEnds(note), all = [ends.start, ...ends.mids, ends.end];
        const at = handle[0] === "v" ? ends.mids[index] : { x: (all[index].x + all[index + 1].x) / 2, y: (all[index].y + all[index + 1].y) / 2 };
        if (!at) return;
        capture();
        setGesture({ type: "vertex", id: note.id, index, insert: handle[0] === "m", x: at.x, y: at.y, moved: false });
      } else if (note && (handle === "start" || handle === "end")) {
        const ends = arrowEnds(note), at = handle === "start" ? ends.start : ends.end;
        capture();
        setGesture({ type: "arrowEnd", id: note.id, end: handle, x: at.x, y: at.y, target: handle === "start" ? ends.from : ends.to });
      } else if (note) { capture(); setGesture({ type: "resize", id: note.id, box: boxOf(note), sx: x, sy: y, dx: 0, dy: 0 }); }
      return;
    }
    if (editingId) stopEditing();
    if (!editable && activeTool !== "select") return;
    if (activeTool === "note") { addNote(x, y); setTool("select"); return; }
    if (activeTool === "text") { addText(x, y); setTool("select"); return; }
    if (activeTool === "pen") { capture(); setSelected(new Set()); setGesture({ type: "draw", points: [Math.round(x), Math.round(y)] }); return; }
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
    if (stage.current) lastPointer.current = point(event);
    if (!gesture) return;
    const { x, y } = point(event);
    if (gesture.type === "pan") {
      scroller.current!.scrollLeft = gesture.left - (event.clientX - gesture.sx);
      scroller.current!.scrollTop = gesture.top - (event.clientY - gesture.sy);
    } else if (gesture.type === "move") {
      const dx = x - gesture.sx, dy = y - gesture.sy;
      if (!gesture.moved && Math.hypot(dx, dy) < 4 / zoom) return;
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
      if (Math.hypot(x - last[0], y - last[1]) >= 2.5 && gesture.points.length < 1000) setGesture({ ...gesture, points: [...gesture.points, Math.round(x), Math.round(y)] });
    } else if (gesture.type === "shape") {
      const over = gesture.kind === "arrow" ? elementUnder(event) : undefined;
      setGesture({ ...gesture, x1: x, y1: y, free: event.altKey, to: over && over !== gesture.from && bindable(byId.get(over)) ? over : "" });
    } else if (gesture.type === "vertex") {
      if (!gesture.moved && Math.hypot(x - gesture.x, y - gesture.y) < 3 / zoom) return;
      setGesture({ ...gesture, x: snap(x, event.altKey), y: snap(y, event.altKey), moved: true });
    } else if (gesture.type === "arrowEnd") {
      const over = elementUnder(event);
      setGesture({ ...gesture, x, y, target: over && over !== gesture.id && bindable(byId.get(over)) ? over : "" });
    } else if (gesture.type === "erase") {
      const id = elementUnder(event);
      if (id && !gesture.ids.includes(id)) setGesture({ ...gesture, ids: [...gesture.ids, id] });
    }
  }
  function onPointerUp() {
    const done = gesture;
    setGesture(null);
    if (!done) return;
    if (done.type === "move" && done.moved) {
      apply(done.ids.map((id) => byId.get(id)).filter((note): note is Element => Boolean(note)).map((note) => {
        const before = dataOf(note);
        if (note.kind === "arrow") return { id: note.id, before, after: { ...before, ...arrowData(arrowEnds(note)) } };
        const box = boxNow(note);
        return { id: note.id, before, after: { ...before, x: box.x, y: box.y } };
      }));
    }
    if (done.type === "vertex" && done.moved) { const arrow = byId.get(done.id); if (arrow) change([arrow.id], () => arrowData(arrowEnds(arrow))); }
    if (done.type === "arrowEnd") { const arrow = byId.get(done.id); if (arrow) change([arrow.id], () => arrowData(arrowEnds(arrow))); }
    if (done.type === "resize") { const note = byId.get(done.id); if (note) change([note.id], () => boxNow(note)); }
    if (done.type === "erase") deleteIds(done.ids);
    if (done.type === "draw" && done.points.length >= 2) {
      const xs = done.points.filter((_, i) => i % 2 === 0), ys = done.points.filter((_, i) => i % 2 === 1);
      const left = Math.min(...xs), top = Math.min(...ys);
      create([newElement("pen", { x: left, y: top, w: Math.max(1, Math.max(...xs) - left), h: Math.max(1, Math.max(...ys) - top) }, { points: done.points.map((value, i) => value - (i % 2 === 0 ? left : top)) })]);
      setSelected(new Set());
    }
    if (done.type === "shape") {
      if (done.kind === "arrow") {
        const fromEl = done.from ? byId.get(done.from) : undefined, toEl = done.to ? byId.get(done.to) : undefined;
        if (Math.hypot(done.x1 - done.x0, done.y1 - done.y0) < 12 && !(fromEl && toEl)) return;
        const data = arrowData({ start: { x: done.x0, y: done.y0 }, end: { x: done.x1, y: done.y1 }, from: done.from, to: done.to });
        create([newElement("arrow", { x: data.x!, y: data.y!, w: data.w!, h: data.h! }, data)]);
      } else {
        const sx = snap(done.x0, done.free), sy = snap(done.y0, done.free), ex = snap(done.x1, done.free), ey = snap(done.y1, done.free);
        let w = Math.abs(ex - sx), h = Math.abs(ey - sy);
        if (w < 16 && h < 16) { w = 160; h = 112; }
        create([newElement(done.kind, { x: Math.min(sx, ex), y: Math.min(sy, ey), w: Math.max(1, w), h: Math.max(1, h) })]);
      }
      setTool("select");
    }
  }
  function onDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!editable || activeTool !== "select") return;
    const vertex = (event.target as HTMLElement).closest?.("[data-handle]")?.getAttribute("data-handle");
    if (vertex?.startsWith("v:") && single?.kind === "arrow") { removeVertex(single, Number(vertex.slice(2))); return; }
    const id = elementAt(event.target);
    if (id) { const note = byId.get(id); if (note && canHoldText(note)) { setSelected(new Set([id])); setEditingId(id); } return; }
    const { x, y } = point(event);
    addText(x, y);
  }
  function onContextMenuCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!stage.current) return;
    menuPoint.current = point(event);
    lastPointer.current = menuPoint.current;
    const id = elementAt(event.target);
    if (id) { if (!selected.has(id)) setSelected(new Set([id])); setMenuTarget("notes"); }
    else { setSelected(new Set()); stopEditing(); setMenuTarget("canvas"); }
  }
  function onMenu(value: string) {
    const ids = selection.map((note) => note.id);
    if (value === "add") addNote(menuPoint.current.x, menuPoint.current.y);
    if (value === "add-text") addText(menuPoint.current.x, menuPoint.current.y);
    if (value === "paste") void pasteFromMenu();
    if (value === "copy") copy();
    if (value === "cut") cut();
    if (value === "select-all") setSelected(new Set(live.map((note) => note.id)));
    if (value === "arrange-all") arrange(live.map((note) => note.id));
    if (value === "arrange") arrange(ids);
    if (value === "edit" && ids.length === 1) setEditingId(ids[0]);
    if (value === "duplicate") duplicate(ids);
    if (value === "delete") deleteIds(ids);
    if (value === "clear") setSelected(new Set());
    if (value === "undo") undo();
    if (value === "redo") redo();
    if (value.startsWith("layer:")) layer(value.slice(6) as "front");
    if (value.startsWith("align:")) align(value.slice(6));
    if (value.startsWith("color:")) setStyle({ color: value.slice(6) });
  }

  // ——— Teclado y portapapeles del sistema ———
  const keys = useRef<(event: KeyboardEvent) => void>(() => {});
  const onPaste = useRef<(event: ClipboardEvent) => void>(() => {});
  useEffect(() => {
    keys.current = (event) => {
      const target = event.target as HTMLElement | null;
      const typing = Boolean(target?.closest?.("input,textarea,[contenteditable],[role=menu],[role=dialog]"));
      if (event.key === " " && !typing && !target?.closest?.("button")) { event.preventDefault(); setSpacePan(event.type === "keydown"); return; }
      if (event.type !== "keydown" || editingId || typing) return;
      const mod = isMac() ? event.metaKey : event.ctrlKey, key = event.key.toLowerCase();
      const ids = selection.map((note) => note.id);
      if (mod && key === "z") { event.preventDefault(); if (event.shiftKey) redo(); else undo(); return; }
      if (mod && key === "y") { event.preventDefault(); redo(); return; }
      if (mod && key === "a") { event.preventDefault(); setSelected(new Set(live.map((note) => note.id))); return; }
      if (mod && key === "c" && ids.length) { event.preventDefault(); copy(); return; }
      if (mod && key === "x" && ids.length && editable) { event.preventDefault(); cut(); return; }
      if (mod && (key === "=" || key === "+")) { event.preventDefault(); zoomTo(zoomRef.current * 1.2); return; }
      if (mod && key === "-") { event.preventDefault(); zoomTo(zoomRef.current / 1.2); return; }
      if (mod && key === "0") { event.preventDefault(); zoomTo(1); return; }
      if (event.shiftKey && event.code === "Digit1") { event.preventDefault(); fitToContent(); return; }
      if (event.key === "?") { setHelpOpen(true); return; }
      if (event.key === "Escape") { setSelected(new Set()); setTool("select"); return; }
      if (!editable) return;
      if (mod && key === "d" && ids.length) { event.preventDefault(); duplicate(ids); return; }
      if (mod && (event.key === "]" || event.key === "}")) { event.preventDefault(); layer(event.shiftKey ? "front" : "forward"); return; }
      if (mod && (event.key === "[" || event.key === "{")) { event.preventDefault(); layer(event.shiftKey ? "back" : "backward"); return; }
      if ((event.key === "Delete" || event.key === "Backspace") && ids.length) { event.preventDefault(); deleteIds(ids); return; }
      if (event.key === "Enter" && ids.length === 1 && canHoldText(selection[0])) { event.preventDefault(); setEditingId(ids[0]); return; }
      if (!mod && !event.altKey && !event.shiftKey) {
        const shortcut = tools.find((item) => item.key === key) ?? (/^[1-9]$/.test(event.key) ? tools[Number(event.key) - 1] : undefined);
        if (shortcut) { setTool(shortcut.value); return; }
      }
      const step = event.shiftKey ? GRID * 4 : GRID;
      const delta = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, number[]>)[event.key];
      if (delta && ids.length) { event.preventDefault(); change(ids.filter((id) => byId.get(id)?.kind !== "arrow"), (note) => { const box = boxOf(note); return { x: clampTo(note.x + delta[0], box.w), y: clampTo(note.y + delta[1], box.h) }; }); }
    };
    onPaste.current = (event) => {
      if (!editable || editingId || (event.target as HTMLElement | null)?.closest?.("input,textarea,[contenteditable]")) return;
      event.preventDefault();
      pasteText(event.clipboardData?.getData("text/plain") ?? "");
    };
  });
  useEffect(() => {
    const key = (event: KeyboardEvent) => keys.current(event), paste = (event: ClipboardEvent) => onPaste.current(event);
    window.addEventListener("keydown", key);
    window.addEventListener("keyup", key);
    window.addEventListener("paste", paste);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("keyup", key); window.removeEventListener("paste", paste); };
  }, []);

  if (whiteboards.loading || whiteboards.error) return <WorkspaceStatus loading={whiteboards.loading} errors={[whiteboards.error]} />;
  const modLabel = isMac() ? "⌘" : "Ctrl+";
  const single = selection.length === 1 ? selection[0] : undefined;
  const bindTargets = new Set(gesture?.type === "shape" && gesture.kind === "arrow" ? [gesture.from, gesture.to] : gesture?.type === "arrowEnd" ? [gesture.target] : []);
  const draftArrow = (() => {
    if (gesture?.type !== "shape" || gesture.kind !== "arrow") return undefined;
    const fromEl = gesture.from ? byId.get(gesture.from) : undefined, toEl = gesture.to ? byId.get(gesture.to) : undefined;
    const p0 = { x: gesture.x0, y: gesture.y0 }, p1 = { x: gesture.x1, y: gesture.y1 };
    return { start: fromEl ? edgeToward(fromEl, boxOf(fromEl), toEl ? centerOf(boxOf(toEl)) : p1) : p0, end: toEl ? edgeToward(toEl, boxOf(toEl), fromEl ? centerOf(boxOf(fromEl)) : p0) : p1 };
  })();
  const cursor = { select: gesture?.type === "move" && gesture.moved ? "grabbing" : "default", hand: gesture?.type === "pan" ? "grabbing" : "grab", note: "copy", text: "text", pen: "crosshair", rect: "crosshair", ellipse: "crosshair", arrow: "crosshair", eraser: "cell" }[activeTool];

  // Panel de propiedades: lo que aplica a la selección o a la herramienta activa.
  const panelKinds = new Set<ElementKind>(selection.length ? selection.map((note) => note.kind ?? "note") : (["note", "text", "pen", "rect", "ellipse", "arrow"] as Tool[]).includes(activeTool) ? [activeTool as ElementKind] : []);
  const has = (...kinds: ElementKind[]) => kinds.some((kind) => panelKinds.has(kind));
  const current = (key: keyof Omit<Style, "z">) => (selection.length ? (selection.every((note) => styleOf(note)[key] === styleOf(selection[0])[key]) ? [String(styleOf(selection[0])[key])] : []) : [String(defaults.style[key])]);
  const noteMode = activeTool === "note" || (selection.length > 0 && selection.every(isNote));
  const colorValue = selection.length ? (selection.every((note) => note.color === selection[0].color) ? [selection[0].color] : []) : [noteMode ? defaults.noteColor : defaults.strokeColor];
  const sizeValue = selection.length ? (selection.every((note) => (note.size ?? "md") === (selection[0].size ?? "md")) ? [selection[0].size ?? "md"] : []) : [defaults.size];
  const showPanel = editable && panelKinds.size > 0 && !editingId;
  const alignable = selection.filter((note) => note.kind !== "arrow").length;

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
              <MenuContent className={contentClass} sideOffset={4}>
                {editable ? <MenuItem value="rename" className={menuStyles.item}><Pencil size={16} aria-hidden="true" />Renombrar</MenuItem> : null}
                {editable ? (
                  <MenuSub>
                    <MenuSubTrigger className={menuStyles.item}><Palette size={16} aria-hidden="true" />Color<ChevronRight size={15} aria-hidden="true" className="ml-auto" /></MenuSubTrigger>
                    <MenuSubContent className={contentClass}>{boardColors.map((item) => <MenuItem key={item.value} value={`color:${item.value}`} className={menuStyles.item}><StatusDot tone={item.value} size={9} />{item.label}</MenuItem>)}</MenuSubContent>
                  </MenuSub>
                ) : null}
                <MenuItem value="new" className={menuStyles.item}><SquarePlus size={16} aria-hidden="true" />Nueva pizarra</MenuItem>
                <MenuSeparator className={menuStyles.separator} />
                <MenuItem value="archive" className={menuStyles.item} data-danger={editable || undefined}>{editable ? <Archive size={16} aria-hidden="true" /> : <ArchiveRestore size={16} aria-hidden="true" />}{editable ? "Archivar pizarra" : "Restaurar pizarra"}</MenuItem>
              </MenuContent>
            </Menu>
          </div>

          <div className="relative">
            {/* Herramientas */}
            <div className="absolute z-[1000] top-[12px] left-1/2 -translate-x-1/2 w-max max-w-[calc(100%-24px)]">
              <Toolbar aria-label="Herramientas" className={`${barClass} max-w-full overflow-x-auto [scrollbar-width:none]`}>
                <ToggleGroup aria-label="Herramienta" value={[activeTool]} deselectable={false} onValueChange={([value]) => value && setTool(value as Tool)} className="flex items-center gap-[2px]">
                  {tools.filter((item) => editable || item.value === "select" || item.value === "hand").map((item, index) => (
                    <span key={item.value} className="contents">
                      {index === 2 ? sep : null}
                      <Tip label={`${item.label} · ${index + 1}`} shortcut={item.key}><Toggle value={item.value} aria-label={item.label} className={toolClass}>{item.icon}</Toggle></Tip>
                    </span>
                  ))}
                </ToggleGroup>
                {sep}
                <Tip label="Atajos de teclado" shortcut="shift+/"><ToolbarButton aria-label="Atajos de teclado" className={`${toolClass} text-ink-soft`} onClick={() => setHelpOpen(true)}><Keyboard size={17} aria-hidden="true" /></ToolbarButton></Tip>
              </Toolbar>
            </div>

            {/* Panel de propiedades */}
            {showPanel ? (
              <aside aria-label="Propiedades" className="absolute z-[1000] top-[72px] left-[12px] w-[212px] max-h-[calc(100%-150px)] overflow-y-auto flex flex-col gap-[14px] p-[12px] rounded-[14px] border border-rule bg-surface [box-shadow:var(--shadow-pop)] max-[720px]:hidden">
                <section className="flex flex-col gap-[6px]">
                  <h3 className={sectionTitle}>Color</h3>
                  <ToggleGroup aria-label="Color" value={colorValue} onValueChange={([next]) => next && setStyle({ color: next })} className="flex flex-wrap gap-[4px]">
                    {(noteMode ? stickyColors : strokeColors).map((item) => <Tip key={item.value} label={item.label}><Toggle value={item.value} aria-label={`Color ${item.label.toLowerCase()}`} className={optionClass}>{swatch(item.value, noteMode)}</Toggle></Tip>)}
                  </ToggleGroup>
                </section>
                {has("rect", "ellipse") ? <OptionGroup args={["Fondo", [
                  { value: "none", label: "Sin fondo", icon: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18"><rect x="2.5" y="2.5" width="13" height="13" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" /></svg> },
                  { value: "soft", label: "Fondo suave", icon: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18"><rect x="2.5" y="2.5" width="13" height="13" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" /></svg> },
                  { value: "solid", label: "Fondo intenso", icon: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18"><rect x="2.5" y="2.5" width="13" height="13" rx="3" fill="currentColor" fillOpacity="0.55" stroke="currentColor" strokeWidth="1.5" /></svg> },
                ], current("fill"), (value) => setStyle({ style: { fill: value as Style["fill"] } })]} /> : null}
                {has("pen", "rect", "ellipse", "arrow") ? <OptionGroup args={["Grosor", [
                  { value: "1", label: "Fino", icon: lineIcon({ width: 1.5 }) },
                  { value: "2", label: "Medio", icon: lineIcon({ width: 2.75 }) },
                  { value: "4", label: "Grueso", icon: lineIcon({ width: 4.5 }) },
                ], current("weight"), (value) => setStyle({ style: { weight: Number(value) as Style["weight"] } })]} /> : null}
                {has("pen", "rect", "ellipse", "arrow") ? <OptionGroup args={["Trazo", [
                  { value: "solid", label: "Continuo", icon: lineIcon({}) },
                  { value: "dashed", label: "Discontinuo", icon: lineIcon({ dash: "4 3" }) },
                  { value: "dotted", label: "Punteado", icon: lineIcon({ dash: "0.1 4" }) },
                ], current("stroke"), (value) => setStyle({ style: { stroke: value as Style["stroke"] } })]} /> : null}
                {has("arrow") ? <OptionGroup args={["Tipo de flecha", [
                  { value: "straight", label: "Recta", icon: lineIcon({ children: <path d="M3 16 L17 4" strokeWidth={2} /> }) },
                  { value: "elbow", label: "En codo", icon: lineIcon({ children: <path d="M3 15 H10 V5 H17" strokeWidth={2} /> }) },
                  { value: "curved", label: "Curva", icon: lineIcon({ children: <path d="M3 16 Q4 4 17 4" strokeWidth={2} /> }) },
                ], current("arrowType"), (value) => setStyle({ style: { arrowType: value as Style["arrowType"] } })]} /> : null}
                {has("arrow") ? <OptionGroup args={["Puntas", [
                  { value: "none", label: "Sin puntas", icon: lineIcon({}) },
                  { value: "end", label: "Al final", icon: lineIcon({ children: <path d="M3 10 H17 M13 6 L17 10 L13 14" strokeWidth={2} /> }) },
                  { value: "start", label: "Al inicio", icon: lineIcon({ children: <path d="M3 10 H17 M7 6 L3 10 L7 14" strokeWidth={2} /> }) },
                  { value: "both", label: "En ambos extremos", icon: lineIcon({ children: <path d="M3 10 H17 M13 6 L17 10 L13 14 M7 6 L3 10 L7 14" strokeWidth={2} /> }) },
                ], current("head"), (value) => setStyle({ style: { head: value as Style["head"] } })]} /> : null}
                {has("text", "rect", "ellipse") ? <OptionGroup args={["Fuente", [
                  { value: "sans", label: "Sans", icon: <span style={{ fontFamily: fontFamily.sans }} className="text-[15px] font-semibold">Aa</span> },
                  { value: "display", label: "Titular", icon: <span style={{ fontFamily: fontFamily.display }} className="text-[15px] font-semibold">Aa</span> },
                  { value: "mono", label: "Monoespaciada", icon: <span style={{ fontFamily: fontFamily.mono }} className="text-[14px]">Aa</span> },
                  { value: "serif", label: "Serif", icon: <span style={{ fontFamily: fontFamily.serif }} className="text-[16px]">Aa</span> },
                ], current("font"), (value) => setStyle({ style: { font: value as Style["font"] } })]} /> : null}
                {has("text", "rect", "ellipse") ? <OptionGroup args={["Tamaño", (["sm", "md", "lg", "xl"] as const).map((size) => ({ value: size, label: { sm: "Pequeño", md: "Mediano", lg: "Grande", xl: "Muy grande" }[size], icon: <span className="text-[12px] font-semibold">{size.toUpperCase()}</span> })), sizeValue, (value) => setStyle({ size: value as TextSize })]} /> : null}
                {has("text", "rect", "ellipse") ? <OptionGroup args={["Alineación", [
                  { value: "left", label: "Izquierda", icon: <AlignLeft size={16} aria-hidden="true" /> },
                  { value: "center", label: "Centro", icon: <AlignCenter size={16} aria-hidden="true" /> },
                  { value: "right", label: "Derecha", icon: <AlignRight size={16} aria-hidden="true" /> },
                ], current("align"), (value) => setStyle({ style: { align: value as Style["align"] } })]} /> : null}
                {selection.length ? (
                  <section className="flex flex-col gap-[6px]">
                    <h3 className={sectionTitle}>Capas</h3>
                    <div className="flex gap-[4px]">
                      {<ActionButton args={["Al fondo", <ArrowDownToLine key="icon" size={16} aria-hidden="true" />, () => layer("back"), "mod+shift+["]} />}
                      {<ActionButton args={["Atrás", <ArrowDown key="icon" size={16} aria-hidden="true" />, () => layer("backward"), "mod+["]} />}
                      {<ActionButton args={["Adelante", <ArrowUp key="icon" size={16} aria-hidden="true" />, () => layer("forward"), "mod+]"]} />}
                      {<ActionButton args={["Al frente", <ArrowUpToLine key="icon" size={16} aria-hidden="true" />, () => layer("front"), "mod+shift+]"]} />}
                    </div>
                  </section>
                ) : null}
                {alignable > 1 ? (
                  <section className="flex flex-col gap-[6px]">
                    <h3 className={sectionTitle}>Alinear</h3>
                    <div className="flex flex-wrap gap-[4px]">
                      {<ActionButton args={["A la izquierda", <AlignStartVertical key="icon" size={16} aria-hidden="true" />, () => align("left")]} />}
                      {<ActionButton args={["Centrar en horizontal", <AlignCenterVertical key="icon" size={16} aria-hidden="true" />, () => align("center")]} />}
                      {<ActionButton args={["A la derecha", <AlignEndVertical key="icon" size={16} aria-hidden="true" />, () => align("right")]} />}
                      {<ActionButton args={["Repartir en horizontal", <AlignHorizontalSpaceAround key="icon" size={16} aria-hidden="true" />, () => align("spread-x"), undefined, "", alignable < 3]} />}
                      {<ActionButton args={["Arriba", <AlignStartHorizontal key="icon" size={16} aria-hidden="true" />, () => align("top")]} />}
                      {<ActionButton args={["Centrar en vertical", <AlignCenterHorizontal key="icon" size={16} aria-hidden="true" />, () => align("middle")]} />}
                      {<ActionButton args={["Abajo", <AlignEndHorizontal key="icon" size={16} aria-hidden="true" />, () => align("bottom")]} />}
                      {<ActionButton args={["Repartir en vertical", <AlignVerticalSpaceAround key="icon" size={16} aria-hidden="true" />, () => align("spread-y"), undefined, "", alignable < 3]} />}
                    </div>
                  </section>
                ) : null}
                {selection.length ? (
                  <section className="flex flex-col gap-[6px]">
                    <h3 className={sectionTitle}>Acciones</h3>
                    <div className="flex gap-[4px]">
                      {single?.kind === "arrow" && editable && arrowVertices(single).length ? <ActionButton args={["Quitar vértices", <Spline key="icon" size={16} aria-hidden="true" />, () => removeVertex(single)]} /> : null}
                      {single && canHoldText(single) ? <ActionButton args={["Editar texto", <Pencil key="icon" size={16} aria-hidden="true" />, () => setEditingId(single.id), "enter"]} /> : null}
                      {<ActionButton args={["Copiar", <Copy key="icon" size={16} aria-hidden="true" />, () => copy(), "mod+c"]} />}
                      {<ActionButton args={["Duplicar", <SquarePlus key="icon" size={16} aria-hidden="true" />, () => duplicate(selection.map((note) => note.id)), "mod+d"]} />}
                      {<ActionButton args={["Eliminar", <Trash2 key="icon" size={16} aria-hidden="true" />, () => deleteIds(selection.map((note) => note.id)), "delete", "text-[var(--coral)]!"]} />}
                    </div>
                  </section>
                ) : null}
              </aside>
            ) : null}

            {/* Zoom e historial */}
            <div className="absolute z-[1000] bottom-[12px] left-[12px] flex items-center gap-[8px]">
              <div className={barClass} role="group" aria-label="Zoom">
                <Tip label="Alejar" shortcut="mod+-"><button type="button" className={toolClass} aria-label="Alejar" onClick={() => zoomTo(zoom / 1.2)}><Minus size={16} aria-hidden="true" /></button></Tip>
                <Tip label="Restablecer al 100 %" shortcut="mod+0"><button type="button" className={`${toolClass} min-w-[56px] text-[12.5px] font-semibold tabular-nums`} aria-label={`Zoom ${Math.round(zoom * 100)} %`} onClick={() => zoomTo(1)}>{Math.round(zoom * 100)}%</button></Tip>
                <Tip label="Acercar" shortcut="mod+="><button type="button" className={toolClass} aria-label="Acercar" onClick={() => zoomTo(zoom * 1.2)}><Plus size={16} aria-hidden="true" /></button></Tip>
                <Tip label="Ajustar a todo" shortcut="shift+1"><button type="button" className={toolClass} aria-label="Ajustar a todo" onClick={fitToContent}><Maximize size={15} aria-hidden="true" /></button></Tip>
              </div>
              {editable ? (
                <div className={barClass} role="group" aria-label="Historial">
                  <Tip label="Deshacer" shortcut="mod+z"><button type="button" className={toolClass} aria-label="Deshacer" aria-disabled={!historySize.undo || undefined} onClick={undo}><Undo2 size={16} aria-hidden="true" /></button></Tip>
                  <Tip label="Rehacer" shortcut="mod+shift+z"><button type="button" className={toolClass} aria-label="Rehacer" aria-disabled={!historySize.redo || undefined} onClick={redo}><Redo2 size={16} aria-hidden="true" /></button></Tip>
                </div>
              ) : null}
            </div>

            <Menu onAction={onMenu}>
              <MenuContextTrigger
                className="block rounded-[var(--r-xl)] border border-rule bg-surface [box-shadow:var(--shadow-xs)] focus-visible:outline-2 focus-visible:outline-[var(--blue)] focus-visible:outline-offset-2"
                tabIndex={0}
                aria-label={`Lienzo de ${board.name}. ${live.length} elementos. Clic derecho o Mayús+F10 para opciones; ? muestra los atajos.`}
                onContextMenuCapture={onContextMenuCapture}
              >
                <div ref={scroller} className="relative h-[calc(100dvh-280px)] min-h-[520px] overflow-auto rounded-[var(--r-xl)] max-[960px]:h-[68dvh]">
                  <div className="relative" style={{ width: width * zoom, height: height * zoom }}>
                    <div
                      ref={stage}
                      className="absolute left-0 top-0 select-none [background-image:radial-gradient(var(--rule-strong)_1px,transparent_1.2px)] [background-size:24px_24px] [touch-action:pan-x_pan-y]"
                      style={{ width, height, cursor, transform: `scale(${zoom})`, transformOrigin: "0 0", touchAction: activeTool === "select" || activeTool === "hand" ? undefined : "none" }}
                      onPointerDown={onPointerDown}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={() => setGesture(null)}
                      onDoubleClick={onDoubleClick}
                      onMouseDown={(event) => { if (activeTool === "text" || activeTool === "note") event.preventDefault(); }}
                    >
                      {live.map((note) => {
                        const z = 10 + (order.get(note.id) ?? 0) + (gesture?.type === "move" && gesture.moved && gesture.ids.includes(note.id) ? 5000 : 0) + (editingId === note.id ? 6000 : 0);
                        const erasing = gesture?.type === "erase" && gesture.ids.includes(note.id);
                        if (note.kind === "arrow") {
                          const { start, end, mids } = arrowEnds(note), style = styleOf(note), isSelected = selected.has(note.id), all = [start, ...mids, end];
                          const handles = isSelected && single?.id === note.id && editable && activeTool === "select";
                          return (
                            <svg key={note.id} className="absolute left-0 top-0 overflow-visible pointer-events-none" width={width} height={height} style={{ zIndex: z, opacity: erasing ? 0.25 : 1 }}>
                              <g data-note={note.id} role="group" aria-label={`Flecha${isSelected ? " (seleccionada)" : ""}`}>
                                {isSelected ? <path d={arrowGeometry(all, style.arrowType).d} fill="none" stroke="var(--blue)" strokeOpacity={0.22} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /> : null}
                                <ArrowShape points={all} style={style} color={note.color} hit />
                                {handles
                                  ? all.slice(0, -1).map((at, i) => gesture?.type === "vertex" ? null : (
                                      <circle key={`m:${i}`} data-handle={`m:${i}`} cx={(at.x + all[i + 1].x) / 2} cy={(at.y + all[i + 1].y) / 2} r={4.5 / zoom} fill="var(--blue)" fillOpacity={0.35} stroke="var(--surface)" strokeWidth={1.5 / zoom} pointerEvents="all" style={{ cursor: "copy" }}>
                                        <title>Arrastra para añadir un vértice</title>
                                      </circle>
                                    ))
                                  : null}
                                {handles
                                  ? mids.map((at, i) => (
                                      <circle key={`v:${i}`} data-handle={`v:${i}`} cx={at.x} cy={at.y} r={5.5 / zoom} fill="var(--blue)" stroke="var(--surface)" strokeWidth={2 / zoom} pointerEvents="all" style={{ cursor: "move" }}>
                                        <title>Arrastra para mover · doble clic para quitar</title>
                                      </circle>
                                    ))
                                  : null}
                                {handles
                                  ? ([["start", start], ["end", end]] as const).map(([key, at]) => <circle key={key} data-handle={key} cx={at.x} cy={at.y} r={6 / zoom} fill="var(--surface)" stroke="var(--blue)" strokeWidth={2 / zoom} pointerEvents="all" style={{ cursor: "move" }} />)
                                  : null}
                              </g>
                            </svg>
                          );
                        }
                        return (
                          <CanvasElement
                            key={note.id}
                            note={note}
                            box={boxNow(note)}
                            z={z}
                            selected={selected.has(note.id)}
                            dragging={gesture?.type === "move" && gesture.moved && gesture.ids.includes(note.id)}
                            erasing={erasing}
                            editing={editingId === note.id}
                            editable={editable}
                            handle={editable && activeTool === "select" && single?.id === note.id && resizable(note) && editingId !== note.id}
                            highlight={bindTargets.has(note.id)}
                            onCommit={(text) => {
                              if (note.kind === "text" && !text.trim()) { deleteIds([note.id]); return; }
                              change([note.id], (element) => ({ text, ...(element.kind === "text" ? { h: textHeight(text, element.w ?? 280, element.size ?? "md", styleOf(element).font) } : {}) }));
                            }}
                            onDone={() => setEditingId(null)}
                          />
                        );
                      })}
                      {guides.length ? (
                        <svg aria-hidden="true" className="absolute left-0 top-0 overflow-visible pointer-events-none" width={width} height={height} style={{ zIndex: 9000 }}>
                          {guides.map((guide, index) => <line key={index} {...guide} stroke="var(--coral)" strokeWidth={1 / zoom} strokeDasharray={`${4 / zoom} ${3 / zoom}`} />)}
                        </svg>
                      ) : null}
                      <DraftLayer gesture={gesture} color={defaults.strokeColor} style={styleOf({ kind: "rect", style: defaults.style })} arrow={draftArrow} zoom={zoom} />
                      {!notes.loading && live.length === 0 ? (
                        <div className="absolute left-[min(50%,560px)] top-[220px] -translate-x-1/2 w-[min(420px,90%)] pointer-events-none">
                          <EmptyState icon={<Lightbulb size={26} aria-hidden="true" />} tone="amber" title={editable ? "Pizarra en blanco" : "Sin elementos"}>
                            {editable ? "Elige una herramienta arriba, haz doble clic para escribir o pega lo que copiaste." : "Esta pizarra está archivada."}
                          </EmptyState>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </MenuContextTrigger>
              <MenuContent className={contentClass}>
                {menuTarget === "notes" && selection.length ? (
                  <>
                    {editable && single && canHoldText(single) ? <MenuItem value="edit" className={menuStyles.item}><Pencil size={16} aria-hidden="true" />Editar texto{keyHint("Enter")}</MenuItem> : null}
                    <MenuItem value="copy" className={menuStyles.item}><Copy size={16} aria-hidden="true" />Copiar{keyHint(`${modLabel}C`)}</MenuItem>
                    {editable ? <MenuItem value="cut" className={menuStyles.item}><Scissors size={16} aria-hidden="true" />Cortar{keyHint(`${modLabel}X`)}</MenuItem> : null}
                    {editable ? <MenuItem value="duplicate" className={menuStyles.item}><SquarePlus size={16} aria-hidden="true" />Duplicar{keyHint(`${modLabel}D`)}</MenuItem> : null}
                    {editable ? <MenuSeparator className={menuStyles.separator} /> : null}
                    {editable ? (
                      <MenuSub>
                        <MenuSubTrigger className={menuStyles.item}><Palette size={16} aria-hidden="true" />Color<ChevronRight size={15} aria-hidden="true" className="ml-auto" /></MenuSubTrigger>
                        <MenuSubContent className={contentClass}>{(noteMode ? stickyColors : strokeColors).map((item) => <MenuItem key={item.value} value={`color:${item.value}`} className={menuStyles.item}>{swatch(item.value, noteMode)}{item.label}</MenuItem>)}</MenuSubContent>
                      </MenuSub>
                    ) : null}
                    {editable ? (
                      <MenuSub>
                        <MenuSubTrigger className={menuStyles.item}><ArrowUpToLine size={16} aria-hidden="true" />Capas<ChevronRight size={15} aria-hidden="true" className="ml-auto" /></MenuSubTrigger>
                        <MenuSubContent className={contentClass}>
                          <MenuItem value="layer:front" className={menuStyles.item}><ArrowUpToLine size={16} aria-hidden="true" />Al frente{keyHint(`${modLabel}⇧]`)}</MenuItem>
                          <MenuItem value="layer:forward" className={menuStyles.item}><ArrowUp size={16} aria-hidden="true" />Adelante{keyHint(`${modLabel}]`)}</MenuItem>
                          <MenuItem value="layer:backward" className={menuStyles.item}><ArrowDown size={16} aria-hidden="true" />Atrás{keyHint(`${modLabel}[`)}</MenuItem>
                          <MenuItem value="layer:back" className={menuStyles.item}><ArrowDownToLine size={16} aria-hidden="true" />Al fondo{keyHint(`${modLabel}⇧[`)}</MenuItem>
                        </MenuSubContent>
                      </MenuSub>
                    ) : null}
                    {editable && alignable > 1 ? (
                      <MenuSub>
                        <MenuSubTrigger className={menuStyles.item}><AlignCenterVertical size={16} aria-hidden="true" />Alinear<ChevronRight size={15} aria-hidden="true" className="ml-auto" /></MenuSubTrigger>
                        <MenuSubContent className={contentClass}>
                          <MenuItem value="align:left" className={menuStyles.item}><AlignStartVertical size={16} aria-hidden="true" />A la izquierda</MenuItem>
                          <MenuItem value="align:center" className={menuStyles.item}><AlignCenterVertical size={16} aria-hidden="true" />Centrar en horizontal</MenuItem>
                          <MenuItem value="align:right" className={menuStyles.item}><AlignEndVertical size={16} aria-hidden="true" />A la derecha</MenuItem>
                          <MenuSeparator className={menuStyles.separator} />
                          <MenuItem value="align:top" className={menuStyles.item}><AlignStartHorizontal size={16} aria-hidden="true" />Arriba</MenuItem>
                          <MenuItem value="align:middle" className={menuStyles.item}><AlignCenterHorizontal size={16} aria-hidden="true" />Centrar en vertical</MenuItem>
                          <MenuItem value="align:bottom" className={menuStyles.item}><AlignEndHorizontal size={16} aria-hidden="true" />Abajo</MenuItem>
                          <MenuSeparator className={menuStyles.separator} />
                          <MenuItem value="align:spread-x" className={menuStyles.item} disabled={alignable < 3}><AlignHorizontalSpaceAround size={16} aria-hidden="true" />Repartir en horizontal</MenuItem>
                          <MenuItem value="align:spread-y" className={menuStyles.item} disabled={alignable < 3}><AlignVerticalSpaceAround size={16} aria-hidden="true" />Repartir en vertical</MenuItem>
                        </MenuSubContent>
                      </MenuSub>
                    ) : null}
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
                    {editable ? <MenuItem value="paste" className={menuStyles.item}><ClipboardPaste size={16} aria-hidden="true" />Pegar{keyHint(`${modLabel}V`)}</MenuItem> : null}
                    {editable ? <MenuItem value="add" className={menuStyles.item}><StickyIcon size={16} aria-hidden="true" />Post-it aquí</MenuItem> : null}
                    {editable ? <MenuItem value="add-text" className={menuStyles.item}><Type size={16} aria-hidden="true" />Texto aquí{keyHint("Doble clic")}</MenuItem> : null}
                    {editable ? <MenuSeparator className={menuStyles.separator} /> : null}
                    {editable ? <MenuItem value="undo" className={menuStyles.item} disabled={!historySize.undo}><Undo2 size={16} aria-hidden="true" />Deshacer{keyHint(`${modLabel}Z`)}</MenuItem> : null}
                    {editable ? <MenuItem value="redo" className={menuStyles.item} disabled={!historySize.redo}><Redo2 size={16} aria-hidden="true" />Rehacer{keyHint(`${modLabel}⇧Z`)}</MenuItem> : null}
                    <MenuItem value="select-all" className={menuStyles.item} disabled={!live.length}><MousePointerClick size={16} aria-hidden="true" />Seleccionar todo{keyHint(`${modLabel}A`)}</MenuItem>
                    {editable ? <MenuItem value="arrange-all" className={menuStyles.item} disabled={live.length < 2}><LayoutGrid size={16} aria-hidden="true" />Ordenar todo en cuadrícula</MenuItem> : null}
                  </>
                )}
              </MenuContent>
            </Menu>
          </div>
          <Shortcuts open={helpOpen} onOpenChange={setHelpOpen} mod={modLabel} />
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

/** Atajos de teclado, en un diálogo de UI SDK. */
function Shortcuts({ open, onOpenChange, mod }: { open: boolean; onOpenChange: (open: boolean) => void; mod: string }) {
  const groups: [string, [string, string][]][] = [
    ["Herramientas", [["Seleccionar", "V · 1"], ["Mover el lienzo", "H · Espacio"], ["Post-it", "N · 3"], ["Texto", "T · 4"], ["Lápiz", "P · 5"], ["Rectángulo", "R · 6"], ["Elipse", "O · 7"], ["Flecha", "A · 8"], ["Borrador", "E · 9"]]],
    ["Edición", [["Deshacer", `${mod}Z`], ["Rehacer", `${mod}⇧Z · ${mod}Y`], ["Copiar", `${mod}C`], ["Cortar", `${mod}X`], ["Pegar", `${mod}V`], ["Duplicar", `${mod}D`], ["Seleccionar todo", `${mod}A`], ["Eliminar", "Supr"], ["Editar texto", "Enter · doble clic"], ["Terminar de escribir", `Esc · ${mod}Enter`]]],
    ["Lienzo", [["Mover selección", "Flechas (⇧: ×4)"], ["Sin imán al mover", "Alt"], ["Capa adelante / atrás", `${mod}] · ${mod}[`], ["Al frente / al fondo", `${mod}⇧] · ${mod}⇧[`], ["Acercar / alejar", `${mod}+ · ${mod}- · ${mod}rueda`], ["Zoom al 100 %", `${mod}0`], ["Ajustar a todo", "⇧1"], ["Quitar selección", "Esc"]]],
  ];
  return (
    <Dialog open={open} onOpenChange={(next) => onOpenChange(next)}>
      <DialogBackdrop className="fixed inset-0 z-[1100] bg-[color-mix(in_srgb,var(--ink)_35%,transparent)]" />
      <DialogContent className="fixed z-[1101] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(780px,calc(100vw-32px))] max-h-[calc(100dvh-48px)] overflow-y-auto p-[24px] rounded-[18px] bg-surface text-ink [box-shadow:var(--shadow-pop)] outline-none">
        <div className="flex items-center justify-between mb-[16px]">
          <DialogTitle className="m-0 font-display text-[22px] font-semibold">Atajos de teclado</DialogTitle>
          <DialogClose className={toolClass} aria-label="Cerrar"><X size={18} aria-hidden="true" /></DialogClose>
        </div>
        <div className="grid grid-cols-3 gap-[24px] max-[720px]:grid-cols-1">
          {groups.map(([group, rows]) => (
            <section key={group}>
              <h3 className={`${sectionTitle} mb-[8px]`}>{group}</h3>
              <dl className="m-0 flex flex-col gap-[6px]">
                {rows.map(([label, keys]) => (
                  <div key={label} className="flex items-baseline justify-between gap-[12px] text-[13px]">
                    <dt>{label}</dt>
                    <dd className="m-0 font-mono text-[11.5px] text-ink-soft text-right">{keys}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Vista previa de lo que se está dibujando o seleccionando. */
function DraftLayer({ gesture, color, style, arrow, zoom }: { gesture: Gesture | null; color: string; style: Style; arrow?: { start: Point; end: Point }; zoom: number }) {
  if (gesture?.type === "marquee") {
    return <div aria-hidden="true" className="absolute z-[9000] rounded-[4px] border border-[var(--blue)] bg-[color-mix(in_srgb,var(--blue)_10%,transparent)] pointer-events-none" style={{ left: Math.min(gesture.x0, gesture.x1), top: Math.min(gesture.y0, gesture.y1), width: Math.abs(gesture.x1 - gesture.x0), height: Math.abs(gesture.y1 - gesture.y0), borderWidth: 1 / zoom }} />;
  }
  const width = weightPx[style.weight];
  if (gesture?.type === "draw") {
    return <svg aria-hidden="true" className="absolute inset-0 z-[9000] pointer-events-none overflow-visible" width="100%" height="100%"><path d={smoothPath(gesture.points)} fill="none" stroke={strokeOf(color)} strokeWidth={width + 0.5} strokeDasharray={dash(style.stroke, width)} strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (gesture?.type === "shape") {
    const x = Math.min(gesture.x0, gesture.x1), y = Math.min(gesture.y0, gesture.y1), w = Math.abs(gesture.x1 - gesture.x0), h = Math.abs(gesture.y1 - gesture.y0);
    return (
      <svg aria-hidden="true" className="absolute inset-0 z-[9000] pointer-events-none overflow-visible" width="100%" height="100%">
        {gesture.kind === "rect" ? <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={strokeOf(color)} strokeWidth={width} strokeDasharray="6 5" /> : null}
        {gesture.kind === "ellipse" ? <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill="none" stroke={strokeOf(color)} strokeWidth={width} strokeDasharray="6 5" /> : null}
        {gesture.kind === "arrow" && arrow ? <ArrowShape points={[arrow.start, arrow.end]} style={style} color={color} /> : null}
      </svg>
    );
  }
  return null;
}

/** Flecha recta, en codo o curva, con puntas abiertas en uno, otro o ambos extremos. */
function ArrowShape({ points, style, color, hit = false }: { points: Point[]; style: Style; color: string; hit?: boolean }) {
  const { d, endAngle, startAngle } = arrowGeometry(points, style.arrowType);
  const start = points[0], end = points[points.length - 1];
  const length = points.slice(1).reduce((sum, pt, i) => sum + Math.hypot(pt.x - points[i].x, pt.y - points[i].y), 0);
  const width = weightPx[style.weight], size = Math.min(18, Math.max(9, length / 3)) + width;
  const head = (tip: Point, angle: number) => `M${tip.x - size * Math.cos(angle - 0.5)} ${tip.y - size * Math.sin(angle - 0.5)} L${tip.x} ${tip.y} L${tip.x - size * Math.cos(angle + 0.5)} ${tip.y - size * Math.sin(angle + 0.5)}`;
  const heads = [style.head === "end" || style.head === "both" ? head(end, endAngle) : "", style.head === "start" || style.head === "both" ? head(start, startAngle) : ""].join(" ").trim();
  return (
    <>
      {hit ? <path d={`${d} ${heads}`} fill="none" stroke="transparent" strokeWidth={16} strokeLinecap="round" pointerEvents="stroke" /> : null}
      <path d={d} fill="none" stroke={strokeOf(color)} strokeWidth={width} strokeDasharray={dash(style.stroke, width)} strokeLinecap="round" strokeLinejoin="round" pointerEvents={hit ? "stroke" : "none"} />
      {heads ? <path d={heads} fill="none" stroke={strokeOf(color)} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pointerEvents={hit ? "stroke" : "none"} /> : null}
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
  box: Box;
  z: number;
  selected: boolean;
  dragging: boolean;
  erasing: boolean;
  editing: boolean;
  editable: boolean;
  handle: boolean;
  highlight?: boolean;
  onCommit: (text: string) => void;
  onDone: () => void;
};

/** Un elemento de la pizarra: post-it, texto, trazo, rectángulo o elipse (las flechas se dibujan aparte). */
function CanvasElement({ note, box, z, selected, dragging, erasing, editing, editable, handle, highlight = false, onCommit, onDone }: ElementProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const kind = note.kind ?? "note";
  const author = personName(note.createdBy);
  const size = note.size ?? "md";
  const style = styleOf(note);

  useEffect(() => {
    if (!editing || !area.current) return;
    const element = area.current;
    // Un cuadro después: el clic que lo creó ya terminó de mover el foco.
    const frame = requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(element.value.length, element.value.length);
    });
    return () => cancelAnimationFrame(frame);
  }, [editing]);
  const finish = () => {
    if (draft !== null) onCommit(draft);
    setDraft(null);
    onDone();
  };
  const textArea = (className: string, css?: React.CSSProperties) => (
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
      className={`resize-none border-0 bg-transparent outline-none [color:inherit] placeholder:text-current placeholder:opacity-45 ${editing ? "cursor-text pointer-events-auto" : "pointer-events-none select-none"} ${className}`}
      style={css}
    />
  );
  const wrapper: React.CSSProperties = {
    left: box.x,
    top: box.y,
    width: Math.max(box.w, 1),
    height: Math.max(box.h, 1),
    zIndex: z,
    opacity: erasing ? 0.25 : 1,
    outline: highlight ? "2px dashed var(--blue)" : selected ? "2px solid var(--blue)" : "2px solid transparent",
    outlineOffset: kind === "pen" ? 6 : 3,
  };
  const label = kind === "note" ? `Post-it de ${author}` : { text: "Texto", pen: "Trazo", rect: "Rectángulo", ellipse: "Elipse", arrow: "Flecha" }[kind];
  const common = { "data-note": note.id, role: "group", "aria-label": `${label}${note.text ? `: ${note.text}` : ""}${selected ? " (seleccionado)" : ""}` };
  const resizeHandle = handle ? <span data-handle="resize" aria-hidden="true" className="absolute -right-[7px] -bottom-[7px] w-[12px] h-[12px] rounded-[3px] bg-surface border-2 border-[var(--blue)] cursor-nwse-resize pointer-events-auto" /> : null;
  const strokeWidth = weightPx[style.weight];

  if (kind === "note") {
    const colors = paperOf(note.color);
    return (
      <div {...common} className="absolute flex flex-col rounded-[3px] [touch-action:none] [transition:box-shadow_0.15s,transform_0.15s,outline-color_0.1s]" style={{ ...wrapper, background: colors.bg, color: colors.ink, transform: `rotate(${dragging || editing ? 0 : tilt(note.id)}deg) scale(${dragging ? 1.03 : 1})`, boxShadow: dragging ? "0 18px 34px -12px rgba(0,0,0,0.38), 0 2px 4px rgba(0,0,0,0.1)" : "0 1px 2px rgba(0,0,0,0.08), 0 10px 18px -10px rgba(0,0,0,0.3)" }}>
        <div className="h-[22px] flex items-center px-[10px] rounded-t-[3px] text-[10.5px] font-semibold uppercase tracking-[0.06em]" style={{ background: colors.fold }}>
          <span className="opacity-70">{note.createdAt.slice(5, 10).split("-").reverse().join("/")}</span>
        </div>
        {textArea("flex-1 w-full min-h-0 px-[12px] pt-[8px] pb-[4px] text-[15px] leading-[1.35] font-medium [font-family:var(--font-sans)]")}
        <div className="flex items-center gap-[6px] px-[10px] pb-[8px] text-[11px] font-medium opacity-75 pointer-events-none">
          <Avatar name={author} size={16} tone="violet" />
          <span className="truncate">{author}</span>
        </div>
      </div>
    );
  }
  if (kind === "text") {
    const css: React.CSSProperties = { fontSize: textPx[size], lineHeight: 1.3, fontFamily: fontFamily[style.font], textAlign: style.align };
    return (
      <div {...common} className="absolute [touch-action:none]" style={{ ...wrapper, color: strokeOf(note.color), height: editing ? "auto" : wrapper.height }}>
        {editing
          ? textArea("block w-full overflow-hidden font-semibold [field-sizing:content]", { ...css, minHeight: textPx[size] * 1.3 + 8 })
          : <p className="m-0 whitespace-pre-wrap [overflow-wrap:anywhere] font-semibold" style={css}>{note.text}</p>}
        {resizeHandle}
      </div>
    );
  }
  if (kind === "rect" || kind === "ellipse") {
    const fill = style.fill === "none" ? "transparent" : `color-mix(in srgb, ${strokeOf(note.color)} ${style.fill === "solid" ? 32 : 10}%, transparent)`;
    const inset = strokeWidth / 2;
    return (
      <div {...common} className="absolute grid place-items-center [touch-action:none]" style={{ ...wrapper, color: strokeOf(note.color) }}>
        <svg aria-hidden="true" className="absolute inset-0 overflow-visible" width="100%" height="100%">
          {kind === "rect"
            ? <rect x={inset} y={inset} width={Math.max(box.w - strokeWidth, 1)} height={Math.max(box.h - strokeWidth, 1)} rx={10} fill={fill} stroke={strokeOf(note.color)} strokeWidth={strokeWidth} strokeDasharray={dash(style.stroke, strokeWidth)} strokeLinecap="round" />
            : <ellipse cx={box.w / 2} cy={box.h / 2} rx={Math.max(box.w / 2 - inset, 1)} ry={Math.max(box.h / 2 - inset, 1)} fill={fill} stroke={strokeOf(note.color)} strokeWidth={strokeWidth} strokeDasharray={dash(style.stroke, strokeWidth)} strokeLinecap="round" />}
        </svg>
        {editing || note.text ? textArea("relative w-[86%] max-h-[90%] leading-[1.35] font-semibold overflow-hidden [field-sizing:content]", { fontSize: labelPx[size], fontFamily: fontFamily[style.font], textAlign: style.align }) : null}
        {resizeHandle}
      </div>
    );
  }
  const points = note.points ?? [];
  return (
    <div {...common} className="absolute pointer-events-none" style={wrapper}>
      <svg aria-hidden="true" className="absolute inset-0 overflow-visible" width="100%" height="100%">
        <path d={smoothPath(points)} fill="none" stroke="transparent" strokeWidth={16} strokeLinecap="round" pointerEvents="stroke" />
        <path d={smoothPath(points)} fill="none" stroke={strokeOf(note.color)} strokeWidth={strokeWidth + 0.5} strokeDasharray={dash(style.stroke, strokeWidth)} strokeLinecap="round" strokeLinejoin="round" pointerEvents="stroke" />
      </svg>
    </div>
  );
}
