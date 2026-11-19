import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { beforeEach, expect, test, vi } from "vitest";
import { sampleFinance } from "@/features/admin/lib/finance.fixtures";
const { save, settle, archive, shares, push, items } = vi.hoisted(() => ({ save: vi.fn(), settle: vi.fn(), archive: vi.fn(), shares: vi.fn(), push: vi.fn(), items: { current: [] as unknown[] } }));
vi.mock("@/features/admin/actions/finance", () => ({ saveFinanceEntry: save, settleFinanceEntry: settle, archiveFinanceEntry: archive, settleTeamShares: shares }));
vi.mock("@/features/admin/actions/workspace", () => ({ archiveWorkspaceItem: vi.fn(), saveWorkspaceItem: vi.fn() }));
vi.mock("next/navigation", async () => ({ useRouter: () => ({ push }), useSearchParams: (await import("@/test/search-params")).useTestSearchParams }));
vi.mock("@/features/admin/hooks/useWorkspace", () => ({ useWorkspace: () => ({ items: items.current, loading: false, error: "" }) }));
import { FinanceWorkspace } from "./FinanceWorkspace";
import { FinanceEditor } from "./FinanceEditor";
const team = ["valeryalarconra@gmail.com", "devjorgemejia@gmail.com", "estebantrampej@gmail.com"];
const shared = { ...sampleFinance, id: "claude", title: "Claude Team", amount: 1000, frequency: "once" as const, date: "2026-03-01", members: team, paidDates: ["2026-03-01"], payers: { "2026-03-01": "devjorgemejia@gmail.com" }, settled: { "2026-03-01": ["estebantrampej@gmail.com"] } };
beforeEach(() => { vi.clearAllMocks(); items.current = [sampleFinance]; shares.mockResolvedValue({ ok: true }); window.history.replaceState(null, "", "/admin/gastos?year=2026"); save.mockResolvedValue({ ok: true, id: "created", revision: 1 }); settle.mockResolvedValue({ ok: true }); archive.mockResolvedValue({ ok: true }); });

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

test("una actualización en tiempo real no cambia la versión del borrador abierto", async () => {
  const view = render(<FinanceEditor initial={sampleFinance} />); const user = userEvent.setup();
  await user.type(screen.getByRole("textbox", { name: "Concepto" }), " mi edición");
  view.rerender(<FinanceEditor initial={{ ...sampleFinance, revision: 2, title: "Editado por otra persona" }} />);
  expect(screen.getByText(/Otra persona cambió este elemento/)).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Guardar movimiento" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ id: sampleFinance.id, revision: 1, data: expect.objectContaining({ title: "Hosting Daury mi edición" }) })));
});

test("un gasto de equipo se divide entre todos por defecto y guarda solo a las personas elegidas", async () => {
  render(<FinanceEditor />); const user = userEvent.setup();
  await user.type(screen.getByRole("textbox", { name: "Concepto" }), "Claude Team");
  await user.type(screen.getByRole("textbox", { name: "Importe por vencimiento" }), "70");
  await user.click(screen.getByRole("switch", { name: /Gasto de equipo/ }));
  const group = screen.getByRole("group", { name: "Integrantes que comparten el gasto" });
  expect(within(group).getAllByRole("button", { pressed: true })).toHaveLength(7);
  expect(screen.getByText(/por persona/).textContent).toContain("10.00");
  await user.click(screen.getByRole("button", { name: "Ninguno" }));
  for (const name of [/Valery/, /Jorge/]) await user.click(within(group).getByRole("button", { name }));
  await user.click(screen.getByRole("button", { name: "Guardar movimiento" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ amount: 7000, members: ["valeryalarconra@gmail.com", "devjorgemejia@gmail.com"] }) })));
});

