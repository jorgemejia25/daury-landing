"use client";

import Link from "next/link";
import { eventHref, taskHref } from "@/features/admin/lib/routes";
import { AlertTriangle, CalendarDays, CircleCheck, FileText, ListTodo, SquareKanban, UserRound } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { Chip } from "@/ui/atoms/Chip";
import { IconTile } from "@/ui/atoms/IconTile";
import { StatusDot } from "@/ui/atoms/StatusDot";
import { ScreenHeader } from "@/ui/molecules/ScreenHeader";
import { Panel } from "@/ui/molecules/Panel";
import { StatTile } from "@/ui/molecules/StatTile";
import { BarList } from "@/ui/organisms/charts/BarList";
import { ColumnChart } from "@/ui/organisms/charts/ColumnChart";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { addDays, formatDate, formatTime, localDate } from "@/features/admin/lib/dates";
import { personName } from "@/features/admin/lib/people";
import { calendarTone } from "@/features/admin/lib/presentation";
import { dueState, priorityMeta } from "@/features/admin/components/organisms/workspace/TaskCard";
import { WorkspaceStatus } from "@/features/admin/components/organisms/workspace/WorkspaceParts";
import styles from "./AdminHome.styles";

type AdminHomeProps = { firstName: string; email: string; today: string; todayLabel: string };

