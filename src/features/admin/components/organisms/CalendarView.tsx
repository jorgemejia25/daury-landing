"use client";

import { Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuItemIndicator, MenuSeparator, MenuTrigger } from "@ui-sdk/react/menu";
import { Tabs, TabsPanel } from "@ui-sdk/react/tabs";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Grid3x3, List, Plus, Settings2 } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { IconButton } from "@/ui/atoms/IconButton";
import { StatusDot } from "@/ui/atoms/StatusDot";
import type { Tone } from "@/ui/lib/tones";
import { Card } from "@/ui/molecules/Card";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { ScreenHeader } from "@/ui/molecules/ScreenHeader";
import { SegmentedTabs } from "@/ui/molecules/SegmentedTabs";
import { formatDate, isMonth, monthDays, shiftMonth } from "@/features/admin/lib/dates";
import { compareEvents, eventBounds, eventsInMonth, occursOn, type CalendarCategory, type CalendarItem } from "@/features/admin/lib/planning";
import { calendarTone } from "@/features/admin/lib/presentation";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import { EventItem } from "./EventItem";
import { SelectBox } from "../molecules/BulkBar";
import { useSelection } from "@/features/admin/hooks/useSelection";
import styles from "./CalendarView.styles";

const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
export const deadlineCategory: CalendarCategory = { id: "task-deadlines", name: "Fechas de tareas", color: "coral" };
export const toneFor = (category: CalendarCategory): Tone => calendarTone(category.color);

type CalendarViewProps = {
  categories: CalendarCategory[];
  events: CalendarItem[];
  today: string;
  /** Acciones a la derecha del encabezado (crear evento, menú). */
  actions?: React.ReactNode;
  /** Abre un evento a pantalla completa. */
  onOpenEvent?: (id: string) => void;
  onCreateDay?: (date: string) => void;
  /** Abre la administración de calendarios desde el menú de calendarios. */
  onManageCalendars?: () => void;
  /** Barra de acciones masivas para los eventos seleccionados en la agenda. */
  bulk?: (selection: ReturnType<typeof useSelection>) => React.ReactNode;
};

/** Solo los eventos propios se seleccionan; fechas de tareas y movimientos de gastos no. */
const selectable = (event: CalendarItem) => !event.taskId && !event.id.includes(":");

