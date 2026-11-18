"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Menu, MenuContent, MenuContextTrigger, MenuItem, MenuSeparator, MenuSub, MenuSubContent, MenuSubTrigger } from "@ui-sdk/react/menu";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/react/toolbar";
import { Archive, ArchiveRestore, ChevronRight, Copy, LayoutGrid, Lightbulb, MousePointerClick, Palette, Pencil, Plus, SquarePlus, StickyNote as StickyIcon, Trash2, X } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { Button } from "@/ui/atoms/Button";
import { StatusDot } from "@/ui/atoms/StatusDot";
import { ActionMenu } from "@/ui/molecules/ActionMenu";
import menuStyles from "@/ui/molecules/ActionMenu.styles";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { saveWorkspaceItem } from "@/features/admin/actions/workspace";
import { bulkWorkspaceAction } from "@/features/admin/actions/bulk";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import type { BulkAction } from "@/features/admin/lib/bulk";
import { personName } from "@/features/admin/lib/people";
import { canvasSize, colors as boardColors, stickyColors, type Entity, type StickyColor, type StickyNote, type WorkspaceColor } from "@/features/admin/lib/workspace";
import { toggleArchive, WorkspaceStatus } from "./WorkspaceParts";
import boardStyles from "./Board.styles";

const NOTE_W = 200, NOTE_H = 176, GRID = 24;
/** Papel de cada color: fondo, pliegue superior y tinta (legibles en tema claro y oscuro). */
const paper: Record<StickyColor, { bg: string; fold: string; ink: string }> = {
  yellow: { bg: "#FFE98F", fold: "#F5D65C", ink: "#3A2F06" },
  pink: { bg: "#FFC9D6", fold: "#F8A9BC", ink: "#4A1323" },
  blue: { bg: "#C9DCFF", fold: "#A9C4FA", ink: "#0F2557" },
  green: { bg: "#C8EFCF", fold: "#A3E0AF", ink: "#0E3B19" },
  violet: { bg: "#E2D6FF", fold: "#CBB8FA", ink: "#2A1563" },
};
const clampX = (value: number) => Math.round(Math.min(Math.max(value, 0), canvasSize - NOTE_W));
const clampY = (value: number) => Math.round(Math.min(Math.max(value, 0), canvasSize - NOTE_H));
const snap = (value: number, free = false) => (free ? Math.round(value) : Math.round(value / GRID) * GRID);
/** Inclinación estable por post-it, para que el tablero se sienta a mano. */
const tilt = (id: string) => ((Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 7) - 3) * 0.45;
const swatch = (color: StickyColor) => <span aria-hidden="true" className="block w-[14px] h-[14px] rounded-[4px] [box-shadow:inset_0_0_0_1px_rgba(0,0,0,0.12)]" style={{ background: paper[color].bg }} />;
const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const keyHint = (text: string) => <span className="ml-auto pl-[16px] text-ink-soft text-[12px] font-normal font-mono">{text}</span>;
const toolClass = "inline-flex items-center gap-[6px] h-[32px] px-[9px] rounded-[8px] border-0 bg-transparent text-ink text-[13px] font-semibold cursor-pointer hover:bg-[var(--surface-2)] disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--blue)]";
const swatchClass = "grid place-items-center w-[28px] h-[28px] rounded-[7px] border-0 bg-transparent cursor-pointer hover:bg-[var(--surface-2)] data-[pressed]:bg-[var(--surface-2)] data-[pressed]:[box-shadow:inset_0_0_0_1.5px_var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--blue)]";

type Pending = Partial<StickyNote> & { until: number };
type Drag = { ids: string[]; origin: Record<string, { x: number; y: number }>; startX: number; startY: number; dx: number; dy: number; moved: boolean; free: boolean };
type Marquee = { x0: number; y0: number; x1: number; y1: number; base: string[] };

