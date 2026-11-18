import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { sampleFolder, samplePage } from "@/features/admin/lib/workspace.fixtures";
const { save, format } = vi.hoisted(() => ({ save: vi.fn(), format: vi.fn() }));
vi.mock("@/features/admin/actions/workspace", () => ({ saveWorkspaceItem: save }));
vi.mock("./markdown/MarkdownSource", () => ({ default: MockSource }));
import { ArticleForm } from "./ArticleForm";
import type { MarkdownSourceApi } from "./markdown/MarkdownSource";
import { MarkdownPreview } from "./markdown/MarkdownPreview";
function MockSource({ value, onChange, onReady }: { value: string; onChange: (value: string) => void; onReady: (api: MarkdownSourceApi | null) => void }) {
  useEffect(() => { onReady({ format, undo: vi.fn(), redo: vi.fn(), search: vi.fn(), escape: () => false, jumpToLine: vi.fn() }); return () => onReady(null); }, [onReady]);
  return <textarea aria-label="Contenido Markdown" value={value} onChange={(event) => onChange(event.target.value)} />;
}
const agent = createAgent();
const user = () => userEvent.setup({ pointerEventsCheck: 0 });
function file(content: string, name = "ejemplo.md") {
  const item = new File([content], name, { type: "text/markdown" });
  const bytes = new TextEncoder().encode(content);
  Object.defineProperty(item, "arrayBuffer", { value: async () => bytes.buffer });
  return item;
}
async function upload(content: string) { await user().upload(document.querySelector('input[type="file"]') as HTMLInputElement, file(content)); }
beforeEach(() => { vi.clearAllMocks(); save.mockResolvedValue({ ok: true, id: "new-article", revision: 1 }); });
describe("editor de artículos", () => {
  test("importa un .md como borrador, sin guardarlo automáticamente", async () => {
    render(<ArticleForm folders={[sampleFolder]} defaults={{ folderId: "marketing" }} onClose={vi.fn()} onSaved={vi.fn()} />);
    await upload("---\ntitle: Campaña de diciembre\ntags: [redes]\n---\n# Campaña\nTexto");
    await screen.findByText(/Importado: ejemplo.md/);
    expect((screen.getByRole("textbox", { name: "Título" }) as HTMLInputElement).value).toBe("Campaña de diciembre");
    expect(save).not.toHaveBeenCalled();
    await user().click(screen.getByRole("button", { name: "Guardar artículo" }));
    await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ collection: "wikiPages", data: expect.objectContaining({ title: "Campaña de diciembre", folderId: "marketing", tags: ["redes"], body: "# Campaña\nTexto" }) })));
  });
  test("confirma el reemplazo de un borrador y permite cancelarlo", async () => {
    render(<ArticleForm initial={samplePage} body="# Texto original" folders={[sampleFolder]} onClose={vi.fn()} onSaved={vi.fn()} />);
    await upload("# Nuevo contenido");
    await screen.findByRole("alertdialog", { name: "¿Reemplazar el contenido?" });
    await user().click(screen.getByRole("button", { name: "Seguir editando" }));
    expect((screen.getByRole("textbox", { name: "Contenido Markdown" }) as HTMLTextAreaElement).value).toBe("# Texto original");
    await upload("# Nuevo contenido");
    await user().click(await screen.findByRole("button", { name: "Reemplazar contenido" }));
    expect((screen.getByRole("textbox", { name: "Contenido Markdown" }) as HTMLTextAreaElement).value).toBe("# Nuevo contenido");
    expect((screen.getByRole("textbox", { name: "Título" }) as HTMLInputElement).value).toBe(samplePage.title);
  });
  test("protege los cambios al cerrar y conserva el borrador si falla Firebase", async () => {
    save.mockResolvedValue({ ok: false, error: "No se pudo guardar" }); const close = vi.fn();
    render(<ArticleForm initial={samplePage} body="# Borrador" folders={[sampleFolder]} onClose={close} onSaved={vi.fn()} />);
    await user().type(await screen.findByRole("textbox", { name: "Contenido Markdown" }), " editado");
    await user().click(screen.getByRole("button", { name: "Guardar artículo" })); await screen.findByText("No se pudo guardar");
    expect((screen.getByRole("textbox", { name: "Contenido Markdown" }) as HTMLTextAreaElement).value).toContain("editado");
    await user().click(screen.getByRole("button", { name: "Cancelar" }));
    await screen.findByText(/Tienes cambios sin guardar\./); expect(close).not.toHaveBeenCalled();
    await user().click(screen.getByRole("button", { name: "Seguir editando" })); expect(close).not.toHaveBeenCalled();
    await user().click(screen.getByRole("button", { name: "Volver a documentación" }));
    await user().click(screen.getByRole("button", { name: "Descartar cambios" })); expect(close).toHaveBeenCalledOnce();
  });
  test("la barra de formato y el atajo de guardar actúan sobre el documento actual", async () => {
    render(<ArticleForm initial={samplePage} body="# Artículo" folders={[sampleFolder]} onClose={vi.fn()} onSaved={vi.fn()} />);
    await waitFor(() => expect((screen.getByRole("button", { name: "Negrita" }) as HTMLButtonElement).disabled).toBe(false));
    await user().click(screen.getByRole("button", { name: "Negrita" })); expect(format).toHaveBeenCalledWith("bold");
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Contenido Markdown" }), { key: "s", ctrlKey: true });
    await waitFor(() => expect(save).toHaveBeenCalledOnce());
  });
  test("el agente encuentra el editor y cambia el contenido mediante el primitive", async () => {
    render(<ArticleForm folders={[sampleFolder]} onClose={vi.fn()} onSaved={vi.fn()} />);
    expect(screen.getByRole("region", { name: "Crear artículo" })).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
    const controls = agent.snapshot().filter((entry) => !entry.offPage && entry.component !== "more");
    for (const entry of controls) expect(entry.label, `${entry.component} sin nombre`).toBeTruthy();
    expect(controls.map((entry) => entry.label)).toEqual(expect.arrayContaining(["Contenido Markdown", "Título", "Importación de Markdown", "Formato Markdown", "Vista del editor", "Guardar artículo"]));
    await act(async () => { expect((await agent.act({ steps: [{ ref: "Título", action: "setValue", args: ["Artículo del equipo"] }, { ref: "Contenido Markdown", action: "setValue", args: ["# Documento\nTexto"] }] })).ok).toBe(true); });
    expect((await screen.findByRole("textbox", { name: "Contenido Markdown" }) as HTMLTextAreaElement).value).toBe("# Documento\nTexto");
    await act(async () => { expect((await agent.act({ steps: [{ ref: "Guardar artículo", action: "press" }] })).ok).toBe(true); });
    await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ body: "# Documento\nTexto", title: "Artículo del equipo" }) })));
  });
  test("la vista previa interpreta tablas y conserva inactivo el HTML del archivo", () => {
    render(<MarkdownPreview body={'| A | B |\n| - | - |\n| 1 | 2 |\n\n<script>alert(1)</script>\n\n[enlace](javascript:alert(1))'} />);
    expect(screen.getByRole("table")).toBeTruthy(); expect(document.querySelector("script")).toBeNull();
    expect(screen.getByText("enlace").getAttribute("href")).not.toContain("javascript:");
  });
});
