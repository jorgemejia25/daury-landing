import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { beforeEach, expect, test, vi } from "vitest";
import { sampleFinance } from "@/features/admin/lib/finance.fixtures";
const { save, settle, archive, push } = vi.hoisted(() => ({ save: vi.fn(), settle: vi.fn(), archive: vi.fn(), push: vi.fn() }));
vi.mock("@/features/admin/actions/finance", () => ({ saveFinanceEntry: save, settleFinanceEntry: settle, archiveFinanceEntry: archive }));
vi.mock("@/features/admin/actions/workspace", () => ({ archiveWorkspaceItem: vi.fn(), saveWorkspaceItem: vi.fn() }));
vi.mock("next/navigation", async () => ({ useRouter: () => ({ push }), useSearchParams: (await import("@/test/search-params")).useTestSearchParams }));
vi.mock("@/features/admin/hooks/useWorkspace", () => ({ useWorkspace: () => ({ items: [sampleFinance], loading: false, error: "" }) }));
import { FinanceWorkspace } from "./FinanceWorkspace";
import { FinanceEditor } from "./FinanceEditor";
beforeEach(() => { vi.clearAllMocks(); window.history.replaceState(null, "", "/admin/gastos?year=2026"); save.mockResolvedValue({ ok: true, id: "created", revision: 1 }); settle.mockResolvedValue({ ok: true }); archive.mockResolvedValue({ ok: true }); });

test("el formulario crea movimientos en centavos con controles nombrados para agentes", async () => {
  render(<FinanceEditor />); const user = userEvent.setup();
  const agent = createAgent();
  for (const entry of agent.snapshot().filter((item) => !item.offPage && item.component !== "more")) expect(entry.label).toBeTruthy();
  await act(async () => { expect((await agent.act({ steps: [{ ref: "Concepto", action: "setValue", args: ["Dominio Daury"] }, { ref: "Importe por vencimiento", action: "setValue", args: ["35.50"] }] })).ok).toBe(true); });
  await user.click(screen.getByRole("button", { name: "Guardar movimiento" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ title: "Dominio Daury", amount: 3550, currency: "USD" }) })));
  expect(push).toHaveBeenCalledWith(expect.stringContaining("/admin/gastos?year="));
});
test("el formulario conserva el borrador ante conflictos y protege la salida", async () => {
  save.mockResolvedValue({ ok: false, error: "Otra persona cambió el movimiento" }); render(<FinanceEditor initial={sampleFinance} />); const user = userEvent.setup();
  await user.type(screen.getByRole("textbox", { name: "Concepto" }), " actualizado"); await user.click(screen.getByRole("button", { name: "Guardar movimiento" }));
  await screen.findByText("Otra persona cambió el movimiento");
  expect((screen.getByRole("textbox", { name: "Concepto" }) as HTMLInputElement).value).toContain("actualizado");
  await user.click(screen.getByRole("button", { name: "Volver a gastos" })); await screen.findByText(/Tienes cambios sin guardar\./); expect(push).not.toHaveBeenCalled();
});
test("el resumen separa monedas y permite marcar un vencimiento específico como pagado", async () => {
  render(<FinanceWorkspace />); const user = userEvent.setup();
  expect(screen.getByRole("heading", { name: "Gastos e ingresos" })).toBeTruthy();
  expect(screen.getByText("Dólares · USD")).toBeTruthy(); expect(screen.getByText("Quetzales · GTQ")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Marcar pagado Hosting Daury 2026-02-28" }));
  await waitFor(() => expect(settle).toHaveBeenCalledWith("hosting", 1, "2026-02-28", true));
  expect(screen.getAllByRole("link", { name: "Hosting Daury" })[0].getAttribute("href")).toBe("/admin/gastos/hosting");
});


test("una actualización en tiempo real no cambia la versión del borrador abierto", async () => {
  const view = render(<FinanceEditor initial={sampleFinance} />); const user = userEvent.setup();
  await user.type(screen.getByRole("textbox", { name: "Concepto" }), " mi edición");
  view.rerender(<FinanceEditor initial={{ ...sampleFinance, revision: 2, title: "Editado por otra persona" }} />);
  expect(screen.getByText(/Otra persona cambió este elemento/)).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Guardar movimiento" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ id: sampleFinance.id, revision: 1, data: expect.objectContaining({ title: "Hosting Daury mi edición" }) })));
});


test("Movimientos es la vista inicial y la previsión mensual permite abrir el mes elegido", async () => {
  render(<FinanceWorkspace />); const user = userEvent.setup();
  expect(screen.getByRole("tab", { name: "Movimientos" }).getAttribute("aria-selected")).toBe("true");
  expect(screen.getByRole("searchbox", { name: "Buscar movimientos" })).toBeTruthy();
  expect(screen.queryByRole("table", { name: /Costos e ingresos programados por mes/ })).toBeNull();
  await user.click(screen.getByRole("tab", { name: "Previsión mensual" }));
  expect(screen.getByRole("table", { name: /Costos e ingresos programados por mes/ })).toBeTruthy();
  expect(screen.queryByRole("searchbox", { name: "Buscar movimientos" })).toBeNull();
  await user.click(screen.getByRole("button", { name: "febrero" }));
  expect(screen.getByRole("tab", { name: "Movimientos" }).getAttribute("aria-selected")).toBe("true");
  expect(new URLSearchParams(window.location.search).get("month")).toBe("2");
  expect(screen.getByRole("button", { name: "Marcar pagado Hosting Daury 2026-02-28" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Marcar pagado Hosting Daury 2026-03-31" })).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("tabpanel", { name: "Movimientos" })));
});

test("las pestañas conservan los filtros y admiten navegación por teclado", async () => {
  render(<FinanceWorkspace />); const user = userEvent.setup();
  await user.type(screen.getByRole("searchbox", { name: "Buscar movimientos" }), "Hosting");
  const movements = screen.getByRole("tab", { name: "Movimientos" }); movements.focus();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Gastos previstos" }).getAttribute("aria-selected")).toBe("true");
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Previsión mensual" }).getAttribute("aria-selected")).toBe("true");
  await user.keyboard("{ArrowLeft}{ArrowLeft}");
  expect(screen.getByRole("tab", { name: "Movimientos" }).getAttribute("aria-selected")).toBe("true");
  expect((screen.getByRole("searchbox", { name: "Buscar movimientos" }) as HTMLInputElement).value).toBe("Hosting");
});

test("gastos previstos lista lo pendiente de los próximos 12 meses y permite marcarlo pagado", async () => {
  render(<FinanceWorkspace />); const user = userEvent.setup();
  await user.click(screen.getByRole("tab", { name: "Gastos previstos" }));
  expect(screen.getByRole("heading", { name: "Gastos previstos" })).toBeTruthy();
  const pay = screen.queryAllByRole("button", { name: /^Marcar pagado / });
  expect(pay.length).toBeLessThanOrEqual(12);
  for (const button of pay) expect(button.getAttribute("aria-label")).toMatch(/\d{4}-\d{2}-\d{2}$/);
});
