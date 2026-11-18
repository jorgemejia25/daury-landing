import { act, renderHook, waitFor } from "@testing-library/react";
import type { User } from "firebase/auth";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { watch, save, clear, navigate, signOut } = vi.hoisted(() => ({ watch: vi.fn(), save: vi.fn(), clear: vi.fn(), navigate: vi.fn(), signOut: vi.fn() }));
vi.mock("firebase/auth", () => ({ onIdTokenChanged: watch, signOut }));
vi.mock("@/features/admin/lib/firebase-client", () => ({ getAdminFirebase: () => ({ auth: {} }) }));
vi.mock("@/features/admin/lib/auth-client", () => ({ saveAdminSession: save, clearAdminSession: clear, navigateAdmin: navigate }));
import { useAdminSession } from "./useAdminSession";

function emit(user: Partial<User> | null) { watch.mock.calls.at(-1)![1](user); }
beforeEach(() => {
  vi.clearAllMocks();
  watch.mockReturnValue(vi.fn());
  save.mockResolvedValue(undefined); clear.mockResolvedValue(undefined); signOut.mockResolvedValue(undefined);
});
describe("renovación y cierre de sesión", () => {
  test("renueva la cookie con el token del mismo usuario", async () => {
    renderHook(() => useAdminSession("jorge"));
    act(() => emit({ uid: "jorge", getIdToken: vi.fn().mockResolvedValue("refreshed-token") }));
    await waitFor(() => expect(save).toHaveBeenCalledWith("refreshed-token"));
    expect(navigate).not.toHaveBeenCalled();
  });
  test.each([null, { uid: "otra-cuenta" }])("elimina la sesión si desaparece o cambia la identidad: %s", async (user) => {
    renderHook(() => useAdminSession("jorge"));
    act(() => emit(user));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/admin/login"));
    expect(clear).toHaveBeenCalledOnce();
    expect(save).not.toHaveBeenCalled();
  });
  test("una cuenta revocada de la lista sale también de Firebase", async () => {
    save.mockRejectedValue(new Error("access-denied"));
    renderHook(() => useAdminSession("jorge"));
    act(() => emit({ uid: "jorge", getIdToken: vi.fn().mockResolvedValue("token") }));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/admin/login"));
    expect(clear).toHaveBeenCalledOnce();
    expect(signOut).toHaveBeenCalledOnce();
  });
  test("termina una renovación pendiente antes de borrar la cookie al salir", async () => {
    let release!: () => void;
    save.mockImplementationOnce(() => new Promise<void>((resolve) => { release = resolve; }));
    const { result } = renderHook(() => useAdminSession("jorge"));
    act(() => emit({ uid: "jorge", getIdToken: vi.fn().mockResolvedValue("token") }));
    await waitFor(() => expect(save).toHaveBeenCalledOnce());
    let logout!: Promise<void>;
    act(() => { logout = result.current.logout(); });
    expect(clear).not.toHaveBeenCalled();
    await act(async () => { release(); await logout; });
    expect(clear).toHaveBeenCalledOnce();
    expect(signOut).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith("/admin/login");
  });
});
