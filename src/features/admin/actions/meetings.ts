"use server";

import { randomUUID } from "node:crypto";
import { workspaceStore, WorkspaceConflict } from "../server/firestore-rest";
import { meetingLimits, parseAnswerBody, parseMeetingData, parseQuestionBody, type Answer } from "../lib/meetings";
import { validId } from "../lib/workspace";

type Result = { ok: true; id: string; revision: number } | { ok: false; error: string };
type Attempt = Result & { retryable?: boolean };
const failure = (error: unknown): Attempt => ({ ok: false, retryable: error instanceof WorkspaceConflict, error: error instanceof Error && !error.message.startsWith("NEXT_") ? error.message : "Inicia sesión para continuar." });
async function retry(action: () => Promise<Attempt>): Promise<Result> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await action();
    if (result.ok) return result;
    if (!result.retryable || attempt === 2) return { ok: false, error: result.error };
    await new Promise((resolve) => setTimeout(resolve, 100 + attempt * 150 + Math.random() * 100));
  }
  return { ok: false, error: "No se pudo guardar. Inténtalo de nuevo." };
}
type Store = Awaited<ReturnType<typeof workspaceStore>>;
async function requireEvent(store: Store, eventId: string) {
  validId(eventId);
  const event = await store.get("events", eventId);
  if (!event || event.data.archived) throw new Error("El evento de esta reunión no existe o está archivado.");
  return event;
}
const stamp = (store: Store, previous: Record<string, unknown> | undefined, now: string) => ({
  revision: Number(previous?.revision ?? 0) + 1, archived: false,
  createdBy: previous?.createdBy ?? store.user.email, createdAt: previous?.createdAt ?? now,
  updatedBy: store.user.email, updatedAt: now,
});

/**
 * Guarda la ficha de la reunión (agenda, notas, transcripción y grabación).
 * Sin `revision` crea la ficha; el commit exige que aún no exista, así que
 * dos personas que la crean a la vez no se sobrescriben.
 */
export async function saveMeeting(eventId: string, revision: number | undefined, input: unknown): Promise<Result> {
  return retry(async () => {
    try {
      const store = await workspaceStore();
      await requireEvent(store, eventId);
      const previous = await store.get("meetings", eventId);
      if (revision === undefined ? previous : !previous || previous.data.revision !== revision) throw new Error("Otra persona guardó cambios en esta reunión. Carga la versión actual antes de guardar.");
      if (previous?.data.archived) throw new Error("Restaura la reunión antes de editarla.");
      const data = parseMeetingData(eventId, input), now = new Date().toISOString(), meta = stamp(store, previous?.data, now);
      await store.commit([{ collection: "meetings", id: eventId, previous, data: { ...data, ...meta } }]);
      return { ok: true, id: eventId, revision: meta.revision };
    } catch (error) { return failure(error); }
  });
}

/** Publica una pregunta en el foro previo a la reunión. */
export async function askMeetingQuestion(eventId: string, body: string): Promise<Result> {
  return retry(async () => {
    try {
      const store = await workspaceStore();
      await requireEvent(store, eventId);
      const id = randomUUID(), now = new Date().toISOString(), meta = stamp(store, undefined, now);
      await store.commit([{ collection: "meetingQuestions", id, previous: null, data: { eventId, body: parseQuestionBody(body), answers: [], votes: [], resolved: false, ...meta } }]);
      return { ok: true, id, revision: meta.revision };
    } catch (error) { return failure(error); }
  });
}

export type QuestionChange =
  | { type: "answer"; body: string }
  | { type: "vote"; on: boolean }
  | { type: "resolve"; resolved: boolean }
  | { type: "edit"; body: string }
  | { type: "archive"; archived: boolean };

/** Responde, vota, resuelve, edita o archiva una pregunta. Votar y responder se reintentan sobre la versión actual. */
export async function updateMeetingQuestion(id: string, revision: number, change: QuestionChange): Promise<Result> {
  let first = true;
  return retry(async () => {
    try {
      validId(id);
      const store = await workspaceStore(), previous = await store.get("meetingQuestions", id);
      if (!previous) throw new Error("La pregunta ya no existe.");
      const data = previous.data, me = store.user.email;
      // Votos y respuestas se suman a lo que haya; el resto exige la versión que se vio.
      const additive = change.type === "vote" || change.type === "answer";
      if (!additive && first && data.revision !== revision) throw new Error("La pregunta cambió mientras tanto. Vuelve a intentarlo.");
      first = false;
      if (data.archived && change.type !== "archive") throw new Error("Restaura la pregunta antes de modificarla.");
      const next: Record<string, unknown> = { ...data };
      switch (change?.type) {
        case "answer": {
          const answers = data.answers as Answer[];
          if (answers.length >= meetingLimits.answers) throw new Error("Esta pregunta alcanzó el límite de 100 respuestas.");
          next.answers = [...answers, { id: randomUUID(), body: parseAnswerBody(change.body), author: me, createdAt: new Date().toISOString() }];
          break;
        }
        case "vote": {
          if (typeof change.on !== "boolean") throw new Error("Voto no válido.");
          const votes = data.votes as string[];
          next.votes = change.on ? (votes.includes(me) ? votes : [...votes, me]) : votes.filter((email) => email !== me);
          break;
        }
        case "resolve":
          if (typeof change.resolved !== "boolean") throw new Error("Estado no válido.");
          next.resolved = change.resolved; break;
        case "edit":
          if (data.createdBy !== me) throw new Error("Solo quien hizo la pregunta puede editarla.");
          next.body = parseQuestionBody(change.body); break;
        case "archive":
          if (typeof change.archived !== "boolean") throw new Error("Acción no válida.");
          if (!change.archived) await requireEvent(store, data.eventId as string);
          next.archived = change.archived; break;
        default:
          throw new Error("Acción no válida.");
      }
      const nextRevision = Number(data.revision) + 1;
      await store.commit([{ collection: "meetingQuestions", id, previous, data: { ...next, revision: nextRevision, updatedBy: me, updatedAt: new Date().toISOString() } }]);
      return { ok: true, id, revision: nextRevision };
    } catch (error) { return failure(error); }
  });
}
