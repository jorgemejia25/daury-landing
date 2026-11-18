"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useDraft } from "./useDraft";
import { ColorField } from "@/ui/molecules/ColorField";
import { SelectField } from "@/ui/molecules/SelectField";
import { TextField } from "@/ui/molecules/TextField";
import { colors, folderDescendants, folderPath, type Entity } from "@/features/admin/lib/workspace";
import { FormPage } from "./FormPage";
import { useEditorSave } from "./useEditorSave";

type CalendarFormProps = { kind: "calendars"; initial?: Entity<"calendars">; folders?: never };
type WhiteboardFormProps = { kind: "whiteboards"; initial?: Entity<"whiteboards">; folders?: never };
type FolderFormProps = { kind: "folders"; initial?: Entity<"folders">; folders: Entity<"folders">[]; defaults?: { parentId?: string } };
type Props = (CalendarFormProps | WhiteboardFormProps | FolderFormProps) & { onClose: () => void; onSaved: (id: string) => void };

/** Calendarios, pizarras y carpetas: nombre, color y, en carpetas, la carpeta superior. */
export function CollectionForm(props: Props) {
  const { kind, initial, onClose, onSaved } = props;
  const { draft, set, latest } = useDraft(() => ({
    name: initial?.name ?? "",
    description: kind !== "folders" ? (props.initial?.description ?? "") : "",
    color: (initial?.color ?? "blue") as string,
    parentId: kind === "folders" ? (props.initial?.parentId ?? props.defaults?.parentId ?? "") : "",
  }));
  const editor = useEditorSave(kind, initial);
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(latest.current));
  const dirty = useMemo(() => JSON.stringify(draft) !== snapshot, [draft, snapshot]);
  const section = kind === "calendars" ? "Calendarios" : kind === "whiteboards" ? "Brainstorm" : "Documentación";
  const noun = kind === "calendars" ? "calendario" : kind === "whiteboards" ? "pizarra" : "carpeta";
  const forbidden = kind === "folders" && initial ? folderDescendants(props.folders, initial.id) : new Set<string>();

  return (
    <FormPage
      title={`${initial ? "Editar" : "Crear"} ${noun}`}
      breadcrumb={<><span>{section}</span><ChevronRight size={13} aria-hidden="true" /><b>{initial?.name ?? (kind === "calendars" ? "Nuevo calendario" : kind === "whiteboards" ? "Nueva pizarra" : "Nueva carpeta")}</b></>}
      backLabel={kind === "calendars" ? "Volver a calendarios" : kind === "whiteboards" ? "Volver a brainstorm" : "Volver a documentación"}
      section={kind === "calendars" ? "Calendario" : kind === "whiteboards" ? "Pizarra" : "Carpeta"}
      saveLabel={`Guardar ${noun}`}
      initial={initial}
      stale={editor.stale}
      busy={editor.busy}
      error={editor.error}
      dirty={dirty}
      onClose={onClose}
      onSave={() => { const { name, description, color, parentId } = latest.current; void editor.save(kind !== "folders" ? { name, description, color } : { name, color, parentId }, (id) => { setSnapshot(JSON.stringify(latest.current)); onSaved(id); }); }}
    >
      <TextField label="Nombre" value={draft.name} onChange={(value) => set("name", value)} required maxLength={120} placeholder={kind === "calendars" ? "Ej.: Reuniones del equipo" : kind === "whiteboards" ? "Ej.: Nombre de la mascota" : "Ej.: Marketing"} />
      {kind !== "folders" ? <TextField label="Descripción" value={draft.description} onChange={(value) => set("description", value)} multiline maxLength={3000} /> : null}
      {kind === "folders" ? (
        <SelectField
          label="Carpeta superior"
          value={draft.parentId}
          fallback=""
          options={[
            { value: "", label: "Sin carpeta" },
            ...props.folders.filter((folder) => !folder.archived && !forbidden.has(folder.id)).map((folder) => ({ value: folder.id, label: folderPath(props.folders, folder.id) })),
          ]}
          onChange={(value) => set("parentId", value)}
        />
      ) : null}
      <ColorField label="Color" value={draft.color} options={colors} onChange={(value) => set("color", value)} />
    </FormPage>
  );
}
