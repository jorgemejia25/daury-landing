"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Tabs, TabsPanel } from "@ui-sdk/react/tabs";
import { Captions, ChevronRight, Clock, Download, FileUp, ListChecks, MessagesSquare, NotebookPen, Pencil, PlayCircle, Video } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { Skeleton } from "@/ui/atoms/Skeleton";
import { EmptyState } from "@/ui/molecules/EmptyState";
import { Panel } from "@/ui/molecules/Panel";
import { SearchField } from "@/ui/molecules/SearchField";
import { SegmentedTabs } from "@/ui/molecules/SegmentedTabs";
import { TextField } from "@/ui/molecules/TextField";
import { saveMeeting } from "@/features/admin/actions/meetings";
import { saveWorkspaceItem } from "@/features/admin/actions/workspace";
import { useWorkspace, useWorkspaceDocument } from "@/features/admin/hooks/useWorkspace";
import { useAdminQuery } from "@/features/admin/hooks/useAdminQuery";
import { emptyMeeting, isMeetingEvent, meetingLimits, meetingPhase, normalizeRecordingUrl, safeRecordingUrl, transcriptFromFile, type MeetingData } from "@/features/admin/lib/meetings";
import { normalizeMeetUrl, safeMeetUrl } from "@/features/admin/lib/meet";
import { calendarTone } from "@/features/admin/lib/presentation";
import { eventHref, meetingsHref } from "@/features/admin/lib/routes";
import { normalizeText } from "@/features/admin/lib/text";
import type { Entity } from "@/features/admin/lib/workspace";
import { useSessionEmail } from "../finance/FinanceParts";
import { Attribution } from "../workspace/Attribution";
import { AgendaEditor } from "./AgendaEditor";
import { DateTile, PhaseChip, meetingStyles as styles, relativeLabel, whenLabel } from "./MeetingParts";
import { useNow } from "./MeetingsWorkspace";
import { QuestionsForum } from "./QuestionsForum";
import { GoogleCalendarPanel } from "./GoogleCalendarPanel";

const tabs = ["agenda", "preguntas", "notas", "transcripcion"] as const;
type Draft = Pick<MeetingData, "agenda" | "notes" | "transcript" | "recordingUrl">;
const pick = (data: MeetingData): Draft => ({ agenda: data.agenda, notes: data.notes, transcript: data.transcript, recordingUrl: data.recordingUrl });

/** Ficha de una reunión: agenda, preguntas previas, notas, transcripción, Meet y grabación. */
export function MeetingPage({ id }: { id: string }) {
  const event = useWorkspaceDocument("events", id), meeting = useWorkspaceDocument("meetings", id);
  const calendars = useWorkspace("calendars"), questions = useWorkspace("meetingQuestions", "eventId", id);

  if (event.loading || meeting.loading || calendars.loading) {
    return (
      <div role="status" aria-label="Cargando reunión" className="flex flex-col gap-[16px]">
        <Skeleton height={64} radius={24} />
        <Skeleton height={44} width="50%" />
        <Skeleton height={320} radius={24} />
      </div>
    );
  }
  const error = event.error || meeting.error || calendars.error;
  if (error) return <p className={styles.error} role="alert">{error}</p>;
  if (!event.item || event.item.archived) {
    return (
      <EmptyState icon={<Video size={26} strokeWidth={2} />} tone="amber" title="Esta reunión no existe" action={<Button variant="secondary" render={<Link href={meetingsHref()} />}>Ir a las reuniones</Button>}>
        Puede que el evento se haya archivado o que el enlace esté incompleto.
      </EmptyState>
    );
  }
  return <MeetingDetail key={id} event={event.item} meeting={meeting.item} calendars={calendars.items} questions={questions.items} questionsError={questions.error} />;
}

