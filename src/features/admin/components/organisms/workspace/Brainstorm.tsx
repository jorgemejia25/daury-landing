"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/react/toolbar";
import { Archive, ArchiveRestore, Lightbulb, Pencil, Plus, SquarePlus, StickyNote as StickyIcon, Trash2 } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { Button } from "@/ui/atoms/Button";
import { StatusDot } from "@/ui/atoms/StatusDot";
import { ActionMenu } from "@/ui/molecules/ActionMenu";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { ScreenHeader } from "@/ui/molecules/ScreenHeader";
import { saveWorkspaceItem } from "@/features/admin/actions/workspace";
import { bulkWorkspaceAction } from "@/features/admin/actions/bulk";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import { personName } from "@/features/admin/lib/people";
import { brainstormHref, editWhiteboardHref, newWhiteboardHref } from "@/features/admin/lib/routes";
import { CollectionForm } from "../editors/CollectionForm";
import { canvasSize, stickyColors, type Entity, type StickyColor, type StickyNote } from "@/features/admin/lib/workspace";
import { toggleArchive, WorkspaceStatus } from "./WorkspaceParts";
import boardStyles from "./Board.styles";

const NOTE_W = 200, NOTE_H = 176;
/** Papel de cada color: fondo, pliegue superior y tinta (legibles en tema claro y oscuro). */
const paper: Record<StickyColor, { bg: string; fold: string; ink: string }> = {
  yellow: { bg: "#FFE98F", fold: "#F5D65C", ink: "#3A2F06" },
  pink: { bg: "#FFC9D6", fold: "#F8A9BC", ink: "#4A1323" },
  blue: { bg: "#C9DCFF", fold: "#A9C4FA", ink: "#0F2557" },
  green: { bg: "#C8EFCF", fold: "#A3E0AF", ink: "#0E3B19" },
  violet: { bg: "#E2D6FF", fold: "#CBB8FA", ink: "#2A1563" },
};
const clamp = (value: number, max: number) => Math.round(Math.min(Math.max(value, 0), max));
/** Inclinación estable por post-it, para que el tablero se sienta a mano. */
const tilt = (id: string) => ((Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 7) - 3) * 0.45;
const payload = (note: Entity<"stickyNotes">, changes: Partial<StickyNote> = {}): StickyNote => ({ whiteboardId: note.whiteboardId, text: note.text, color: note.color, x: note.x, y: note.y, ...changes });

