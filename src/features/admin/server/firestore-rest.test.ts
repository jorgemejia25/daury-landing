import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import { createHash } from "node:crypto";
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => ({ value: "never-log-this-test-token" }) }) }));
vi.mock("./session", () => ({ adminSessionCookie: "test-cookie", requireAdminSession: async () => ({ uid: "member", email: "devjorgemejia@gmail.com", name: "Jorge" }) }));
import { workspaceStore, encodeFields } from "./firestore-rest";
const request = vi.fn();
const resource = "projects/demo-daury-wiki/databases/(default)/documents";
const revisionTime = "2026-11-18T00:00:00.123456789Z";
beforeEach(() => {
  vi.clearAllMocks(); vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "demo-daury-wiki"); vi.stubGlobal("fetch", request);
  request.mockImplementation(async (url: string) => {
    if (url.endsWith("/boards/project")) return Response.json({ name: `${resource}/boards/project`, fields: encodeFields({ name: "Proyecto", revision: 1 }), updateTime: revisionTime });
    if (url.includes("/workspaceGuards/")) return Response.json({}, { status: 404 });
    if (url.endsWith(":runQuery")) return Response.json([]);
    if (url.endsWith(":commit")) return Response.json({});
    throw new Error(`La prueba no permite esta operación: ${url}`);
  });
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });
describe("guardado REST con identidad Firebase", () => {
  test("usa commits y precondiciones, sin iniciar transacciones administrativas", async () => {
    const store = await workspaceStore();
    await store.get("boards", "project");
    await store.commit([{ collection: "tasks", id: "new-task", data: { boardId: "project", title: "Tarea" }, previous: null }]);
    const calls = request.mock.calls as [string, RequestInit][];
    expect(calls.some(([url]) => url.includes("beginTransaction") || url.includes("rollback"))).toBe(false);
    for (const [, options] of calls) expect(options.headers).toMatchObject({ Authorization: "Bearer never-log-this-test-token" });
    const commit = JSON.parse(String(calls.find(([url]) => url.endsWith(":commit"))![1].body));
    expect(commit).not.toHaveProperty("transaction");
    expect(commit.writes).toContainEqual({ verify: `${resource}/boards/project`, currentDocument: { updateTime: revisionTime } });
    expect(commit.writes.find((write: { update?: { name: string } }) => write.update?.name === `${resource}/tasks/new-task`).currentDocument).toEqual({ exists: false });
  });
  test("protege también una consulta vacía contra hijos creados simultáneamente", async () => {
    const store = await workspaceStore(); const board = await store.get("boards", "project");
    expect(await store.list("tasks", "boardId", "project")).toEqual([]);
    await store.commit([{ collection: "boards", id: "project", data: { name: "Editado" }, previous: board }]);
    const call = request.mock.calls.find(([url]) => String(url).endsWith(":commit"))!;
    const payload = JSON.parse(String(call[1].body));
    const guard = createHash("sha256").update("boards/project").digest("hex");
    expect(payload.writes).toContainEqual({ verify: `${resource}/workspaceGuards/${guard}`, currentDocument: { exists: false } });
  });
  test("el diagnóstico distingue la operación rechazada sin registrar el token", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    request.mockResolvedValue(Response.json({ error: { status: "PERMISSION_DENIED", message: "Missing or insufficient permissions." } }, { status: 403 }));
    const store = await workspaceStore();
    await expect(store.get("boards", "project")).rejects.toThrow("No tienes permiso");
    expect(log).toHaveBeenCalledWith("[wiki.firestore]", expect.objectContaining({ operation: "/boards/project", status: 403, code: "PERMISSION_DENIED" }));
    expect(JSON.stringify(log.mock.calls)).not.toContain("never-log-this-test-token");
  });
});
