"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type UniqueIdentifier,
  type DragOverEvent,
  type KeyboardCoordinateGetter,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { IconButton } from "@/ui/atoms/IconButton";
import { StatusDot } from "@/ui/atoms/StatusDot";
import type { Tone } from "@/ui/lib/tones";
import type { Entity } from "@/features/admin/lib/workspace";
import { TaskCardBody } from "./TaskCard";
import { SelectBox } from "../../molecules/BulkBar";
import styles from "./Board.styles";

type KanbanColumnsProps = {
  board: Entity<"boards">;
  tasks: Entity<"tasks">[];
  today: string;
  editable: boolean;
  onOpen: (task: Entity<"tasks">) => void;
  onCreate: (status: string) => void;
  /** Mueve la tarea a otra columna y, si hay orden manual, a una posición (`rank`). */
  onMove: (task: Entity<"tasks">, status: string, rank?: number) => void;
  /** Con orden manual, arrastrar también reordena dentro de la columna. */
  reorderable?: boolean;
  /** Acción bajo cada tarjeta (restaurar, en archivados). */
  extra?: (task: Entity<"tasks">) => React.ReactNode;
  /** Selección para acciones masivas; con algo seleccionado, un clic en la tarjeta la marca en vez de abrirla. */
  selection?: { has: (id: string) => boolean; toggle: (id: string) => void; active: boolean };
};

/** Con el teclado, ← y → llevan la tarjeta a la columna vecina. */
const columnKeys: KeyboardCoordinateGetter = (event, args) => {
  if (event.code !== "ArrowRight" && event.code !== "ArrowLeft") return sortableKeyboardCoordinates(event, args);
  const { context: { droppableRects, over, active } } = args;
  event.preventDefault();
  const columns = [...droppableRects.entries()].filter(([id]) => String(id).startsWith("column:")).toSorted(([, a], [, b]) => a.left - b.left);
  const currentId = over?.id ?? (active ? columns.find(([, rect]) => rect)?.[0] : undefined);
  const index = columns.findIndex(([id]) => id === currentId);
  const target = columns[Math.min(columns.length - 1, Math.max(0, index + (event.code === "ArrowRight" ? 1 : -1)))];
  if (!target) return undefined;
  const [, rect] = target;
  return { x: rect.left + rect.width / 2, y: rect.top + 80 };
};

function DraggableCard({ task, done, today, editable, onOpen, extra, selection }: { task: Entity<"tasks">; done: boolean; today: string; editable: boolean; onOpen: () => void; extra?: React.ReactNode; selection?: KanbanColumnsProps["selection"] }) {
  const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({ id: task.id, data: { task }, disabled: !editable });
  const checked = Boolean(selection?.has(task.id));
  const open = () => (selection?.active ? selection.toggle(task.id) : onOpen());
  return (
    <div className={`${styles.cardWrap} group relative`} style={{ transform: CSS.Translate.toString(transform), transition }}>
      {selection ? (
        <SelectBox
          checked={checked}
          onChange={() => selection.toggle(task.id)}
          label={`Seleccionar ${task.title}`}
          className={`absolute z-[2] top-[11px] right-[11px] ${checked || selection.active ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-[960px]:opacity-100"}`}
        />
      ) : null}
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        role="button"
        tabIndex={0}
        aria-label={`Abrir tarea ${task.title}`}
        aria-roledescription={editable ? "tarjeta movible" : undefined}
        aria-disabled={!editable || undefined}
        className={styles.card}
        data-done={done || undefined}
        data-dragging={isDragging || undefined}
        data-selected={checked || undefined}
        style={isDragging ? { opacity: 0.35, borderStyle: "dashed", boxShadow: "none" } : checked ? { borderColor: "var(--blue)", boxShadow: "0 0 0 1px var(--blue)" } : undefined}
        onClick={open}
        onKeyDown={(event) => {
          listeners?.onKeyDown?.(event);
          if (event.key === "Enter" && !isDragging && !event.defaultPrevented) {
            event.preventDefault();
            open();
          }
        }}
      >
        <TaskCardBody task={task} done={done} today={today} />
      </div>
      {extra}
    </div>
  );
}

