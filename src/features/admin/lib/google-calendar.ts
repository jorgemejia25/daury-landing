import { WIKI_TIME_ZONE } from "./dates";
import type { WorkEvent } from "./workspace";

export const calendarScope = "https://www.googleapis.com/auth/calendar.events";

type BodyOptions = {
  /** Correos a invitar; sin lista no se tocan los invitados existentes. */
  attendees?: string[];
  /** Pide a Google una sala de Meet nueva (solo si el evento no tiene enlace). */
  meetRequestId?: string;
  /** Enlace a la reunión en el admin, para la descripción. */
  meetingUrl?: string;
};

/** Cuerpo de `events.insert`/`events.patch` a partir de un evento de Daury. */
export function googleEventBody(event: WorkEvent, options: BodyOptions = {}) {
  const description = [event.description.trim(), options.meetingUrl ? `Agenda y preguntas: ${options.meetingUrl}` : ""].filter(Boolean).join("\n\n");
  const time = (value: string) => (event.allDay ? { date: value, dateTime: null, timeZone: null } : { dateTime: value, date: null, timeZone: WIKI_TIME_ZONE });
  return {
    summary: event.title,
    description,
    location: event.meetUrl || event.location,
    start: time(event.start),
    // Daury y Google guardan el fin de los eventos de todo el día como exclusivo.
    end: time(event.end),
    status: "confirmed",
    ...(options.attendees ? { attendees: options.attendees.map((email) => ({ email })) } : {}),
    ...(options.meetRequestId ? { conferenceData: { createRequest: { requestId: options.meetRequestId, conferenceSolutionKey: { type: "hangoutsMeet" } } } } : {}),
  };
}
