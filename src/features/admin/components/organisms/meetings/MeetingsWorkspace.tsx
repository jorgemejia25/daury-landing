"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Tabs, TabsPanel } from "@ui-sdk/react/tabs";
import { CalendarClock, History, MessagesSquare, Plus, Video } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { Chip } from "@/ui/atoms/Chip";
import { Skeleton } from "@/ui/atoms/Skeleton";
import { StatusDot } from "@/ui/atoms/StatusDot";
import { Card } from "@/ui/molecules/Card";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { SearchField } from "@/ui/molecules/SearchField";
import { SegmentedTabs } from "@/ui/molecules/SegmentedTabs";
import { useWorkspace } from "@/features/admin/hooks/useWorkspace";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import { isMeetingEvent, meetingPhase } from "@/features/admin/lib/meetings";
import { safeMeetUrl } from "@/features/admin/lib/meet";
import { calendarTone } from "@/features/admin/lib/presentation";
import { meetingHref, newEventHref } from "@/features/admin/lib/routes";
import { normalizeText } from "@/features/admin/lib/text";
import type { Entity } from "@/features/admin/lib/workspace";
import { WorkspaceStatus } from "../workspace/WorkspaceParts";
import { DateTile, PhaseChip, meetingStyles as styles, relativeLabel, whenLabel } from "./MeetingParts";

/** Hora actual que se actualiza cada minuto (para "Empieza en…" y el paso a "En curso"). */
export function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(timer); }, []);
  return now;
}

/** Reuniones: los eventos marcados como reunión, próximas y pasadas, con sus preguntas abiertas. */
export function MeetingsWorkspace() {
  const events = useWorkspace("events"), calendars = useWorkspace("calendars"), questions = useWorkspace("meetingQuestions");
  const { params, update } = useAdminQuery(), now = useNow();
  const q = params.get("q") ?? "", view = params.get("view") === "past" ? "past" : "upcoming";
  const loading = events.loading || calendars.loading;

  const meetings = useMemo(() => {
    const active = new Map(calendars.items.filter((calendar) => !calendar.archived).map((calendar) => [calendar.id, calendar]));
    const words = normalizeText(q);
    return events.items
      .filter((event) => !event.archived && active.has(event.calendarId) && isMeetingEvent(event))
      .filter((event) => normalizeText(`${event.title} ${event.description} ${active.get(event.calendarId)?.name ?? ""}`).includes(words))
      .map((event) => ({ event, calendar: active.get(event.calendarId)!, phase: meetingPhase(event, now) }));
  }, [events.items, calendars.items, q, now]);
  const openQuestions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of questions.items) if (!item.archived && !item.resolved) counts.set(item.eventId, (counts.get(item.eventId) ?? 0) + 1);
    return counts;
  }, [questions.items]);
  const upcoming = meetings.filter((item) => item.phase !== "past").toSorted((a, b) => a.event.start.localeCompare(b.event.start));
  const past = meetings.filter((item) => item.phase === "past").toSorted((a, b) => b.event.start.localeCompare(a.event.start));

  const list = (items: typeof meetings, empty: string) => items.length ? (
    <Card padding="none">
      <ul className={styles.list} aria-label={view === "past" ? "Reuniones pasadas" : "Próximas reuniones"}>
        {items.map(({ event, calendar, phase }) => <MeetingRow key={event.id} event={event} calendar={calendar} phase={phase} now={now} questions={openQuestions.get(event.id) ?? 0} />)}
      </ul>
    </Card>
  ) : (
    <EmptyState icon={<Video size={26} strokeWidth={2} />} tone="green" title={q ? "Sin coincidencias" : empty}
      action={q ? <Button variant="secondary" onClick={() => update({ q: null })}>Quitar búsqueda</Button> : <Button icon={<Plus size={18} aria-hidden="true" />} render={<Link href={newEventHref(undefined, true)} />}>Programar reunión</Button>}>
      {q ? "Prueba con otras palabras." : "Crea un evento en el calendario y activa «Es una reunión» para prepararla aquí."}
    </EmptyState>
  );

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Reuniones</h1>
        <div className={styles.actions}>
          <Button variant="secondary" render={<Link href="/admin/calendarios" />}>Ver calendario</Button>
          <Button icon={<Plus size={18} aria-hidden="true" />} render={<Link href={newEventHref(undefined, true)} />}>Programar reunión</Button>
        </div>
      </header>
      <WorkspaceStatus loading={false} errors={[events.error, calendars.error]} />
      {loading ? (
        <div role="status" aria-label="Cargando reuniones" className="flex flex-col gap-[12px]">
          <Skeleton height={44} radius={14} width="50%" />
          <Skeleton height={260} radius={24} />
        </div>
      ) : (
        <Tabs value={view} onValueChange={(value) => update({ view: value === "past" ? "past" : null })}>
          <div className="flex items-center justify-between gap-[12px] flex-wrap mb-[14px]">
            <SegmentedTabs label="Reuniones" options={[
              { value: "upcoming", label: upcoming.length ? `Próximas · ${upcoming.length}` : "Próximas", icon: <CalendarClock size={16} aria-hidden="true" /> },
              { value: "past", label: past.length ? `Pasadas · ${past.length}` : "Pasadas", icon: <History size={16} aria-hidden="true" /> },
            ]} />
            <div className="w-[min(340px,100%)]"><SearchField aria-label="Buscar reuniones" placeholder="Buscar por nombre o calendario…" value={q} onValueChange={(value) => update({ q: value || null })} /></div>
          </div>
          <TabsPanel value="upcoming" className="min-w-0 focus:outline-none">{list(upcoming, "No hay reuniones programadas")}</TabsPanel>
          <TabsPanel value="past" className="min-w-0 focus:outline-none">{list(past, "Todavía no hay reuniones pasadas")}</TabsPanel>
        </Tabs>
      )}
    </section>
  );
}

function MeetingRow({ event, calendar, phase, now, questions }: { event: Entity<"events">; calendar: Entity<"calendars">; phase: ReturnType<typeof meetingPhase>; now: number; questions: number }) {
  const tone = calendarTone(calendar.color), meet = safeMeetUrl(event.meetUrl);
  return (
    <li className={styles.row}>
      <DateTile event={event} tone={tone} />
      <div className={styles.rowInfo}>
        <Link href={meetingHref(event.id)}>{event.title}</Link>
        <small>{whenLabel(event)}{event.allDay || phase === "past" ? "" : `, ${relativeLabel(event, now).toLowerCase()}`}</small>
        <div className={styles.rowMeta}>
          {phase === "live" ? <PhaseChip phase={phase} /> : null}
          <Chip size="sm" tone={tone} icon={<StatusDot tone={tone} size={7} />}>{calendar.name}</Chip>
          {questions ? <Chip size="sm" tone="violet" icon={<MessagesSquare size={13} aria-hidden="true" />}>{questions === 1 ? "1 pregunta abierta" : `${questions} preguntas abiertas`}</Chip> : null}
        </div>
      </div>
      {meet && phase !== "past" ? <div className={styles.actions}><Button size="sm" variant={phase === "live" ? "success" : "soft"} icon={<Video size={15} aria-hidden="true" />} render={<Link href={meet} target="_blank" rel="noopener noreferrer" />}>Unirse</Button></div> : null}
    </li>
  );
}
