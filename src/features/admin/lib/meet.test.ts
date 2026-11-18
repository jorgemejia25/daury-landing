import { expect, test } from "vitest";
import { normalizeMeetUrl, safeMeetUrl } from "./meet";
import { parseWorkspaceData } from "./workspace";
import { sampleEvent } from "./workspace.fixtures";

test("conserva enlaces oficiales de Meet y permite eventos antiguos sin enlace", () => {
  expect(normalizeMeetUrl(" https://meet.google.com/abc-defg-hij?authuser=0 ")).toBe("https://meet.google.com/abc-defg-hij?authuser=0");
  expect(normalizeMeetUrl("https://meet.google.com/lookup/equipo_daury")).toBe("https://meet.google.com/lookup/equipo_daury");
  expect(parseWorkspaceData("events", sampleEvent).meetUrl).toBe("");
  expect(parseWorkspaceData("events", { ...sampleEvent, meetUrl: "https://meet.google.com/abc-defg-hij" }).meetUrl).toBe("https://meet.google.com/abc-defg-hij");
});
test("rechaza otros sitios, scripts, credenciales y enlaces incompletos", () => {
  for (const value of ["javascript:alert(1)", "http://meet.google.com/abc-defg-hij", "https://meet.google.com.evil.test/abc-defg-hij", "https://user@meet.google.com/abc-defg-hij", "https://meet.google.com/", "meet.google.com/abc-defg-hij"]) {
    expect(() => normalizeMeetUrl(value)).toThrow(); expect(safeMeetUrl(value)).toBe("");
  }
  expect(normalizeMeetUrl(undefined)).toBe(""); expect(normalizeMeetUrl("")).toBe("");
});
