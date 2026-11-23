"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarPlus, ExternalLink, RefreshCw, Trash2, Users, Video } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { Panel } from "@/ui/molecules/Panel";
import { ToggleRow } from "@/ui/molecules/ToggleRow";
import { pushToGoogleCalendar, removeFromGoogleCalendar, type CalendarResult } from "@/features/admin/actions/google-calendar";
import { calendarAccessToken, calendarErrorMessage, forgetCalendarToken } from "@/features/admin/lib/google-token";
import { isMeetingEvent } from "@/features/admin/lib/meetings";
import { safeMeetUrl } from "@/features/admin/lib/meet";
import { personName } from "@/features/admin/lib/people";
import type { Entity } from "@/features/admin/lib/workspace";
import { useSessionEmail } from "../finance/FinanceParts";
import { meetingStyles as styles } from "./MeetingParts";

/** Crea, actualiza o quita la copia del evento en el Google Calendar de quien tiene la sesión. */
export function GoogleCalendarPanel({ event, dirty = false }: { event: Entity<"events">; dirty?: boolean }) {
  const me = useSessionEmail(), link = event.google;
  const [invite, setInvite] = useState(isMeetingEvent(event)), [createMeet, setCreateMeet] = useState(true);
  const [busy, setBusy] = useState(""), [error, setError] = useState("");
  const mine = !link || link.owner === me, stale = Boolean(link && link.revision !== event.revision);

  async function run(kind: string, action: (token: string) => Promise<CalendarResult>) {
    if (busy) return;
    setBusy(kind); setError("");
    try {
      let result = await action(await calendarAccessToken());
      // Token vencido o sin permiso de Calendar: se pide de nuevo una vez.
      if (!result.ok && result.reauth) { forgetCalendarToken(); result = await action(await calendarAccessToken(true)); }
      if (!result.ok) setError(result.error);
    } catch (problem) { setError(calendarErrorMessage(problem)); }
    finally { setBusy(""); }
  }
  const push = (options: { invite: boolean; createMeet: boolean }) => run("push", (token) => pushToGoogleCalendar(event.id, token, options));
  const remove = () => {
    if (!window.confirm("¿Quitar el evento de Google Calendar? Los invitados recibirán la cancelación.")) return;
    void run("remove", (token) => removeFromGoogleCalendar(event.id, token));
  };

  return (
    <Panel title="Google Calendar">
      <div className="flex flex-col gap-[12px]">
        {link ? (
          <>
            <Button variant="soft" fullWidth icon={<ExternalLink size={16} aria-hidden="true" />} render={<Link href={link.url} target="_blank" rel="noopener noreferrer" />}>Abrir en Google Calendar</Button>
            {!mine ? <p className={styles.muted}>En el calendario de {personName(link.owner)}.</p> : null}
            {mine && stale ? <p className={styles.muted} role="status">Hay cambios sin enviar a Google.</p> : null}
            {mine ? (
              <div className="flex gap-[8px] flex-wrap">
                <Button size="sm" variant={stale ? "primary" : "secondary"} disabled={Boolean(busy) || dirty} icon={<RefreshCw size={15} aria-hidden="true" />} onClick={() => void push({ invite: false, createMeet: false })}>
                  {busy === "push" ? "Actualizando…" : "Actualizar"}
                </Button>
                <Button size="sm" variant="text" disabled={Boolean(busy)} icon={<Trash2 size={15} aria-hidden="true" />} onClick={remove}>{busy === "remove" ? "Quitando…" : "Quitar"}</Button>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <ToggleRow icon={<Users size={20} strokeWidth={2.2} />} title="Invitar al equipo" checked={invite} onChange={setInvite} />
            {safeMeetUrl(event.meetUrl) ? null : <ToggleRow icon={<Video size={20} strokeWidth={2.2} />} title="Crear enlace de Meet" checked={createMeet} onChange={setCreateMeet} />}
            <Button fullWidth disabled={Boolean(busy) || dirty} icon={<CalendarPlus size={16} aria-hidden="true" />} onClick={() => void push({ invite, createMeet })}>
              {busy ? "Creando…" : "Crear en Google Calendar"}
            </Button>
          </>
        )}
        {dirty ? <p className={styles.muted}>Guarda el evento antes de enviarlo.</p> : null}
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
      </div>
    </Panel>
  );
}
