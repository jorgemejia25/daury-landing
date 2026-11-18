"use client";

import Link from "next/link";
import { Button } from "@/ui/atoms/Button";
import { normalizeMeetUrl, safeMeetUrl } from "@/features/admin/lib/meet";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Sun, Video } from "lucide-react";
import { Chip } from "@/ui/atoms/Chip";
import { StatusDot } from "@/ui/atoms/StatusDot";
import { ChoiceList } from "@/ui/molecules/ChoiceList";
import { DateField } from "@/ui/molecules/DateField";
import { TextField } from "@/ui/molecules/TextField";
import { TimeField } from "@/ui/molecules/TimeField";
import { ToggleRow } from "@/ui/molecules/ToggleRow";
import { addDays, formatDate, localDate } from "@/features/admin/lib/dates";
import { calendarTone } from "@/features/admin/lib/presentation";
import type { Entity } from "@/features/admin/lib/workspace";
import { Attribution } from "../workspace/Attribution";
import { EditorPage, type EditorNav } from "./EditorPage";
import { EditorSection } from "./EditorSection";
import { useDraft } from "./useDraft";
import { useEditorSave } from "./useEditorSave";
import styles from "./EventForm.styles";

type EventFormProps = {
  initial?: Entity<"events">;
  calendars: Entity<"calendars">[];
  defaults?: { date?: string; calendarId?: string };
  onClose: () => void;
  onSaved: (id: string, data: Record<string, unknown>) => void;
  nav?: EditorNav;
  actions?: React.ReactNode;
};

/** Hora local de Guatemala (UTC−6) de un instante ISO: "2026-11-20T09:00". */
const guatemala = (iso: string) => new Date(Date.parse(iso) - 6 * 3600000).toISOString().slice(0, 16);

