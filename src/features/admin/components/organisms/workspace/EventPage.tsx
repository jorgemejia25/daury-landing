"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, CalendarDays } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { Skeleton } from "@/ui/atoms/Skeleton";
import { ActionMenu } from "@/ui/molecules/ActionMenu";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { useWorkspace, useWorkspaceDocument } from "@/features/admin/hooks/useWorkspace";
import { localDate } from "@/features/admin/lib/dates";
import { eventHref } from "@/features/admin/lib/routes";
import { EventForm } from "../editors/EventForm";
import { toggleArchive, WorkspaceStatus } from "./WorkspaceParts";


type EventPageProps = { id?: string; date?: string; meeting?: boolean };

/** Página de un evento (o de uno nuevo) dentro del shell, con anterior y siguiente por fecha. */
export function EventPage({ id, date, meeting }: EventPageProps) {
  const router = useRouter();
  const calendars = useWorkspace("calendars"), events = useWorkspace("events");
  const current = useWorkspaceDocument("events", id ?? null);
  const event = current.item;
  const active = calendars.items.filter((calendar) => !calendar.archived);
  const backHref = (month?: string) => `/admin/calendarios${month ? `?month=${month}` : ""}`;

  if (calendars.loading || current.loading || (id && events.loading)) {
    return (
      <div role="status" aria-label="Cargando evento"  className={"flex! flex-col! [gap:16px]!"}>
        <Skeleton height={64} radius={24} />
        <Skeleton height={44} width="50%" />
        <Skeleton height={220} radius={24} />
      </div>
    );
  }
  if (calendars.error || current.error) return <WorkspaceStatus loading={false} errors={[calendars.error, current.error]} />;
  if ((id && !event) || !active.length) {
    return (
      <EmptyState
        icon={<CalendarDays size={26} strokeWidth={2} />}
        tone="amber"
        title={id ? "Este evento no existe" : "Primero crea un calendario"}
        action={<Button variant="secondary" render={<Link href="/admin/calendarios" />}>Ir a los calendarios</Button>}
      >
        {id ? "Puede que se haya archivado o que el enlace esté incompleto." : "Los eventos se guardan dentro de un calendario."}
      </EmptyState>
    );
  }

  const list = events.items
    .filter((item) => !item.archived && active.some((calendar) => calendar.id === item.calendarId))
    .toSorted((a, b) => a.start.localeCompare(b.start));
  const index = event ? list.findIndex((item) => item.id === event.id) : -1;
  const month = (event ? localDate(event.start) : date ?? "").slice(0, 7);

  return (
    <EventForm
      key={event?.id ?? "new"}
      initial={event ?? undefined}
      calendars={calendars.items}
      defaults={{ date, meeting }}
      nav={
        event && index >= 0
          ? {
              noun: "evento",
              index: index + 1,
              total: list.length,
              onPrevious: index > 0 ? () => router.replace(eventHref(list[index - 1].id)) : undefined,
              onNext: index < list.length - 1 ? () => router.replace(eventHref(list[index + 1].id)) : undefined,
            }
          : undefined
      }
      actions={
        event ? (
          <ActionMenu
            label="Opciones del evento"
            onAction={async (value) => {
              if (value !== "archive") return;
              const error = await toggleArchive("events", event);
              if (!error) router.push(backHref(month));
            }}
            actions={[{ value: "archive", label: "Archivar evento", icon: <Archive size={17} strokeWidth={2} aria-hidden="true" />, danger: true }]}
          />
        ) : undefined
      }
      onClose={() => router.push(backHref(month))}
      onSaved={(savedId) => { if (!event) router.replace(eventHref(savedId)); }}
    />
  );
}
