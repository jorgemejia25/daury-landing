import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { beforeEach, expect, test, vi } from "vitest";
import { sampleCalendar, sampleEvent } from "@/features/admin/lib/workspace.fixtures";
const { save } = vi.hoisted(() => ({ save: vi.fn() }));
vi.mock("@/features/admin/actions/workspace", () => ({ saveWorkspaceItem: save }));
import { EventForm } from "./EventForm";
beforeEach(() => { vi.clearAllMocks(); save.mockResolvedValue({ ok: true, id: "meeting", revision: 1 }); });
test("permite guardar y abrir el enlace de Meet con controles operables por agentes", async () => {
  render(<EventForm initial={sampleEvent} calendars={[sampleCalendar]} onClose={vi.fn()} onSaved={vi.fn()} />);
  const agent = createAgent(); await act(async () => { expect((await agent.act({ steps: [{ ref: "Enlace de Google Meet", action: "setValue", args: ["https://meet.google.com/abc-defg-hij"] }] })).ok).toBe(true); });
  const link = screen.getByRole("link", { name: "Unirse al Meet" }); expect(link.getAttribute("href")).toBe("https://meet.google.com/abc-defg-hij"); expect(link.getAttribute("rel")).toContain("noopener");
  await userEvent.setup().click(screen.getByRole("button", { name: "Guardar evento" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ collection: "events", data: expect.objectContaining({ meetUrl: "https://meet.google.com/abc-defg-hij" }) })));
});
test("conserva el borrador y no guarda un enlace ajeno a Meet", async () => {
  render(<EventForm initial={sampleEvent} calendars={[sampleCalendar]} onClose={vi.fn()} onSaved={vi.fn()} />); const user = userEvent.setup();
  await user.type(screen.getByRole("textbox", { name: "Enlace de Google Meet" }), "https://example.com/reunion");
  await user.click(screen.getByRole("button", { name: "Guardar evento" }));
  await screen.findByText("Usa un enlace HTTPS de meet.google.com."); expect(save).not.toHaveBeenCalled(); expect(screen.queryByRole("link", { name: "Unirse al Meet" })).toBeNull();
});