function MeetingDetail({ event, meeting, calendars, questions, questionsError }: { event: Entity<"events">; meeting: Entity<"meetings"> | null; calendars: Entity<"calendars">[]; questions: Entity<"meetingQuestions">[]; questionsError: string }) {
  const { params, update } = useAdminQuery(), now = useNow(), me = useSessionEmail();
  const tab = tabs.find((value) => value === params.get("tab")) ?? "agenda";
  const calendar = calendars.find((item) => item.id === event.calendarId), tone = calendar ? calendarTone(calendar.color) : "neutral";
  const phase = meetingPhase(event, now);

  // Borrador de la ficha: se guarda junto (agenda, notas, transcripción y grabación).
  const server = meeting && !meeting.archived ? pick(meeting) : pick(emptyMeeting(event.id));
  const [base, setBase] = useState<{ revision: number | undefined; data: Draft }>(() => ({ revision: meeting?.revision, data: server }));
  const [draft, setDraft] = useState<Draft>(server);
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(base.data);
  const remoteRevision = meeting?.revision;
  // Una versión más nueva (de otra persona) se adopta si no hay nada sin guardar; si no, se avisa.
  const newer = (remoteRevision ?? 0) > (base.revision ?? 0);
  if (newer && !busy && !dirty) { setBase({ revision: remoteRevision, data: server }); setDraft(server); }
  const conflict = newer && dirty;
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => { setDraft((current) => ({ ...current, [key]: value })); setSaved(false); };

  async function save() {
    if (busy) return;
    setError("");
    try { normalizeRecordingUrl(draft.recordingUrl); } catch (problem) { setError(problem instanceof Error ? problem.message : "Revisa el enlace de la grabación."); return; }
    if (draft.agenda.some((item) => !item.title.trim())) { setError("Escribe el tema de cada punto de la agenda o quita los vacíos."); update({ tab: null }); return; }
    setBusy(true);
    try {
      const result = await saveMeeting(event.id, base.revision, draft);
      if (!result.ok) setError(result.error);
      else { setBase({ revision: result.revision, data: draft }); setSaved(true); }
    } catch { setError("No se pudieron guardar los cambios. Revisa tu conexión."); }
    finally { setBusy(false); }
  }
  function discard() { setBase({ revision: remoteRevision, data: server }); setDraft(server); setError(""); }

  const openQuestions = questions.filter((item) => !item.archived && !item.resolved).length;
  const meet = safeMeetUrl(event.meetUrl), recording = safeRecordingUrl(base.data.recordingUrl);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className="min-w-0 flex items-center gap-[16px]">
          <DateTile event={event} tone={tone} />
          <div className="min-w-0">
            <nav aria-label="Ruta" className={`${styles.eyebrow} flex items-center gap-[6px]`}>
              <Link href={meetingsHref()} className="text-inherit no-underline hover:text-brand">Reuniones</Link>
              <ChevronRight size={12} aria-hidden="true" />
              <span>{calendar?.name ?? "Calendario"}</span>
            </nav>
            <h1 className={styles.heading}>{event.title}</h1>
            <p className={`${styles.muted} mt-[6px] first-letter:uppercase`}>{whenLabel(event)}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" icon={<Pencil size={16} aria-hidden="true" />} render={<Link href={eventHref(event.id)} />}>Editar evento</Button>
          {meet ? <Button variant={phase === "live" ? "success" : "primary"} icon={<Video size={17} aria-hidden="true" />} render={<Link href={meet} target="_blank" rel="noopener noreferrer" />}>Unirse a Meet</Button> : null}
        </div>
      </header>
      {!isMeetingEvent(event) ? <p className={styles.notice}>Este evento no está marcado como reunión, así que no aparece en la lista. <Link href={eventHref(event.id)} className="text-brand font-semibold">Activar en el evento</Link></p> : null}

      <div className={styles.layout}>
        <div className={styles.stack}>
          <Tabs value={tab} onValueChange={(value) => update({ tab: value === "agenda" ? null : String(value) })}>
            <div className="mb-[14px] overflow-x-auto"><SegmentedTabs label="Secciones de la reunión" options={[
              { value: "agenda", label: base.data.agenda.length ? `Agenda · ${base.data.agenda.length}` : "Agenda", icon: <ListChecks size={16} aria-hidden="true" /> },
              { value: "preguntas", label: openQuestions ? `Preguntas · ${openQuestions}` : "Preguntas", icon: <MessagesSquare size={16} aria-hidden="true" /> },
              { value: "notas", label: "Notas", icon: <NotebookPen size={16} aria-hidden="true" /> },
              { value: "transcripcion", label: "Transcripción", icon: <Captions size={16} aria-hidden="true" /> },
            ]} /></div>
            <TabsPanel value="agenda" className="min-w-0 focus:outline-none">
              <Panel>
                <AgendaEditor agenda={draft.agenda} event={event} onChange={(value) => set("agenda", value)} />
              </Panel>
            </TabsPanel>
            <TabsPanel value="preguntas" className="min-w-0 focus:outline-none">
              <Panel>
                {questionsError ? <p className={styles.error} role="alert">{questionsError}</p> : <QuestionsForum eventId={event.id} questions={questions} me={me} />}
              </Panel>
            </TabsPanel>
            <TabsPanel value="notas" className="min-w-0 focus:outline-none">
              <Panel>
                <TextField label="Notas de la reunión" hideLabel multiline rows={16} maxLength={meetingLimits.notes} value={draft.notes} onChange={(value) => set("notes", value)}
                  placeholder={"Decisiones\n- …\n\nPróximos pasos\n- Responsable: tarea (fecha)"} description={`${draft.notes.length.toLocaleString("es-GT")} de ${meetingLimits.notes.toLocaleString("es-GT")} caracteres.`} />
              </Panel>
            </TabsPanel>
            <TabsPanel value="transcripcion" className="min-w-0 focus:outline-none">
              <TranscriptPanel title={event.title} transcript={draft.transcript} recordingUrl={draft.recordingUrl} onTranscript={(value) => set("transcript", value)} onRecording={(value) => set("recordingUrl", value)} />
            </TabsPanel>
          </Tabs>

          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {conflict ? <p className={styles.notice} role="status">Otra persona guardó cambios en esta reunión mientras editabas. <Button size="sm" variant="secondary" onClick={discard}>Cargar su versión</Button></p> : null}
          {dirty ? (
            <div className={styles.saveBar} role="region" aria-label="Cambios sin guardar">
              <span className="text-[var(--ink-2)]">Cambios sin guardar</span>
              <div className="flex gap-[8px]">
                <Button size="sm" variant="text" disabled={busy} onClick={discard}>Descartar</Button>
                <Button size="sm" disabled={busy || conflict} onClick={() => void save()}>{busy ? "Guardando…" : "Guardar cambios"}</Button>
              </div>
            </div>
          ) : saved ? <p className={`${styles.muted} text-[var(--green-deep)]!`} role="status">Cambios guardados.</p> : null}
        </div>

        <aside className={styles.aside} aria-label="Detalles de la reunión">
          <Panel title="Detalles">
            <div className="flex flex-col gap-[12px]">
              {event.allDay || phase === "live" ? <div><PhaseChip phase={phase} /></div> : <p className={styles.infoRow}><Clock size={16} aria-hidden="true" />{relativeLabel(event, now)}</p>}
              {recording ? <p className={styles.infoRow}><PlayCircle size={16} aria-hidden="true" /><Link href={recording} target="_blank" rel="noopener noreferrer" className="text-brand font-semibold no-underline hover:underline">Ver grabación</Link></p> : null}
              {meeting ? <Attribution item={meeting} detailed /> : null}
            </div>
          </Panel>
          <MeetLinkPanel event={event} />
          <GoogleCalendarPanel event={event} />
        </aside>
      </div>
    </section>
  );
}

