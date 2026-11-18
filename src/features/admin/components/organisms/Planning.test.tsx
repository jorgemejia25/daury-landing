import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { createElement, type AnchorHTMLAttributes } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { testCategories, testEvents } from "@/features/admin/lib/planning.fixtures";
import { CalendarView } from "./CalendarView";

vi.mock("next/navigation", async () => ({
  useSearchParams: (await import("@/test/search-params")).useTestSearchParams,
}));
vi.mock("next/link", () => ({
  default: ({ href, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) =>
    createElement("a", {
      href,
      ...props,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        event.preventDefault();
      },
    }),
}));
const agent = createAgent();
const renderCalendar = (props: Partial<React.ComponentProps<typeof CalendarView>> = {}) =>
  render(<CalendarView categories={testCategories} events={testEvents} today="2026-11-17" {...props} />);

beforeEach(() => window.history.replaceState(null, "", "/"));

describe("calendarios", () => {
  test("navega por meses y vuelve al mes actual", async () => {
    const user = userEvent.setup();
    renderCalendar();
    expect(screen.getByRole("table", { name: "Eventos de noviembre de 2026" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Mes siguiente" }));
    expect(screen.getByRole("table", { name: "Eventos de diciembre de 2026" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Mes anterior" }));
    await user.click(screen.getByRole("button", { name: "Mes anterior" }));
    expect(screen.getByRole("table", { name: "Eventos de octubre de 2026" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Hoy" }));
    expect(screen.getByRole("table", { name: "Eventos de noviembre de 2026" })).toBeTruthy();
  });

  test("la agenda agrupa por día con horario y abre el evento", async () => {
    const user = userEvent.setup();
    const onOpenEvent = vi.fn();
    renderCalendar({ onOpenEvent });
    await user.click(screen.getByRole("tab", { name: "Agenda" }));
    const agenda = screen.getByRole("list", { name: "Agenda de noviembre de 2026" });
    expect(within(agenda).getByText("Hoy")).toBeTruthy();
    const trigger = within(agenda).getByRole("button", { name: /Ver evento sesion-producto/ });
    expect(trigger.textContent).toContain("09:00");
    await user.click(trigger);
    expect(onOpenEvent).toHaveBeenCalledWith("sesion-producto");
  });

  test("el filtro de calendarios es un select de un solo calendario y se puede restablecer", async () => {
    const user = userEvent.setup();
    renderCalendar();
    await user.click(screen.getByRole("combobox", { name: "Calendario visible" }));
    await user.click(await screen.findByRole("option", { name: "Contenido" }));
    await waitFor(() => expect(new URLSearchParams(window.location.search).get("calendars")).toBe("contenido"));
    expect(screen.queryByRole("button", { name: /Ver evento sesion-producto/ })).toBeNull();
    await user.click(screen.getByRole("combobox", { name: "Calendario visible" }));
    await user.click(await screen.findByRole("option", { name: "Todos los calendarios" }));
    await waitFor(() => expect(new URLSearchParams(window.location.search).get("calendars")).toBeNull());
    expect(screen.getByRole("button", { name: /Ver evento sesion-producto/ })).toBeTruthy();
  });

  test("crear un evento desde un día", async () => {
    const user = userEvent.setup();
    const onCreateDay = vi.fn();
    renderCalendar({ onCreateDay });
    await user.click(screen.getByRole("button", { name: /Crear evento el 20 de noviembre/ }));
    expect(onCreateDay).toHaveBeenCalledWith("2026-11-20");
  });

  test("el agente cambia la vista con nombres accesibles", async () => {
    renderCalendar();
    const entries = agent.snapshot().filter((entry) => !entry.offPage && entry.component !== "more");
    for (const entry of entries) expect(entry.label, `${entry.component} sin nombre`).toBeTruthy();
    expect(entries.map((entry) => entry.label)).toEqual(expect.arrayContaining(["Vista del calendario", "Mes anterior", "Mes siguiente", "Hoy"]));
    await act(async () => {
      const result = await agent.act({ steps: [{ ref: "Vista del calendario", action: "setValue", args: ["agenda"] }] });
      expect(result.ok, result.error?.message).toBe(true);
    });
    expect(screen.getByRole("tabpanel", { name: "Agenda" })).toBeTruthy();
  });
});
