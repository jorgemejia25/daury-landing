import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { sampleBoard, sampleTask, sampleCalendar, sampleEvent, sampleFolder, samplePage } from "@/features/admin/lib/workspace.fixtures";
const { save, comment, archive, push, replace } = vi.hoisted(() => ({ save: vi.fn(), comment: vi.fn(), archive: vi.fn(), push: vi.fn(), replace: vi.fn() }));
vi.mock("@/features/admin/actions/workspace", () => ({ saveWorkspaceItem: save, addTaskComment: comment, archiveWorkspaceItem: archive }));
vi.mock("next/navigation", async () => ({ useRouter: () => ({ push, replace }), useSearchParams: (await import("@/test/search-params")).useTestSearchParams }));
vi.mock("@/features/admin/hooks/useWorkspace", () => ({
  useWorkspace: (kind: string) => ({ items: ({ boards: [sampleBoard], tasks: [sampleTask], calendars: [sampleCalendar], events: [sampleEvent], folders: [sampleFolder], wikiPages: [samplePage] } as Record<string, unknown[]>)[kind] ?? [], loading: false, error: "" }),
  useWorkspaceDocument: (kind: string, id: string | null) => ({ item: id ? ({ tasks: sampleTask, events: sampleEvent, wikiPages: samplePage, wikiContent: { ...samplePage, body: "# Artículo guardado" } } as Record<string, unknown>)[kind] ?? null : null, loading: false, error: "" }),
}));
vi.mock("../editors/markdown/MarkdownSource", () => ({ default: function Source({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <textarea aria-label="Contenido Markdown" value={value} onChange={(event) => onChange(event.target.value)} />; } }));
import { EntityEditor } from "./EntityEditor";
import { BoardWorkspace } from "./BoardWorkspace";
import { ArticleLibrary } from "./ArticleLibrary";
import { CalendarWorkspace } from "./CalendarWorkspace";
import { TaskPage } from "./TaskPage";
import { EventPage } from "./EventPage";
import { ArticleEditorPage } from "./ArticleEditorPage";
import { CloudArticle } from "./CloudArticle";
const agent = createAgent();
beforeEach(() => { vi.clearAllMocks(); window.history.replaceState(null, "", "/admin"); save.mockResolvedValue({ ok: true, id: "new-item", revision: 1 }); archive.mockResolvedValue({ ok: true, id: "archived", revision: 2 }); });

describe("edición de espacios compartidos", () => {
  test("el agente nombra todos los controles y crea una tarea en el tablero seleccionado", async () => {
    const onSaved = vi.fn();
    render(<EntityEditor kind="tasks" boards={[sampleBoard]} pages={[samplePage]} onClose={vi.fn()} onSaved={onSaved} />);
    const entries = agent.snapshot().filter((entry) => !entry.offPage && entry.component !== "more");
    for (const entry of entries) expect(entry.label, `${entry.component} sin nombre`).toBeTruthy();
    expect(entries.map((entry) => entry.label)).toEqual(expect.arrayContaining(["Título", "Descripción", "Responsable", "Estado", "Crear tarea"]));
    await act(async () => {
      const result = await agent.act({ steps: [{ ref: "Título", action: "setValue", args: ["Publicación de noviembre"] }, { ref: "Crear tarea", action: "press" }] });
      expect(result.ok, result.error?.message).toBe(true);
    });
    await waitFor(() => expect(onSaved).toHaveBeenCalledWith("new-item", expect.objectContaining({ title: "Publicación de noviembre" })));
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ collection: "tasks", data: expect.objectContaining({ title: "Publicación de noviembre", boardId: sampleBoard.id, status: "todo" }) }));
  });
  test("mantiene el borrador y muestra errores de conflicto sin cerrar el editor", async () => {
    save.mockResolvedValue({ ok: false, error: "Otra persona modificó este elemento." });
    const onSaved = vi.fn();
    render(<EntityEditor kind="tasks" initial={sampleTask} boards={[sampleBoard]} onClose={vi.fn()} onSaved={onSaved} />);
    const user = userEvent.setup(); const title = screen.getByRole("textbox", { name: "Título" });
    await user.clear(title); await user.type(title, "Mi borrador"); await user.click(screen.getByRole("button", { name: "Guardar tarea" }));
    await screen.findByText("Otra persona modificó este elemento.");
    expect((title as HTMLInputElement).value).toBe("Mi borrador"); expect(onSaved).not.toHaveBeenCalled();
    expect(screen.getByText(/Creado por Jorge Mejía/)).toBeTruthy();
  });
  test("guarda artículos Markdown en su carpeta y permite previsualizarlos", async () => {
    render(<EntityEditor kind="wikiPages" folders={[sampleFolder]} defaults={{ folderId: sampleFolder.id }} onClose={vi.fn()} onSaved={vi.fn()} />);
    const user = userEvent.setup();
    await user.type(screen.getByRole("textbox", { name: "Título" }), "Plan de campaña");
    await user.type(await screen.findByRole("textbox", { name: "Contenido Markdown" }), "# Primera versión");
    await user.click(screen.getByRole("radio", { name: "Vista previa" }));
    expect(await screen.findByRole("heading", { name: "Primera versión" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Guardar artículo" }));
    await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ collection: "wikiPages", data: expect.objectContaining({ folderId: "marketing", body: "# Primera versión" }) })));
  });
  test("el tablero muestra su creador y sus tareas, y abre un formulario funcional", async () => {
    const view = render(<BoardWorkspace />); const user = userEvent.setup();
    expect(screen.getByText("Creado por")).toBeTruthy();
    expect(screen.getAllByText("Jorge Mejía").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: "Abrir tarea Diseñar publicación" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Nueva tarea" }));
    expect(push).toHaveBeenCalledWith(`/admin/kanban/tareas/nueva?board=${sampleBoard.id}&estado=todo`);
    view.unmount(); render(<TaskPage boardId={sampleBoard.id} status="todo" />);
    const created = await screen.findByRole("region", { name: "Crear tarea" });
    expect(within(created).getByRole("heading", { name: "Nueva tarea" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Abrir tarea Diseñar publicación" })).toBeNull();
  });
  test("la biblioteca separa carpetas y artículos, con su autor", async () => {
    render(<ArticleLibrary />); const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Abrir carpeta Marketing" }));
    expect(screen.getByRole("link", { name: /Estrategia de campaña/ }).getAttribute("href")).toBe("/admin/articulos/strategy");
    expect(screen.getByText(/Jorge Mejía/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Nueva carpeta" }).getAttribute("href")).toBe("/admin/documentacion/carpetas/nueva?parent=marketing");
    expect(screen.getByRole("link", { name: "Editar carpeta" }).getAttribute("href")).toBe("/admin/documentacion/carpetas/marketing");
  });
  test("un evento se abre a pantalla completa desde la URL, con su creador", async () => {
    const view = render(<CalendarWorkspace today="2026-11-17" />); const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Ver evento launch: Publicar campaña/ }));
    expect(push).toHaveBeenCalledWith("/admin/calendarios/eventos/launch");
    view.unmount(); render(<EventPage id="launch" />);
    const page = await screen.findByRole("region", { name: "Editar evento" });
    expect(within(page).getByText(/Creado por Jorge Mejía/)).toBeTruthy();
    expect(within(page).getByRole("textbox", { name: "Nombre" })).toBeTruthy();
    expect(within(page).getByText("1 de 1")).toBeTruthy();
  });
  test("una tarea se abre a pantalla completa con navegación y comentarios", async () => {
    const view = render(<BoardWorkspace />); const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Abrir tarea Diseñar publicación" }));
    expect(push).toHaveBeenCalledWith("/admin/kanban/tareas/first-task");
    view.unmount(); render(<TaskPage id="first-task" />);
    const page = await screen.findByRole("region", { name: "Editar tarea" });
    expect(within(page).getByRole("button", { name: "Volver al tablero" })).toBeTruthy();
    expect(within(page).getByRole("button", { name: "Tarea anterior" }).hasAttribute("disabled")).toBe(true);
    expect(within(page).getByRole("heading", { name: "Comentarios" })).toBeTruthy();
    expect(within(page).getByRole("button", { name: "Guardar tarea" }).hasAttribute("disabled")).toBe(true);
    await user.type(within(page).getByRole("textbox", { name: "Título" }), " final");
    expect(within(page).getByRole("button", { name: "Guardar tarea" }).hasAttribute("disabled")).toBe(false);
    await user.click(within(page).getByRole("button", { name: "Volver al tablero" }));
    expect(await within(page).findByText(/Tienes cambios sin guardar\./)).toBeTruthy();
    await user.click(within(page).getByRole("button", { name: "Descartar cambios" }));
    expect(push).toHaveBeenLastCalledWith(`/admin/kanban?board=${sampleBoard.id}`);
  });
  test("crear artículos conserva la carpeta y navega al documento guardado dentro del shell", async () => {
    const view = render(<ArticleLibrary />); const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Abrir carpeta Marketing" }));
    expect(screen.getByRole("link", { name: "Nuevo artículo" }).getAttribute("href")).toBe("/admin/articulos/nuevo?folder=marketing");
    view.unmount(); render(<ArticleEditorPage folderId="marketing" />);
    expect(screen.getByRole("region", { name: "Crear artículo" })).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.type(screen.getByRole("textbox", { name: "Título" }), "Guía del equipo");
    await user.type(await screen.findByRole("textbox", { name: "Contenido Markdown" }), "# Guía");
    await user.click(screen.getByRole("button", { name: "Guardar artículo" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/admin/articulos/new-item"));
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ folderId: "marketing" }) }));
  });
  test("editar un artículo tiene ruta propia y carga su Markdown", async () => {
    const view = render(<CloudArticle id="strategy" />);
    expect(screen.getByRole("link", { name: "Editar artículo" }).getAttribute("href")).toBe("/admin/articulos/strategy/editar");
    view.unmount(); render(<ArticleEditorPage id="strategy" />);
    expect(screen.getByRole("region", { name: "Editar artículo" })).toBeTruthy();
    expect((await screen.findByRole("textbox", { name: "Contenido Markdown" }) as HTMLTextAreaElement).value).toBe("# Artículo guardado");
    await userEvent.setup().click(screen.getByRole("button", { name: "Volver a documentación" }));
    expect(push).toHaveBeenCalledWith("/admin/articulos/strategy");
  });
  test("la biblioteca filtra sin duplicar la navegación de carpetas", async () => {
    render(<ArticleLibrary />); const user = userEvent.setup();
    expect(screen.queryByRole("navigation", { name: "Carpetas" })).toBeNull();
    await user.type(screen.getByRole("searchbox", { name: "Buscar artículos y carpetas" }), "inexistente");
    expect(screen.queryByRole("link", { name: /Estrategia de campaña/ })).toBeNull();
    expect(screen.getByText("No hay documentos con esta búsqueda")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /Sin carpeta/ }));
    expect(screen.queryByRole("button", { name: "Abrir carpeta Marketing" })).toBeNull();
    expect(screen.queryByRole("link", { name: /Estrategia de campaña/ })).toBeNull();
  });

});