/** Inicio: resumen del trabajo del equipo con cifras, avance por tablero, actividad, pendientes y próximos eventos. */
export function AdminHome({ firstName, email, today, todayLabel }: AdminHomeProps) {
  const boards = useWorkspace("boards"), tasks = useWorkspace("tasks"), events = useWorkspace("events"), calendars = useWorkspace("calendars"), pages = useWorkspace("wikiPages");
  const activeBoards = boards.items.filter((board) => !board.archived);
  const boardOf = (id: string) => activeBoards.find((board) => board.id === id);
  const liveTasks = tasks.items.filter((task) => !task.archived && boardOf(task.boardId));
  const isDone = (task: (typeof liveTasks)[number]) => Boolean(boardOf(task.boardId)?.columns[task.status]?.done);
  const open = liveTasks.filter((task) => !isDone(task));
  const mine = open.filter((task) => task.assignee === email);
  const overdue = open.filter((task) => task.dueDate && task.dueDate < today);
  const weekEnd = addDays(today, 7);
  const activeCalendars = calendars.items.filter((calendar) => !calendar.archived);
  const upcoming = events.items
    .filter((event) => !event.archived && activeCalendars.some((calendar) => calendar.id === event.calendarId))
    .filter((event) => localDate(event.start) >= today || (event.allDay && event.end > today))
    .toSorted((a, b) => a.start.localeCompare(b.start));
  const thisWeek = upcoming.filter((event) => localDate(event.start) < weekEnd).length;
  const pending = (mine.length ? mine : open)
    .toSorted((a, b) => (a.dueDate || "9999").localeCompare(b.dueDate || "9999") || ["high", "medium", "low"].indexOf(a.priority) - ["high", "medium", "low"].indexOf(b.priority))
    .slice(0, 6);
  const recent = pages.items.filter((page) => !page.archived).toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);
  const activity = Array.from({ length: 14 }, (_, index) => {
    const date = addDays(today, index - 13);
    return {
      key: date,
      label: formatDate(date, { weekday: "long", day: "numeric", month: "long" }),
      short: formatDate(date, { day: "numeric" }),
      value: liveTasks.filter((task) => localDate(task.createdAt) === date).length,
    };
  });
  const loading = boards.loading || tasks.loading || events.loading;

  return (
    <div className={styles.home}>
      <ScreenHeader
        eyebrow={todayLabel}
        title={`Hola, ${firstName}`}
        subtitle="Esto es lo que está pasando en Daury."
        right={
          <div className={styles.quick}>
            <Button variant="secondary" size="md" render={<Link href="/admin/calendarios" />} icon={<CalendarDays size={17} strokeWidth={2.2} aria-hidden="true" />}>Calendario</Button>
            <Button size="md" render={<Link href="/admin/kanban" />} icon={<SquareKanban size={17} strokeWidth={2.2} aria-hidden="true" />}>Tableros</Button>
          </div>
        }
      />
      <WorkspaceStatus loading={loading} errors={[boards.error, tasks.error, events.error, calendars.error, pages.error]} />

      <div className={styles.stats}>
        <StatTile label="Abiertas" value={open.length} note={`${liveTasks.length - open.length} completadas en total`} icon={<ListTodo size={20} strokeWidth={2.2} />} tone="blue" href="/admin/kanban" />
        <StatTile label="Para ti" value={mine.length} note={mine.length ? "Tareas asignadas a tu cuenta" : "No tienes tareas asignadas"} icon={<UserRound size={20} strokeWidth={2.2} />} tone="violet" href={`/admin/kanban?assignee=${encodeURIComponent(email)}`} />
        <StatTile label="Vencidas" value={overdue.length} alert={overdue.length > 0} note={overdue.length ? "Revisa sus fechas límite" : "Todo a tiempo"} icon={<AlertTriangle size={20} strokeWidth={2.2} />} tone={overdue.length ? "coral" : "green"} href="/admin/kanban?sort=due" />
        <StatTile label="Esta semana" value={thisWeek} note={thisWeek === 1 ? "evento en los próximos 7 días" : "eventos en los próximos 7 días"} icon={<CalendarDays size={20} strokeWidth={2.2} />} tone="amber" href="/admin/calendarios?view=agenda" />
      </div>

      <div className={styles.grid}>
        <Panel title="Avance por tablero" note={<>Tareas en columnas completadas sobre el total.</>}>
          {activeBoards.length ? (
            <BarList
              measure="Avance por tablero"
              max={100}
              tone="green"
              data={activeBoards.map((board) => {
                const list = liveTasks.filter((task) => task.boardId === board.id);
                const done = list.filter(isDone).length;
                return { key: board.id, label: board.name, value: list.length ? Math.round((done / list.length) * 100) : 0, display: `${done} de ${list.length}` };
              })}
            />
          ) : <p className={styles.empty}>Todavía no hay tableros.</p>}
        </Panel>
        <Panel title="Tareas creadas" note={<>Últimos 14 días.</>}>
          <ColumnChart measure="Tareas creadas" data={activity} labelEvery={3} />
        </Panel>
        <Panel title="Abiertas por prioridad" note={<>{open.length} {open.length === 1 ? "tarea abierta" : "tareas abiertas"}.</>}>
          <BarList
            measure="Tareas abiertas por prioridad"
            max={Math.max(1, open.length)}
            data={(["high", "medium", "low"] as const).map((priority) => ({ key: priority, label: priorityMeta[priority].label, value: open.filter((task) => task.priority === priority).length, tone: priorityMeta[priority].tone }))}
          />
        </Panel>
      </div>

      <div className={styles.lists}>
        <Panel id="home-pending" title={mine.length ? "Tus pendientes" : "Pendientes del equipo"} action={<Button variant="text" size="sm" render={<Link href="/admin/kanban" />}>Ver tablero</Button>} padding="none">
          <ul className={"m-0 p-0 list-none"}>
            {pending.map((task, index) => {
              const due = dueState(task.dueDate, today, false);
              return (
                <li key={task.id} data-divider={index > 0 || undefined} className={styles.row}>
                  <Link href={taskHref(task.id)} className={styles.rowLink}>
                    <StatusDot tone={priorityMeta[task.priority].tone} size={10} />
                    <span className={styles.rowText}>
                      <b>{task.title}</b>
                      <small>{boardOf(task.boardId)?.name} · {task.assignee ? personName(task.assignee) : "Sin asignar"}</small>
                    </span>
                    {due ? <Chip size="sm" tone={due.tone}>{due.label}</Chip> : null}
                  </Link>
                </li>
              );
            })}
            {!pending.length ? (
              <li className={styles.none}>
                <CircleCheck size={20} strokeWidth={2.2} aria-hidden="true" />
                {loading ? "Cargando tareas…" : "No hay tareas pendientes."}
              </li>
            ) : null}
          </ul>
        </Panel>

        <Panel id="home-events" title="Próximos eventos" action={<Button variant="text" size="sm" render={<Link href="/admin/calendarios?view=agenda" />}>Ver agenda</Button>} padding="none">
          <ul className={"m-0 p-0 list-none"}>
            {upcoming.slice(0, 5).map((event, index) => {
              const calendar = activeCalendars.find((item) => item.id === event.calendarId);
              const date = event.allDay ? (event.start < today ? today : event.start) : localDate(event.start);
              return (
                <li key={event.id} data-divider={index > 0 || undefined} className={styles.row}>
                  <Link href={eventHref(event.id)} className={styles.rowLink}>
                    <span className={styles.dateTile} data-today={date === today || undefined}>
                      <span>{formatDate(date, { month: "short" }).replace(".", "")}</span>
                      <b>{Number(date.slice(-2))}</b>
                    </span>
                    <span className={styles.rowText}>
                      <b>{event.title}</b>
                      <small>{event.allDay ? "Todo el día" : `${formatTime(event.start)} – ${formatTime(event.end)}`}</small>
                    </span>
                    {calendar ? <Chip size="sm" tone={calendarTone(calendar.color)}>{calendar.name}</Chip> : null}
                  </Link>
                </li>
              );
            })}
            {!upcoming.length ? (
              <li className={styles.none}>
                <CalendarDays size={20} strokeWidth={2.2} aria-hidden="true" />
                {events.loading ? "Cargando eventos…" : "No hay eventos próximos."}
              </li>
            ) : null}
          </ul>
        </Panel>

        <Panel id="home-articles" title="Artículos recientes" action={<Button variant="text" size="sm" render={<Link href="/admin/documentacion" />}>Ver todo</Button>} padding="none">
          <ul className={"m-0 p-0 list-none"}>
            {recent.map((page, index) => (
              <li key={page.id} data-divider={index > 0 || undefined} className={styles.row}>
                <Link href={`/admin/articulos/${page.id}`} className={styles.rowLink}>
                  <IconTile tone="blue" size={32}><FileText size={16} strokeWidth={2.2} /></IconTile>
                  <span className={styles.rowText}>
                    <b>{page.title}</b>
                    <small>{personName(page.updatedBy)} · {formatDate(localDate(page.updatedAt), { day: "numeric", month: "short" })}</small>
                  </span>
                </Link>
              </li>
            ))}
            {!recent.length ? (
              <li className={styles.none}>
                <FileText size={20} strokeWidth={2.2} aria-hidden="true" />
                {pages.loading ? "Cargando artículos…" : "Aún no hay artículos."}
              </li>
            ) : null}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
