"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Check, ChevronRight, Circle, Plus, X } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { IconButton } from "@/ui/atoms/IconButton";
import { ColorField } from "@/ui/molecules/ColorField";
import { TextField } from "@/ui/molecules/TextField";
import { colors, defaultColumns, type Board, type Entity } from "@/features/admin/lib/workspace";
import { EditorSection } from "./EditorSection";
import { FormPage } from "./FormPage";
import { useEditorSave } from "./useEditorSave";
import styles from "./Editor.styles";

type BoardFormProps = { initial?: Entity<"boards">; onClose: () => void; onSaved: (id: string) => void };

/** Crear o configurar un tablero: datos básicos, color y columnas ordenables. */
export function BoardForm({ initial, onClose, onSaved }: BoardFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [color, setColor] = useState<string>(initial?.color ?? "blue");
  const [columns, setColumns] = useState<Board["columns"]>(() => structuredClone(initial?.columns ?? defaultColumns.columns));
  const [order, setOrder] = useState<string[]>(() => [...(initial?.columnOrder ?? defaultColumns.columnOrder)]);
  const editor = useEditorSave("boards", initial);
  const current = useMemo(() => ({ name, description, color, columns, columnOrder: order }), [name, description, color, columns, order]);
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(current));
  const dirty = JSON.stringify(current) !== snapshot;

  const update = (id: string, values: Partial<Board["columns"][string]>) => setColumns({ ...columns, [id]: { ...columns[id], ...values } });
  const move = (index: number, direction: number) => {
    const next = [...order];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    setOrder(next);
  };
  const remove = (id: string) => {
    const next = { ...columns };
    delete next[id];
    setColumns(next);
    setOrder(order.filter((value) => value !== id));
  };
  const add = () => {
    const id = crypto.randomUUID();
    setColumns({ ...columns, [id]: { name: "Nueva columna", done: false } });
    setOrder([...order, id]);
  };

  return (
    <FormPage
      title={`${initial ? "Configurar" : "Crear"} tablero`}
      breadcrumb={<><span>Kanban</span><ChevronRight size={13} aria-hidden="true" /><b>{initial?.name ?? "Nuevo tablero"}</b></>}
      backLabel="Volver al tablero"
      section="Tablero"
      saveLabel="Guardar tablero"
      initial={initial}
      stale={editor.stale}
      busy={editor.busy}
      error={editor.error}
      dirty={dirty}
      onClose={onClose}
      onSave={() => editor.save(current, (id) => { setSnapshot(JSON.stringify(current)); onSaved(id); })}
      after={<EditorSection label="Columnas" right={`${order.length} de 12`}>
        <p className={styles.hint}>Marca como completadas las columnas de trabajo terminado. Mueve sus tareas antes de quitar una columna.</p>
        <ol className={`m-0 p-0 list-none ${styles.rows}`}>
          {order.map((id, index) => (
            <li key={id} className={styles.row}>
              <span className={styles.rowIndex} aria-hidden="true">{index + 1}</span>
              <input
                className={styles.rowInput}
                aria-label={`Nombre de columna ${index + 1}`}
                value={columns[id].name}
                maxLength={60}
                required
                onChange={(event) => update(id, { name: event.target.value })}
              />
              <button
                type="button"
                className={styles.doneToggle}
                aria-pressed={columns[id].done}
                aria-label={`Trabajo completado en ${columns[id].name || "columna"}`}
                onClick={() => update(id, { done: !columns[id].done })}
              >
                {columns[id].done ? <Check size={14} strokeWidth={2.8} aria-hidden="true" /> : <Circle size={13} strokeWidth={2.4} aria-hidden="true" />}
                Completada
              </button>
              <IconButton variant="plain" aria-label={`Subir columna ${index + 1}`} disabled={index === 0} onClick={() => move(index, -1)}>
                <ArrowUp size={15} strokeWidth={2.2} aria-hidden="true" />
              </IconButton>
              <IconButton variant="plain" aria-label={`Bajar columna ${index + 1}`} disabled={index === order.length - 1} onClick={() => move(index, 1)}>
                <ArrowDown size={15} strokeWidth={2.2} aria-hidden="true" />
              </IconButton>
              <IconButton variant="plain" aria-label={`Quitar columna ${index + 1}`} disabled={order.length === 1} onClick={() => remove(id)}>
                <X size={15} strokeWidth={2.2} aria-hidden="true" />
              </IconButton>
            </li>
          ))}
        </ol>
        <Button variant="soft" size="sm" disabled={order.length >= 12} onClick={add} icon={<Plus size={16} strokeWidth={2.4} aria-hidden="true" />}>
          Agregar columna
        </Button>
      </EditorSection>}
    >
      <TextField label="Nombre" value={name} onChange={setName} maxLength={120} required placeholder="Ej.: Lanzamiento de la app" />
      <TextField label="Descripción" value={description} onChange={setDescription} multiline maxLength={3000} placeholder="Para qué sirve este tablero" />
      <ColorField label="Color" value={color} options={colors} onChange={setColor} />
    </FormPage>
  );
}