/** Enlace de Meet del evento, editable desde la reunión (se guarda en el evento). */
function MeetLinkPanel({ event }: { event: Entity<"events"> }) {
  const [value, setValue] = useState(event.meetUrl ?? ""), [editing, setEditing] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const meet = safeMeetUrl(event.meetUrl);
  async function save() {
    setError("");
    let meetUrl: string;
    try { meetUrl = normalizeMeetUrl(value); } catch (problem) { setError(problem instanceof Error ? problem.message : "Revisa el enlace."); return; }
    setBusy(true);
    try {
      const { title, description, calendarId, allDay, start, end, location, articleId } = event;
      const result = await saveWorkspaceItem({ collection: "events", id: event.id, revision: event.revision, data: { title, description, calendarId, allDay, start, end, location, articleId, meetUrl, meeting: isMeetingEvent(event) } });
      if (!result.ok) setError(result.error); else setEditing(false);
    } catch { setError("No se pudo guardar el enlace."); }
    finally { setBusy(false); }
  }
  return (
    <Panel title="Google Meet" action={!editing ? <Button size="sm" variant="text" onClick={() => { setValue(event.meetUrl ?? ""); setEditing(true); }}>{meet ? "Cambiar" : "Añadir"}</Button> : undefined}>
      {editing ? (
        <form className="flex flex-col gap-[10px]" onSubmit={(e) => { e.preventDefault(); void save(); }}>
          <TextField label="Enlace de Google Meet" hideLabel type="url" maxLength={500} value={value} onChange={setValue} placeholder="https://meet.google.com/abc-defg-hij" />
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <div className="flex gap-[8px]"><Button size="sm" type="submit" disabled={busy}>{busy ? "Guardando…" : "Guardar"}</Button><Button size="sm" variant="text" onClick={() => setEditing(false)}>Cancelar</Button></div>
          <p className={styles.muted}>Crea una sala en <Link href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer" className="text-brand">meet.google.com/new</Link> y pega el enlace.</p>
        </form>
      ) : meet ? (
        <p className={`${styles.infoRow} [overflow-wrap:anywhere]`}><Video size={16} aria-hidden="true" />{meet.replace("https://", "")}</p>
      ) : <p className={styles.muted}>Sin enlace.</p>}
    </Panel>
  );
}

