"use client";

import CodeMirror from "@uiw/react-codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { undo, redo } from "@codemirror/commands";
import { openSearchPanel, closeSearchPanel, searchPanelOpen } from "@codemirror/search";
import { useEffect, useMemo, useRef } from "react";
import { markdownSourceClass } from "./markdown-source-styles";
import { formatMarkdown, type MarkdownFormat } from "@/features/admin/lib/markdown-editor";

export type MarkdownSourceApi = { format: (action: MarkdownFormat) => void; undo: () => void; redo: () => void; search: () => void; escape: () => boolean; jumpToLine: (line: number) => void };
type Props = { value: string; onChange: (value: string) => void; onReady: (api: MarkdownSourceApi | null) => void; readOnly: boolean; visible: boolean };


export default function MarkdownSource({ value, onChange, onReady, readOnly, visible }: Props) {
  const view = useRef<EditorView | null>(null);
  const extensions = useMemo(() => [markdown(), EditorView.lineWrapping, EditorState.tabSize.of(2), EditorView.contentAttributes.of({ "aria-label": "Contenido Markdown", "aria-multiline": "true", spellcheck: "false" }), keymap.of([
    { key: "Mod-b", run: (editor) => { insertFormat(editor, "bold"); return true; } },
    { key: "Mod-i", run: (editor) => { insertFormat(editor, "italic"); return true; } },
  ])], []);
  useEffect(() => { if (visible) view.current?.requestMeasure(); }, [visible]);
  useEffect(() => () => onReady(null), [onReady]);
  function created(editor: EditorView) {
    view.current = editor;
    onReady({
      format: (action) => insertFormat(editor, action),
      undo: () => { undo(editor); editor.focus(); },
      redo: () => { redo(editor); editor.focus(); },
      search: () => { openSearchPanel(editor); },
      escape: () => { if (!searchPanelOpen(editor.state)) return false; closeSearchPanel(editor); editor.focus(); return true; },
      jumpToLine: (line) => { const target = editor.state.doc.line(Math.min(Math.max(1, line), editor.state.doc.lines)); editor.dispatch({ selection: { anchor: target.from }, scrollIntoView: true }); editor.focus(); },
    });
  }
  return <CodeMirror value={value} onChange={onChange} onCreateEditor={created} extensions={extensions} theme="none" className={markdownSourceClass} editable={!readOnly} readOnly={readOnly} height="100%" indentWithTab={false} basicSetup={{ foldGutter: true, highlightActiveLine: true, autocompletion: false }} />;
}
function insertFormat(view: EditorView, action: MarkdownFormat) {
  if (view.state.readOnly) return;
  const selection = view.state.selection.main, change = formatMarkdown(view.state.doc.toString(), selection.from, selection.to, action);
  view.dispatch({ changes: { from: change.from, to: change.to, insert: change.insert }, selection: { anchor: change.anchor, head: change.head }, userEvent: "input", scrollIntoView: true });
  view.focus();
}
