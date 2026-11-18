import type { Metadata } from "./workspace";
import { addDays, isDateOnly, localDate } from "./dates";

export const taskColumns = [
  { id: "todo", name: "Pendiente" },
  { id: "in-progress", name: "En curso" },
  { id: "review", name: "En revisión" },
  { id: "done", name: "Hecho" },
] as const;
export const priorities = [
  { value: "high", label: "Alta" },
  { value: "medium", label: "Media" },
  { value: "low", label: "Baja" },
] as const;
export type Task = {
  id: string;
  title: string;
  description: string;
  status: (typeof taskColumns)[number]["id"];
  priority: (typeof priorities)[number]["value"];
  area: string;
  tags: string[];
  order: number;
  dueDate?: string;
  documentSlug?: string;
};
export type BoardData = {
  areas: { id: string; name: string }[];
  tasks: Task[];
};
export type CalendarCategory = {
  id: string;
  name: string;
  color: "blue" | "green" | "amber" | "violet" | "coral";
  attribution?: Metadata;
};
export type AdminEvent = {
  id: string;
  title: string;
  calendarId: string;
  allDay: boolean;
  start: string;
  end?: string;
  description?: string;
  documentSlug?: string;
};
export type CalendarItem = AdminEvent & { taskId?: string; boardId?: string; articleId?: string; attribution?: Metadata };

