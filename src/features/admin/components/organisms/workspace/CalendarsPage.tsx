"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Archive, ArchiveRestore, CalendarDays, CalendarPlus, ChevronLeft, Pencil } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { IconButton } from "@/ui/atoms/IconButton";
import { StatusDot } from "@/ui/atoms/StatusDot";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { Panel } from "@/ui/molecules/Panel";
import { ScreenHeader } from "@/ui/molecules/ScreenHeader";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { formatDate, localDate } from "@/features/admin/lib/dates";
import { personName } from "@/features/admin/lib/people";
import { calendarTone } from "@/features/admin/lib/presentation";
import { editCalendarHref, newCalendarHref } from "@/features/admin/lib/routes";
import { CollectionForm } from "../editors/CollectionForm";
import { toggleArchive, WorkspaceStatus } from "./WorkspaceParts";
import styles from "./Calendar.styles";

const back = "/admin/calendarios";

/** Administración de calendarios: activos, con su número de eventos, y archivados para restaurar. */
export function CalendarsManagePage() {
  const calendars = useWorkspace("calendars"), events = useWorkspace("events");
  const [error, setError] = useState("");
  const active = calendars.items.filter((item) => !item.archived).toSorted((a, b) => a.name.localeCompare(b.name, "es"));
  const archivedCalendars = calendars.items.filter((item) => item.archived);
  const archivedEvents = events.items.filter((item) => item.archived);
  const count = (id: string) => events.items.filter((event) => event.calendarId === id && !event.archived).length;

  return (
    <section className={styles.manage}>
      <ScreenHeader
        back={<IconButton variant="soft" aria-label="Volver a calendarios" render={<Link href={back} />}><ChevronLeft size={18} aria-hidden="true" /></IconButton>}
        eyebrow="Calendarios"
        title="Administrar calendarios"
        subtitle="Cada proyecto, campaña o equipo puede tener su propio calendario y color."
        right={<Button icon={<CalendarPlus size={16} aria-hidden="true" />} render={<Link href={newCalendarHref()} />}>Nuevo calendario</Button>}
      />
      <WorkspaceStatus loading={calendars.loading || events.loading} errors={[calendars.error, events.error, error]} />
      <Panel title="Activos" action={active.length} padding="none">
        {active.length ? (
          <ul className={"m-0 p-0 list-none"}>
            {active.map((calendar) => (
              <li key={calendar.id} className={styles.calendarRow}>
                <StatusDot tone={calendarTone(calendar.color)} size={10} />
                <Link href={editCalendarHref(calendar.id)} className={styles.calendarName}>
                  <b>{calendar.name}</b>
                  <small>{calendar.description || "Sin descripción"}</small>
                </Link>
                <span className={styles.calendarMeta}>{count(calendar.id)} {count(calendar.id) === 1 ? "evento" : "eventos"}</span>
                <span className={styles.calendarMeta}>{personName(calendar.createdBy)} · {formatDate(localDate(calendar.createdAt), { day: "numeric", month: "short" })}</span>
                <IconButton variant="plain" aria-label={`Editar ${calendar.name}`} render={<Link href={editCalendarHref(calendar.id)} />}>
                  <Pencil size={15} strokeWidth={2.2} aria-hidden="true" />
                </IconButton>
                <IconButton variant="plain" aria-label={`Archivar ${calendar.name}`} onClick={async () => setError(await toggleArchive("calendars", calendar))}>
                  <Archive size={15} strokeWidth={2.2} aria-hidden="true" />
                </IconButton>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={<CalendarDays size={24} aria-hidden="true" />} tone="amber" title="No hay calendarios activos">Crea uno para empezar a agregar eventos.</EmptyState>
        )}
      </Panel>
      {archivedCalendars.length || archivedEvents.length ? (
        <Panel title="Archivados" action={archivedCalendars.length + archivedEvents.length} padding="none">
          <ul className={"m-0 p-0 list-none"}>
            {[...archivedCalendars.map((item) => ({ kind: "calendars" as const, item, name: item.name, label: "Calendario" })), ...archivedEvents.map((item) => ({ kind: "events" as const, item, name: item.title, label: "Evento" }))].map(({ kind, item, name, label }) => (
              <li key={item.id} className={styles.calendarRow}>
                <span className={styles.calendarName}><b>{name}</b><small>{label}</small></span>
                <Button variant="secondary" size="sm" icon={<ArchiveRestore size={14} aria-hidden="true" />} onClick={async () => setError(await toggleArchive(kind, item))}>Restaurar</Button>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </section>
  );
}

/** Página para crear o editar un calendario. */
export function CalendarFormPage({ id }: { id?: string }) {
  const router = useRouter();
  const calendars = useWorkspace("calendars");
  const calendar = id ? calendars.items.find((item) => item.id === id) : undefined;
  if (calendars.loading || calendars.error) return <WorkspaceStatus loading={calendars.loading} errors={[calendars.error]} />;
  if (id && (!calendar || calendar.archived)) {
    return (
      <EmptyState icon={<CalendarDays size={24} aria-hidden="true" />} tone="amber" title={calendar?.archived ? "Este calendario está archivado" : "Este calendario no existe"} action={<Button variant="secondary" render={<Link href={back} />}>Ir a calendarios</Button>}>
        Restáuralo desde Administrar calendarios o revisa el enlace.
      </EmptyState>
    );
  }
  return <CollectionForm key={calendar?.id ?? "new"} kind="calendars" initial={calendar} onClose={() => router.push(back)} onSaved={() => router.push(back)} />;
}
