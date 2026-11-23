import { describe, expect, it } from "vitest";
import { invitationAppLink } from "./invitation-link";

describe("invitation landing", () => {
  const code = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  it("hands a valid fragment to the Daury join screen", () => {
    expect(invitationAppLink(`#code=${code}`)).toEqual({ code, href: `daury:///join?code=${code}` });
  });

  it("rejects missing, malformed and ambiguous codes", () => {
    expect(invitationAppLink(null)).toBeNull();
    expect(invitationAppLink("#code=https://example.com")).toBeNull();
    expect(invitationAppLink(`#code=${code}&code=${code}`)).toBeNull();
    expect(invitationAppLink(`#code=${code}X`)).toBeNull();
  });
});
