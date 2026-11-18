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

beforeEach(() => { vi.clearAllMocks(); window.history.replaceState(null, "", "/admin/brainstorm"); save.mockResolvedValue({ ok: true, id: "nueva", revision: 1 }); bulk.mockResolvedValue({ ok: true, count: 1 }); });

test("muestra la pizarra con sus post-its y crea uno del color elegido", async () => {
  const user = userEvent.setup();
  render(<BrainstormWorkspace />);
  expect((screen.getByRole("textbox", { name: "Nombre de la pizarra" }) as HTMLInputElement).value).toBe(sampleWhiteboard.name);
  expect((screen.getByRole("textbox", { name: "Texto del post-it" }) as HTMLTextAreaElement).value).toBe("Daurisito");
  await user.click(screen.getByRole("button", { name: "Rosa" }));
  await user.click(screen.getByRole("button", { name: "Nuevo post-it" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith({ collection: "stickyNotes", data: expect.objectContaining({ whiteboardId: sampleWhiteboard.id, text: "", color: "pink" }) }));
});

test("con el teclado selecciona todo, mueve en la cuadrícula y elimina en bloque", async () => {
  render(<BrainstormWorkspace />);
  const canvas = screen.getByLabelText(/^Lienzo de/);
  canvas.focus();
  fireEvent.keyDown(canvas, { key: "a", ctrlKey: true, metaKey: true });
  await waitFor(() => expect(screen.getByRole("toolbar", { name: /1 post-its seleccionados/ })).toBeTruthy());
  fireEvent.keyDown(canvas, { key: "ArrowRight" });
  await waitFor(() => expect(bulk).toHaveBeenCalledWith("stickyNotes", [sampleSticky.id], { type: "stickyPositions", positions: [{ id: sampleSticky.id, x: sampleSticky.x + 24, y: sampleSticky.y }] }));
  fireEvent.keyDown(canvas, { key: "Delete" });
  await waitFor(() => expect(bulk).toHaveBeenCalledWith("stickyNotes", [sampleSticky.id], { type: "delete" }));
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
  await waitFor(() => expect(bulk).toHaveBeenCalledWith("stickyNotes", [sampleSticky.id], { type: "stickyText", value: "Tauri" }));
});

test("renombra la pizarra en el lugar", async () => {
  const user = userEvent.setup();
  render(<BrainstormWorkspace />);
  const name = screen.getByRole("textbox", { name: "Nombre de la pizarra" });
  await user.clear(name);
  await user.type(name, "Mascota{Enter}");
  await waitFor(() => expect(save).toHaveBeenCalledWith({ collection: "whiteboards", id: sampleWhiteboard.id, revision: sampleWhiteboard.revision, data: { name: "Mascota", description: sampleWhiteboard.description, color: sampleWhiteboard.color } }));
});
