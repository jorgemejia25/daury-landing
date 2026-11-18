import { describe, expect, test } from "vitest";
import { parseWorkspaceData, folderDescendants } from "./workspace";
import { sampleBoard, sampleTask, sampleEvent, sampleFolder, samplePage } from "./workspace.fixtures";
describe("validación de elementos compartidos", () => {
  test("preserva exactamente el Markdown y excluye metadatos enviados por el navegador", () => {
    const parsed = parseWorkspaceData("wikiPages", { ...samplePage, body: "\n  texto con espacios\n", createdBy: "suplantado" });
    expect(parsed.body).toBe("\n  texto con espacios\n"); expect(parsed).not.toHaveProperty("createdBy");
  });
  test("rechaza estados, columnas y subtareas mal formados", () => {
    expect(() => parseWorkspaceData("boards", { ...sampleBoard, columnOrder: ["todo", "todo"] })).toThrow();
    expect(() => parseWorkspaceData("tasks", { ...sampleTask, title: "" })).toThrow();
    expect(() => parseWorkspaceData("tasks", { ...sampleTask, dueDate: "2026-02-30" })).toThrow();
    expect(() => parseWorkspaceData("tasks", { ...sampleTask, points: -1 })).toThrow();
    expect(() => parseWorkspaceData("tasks", { ...sampleTask, assignee: "outside@gmail.com" })).toThrow();
  });
  test("valida fin exclusivo, fechas reales y zona horaria en los eventos", () => {
    expect(() => parseWorkspaceData("events", { ...sampleEvent, end: sampleEvent.start })).toThrow();
    expect(() => parseWorkspaceData("events", { ...sampleEvent, allDay: false, start: "2026-02-30T09:00:00-06:00", end: "2026-03-01T10:00:00-06:00" })).toThrow();
    expect(() => parseWorkspaceData("events", { ...sampleEvent, allDay: false, start: "2026-11-20T09:00", end: "2026-11-20T10:00" })).toThrow();
    expect(parseWorkspaceData("events", { ...sampleEvent, allDay: false, start: "2026-11-20T09:00-06:00", end: "2026-11-20T10:00-06:00" }).allDay).toBe(false);
  });
  test("calcula los descendientes sin atascarse con una referencia circular", () => {
    const folders = [sampleFolder, { ...sampleFolder, id: "child", parentId: sampleFolder.id }, { ...sampleFolder, id: "grandchild", parentId: "child" }];
    expect([...folderDescendants(folders, sampleFolder.id)]).toEqual([sampleFolder.id, "child", "grandchild"]);
  });
});
