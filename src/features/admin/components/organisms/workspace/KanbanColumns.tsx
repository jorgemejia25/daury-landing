"use client";

import { useId, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type KeyboardCoordinateGetter,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { IconButton } from "@/ui/atoms/IconButton";
import { StatusDot } from "@/ui/atoms/StatusDot";
import type { Tone } from "@/ui/lib/tones";
import type { Entity } from "@/features/admin/lib/workspace";
import { TaskCardBody } from "./TaskCard";
import styles from "./Board.styles";

type KanbanColumnsProps = {
  board: Entity<"boards">;
  tasks: Entity<"tasks">[];
  today: string;
  editable: boolean;
  onOpen: (task: Entity<"tasks">) => void;
  onCreate: (status: string) => void;
  onMove: (task: Entity<"tasks">, status: string) => void;
  /** Acción bajo cada tarjeta (restaurar, en archivados). */
  extra?: (task: Entity<"tasks">) => React.ReactNode;
};

/** Con el teclado, ← y → llevan la tarjeta a la columna vecina. */
const columnKeys: KeyboardCoordinateGetter = (event, { context: { droppableRects, over, active } }) => {
  if (event.code !== "ArrowRight" && event.code !== "ArrowLeft") return undefined;
  event.preventDefault();
  const columns = [...droppableRects.entries()].toSorted(([, a], [, b]) => a.left - b.left);
  const currentId = over?.id ?? (active ? columns.find(([, rect]) => rect)?.[0] : undefined);
  const index = columns.findIndex(([id]) => id === currentId);
  const target = columns[Math.min(columns.length - 1, Math.max(0, index + (event.code === "ArrowRight" ? 1 : -1)))];
  if (!target) return undefined;
  const [, rect] = target;
  return { x: rect.left + rect.width / 2, y: rect.top + 80 };
};

function DraggableCard({ task, done, today, editable, onOpen, extra }: { task: Entity<"tasks">; done: boolean; today: string; editable: boolean; onOpen: () => void; extra?: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id, data: { task }, disabled: !editable });
  return (
    <div className={styles.cardWrap}>
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
        onClick={onOpen}
        onKeyDown={(event) => {
          listeners?.onKeyDown?.(event);
          if (event.key === "Enter" && !isDragging && !event.defaultPrevented) {
            event.preventDefault();
            onOpen();
          }
        }}
      >
        <TaskCardBody task={task} done={done} today={today} />
      </div>
      {extra}
    </div>
  );
}

function Column({ id, board, tasks, today, editable, onOpen, onCreate, extra }: Omit<KanbanColumnsProps, "onMove" | "tasks"> & { id: string; tasks: Entity<"tasks">[] }) {
  const column = board.columns[id];
  const { setNodeRef, isOver } = useDroppable({ id, disabled: !editable });
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
      <div className={styles.cards}>
        {tasks.map((task) => (
          <DraggableCard key={task.id} task={task} done={column.done} today={today} editable={editable} onOpen={() => onOpen(task)} extra={extra?.(task)} />
        ))}
        {tasks.length === 0 ? <p className={styles.columnEmpty}>{isOver ? "Suelta aquí" : "Sin tareas"}</p> : null}
      </div>
    </section>
  );
}

/** Columnas del kanban con arrastrar y soltar (ratón, táctil y teclado). */
export function KanbanColumns(props: KanbanColumnsProps) {
  const { board, tasks, today, onMove } = props;
  const [dragging, setDragging] = useState<Entity<"tasks"> | null>(null);
  // ID estable: evita que los atributos aria de dnd-kit difieran entre servidor y cliente.
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: columnKeys, keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space", "Enter"] } }),
  );
  const columnName = (id: unknown) => board.columns[String(id)]?.name ?? "otra columna";
  const titleOf = (id: unknown) => tasks.find((task) => task.id === id)?.title ?? "la tarea";
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Tomaste ${titleOf(active.id)}. Usa las flechas izquierda y derecha para cambiar de columna y Espacio para soltar.`,
    onDragOver: ({ active, over }) => (over ? `${titleOf(active.id)} está sobre ${columnName(over.id)}.` : `${titleOf(active.id)} no está sobre ninguna columna.`),
    onDragEnd: ({ active, over }) => (over ? `${titleOf(active.id)} se movió a ${columnName(over.id)}.` : `${titleOf(active.id)} volvió a su lugar.`),
    onDragCancel: ({ active }) => `Se canceló. ${titleOf(active.id)} volvió a su lugar.`,
  };

  function onDragEnd({ active, over }: DragEndEvent) {
    setDragging(null);
    const task = tasks.find((item) => item.id === active.id);
    if (task && over && over.id !== task.status) onMove(task, String(over.id));
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      accessibility={{ announcements, screenReaderInstructions: { draggable: "Para mover una tarjeta, presiona Espacio, usa las flechas izquierda y derecha para elegir la columna y presiona Espacio para soltarla. Enter abre la tarea." } }}
      onDragStart={({ active }) => setDragging(tasks.find((task) => task.id === active.id) ?? null)}
      onDragCancel={() => setDragging(null)}
      onDragEnd={onDragEnd}
    >
      <div className={styles.columns}>
        {board.columnOrder.map((id) => (
          <Column key={id} id={id} {...props} tasks={tasks.filter((task) => task.status === id)} />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {dragging ? (
          <div className={styles.card} data-overlay="">
            <TaskCardBody task={dragging} done={Boolean(board.columns[dragging.status]?.done)} today={today} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