/** Brainstorm: pizarras con post-its que el equipo mueve y edita en tiempo real. */
export function BrainstormWorkspace() {
  const router = useRouter();
  const { params, update } = useAdminQuery();
  const whiteboards = useWorkspace("whiteboards");
  const archived = params.get("archived") === "yes";
  const options = whiteboards.items.filter((item) => item.archived === archived).toSorted((a, b) => a.createdAt.localeCompare(b.createdAt));
  const board = options.find((item) => item.id === params.get("pizarra")) ?? options[0];
  const notes = useWorkspace("stickyNotes", "whiteboardId", board?.id);
  const [color, setColor] = useState<StickyColor>("yellow");
  const [error, setError] = useState("");
  const [focusId, setFocusId] = useState("");
  /** Cambios locales que Firestore aún no confirma: se muestran hasta que llega esa revisión. */
  const [pending, setPending] = useState<Record<string, Partial<StickyNote> & { until: number }>>({});
  const revisions = useRef<Record<string, number>>({});
  const queues = useRef<Record<string, Promise<void>>>({});
  const canvas = useRef<HTMLDivElement>(null);
  const editable = Boolean(board && !board.archived);

  const live = notes.items.filter((note) => !note.archived).map((note) => {
    const local = pending[note.id];
    return local && note.revision < local.until ? { ...note, ...local } : note;
  });
  const width = Math.max(2400, ...live.map((note) => note.x + NOTE_W + 240));
  const height = Math.max(1500, ...live.map((note) => note.y + NOTE_H + 240));

  function persist(note: Entity<"stickyNotes">, changes: Partial<StickyNote>) {
    const known = Math.max(note.revision, revisions.current[note.id] ?? 0);
    setPending((current) => ({ ...current, [note.id]: { ...current[note.id], ...changes, until: known + 1 } }));
    setError("");
    const previous = queues.current[note.id] ?? Promise.resolve();
    queues.current[note.id] = previous.then(async () => {
      const server = notes.items.find((item) => item.id === note.id) ?? note;
      const revision = Math.max(server.revision, revisions.current[note.id] ?? 0);
      try {
        const result = await saveWorkspaceItem({ collection: "stickyNotes", id: note.id, revision, data: payload({ ...server, ...pending[note.id] }, changes) });
        if (!result.ok) throw new Error(result.error);
        revisions.current[note.id] = result.revision;
        setPending((current) => (current[note.id] ? { ...current, [note.id]: { ...current[note.id], until: result.revision } } : current));
      } catch {
        setPending((current) => { const next = { ...current }; delete next[note.id]; return next; });
        setError("No se pudo guardar el post-it. Puede que alguien lo haya cambiado al mismo tiempo; inténtalo de nuevo.");
      }
    });
  }

  async function addNote(x?: number, y?: number) {
    if (!board || !editable) return;
    const view = canvas.current;
    const nudge = (live.length % 5) * 22; // varios post-its seguidos no quedan encimados
    const position = {
      x: clamp(x ?? (view ? view.scrollLeft + view.clientWidth / 2 - NOTE_W / 2 + nudge : 80), canvasSize - NOTE_W),
      y: clamp(y ?? (view ? view.scrollTop + view.clientHeight / 2 - NOTE_H / 2 + nudge : 80), canvasSize - NOTE_H),
    };
    setError("");
    try {
      const result = await saveWorkspaceItem({ collection: "stickyNotes", data: { whiteboardId: board.id, text: "", color, ...position } });
      if (!result.ok) throw new Error(result.error);
      revisions.current[result.id] = result.revision;
      setFocusId(result.id);
    } catch {
      setError("No se pudo crear el post-it. Revisa tu conexión.");
    }
  }

  async function removeNote(note: Entity<"stickyNotes">) {
    setError("");
    const result = await bulkWorkspaceAction("stickyNotes", [note.id], { type: "delete" }).catch(() => ({ ok: false as const, error: "No se pudo eliminar el post-it." }));
    if (!result.ok) setError(result.error);
  }

  async function onBoardAction(value: string) {
    if (value === "new") router.push(newWhiteboardHref());
    if (value === "archived") update({ archived: archived ? null : "yes", pizarra: null });
    if (value === "archive" && board) setError(await toggleArchive("whiteboards", board));
  }

  if (whiteboards.loading || whiteboards.error) return <WorkspaceStatus loading={whiteboards.loading} errors={[whiteboards.error]} />;

  return (
    <section className="min-w-0">
      <ScreenHeader
        eyebrow={archived ? "Pizarras archivadas" : "Brainstorm"}
        title={board?.name ?? "Brainstorm"}
        subtitle={board?.description || "Ideas sueltas en post-its: arrástralas, agrúpalas y decidan juntos."}
        right={
          <div className="flex items-center gap-[8px] flex-wrap">
            {board && editable ? <Button variant="secondary" icon={<Pencil size={15} aria-hidden="true" />} render={<Link href={editWhiteboardHref(board.id)} />}>Editar pizarra</Button> : null}
            {editable ? <Button icon={<Plus size={17} strokeWidth={2.4} aria-hidden="true" />} onClick={() => void addNote()}>Nuevo post-it</Button> : null}
            <ActionMenu
              label="Opciones de brainstorm"
              onAction={onBoardAction}
              actions={[
                { value: "new", label: "Nueva pizarra", icon: <SquarePlus size={16} aria-hidden="true" /> },
                { value: "archived", label: archived ? "Ver pizarras activas" : "Ver archivadas", icon: <Archive size={16} aria-hidden="true" />, separatorBefore: true },
                ...(board ? [{ value: "archive", label: board.archived ? "Restaurar pizarra" : "Archivar pizarra", icon: board.archived ? <ArchiveRestore size={16} aria-hidden="true" /> : <Archive size={16} aria-hidden="true" />, danger: !board.archived }] : []),
              ]}
            />
          </div>
        }
      />
      <WorkspaceStatus loading={false} errors={[notes.error, error]} />

      {board ? (
        <>
          <div className={boardStyles.boardBar}>
            <nav className={boardStyles.boardTabs} aria-label="Pizarras">
              {options.map((item) => (
                <button key={item.id} type="button" className={boardStyles.boardTab} aria-current={item.id === board.id ? "page" : undefined} onClick={() => update({ pizarra: item.id })}>
                  <StatusDot tone={item.color} size={8} />
                  {item.name}
                </button>
              ))}
              {!archived ? (
                <Link href={newWhiteboardHref()} className={boardStyles.newBoard} aria-label="Nueva pizarra" title="Nueva pizarra">
                  <Plus size={15} strokeWidth={2.4} aria-hidden="true" />
                </Link>
              ) : null}
            </nav>
          </div>

          <Toolbar aria-label="Herramientas de la pizarra" className="flex items-center flex-wrap gap-[8px] mb-[12px] p-[6px] w-fit max-w-full rounded-[12px] border border-rule bg-surface [box-shadow:var(--shadow-xs)]">
            <ToolbarButton
              disabled={!editable}
              onClick={() => void addNote()}
              className="inline-flex items-center gap-[6px] h-[32px] px-[10px] rounded-[8px] border-0 bg-transparent text-ink text-[13px] font-semibold cursor-pointer hover:bg-[var(--surface-2)] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[var(--blue)]"
            >
              <StickyIcon size={16} aria-hidden="true" />
              Post-it
            </ToolbarButton>
            <ToolbarSeparator className="w-px h-[20px] bg-[var(--rule-strong)]" />
            <ToggleGroup aria-label="Color del nuevo post-it" value={[color]} deselectable={false} onValueChange={([value]) => value && setColor(value as StickyColor)} className="flex items-center gap-[4px]">
              {stickyColors.map((option) => (
                <Toggle
                  key={option.value}
                  value={option.value}
                  aria-label={option.label}
                  className="grid place-items-center w-[30px] h-[30px] rounded-[8px] border-0 bg-transparent cursor-pointer hover:bg-[var(--surface-2)] data-[pressed]:bg-[var(--surface-2)] data-[pressed]:[box-shadow:inset_0_0_0_1.5px_var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--blue)]"
                >
                  <span className="block w-[16px] h-[16px] rounded-[4px] [box-shadow:inset_0_0_0_1px_rgba(0,0,0,0.12)]" style={{ background: paper[option.value].bg }} />
                </Toggle>
              ))}
            </ToggleGroup>
            <ToolbarSeparator className="w-px h-[20px] bg-[var(--rule-strong)]" />
            <span className="px-[6px] text-ink-soft text-[12.5px]" aria-live="polite">
              {live.length} {live.length === 1 ? "idea" : "ideas"}{editable ? " · doble clic en el lienzo para añadir" : ""}
            </span>
          </Toolbar>

          <div
            ref={canvas}
            className="relative h-[calc(100dvh-330px)] min-h-[460px] overflow-auto rounded-[var(--r-xl)] border border-rule bg-surface [box-shadow:var(--shadow-xs)] max-[960px]:h-[70dvh]"
            aria-label={`Lienzo de ${board.name}`}
          >
            <div
              className="relative [background-image:radial-gradient(var(--rule-strong)_1px,transparent_1.2px)] [background-size:24px_24px]"
              style={{ width, height }}
              onDoubleClick={(event) => {
                if (event.target !== event.currentTarget) return;
                const box = event.currentTarget.getBoundingClientRect();
                void addNote(event.clientX - box.left - NOTE_W / 2, event.clientY - box.top - 24);
              }}
            >
              {live.map((note) => (
                <Note
                  key={note.id}
                  note={note}
                  editable={editable}
                  autoFocus={note.id === focusId}
                  onFocused={() => setFocusId("")}
                  onChange={(changes) => persist(note, changes)}
                  onDelete={() => void removeNote(note)}
                />
              ))}
              {!notes.loading && live.length === 0 ? (
                <div className="absolute left-1/2 top-[220px] -translate-x-1/2 w-[min(420px,90%)] pointer-events-none">
                  <EmptyState icon={<Lightbulb size={26} aria-hidden="true" />} tone="amber" title={editable ? "Pizarra en blanco" : "Sin post-its"}>
                    {editable ? "Añade el primer post-it con el botón o con doble clic en el lienzo." : "Esta pizarra está archivada."}
                  </EmptyState>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Lightbulb size={26} aria-hidden="true" />}
          tone="amber"
          title={archived ? "No hay pizarras archivadas" : "Crea tu primera pizarra"}
          action={archived ? <Button variant="secondary" onClick={() => update({ archived: null })}>Ver pizarras activas</Button> : <Button icon={<Plus size={17} aria-hidden="true" />} render={<Link href={newWhiteboardHref()} />}>Nueva pizarra</Button>}
        >
          Una pizarra por tema: nombre de la mascota, ideas de contenido, funciones para el MVP…
        </EmptyState>
      )}
    </section>
  );
}

type NoteProps = {
  note: Entity<"stickyNotes">;
  editable: boolean;
  autoFocus: boolean;
  onFocused: () => void;
  onChange: (changes: Partial<StickyNote>) => void;
  onDelete: () => void;
};

/** Un post-it: se arrastra desde cualquier parte menos el texto; el texto se guarda al dejar de escribir. */
function Note({ note, editable, autoFocus, onFocused, onChange, onDelete }: NoteProps) {
  /** Borrador mientras alguien escribe aquí; si no, el texto sigue lo que llega de Firestore. */
  const [draft, setDraft] = useState<string | null>(null);
  const editing = draft !== null, text = draft ?? note.text;
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const start = useRef<{ pointerX: number; pointerY: number; x: number; y: number; moved: boolean } | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colors = paper[note.color];

  useEffect(() => {
    if (!autoFocus) return;
    area.current?.focus();
    onFocused();
  }, [autoFocus, onFocused]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function commit(value: string) {
    if (timer.current) clearTimeout(timer.current);
    if (value !== note.text) onChange({ text: value });
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!editable || event.button !== 0 || (event.target as HTMLElement).closest("textarea,button,[role=menu]")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { pointerX: event.clientX, pointerY: event.clientY, x: note.x, y: note.y, moved: false };
  }
  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const origin = start.current;
    if (!origin) return;
    const dx = event.clientX - origin.pointerX, dy = event.clientY - origin.pointerY;
    if (!origin.moved && Math.hypot(dx, dy) < 4) return;
    origin.moved = true;
    setDrag({ x: clamp(origin.x + dx, canvasSize - NOTE_W), y: clamp(origin.y + dy, canvasSize - NOTE_H) });
  }
  function onPointerUp() {
    const origin = start.current;
    start.current = null;
    if (origin?.moved && drag) onChange({ x: drag.x, y: drag.y });
    setDrag(null);
  }
  /** Con el teclado: flechas para mover 16 px (Mayús: 64 px). */
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!editable || event.target !== event.currentTarget) return;
    const step = event.shiftKey ? 64 : 16;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
    if (!delta) return;
    event.preventDefault();
    onChange({ x: clamp(note.x + delta[0], canvasSize - NOTE_W), y: clamp(note.y + delta[1], canvasSize - NOTE_H) });
  }

  const position = drag ?? { x: note.x, y: note.y };
  const author = personName(note.createdBy);
  return (
    <div
      role="group"
      tabIndex={0}
      aria-label={`Post-it de ${author}: ${note.text || "vacío"}. Flechas para mover.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { start.current = null; setDrag(null); }}
      onKeyDown={onKeyDown}
      className="absolute flex flex-col rounded-[3px] [touch-action:none] select-none focus-visible:outline-2 focus-visible:outline-[var(--blue)] focus-visible:outline-offset-2 [transition:box-shadow_0.15s,transform_0.15s]"
      style={{
        left: position.x,
        top: position.y,
        width: NOTE_W,
        height: NOTE_H,
        background: colors.bg,
        color: colors.ink,
        zIndex: drag ? 30 : editing ? 20 : 1,
        transform: `rotate(${drag ? 0 : tilt(note.id)}deg) scale(${drag ? 1.04 : 1})`,
        boxShadow: drag ? "0 18px 34px -12px rgba(0,0,0,0.38), 0 2px 4px rgba(0,0,0,0.1)" : "0 1px 2px rgba(0,0,0,0.08), 0 10px 18px -10px rgba(0,0,0,0.3)",
        cursor: editable ? (drag ? "grabbing" : "grab") : "default",
      }}
    >
      <div className="flex items-center justify-between h-[24px] pl-[10px] pr-[2px] rounded-t-[3px]" style={{ background: colors.fold }}>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] opacity-70">{note.createdAt.slice(5, 10).split("-").reverse().join("/")}</span>
        {editable ? (
          <ActionMenu
            label={`Opciones del post-it ${note.text || "vacío"}`}
            triggerClassName="grid place-items-center w-[24px] h-[22px] p-0 rounded-[5px] border-0 bg-transparent [color:inherit] opacity-60 cursor-pointer hover:opacity-100 hover:bg-black/10 data-[open]:opacity-100 data-[open]:bg-black/10 focus-visible:outline-2 focus-visible:outline-[var(--blue)]"
            onAction={(value) => (value === "delete" ? onDelete() : onChange({ color: value as StickyColor }))}
            actions={[
              ...stickyColors.filter((option) => option.value !== note.color).map((option) => ({ value: option.value, label: `Cambiar a ${option.label.toLowerCase()}`, icon: <span className="block w-[14px] h-[14px] rounded-[4px] [box-shadow:inset_0_0_0_1px_rgba(0,0,0,0.12)]" style={{ background: paper[option.value].bg }} /> })),
              { value: "delete", label: "Eliminar post-it", icon: <Trash2 size={15} aria-hidden="true" />, danger: true, separatorBefore: true },
            ]}
          />
        ) : null}
      </div>
      <textarea
        ref={area}
        value={text}
        readOnly={!editable}
        maxLength={500}
        aria-label="Texto del post-it"
        placeholder={editable ? "Escribe una idea…" : ""}
        onFocus={() => setDraft(note.text)}
        onBlur={() => { if (draft !== null) commit(draft); setDraft(null); }}
        onChange={(event) => {
          const value = event.target.value;
          setDraft(value);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => commit(value), 900);
        }}
        className="flex-1 w-full min-h-0 resize-none border-0 bg-transparent px-[12px] pt-[8px] pb-[4px] font-[inherit] text-[15px] leading-[1.35] font-medium outline-none placeholder:text-current placeholder:opacity-45 [color:inherit] [font-family:var(--font-sans)]"
      />
      <div className="flex items-center gap-[6px] px-[10px] pb-[8px] text-[11px] font-medium opacity-75">
        <Avatar name={author} size={16} tone="violet" />
        <span className="truncate">{author}</span>
      </div>
    </div>
  );
}

/** Crear o editar una pizarra (nombre, descripción y color). */
export function WhiteboardFormPage({ id }: { id?: string }) {
  const router = useRouter();
  const whiteboards = useWorkspace("whiteboards");
  const whiteboard = id ? whiteboards.items.find((item) => item.id === id) : undefined;
  if (whiteboards.loading || whiteboards.error) return <WorkspaceStatus loading={whiteboards.loading} errors={[whiteboards.error]} />;
  if (id && (!whiteboard || whiteboard.archived)) {
    return (
      <EmptyState icon={<Lightbulb size={24} aria-hidden="true" />} tone="amber" title={whiteboard?.archived ? "Esta pizarra está archivada" : "Esta pizarra no existe"} action={<Button variant="secondary" render={<Link href={brainstormHref()} />}>Volver a brainstorm</Button>}>
        Restáurala desde las pizarras archivadas o revisa el enlace.
      </EmptyState>
    );
  }
  return <CollectionForm key={whiteboard?.id ?? "new"} kind="whiteboards" initial={whiteboard} onClose={() => router.push(brainstormHref(whiteboard?.id))} onSaved={(saved) => router.push(brainstormHref(saved))} />;
}
