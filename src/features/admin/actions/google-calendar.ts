"use server";

import { createHash, randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { workspaceStore, WorkspaceConflict, type RestDocument } from "../server/firestore-rest";
import { adminAllowedEmails } from "../lib/access";
import { calendarScope, googleEventBody } from "../lib/google-calendar";
import { isMeetingEvent } from "../lib/meetings";
import { safeMeetUrl } from "../lib/meet";
import { validId, type GoogleLink, type WorkEvent } from "../lib/workspace";
import { site } from "@/lib/site";

/** `reauth`: el token de Google venció o le falta el permiso de Calendar; el cliente vuelve a pedirlo. */
export type CalendarResult = { ok: true } | { ok: false; error: string; reauth?: boolean };
class CalendarError extends Error { constructor(message: string, readonly reauth = false) { super(message); } }

const api = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
type Store = Awaited<ReturnType<typeof workspaceStore>>;

/** El token es de la persona con sesión y permite editar eventos de Calendar. No se guarda en ningún sitio. */
async function checkToken(token: unknown, email: string): Promise<string> {
  if (typeof token !== "string" || token.length < 20 || token.length > 4096 || !/^[\w.~+/=-]+$/.test(token)) throw new CalendarError("Vuelve a dar permiso a Google Calendar.", true);
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(token)}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new CalendarError("El permiso de Google Calendar venció.", true);
  const info = await response.json() as { email?: string; scope?: string };
  if (info.email?.toLowerCase() !== email) throw new CalendarError("Usa la misma cuenta de Google con la que entraste al admin.");
  if (!info.scope?.split(" ").some((scope) => scope === calendarScope || scope === "https://www.googleapis.com/auth/calendar")) throw new CalendarError("Marca el permiso de Google Calendar en la ventana de Google para continuar.", true);
  return token;
}

