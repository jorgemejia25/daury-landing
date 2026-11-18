// CodeMirror owns its editing behavior; Tailwind supplies Daury's editor theme.
export const markdownSourceClass = [
  "h-full [&_.cm-editor]:h-full! [&_.cm-editor]:bg-surface! [&_.cm-editor]:text-ink! [&_.cm-editor]:text-[14px]!",
  "[&_.cm-scroller]:overflow-auto! [&_.cm-scroller]:font-mono! [&_.cm-scroller]:leading-[1.85]!",
  "[&_.cm-content]:[padding:20px_20px_160px]! [&_.cm-content]:[caret-color:var(--blue)]! [&_.cm-content]:min-h-full!",
  "[&_.cm-gutters]:bg-surface! [&_.cm-gutters]:text-ink-soft! [&_.cm-gutters]:[border-right:1px_solid_var(--rule)]!",
  "[&_.cm-lineNumbers_.cm-gutterElement]:[padding:0_12px_0_16px]!",
  "[&_.cm-activeLine]:bg-brand-soft! [&_.cm-activeLineGutter]:bg-brand-soft!",
  "[&_.cm-editor.cm-focused]:outline-none! [&_.cm-editor.cm-focused_.cm-cursor]:[border-left-color:var(--blue)]!",
  "[&_.cm-selectionBackground]:bg-[#d6e0fc]! [&_.cm-searchMatch]:bg-[var(--amber-soft)]! [&_.cm-searchMatch]:[outline:1px_solid_var(--amber-deep)]!",
  "[&_.cm-panels]:bg-canvas! [&_.cm-panels]:text-ink!",
  "[&_.cm-textfield]:text-ink! [&_.cm-textfield]:bg-surface! [&_.cm-textfield]:[border:1px_solid_var(--ink-soft)]! [&_.cm-textfield]:rounded-[6px]!",
].join(" ");