function record(
  value: unknown,
  location: string,
): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${location}: se esperaba un objeto.`);
}
function text(value: unknown, location: string): asserts value is string {
  if (typeof value !== "string" || !value.trim())
    throw new Error(`${location}: se esperaba texto no vacío.`);
}
function id(value: unknown, location: string): asserts value is string {
  text(value, location);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
    throw new Error(`${location}: usa minúsculas, números y guiones.`);
}
function unique(items: { id: string }[], location: string) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id))
      throw new Error(`${location}: id duplicado ${item.id}.`);
    seen.add(item.id);
  }
}
function documentReference(
  value: unknown,
  allowedSlugs: string[],
  location: string,
) {
  if (
    value !== undefined &&
    (typeof value !== "string" || !allowedSlugs.includes(value))
  )
    throw new Error(`${location}: documento desconocido.`);
}

export function parseBoard(value: unknown, allowedSlugs: string[]): BoardData {
  const location = "content/boards/producto.json";
  record(value, location);
  if (!Array.isArray(value.areas) || !Array.isArray(value.tasks))
    throw new Error(`${location}: areas y tasks deben ser listas.`);
  for (const area of value.areas) {
    record(area, `${location}: area`);
    id(area.id, `${location}: area.id`);
    text(area.name, `${location}: area.name`);
  }
  const areaIds = value.areas.map((area) => area.id);
  for (const task of value.tasks) {
    record(task, `${location}: task`);
    id(task.id, `${location}: task.id`);
    const field = `${location}: ${task.id}`;
    text(task.title, `${field}.title`);
    if (typeof task.description !== "string")
      throw new Error(`${field}.description: se esperaba texto.`);
    if (!taskColumns.some((column) => column.id === task.status))
      throw new Error(`${field}.status: estado desconocido.`);
    if (!priorities.some((priority) => priority.value === task.priority))
      throw new Error(`${field}.priority: prioridad desconocida.`);
    if (!areaIds.includes(task.area))
      throw new Error(`${field}.area: área desconocida.`);
    if (
      !Array.isArray(task.tags) ||
      !task.tags.every((tag) => typeof tag === "string" && tag.trim())
    )
      throw new Error(`${field}.tags: se esperaba una lista de etiquetas.`);
    if (typeof task.order !== "number" || !Number.isFinite(task.order))
      throw new Error(`${field}.order: se esperaba un número.`);
    if (
      task.dueDate !== undefined &&
      (typeof task.dueDate !== "string" || !isDateOnly(task.dueDate))
    )
      throw new Error(`${field}.dueDate: usa una fecha válida YYYY-MM-DD.`);
    documentReference(task.documentSlug, allowedSlugs, `${field}.documentSlug`);
  }
  const board = value as BoardData;
  unique(board.areas, location);
  unique(board.tasks, location);
  return board;
}

function isTimestamp(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value,
    )
  )
    return false;
  const time = value.slice(11).match(/^(\d{2}):(\d{2})(?::(\d{2}))?/)!;
  return (
    isDateOnly(value.slice(0, 10)) &&
    Number(time[1]) < 24 &&
    Number(time[2]) < 60 &&
    Number(time[3] ?? 0) < 60 &&
    Number.isFinite(Date.parse(value))
  );
}

export function parseCalendars(value: unknown): CalendarCategory[] {
  const location = "content/calendars.json";
  if (!Array.isArray(value) || !value.length)
    throw new Error(`${location}: se esperaba al menos un calendario.`);
  for (const category of value) {
    record(category, location);
    id(category.id, `${location}: id`);
    if (category.id === "task-deadlines")
      throw new Error(
        `${location}: task-deadlines está reservado para fechas de tareas.`,
      );
    text(category.name, `${location}: name`);
    if (!["blue", "green", "amber"].includes(String(category.color)))
      throw new Error(`${location}: color debe ser blue, green o amber.`);
  }
  const categories = value as CalendarCategory[];
  unique(categories, location);
  return categories;
}

export function parseEvents(
  value: unknown,
  categories: CalendarCategory[],
  allowedSlugs: string[],
): AdminEvent[] {
  const location = "content/events.json";
  if (!Array.isArray(value))
    throw new Error(`${location}: se esperaba una lista.`);
  for (const event of value) {
    record(event, location);
    id(event.id, `${location}: id`);
    const field = `${location}: ${event.id}`;
    text(event.title, `${field}.title`);
    if (!categories.some((category) => category.id === event.calendarId))
      throw new Error(`${field}.calendarId: calendario desconocido.`);
    if (typeof event.allDay !== "boolean")
      throw new Error(`${field}.allDay: usa true o false.`);
    if (event.allDay) {
      if (
        typeof event.start !== "string" ||
        !isDateOnly(event.start) ||
        (event.end !== undefined &&
          (typeof event.end !== "string" ||
            !isDateOnly(event.end) ||
            event.end <= event.start))
      )
        throw new Error(
          `${field}: fechas de día completo inválidas; end es exclusivo y posterior a start.`,
        );
    } else if (
      !isTimestamp(event.start) ||
      (event.end !== undefined &&
        (!isTimestamp(event.end) ||
          Date.parse(event.end) <= Date.parse(event.start)))
    )
      throw new Error(
        `${field}: usa fecha y hora ISO con zona; end debe ser posterior a start.`,
      );
    if (
      event.description !== undefined &&
      typeof event.description !== "string"
    )
      throw new Error(`${field}.description: se esperaba texto.`);
    documentReference(
      event.documentSlug,
      allowedSlugs,
      `${field}.documentSlug`,
    );
  }
  const events = value as AdminEvent[];
  unique(events, location);
  return events;
}

export function taskDeadlines(tasks: Task[]): CalendarItem[] {
  return tasks
    .filter((task) => task.dueDate && task.status !== "done")
    .map((task) => ({
      id: `task:${task.id}`,
      title: task.title,
      calendarId: "task-deadlines",
      allDay: true,
      start: task.dueDate!,
      description: task.description,
      documentSlug: task.documentSlug,
      taskId: task.id,
    }));
}

export function eventBounds(event: AdminEvent): { first: string; last: string } {
  return event.allDay
    ? {
        first: event.start,
        last: event.end ? addDays(event.end, -1) : event.start,
      }
    : {
        first: localDate(event.start),
        last: localDate(
          event.end ? new Date(Date.parse(event.end) - 1) : event.start,
        ),
      };
}
export function occursOn(event: AdminEvent, date: string): boolean {
  const { first, last } = eventBounds(event);
  return first <= date && date <= last;
}
export function compareEvents(a: CalendarItem, b: CalendarItem): number {
  const dayDifference = eventBounds(a).first.localeCompare(
    eventBounds(b).first,
  );
  if (dayDifference) return dayDifference;
  if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
  return (
    (!a.allDay ? Date.parse(a.start) - Date.parse(b.start) : 0) ||
    a.title.localeCompare(b.title, "es")
  );
}
export function eventsInMonth(
  events: CalendarItem[],
  month: string,
): CalendarItem[] {
  const first = `${month}-01`;
  const next = new Date(`${first}T12:00:00Z`);
  next.setUTCMonth(next.getUTCMonth() + 1);
  const end = next.toISOString().slice(0, 10);
  return events
    .filter((event) => {
      const bounds = eventBounds(event);
      return bounds.first < end && bounds.last >= first;
    })
    .toSorted(compareEvents);
}
