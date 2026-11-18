import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { sampleSticky, sampleWhiteboard } from "@/features/admin/lib/workspace.fixtures";
const { save, bulk, push } = vi.hoisted(() => ({ save: vi.fn(), bulk: vi.fn(), push: vi.fn() }));
vi.mock("@/features/admin/actions/workspace", () => ({ saveWorkspaceItem: save, archiveWorkspaceItem: vi.fn() }));
vi.mock("@/features/admin/actions/bulk", () => ({ bulkWorkspaceAction: bulk }));
vi.mock("next/navigation", async () => ({ useRouter: () => ({ push, replace: vi.fn() }), useSearchParams: (await import("@/test/search-params")).useTestSearchParams }));
vi.mock("@/features/admin/hooks/useWorkspace", () => ({
  useWorkspace: (kind: string) => ({ items: ({ whiteboards: [sampleWhiteboard], stickyNotes: [sampleSticky] } as Record<string, unknown[]>)[kind] ?? [], loading: false, error: "" }),
}));
import { BrainstormWorkspace } from "./Brainstorm";

beforeEach(() => { vi.clearAllMocks(); HTMLElement.prototype.setPointerCapture = () => {}; window.history.replaceState(null, "", "/admin/brainstorm"); save.mockResolvedValue({ ok: true, id: "nueva", revision: 1 }); bulk.mockResolvedValue({ ok: true, count: 1 }); });