test("el resumen muestra la moneda elegida y registra quién pagó un vencimiento", async () => {
  items.current = [sampleFinance, { ...sampleFinance, id: "notaria", title: "Notaría", currency: "GTQ", frequency: "once", date: "2026-06-01", paidDates: [] }];
  render(<FinanceWorkspace />); const user = userEvent.setup();
  expect(screen.getByRole("heading", { name: "Gastos e ingresos" })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Gastado en 2026 · USD" })).toBeTruthy();
  expect(screen.queryByText("Notaría")).toBeNull();
  await user.click(screen.getByRole("button", { name: "Marcar pagado Hosting Daury 2026-02-28" }));
  await user.click(await screen.findByRole("button", { name: /Valery Alarcón/ }));
  await user.click(screen.getByRole("button", { name: "Registrar pago" }));
  await waitFor(() => expect(settle).toHaveBeenCalledWith("hosting", 1, "2026-02-28", true, "valeryalarconra@gmail.com"));
  await user.click(screen.getByRole("radio", { name: "GTQ" }));
  expect(new URLSearchParams(window.location.search).get("currency")).toBe("GTQ");
  expect(await screen.findByText("Notaría")).toBeTruthy();
});
test("la gráfica mensual filtra los movimientos del mes y se puede quitar el filtro", async () => {
  render(<FinanceWorkspace />); const user = userEvent.setup();
  expect(screen.getByRole("tab", { name: "Movimientos" }).getAttribute("aria-selected")).toBe("true");
  await user.click(screen.getByRole("button", { name: /^febrero: pagado/ }));
  expect(new URLSearchParams(window.location.search).get("month")).toBe("2");
  expect(screen.getByRole("button", { name: "Marcar pagado Hosting Daury 2026-02-28" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Marcar pagado Hosting Daury 2026-03-31" })).toBeNull();
  await user.click(screen.getByRole("button", { name: "Quitar filtros" }));
  expect(screen.getByRole("button", { name: "Marcar pagado Hosting Daury 2026-03-31" })).toBeTruthy();
});
test("las pestañas conservan los filtros y admiten navegación por teclado", async () => {
  render(<FinanceWorkspace />); const user = userEvent.setup();
  await user.type(screen.getByRole("searchbox", { name: "Buscar movimientos" }), "Hosting");
  screen.getByRole("tab", { name: "Movimientos" }).focus();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: /Próximos/ }).getAttribute("aria-selected")).toBe("true");
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: /Equipo/ }).getAttribute("aria-selected")).toBe("true");
  await user.keyboard("{ArrowLeft}{ArrowLeft}");
  expect((screen.getByRole("searchbox", { name: "Buscar movimientos" }) as HTMLInputElement).value).toBe("Hosting");
});
test("en cada gasto de equipo se ve y se registra quién pagó su parte y quién no", async () => {
  items.current = [shared]; render(<FinanceWorkspace />); const user = userEvent.setup();
  const tracker = screen.getByRole("group", { name: "Quién ha pagado su parte de Claude Team" });
  expect(within(tracker).getByText(/Faltan 1/)).toBeTruthy();
  expect(within(tracker).getByRole("button", { name: /Dante \(Esteban Trampe\) pagó su parte/, pressed: true })).toBeTruthy();
  await user.click(within(tracker).getByRole("button", { name: /Valery Alarcón pagó su parte/, pressed: false }));
  await waitFor(() => expect(shares).toHaveBeenCalledWith([{ id: "claude", revision: 1, date: "2026-03-01", member: "valeryalarconra@gmail.com" }], true));
});
test("la vista de equipo muestra saldos, deudas y la tabla de quién ha pagado", async () => {
  items.current = [shared]; window.history.replaceState(null, "", "/admin/gastos?year=2026&view=team"); render(<FinanceWorkspace />); const user = userEvent.setup();
  const balances = screen.getByRole("list", { name: "Saldos por persona en USD" });
  expect(within(balances).getAllByText("Le deben")).toHaveLength(1);
  expect(within(balances).getAllByText("Debe")).toHaveLength(1);
  const table = screen.getByRole("table", { name: /Pagos de cada persona/ });
  await user.click(within(table).getByRole("button", { name: "Dante (Esteban Trampe) pagó su parte de Claude Team del 2026-03-01", pressed: true }));
  await waitFor(() => expect(shares).toHaveBeenCalledWith([{ id: "claude", revision: 1, date: "2026-03-01", member: "estebantrampej@gmail.com" }], false));
  await user.click(screen.getByRole("button", { name: /Marcar saldado: Valery Alarcón le pagó USD\s3\.34 a Jorge Mejía/ }));
  await waitFor(() => expect(shares).toHaveBeenLastCalledWith([{ id: "claude", revision: 1, date: "2026-03-01", member: "valeryalarconra@gmail.com" }], true));
});
