import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { adminAllowedEmails } from "../src/features/admin/lib/access";
import { sampleFinance } from "../src/features/admin/lib/finance.fixtures";
import { sampleBoard, sampleTask, sampleCalendar, sampleEvent, sampleFolder, samplePage, sampleWhiteboard, sampleSticky } from "../src/features/admin/lib/workspace.fixtures";
import { workspaceCollections } from "../src/features/admin/lib/workspace";

let env: RulesTestEnvironment;
const rules = readFileSync("firestore.rules", "utf8");
const claims = { email_verified: true, firebase: { sign_in_provider: "google.com" as const, identities: {} } };
const samples = { boards: sampleBoard, tasks: sampleTask, calendars: sampleCalendar, events: sampleEvent, folders: sampleFolder, wikiPages: samplePage, whiteboards: sampleWhiteboard, stickyNotes: sampleSticky };
const data = (sample: object) => Object.fromEntries(Object.entries(sample).filter(([key]) => key !== "id"));
beforeAll(async () => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error("Estas pruebas requieren el emulador, nunca producción.");
  env = await initializeTestEnvironment({ projectId: "demo-daury-wiki", firestore: { rules } });
  await env.withSecurityRulesDisabled(async (context) => { const db = context.firestore(); for (const [name, sample] of Object.entries(samples)) await setDoc(doc(db, name, sample.id), data(sample)); });
});
afterAll(async () => { await env?.cleanup(); });
describe("acceso a los espacios compartidos", () => {
  test("la lista del servidor y de las reglas contiene exactamente las mismas siete cuentas", () => {
    const emails = [...rules.matchAll(/'([^']+@gmail\.com)'/g)].map((match) => match[1]);
    expect(emails.sort()).toEqual([...adminAllowedEmails].sort()); expect(new Set(emails).size).toBe(7);
  });
  test.each(adminAllowedEmails)("%s puede crear, consultar y editar, conservando el creador", async (email) => {
    const db = env.authenticatedContext(email, { ...claims, email }).firestore();
    for (const name of workspaceCollections) {
      const id = `test-${email.split("@")[0]}`, ref = doc(db, name, id);
      const initial = { ...data(samples[name]), createdBy: email, updatedBy: email };
      await assertSucceeds(setDoc(ref, initial)); await assertSucceeds(getDoc(ref)); await assertSucceeds(getDocs(collection(db, name)));
      await assertSucceeds(updateDoc(ref, { revision: 2, archived: true }));
      expect((await getDoc(ref)).data()?.createdBy).toBe(email);
      // Solo tareas y eventos admiten borrado permanente (acciones masivas); el resto se archiva.
      if (name === "tasks" || name === "events" || name === "stickyNotes") await assertSucceeds(deleteDoc(ref));
      else await assertFails(deleteDoc(ref));
    }
  });
  test("las cuentas externas, anónimas y de otro proveedor no pueden leer ni escribir", async () => {
    for (const context of [env.unauthenticatedContext(), env.authenticatedContext("outside", { ...claims, email: "outside@gmail.com" }), env.authenticatedContext("not-verified", { ...claims, email: adminAllowedEmails[0], email_verified: false }), env.authenticatedContext("password", { ...claims, email: adminAllowedEmails[0], firebase: { sign_in_provider: "password", identities: {} } })]) {
      const db = context.firestore();
      for (const name of [...workspaceCollections, "wikiContent", "workspaceGuards", "financeEntries"]) { await assertFails(getDocs(collection(db, name))); await assertFails(setDoc(doc(db, name, "outside"), data(sampleBoard))); }
      await assertFails(deleteDoc(doc(db, "tasks", sampleTask.id))); await assertFails(deleteDoc(doc(db, "events", sampleEvent.id)));
    }
  });
  test("rechaza la suplantación o modificación del creador y versiones obsoletas", async () => {
    const email = adminAllowedEmails[0], db = env.authenticatedContext(email, { ...claims, email }).firestore();
    await assertFails(setDoc(doc(db, "boards", "forged"), data(sampleBoard)));
    const ref = doc(db, "boards", sampleBoard.id);
    await assertFails(updateDoc(ref, { revision: 2, updatedBy: email, createdBy: email }));
    await assertFails(updateDoc(ref, { revision: 2, updatedBy: email, createdAt: "2026-01-01" }));
    await assertFails(updateDoc(ref, { revision: 1, updatedBy: email }));
    await assertSucceeds(updateDoc(ref, { revision: 2, updatedBy: email }));
    const saved = (await getDoc(ref)).data()!; expect(saved.createdBy).toBe(sampleBoard.createdBy); expect(saved.updatedBy).toBe(email);
  });
  test("los post-its validan color, posición, texto y pizarra", async () => {
    const email = adminAllowedEmails[0], db = env.authenticatedContext(email, { ...claims, email }).firestore();
    const note = { ...data(sampleSticky), createdBy: email, updatedBy: email };
    await assertSucceeds(setDoc(doc(db, "stickyNotes", "nota-ok"), { ...note, text: "" }));
    await assertFails(setDoc(doc(db, "stickyNotes", "sin-pizarra"), { ...note, whiteboardId: "missing" }));
    await assertFails(setDoc(doc(db, "stickyNotes", "color-raro"), { ...note, color: "black" }));
    await assertFails(setDoc(doc(db, "stickyNotes", "fuera"), { ...note, x: 4001 }));
    await assertFails(setDoc(doc(db, "stickyNotes", "decimal"), { ...note, y: 10.5 }));
    await assertFails(setDoc(doc(db, "stickyNotes", "largo"), { ...note, text: "x".repeat(501) }));
    await assertFails(deleteDoc(doc(db, "whiteboards", sampleWhiteboard.id)));
    const shape = { ...note, kind: "rect", w: 240, h: 160, points: [], size: "md", color: "ink" };
    await assertSucceeds(setDoc(doc(db, "stickyNotes", "figura"), shape));
    await assertSucceeds(setDoc(doc(db, "stickyNotes", "trazo"), { ...shape, kind: "pen", points: [0, 0, 10, 12, 30, 4] }));
    await assertFails(setDoc(doc(db, "stickyNotes", "tipo-raro"), { ...shape, kind: "star" }));
    await assertFails(setDoc(doc(db, "stickyNotes", "sin-tamano"), Object.fromEntries(Object.entries(shape).filter(([key]) => key !== "w"))));
    await assertFails(setDoc(doc(db, "stickyNotes", "trazo-largo"), { ...shape, kind: "pen", points: Array(1001).fill(1) }));
    await assertFails(setDoc(doc(db, "stickyNotes", "talla"), { ...shape, size: "xl" }));
    await assertSucceeds(setDoc(doc(db, "stickyNotes", "flecha"), { ...shape, kind: "arrow", points: [0, 0, 10, 10], from: "figura", to: "" }));
    await assertFails(setDoc(doc(db, "stickyNotes", "flecha-mala"), { ...shape, kind: "arrow", points: [0, 0, 10, 10], from: 3, to: "" }));
  });
  test("las tareas admiten un orden manual numérico opcional", async () => {
    const email = adminAllowedEmails[0], db = env.authenticatedContext(email, { ...claims, email }).firestore();
    const task = { ...data(sampleTask), createdBy: email, updatedBy: email };
    await assertSucceeds(setDoc(doc(db, "tasks", "con-orden"), { ...task, rank: -1024.5 }));
    await assertFails(setDoc(doc(db, "tasks", "orden-texto"), { ...task, rank: "1" }));
  });
  test("los tableros admiten una posición opcional de 1 a 99 en las pestañas", async () => {
    const email = adminAllowedEmails[0], db = env.authenticatedContext(email, { ...claims, email }).firestore();
    const board = { ...data(sampleBoard), createdBy: email, updatedBy: email };
    await assertSucceeds(setDoc(doc(db, "boards", "con-posicion"), { ...board, position: 1 }));
    await assertFails(setDoc(doc(db, "boards", "posicion-cero"), { ...board, position: 0 }));
    await assertFails(setDoc(doc(db, "boards", "posicion-texto"), { ...board, position: "1" }));
    await assertFails(setDoc(doc(db, "boards", "posicion-alta"), { ...board, position: 100 }));
  });
  test("rechaza referencias a tableros, estados y calendarios inexistentes", async () => {
    const db = env.authenticatedContext("creator", { ...claims, email: sampleBoard.createdBy }).firestore();
    await assertFails(setDoc(doc(db, "tasks", "orphan"), { ...data(sampleTask), boardId: "missing" }));
    await assertFails(setDoc(doc(db, "tasks", "wrong-state"), { ...data(sampleTask), status: "missing" }));
    await assertFails(setDoc(doc(db, "events", "orphan"), { ...data(sampleEvent), calendarId: "missing" }));
    await assertFails(setDoc(doc(db, "folders", "self"), { ...data(sampleFolder), parentId: "self" }));
  });
  test("artículo y contenido se pueden crear en un lote, sin permitir contenido huérfano", async () => {
    const db = env.authenticatedContext("creator", { ...claims, email: samplePage.createdBy }).firestore();
    const metadata = data(samplePage);
    const content = { body: "# Texto", revision: 1, archived: false, createdBy: samplePage.createdBy, updatedBy: samplePage.updatedBy, createdAt: samplePage.createdAt, updatedAt: samplePage.updatedAt };
    await assertFails(setDoc(doc(db, "wikiContent", "orphan-content"), content));
    const batch = writeBatch(db); batch.set(doc(db, "wikiPages", "atomic"), metadata); batch.set(doc(db, "wikiContent", "atomic"), content); await assertSucceeds(batch.commit());
  });
  test("los comentarios se agregan con autor real y no permiten reescribir el historial", async () => {
    const email = sampleTask.createdBy, db = env.authenticatedContext("commenter", { ...claims, email }).firestore();
    const ref = doc(db, "tasks", "comment-integrity"); await assertSucceeds(setDoc(ref, data(sampleTask)));
    const comment = { id: "first-comment", body: "Publicado", author: "outside@gmail.com", createdAt: sampleTask.createdAt };
    await assertFails(updateDoc(ref, { revision: 2, comments: [comment] }));
    await assertSucceeds(updateDoc(ref, { revision: 2, comments: [{ ...comment, author: email }] }));
    await assertFails(updateDoc(ref, { revision: 3, comments: [{ ...comment, author: email, body: "Alterado" }] }));
  });
  test("deniega colecciones ajenas y subcolecciones", async () => {
    const db = env.authenticatedContext("creator", { ...claims, email: samplePage.createdBy }).firestore();
    for (const path of ["members/admin", "config/access", "wikiPages/page/private/data"]) { await assertFails(getDoc(doc(db, path))); await assertFails(setDoc(doc(db, path), { admin: true })); }
  });
  test("el registro financiero protege las monedas, centavos, autoría y pagos existentes", async () => {
    const email = sampleFinance.createdBy, db = env.authenticatedContext("finance-owner", { ...claims, email }).firestore(), ref = doc(db, "financeEntries", "finance-permissions");
    const input = { ...data(sampleFinance), paidDates: [] };
    await assertSucceeds(setDoc(ref, input));
    await assertFails(updateDoc(ref, { currency: "EUR", revision: 2 }));
    await assertFails(updateDoc(ref, { amount: 1.5, revision: 2 }));
    await assertFails(updateDoc(ref, { createdBy: "outside@gmail.com", revision: 2 }));
    await assertSucceeds(updateDoc(ref, { paidDates: ["2026-01-31"], revision: 2 }));
    await assertFails(updateDoc(ref, { amount: 999, revision: 3 }));
    await assertFails(deleteDoc(ref));
  });

  test("los eventos admiten Meet opcional y rechazan enlaces externos", async () => {
    const email = sampleEvent.createdBy, db = env.authenticatedContext("meet-owner", { ...claims, email }).firestore(), ref = doc(db, "events", "meet-rules");
    const initial = { ...data(sampleEvent), meetUrl: "https://meet.google.com/abc-defg-hij" };
    await assertSucceeds(setDoc(ref, initial));
    await assertFails(updateDoc(ref, { revision: 2, meetUrl: "https://example.com" }));
    await assertFails(updateDoc(ref, { revision: 2, meetUrl: "javascript:alert(1)" }));
    await assertSucceeds(updateDoc(ref, { revision: 2, meetUrl: "" }));
  });

});
