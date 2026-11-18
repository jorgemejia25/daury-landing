import { beforeEach, describe, expect, test, vi } from "vitest";

const { verifyIdToken, cookieGet, redirect } = vi.hoisted(() => ({
  verifyIdToken: vi.fn(), cookieGet: vi.fn(), redirect: vi.fn((path: string) => { throw new Error(`redirect:${path}`); }),
}));
vi.mock("server-only", () => ({}));
vi.mock("./firebase-admin", () => ({ getAdminAuth: () => ({ verifyIdToken }) }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: cookieGet }) }));
vi.mock("next/navigation", () => ({ redirect }));
import { getAdminSession, requireAdminSession, verifyAdminToken } from "./session";

const verified = {
  uid: "google-jorge", email: "devjorgemejia@gmail.com", name: "Jorge Mejía",
  email_verified: true, firebase: { sign_in_provider: "google.com" },
  exp: Math.floor(Date.now() / 1000) + 3600,
};

beforeEach(() => { vi.clearAllMocks(); cookieGet.mockReturnValue({ value: "signed-token" }); verifyIdToken.mockResolvedValue(verified); });
describe("sesión del servidor", () => {
  test("verifica el token antes de devolver solo la identidad necesaria", async () => {
    expect(await verifyAdminToken("signed-token")).toEqual({
      user: { uid: verified.uid, email: verified.email, name: verified.name }, expiresAt: verified.exp,
    });
    expect(verifyIdToken).toHaveBeenCalledWith("signed-token");
  });
  test("rechaza cuentas externas, no verificadas y tokens expirados", async () => {
    for (const changes of [{ email: "externo@gmail.com" }, { email_verified: false }, { firebase: { sign_in_provider: "password" } }, { exp: 1 }]) {
      verifyIdToken.mockResolvedValue({ ...verified, ...changes });
      expect(await getAdminSession()).toBeNull();
    }
  });
  test("no entrega contenido con cookie ausente o firma inválida", async () => {
    cookieGet.mockReturnValue(undefined);
    await expect(requireAdminSession()).rejects.toThrow("redirect:/admin/login");
    expect(verifyIdToken).not.toHaveBeenCalled();
    cookieGet.mockReturnValue({ value: "forged-token" });
    verifyIdToken.mockRejectedValue(new Error("invalid signature"));
    await expect(requireAdminSession()).rejects.toThrow("redirect:/admin/login");
  });
});
