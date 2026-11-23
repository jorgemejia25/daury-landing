import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InvitationCard } from "./InvitationCard";

const code = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

afterEach(() => {
  window.history.replaceState(null, "", "/");
  Reflect.deleteProperty(navigator, "clipboard");
  vi.restoreAllMocks();
});

describe("invitation card", () => {
  it("offers the app link and copies the manual code", async () => {
    window.history.replaceState(null, "", `/unirme#code=${code}`);
    vi.spyOn(navigator, "language", "get").mockReturnValue("es-GT");
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<InvitationCard />);

    expect(screen.getByRole("link", { name: "Abrir Daury" }).getAttribute("href")).toBe(`daury:///join?code=${code}`);
    fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));
    expect(await screen.findByText("Código copiado")).toBeTruthy();
    expect(writeText).toHaveBeenCalledWith(code);
  });

  it("hides the open action when the link has no valid code", () => {
    window.history.replaceState(null, "", "/unirme#code=bad");
    vi.spyOn(navigator, "language", "get").mockReturnValue("en-US");
    render(<InvitationCard />);

    expect(screen.queryByRole("link", { name: "Open Daury" })).toBeNull();
    expect(screen.getByText(/doesn’t have a valid code/)).toBeTruthy();
  });
});
