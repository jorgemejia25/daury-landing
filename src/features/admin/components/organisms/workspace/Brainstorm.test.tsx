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
  expect(screen.getByRole("heading", { name: sampleWhiteboard.name })).toBeTruthy();
  expect((screen.getByRole("textbox", { name: "Texto del post-it" }) as HTMLTextAreaElement).value).toBe("Daurisito");
  await user.click(screen.getByRole("button", { name: "Rosa" }));
  await user.click(screen.getByRole("button", { name: "Nuevo post-it" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith({ collection: "stickyNotes", data: expect.objectContaining({ whiteboardId: sampleWhiteboard.id, text: "", color: "pink" }) }));
});

test("mueve un post-it con el teclado y guarda el texto al salir", async () => {
  const user = userEvent.setup();
  render(<BrainstormWorkspace />);
  const note = screen.getByRole("group", { name: /Post-it de/ });
  note.focus();
  fireEvent.keyDown(note, { key: "ArrowRight" });
  await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ collection: "stickyNotes", id: sampleSticky.id, revision: 1, data: expect.objectContaining({ x: sampleSticky.x + 16, y: sampleSticky.y }) })));
  const text = screen.getByRole("textbox", { name: "Texto del post-it" });
  await user.clear(text);
  await user.type(text, "Tauri");
  await user.tab();
  await waitFor(() => expect(save).toHaveBeenLastCalledWith(expect.objectContaining({ id: sampleSticky.id, data: expect.objectContaining({ text: "Tauri" }) })));
});
