import { describe, expect, test } from "vitest";
import { agendaTiming, isMeetingEvent, meetingPhase, normalizeRecordingUrl, parseMeetingData, sortQuestions, transcriptFromFile } from "./meetings";
import { parseWorkspaceData } from "./workspace";

const agenda = [{ id: "a1", title: " Avances ", minutes: 20, owner: "devjorgemejia@gmail.com", done: false }];
const timed = { allDay: false, start: "2026-11-20T15:00:00.000Z", end: "2026-11-20T16:00:00.000Z" };

describe("reuniones", () => {
  test("un evento es reunión si se marcó; los anteriores, si tienen Meet", () => {
    expect(isMeetingEvent({ meeting: true })).toBe(true);
    expect(isMeetingEvent({ meeting: false, meetUrl: "https://meet.google.com/abc-defg-hij" })).toBe(false);
    expect(isMeetingEvent({ meetUrl: "https://meet.google.com/abc-defg-hij" })).toBe(true);
    expect(isMeetingEvent({})).toBe(false);
  });
  test("los eventos guardan el indicador de reunión", () => {
    const base = { title: "Sync", description: "", calendarId: "social", allDay: true, start: "2026-11-20", end: "2026-11-21", location: "", articleId: "" };
    expect(parseWorkspaceData("events", { ...base, meeting: true }).meeting).toBe(true);
    expect(parseWorkspaceData("events", { ...base, meetUrl: "https://meet.google.com/abc-defg-hij" }).meeting).toBe(true);
    expect(parseWorkspaceData("events", base).meeting).toBe(false);
    expect(() => parseWorkspaceData("events", { ...base, meeting: "sí" })).toThrow();
  });
  test("valida la ficha: agenda, responsables, tamaños y grabación", () => {
    const data = parseMeetingData("weekly", { agenda, notes: " Acuerdos ", transcript: "Ana: hola", recordingUrl: "https://drive.google.com/file/d/x" });
    expect(data).toMatchObject({ eventId: "weekly", notes: "Acuerdos", agenda: [{ title: "Avances", minutes: 20 }] });
    expect(() => parseMeetingData("weekly", { ...data, agenda: [{ ...agenda[0], owner: "outside@gmail.com" }] })).toThrow(/responsable/);
    expect(() => parseMeetingData("weekly", { ...data, agenda: [{ ...agenda[0], minutes: 481 }] })).toThrow();
    expect(() => parseMeetingData("weekly", { ...data, agenda: [agenda[0], agenda[0]] })).toThrow(/repetidos/);
    expect(() => parseMeetingData("weekly", { ...data, agenda: [{ ...agenda[0], title: " " }] })).toThrow();
    expect(() => parseMeetingData("weekly", { ...data, transcript: "x".repeat(200001) })).toThrow();
    expect(() => normalizeRecordingUrl("http://example.com/video")).toThrow();
    expect(() => normalizeRecordingUrl("javascript:alert(1)")).toThrow();
    expect(normalizeRecordingUrl("")).toBe("");
  });
  test("compara la agenda con la duración del evento", () => {
    expect(agendaTiming([{ minutes: 40 }, { minutes: 30 }], timed)).toEqual({ planned: 70, available: 60, over: true });
    expect(agendaTiming([{ minutes: 40 }], { allDay: true, start: "2026-11-20", end: "2026-11-21" }).available).toBeNull();
  });
  test("distingue reuniones próximas, en curso y pasadas", () => {
    expect(meetingPhase(timed, Date.parse("2026-11-20T14:59:00Z"))).toBe("upcoming");
    expect(meetingPhase(timed, Date.parse("2026-11-20T15:30:00Z"))).toBe("live");
    expect(meetingPhase(timed, Date.parse("2026-11-20T16:00:00Z"))).toBe("past");
    expect(meetingPhase({ allDay: true, start: "2026-11-20", end: "2026-11-21" }, 0, "2026-11-20")).toBe("live");
  });
  test("ordena las preguntas: abiertas y más votadas primero", () => {
    const items = [
      { id: "a", resolved: true, votes: ["x", "y", "z"], createdAt: "1" },
      { id: "b", resolved: false, votes: ["x"], createdAt: "2" },
      { id: "c", resolved: false, votes: ["x", "y"], createdAt: "3" },
      { id: "d", resolved: false, votes: ["x"], createdAt: "1" },
    ];
    expect(sortQuestions(items).map((item) => item.id)).toEqual(["c", "d", "b", "a"]);
  });
  test("convierte subtítulos WebVTT y SRT en texto por hablante", () => {
    const vtt = "WEBVTT\n\nNOTE generado por Meet\n\n1\n00:00:01.000 --> 00:00:03.000\n<v Ana>Hola a todos</v>\n\n2\n00:00:03.000 --> 00:00:05.000\n<v Ana>empecemos.</v>\n\n3\n00:00:05.000 --> 00:00:07.000\n<v Luis>Perfecto.</v>\n";
    expect(transcriptFromFile(vtt)).toBe("Ana: Hola a todos empecemos.\n\nLuis: Perfecto.");
    const srt = "1\r\n00:00:01,000 --> 00:00:02,000\r\nPrimera parte\r\n\r\n2\r\n00:00:02,000 --> 00:00:03,000\r\nde la frase.\r\n\r\n3\r\n00:00:03,000 --> 00:00:04,000\r\nOtra.\r\n";
    expect(transcriptFromFile(srt)).toBe("Primera parte de la frase.\n\nOtra.");
    expect(transcriptFromFile("  Texto libre\r\nsegunda línea ")).toBe("Texto libre\nsegunda línea");
  });
});
