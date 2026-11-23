import { adminAllowedEmails } from "./access";
import { object, validId, type Metadata, type WorkEvent } from "./workspace";

/**
 * Reuniones: cada evento marcado como reunión tiene una ficha en `meetings`
 * con el mismo ID que el evento (agenda, notas, transcripción y grabación) y
 * un foro de preguntas en `meetingQuestions` que se enlaza por `eventId`.
 * La fecha, el calendario y el enlace de Meet siguen viviendo en el evento.
 */
export type AgendaItem = { id: string; title: string; minutes: number; owner: string; done: boolean };
export type MeetingData = { eventId: string; agenda: AgendaItem[]; notes: string; transcript: string; recordingUrl: string };
export type Answer = { id: string; body: string; author: string; createdAt: string };
export type MeetingQuestion = { eventId: string; body: string; answers: Answer[]; votes: string[]; resolved: boolean };
export type Meeting = MeetingData & Metadata & { id: string };
export type Question = MeetingQuestion & Metadata & { id: string };

export const meetingLimits = { agenda: 40, title: 200, minutes: 480, notes: 20000, transcript: 200000, question: 2000, answer: 3000, answers: 100 } as const;
export const emptyMeeting = (eventId: string): MeetingData => ({ eventId, agenda: [], notes: "", transcript: "", recordingUrl: "" });

/** Un evento es reunión si se marcó así; los anteriores al campo, si tienen enlace de Meet. */
export const isMeetingEvent = (event: Pick<WorkEvent, "meeting" | "meetUrl">) => event.meeting ?? Boolean(event.meetUrl);

const team: readonly string[] = adminAllowedEmails;
function text(value: unknown, label: string, max: number, required = false) {
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new Error(`Revisa ${label}: ${required ? "es obligatorio y " : ""}admite hasta ${max.toLocaleString("es-GT")} caracteres.`);
  return value.trim();
}
/** Enlace HTTPS opcional (Drive, YouTube…) para la grabación. */
export function normalizeRecordingUrl(value: unknown): string {
  const input = text(value ?? "", "el enlace de la grabación", 500);
  if (!input) return "";
  let url: URL;
  try { url = new URL(input); } catch { throw new Error("Usa un enlace completo para la grabación, empezando por https://."); }
  if (url.protocol !== "https:" || url.username || url.password || url.href.length > 500) throw new Error("La grabación debe ser un enlace HTTPS.");
  return url.href;
}
export function safeRecordingUrl(value: unknown) { try { return normalizeRecordingUrl(value); } catch { return ""; } }

export function parseAgenda(value: unknown): AgendaItem[] {
  if (!Array.isArray(value) || value.length > meetingLimits.agenda) throw new Error(`La agenda admite hasta ${meetingLimits.agenda} puntos.`);
  const items = value.map((raw) => {
    const item = object(raw); validId(item.id);
    if (!Number.isInteger(item.minutes) || Number(item.minutes) < 0 || Number(item.minutes) > meetingLimits.minutes) throw new Error("La duración de cada punto debe ser de 0 a 480 minutos.");
    if (typeof item.done !== "boolean") throw new Error("Un punto de la agenda no es válido.");
    if (typeof item.owner !== "string" || (item.owner && !team.includes(item.owner))) throw new Error("El responsable debe ser una cuenta del equipo.");
    return { id: item.id, title: text(item.title, "cada punto de la agenda", meetingLimits.title, true), minutes: Number(item.minutes), owner: item.owner, done: item.done };
  });
  if (new Set(items.map((item) => item.id)).size !== items.length) throw new Error("La agenda tiene puntos repetidos.");
  return items;
}
export function parseMeetingData(eventId: string, input: unknown): MeetingData {
  validId(eventId);
  const data = object(input);
  return {
    eventId,
    agenda: parseAgenda(data.agenda),
    notes: text(data.notes, "las notas", meetingLimits.notes),
    // La transcripción conserva sus saltos de línea; solo se recortan los extremos.
    transcript: text(data.transcript, "la transcripción", meetingLimits.transcript),
    recordingUrl: normalizeRecordingUrl(data.recordingUrl),
  };
}
export const parseQuestionBody = (value: unknown) => text(value, "la pregunta", meetingLimits.question, true);
export const parseAnswerBody = (value: unknown) => text(value, "la respuesta", meetingLimits.answer, true);

/**
 * Convierte subtítulos WebVTT o SRT (o texto plano) en una transcripción legible:
 * quita cabeceras, números de bloque y marcas de tiempo, y une las líneas
 * consecutivas de la misma persona (`<v Nombre>` o `Nombre: texto`).
 */
export function transcriptFromFile(source: string): string {
  const lines = source.replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n");
  const looksTimed = lines.some((line) => /-->/.test(line));
  if (!looksTimed) return source.replace(/\r\n?/g, "\n").trim();
  const out: string[] = [];
  let skipping = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { skipping = false; continue; }
    if (/^WEBVTT/.test(line) || /^(NOTE|STYLE|REGION)\b/.test(line)) { skipping = true; continue; }
    if (skipping) continue;
    if (/^\d+$/.test(line) || /-->/.test(line)) continue;
    const voice = line.match(/^<v(?:\.[^ >]+)?\s+([^>]+)>(.*)$/);
    const content = (voice ? `${voice[1].trim()}: ${voice[2]}` : line).replace(/<[^>]+>/g, "").trim();
    if (!content) continue;
    const speaker = content.match(/^([^:]{1,60}):\s/)?.[1];
    const previous = out[out.length - 1];
    if (previous && speaker && previous.startsWith(`${speaker}: `)) out[out.length - 1] = `${previous} ${content.slice(speaker.length + 2)}`;
    // Sin hablante, un subtítulo suele continuar la frase anterior.
    else if (previous && !speaker && !/[.?!…]$/.test(previous)) out[out.length - 1] = `${previous} ${content}`;
    else out.push(content);
  }
  return out.join("\n\n");
}

/** Minutos de la agenda frente a la duración del evento (sin duración para eventos de todo el día). */
export function agendaTiming(agenda: Pick<AgendaItem, "minutes">[], event: Pick<WorkEvent, "allDay" | "start" | "end">) {
  const planned = agenda.reduce((sum, item) => sum + item.minutes, 0);
  const available = event.allDay ? null : Math.round((Date.parse(event.end) - Date.parse(event.start)) / 60000);
  return { planned, available, over: available !== null && planned > available };
}

export type MeetingPhase = "upcoming" | "live" | "past";
export function meetingPhase(event: Pick<WorkEvent, "allDay" | "start" | "end">, now = Date.now(), today?: string): MeetingPhase {
  if (event.allDay) {
    const day = today ?? new Date(now - 6 * 3600000).toISOString().slice(0, 10);
    return day < event.start ? "upcoming" : day >= event.end ? "past" : "live";
  }
  return now < Date.parse(event.start) ? "upcoming" : now >= Date.parse(event.end) ? "past" : "live";
}

/** Preguntas abiertas primero; dentro de cada grupo, las más votadas y luego las más antiguas. */
export function sortQuestions<T extends Pick<Question, "resolved" | "votes" | "createdAt">>(items: T[]): T[] {
  return items.toSorted((a, b) => Number(a.resolved) - Number(b.resolved) || b.votes.length - a.votes.length || a.createdAt.localeCompare(b.createdAt));
}