function TranscriptPanel({ title, transcript, recordingUrl, onTranscript, onRecording }: { title: string; transcript: string; recordingUrl: string; onTranscript: (value: string) => void; onRecording: (value: string) => void }) {
  const [editing, setEditing] = useState(!transcript), [query, setQuery] = useState(""), [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const matches = useMemo(() => {
    const words = normalizeText(query).trim();
    if (!words) return null;
    return transcript.split("\n").filter((line) => normalizeText(line).includes(words));
  }, [transcript, query]);

  async function importFile(input: File | undefined) {
    setError("");
    if (!input) return;
    if (input.size > 2_000_000) { setError("El archivo es demasiado grande (máximo 2 MB)."); return; }
    const text = transcriptFromFile(await input.text());
    if (text.length > meetingLimits.transcript) { setError(`La transcripción supera ${meetingLimits.transcript.toLocaleString("es-GT")} caracteres. Recórtala antes de importarla.`); return; }
    if (transcript && !window.confirm("¿Reemplazar la transcripción actual por la del archivo?")) return;
    onTranscript(text); setEditing(false);
  }
  function download() {
    const url = URL.createObjectURL(new Blob([transcript], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `${title.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").toLowerCase() || "reunion"}-transcripcion.txt`;
    link.click(); URL.revokeObjectURL(url);
  }

  return (
    <Panel>
      <div className={styles.stack}>
        <div className="flex items-center justify-between gap-[8px] flex-wrap">
          {editing ? <p className={styles.muted}>Pega la transcripción de Meet o importa un archivo .txt, .vtt o .srt.</p> : null}
          <div className="flex gap-[6px] flex-wrap justify-end ml-auto">
        <input ref={file} type="file" accept=".txt,.vtt,.srt,.md,text/plain,text/vtt" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => { void importFile(e.target.files?.[0]); e.target.value = ""; }} />
        <Button size="sm" variant="text" icon={<FileUp size={15} aria-hidden="true" />} onClick={() => file.current?.click()}>Importar</Button>
        {transcript ? <Button size="sm" variant="text" icon={<Download size={15} aria-hidden="true" />} onClick={download}>Descargar</Button> : null}
        {transcript ? <Button size="sm" variant="text" icon={<Pencil size={15} aria-hidden="true" />} onClick={() => setEditing(!editing)}>{editing ? "Ver" : "Editar"}</Button> : null}
          </div>
        </div>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        {editing ? (
          <TextField label="Transcripción" hideLabel multiline rows={18} maxLength={meetingLimits.transcript} value={transcript} onChange={onTranscript}
            placeholder={"Ana: Empezamos con el primer punto…\n\nLuis: …"} description={`${transcript.length.toLocaleString("es-GT")} de ${meetingLimits.transcript.toLocaleString("es-GT")} caracteres.`} />
        ) : (
          <>
            <SearchField aria-label="Buscar en la transcripción" placeholder="Buscar en la transcripción…" value={query} onValueChange={setQuery} />
            {matches ? <p className={styles.muted} role="status">{matches.length === 1 ? "1 fragmento" : `${matches.length} fragmentos`} con «{query.trim()}».</p> : null}
            <div className={styles.transcript} tabIndex={0} aria-label="Transcripción">{(matches ?? [transcript]).join(matches ? "\n\n" : "")}</div>
          </>
        )}
        <TextField label="Enlace de la grabación" type="url" maxLength={500} value={recordingUrl} onChange={onRecording} placeholder="https://drive.google.com/…" description="Opcional." />
      </div>
    </Panel>
  );
}
