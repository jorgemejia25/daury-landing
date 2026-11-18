import { describe, expect, test } from "vitest";
import { hasAdminAccess, adminAllowedEmails } from "./access";

const claims = { email_verified: true, firebase: { sign_in_provider: "google.com" } };

describe("acceso cerrado a Daury Admin", () => {
  test.each(adminAllowedEmails)("permite Google verificado para %s", (email) => {
    expect(hasAdminAccess({ ...claims, email })).toBe(true);
    expect(hasAdminAccess({ ...claims, email: email.toUpperCase() })).toBe(true);
  });
  test("deniega otras cuentas y alias que no están autorizados", () => {
    for (const email of ["externa@gmail.com", "devjorgemejia+wiki@gmail.com", " devjorgemejia@gmail.com", "devjorgemejia@gmail.com.evil.test", null, 123]) {
      expect(hasAdminAccess({ ...claims, email })).toBe(false);
    }
  });
  test("requiere correo verificado y proveedor Google, incluso para un correo autorizado", () => {
    const email = "devjorgemejia@gmail.com";
    expect(hasAdminAccess({ ...claims, email, email_verified: false })).toBe(false);
    expect(hasAdminAccess({ ...claims, email, email_verified: "true" })).toBe(false);
    expect(hasAdminAccess({ ...claims, email, firebase: { sign_in_provider: "password" } })).toBe(false);
    expect(hasAdminAccess({ email })).toBe(false);
    expect(hasAdminAccess({})).toBe(false);
  });
});
