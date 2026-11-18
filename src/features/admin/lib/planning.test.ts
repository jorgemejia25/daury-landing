import { describe, expect, test } from "vitest";
import { addDays, isDateOnly, localDate, monthDays, shiftMonth } from "./dates";
import {
  eventBounds,
  eventsInMonth,
  occursOn,
  parseBoard,
  parseCalendars,
  parseEvents,
  taskDeadlines,
} from "./planning";
import {
  testBoard,
  testCategories,
  testEvents,
} from "./planning.fixtures";

describe("archivos de planificación", () => {
  test("valida referencias de tareas y rechaza estados, fechas e identificadores inválidos", () => {
    expect(parseBoard(testBoard, ["producto"]).tasks).toHaveLength(3);
    for (const change of [
      { status: "inventado" },
      { priority: "urgente" },
      { dueDate: "2026-02-30" },
      { area: "otro" },
      { documentSlug: "inexistente" },
      { order: "primero" },
    ]) {
      expect(() =>
        parseBoard(
          { ...testBoard, tasks: [{ ...testBoard.tasks[0], ...change }] },
          ["producto"],
        ),
      ).toThrow();
    }
    expect(() =>
      parseBoard(
        { ...testBoard, tasks: [testBoard.tasks[0], testBoard.tasks[0]] },
        ["producto"],
      ),
    ).toThrow(/duplicado/);
    expect(() =>
      parseBoard({ areas: [], tasks: testBoard.tasks }, ["producto"]),
    ).toThrow(/área desconocida/);
  });

  test("valida calendarios, referencias y rangos horarios", () => {
    expect(parseCalendars(testCategories)).toHaveLength(2);
    expect(parseEvents(testEvents, testCategories, ["producto"])).toHaveLength(
      3,
    );
    for (const change of [
      { calendarId: "otro" },
      { start: "2026-11-17T15:00:00" },
      { start: "2026-11-17T24:00:00Z" },
      { end: "2026-11-17T14:00:00Z" },
      { documentSlug: "inexistente" },
    ]) {
      expect(() =>
        parseEvents([{ ...testEvents[0], ...change }], testCategories, [
          "producto",
        ]),
      ).toThrow();
    }
    expect(() =>
      parseEvents(
        [{ ...testEvents[1], end: "2026-11-20" }],
        testCategories,
        [],
      ),
    ).toThrow(/exclusivo/);
    expect(() =>
      parseCalendars([...testCategories, testCategories[0]]),
    ).toThrow(/duplicado/);
    expect(() =>
      parseCalendars([{ id: "task-deadlines", name: "Tareas", color: "blue" }]),
    ).toThrow(/reservado/);
  });

  test("deriva fechas de tareas abiertas sin duplicar tareas completadas", () => {
    const deadlines = taskDeadlines(testBoard.tasks);
    expect(deadlines.map((event) => event.id)).toEqual([
      "task:wiki-docs",
      "task:wiki-design",
    ]);
    expect(deadlines[0].start).toBe("2026-11-18");
    expect(deadlines[0].taskId).toBe("wiki-docs");
  });
});

describe("fechas del calendario", () => {
  test("mantiene días completos, años bisiestos y cambios de mes", () => {
    expect(isDateOnly("2024-02-29")).toBe(true);
    expect(isDateOnly("2026-02-29")).toBe(false);
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(shiftMonth("2026-12", 1)).toBe("2027-01");
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
    const days = monthDays("2026-11");
    expect(days).toHaveLength(42);
    expect(days[0]).toBe("2026-10-26");
    expect(new Set(days).size).toBe(42);
  });

  test("muestra eventos UTC en Guatemala y respeta un fin exclusivo a medianoche", () => {
    expect(localDate("2026-11-18T05:30:00Z")).toBe("2026-11-17");
    const night = {
      ...testEvents[0],
      start: "2026-11-18T05:30:00Z",
      end: "2026-11-18T06:00:00Z",
    };
    expect(eventBounds(night)).toEqual({
      first: "2026-11-17",
      last: "2026-11-17",
    });
    expect(occursOn(night, "2026-11-18")).toBe(false);
    expect(occursOn(testEvents[2], "2026-12-02")).toBe(true);
    expect(occursOn(testEvents[2], "2026-12-03")).toBe(false);
  });

  test("incluye eventos que cruzan meses sin duplicarlos en la agenda", () => {
    expect(
      eventsInMonth(testEvents, "2026-12").map((event) => event.id),
    ).toEqual(["cierre"]);
    expect(eventsInMonth(testEvents, "2027-01")).toEqual([]);
  });

  test("ordena horas por su instante real aunque tengan offsets diferentes", () => {
    const late = {
      ...testEvents[0],
      id: "tarde",
      start: "2026-11-17T10:00:00-06:00",
      end: "2026-11-17T11:00:00-06:00",
    };
    const early = {
      ...testEvents[0],
      id: "temprano",
      start: "2026-11-17T15:00:00Z",
      end: "2026-11-17T15:30:00Z",
    };
    expect(
      eventsInMonth([late, early], "2026-11").map((event) => event.id),
    ).toEqual(["temprano", "tarde"]);
  });
});
