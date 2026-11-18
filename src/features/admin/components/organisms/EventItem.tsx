"use client";

import Link from "next/link";
import { taskHref } from "@/features/admin/lib/routes";
import { ChevronRight } from "lucide-react";
import { Chip } from "@/ui/atoms/Chip";
import type { Tone } from "@/ui/lib/tones";
import { formatDate, formatTime } from "@/features/admin/lib/dates";
import { eventBounds, type CalendarCategory, type CalendarItem } from "@/features/admin/lib/planning";
import styles from "./EventItem.styles";

type EventItemProps = {
  event: CalendarItem;
  category: CalendarCategory;
  tone: Tone;
  /** Píldora pequeña dentro de la cuadrícula del mes. */
  compact?: boolean;
  date: string;
  divider?: boolean;
  /** Abre el evento a pantalla completa. Las fechas de tareas abren la tarea en el kanban. */
  onOpen?: (id: string) => void;
};

/** Evento del calendario: píldora en el mes o fila en la agenda. */
export function EventItem({ event, category, tone, compact = false, date, divider = false, onOpen }: EventItemProps) {
  const continues = !event.allDay && eventBounds(event).first < date;
  const time = event.allDay ? "Todo el día" : continues ? "En curso" : formatTime(event.start);
  const until = !event.allDay && event.end && !continues ? formatTime(event.end) : "";
  const label = `${event.taskId ? "Ver tarea" : "Ver evento"} ${event.id}: ${event.title}, ${formatDate(date)}`;
  const content = compact ? (
    <span className={styles.pillInner} data-tone={tone}>
      {!event.allDay ? <span className={styles.pillTime}>{time} </span> : null}
      <span>{event.title}</span>
    </span>
  ) : (
    <span className={styles.rowInner} data-divider={divider || undefined} data-tone={tone}>
      <span className={styles.bar} aria-hidden="true" />
      <span className={styles.time}>
        <b>{time}</b>
        {until ? <span>{until}</span> : null}
      </span>
      <span className={styles.title}>{event.title}</span>
      <Chip size="sm" tone={tone} className={styles.calendar}>{category.name}</Chip>
      <ChevronRight className={styles.chevron} size={16} strokeWidth={2} aria-hidden="true" />
    </span>
  );
  const className = compact ? styles.pill : styles.row;
  if (event.taskId) {
    return (
      <Link href={taskHref(event.taskId)} className={className} aria-label={label}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={className} aria-label={label} onClick={() => onOpen?.(event.id)}>
      {content}
    </button>
  );
}
