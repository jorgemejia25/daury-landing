"use client";

import { useMemo, useState } from "react";
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { CalendarDays, Check, ChevronRight, CircleDashed, FileText, Flag, Gauge, Plus, Send, Shapes, SquareKanban, Tag, UserRound, X } from "lucide-react";
import { Avatar } from "@/ui/atoms/Avatar";
import { Button } from "@/ui/atoms/Button";
import { IconButton } from "@/ui/atoms/IconButton";
import { ProgressBar } from "@/ui/atoms/ProgressBar";
import { DateField } from "@/ui/molecules/DateField";
import { NumberField } from "@/ui/molecules/NumberField";
import { SegmentedField } from "@/ui/molecules/SegmentedField";
import { SelectField } from "@/ui/molecules/SelectField";
import { TagsField } from "@/ui/molecules/TagsField";
import { TextField } from "@/ui/molecules/TextField";
import { addTaskComment } from "@/features/admin/actions/workspace";
import { memberOptions, personName } from "@/features/admin/lib/people";
import { taskTypes, type Entity, type WorkTask } from "@/features/admin/lib/workspace";
import { Attribution } from "../workspace/Attribution";
import { EditorPage, type EditorNav } from "./EditorPage";
import { EditorSection } from "./EditorSection";
import { FormSheet, PropertyList, PropertyRow } from "./FormLayout";
import { useDraft } from "./useDraft";
import { useEditorSave } from "./useEditorSave";
import styles from "./TaskForm.styles";

type TaskFormProps = {
  initial?: Entity<"tasks">;
  boards: Entity<"boards">[];
  pages: Entity<"wikiPages">[];
  defaults?: { boardId?: string; status?: string };
  nav?: EditorNav;
  /** Menú de acciones del encabezado (archivar). */
  actions?: React.ReactNode;
  onClose: () => void;
  onSaved: (id: string, data: Record<string, unknown>) => void;
};

const priorities = [
  { value: "high", label: "Alta", tone: "coral" as const },
  { value: "medium", label: "Media", tone: "amber" as const },
  { value: "low", label: "Baja", tone: "neutral" as const },
];

