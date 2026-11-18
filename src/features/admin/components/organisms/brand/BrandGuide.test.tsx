import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { SwatchCard } from "./SwatchCard";

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  return writeText;
}

describe("guía de marca", () => {
  test("la muestra de color copia HEX al tocarla y RGB desde su botón", async () => {
    const user = userEvent.setup();
    const writeText = mockClipboard();
    render(<SwatchCard swatch={{ name: "Azul Daury", hex: "#2358E8", use: "Botones" }} />);
    await user.click(screen.getByRole("button", { name: "Copiar #2358E8 (Azul Daury)" }));
    expect(writeText).toHaveBeenCalledWith("#2358E8");
    await waitFor(() => expect(screen.getAllByText("Copiado: #2358E8").length).toBeGreaterThan(0));
    await user.click(screen.getByRole("button", { name: "RGB" }));
    expect(writeText).toHaveBeenLastCalledWith("rgb(35, 88, 232)");
  });

});
