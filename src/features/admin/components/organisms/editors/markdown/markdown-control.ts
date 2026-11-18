import { createChange, definePrimitive, type ChangeDetails } from "@ui-sdk/core";
import { createParts } from "@ui-sdk/react/primitive";
import { MAX_MARKDOWN_LENGTH } from "@/features/admin/lib/markdown-editor";

type Options = { value?: string; readOnly?: boolean; onValueChange?: (value: string, details: ChangeDetails<"input-change">) => void };
// CodeMirror controla el teclado y la semántica del textbox; el primitive expone su valor a los agentes.
export const markdownControl = definePrimitive({
  name: "markdown-editor",
  options: { value: "string", readOnly: "boolean", onValueChange: "callback" },
  controlled: ["value"],
  state: (options: Options) => ({ value: options.value ?? "", readOnly: options.readOnly ?? false }),
  sync: (options) => ({ ...(options.value !== undefined ? { value: options.value } : {}), readOnly: options.readOnly ?? false }),
  api: (context) => {
    const change = createChange(context);
    return { setValue(value: string) {
      if (context.options().readOnly) return;
      if (typeof value !== "string" || value.length > MAX_MARKDOWN_LENGTH) throw new Error("El artículo admite hasta 100 000 caracteres.");
      change("value", value, { reason: "input-change" });
    } };
  },
  slots: (slot) => ({ root: slot({ attrs: () => ({}) }) }),
  agent: { actions: ["setValue"] },
});
export const { Root: MarkdownControl } = createParts(markdownControl, { root: "div" });
