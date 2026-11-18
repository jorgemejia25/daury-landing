import { checkServer, mount } from "@ui-sdk/core/testing";
import { expect, test, vi } from "vitest";
import { markdownControl } from "./markdown-control";

test("el control comunica cambios y conserva el valor controlado hasta recibir nuevas propiedades", () => {
  const changed = vi.fn();
  const view = mount(markdownControl, { value: "original", onValueChange: changed }, '<root aria-label="Contenido Markdown"></root>');
  try { view.api.setValue("borrador"); expect(changed).toHaveBeenCalledWith("borrador", expect.objectContaining({ reason: "input-change" })); expect(view.state.value).toBe("original"); }
  finally { view.unmount(); }
});
test("el control protege el documento durante un guardado y rechaza contenido excesivo", () => {
  const changed = vi.fn();
  const view = mount(markdownControl, { value: "original", readOnly: true, onValueChange: changed }, '<root aria-label="Contenido Markdown"></root>');
  try { view.api.setValue("otro"); expect(changed).not.toHaveBeenCalled(); }
  finally { view.unmount(); }
  const editable = mount(markdownControl, { onValueChange: changed }, '<root aria-label="Contenido Markdown"></root>');
  try { expect(() => editable.api.setValue("x".repeat(100001))).toThrow(/100 000/); expect(changed).not.toHaveBeenCalled(); }
  finally { editable.unmount(); }
});
test("el control se puede representar en el servidor en ambas direcciones", () => {
  for (const dir of ["ltr", "rtl"]) expect(checkServer(markdownControl, { value: "documento" }, `<root dir="${dir}" aria-label="Contenido Markdown"></root>`)).toContain('aria-label="Contenido Markdown"');
});