/** Calendarios con vistas mes y agenda, navegación por meses y filtro de calendarios (estado en la URL). */
export function CalendarView({ categories: sourceCategories, events, today, actions, onOpenEvent, onCreateDay, onManageCalendars, bulk }: CalendarViewProps) {
  const categories = [...sourceCategories, deadlineCategory];
  const { params, update } = useAdminQuery();
  const monthParam = params.get("month") ?? "";
  const month = isMonth(monthParam) ? monthParam : today.slice(0, 7);
  const view = params.get("view") === "agenda" ? "agenda" : "month";
  const ids = params.get("calendars");
  const selected = ids === null ? categories.map((category) => category.id) : ids.split(",").filter((id) => categories.some((category) => category.id === id));
  const activeEvents = events.filter((event) => selected.includes(event.calendarId)).toSorted(compareEvents);
  const visibleEvents = eventsInMonth(activeEvents, month);
  const days = monthDays(month);
  const label = formatDate(`${month}-01`, { month: "long", year: "numeric" });
  const categoryFor = (id: string) => categories.find((category) => category.id === id) ?? deadlineCategory;
  const agendaStart = (event: CalendarItem) => {
    const first = eventBounds(event).first;
    return first < `${month}-01` ? `${month}-01` : first;
  };
  const agendaDays = [...new Set(visibleEvents.map(agendaStart))].sort();
  const selection = useSelection(bulk && view === "agenda" ? visibleEvents.filter(selectable).map((event) => event.id) : []);
  const openOrToggle = (id: string) => (selection.count ? selection.toggle(id) : onOpenEvent?.(id));
  const filterLabel = selected.length === categories.length ? "Todos los calendarios" : selected.length === 0 ? "Ningún calendario" : `${selected.length} de ${categories.length} calendarios`;

  function toggle(id: string, checked: boolean) {
    const next = checked ? [...selected, id] : selected.filter((value) => value !== id);
    update({ calendars: next.length === categories.length ? null : next.join(",") || "-" });
  }

  return (
    <section>
      <ScreenHeader eyebrow="Calendarios" title="Agenda del equipo" subtitle="Hitos, reuniones, contenido y fechas límite en un solo lugar." right={actions} />
      <Tabs value={view} onValueChange={(value) => update({ view: value === "agenda" ? "agenda" : null })}>
        <div className={styles.toolbar}>
          <div className={styles.monthControls}>
            <IconButton variant="soft" aria-label="Mes anterior" onClick={() => update({ month: shiftMonth(month, -1) })}>
              <ChevronLeft size={17} strokeWidth={2.2} aria-hidden="true" />
            </IconButton>
            <Button variant="secondary" size="sm" onClick={() => update({ month: null })}>Hoy</Button>
            <IconButton variant="soft" aria-label="Mes siguiente" onClick={() => update({ month: shiftMonth(month, 1) })}>
              <ChevronRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </IconButton>
            <h2 className={styles.monthLabel} aria-live="polite">{label}</h2>
          </div>
          <div className={styles.toolbarEnd}>
            <Menu
              onCheckedChange={(checked, details) => toggle(details.value, checked)}
              onAction={(value) => {
                if (value === "all") update({ calendars: null });
                if (value === "manage") onManageCalendars?.();
              }}
            >
              <MenuTrigger className={styles.filterTrigger} aria-label={`Calendarios visibles: ${filterLabel}`}>
                <span className={styles.filterDots} aria-hidden="true">
                  {categories.filter((category) => selected.includes(category.id)).slice(0, 4).map((category) => <StatusDot key={category.id} tone={toneFor(category)} size={8} />)}
                </span>
                {filterLabel}
                <ChevronDown size={15} strokeWidth={2.2} aria-hidden="true" />
              </MenuTrigger>
              <MenuContent className={styles.filterMenu} align="end" sideOffset={6}>
                <MenuGroup>
                  <MenuGroupLabel className={styles.menuLabel}>Calendarios</MenuGroupLabel>
                  {categories.map((category) => (
                    <MenuCheckboxItem key={category.id} value={category.id} checked={selected.includes(category.id)} className={styles.menuItem} data-tone={toneFor(category)}>
                      <span className={styles.menuCheck}>
                        <MenuItemIndicator keepMounted>
                          <Check size={14} strokeWidth={3} aria-hidden="true" />
                        </MenuItemIndicator>
                      </span>
                      {category.name}
                    </MenuCheckboxItem>
                  ))}
                </MenuGroup>
                <MenuSeparator className={styles.menuSeparator} />
                <MenuItem value="all" className={styles.menuItem} disabled={selected.length === categories.length}>Mostrar todos</MenuItem>
                {onManageCalendars ? (
                  <MenuItem value="manage" className={styles.menuItem}>
                    <Settings2 size={17} strokeWidth={2.2} aria-hidden="true" />
                    Administrar calendarios
                  </MenuItem>
                ) : null}
              </MenuContent>
            </Menu>
            <SegmentedTabs
              label="Vista del calendario"
              options={[
                { value: "month", label: "Mes", icon: <Grid3x3 size={15} strokeWidth={2.2} aria-hidden="true" /> },
                { value: "agenda", label: "Agenda", icon: <List size={15} strokeWidth={2.2} aria-hidden="true" /> },
              ]}
            />
          </div>
        </div>

        <TabsPanel value="month">
          {selected.length === 0 ? (
            <div className={styles.notice} role="status">
              <span>No hay calendarios seleccionados</span>
              <Button variant="text" size="sm" onClick={() => update({ calendars: null })}>Mostrar todos</Button>
            </div>
          ) : null}
          <Card padding="none" className={styles.monthScroll}>
            <table className={styles.month}>
              <caption className="sr-only">Eventos de {label}</caption>
              <thead>
                <tr>{weekdays.map((day) => <th scope="col" key={day}>{day}</th>)}</tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }, (_, row) => (
                  <tr key={days[row * 7]}>
                    {days.slice(row * 7, row * 7 + 7).map((date) => (
                      <td key={date} data-outside={date.slice(0, 7) !== month ? true : undefined} data-today={date === today || undefined} data-weekend={[5, 6].includes(days.indexOf(date) % 7) || undefined}>
                        <div className={styles.dayHead}>
                          <time dateTime={date} aria-current={date === today ? "date" : undefined} className={styles.dayNumber}>
                            {Number(date.slice(-2))}
                          </time>
                          {onCreateDay ? (
                            <button type="button" className={styles.addDay} aria-label={`Crear evento el ${formatDate(date)}`} onClick={() => onCreateDay(date)}>
                              <Plus size={14} strokeWidth={2.4} aria-hidden="true" />
                            </button>
                          ) : null}
                        </div>
                        <div className={styles.dayEvents}>
                          {activeEvents.filter((event) => occursOn(event, date)).map((event) => {
                            const category = categoryFor(event.calendarId);
                            return <EventItem key={event.id} event={event} onOpen={onOpenEvent} category={category} tone={toneFor(category)} date={date} compact />;
                          })}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsPanel>

        <TabsPanel value="agenda">
          {visibleEvents.length === 0 ? (
            <Card padding="lg">
              <EmptyState
                icon={<CalendarDays size={26} strokeWidth={2} />}
                tone="amber"
                title={selected.length === 0 ? "No hay calendarios seleccionados" : `No hay eventos en ${label}`}
                action={
                  selected.length === 0 ? (
                    <Button variant="secondary" onClick={() => update({ calendars: null })}>Mostrar todos</Button>
                  ) : onCreateDay ? (
                    <Button icon={<Plus size={17} strokeWidth={2.4} aria-hidden="true" />} onClick={() => onCreateDay(month === today.slice(0, 7) ? today : `${month}-01`)}>Crear evento</Button>
                  ) : undefined
                }
              >
                {selected.length === 0 ? "Elige al menos un calendario en el filtro." : "Cambia de mes con las flechas o elige otro calendario."}
              </EmptyState>
            </Card>
          ) : null}
          <ol className={`m-0 p-0 list-none ${styles.agenda}`} aria-label={`Agenda de ${label}`} hidden={visibleEvents.length === 0}>
            {agendaDays.map((date) => {
              const dayEvents = visibleEvents.filter((event) => agendaStart(event) === date);
              return (
                <li key={date} className={styles.agendaDay} data-today={date === today || undefined} data-past={date < today || undefined}>
                  <div className={styles.dateTile}>
                    <span>{formatDate(date, { weekday: "short" }).replace(".", "")}</span>
                    <b>{Number(date.slice(-2))}</b>
                  </div>
                  <div className={styles.agendaEvents}>
                    <h3 className={styles.agendaHeading}>
                      <time dateTime={date}>{date === today ? "Hoy" : formatDate(date, { weekday: "long", day: "numeric", month: "long" })}</time>
                      <span>{dayEvents.length} {dayEvents.length === 1 ? "evento" : "eventos"}</span>
                    </h3>
                    <Card padding="none">
                      {dayEvents.map((event, index) => {
                        const category = categoryFor(event.calendarId);
                        if (!bulk) return <EventItem key={event.id} event={event} onOpen={onOpenEvent} category={category} tone={toneFor(category)} date={date} divider={index > 0} />;
                        if (!selectable(event)) return <div key={event.id} className="flex items-center min-w-0 [&>.tw-EventItem-6006-row]:flex-1 [&>.tw-EventItem-6006-row]:min-w-0" style={{ borderTop: index > 0 ? "1px solid var(--rule)" : undefined }}><span className="w-[18px] ml-[16px] flex-none" aria-hidden="true" /><EventItem event={event} onOpen={onOpenEvent} category={category} tone={toneFor(category)} date={date} /></div>;
                        const checked = selection.has(event.id);
                        return (
                          <div key={event.id} className="flex items-center min-w-0 [&>.tw-EventItem-6006-row]:flex-1 [&>.tw-EventItem-6006-row]:min-w-0" style={{ borderTop: index > 0 ? "1px solid var(--rule)" : undefined, background: checked ? "var(--blue-soft)" : undefined }}>
                            <SelectBox checked={checked} onChange={() => selection.toggle(event.id)} label={`Seleccionar ${event.title}`} className="ml-[16px]" />
                            <EventItem event={event} onOpen={openOrToggle} category={category} tone={toneFor(category)} date={date} />
                          </div>
                        );
                      })}
                    </Card>
                  </div>
                </li>
              );
            })}
          </ol>
        </TabsPanel>
      </Tabs>
      {bulk?.(selection)}

    </section>
  );
}
