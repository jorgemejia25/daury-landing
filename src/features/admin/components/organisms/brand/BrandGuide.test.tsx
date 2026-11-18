import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { mascotMasterPrompt } from "@/features/admin/lib/brand-prompts";
import { BrandTabs } from "./BrandTabs";
import { ColorChipButton } from "./ColorChips";
import { MascotPrompts } from "./MascotPrompts";

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  return writeText;
}

const panels = {
  esencial: <p>Panel esencial</p>,
  mascota: <p>Panel mascota</p>,
  redes: <p>Panel redes</p>,
  producto: <p>Panel producto</p>,
};

afterEach(() => {
  window.history.replaceState(null, "", "/");
});

describe("guía de marca", () => {
  test("la tarjeta de color copia su HEX al tocarla", async () => {
    const user = userEvent.setup();
    const writeText = mockClipboard();
    render(<ColorChipButton color={{ name: "Azul Daury", hex: "#2358E8", use: "Logo, botones, acción" }} />);
    await user.click(screen.getByRole("button", { name: "Copiar #2358E8 (Azul Daury)" }));
    expect(writeText).toHaveBeenCalledWith("#2358E8");
    await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Copiado: #2358E8"));
  });

  test("las pestañas abren Esencial por defecto y guardan la elegida en el hash", async () => {
    const user = userEvent.setup();
    render(<BrandTabs panels={panels} />);
    expect(screen.getByRole("tab", { name: /Esencial/ }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Panel esencial")).toBeTruthy();

    await user.click(screen.getByRole("tab", { name: /Redes/ }));
    await waitFor(() => expect(screen.getByText("Panel redes")).toBeTruthy());
    expect(screen.queryByText("Panel esencial")).toBeNull();
    expect(window.location.hash).toBe("#redes");
  });

  test("un enlace con hash abre su pestaña", async () => {
    render(<BrandTabs panels={panels} />);
    window.location.hash = "producto";
    await waitFor(() => expect(screen.getByRole("tab", { name: /Producto/ }).getAttribute("aria-selected")).toBe("true"));
  });

  test("el prompt maestro de la mascota cambia de idioma", async () => {
    const user = userEvent.setup();
    render(<MascotPrompts />);
    const prompt = () => screen.getByLabelText("prompt maestro de la mascota", { selector: "pre" }).textContent;
    expect(prompt()).toBe(mascotMasterPrompt.es);
    await user.click(screen.getByRole("radio", { name: "English" }));
    expect(prompt()).toBe(mascotMasterPrompt.en);
  });
});
