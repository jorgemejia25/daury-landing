"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarPlus, Plus, Settings2 } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { ActionMenu } from "@/ui/molecules/ActionMenu";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { financeOccurrences, money } from "@/features/admin/lib/finance";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import type { CalendarItem } from "@/features/admin/lib/planning";
import { CalendarView } from "../CalendarView";
import { eventHref, manageCalendarsHref, newCalendarHref, newEventHref } from "@/features/admin/lib/routes";
import { WorkspaceStatus } from "./WorkspaceParts";
import styles from "./Calendar.styles";

/** Calendarios compartidos: vista mes/agenda, creación de eventos y administración de calendarios. */
export function CalendarWorkspace({ today }: { today: string }) {
  const calendars = useWorkspace("calendars"), events = useWorkspace("events"), tasks = useWorkspace("tasks"), boards = useWorkspace("boards"), finance = useWorkspace("financeEntries");
  const { params } = useAdminQuery();
  const router = useRouter();
  const [actionError] = useState("");
  const active = calendars.items.filter((calendar) => !calendar.archived);
  const visibleEvents: CalendarItem[] = events.items
    .filter((event) => !event.archived && active.some((calendar) => calendar.id === event.calendarId))
    .map((event) => ({ ...event, attribution: event }));
  const deadlines: CalendarItem[] = tasks.items
    .filter((task) => {
      const board = boards.items.find((item) => item.id === task.boardId);
      return !task.archived && task.dueDate && board && !board.archived && !board.columns[task.status]?.done;
    })
    .map((task) => ({ id: `task:${task.id}`, taskId: task.id, boardId: task.boardId, title: task.title, calendarId: "task-deadlines", start: task.dueDate, allDay: true, articleId: task.articleId, attribution: task }));
  const selectedYear = Number((params.get("month") ?? today).slice(0, 4));
  const financialEvents: CalendarItem[] = [selectedYear - 1, selectedYear, selectedYear + 1].flatMap((year) => financeOccurrences(finance.items, year)).map((item) => ({ id: `finance:${item.entry.id}:${item.date}`, title: `${item.entry.title} · ${money(item.entry.amount, item.entry.currency)}${item.paid ? " ✓" : ""}`, calendarId: item.entry.kind === "expense" ? "finance-expense" : "finance-income", start: item.date, allDay: true, attribution: item.entry }));
  const openEditor = (id: string) => router.push(id.startsWith("finance:") ? `/admin/gastos/${id.split(":")[1]}` : eventHref(id));
  const createEvent = (date: string) => router.push(newEventHref(date));

  const actions = (
    <div className={styles.actions}>
      <Button variant="secondary" icon={<Settings2 size={16} strokeWidth={2.2} aria-hidden="true" />} render={<Link href={manageCalendarsHref()} />}>
        Calendarios
      </Button>
      <Button disabled={!active.length} icon={<Plus size={17} strokeWidth={2.4} aria-hidden="true" />} onClick={() => createEvent(today)}>
        Nuevo evento
      </Button>
      <ActionMenu
        label="Opciones de calendarios"
        onAction={(value) => {
          if (value === "calendar") router.push(newCalendarHref());
          if (value === "manage") router.push(manageCalendarsHref());
        }}
        actions={[
          { value: "calendar", label: "Nuevo calendario", icon: <CalendarPlus size={16} strokeWidth={2} aria-hidden="true" /> },
          { value: "manage", label: "Administrar calendarios", icon: <Settings2 size={16} strokeWidth={2} aria-hidden="true" /> },
        ]}
      />
    </div>
  );

  return (
    <section>
      <WorkspaceStatus loading={calendars.loading || events.loading} errors={[calendars.error, events.error, tasks.error, boards.error, finance.error, actionError]} />
      <CalendarView
        today={today}
        categories={[...active.map((calendar) => ({ id: calendar.id, name: calendar.name, color: calendar.color, attribution: calendar })), ...(finance.items.some((item) => !item.archived) ? [{ id: "finance-expense", name: "Egresos de Daury", color: "coral" as const }, { id: "finance-income", name: "Ingresos de Daury", color: "green" as const }] : [])]}
        events={[...visibleEvents, ...deadlines, ...financialEvents]}
        actions={actions}
        onOpenEvent={openEditor}
        onCreateDay={active.length ? createEvent : undefined}
        onManageCalendars={() => router.push(manageCalendarsHref())}
      />
      {!calendars.loading && !calendars.error && !active.length ? (
        <EmptyState
          icon={<CalendarPlus size={26} strokeWidth={2} />}
          tone="amber"
          title="Crea tu primer calendario"
          action={<Button render={<Link href={newCalendarHref()} />}>Nuevo calendario</Button>}
        >
          Un calendario por proyecto, campaña o equipo. Después podrás agregar eventos.
        </EmptyState>
      ) : null}

    </section>
  );
}