function Column({ id, board, tasks, today, editable, onOpen, onCreate, extra, selection }: Omit<KanbanColumnsProps, "onMove" | "tasks"> & { id: string; tasks: Entity<"tasks">[] }) {
  const column = board.columns[id];
  const { setNodeRef, isOver } = useDroppable({ id: `column:${id}`, data: { column: id }, disabled: !editable });
  const tone: Tone = column.done ? "green" : board.color;
  return (
    <section ref={setNodeRef} className={styles.column} data-over={isOver || undefined} aria-label={column.name}>
      <header className={styles.columnHead}>
        <h2>
          <StatusDot tone={tone} size={8} />
          {column.name}
        </h2>
        <span className={styles.count}>{tasks.length}</span>
        {editable ? (
          <IconButton variant="plain" aria-label={`Agregar en ${column.name}`} onClick={() => onCreate(id)}>
            <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
          </IconButton>
        ) : null}
      </header>
      <SortableContext id={id} items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
      <div className={styles.cards}>
        {tasks.map((task) => (
          <DraggableCard key={task.id} task={task} done={column.done} today={today} editable={editable} onOpen={() => onOpen(task)} extra={extra?.(task)} selection={selection} />
        ))}
        {tasks.length === 0 ? <p className={styles.columnEmpty}>{isOver ? "Suelta aquí" : "Sin tareas"}</p> : null}
      </div>
      </SortableContext>
    </section>
  );
}

/** Orden efectivo: el manual (`rank`) o, sin él, la más reciente arriba. */
export const effectiveRank = (task: Entity<"tasks">) => task.rank ?? -Date.parse(task.createdAt);

