"use client";

import dynamic from "next/dynamic";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { EditorPage } from "./EditorPage";
import { AlertDialog, AlertDialogClose, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@ui-sdk/react/alert-dialog";
import { FileInput, FileInputTrigger } from "@ui-sdk/react/file-input";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";
import { SegmentedControl, SegmentedControlItem } from "@ui-sdk/react/segmented-control";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/react/toolbar";
import { Bold, Italic, Strikethrough, Heading2, List, ListOrdered, ListTodo, Quote, Link2, Image, Code, SquareCode, Table2, Minus, Undo2, Redo2, Search, Upload, Download, Settings2, Columns2, Eye, PenLine } from "lucide-react";
import { Button } from "@/ui/atoms/Button";
import { IconButton } from "@/ui/atoms/IconButton";
import { SelectField } from "@/ui/molecules/SelectField";
import { TagsField } from "@/ui/molecules/TagsField";
import { TextField } from "@/ui/molecules/TextField";
import { folderPath, type Entity } from "@/features/admin/lib/workspace";
import { collectHeadings, exportMarkdown, markdownFileName, MAX_MARKDOWN_BYTES, MAX_MARKDOWN_LENGTH, readMarkdownFile, type ImportedMarkdown, type MarkdownFormat } from "@/features/admin/lib/markdown-editor";
import { Attribution } from "../workspace/Attribution";
import { useEditorSave } from "./useEditorSave";
import { MarkdownControl } from "./markdown/markdown-control";
import { MarkdownPreview } from "./markdown/MarkdownPreview";
import type { MarkdownSourceApi } from "./markdown/MarkdownSource";
import styles from "./markdown/ArticleStudio.styles";

const MarkdownSource = dynamic(() => import("./markdown/MarkdownSource"), { ssr: false, loading: () => <p className={styles.notice} role="status">Preparando el editor…</p> });
type Props = { initial?: Entity<"wikiPages">; body?: string; folders: Entity<"folders">[]; defaults?: { folderId?: string }; onClose: () => void; onSaved: (id: string) => void };
type Draft = { title: string; description: string; folderId: string; tags: string[]; body: string };
const formats: { action: MarkdownFormat; label: string; icon: typeof Bold }[] = [
  { action: "heading", label: "Encabezado", icon: Heading2 }, { action: "bold", label: "Negrita", icon: Bold }, { action: "italic", label: "Cursiva", icon: Italic }, { action: "strike", label: "Tachado", icon: Strikethrough },
  { action: "bullet", label: "Lista de viñetas", icon: List }, { action: "ordered", label: "Lista numerada", icon: ListOrdered }, { action: "task", label: "Lista de tareas", icon: ListTodo }, { action: "quote", label: "Cita", icon: Quote },
  { action: "link", label: "Insertar enlace", icon: Link2 }, { action: "image", label: "Insertar imagen por URL", icon: Image }, { action: "inline-code", label: "Código en línea", icon: Code }, { action: "code", label: "Bloque de código", icon: SquareCode }, { action: "table", label: "Insertar tabla", icon: Table2 }, { action: "rule", label: "Separador", icon: Minus },
];

export function ArticleForm({ initial, body = "", folders, defaults, onClose, onSaved }: Props) {
  const [draft, setDraft] = useState<Draft>(() => ({ title: initial?.title ?? "", description: initial?.description ?? "", folderId: initial?.folderId ?? defaults?.folderId ?? "", tags: initial?.tags ?? [], body }));
  const draftRef = useRef(draft);
  const [baseline] = useState(() => JSON.stringify(draft));
  const [mode, setMode] = useState("split");
  const [properties, setProperties] = useState(false);
  const [ready, setReady] = useState(false);
  const [reading, setReading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [imported, setImported] = useState("");
  const [localError, setLocalError] = useState("");
  const [pending, setPending] = useState<{ kind: "import"; file: ImportedMarkdown } | null>(null);
  const source = useRef<MarkdownSourceApi | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const live = useRef(true);
  const editor = useEditorSave("wikiPages", initial);
  const deferredBody = useDeferredValue(draft.body);
  const headings = useMemo(() => collectHeadings(deferredBody), [deferredBody]);
  const dirty = JSON.stringify(draft) !== baseline;
  const tooLong = draft.body.length > MAX_MARKDOWN_LENGTH;
  const words = draft.body.trim().split(/\s+/).filter(Boolean).length;
  const canSave = Boolean(draft.title.trim() && draft.body.trim() && !tooLong && !editor.busy && !reading);
  const onReady = useCallback((api: MarkdownSourceApi | null) => { source.current = api; setReady(Boolean(api)); }, []);
  useEffect(() => { live.current = true; return () => { live.current = false; }; }, []);
  useEffect(() => {
    if (!dirty) return;
    const prevent = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") { event.preventDefault(); if (!editor.busy && !reading && !pending) void save(); }
      if (event.key === "Escape" && source.current?.escape()) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener("keydown", shortcut, true);
    return () => window.removeEventListener("keydown", shortcut, true);
  });
  function update<K extends keyof Draft>(key: K, value: Draft[K]) { const next = { ...draftRef.current, [key]: value }; draftRef.current = next; setDraft(next); }
  async function save() {
    const current = draftRef.current;
    if (!current.title.trim() || !current.body.trim() || current.body.length > MAX_MARKDOWN_LENGTH) { setLocalError("Escribe un título y contenido de hasta 100 000 caracteres antes de guardar."); return; }
    setLocalError("");
    await editor.save(current, onSaved);
  }
  function applyImport(file: ImportedMarkdown) {
    const current = draftRef.current;
    const next = { ...current, body: file.body, title: current.title.trim() ? current.title : file.title, description: current.description.trim() ? current.description : file.description, tags: current.tags.length ? current.tags : file.tags };
    draftRef.current = next; setDraft(next); setImported(file.fileName); setLocalError("");
  }
  async function receiveFile(file: File) {
    setReading(true); setLocalError("");
    try {
      const parsed = await readMarkdownFile(file);
      if (!live.current) return;
      if (draftRef.current.body.trim() && draftRef.current.body !== parsed.body) setPending({ kind: "import", file: parsed });
      else applyImport(parsed);
    } catch (error) { if (live.current) setLocalError(error instanceof Error ? error.message : "No se pudo leer el archivo."); }
    finally { if (live.current) { setReading(false); setFiles([]); } }
  }
  function download() {
    const current = draftRef.current, blob = new Blob([exportMarkdown(current.title, current.description, current.tags, current.body)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob), link = document.createElement("a"); link.href = url; link.download = markdownFileName(current.title); link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function jump(line: number, id: string) { if (mode !== "preview") source.current?.jumpToLine(line); preview.current?.querySelector(`#article-preview-${CSS.escape(id)}`)?.scrollIntoView({ block: "start" }); }

  return <>
    <EditorPage title={initial ? "Editar artículo" : "Crear artículo"} heading={initial ? "Editar artículo" : "Nuevo artículo"} backLabel="Volver a documentación" saveLabel="Guardar artículo" busy={editor.busy || reading} saveDisabled={!canSave} dirty={dirty} isNew={!initial} stale={editor.stale} error={localError || editor.error || (tooLong ? "El contenido supera los 100 000 caracteres." : "")} layout="document" onClose={onClose} onSave={() => void save()} breadcrumb={<><span>Documentación</span><ChevronRight size={15} aria-hidden="true" /><b>{initial ? "Editar artículo" : "Nuevo artículo"}</b></>} actions={<div className={styles.actions}>            <FileInput aria-label="Importación de Markdown" accept={[".md", ".markdown"]} maxSize={MAX_MARKDOWN_BYTES} maxFiles={1} value={files} disabled={editor.busy || reading} onValueChange={(value) => { setFiles(value); if (value[0]) void receiveFile(value[0]); }} onReject={() => setLocalError("Selecciona un archivo .md o .markdown de hasta 400 KB.")}>
              <FileInputTrigger className={styles.fileTrigger} aria-label="Importar archivo Markdown" title="Importar archivo .md"><Upload size={15} aria-hidden="true" /><span>Importar .md</span></FileInputTrigger>
            </FileInput>
            <IconButton aria-label="Descargar Markdown" title="Descargar Markdown" disabled={!draft.body.trim()} onClick={download}><Download size={16} aria-hidden="true" /></IconButton>
</div>} aside={properties ? <div id="article-properties" className={styles.inspector} aria-label="Propiedades del artículo"><h2>Propiedades</h2>
            <SelectField label="Carpeta del artículo" value={draft.folderId} fallback="" options={[{ value: "", label: "Sin carpeta" }, ...folders.filter((folder) => !folder.archived).map((folder) => ({ value: folder.id, label: folderPath(folders, folder.id) }))]} onChange={(value) => update("folderId", value)} />
            <TextField label="Descripción" value={draft.description} onChange={(value) => update("description", value)} multiline maxLength={3000} placeholder="Resumen del artículo" />
            <TagsField label="Etiquetas" value={draft.tags} onChange={(value) => update("tags", value)} />
            {initial ? <Attribution item={initial} detailed /> : null}
            <div className={styles.outline}><h2>Contenido</h2>{headings.length ? headings.map((heading) => <Button key={heading.id} variant="text" size="sm" className={styles.outlineLink} data-level={heading.level} onClick={() => jump(heading.line, heading.id)}>{heading.text}</Button>) : <span className={styles.status}>Agrega encabezados para organizar el artículo.</span>}</div>
          </div> : null}>
      <div className={styles.studio}>
        <div className={styles.titleRow}>
          <Field className={styles.titleField}><FieldLabel className="sr-only">Título</FieldLabel><Input id="article-title" className={styles.title} value={draft.title} onValueChange={(value) => update("title", value)} maxLength={200} required placeholder="Título del artículo" disabled={editor.busy} /></Field>
          <div className={styles.actions}>
            <SegmentedControl className={styles.views} aria-label="Vista del editor" value={mode} onValueChange={(value) => setMode(value ?? "split")}>
              <SegmentedControlItem className={styles.view} value="write"><PenLine size={16} aria-hidden="true" />Escribir</SegmentedControlItem>
              <SegmentedControlItem className={styles.view} value="split"><Columns2 size={16} aria-hidden="true" />Dividido</SegmentedControlItem>
              <SegmentedControlItem className={styles.view} value="preview"><Eye size={16} aria-hidden="true" />Vista previa</SegmentedControlItem>
            </SegmentedControl>
            <Button variant={properties ? "soft" : "secondary"} size="sm" aria-expanded={properties} aria-controls="article-properties" icon={<Settings2 size={16} aria-hidden="true" />} onClick={() => setProperties(!properties)}>Propiedades</Button>
          </div>
        </div>
        <div className={styles.toolbarRow}>
          <Toolbar className={styles.toolbar} aria-label="Formato Markdown">
            <ToolbarButton className={styles.tool} aria-label="Deshacer" title="Deshacer (⌘/Ctrl Z)" disabled={!ready || editor.busy || mode === "preview"} onClick={() => source.current?.undo()}><Undo2 size={17} aria-hidden="true" /></ToolbarButton>
            <ToolbarButton className={styles.tool} aria-label="Rehacer" title="Rehacer (⌘/Ctrl Shift Z)" disabled={!ready || editor.busy || mode === "preview"} onClick={() => source.current?.redo()}><Redo2 size={17} aria-hidden="true" /></ToolbarButton>
            <ToolbarSeparator className={styles.separator} />
            {formats.map(({ action, label, icon: Icon }) => <ToolbarButton className={styles.tool} key={action} aria-label={label} title={label} disabled={!ready || editor.busy || mode === "preview"} onClick={() => source.current?.format(action)}><Icon size={17} aria-hidden="true" /></ToolbarButton>)}
            <ToolbarSeparator className={styles.separator} /><ToolbarButton className={styles.tool} aria-label="Buscar y reemplazar" title="Buscar y reemplazar (⌘/Ctrl F)" disabled={!ready || mode === "preview"} onClick={() => source.current?.search()}><Search size={17} aria-hidden="true" /></ToolbarButton>
          </Toolbar>
          <span className={styles.status}>Markdown · UTF-8</span>
        </div>
        {reading ? <p className={styles.notice} role="status">Leyendo el archivo…</p> : imported ? <p className={styles.notice} role="status">Importado: {imported}. Revisa el borrador y guarda cuando esté listo.</p> : null}
        <div className={styles.body}>
          <div className={styles.panes} data-mode={mode}>
            <section className={`${styles.pane} ${styles.sourcePane}`} aria-label="Escritura Markdown"><h2 className={styles.paneHeading}>Markdown</h2><MarkdownControl className={styles.source} aria-label="Contenido Markdown" value={draft.body} readOnly={editor.busy} onValueChange={(value) => update("body", value)}><MarkdownSource value={draft.body} onChange={(value) => update("body", value)} onReady={onReady} readOnly={editor.busy} visible={mode !== "preview"} /></MarkdownControl></section>
            <section className={`${styles.pane} ${styles.previewPane}`} aria-label="Vista previa del artículo"><h2 className={styles.paneHeading}>Vista previa</h2><div ref={preview} className={styles.preview}><MarkdownPreview body={deferredBody} /></div></section>
          </div>

        </div>
        <footer className={styles.footer}><span>{words.toLocaleString("es-GT")} palabras · {draft.body.length.toLocaleString("es-GT")} / 100 000 caracteres</span><span>⌘/Ctrl S para guardar · Tab para salir del texto</span></footer>
      </div>
    </EditorPage>
    <AlertDialog open={Boolean(pending)} onOpenChange={(open, details) => { if (open) return; const action = pending; setPending(null); if (details.returnValue === "confirm") { if (action?.kind === "import") applyImport(action.file); } }}>
      <AlertDialogContent className={styles.confirm} keepMounted><AlertDialogTitle>¿Reemplazar el contenido?</AlertDialogTitle><AlertDialogDescription>El archivo seleccionado reemplazará el texto del borrador. El artículo guardado en Firebase se conserva hasta que vuelvas a guardar.</AlertDialogDescription><div className={styles.actions}><AlertDialogClose className={styles.confirmCancel}>Seguir editando</AlertDialogClose><AlertDialogClose className={styles.confirmAccept} value="confirm" data-agent-confirm="Reemplaza el texto del borrador por el archivo Markdown seleccionado.">Reemplazar contenido</AlertDialogClose></div></AlertDialogContent>
    </AlertDialog>
  </>;
}
