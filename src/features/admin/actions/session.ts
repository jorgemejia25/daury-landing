"use server";

import { cookies } from "next/headers";
import {
  verifyAdminToken,
  adminCookieOptions,
  adminSessionCookie,
} from "@/features/admin/server/session";

/**
 * Server Actions de sesión del admin.
 *
 * Sustituyen al antiguo route handler `/admin/session`. Next.js ya rechaza
 * peticiones cuyo `Origin` no coincide con el host (CSRF) y limita el tamaño
 * del cuerpo; aquí se valida el token y se decide la cookie.
 */
export type AdminSessionResult =
  | { ok: true }
  | { ok: false; error: "invalid-token" | "access-denied" | "expired-token" };

const MAX_TOKEN_LENGTH = 4096;
const MAX_SESSION_SECONDS = 3600;

async function clearCookie() {
  (await cookies()).set(adminSessionCookie, "", { ...adminCookieOptions, maxAge: 0 });
}

/** Verifica el ID token de Firebase y lo guarda en una cookie HttpOnly. */
export async function createAdminSession(idToken: unknown): Promise<AdminSessionResult> {
  if (typeof idToken !== "string" || !idToken || idToken.length > MAX_TOKEN_LENGTH) {
    return { ok: false, error: "invalid-token" };
  }
  let session: Awaited<ReturnType<typeof verifyAdminToken>>;
  try {
    session = await verifyAdminToken(idToken);
  } catch {
    return { ok: false, error: "invalid-token" };
  }
  if (!session) {
    await clearCookie();
    return { ok: false, error: "access-denied" };
  }
  const maxAge = Math.min(
    MAX_SESSION_SECONDS,
    session.expiresAt - Math.floor(Date.now() / 1000),
  );
  if (maxAge <= 0) return { ok: false, error: "expired-token" };
  (await cookies()).set(adminSessionCookie, idToken, { ...adminCookieOptions, maxAge });
  return { ok: true };
}

/** Elimina la cookie de sesión. */
export async function deleteAdminSession(): Promise<void> {
  await clearCookie();
}