test("muestra la pizarra con sus post-its y crea uno del color elegido en el panel", async () => {
  const user = userEvent.setup();
  render(<BrainstormWorkspace />);
  expect((screen.getByRole("textbox", { name: "Nombre de la pizarra" }) as HTMLInputElement).value).toBe(sampleWhiteboard.name);
  expect((screen.getByRole("textbox", { name: "Texto del post-it" }) as HTMLTextAreaElement).value).toBe("Daurisito");
  fireEvent.keyDown(document.body, { key: "n" });
  await user.click(await screen.findByRole("button", { name: "Color rosa" }));
  await user.click(screen.getByRole("button", { name: "Nuevo post-it" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith({ collection: "stickyNotes", id: expect.any(String), revision: 0, data: expect.objectContaining({ whiteboardId: sampleWhiteboard.id, kind: "note", text: "", color: "pink" }) }));
});

test("selecciona todo, mueve, deshace, rehace y elimina con el teclado", async () => {
  render(<BrainstormWorkspace />);
  fireEvent.keyDown(document.body, { key: "a", ctrlKey: true, metaKey: true });
  await waitFor(() => expect(screen.getByRole("complementary", { name: "Propiedades" })).toBeTruthy());
  fireEvent.keyDown(document.body, { key: "ArrowRight" });
  await waitFor(() => expect(bulk).toHaveBeenCalledWith("stickyNotes", [sampleSticky.id], { type: "stickyPatch", items: [{ id: sampleSticky.id, changes: { x: sampleSticky.x + 24 } }] }));
  fireEvent.keyDown(document.body, { key: "z", ctrlKey: true, metaKey: true });
  await waitFor(() => expect(bulk).toHaveBeenLastCalledWith("stickyNotes", [sampleSticky.id], { type: "stickyPatch", items: [{ id: sampleSticky.id, changes: { x: sampleSticky.x } }] }));
  fireEvent.keyDown(document.body, { key: "z", ctrlKey: true, metaKey: true, shiftKey: true });
  await waitFor(() => expect(bulk).toHaveBeenLastCalledWith("stickyNotes", [sampleSticky.id], { type: "stickyPatch", items: [{ id: sampleSticky.id, changes: { x: sampleSticky.x + 24 } }] }));
  fireEvent.keyDown(document.body, { key: "Delete" });
  await waitFor(() => expect(bulk).toHaveBeenLastCalledWith("stickyNotes", [sampleSticky.id], { type: "delete" }));
});

test("copia y pega con ids nuevos, y trae al frente", async () => {
  render(<BrainstormWorkspace />);
  fireEvent.keyDown(document.body, { key: "a", ctrlKey: true, metaKey: true });
  fireEvent.keyDown(document.body, { key: "c", ctrlKey: true, metaKey: true });
  fireEvent.paste(document.body, { clipboardData: { getData: () => "" } });
  await waitFor(() => expect(save).toHaveBeenCalledWith({ collection: "stickyNotes", id: expect.any(String), revision: 0, data: expect.objectContaining({ text: "Daurisito", x: sampleSticky.x + 24, y: sampleSticky.y + 24, kind: "note" }) }));
  expect(save.mock.calls[0][0].id).not.toBe(sampleSticky.id);
});

test("las capas y el estilo se guardan como cambios", async () => {
  render(<BrainstormWorkspace />);
  fireEvent.keyDown(document.body, { key: "a", ctrlKey: true, metaKey: true });
  fireEvent.keyDown(document.body, { key: "]", ctrlKey: true, metaKey: true, shiftKey: true });
  await waitFor(() => expect(bulk).toHaveBeenCalledWith("stickyNotes", [sampleSticky.id], { type: "stickyPatch", items: [{ id: sampleSticky.id, changes: expect.objectContaining({ kind: "note", style: { z: 1 } }) }] }));
});

test("doble clic edita el texto en el lugar y lo guarda al salir", async () => {
  const user = userEvent.setup();
  render(<BrainstormWorkspace />);
  const text = screen.getByRole("textbox", { name: "Texto del post-it" }) as HTMLTextAreaElement;
  expect(text.readOnly).toBe(true);
  fireEvent.doubleClick(text.closest("[data-note]")!);
  await waitFor(() => expect(text.readOnly).toBe(false));
  await user.clear(text);
  await user.type(text, "Tauri");
  fireEvent.blur(text);
  await waitFor(() => expect(bulk).toHaveBeenCalledWith("stickyNotes", [sampleSticky.id], { type: "stickyPatch", items: [{ id: sampleSticky.id, changes: { text: "Tauri" } }] }));
});

test("renombra la pizarra en el lugar", async () => {
  const user = userEvent.setup();
  render(<BrainstormWorkspace />);
  const name = screen.getByRole("textbox", { name: "Nombre de la pizarra" });
  await user.clear(name);
  await user.type(name, "Mascota{Enter}");
  await waitFor(() => expect(save).toHaveBeenCalledWith({ collection: "whiteboards", id: sampleWhiteboard.id, revision: sampleWhiteboard.revision, data: { name: "Mascota", description: sampleWhiteboard.description, color: sampleWhiteboard.color } }));
});

test("las herramientas tienen atajo y dibujan rectángulos y textos en el lienzo", async () => {
  render(<BrainstormWorkspace />);
  const stage = document.querySelector(`[data-note="${sampleSticky.id}"]`)!.parentElement as HTMLElement;
  fireEvent.keyDown(document.body, { key: "r" });
  await waitFor(() => expect(screen.getByRole("button", { name: "Rectángulo" }).getAttribute("aria-pressed")).toBe("true"));
  fireEvent.pointerDown(stage, { button: 0, clientX: 100, clientY: 100, pointerId: 1 });
  fireEvent.pointerMove(stage, { clientX: 300, clientY: 220, pointerId: 1 });
  fireEvent.pointerUp(stage, { pointerId: 1 });
  await waitFor(() => expect(save).toHaveBeenCalledWith({ collection: "stickyNotes", id: expect.any(String), revision: 0, data: expect.objectContaining({ kind: "rect", color: "ink", x: 96, y: 96, w: 216, h: 120, points: [] }) }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Seleccionar" }).getAttribute("aria-pressed")).toBe("true"));
  fireEvent.keyDown(document.body, { key: "t" });
  fireEvent.pointerDown(stage, { button: 0, clientX: 400, clientY: 300, pointerId: 2 });
  await waitFor(() => expect(save).toHaveBeenCalledWith({ collection: "stickyNotes", id: expect.any(String), revision: 0, data: expect.objectContaining({ kind: "text", size: "md", w: 280 }) }));
});

test("una flecha que sale de un post-it queda unida a él", async () => {
  render(<BrainstormWorkspace />);
  const note = document.querySelector(`[data-note="${sampleSticky.id}"]`) as HTMLElement;
  const stage = note.parentElement as HTMLElement;
  fireEvent.keyDown(document.body, { key: "a" });
  await waitFor(() => expect(screen.getByRole("button", { name: "Flecha" }).getAttribute("aria-pressed")).toBe("true"));
  fireEvent.pointerDown(note, { button: 0, clientX: 150, clientY: 120, pointerId: 3 });
  fireEvent.pointerMove(stage, { clientX: 600, clientY: 400, pointerId: 3 });
  fireEvent.pointerUp(stage, { pointerId: 3 });
  await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ kind: "arrow", from: sampleSticky.id, to: "", style: expect.objectContaining({ arrowType: "straight", head: "end" }) }) })));
});
