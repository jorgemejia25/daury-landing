import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent } from "@ui-sdk/react/agent";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { popup, save, signOut, navigate, getToken } = vi.hoisted(() => ({ popup: vi.fn(), save: vi.fn(), signOut: vi.fn(), navigate: vi.fn(), getToken: vi.fn() }));
vi.mock("@/features/admin/actions/session", () => ({ createAdminSession: vi.fn(), deleteAdminSession: vi.fn() }));
vi.mock("@/features/admin/lib/firebase-client", () => ({ getAdminFirebase: () => ({ auth: {} }) }));
vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: class { setCustomParameters() {} }, browserSessionPersistence: "session", setPersistence: vi.fn(),
  signInWithPopup: popup, signOut,
}));
vi.mock("@/features/admin/lib/auth-client", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/features/admin/lib/auth-client")>(), saveAdminSession: save, navigateAdmin: navigate,
}));
import { LoginPanel } from "./LoginPanel";

const agent = createAgent();
beforeEach(() => {
  vi.clearAllMocks();
  getToken.mockResolvedValue("signed-token");
  popup.mockResolvedValue({ user: { getIdToken: getToken } });
  save.mockResolvedValue(undefined);
});
describe("login Google", () => {
  test("solo navega al admin después de que el servidor autoriza el token", async () => {
    render(<LoginPanel />);
    await userEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/admin"));
    expect(save).toHaveBeenCalledWith("signed-token");
    expect(signOut).not.toHaveBeenCalled();
  });
  test("cierra la identidad de Firebase al denegar acceso y permite elegir otra cuenta", async () => {
    save.mockRejectedValueOnce(new Error("access-denied"));
    render(<LoginPanel />);
    await userEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));
    await screen.findByText(/Esta cuenta no tiene acceso/);
    expect(signOut).toHaveBeenCalledOnce();
    expect(navigate).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/admin"));
  });
  test("informa si se cierra o bloquea la ventana de Google", async () => {
    popup.mockRejectedValueOnce({ code: "auth/popup-closed-by-user" }).mockRejectedValueOnce({ code: "auth/popup-blocked" });
    render(<LoginPanel />);
    await userEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));
    await screen.findByText(/Se cerró el inicio de sesión/);
    await userEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));
    await screen.findByText(/Permite las ventanas emergentes/);
    expect(save).not.toHaveBeenCalled();
  });
  test("un agente encuentra el botón de Google y ejecuta el mismo flujo autorizado", async () => {
    render(<LoginPanel />);
    const controls = agent.snapshot().filter((entry) => !entry.offPage && entry.component !== "more");
    for (const control of controls) expect(control.label).toBeTruthy();
    expect(controls.map((control) => control.label)).toContain("Continuar con Google");
    await act(async () => {
      const result = await agent.act({ steps: [{ ref: "Continuar con Google", action: "press" }] });
      expect(result.ok, result.error?.message).toBe(true);
    });
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/admin"));
    expect(save).toHaveBeenCalledWith("signed-token");
  });
});
