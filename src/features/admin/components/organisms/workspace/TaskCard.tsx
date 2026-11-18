"use client";

import { Bug, CalendarDays, CircleDot, Layers, ListChecks, MessageSquare, Bookmark } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import type { Tone } from "@/ui/lib/tones";
import { formatDate } from "@/features/admin/lib/dates";
import { personName } from "@/features/admin/lib/people";
import type { Entity, WorkTask } from "@/features/admin/lib/workspace";
import styles from "./Board.styles";

export const priorityMeta: Record<WorkTask["priority"], { label: string; tone: Tone }> = {
  high: { label: "Alta", tone: "coral" },
  medium: { label: "Media", tone: "amber" },
  low: { label: "Baja", tone: "neutral" },
};
export const typeMeta: Record<WorkTask["type"], { label: string; icon: React.ReactNode }> = {
  task: { label: "Tarea", icon: <CircleDot size={14} strokeWidth={2.4} aria-hidden="true" /> },
  bug: { label: "Error", icon: <Bug size={14} strokeWidth={2.4} aria-hidden="true" /> },
  story: { label: "Historia", icon: <Bookmark size={14} strokeWidth={2.4} aria-hidden="true" /> },
  epic: { label: "Épica", icon: <Layers size={14} strokeWidth={2.4} aria-hidden="true" /> },
};

/** Estado de la fecha límite: vencida (coral), próxima (ámbar) o con margen. */
export function dueState(dueDate: string, today: string, done: boolean): { tone: Tone; label: string } | null {
  if (!dueDate) return null;
  const label = formatDate(dueDate, { day: "numeric", month: "short" });
  if (done) return { tone: "neutral", label };
  const days = Math.round((Date.parse(dueDate) - Date.parse(today)) / 86400000);
  if (days < 0) return { tone: "coral", label: `Vencida · ${label}` };
  if (days <= 2) return { tone: "amber", label: days === 0 ? "Hoy" : days === 1 ? "Mañana" : label };
  return { tone: "neutral", label };
}

/** Contenido de la tarjeta: título, etiquetas y una línea de metadatos (tipo e ID; fecha, avance, comentarios y responsable). */
export function TaskCardBody({ task, done, today }: { task: Entity<"tasks">; done: boolean; today: string }) {
  const due = dueState(task.dueDate, today, done);
  const finished = task.checklist.filter((item) => item.done).length;
  const priority = priorityMeta[task.priority];
  return (
    <>
      <span className={styles.cardHead}>
        <span className={styles.priority} data-tone={priority.tone} title={`Prioridad ${priority.label.toLowerCase()}`}>
          <span className="sr-only">Prioridad {priority.label.toLowerCase()}</span>
        </span>
        <span className={styles.cardTitle}>{task.title}</span>
      </span>
      {task.tags.length ? (
        <span className={styles.tags}>
          {task.tags.slice(0, 3).map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
          {task.tags.length > 3 ? <span className={styles.tag}>+{task.tags.length - 3}</span> : null}
        </span>
      ) : null}
      <span className={styles.cardMeta}>
        <span className={styles.type} title={typeMeta[task.type].label}>
          {typeMeta[task.type].icon}
          <span>{task.id.slice(0, 6).toUpperCase()}</span>
        </span>
        <span className={styles.metaIcons}>
          {due ? <span className={styles.due} data-tone={due.tone}><CalendarDays size={13} strokeWidth={2.2} aria-hidden="true" />{due.label}</span> : null}
          {task.checklist.length ? <span data-complete={finished === task.checklist.length || undefined}><ListChecks size={14} strokeWidth={2.2} aria-hidden="true" />{finished}/{task.checklist.length}</span> : null}
          {task.comments.length ? <span><MessageSquare size={14} strokeWidth={2.2} aria-hidden="true" />{task.comments.length}</span> : null}
          {task.points ? <span className={styles.points}>{task.points}</span> : null}
          {task.assignee
            ? <span className={styles.assignee} title={personName(task.assignee)}><Avatar name={personName(task.assignee)} size={20} tone="violet" /></span>
            : <span className={styles.unassigned} title="Sin asignar" aria-label="Sin asignar" />}
        </span>
      </span>
    </>
  );
}

/** Datos de una tarea tal como los espera la Server Action, con otro estado. */
export function taskPayload(task: Entity<"tasks">, status = task.status) {
  return {
    title: task.title,
    description: task.description,
    boardId: task.boardId,
    status,
    priority: task.priority,
    type: task.type,
    assignee: task.assignee,
    dueDate: task.dueDate,
    tags: task.tags,
    points: task.points,
    articleId: task.articleId,
    checklist: task.checklist.map(({ id, title, done }) => ({ id, title, done })),
  };
}