async function google(token: string, method: string, path: string, body?: unknown) {
  const response = await fetch(`${api}${path}`, { method, cache: "no-store", signal: AbortSignal.timeout(20000), headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  if (response.status === 401) throw new CalendarError("El permiso de Google Calendar venció.", true);
  if (response.status === 403) {
    const detail = await response.json().catch(() => ({}));
    const reason = detail.error?.errors?.[0]?.reason;
    if (reason === "insufficientPermissions") throw new CalendarError("Marca el permiso de Google Calendar en la ventana de Google para continuar.", true);
    if (reason === "accessNotConfigured") throw new CalendarError("La API de Google Calendar no está activada en el proyecto de Firebase.");
    throw new CalendarError("Google Calendar rechazó la operación.");
  }
  return response;
}

async function loadEvent(store: Store, eventId: string) {
  validId(eventId);
  const previous = await store.get("events", eventId);
  if (!previous || previous.data.archived) throw new Error("El evento no existe o está archivado.");
  const event = previous.data as unknown as WorkEvent & { revision: number };
  if (event.google && event.google.owner !== store.user.email) throw new Error("Este evento está en el Google Calendar de otra persona del equipo; solo ella puede actualizarlo.");
  return { previous, event };
}

/** Guarda el evento con o sin vínculo, en la forma que aceptan las reglas (con `meetUrl` y `meeting`). */
async function commitLink(store: Store, previous: RestDocument, event: WorkEvent & { revision: number }, google: GoogleLink | null, meetUrl: string) {
  const data: Record<string, unknown> = { ...previous.data, meetUrl, meeting: event.meeting ?? Boolean(event.meetUrl), revision: event.revision + 1, updatedBy: store.user.email, updatedAt: new Date().toISOString() };
  if (google) data.google = { ...google, revision: event.revision + 1 }; else delete data.google;
  await store.commit([{ collection: "events", id: (previous.name.split("/").pop())!, previous, data }]);
}

async function retry(action: () => Promise<CalendarResult>): Promise<CalendarResult> {
  for (let attempt = 0; ; attempt++) {
    try { return await action(); }
    catch (error) {
      if (error instanceof WorkspaceConflict && attempt < 2) { await new Promise((resolve) => setTimeout(resolve, 150 + attempt * 150)); continue; }
      if (error instanceof CalendarError) return { ok: false, error: error.message, reauth: error.reauth };
      return { ok: false, error: error instanceof Error && !error.message.startsWith("NEXT_") ? error.message : "No se pudo completar la operación." };
    }
  }
}

/**
 * Crea o actualiza el evento en el Google Calendar principal de quien tiene la sesión.
 * El ID de Google se deriva del de Daury, así que repetir la operación no lo duplica.
 */
export async function pushToGoogleCalendar(eventId: string, accessToken: string, options: { invite: boolean; createMeet: boolean }): Promise<CalendarResult> {
  return retry(async () => {
    const store = await workspaceStore(), token = await checkToken(accessToken, store.user.email);
    const { previous, event } = await loadEvent(store, eventId);
    if (typeof options?.invite !== "boolean" || typeof options.createMeet !== "boolean") throw new Error("Opciones no válidas.");
    const origin = (await headers()).get("origin") ?? site.url;
    const meetUrl = safeMeetUrl(event.meetUrl);
    const body = googleEventBody({ ...event, meetUrl }, {
      attendees: options.invite ? adminAllowedEmails.filter((email) => email !== store.user.email) : undefined,
      meetRequestId: options.createMeet && !meetUrl ? randomUUID() : undefined,
      meetingUrl: isMeetingEvent(event) ? `${origin}/admin/reuniones/${eventId}` : undefined,
    });
    const query = "?sendUpdates=all&conferenceDataVersion=1";
    const derived = `d${createHash("sha256").update(eventId).digest("hex")}`;
    let id = event.google?.id ?? derived;
    let response = event.google ? await google(token, "PATCH", `/${id}${query}`, body) : await google(token, "POST", query, { ...body, id });
    // Ya existe (un intento anterior que no llegó a guardarse): se actualiza.
    if (response.status === 409) response = await google(token, "PATCH", `/${id}${query}`, body);
    // Se borró del todo en Google: se crea de nuevo con otro ID.
    if (response.status === 404 || response.status === 410) {
      id = `d${createHash("sha256").update(`${eventId}:${randomUUID()}`).digest("hex")}`;
      response = await google(token, "POST", query, { ...body, id });
    }
    if (!response.ok) throw new CalendarError("Google Calendar no pudo guardar el evento. Inténtalo de nuevo.");
    const created = await response.json() as { id: string; htmlLink: string; hangoutLink?: string };
    if (!/^[a-v0-9]{5,1024}$/.test(created.id) || !/^https:\/\/www\.google\.com\/calendar\/\S*$/.test(created.htmlLink) || created.htmlLink.length > 2000) throw new CalendarError("Google Calendar devolvió un evento inesperado.");
    await commitLink(store, previous, event, { id: created.id, url: created.htmlLink, owner: store.user.email, revision: 0 }, meetUrl || safeMeetUrl(created.hangoutLink));
    return { ok: true };
  });
}

/** Borra la copia de Google Calendar (avisando a los invitados) y quita el vínculo. */
export async function removeFromGoogleCalendar(eventId: string, accessToken: string): Promise<CalendarResult> {
  return retry(async () => {
    const store = await workspaceStore(), token = await checkToken(accessToken, store.user.email);
    const { previous, event } = await loadEvent(store, eventId);
    if (!event.google) return { ok: true };
    const response = await google(token, "DELETE", `/${event.google.id}?sendUpdates=all`);
    if (!response.ok && response.status !== 404 && response.status !== 410) throw new CalendarError("Google Calendar no pudo borrar el evento.");
    await commitLink(store, previous, event, null, safeMeetUrl(event.meetUrl));
    return { ok: true };
  });
}