/** Tarea como pantalla: título y descripción, subtareas y comentarios; estado, prioridad y detalles al lado. */
export function TaskForm({ initial, boards, pages, defaults, nav, actions, onClose, onSaved }: TaskFormProps) {
  const activeBoards = boards.filter((board) => !board.archived);
  const firstBoard = boards.find((board) => board.id === (initial?.boardId ?? defaults?.boardId)) ?? activeBoards[0];
  const { draft, set, patch, latest } = useDraft(() => ({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    boardId: firstBoard?.id ?? "",
    status: initial?.status ?? defaults?.status ?? firstBoard?.columnOrder[0] ?? "",
    priority: initial?.priority ?? "medium",
    type: initial?.type ?? "task",
    assignee: initial?.assignee ?? "",
    dueDate: initial?.dueDate ?? "",
    points: initial?.points ?? 0,
    tags: initial?.tags ?? [],
    articleId: initial?.articleId ?? "",
    checklist: (initial?.checklist ?? []) as WorkTask["checklist"],
  }));
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(latest.current));
  const [comment, setComment] = useState("");
  const editor = useEditorSave("tasks", initial);
  const board = boards.find((item) => item.id === draft.boardId);
  const done = draft.checklist.filter((item) => item.done).length;
  const dirty = useMemo(() => JSON.stringify(draft) !== snapshot, [draft, snapshot]);
  const key = initial ? initial.id.slice(0, 6).toUpperCase() : "Nueva";

  function save() {
    const current = latest.current;
    const data = { ...current, points: Math.round(current.points) };
    void editor.save(data, (id) => { setSnapshot(JSON.stringify(latest.current)); onSaved(id, data); });
  }

  return (
    <EditorPage
      title={`${initial ? "Editar" : "Crear"} tarea`}
      heading={initial ? "Editar tarea" : "Nueva tarea"}
      backLabel="Volver al tablero"
      breadcrumb={
        <>
          <span>Kanban</span>
          <ChevronRight size={13} aria-hidden="true" />
          <span>{board?.name ?? "Tablero"}</span>
          <ChevronRight size={13} aria-hidden="true" />
          <b>{key}</b>
        </>
      }
      saveLabel={initial ? "Guardar tarea" : "Crear tarea"}
      busy={editor.busy}
      error={editor.error}
      dirty={dirty}
      isNew={!initial}
      stale={editor.stale}
      nav={nav}
      actions={actions}
      onSave={save}
      onClose={onClose}
      aside={null}
    >
      <FormSheet
        footer={
          <>
            <span className={styles.footItem}><SquareKanban size={14} aria-hidden="true" />{board?.name ?? "Sin tablero"}</span>
            <span className={styles.footItem}><CircleDashed size={14} aria-hidden="true" />{board?.columns[draft.status]?.name ?? "Sin estado"}</span>
            {initial ? <span className={styles.footMeta}><Attribution item={initial} /></span> : null}
          </>
        }
      >
        <TextField label="Título" hideLabel appearance="title" value={draft.title} onChange={(value) => set("title", value)} required placeholder="Título de la tarea" />
        <TextField label="Descripción" hideLabel appearance="plain" value={draft.description} onChange={(value) => set("description", value)} multiline rows={3} maxLength={12000} placeholder="Añade contexto, criterios de aceptación o enlaces…" />
      </FormSheet>

      <PropertyList title="Propiedades">
        <PropertyRow label="Estado" icon={<CircleDashed />}>
          <SelectField label="Estado" hideLabel value={draft.status} fallback={board?.columnOrder[0] ?? ""} options={board?.columnOrder.map((id) => ({ value: id, label: board.columns[id].done ? `${board.columns[id].name} · terminada` : board.columns[id].name })) ?? []} onChange={(value) => set("status", value)} />
        </PropertyRow>
        <PropertyRow label="Prioridad" icon={<Flag />}>
          <SegmentedField label="Prioridad" hideLabel value={draft.priority} options={priorities} onChange={(value) => set("priority", value as WorkTask["priority"])} />
        </PropertyRow>
        <PropertyRow label="Responsable" icon={<UserRound />}>
          <SelectField label="Responsable" hideLabel value={draft.assignee} options={memberOptions} fallback="" onChange={(value) => set("assignee", value)} />
        </PropertyRow>
        <PropertyRow label="Fecha límite" icon={<CalendarDays />}>
          <DateField label="Fecha límite" hideLabel clearable value={draft.dueDate} onChange={(value) => set("dueDate", value)} />
        </PropertyRow>
        <PropertyRow label="Tipo" icon={<Shapes />}>
          <SelectField label="Tipo de trabajo" hideLabel value={draft.type} options={taskTypes} onChange={(value) => set("type", value as WorkTask["type"])} />
        </PropertyRow>
        <PropertyRow label="Estimación" icon={<Gauge />}>
          <NumberField label="Estimación" hideLabel suffix="puntos" value={draft.points} onChange={(value) => set("points", value)} />
        </PropertyRow>
        <PropertyRow label="Tablero" icon={<SquareKanban />}>
          <SelectField
            label="Tablero"
            hideLabel
            value={draft.boardId}
            options={activeBoards.map((item) => ({ value: item.id, label: item.name }))}
            onChange={(value) => patch({ boardId: value, status: boards.find((item) => item.id === value)?.columnOrder[0] ?? "" })}
          />
        </PropertyRow>
        <PropertyRow label="Artículo" icon={<FileText />}>
          <SelectField
            label="Artículo relacionado"
            hideLabel
            value={draft.articleId}
            options={[{ value: "", label: "Sin artículo" }, ...pages.filter((page) => !page.archived).map((page) => ({ value: page.id, label: page.title }))]}
            fallback=""
            onChange={(value) => set("articleId", value)}
          />
        </PropertyRow>
        <PropertyRow label="Etiquetas" icon={<Tag />} wide>
          <TagsField label="Etiquetas" hideLabel placeholder="Escribe una etiqueta y presiona Enter" value={draft.tags} onChange={(value) => set("tags", value)} />
        </PropertyRow>
      </PropertyList>

      <EditorSection label="Subtareas" right={draft.checklist.length ? <span className={styles.count}>{done} de {draft.checklist.length}</span> : undefined}>
        {draft.checklist.length ? <ProgressBar value={done} max={draft.checklist.length} label="Subtareas completadas" tone="green" /> : null}
        {draft.checklist.length ? (
          <ul className={`m-0 p-0 list-none ${styles.rows}`}>
            {draft.checklist.map((item, index) => (
              <li key={item.id} className={styles.row}>
                <Checkbox
                  className={styles.check}
                  aria-label={`Completar subtarea ${index + 1}`}
                  checked={item.done}
                  onCheckedChange={(value) => set("checklist", draft.checklist.map((row) => (row.id === item.id ? { ...row, done: value === true } : row)))}
                >
                  <CheckboxIndicator><Check size={12} strokeWidth={3.2} aria-hidden="true" /></CheckboxIndicator>
                </Checkbox>
                <input
                  className={styles.rowInput}
                  data-done={item.done || undefined}
                  aria-label={`Subtarea ${index + 1}`}
                  value={item.title}
                  maxLength={200}
                  placeholder="Describe la subtarea"
                  onChange={(event) => set("checklist", draft.checklist.map((row) => (row.id === item.id ? { ...row, title: event.target.value } : row)))}
                />
                <IconButton variant="plain" aria-label={`Quitar subtarea ${index + 1}`} onClick={() => set("checklist", draft.checklist.filter((row) => row.id !== item.id))}>
                  <X size={18} strokeWidth={2.2} aria-hidden="true" />
                </IconButton>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Divide la tarea en pasos pequeños para seguir el avance.</p>
        )}
        <Button
          variant="soft"
          disabled={draft.checklist.length >= 30}
          icon={<Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
          onClick={() => set("checklist", [...draft.checklist, { id: crypto.randomUUID(), title: "", done: false }])}
        >
          Agregar subtarea
        </Button>
      </EditorSection>

      <EditorSection label="Comentarios" right={initial?.comments.length ? <span className={styles.count}>{initial.comments.length}</span> : undefined}>
        {initial ? (
          <>
            {initial.comments.length ? (
              <ul className={`m-0 p-0 list-none ${styles.comments}`} aria-label="Comentarios de la tarea">
                {initial.comments.map((entry) => (
                  <li key={entry.id} className={styles.comment}>
                    <Avatar name={personName(entry.author)} size={28} tone="violet" />
                    <div className={styles.commentBody}>
                      <span className={styles.commentMeta}>
                        <b>{personName(entry.author)}</b> · {new Date(entry.createdAt).toLocaleString("es-GT", { timeZone: "America/Guatemala", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <p>{entry.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>Todavía no hay comentarios.</p>
            )}
            <div className={styles.composer}>
              <TextField label="Nuevo comentario" hideLabel value={comment} onChange={setComment} multiline rows={2} maxLength={3000} placeholder="Escribe un comentario…" />
              <Button
                variant="soft"
                icon={<Send size={17} strokeWidth={2.2} aria-hidden="true" />}
                disabled={editor.busy || !comment.trim()}
                onClick={() => editor.run(() => addTaskComment(initial.id, editor.revision!, comment), () => setComment(""))}
              >
                Publicar comentario
              </Button>
            </div>
          </>
        ) : (
          <p className={styles.empty}>Crea la tarea para poder comentar.</p>
        )}
      </EditorSection>
    </EditorPage>
  );
}
