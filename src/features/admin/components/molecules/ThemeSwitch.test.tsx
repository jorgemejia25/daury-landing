import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { afterEach, expect, test } from "vitest";
import { ThemeSwitch } from "./ThemeSwitch";

afterEach(() => { delete document.documentElement.dataset.theme; });
test("el popup aplica Claro, Oscuro y Sistema, cierra y devuelve el foco", async () => {
  render(<ThemeSwitch />); const user = userEvent.setup(); const trigger = screen.getByRole("button", { name: "Cambiar tema" });
  for (const [label, value] of [["Oscuro", "dark"], ["Claro", "light"], ["Sistema", undefined]] as const) {
    await user.click(trigger); await user.click(await screen.findByRole("menuitemradio", { name: label }));
    expect(document.documentElement.dataset.theme).toBe(value);
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(screen.queryByRole("menu")).toBeNull();
  }
});
test("el popup admite teclado y los controles tienen nombres para agentes", async () => {
  render(<ThemeSwitch initial="dark" />); const user = userEvent.setup(); const trigger = screen.getByRole("button", { name: "Cambiar tema" });
  trigger.focus(); await user.keyboard("{ArrowDown}");
  expect((await screen.findByRole("menuitemradio", { name: "Oscuro" })).getAttribute("aria-checked")).toBe("true");
  const agent = createAgent(); for (const entry of agent.snapshot().filter((item) => !item.offPage && item.component !== "more")) expect(entry.label).toBeTruthy();
  await act(async () => { await user.keyboard("{Escape}"); });
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});
