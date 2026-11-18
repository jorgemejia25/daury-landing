import { beforeEach, describe, expect, test, vi } from "vitest";

const { verify, setCookie } = vi.hoisted(() => ({ verify: vi.fn(), setCookie: vi.fn() }));
vi.mock("@/features/admin/server/session", () => ({
  verifyAdminToken: verify,
  adminSessionCookie: "__Host-daury-admin",
  adminCookieOptions: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
}));
vi.mock("next/headers", () => ({ cookies: async () => ({ set: setCookie }) }));
import { createAdminSession, deleteAdminSession } from "./session";

const options = { httpOnly: true, secure: true, sameSite: "lax", path: "/" };
const inAnHour = () => Math.floor(Date.now() / 1000) + 3600;

beforeEach(() => {
  vi.clearAllMocks();
  verify.mockResolvedValue({ user: { uid: "u" }, expiresAt: inAnHour() });
});

describe("Server Actions de sesión", () => {
  test("verifica el token y emite una cookie HttpOnly, Secure y de host", async () => {
    expect(await createAdminSession("signed-token")).toEqual({ ok: true });
    expect(verify).toHaveBeenCalledWith("signed-token");
    expect(setCookie).toHaveBeenCalledWith("__Host-daury-admin", "signed-token", { ...options, maxAge: 3600 });
  });

  test("rechaza tokens vacíos, con otro tipo o demasiado grandes sin verificarlos", async () => {
    for (const token of ["", 123, null, undefined, { idToken: "x" }, "x".repeat(5000)]) {
      expect(await createAdminSession(token)).toEqual({ ok: false, error: "invalid-token" });
    }
    expect(verify).not.toHaveBeenCalled();
    expect(setCookie).not.toHaveBeenCalled();
  });

  test("deniega un token no válido y borra la cookie de un usuario fuera de la lista", async () => {
    verify.mockRejectedValueOnce(new Error("invalid token"));
    expect(await createAdminSession("bad")).toEqual({ ok: false, error: "invalid-token" });
    expect(setCookie).not.toHaveBeenCalled();
    verify.mockResolvedValueOnce(null);
    expect(await createAdminSession("outsider")).toEqual({ ok: false, error: "access-denied" });
    expect(setCookie).toHaveBeenCalledWith("__Host-daury-admin", "", { ...options, maxAge: 0 });
  });

  test("limita la duración al vencimiento del token y rechaza tokens vencidos", async () => {
    verify.mockResolvedValueOnce({ expiresAt: Math.floor(Date.now() / 1000) + 30 });
    await createAdminSession("short");
    expect(setCookie.mock.calls[0][2].maxAge).toBeGreaterThanOrEqual(29);
    expect(setCookie.mock.calls[0][2].maxAge).toBeLessThanOrEqual(30);
    verify.mockResolvedValueOnce({ expiresAt: Math.floor(Date.now() / 1000) - 1 });
    expect(await createAdminSession("old")).toEqual({ ok: false, error: "expired-token" });
  });

  test("elimina la sesión al salir", async () => {
    await deleteAdminSession();
    expect(setCookie).toHaveBeenCalledWith("__Host-daury-admin", "", { ...options, maxAge: 0 });
  });
});