/** Brainstorm: pizarras con post-its, al estilo de una pizarra blanca. Todo se edita en el lugar. */
export function BrainstormWorkspace() {
  const { params, update } = useAdminQuery();
  const whiteboards = useWorkspace("whiteboards");
  const archived = params.get("archived") === "yes";
  const options = whiteboards.items.filter((item) => item.archived === archived).toSorted((a, b) => a.createdAt.localeCompare(b.createdAt));
  const board = options.find((item) => item.id === params.get("pizarra")) ?? options[0];
  const notes = useWorkspace("stickyNotes", "whiteboardId", board?.id);
  const editable = Boolean(board && !board.archived);

  const [newColor, setNewColor] = useState<StickyColor>("yellow");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, Pending>>({});
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [drag, setDrag] = useState<Drag | null>(null);
  const [marquee, setMarquee] = useState<Marquee | null>(null);
  const [menuTarget, setMenuTarget] = useState<"notes" | "canvas">("canvas");
  const [focusTitle, setFocusTitle] = useState(false);
  const menuPoint = useRef({ x: 0, y: 0 });
  const stage = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLInputElement>(null);

  const live = useMemo(() => notes.items.filter((note) => !note.archived && !removed.has(note.id)).map((note) => {
    const local = pending[note.id];
    return local && note.revision < local.until ? { ...note, ...local } : note;
  }), [notes.items, pending, removed]);
  const byId = useMemo(() => new Map(live.map((note) => [note.id, note])), [live]);
  const selection = live.filter((note) => selected.has(note.id));
  const width = Math.max(2400, ...live.map((note) => note.x + NOTE_W + 320));
  const height = Math.max(1500, ...live.map((note) => note.y + NOTE_H + 320));
  const positionOf = (note: Entity<"stickyNotes">) => drag?.moved && drag.ids.includes(note.id)
    ? { x: clampX(snap(drag.origin[note.id].x + drag.dx, drag.free)), y: clampY(snap(drag.origin[note.id].y + drag.dy, drag.free)) }
    : { x: note.x, y: note.y };

  // Cambiar de pizarra limpia la selección y la edición.
  const boardId = board?.id;
  const [seenBoard, setSeenBoard] = useState(boardId);
  if (seenBoard !== boardId) { setSeenBoard(boardId); setSelected(new Set()); setEditingId(null); }
  useEffect(() => {
    if (!focusTitle || !title.current) return;
    title.current.focus();
    title.current.select();
  }, [focusTitle, boardId]);

  /** Muestra el cambio al instante y lo mantiene hasta que Firestore entrega una revisión posterior. */
  function applyLocal(changes: Record<string, Partial<StickyNote>>) {
    setPending((current) => {
      const next = { ...current };
      for (const [id, values] of Object.entries(changes)) {
        const server = notes.items.find((note) => note.id === id);
        if (!server) continue;
        next[id] = { ...next[id], ...values, until: Math.max(next[id]?.until ?? 0, server.revision) + 1 };
      }
      return next;
    });
  }
  function dropLocal(ids: string[]) {
    setPending((current) => { const next = { ...current }; for (const id of ids) delete next[id]; return next; });
  }
  async function run(ids: string[], action: BulkAction, fallback: string) {
    if (!ids.length) return true;
    setError("");
    try {
      const result = await bulkWorkspaceAction("stickyNotes", ids, action);
      if (result.ok) return true;
      setError(result.error);
    } catch {
      setError(fallback);
    }
    dropLocal(ids);
    return false;
  }

  function move(positions: { id: string; x: number; y: number }[]) {
    const changed = positions.filter((item) => { const note = byId.get(item.id); return note && (note.x !== item.x || note.y !== item.y); });
    if (!changed.length) return;
    applyLocal(Object.fromEntries(changed.map(({ id, x, y }) => [id, { x, y }])));
    void run(changed.map((item) => item.id), { type: "stickyPositions", positions: changed }, "No se pudieron mover los post-its.");
  }
  function recolor(ids: string[], color: StickyColor) {
    const changed = ids.filter((id) => byId.get(id)?.color !== color);
    if (!changed.length) return;
    applyLocal(Object.fromEntries(changed.map((id) => [id, { color }])));
    void run(changed, { type: "stickyColor", value: color }, "No se pudo cambiar el color.");
  }
  function retext(id: string, text: string) {
    if (byId.get(id)?.text === text) return;
    applyLocal({ [id]: { text } });
    void run([id], { type: "stickyText", value: text }, "No se pudo guardar el texto.");
  }
  async function remove(ids: string[]) {
    if (!ids.length) return;
    setRemoved((current) => new Set([...current, ...ids]));
    setSelected(new Set());
    setEditingId(null);
    if (!(await run(ids, { type: "delete" }, "No se pudieron eliminar los post-its."))) setRemoved((current) => { const next = new Set(current); for (const id of ids) next.delete(id); return next; });
  }
  async function create(items: { text: string; color: StickyColor; x: number; y: number }[], edit = false) {
    if (!board || !editable) return;
    setError("");
    const ids: string[] = [];
    for (const item of items) {
      try {
        const result = await saveWorkspaceItem({ collection: "stickyNotes", data: { whiteboardId: board.id, ...item, x: clampX(item.x), y: clampY(item.y) } });
        if (!result.ok) throw new Error(result.error);
        ids.push(result.id);
      } catch {
        setError("No se pudo crear el post-it. Revisa tu conexión.");
        break;
      }
    }
    if (!ids.length) return;
    setSelected(new Set(ids));
    if (edit && ids.length === 1) setEditingId(ids[0]);
  }
  function addAt(x: number, y: number) {
    void create([{ text: "", color: newColor, x: snap(x - NOTE_W / 2), y: snap(y - 24) }], true);
  }
  function addInView() {
    const view = scroller.current;
    const nudge = (live.length % 5) * GRID;
    addAt(view ? view.scrollLeft + view.clientWidth / 2 + nudge : 240, view ? view.scrollTop + view.clientHeight / 2 - NOTE_H / 2 + nudge : 120);
  }
  function duplicate(ids: string[]) {
    void create(ids.map((id) => byId.get(id)).filter((note): note is Entity<"stickyNotes"> => Boolean(note)).map((note) => ({ text: note.text, color: note.color, x: note.x + GRID, y: note.y + GRID })));
  }
  /** Acomoda los post-its en una cuadrícula ordenada (de arriba abajo y de izquierda a derecha). */
  function arrange(ids: string[]) {
    const list = ids.map((id) => byId.get(id)).filter((note): note is Entity<"stickyNotes"> => Boolean(note)).toSorted((a, b) => a.y - b.y || a.x - b.x);
    if (!list.length) return;
    const columns = Math.min(6, Math.ceil(Math.sqrt(list.length)));
    const x0 = snap(Math.min(...list.map((note) => note.x))), y0 = snap(Math.min(...list.map((note) => note.y)));
    move(list.map((note, index) => ({ id: note.id, x: clampX(x0 + (index % columns) * (NOTE_W + GRID)), y: clampY(y0 + Math.floor(index / columns) * (NOTE_H + GRID)) })));
  }

  // Pizarras: todo en el lugar, sin páginas aparte.
  async function saveBoard(changes: Partial<{ name: string; description: string; color: WorkspaceColor }>) {
    if (!board) return;
    const data = { name: board.name, description: board.description, color: board.color, ...changes };
    if (!data.name.trim()) return;
    if (data.name === board.name && data.description === board.description && data.color === board.color) return;
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

  // Puntero: clic selecciona, Mayús suma, arrastrar mueve la selección, arrastrar en vacío selecciona por área.
  const point = (event: { clientX: number; clientY: number }) => {
    const box = stage.current!.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };
  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !stage.current) return;
    const target = event.target as HTMLElement;
    if (target.closest("textarea:not([readonly])")) return;
    const noteElement = target.closest<HTMLElement>("[data-note]");
    const { x, y } = point(event);
    const additive = event.shiftKey || event.metaKey || event.ctrlKey;
    if (noteElement) {
      const id = noteElement.dataset.note!;
      if (editingId && editingId !== id) setEditingId(null);
      let next = selected;
      if (additive) { next = new Set(selected); if (next.has(id)) next.delete(id); else next.add(id); }
      else if (!selected.has(id)) next = new Set([id]);
      setSelected(next);
      if (!editable || !next.has(id)) return;
      const ids = [...next];
      event.currentTarget.setPointerCapture(event.pointerId);
      setDrag({ ids, origin: Object.fromEntries(ids.map((item) => [item, { x: byId.get(item)?.x ?? 0, y: byId.get(item)?.y ?? 0 }])), startX: x, startY: y, dx: 0, dy: 0, moved: false, free: event.altKey });
      return;
    }
    setEditingId(null);
    if (event.pointerType === "touch") { if (!additive) setSelected(new Set()); return; }
    event.currentTarget.setPointerCapture(event.pointerId);
    setMarquee({ x0: x, y0: y, x1: x, y1: y, base: additive ? [...selected] : [] });
    if (!additive) setSelected(new Set());
  }
  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (drag) {
      const { x, y } = point(event);
      const dx = x - drag.startX, dy = y - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      setDrag({ ...drag, dx, dy, moved: true, free: event.altKey });
    } else if (marquee) {
      const { x, y } = point(event);
      const box = { left: Math.min(marquee.x0, x), right: Math.max(marquee.x0, x), top: Math.min(marquee.y0, y), bottom: Math.max(marquee.y0, y) };
      setMarquee({ ...marquee, x1: x, y1: y });
      const hits = live.filter((note) => note.x < box.right && note.x + NOTE_W > box.left && note.y < box.bottom && note.y + NOTE_H > box.top).map((note) => note.id);
      setSelected(new Set([...marquee.base, ...hits]));
    }
  }
  function onPointerUp() {
    if (drag?.moved) move(drag.ids.map((id) => ({ id, ...positionOf(byId.get(id)!) })));
    setDrag(null);
    setMarquee(null);
  }
  function onDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!editable) return;
    const noteElement = (event.target as HTMLElement).closest<HTMLElement>("[data-note]");
    if (noteElement) { setSelected(new Set([noteElement.dataset.note!])); setEditingId(noteElement.dataset.note!); return; }
    const { x, y } = point(event);
    addAt(x, y);
  }
  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (editingId || (event.target as HTMLElement).closest("textarea,input,[role=menu],[role=toolbar]")) return;
    const mod = isMac() ? event.metaKey : event.ctrlKey;
    const ids = selection.map((note) => note.id);
    if (mod && event.key.toLowerCase() === "a") { event.preventDefault(); setSelected(new Set(live.map((note) => note.id))); return; }
    if (event.key === "Escape") { setSelected(new Set()); return; }
    if (!editable) return;
    if (mod && event.key.toLowerCase() === "d" && ids.length) { event.preventDefault(); duplicate(ids); return; }
    if ((event.key === "Delete" || event.key === "Backspace") && ids.length) { event.preventDefault(); void remove(ids); return; }
    if (event.key === "Enter" && ids.length === 1) { event.preventDefault(); setEditingId(ids[0]); return; }
    const step = event.shiftKey ? GRID * 4 : GRID;
    const delta = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, number[]>)[event.key];
    if (delta && ids.length) { event.preventDefault(); move(selection.map((note) => ({ id: note.id, x: clampX(note.x + delta[0]), y: clampY(note.y + delta[1]) }))); }
  }
  function onContextMenuCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!stage.current) return;
    menuPoint.current = point(event);
    const noteElement = (event.target as HTMLElement).closest<HTMLElement>("[data-note]");
    if (noteElement) {
      const id = noteElement.dataset.note!;
      if (!selected.has(id)) setSelected(new Set([id]));
      setMenuTarget("notes");
    } else {
      // Como en una pizarra: clic derecho en vacío deja la selección y ofrece acciones del lienzo.
      setSelected(new Set());
      setEditingId(null);
      setMenuTarget("canvas");
    }
  }
  function onMenu(value: string) {
    const ids = selection.map((note) => note.id);
    if (value === "add") addAt(menuPoint.current.x, menuPoint.current.y);
    if (value === "select-all") setSelected(new Set(live.map((note) => note.id)));
    if (value === "arrange-all") arrange(live.map((note) => note.id));
    if (value === "arrange") arrange(ids);
    if (value === "edit" && ids.length === 1) setEditingId(ids[0]);
    if (value === "duplicate") duplicate(ids);
    if (value === "delete") void remove(ids);
    if (value === "clear") setSelected(new Set());
    if (value.startsWith("color:")) recolor(ids, value.slice(6) as StickyColor);
  }

  if (whiteboards.loading || whiteboards.error) return <WorkspaceStatus loading={whiteboards.loading} errors={[whiteboards.error]} />;
  const mod = isMac() ? "⌘" : "Ctrl+";
  const sharedColor = selection.length && selection.every((note) => note.color === selection[0].color) ? [selection[0].color] : [];

  return (
    <section className="min-w-0">
      <header className="flex items-end gap-[16px] mb-[20px] max-[720px]:flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="m-0 mb-[6px] text-ink-soft font-medium text-[11.5px] leading-[14px] font-mono tracking-[0.08em] uppercase">{archived ? "Pizarras archivadas" : "Brainstorm"}</p>
          {board ? (
            <>
              <InlineText
                key={`name-${board.id}`}
                inputRef={title}
                value={board.name}
                readOnly={!editable}
                label="Nombre de la pizarra"
                maxLength={120}
                required
                onFocused={() => setFocusTitle(false)}
                onCommit={(name) => void saveBoard({ name })}
                className="w-full m-0 -ml-[6px] px-[6px] py-[2px] rounded-[8px] font-semibold text-[28px] leading-[1.15] font-display tracking-[-0.025em] max-[720px]:text-[24px]"
              />
              <InlineText
                key={`description-${board.id}`}
                value={board.description}
                readOnly={!editable}
                label="Descripción de la pizarra"
                maxLength={3000}
                placeholder={editable ? "Añade una descripción…" : ""}
                onCommit={(description) => void saveBoard({ description })}
                className="w-full mt-[4px] -ml-[6px] px-[6px] py-[2px] rounded-[7px] text-ink-soft text-[14.5px] leading-[21px]"
              />
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
                  <button
                    key={item.id}
                    type="button"
                    className={boardStyles.boardTab}
                    aria-current={item.id === board.id ? "page" : undefined}
                    onClick={() => update({ pizarra: item.id })}
                    onContextMenuCapture={() => update({ pizarra: item.id })}
                    onDoubleClick={() => { update({ pizarra: item.id }); if (editable) setFocusTitle(true); }}
                  >
                    <StatusDot tone={item.color} size={8} />
                    {item.name}
                  </button>
                ))}
                {!archived ? (
                  <button type="button" className={boardStyles.newBoard} aria-label="Nueva pizarra" title="Nueva pizarra" onClick={() => void newBoard()}>
                    <Plus size={15} strokeWidth={2.4} aria-hidden="true" />
                  </button>
                ) : null}
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

          <Toolbar aria-label="Herramientas de la pizarra" className="flex items-center flex-wrap gap-[6px] mb-[12px] p-[6px] w-fit max-w-full rounded-[12px] border border-rule bg-surface [box-shadow:var(--shadow-xs)]">
            <ToolbarButton disabled={!editable} onClick={addInView} className={toolClass}>
              <StickyIcon size={16} aria-hidden="true" />
              Post-it
            </ToolbarButton>
            <ToggleGroup aria-label="Color de los post-its nuevos" value={[newColor]} deselectable={false} onValueChange={([value]) => value && setNewColor(value as StickyColor)} className="flex items-center gap-[2px]">
              {stickyColors.map((option) => <Toggle key={option.value} value={option.value} aria-label={option.label} className={swatchClass}>{swatch(option.value)}</Toggle>)}
            </ToggleGroup>
            <ToolbarSeparator className="w-px h-[20px] bg-[var(--rule-strong)]" />
            <ToolbarButton disabled={!editable || live.length < 2} onClick={() => arrange(selection.length > 1 ? selection.map((note) => note.id) : live.map((note) => note.id))} className={toolClass}>
              <LayoutGrid size={16} aria-hidden="true" />
              Ordenar
            </ToolbarButton>
            <ToolbarSeparator className="w-px h-[20px] bg-[var(--rule-strong)] max-[720px]:hidden" />
            <span className="px-[6px] text-ink-soft text-[12.5px] max-[720px]:hidden" aria-live="polite">
              {live.length} {live.length === 1 ? "idea" : "ideas"} · doble clic crea o edita · clic derecho: opciones · arrastra en vacío para seleccionar
            </span>
          </Toolbar>

          <div className="relative">
            {selection.length && editable ? (
              <Toolbar aria-label={`${selection.length} post-its seleccionados`} className="absolute z-40 top-[12px] left-1/2 -translate-x-1/2 flex items-center gap-[4px] p-[5px] pl-[12px] rounded-[12px] border border-rule bg-surface [box-shadow:var(--shadow-pop)] animate-[tw-bulk-in_0.16s_var(--ease)] max-w-[calc(100%-24px)] overflow-x-auto">
                <span className="text-[13px] font-semibold whitespace-nowrap mr-[4px]">{selection.length} {selection.length === 1 ? "seleccionado" : "seleccionados"}</span>
                <ToolbarSeparator className="w-px h-[20px] bg-[var(--rule-strong)]" />
                <ToggleGroup aria-label="Color de la selección" value={sharedColor} onValueChange={([value]) => value && recolor(selection.map((note) => note.id), value as StickyColor)} className="flex items-center gap-[2px]">
                  {stickyColors.map((option) => <Toggle key={option.value} value={option.value} aria-label={`Color ${option.label.toLowerCase()}`} className={swatchClass}>{swatch(option.value)}</Toggle>)}
                </ToggleGroup>
                <ToolbarSeparator className="w-px h-[20px] bg-[var(--rule-strong)]" />
                <ToolbarButton onClick={() => duplicate(selection.map((note) => note.id))} className={toolClass} aria-label="Duplicar"><Copy size={15} aria-hidden="true" /></ToolbarButton>
                {selection.length > 1 ? <ToolbarButton onClick={() => arrange(selection.map((note) => note.id))} className={toolClass} aria-label="Ordenar selección"><LayoutGrid size={15} aria-hidden="true" /></ToolbarButton> : null}
                <ToolbarButton onClick={() => void remove(selection.map((note) => note.id))} className={`${toolClass} text-[var(--coral)]!`} aria-label="Eliminar selección"><Trash2 size={15} aria-hidden="true" /></ToolbarButton>
                <ToolbarButton onClick={() => setSelected(new Set())} className={toolClass} aria-label="Quitar selección"><X size={15} aria-hidden="true" /></ToolbarButton>
              </Toolbar>
            ) : null}

            <Menu onAction={onMenu}>
              <MenuContextTrigger
                className="block rounded-[var(--r-xl)] border border-rule bg-surface [box-shadow:var(--shadow-xs)] focus-visible:outline-2 focus-visible:outline-[var(--blue)] focus-visible:outline-offset-2"
                tabIndex={0}
                aria-label={`Lienzo de ${board.name}. Clic derecho o Mayús+F10 para opciones; ${mod}A selecciona todo, Supr elimina, flechas mueven.`}
                onContextMenuCapture={onContextMenuCapture}
                onKeyDown={onKeyDown}
              >
                <div ref={scroller} className="relative h-[calc(100dvh-330px)] min-h-[460px] overflow-auto rounded-[var(--r-xl)] max-[960px]:h-[68dvh]">
                  <div
                    ref={stage}
                    className="relative select-none [background-image:radial-gradient(var(--rule-strong)_1px,transparent_1.2px)] [background-size:24px_24px] [touch-action:pan-x_pan-y]"
                    style={{ width, height, cursor: drag?.moved ? "grabbing" : "default" }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={() => { setDrag(null); setMarquee(null); }}
                    onDoubleClick={onDoubleClick}
                  >
                    {live.map((note) => (
                      <Note
                        key={note.id}
                        note={note}
                        position={positionOf(note)}
                        selected={selected.has(note.id)}
                        dragging={Boolean(drag?.moved && drag.ids.includes(note.id))}
                        editing={editingId === note.id}
                        editable={editable}
                        onCommit={(text) => retext(note.id, text)}
                        onDone={() => setEditingId(null)}
                      />
                    ))}
                    {marquee ? (
                      <div
                        aria-hidden="true"
                        className="absolute z-50 rounded-[4px] border border-[var(--blue)] bg-[color-mix(in_srgb,var(--blue)_10%,transparent)] pointer-events-none"
                        style={{ left: Math.min(marquee.x0, marquee.x1), top: Math.min(marquee.y0, marquee.y1), width: Math.abs(marquee.x1 - marquee.x0), height: Math.abs(marquee.y1 - marquee.y0) }}
                      />
                    ) : null}
                    {!notes.loading && live.length === 0 ? (
                      <div className="absolute left-[min(50%,560px)] top-[200px] -translate-x-1/2 w-[min(420px,90%)] pointer-events-none">
                        <EmptyState icon={<Lightbulb size={26} aria-hidden="true" />} tone="amber" title={editable ? "Pizarra en blanco" : "Sin post-its"}>
                          {editable ? "Doble clic en cualquier parte para añadir un post-it." : "Esta pizarra está archivada."}
                        </EmptyState>
                      </div>
                    ) : null}
                  </div>
                </div>
              </MenuContextTrigger>
              <MenuContent className={`${menuStyles.content} outline-none`}>
                {menuTarget === "notes" && selection.length ? (
                  <>
                    {editable && selection.length === 1 ? <MenuItem value="edit" className={menuStyles.item}><Pencil size={16} aria-hidden="true" />Editar texto{keyHint("Enter")}</MenuItem> : null}
                    {editable ? (
                      <MenuSub>
                        <MenuSubTrigger className={menuStyles.item}><Palette size={16} aria-hidden="true" />Color<ChevronRight size={15} aria-hidden="true" className="ml-auto" /></MenuSubTrigger>
                        <MenuSubContent className={`${menuStyles.content} outline-none`}>
                          {stickyColors.map((option) => <MenuItem key={option.value} value={`color:${option.value}`} className={menuStyles.item}>{swatch(option.value)}{option.label}</MenuItem>)}
                        </MenuSubContent>
                      </MenuSub>
                    ) : null}
                    {editable ? <MenuItem value="duplicate" className={menuStyles.item}><Copy size={16} aria-hidden="true" />Duplicar{keyHint(`${mod}D`)}</MenuItem> : null}
                    {editable && selection.length > 1 ? <MenuItem value="arrange" className={menuStyles.item}><LayoutGrid size={16} aria-hidden="true" />Ordenar en cuadrícula</MenuItem> : null}
                    <MenuItem value="clear" className={menuStyles.item}><X size={16} aria-hidden="true" />Quitar selección{keyHint("Esc")}</MenuItem>
                    {editable ? (
                      <>
                        <MenuSeparator className={menuStyles.separator} />
                        <MenuItem value="delete" className={menuStyles.item} data-danger=""><Trash2 size={16} aria-hidden="true" />{selection.length === 1 ? "Eliminar post-it" : `Eliminar ${selection.length} post-its`}{keyHint("Supr")}</MenuItem>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    {editable ? <MenuItem value="add" className={menuStyles.item}><StickyIcon size={16} aria-hidden="true" />Nuevo post-it aquí{keyHint("Doble clic")}</MenuItem> : null}
                    <MenuItem value="select-all" className={menuStyles.item} disabled={!live.length}><MousePointerClick size={16} aria-hidden="true" />Seleccionar todo{keyHint(`${mod}A`)}</MenuItem>
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
      className={`block border-0 bg-transparent text-inherit outline-none [font:inherit] ${readOnly ? "" : "hover:bg-[var(--surface-2)] focus:bg-surface focus:[box-shadow:inset_0_0_0_1.5px_var(--blue)]"} placeholder:text-[var(--ink-mute)] ${className}`}
    />
  );
}

type NoteProps = {
  note: Entity<"stickyNotes">;
  position: { x: number; y: number };
  selected: boolean;
  dragging: boolean;
  editing: boolean;
  editable: boolean;
  onCommit: (text: string) => void;
  onDone: () => void;
};

/** Un post-it. Clic selecciona, arrastrar mueve, doble clic edita el texto (Esc o clic fuera termina). */
function Note({ note, position, selected, dragging, editing, editable, onCommit, onDone }: NoteProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const colors = paper[note.color];
  const author = personName(note.createdBy);

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

  return (
    <div
      data-note={note.id}
      role="group"
      aria-label={`Post-it de ${author}: ${note.text || "vacío"}${selected ? " (seleccionado)" : ""}`}
      className="absolute flex flex-col rounded-[3px] [touch-action:none] [transition:box-shadow_0.15s,transform_0.15s,outline-color_0.1s]"
      style={{
        left: position.x,
        top: position.y,
        width: NOTE_W,
        height: NOTE_H,
        background: colors.bg,
        color: colors.ink,
        zIndex: dragging ? 30 : editing ? 25 : selected ? 20 : 1,
        transform: `rotate(${dragging || editing ? 0 : tilt(note.id)}deg) scale(${dragging ? 1.03 : 1})`,
        boxShadow: dragging ? "0 18px 34px -12px rgba(0,0,0,0.38), 0 2px 4px rgba(0,0,0,0.1)" : "0 1px 2px rgba(0,0,0,0.08), 0 10px 18px -10px rgba(0,0,0,0.3)",
        outline: selected ? "2px solid var(--blue)" : "2px solid transparent",
        outlineOffset: 3,
        cursor: editing ? "auto" : editable ? (dragging ? "grabbing" : "grab") : "default",
      }}
    >
      <div className="h-[22px] flex items-center px-[10px] rounded-t-[3px] text-[10.5px] font-semibold uppercase tracking-[0.06em]" style={{ background: colors.fold }}>
        <span className="opacity-70">{note.createdAt.slice(5, 10).split("-").reverse().join("/")}</span>
      </div>
      <textarea
        ref={area}
        value={draft ?? note.text}
        readOnly={!editing}
        tabIndex={editing ? 0 : -1}
        maxLength={500}
        aria-label="Texto del post-it"
        placeholder={editable ? "Doble clic para escribir…" : ""}
        onFocus={() => { if (editing) setDraft(note.text); }}
        onBlur={finish}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" || (event.key === "Enter" && (event.metaKey || event.ctrlKey))) { event.preventDefault(); event.currentTarget.blur(); }
          event.stopPropagation();
        }}
        className={`flex-1 w-full min-h-0 resize-none border-0 bg-transparent px-[12px] pt-[8px] pb-[4px] text-[15px] leading-[1.35] font-medium outline-none [color:inherit] [font-family:var(--font-sans)] placeholder:text-current placeholder:opacity-45 ${editing ? "cursor-text" : "pointer-events-none select-none"}`}
      />
      <div className="flex items-center gap-[6px] px-[10px] pb-[8px] text-[11px] font-medium opacity-75 pointer-events-none">
        <Avatar name={author} size={16} tone="violet" />
        <span className="truncate">{author}</span>
      </div>
    </div>
  );
}
