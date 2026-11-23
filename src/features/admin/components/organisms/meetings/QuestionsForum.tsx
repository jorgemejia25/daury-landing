"use client";

import { useState } from "react";
import { Archive, ArchiveRestore, ChevronUp, CircleCheck, MessageSquareReply, Pencil, RotateCcw, Send } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { Button } from "@/ui/atoms/Button";
import { ActionMenu } from "@/ui/molecules/ActionMenu";
import { TextField } from "@/ui/molecules/TextField";
import { askMeetingQuestion, updateMeetingQuestion, type QuestionChange } from "@/features/admin/actions/meetings";
import { meetingLimits, sortQuestions, type Question } from "@/features/admin/lib/meetings";
import { personName } from "@/features/admin/lib/people";
import { meetingStyles as styles } from "./MeetingParts";

const stamp = (iso: string) => new Date(iso).toLocaleString("es-GT", { timeZone: "America/Guatemala", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/**
 * Foro previo a la reunión: el equipo deja dudas, vota las que más importan,
 * las responde por escrito y marca las resueltas (en la reunión o antes).
 */
export function QuestionsForum({ eventId, questions, me }: { eventId: string; questions: Question[]; me: string }) {
  const [draft, setDraft] = useState(""), [error, setError] = useState(""), [pending, setPending] = useState<ReadonlySet<string>>(() => new Set());
  const [showArchived, setShowArchived] = useState(false);
  const active = sortQuestions(questions.filter((item) => !item.archived));
  const open = active.filter((item) => !item.resolved), resolved = active.filter((item) => item.resolved), archived = questions.filter((item) => item.archived);

  async function run(key: string, action: () => Promise<{ ok: boolean; error?: string }>) {
    if (pending.has(key)) return false;
    setPending((current) => new Set(current).add(key)); setError("");
    try { const result = await action(); if (!result.ok) setError(result.error ?? "No se pudo guardar."); return result.ok; }
    catch { setError("No se pudo guardar. Revisa tu conexión."); return false; }
    finally { setPending((current) => { const next = new Set(current); next.delete(key); return next; }); }
  }
  const change = (item: Question, value: QuestionChange) => run(item.id, () => updateMeetingQuestion(item.id, item.revision, value));
  async function ask() {
    if (!draft.trim()) return;
    if (await run("new", () => askMeetingQuestion(eventId, draft))) setDraft("");
  }
  const card = (item: Question) => <QuestionCard key={item.id} item={item} me={me} busy={pending.has(item.id)} onChange={(value) => change(item, value)} />;

  return (
    <div className={styles.stack}>
      <form className="flex flex-col gap-[10px]" onSubmit={(event) => { event.preventDefault(); void ask(); }}>
        <TextField label="Tu pregunta" multiline rows={3} maxLength={meetingLimits.question} value={draft} onChange={setDraft} />
        <div className="flex justify-end">
          <Button type="submit" disabled={!draft.trim() || pending.has("new")} icon={<Send size={16} aria-hidden="true" />}>Publicar pregunta</Button>
        </div>
      </form>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}

      {open.length ? <ul className={`${styles.list} border-y border-rule`} aria-label="Preguntas abiertas">{open.map(card)}</ul>
        : <p className={styles.muted}>{resolved.length ? "No quedan preguntas abiertas." : "Todavía no hay preguntas."}</p>}
      {resolved.length ? (
        <section className="flex flex-col gap-[8px]" aria-label="Preguntas resueltas">
          <h3 className="m-0 text-[13px] font-semibold text-ink-soft uppercase tracking-[0.06em] font-mono">Resueltas · {resolved.length}</h3>
          <ul className={`${styles.list} border-y border-rule`}>{resolved.map(card)}</ul>
        </section>
      ) : null}
      {archived.length ? (
        <div className="flex flex-col gap-[8px]">
          <div><Button size="sm" variant="text" icon={<Archive size={15} aria-hidden="true" />} onClick={() => setShowArchived(!showArchived)}>{showArchived ? "Ocultar archivadas" : `Archivadas · ${archived.length}`}</Button></div>
          {showArchived ? <ul className={`${styles.list} border-y border-rule opacity-80`}>{archived.map(card)}</ul> : null}
        </div>
      ) : null}
    </div>
  );
}

function QuestionCard({ item, me, busy, onChange }: { item: Question; me: string; busy: boolean; onChange: (change: QuestionChange) => Promise<boolean> }) {
  const [reply, setReply] = useState<string | null>(null), [editing, setEditing] = useState<string | null>(null);
  const voted = item.votes.includes(me), mine = item.createdBy === me;
  const actions = [
    ...(mine && !item.archived ? [{ value: "edit", label: "Editar pregunta", icon: <Pencil size={16} aria-hidden="true" /> }] : []),
    item.archived ? { value: "restore", label: "Restaurar", icon: <ArchiveRestore size={16} aria-hidden="true" /> } : { value: "archive", label: "Archivar", icon: <Archive size={16} aria-hidden="true" />, danger: true },
  ];

  return (
    <li className={styles.question} data-resolved={item.resolved || undefined}>
      <div className={styles.questionHead}>
        <button type="button" className={styles.vote} aria-pressed={voted} disabled={busy || item.archived} onClick={() => void onChange({ type: "vote", on: !voted })}
          aria-label={`${voted ? "Quitar mi voto" : "Votar"} (${item.votes.length} ${item.votes.length === 1 ? "voto" : "votos"})`}
          title={item.votes.length ? item.votes.map(personName).join(", ") : undefined}>
          <ChevronUp size={18} strokeWidth={2.4} aria-hidden="true" />
          {item.votes.length}
        </button>
        <div className="flex flex-col gap-[6px] flex-1 min-w-0">
          {editing !== null ? (
            <form className="flex flex-col gap-[8px]" onSubmit={async (event) => { event.preventDefault(); if (await onChange({ type: "edit", body: editing })) setEditing(null); }}>
              <TextField label="Editar pregunta" multiline rows={3} maxLength={meetingLimits.question} value={editing} onChange={setEditing} />
              <div className="flex gap-[8px]"><Button size="sm" type="submit" disabled={busy || !editing.trim()}>Guardar</Button><Button size="sm" variant="text" onClick={() => setEditing(null)}>Cancelar</Button></div>
            </form>
          ) : <p className={styles.questionBody}>{item.body}</p>}
          <span className={styles.byline}><b>{personName(item.createdBy)}</b> · {stamp(item.createdAt)}</span>
        </div>
        <ActionMenu label="Opciones de la pregunta" actions={actions} onAction={(value) => {
          if (value === "edit") setEditing(item.body);
          else void onChange({ type: "archive", archived: value === "archive" });
        }} />
      </div>

      {item.answers.length ? (
        <ul className={styles.answers} aria-label="Respuestas">
          {item.answers.map((answer) => (
            <li key={answer.id} className={styles.answer}>
              <Avatar name={personName(answer.author)} size={26} tone="green" />
              <div className="flex flex-col gap-[2px] min-w-0">
                <span className={styles.byline}><b>{personName(answer.author)}</b> · {stamp(answer.createdAt)}</span>
                <p>{answer.body}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {item.archived ? null : reply !== null ? (
        <form className={`${styles.questionActions} flex-col items-stretch!`} onSubmit={async (event) => { event.preventDefault(); if (await onChange({ type: "answer", body: reply })) setReply(null); }}>
          <TextField label="Tu respuesta" multiline rows={2} maxLength={meetingLimits.answer} value={reply} onChange={setReply} />
          <div className="flex gap-[8px]"><Button size="sm" type="submit" disabled={busy || !reply.trim()} icon={<Send size={14} aria-hidden="true" />}>Responder</Button><Button size="sm" variant="text" onClick={() => setReply(null)}>Cancelar</Button></div>
        </form>
      ) : (
        <div className={styles.questionActions}>
          <Button size="sm" variant="text" icon={<MessageSquareReply size={15} aria-hidden="true" />} onClick={() => setReply("")}>Responder</Button>
          <Button size="sm" variant={item.resolved ? "text" : "soft"} disabled={busy} icon={item.resolved ? <RotateCcw size={15} aria-hidden="true" /> : <CircleCheck size={15} aria-hidden="true" />} onClick={() => void onChange({ type: "resolve", resolved: !item.resolved })}>
            {item.resolved ? "Reabrir" : "Marcar resuelta"}
          </Button>
        </div>
      )}
    </li>
  );
}