/** Columnas del kanban con arrastrar y soltar (ratón, táctil y teclado): mueve entre columnas y reordena en vertical. */
export function KanbanColumns(props: KanbanColumnsProps) {
  const { board, tasks, today, onMove, reorderable = true } = props;
  const [dragging, setDragging] = useState<Entity<"tasks"> | null>(null);
  /** Durante el arrastre, el orden previsto de cada columna (para ver dónde caerá la tarjeta). */
  const [preview, setPreview] = useState<Record<string, string[]> | null>(null);
  // ID estable: evita que los atributos aria de dnd-kit difieran entre servidor y cliente.
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: columnKeys, keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space", "Enter"] } }),
  );
  const byId = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);
  const base = useMemo(() => Object.fromEntries(board.columnOrder.map((column) => [column, tasks.filter((task) => task.status === column).map((task) => task.id)])), [board.columnOrder, tasks]);
  const layout = preview ?? base;
  /** Evita el bucle de dnd-kit: tras pasar la tarjeta a otra columna, se espera un cuadro antes de recalcular. */
  const lastOver = useRef<UniqueIdentifier | null>(null);
  const recentlyMoved = useRef(false);
  useEffect(() => { requestAnimationFrame(() => { recentlyMoved.current = false; }); }, [preview]);
  const collision: CollisionDetection = useCallback((args) => {
    const pointer = pointerWithin(args);
    let overId = getFirstCollision(pointer.length ? pointer : rectIntersection(args), "id");
    if (overId != null) {
      const key = String(overId);
      if (key.startsWith("column:")) {
        const items = layout[key.slice(7)] ?? [];
        if (items.length) overId = closestCenter({ ...args, droppableContainers: args.droppableContainers.filter((container) => items.includes(String(container.id))) })[0]?.id ?? overId;
      }
      lastOver.current = overId;
      return [{ id: overId }];
    }
    if (recentlyMoved.current) lastOver.current = args.active.id;
    return lastOver.current ? [{ id: lastOver.current }] : [];
  }, [layout]);
  const columnOf = (id: unknown, current = layout) => {
    const key = String(id);
    if (key.startsWith("column:")) return key.slice(7);
    return Object.keys(current).find((column) => current[column].includes(key));
  };
  const columnName = (id: unknown) => board.columns[columnOf(id) ?? ""]?.name ?? "otra columna";
  const titleOf = (id: unknown) => byId.get(String(id))?.title ?? "la tarea";
  const positionIn = (id: unknown) => { const column = columnOf(id); return column ? layout[column].indexOf(String(id)) + 1 : 0; };
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Tomaste ${titleOf(active.id)}. Flechas arriba y abajo para ordenar, izquierda y derecha para cambiar de columna, Espacio para soltar.`,
    onDragOver: ({ active, over }) => (over ? `${titleOf(active.id)} está en ${columnName(over.id)}${positionIn(active.id) ? `, posición ${positionIn(active.id)}` : ""}.` : `${titleOf(active.id)} no está sobre ninguna columna.`),
    onDragEnd: ({ active, over }) => (over ? `${titleOf(active.id)} quedó en ${columnName(over.id)}.` : `${titleOf(active.id)} volvió a su lugar.`),
    onDragCancel: ({ active }) => `Se canceló. ${titleOf(active.id)} volvió a su lugar.`,
  };

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const from = columnOf(active.id), to = columnOf(over.id);
    // Dentro de la misma columna, el orden lo anima SortableContext y se calcula al soltar.
    if (!from || !to || from === to) return;
    const id = String(active.id);
    const target = layout[to].filter((item) => item !== id);
    const overIndex = String(over.id).startsWith("column:") || !reorderable ? -1 : target.indexOf(String(over.id));
    const index = overIndex < 0 ? target.length : overIndex;
    recentlyMoved.current = true;
    setPreview({ ...layout, [from]: layout[from].filter((item) => item !== id), [to]: [...target.slice(0, index), id, ...target.slice(index)] });
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    const final = preview ?? base;
    setDragging(null);
    setPreview(null);
    lastOver.current = null;
    const task = byId.get(String(active.id));
    if (!task || !over) return;
    const column = columnOf(active.id, final) ?? task.status;
    let order = final[column] ?? [];
    const overColumn = columnOf(over.id, final);
    if (reorderable && overColumn === column && !String(over.id).startsWith("column:") && over.id !== active.id) {
      const from = order.indexOf(task.id), to = order.indexOf(String(over.id));
      if (from >= 0 && to >= 0) order = arrayMove(order, from, to);
    }
    const index = order.indexOf(task.id);
    if (index < 0) return;
    if (column === task.status && index === base[column].indexOf(task.id)) return;
    if (!reorderable) { if (column !== task.status) onMove(task, column); return; }
    const before = byId.get(order[index - 1] ?? ""), after = byId.get(order[index + 1] ?? "");
    const rank = before && after ? (effectiveRank(before) + effectiveRank(after)) / 2 : before ? effectiveRank(before) + 1024 : after ? effectiveRank(after) - 1024 : 0;
    onMove(task, column, rank);
  }

  const visible = (column: string) => layout[column].map((id) => byId.get(id)).filter((task): task is Entity<"tasks"> => Boolean(task));
  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={collision}
      accessibility={{ announcements, screenReaderInstructions: { draggable: "Para mover una tarjeta, presiona Espacio; usa arriba y abajo para ordenarla, izquierda y derecha para cambiar de columna, y Espacio para soltarla. Enter abre la tarea." } }}
      onDragStart={({ active }) => setDragging(byId.get(String(active.id)) ?? null)}
      onDragOver={onDragOver}
      onDragCancel={() => { setDragging(null); setPreview(null); lastOver.current = null; }}
      onDragEnd={onDragEnd}
    >
      <div className={styles.columns}>
        {board.columnOrder.map((id) => (
          <Column key={id} id={id} {...props} tasks={visible(id)} />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {dragging ? (
          <div className={styles.card} data-overlay="" style={{ transform: "rotate(2deg)", boxShadow: "0 16px 32px -12px rgba(0,0,0,0.35)" }}>
            <TaskCardBody task={dragging} done={Boolean(board.columns[dragging.status]?.done)} today={today} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
