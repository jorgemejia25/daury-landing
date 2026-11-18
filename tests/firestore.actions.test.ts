import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc } from "firebase/firestore";
import { sampleBoard, sampleCalendar, sampleTask, sampleEvent, samplePage, sampleFolder } from "../src/features/admin/lib/workspace.fixtures";
import type { ActionResult } from "../src/features/admin/lib/workspace";

const session = vi.hoisted(() => ({ email: "devjorgemejia@gmail.com", token: "" }));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => ({ value: session.token }) }) }));
vi.mock("@/features/admin/server/session", () => ({ adminSessionCookie: "test-cookie", requireAdminSession: async () => ({ uid: session.email, email: session.email, name: session.email }) }));
import { saveFinanceEntry, settleFinanceEntry, archiveFinanceEntry } from "../src/features/admin/actions/finance";
import { sampleFinance } from "../src/features/admin/lib/finance.fixtures";
import { saveWorkspaceItem, archiveWorkspaceItem, addTaskComment } from "../src/features/admin/actions/workspace";

let env: RulesTestEnvironment;
const project = "demo-daury-wiki";
function actAs(email: string) {
  session.email = email;
  const enc = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  session.token = `${enc({ alg: "none", typ: "JWT" })}.${enc({ aud: project, iss: `https://securetoken.google.com/${project}`, sub: email, user_id: email, iat: now, exp: now + 3600, email, email_verified: true, firebase: { sign_in_provider: "google.com", identities: {} } })}.`;
}
function succeeded(result: ActionResult) { expect(result.ok, result.ok ? "" : result.error).toBe(true); if (!result.ok) throw new Error(result.error); return result; }
async function read(kind: string, id: string, email = session.email) { return (await getDoc(doc(env.authenticatedContext(email, { email, email_verified: true, firebase: { sign_in_provider: "google.com", identities: {} } }).firestore(), kind, id))).data()!; }
beforeAll(async () => {
  const host = process.env.FIRESTORE_EMULATOR_HOST;
  if (!host) throw new Error("Se requiere el emulador.");
  env = await initializeTestEnvironment({ projectId: project, firestore: { rules: readFileSync("firestore.rules", "utf8") } });
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", project);
  const realFetch = globalThis.fetch;
  vi.stubGlobal("fetch", (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    if (url.startsWith(`http://${host}/`)) return realFetch(input, init);
    if (!url.startsWith(`https://firestore.googleapis.com/v1/projects/${project}/`)) throw new Error("La prueba no puede llamar a producción.");
    return realFetch(url.replace("https://firestore.googleapis.com", `http://${host}`), init);
  });
  actAs("devjorgemejia@gmail.com");
});
afterAll(async () => { await env?.cleanup(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("acciones reales contra Firestore", () => {
  test("dos cuentas crean y editan tableros, tareas y comentarios con autoría inmutable", async () => {
    actAs("devjorgemejia@gmail.com");
    const board = succeeded(await saveWorkspaceItem({ collection: "boards", data: sampleBoard }));
    const task = succeeded(await saveWorkspaceItem({ collection: "tasks", data: { ...sampleTask, boardId: board.id, checklist: [{ id: "subtask", title: "Preparar texto", done: false }], createdBy: "suplantado@gmail.com" } }));
    expect((await read("tasks", task.id)).createdBy).toBe("devjorgemejia@gmail.com");
    actAs("valeryalarconra@gmail.com");
    const updated = succeeded(await saveWorkspaceItem({ collection: "tasks", id: task.id, revision: 1, data: { ...sampleTask, boardId: board.id, status: "done", title: "Terminado", checklist: [{ id: "subtask", title: "Preparar texto", done: true, createdBy: "suplantado" }], comments: [{ author: "suplantado" }] } }));
    const saved = await read("tasks", task.id);
    expect(saved.createdBy).toBe("devjorgemejia@gmail.com"); expect(saved.updatedBy).toBe(session.email); expect(saved.comments).toEqual([]); expect(saved.checklist[0].createdBy).toBe("devjorgemejia@gmail.com");
    expect((await saveWorkspaceItem({ collection: "tasks", id: task.id, revision: 1, data: sampleTask })).ok).toBe(false);
    succeeded(await addTaskComment(task.id, updated.revision, "Listo para publicar"));
    const commented = await read("tasks", task.id); expect(commented.comments[0].author).toBe(session.email);
    succeeded(await archiveWorkspaceItem("tasks", task.id, commented.revision, true));
    expect((await read("tasks", task.id)).archived).toBe(true);
    succeeded(await archiveWorkspaceItem("tasks", task.id, commented.revision + 1, false));
    expect((await read("tasks", task.id)).createdBy).toBe("devjorgemejia@gmail.com");
  });
  test("varias instancias mantienen separados los tableros y los calendarios", async () => {
    const boardA = succeeded(await saveWorkspaceItem({ collection: "boards", data: { ...sampleBoard, name: "Proyecto A" } }));
    const boardB = succeeded(await saveWorkspaceItem({ collection: "boards", data: { ...sampleBoard, name: "Proyecto B" } }));
    const task = succeeded(await saveWorkspaceItem({ collection: "tasks", data: { ...sampleTask, boardId: boardA.id } }));
    succeeded(await saveWorkspaceItem({ collection: "tasks", id: task.id, revision: 1, data: { ...sampleTask, boardId: boardB.id } }));
    expect((await read("tasks", task.id)).boardId).toBe(boardB.id);
    const calendarA = succeeded(await saveWorkspaceItem({ collection: "calendars", data: sampleCalendar }));
    const calendarB = succeeded(await saveWorkspaceItem({ collection: "calendars", data: { ...sampleCalendar, name: "Proyecto" } }));
    const event = succeeded(await saveWorkspaceItem({ collection: "events", data: { ...sampleEvent, calendarId: calendarA.id } }));
    succeeded(await saveWorkspaceItem({ collection: "events", id: event.id, revision: 1, data: { ...sampleEvent, calendarId: calendarB.id } }));
    expect((await read("events", event.id)).calendarId).toBe(calendarB.id);
  });
  test("crea y mueve artículos entre carpetas con contenido atómico y autoría", async () => {
    const root = succeeded(await saveWorkspaceItem({ collection: "folders", data: sampleFolder }));
    const nested = succeeded(await saveWorkspaceItem({ collection: "folders", data: { ...sampleFolder, name: "Campaña", parentId: root.id } }));
    const page = succeeded(await saveWorkspaceItem({ collection: "wikiPages", data: { ...samplePage, folderId: nested.id, body: "# Documento compartido" } }));
    expect((await read("wikiContent", page.id)).body).toBe("# Documento compartido");
    expect((await archiveWorkspaceItem("folders", nested.id, 1, true)).ok).toBe(false);
    expect((await saveWorkspaceItem({ collection: "folders", id: root.id, revision: 1, data: { ...sampleFolder, parentId: nested.id } })).ok).toBe(false);
    succeeded(await saveWorkspaceItem({ collection: "wikiPages", id: page.id, revision: 1, data: { ...samplePage, folderId: root.id, body: "# Segunda versión" } }));
    expect((await read("wikiPages", page.id)).folderId).toBe(root.id);
    expect((await read("wikiContent", page.id)).revision).toBe(2);
    succeeded(await archiveWorkspaceItem("wikiPages", page.id, 2, true));
    succeeded(await archiveWorkspaceItem("wikiPages", page.id, 3, false));
    succeeded(await saveWorkspaceItem({ collection: "wikiPages", id: page.id, revision: 4, data: { ...samplePage, folderId: root.id, body: "# Restaurado" } }));
    expect((await read("wikiContent", page.id)).revision).toBe(5);
    succeeded(await archiveWorkspaceItem("folders", nested.id, 1, true));
  });
  test("no elimina columnas ocupadas y rechaza versiones concurrentes", async () => {
    const board = succeeded(await saveWorkspaceItem({ collection: "boards", data: sampleBoard }));
    succeeded(await saveWorkspaceItem({ collection: "tasks", data: { ...sampleTask, boardId: board.id } }));
    const altered = { ...sampleBoard, columns: { done: { name: "Listo", done: true } }, columnOrder: ["done"] };
    expect((await saveWorkspaceItem({ collection: "boards", id: board.id, revision: 1, data: altered })).ok).toBe(false);
    const results = await Promise.all(["Nombre A", "Nombre B"].map((name) => saveWorkspaceItem({ collection: "boards", id: board.id, revision: 1, data: { ...sampleBoard, name } })));
    expect(results.filter((result) => result.ok), JSON.stringify(results)).toHaveLength(1);
  });
  test("las reglas también rechazan un usuario externo aunque intente saltarse el servidor", async () => {
    actAs("outside@gmail.com");
    expect((await saveWorkspaceItem({ collection: "boards", data: sampleBoard })).ok).toBe(false);
    actAs("devjorgemejia@gmail.com");
  });
  test("costos en USD/GTQ, pagos individuales y autoría se persisten sin sobrescribir cambios concurrentes", async () => {
    actAs("devjorgemejia@gmail.com");
    const cost = succeeded(await saveFinanceEntry({ data: { ...sampleFinance, createdBy: "suplantado@gmail.com" } }));
    const initial = await read("financeEntries", cost.id); expect(initial.createdBy).toBe(session.email); expect(initial.paidDates).toEqual([]);
    actAs("valeryalarconra@gmail.com");
    const paid = await settleFinanceEntry(cost.id, 1, "2026-02-28", true); expect(paid.ok).toBe(true);
    const updated = await read("financeEntries", cost.id); expect(updated.paidDates).toEqual(["2026-02-28"]); expect(updated.createdBy).toBe("devjorgemejia@gmail.com"); expect(updated.updatedBy).toBe(session.email);
    expect((await settleFinanceEntry(cost.id, 1, "2026-03-31", true)).ok).toBe(false);
    expect((await settleFinanceEntry(cost.id, 2, "2026-02-27", true)).ok).toBe(false);
    expect((await saveFinanceEntry({ id: cost.id, revision: 2, data: { ...sampleFinance, amount: 5000 } })).ok).toBe(false);
    succeeded(await saveFinanceEntry({ data: { ...sampleFinance, currency: "GTQ", kind: "income" } }));
    expect((await archiveFinanceEntry(cost.id, 2, true)).ok).toBe(true); expect((await read("financeEntries", cost.id)).archived).toBe(true);
    expect((await archiveFinanceEntry(cost.id, 3, false)).ok).toBe(true);
  });

  test("los eventos guardan y actualizan enlaces Meet sin romper los eventos antiguos", async () => {
    actAs("devjorgemejia@gmail.com");
    const calendar = succeeded(await saveWorkspaceItem({ collection: "calendars", data: sampleCalendar }));
    const event = succeeded(await saveWorkspaceItem({ collection: "events", data: { ...sampleEvent, calendarId: calendar.id, meetUrl: "https://meet.google.com/abc-defg-hij" } }));
    expect((await read("events", event.id)).meetUrl).toBe("https://meet.google.com/abc-defg-hij");
    expect((await saveWorkspaceItem({ collection: "events", id: event.id, revision: 1, data: { ...sampleEvent, calendarId: calendar.id, meetUrl: "https://example.com" } })).ok).toBe(false);
    succeeded(await saveWorkspaceItem({ collection: "events", id: event.id, revision: 1, data: { ...sampleEvent, calendarId: calendar.id, meetUrl: "" } }));
    expect((await read("events", event.id)).meetUrl).toBe("");
  });

});