/** Evento con lo esencial: nombre, calendario, fecha y, si no es de todo el día, hora de inicio y fin. */
export function EventForm({ initial, calendars, defaults, nav, actions, onClose, onSaved }: EventFormProps) {
  const active = calendars.filter((calendar) => !calendar.archived);
  const startLocal = initial && !initial.allDay ? guatemala(initial.start) : "";
  const endLocal = initial && !initial.allDay ? guatemala(initial.end) : "";
  const { draft, set, latest } = useDraft(() => ({
    title: initial?.title ?? "",
    meetUrl: initial?.meetUrl ?? safeMeetUrl(initial?.location),
    calendarId: initial?.calendarId ?? defaults?.calendarId ?? active[0]?.id ?? "",
    date: initial ? (initial.allDay ? initial.start : startLocal.slice(0, 10)) : defaults?.date ?? localDate(new Date()),
    allDay: initial?.allDay ?? true,
    startTime: startLocal.slice(11, 16) || "09:00",
    endTime: endLocal.slice(11, 16) || "10:00",
  }));
  const editor = useEditorSave("events", initial);
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(latest.current));
  const dirty = useMemo(() => JSON.stringify(draft) !== snapshot, [draft, snapshot]);
  const calendar = active.find((item) => item.id === draft.calendarId);

  function save() {
    const { title, calendarId, date, allDay, startTime, endTime, meetUrl } = latest.current;
    let meeting;
    try { meeting = normalizeMeetUrl(meetUrl); } catch (error) { editor.setError(error instanceof Error ? error.message : "Revisa el enlace de Meet."); return; }
    if (!allDay && endTime <= startTime) {
      editor.setError("La hora de fin debe ser posterior a la de inicio.");
      return;
    }
    const data = {
      title,
      meetUrl: meeting,
      calendarId,
      allDay,
      start: allDay ? date : `${date}T${startTime}:00-06:00`,
      end: allDay ? addDays(date, 1) : `${date}T${endTime}:00-06:00`,
      description: initial?.description ?? "",
      location: initial?.location ?? "",
      articleId: initial?.articleId ?? "",
    };
    void editor.save(data, (id) => { setSnapshot(JSON.stringify(latest.current)); onSaved(id, data); });
  }

  const tone = calendar ? calendarTone(calendar.color) : "neutral";
  const hour = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
  };

  return (
    <EditorPage
      title={`${initial ? "Editar" : "Crear"} evento`}
      heading={initial ? "Editar evento" : "Nuevo evento"}
      backLabel="Volver al calendario"
      breadcrumb={
        <>
          <span>Calendarios</span>
          <ChevronRight size={13} aria-hidden="true" />
          <b>{calendar?.name ?? "Calendario"}</b>
        </>
      }
      saveLabel={initial ? "Guardar evento" : "Crear evento"}
      busy={editor.busy}
      error={editor.error}
      dirty={dirty}
      isNew={!initial}
      stale={editor.stale}
      nav={nav}
      actions={actions}
      onSave={save}
      onClose={onClose}
      aside={
        <>
          <EditorSection label="Vista previa" first>
            <div className={styles.preview}>
              <span className={styles.dateTile} data-tone={tone}>
                <span>{draft.date ? formatDate(draft.date, { month: "short" }).replace(".", "") : "—"}</span>
                <b>{draft.date ? Number(draft.date.slice(-2)) : "?"}</b>
              </span>
              <span className={styles.previewText}>
                <span className={styles.previewWhen}>{draft.allDay ? "Todo el día" : `${hour(draft.startTime)} – ${hour(draft.endTime)}`}</span>
                <b className={styles.previewTitle}>{draft.title.trim() || "Nuevo evento"}</b>
              </span>
            </div>
            <p className={styles.line}>
              <CalendarDays size={18} strokeWidth={2.2} aria-hidden="true" />
              {draft.date ? formatDate(draft.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Sin fecha"}
            </p>
            <Chip tone={tone} icon={<StatusDot tone={tone} size={8} />}>{calendar?.name ?? "Sin calendario"}</Chip>
          </EditorSection>
          {initial ? <div className={styles.meta}><Attribution item={initial} detailed /></div> : null}
        </>
      }
    >
      <EditorSection label="Evento" first>
        <TextField label="Nombre" appearance="big" value={draft.title} onChange={(value) => set("title", value)} required placeholder="Ej.: Reunión de producto" />
      </EditorSection>

      <EditorSection label="Cuándo">
        <DateField label="Fecha" value={draft.date} onChange={(value) => set("date", value)} required />
        <div className={styles.divider} />
        <ToggleRow
          icon={<Sun size={22} strokeWidth={2.2} />}
          title="Todo el día"
          subtitle={draft.allDay ? "Sin hora de inicio ni de fin." : "Indica la hora de inicio y de fin (Guatemala)."}
          checked={draft.allDay}
          onChange={(value) => set("allDay", value)}
        />
        {draft.allDay ? null : (
          <div className={styles.times}>
            <TimeField label="Hora de inicio" value={draft.startTime} onChange={(value) => set("startTime", value)} />
            <TimeField label="Hora de fin" value={draft.endTime} onChange={(value) => set("endTime", value)} />
          </div>
        )}
      </EditorSection>

      <EditorSection label="Videollamada">
        <TextField label="Enlace de Google Meet" type="url" value={draft.meetUrl} onChange={(value) => set("meetUrl", value)} maxLength={500} placeholder="https://meet.google.com/abc-defg-hij" description="Opcional. El enlace se conserva con el evento." />
        {safeMeetUrl(draft.meetUrl) ? <Button variant="secondary" icon={<Video size={17} aria-hidden="true" />} render={<Link href={safeMeetUrl(draft.meetUrl)} target="_blank" rel="noopener noreferrer" />}>Unirse al Meet</Button> : null}
      </EditorSection>
      <EditorSection label="Calendario">
        <ChoiceList
          label="Calendario del evento"
          value={draft.calendarId}
          options={active.map((item) => ({ value: item.id, label: item.name, hint: item.description || undefined, leading: <StatusDot tone={calendarTone(item.color)} size={12} /> }))}
          onChange={(value) => set("calendarId", value)}
        />
      </EditorSection>
    </EditorPage>
  );
}
