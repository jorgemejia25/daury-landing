import { describe, expect, test } from "vitest";
import { googleEventBody } from "./google-calendar";
import { parseWorkspaceData } from "./workspace";

const timed = { title: "Sync", description: "Revisar avances", calendarId: "c", allDay: false, start: "2026-11-20T09:00:00-06:00", end: "2026-11-20T10:00:00-06:00", location: "", articleId: "", meetUrl: "https://meet.google.com/abc-defg-hij", meeting: true };

describe("Google Calendar", () => {
  test("eventos con hora: zona de Guatemala, Meet como ubicación y enlace a la reunión", () => {
    const body = googleEventBody(timed, { attendees: ["a@gmail.com"], meetingUrl: "https://daury.app/admin/reuniones/x" });
    expect(body.start).toEqual({ dateTime: timed.start, date: null, timeZone: "America/Guatemala" });
    expect(body.location).toBe(timed.meetUrl);
    expect(body.description).toBe("Revisar avances\n\nAgenda y preguntas: https://daury.app/admin/reuniones/x");
    expect(body.attendees).toEqual([{ email: "a@gmail.com" }]);
    expect(body).not.toHaveProperty("conferenceData");
  });
  test("todo el día usa fechas con fin exclusivo y no toca invitados si no se piden", () => {
    const body = googleEventBody({ ...timed, allDay: true, start: "2026-11-20", end: "2026-11-21", meetUrl: "" }, { meetRequestId: "r1" });
    expect(body.start).toEqual({ date: "2026-11-20", dateTime: null, timeZone: null });
    expect(body.end.date).toBe("2026-11-21");
    expect(body).not.toHaveProperty("attendees");
    expect(body.conferenceData?.createRequest.conferenceSolutionKey.type).toBe("hangoutsMeet");
  });
  test("el formulario no puede escribir el vínculo con Google", () => {
    expect(parseWorkspaceData("events", { ...timed, google: { id: "dabc12", url: "https://www.google.com/calendar/event?eid=x", owner: "devjorgemejia@gmail.com", revision: 1 } })).not.toHaveProperty("google");
  });
});
