"use client";

import { GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { getAdminFirebase } from "./firebase-client";
import { calendarScope } from "./google-calendar";

/** Token de Google con permiso de Calendar. Vive solo en memoria de esta pestaña (unos 50 minutos). */
let cached: { token: string; email: string; expires: number } | null = null;

export function forgetCalendarToken() { cached = null; }

/**
 * Pide el permiso de Google Calendar con la misma cuenta de la sesión (ventana de Google).
 * Si ya se concedió en esta pestaña y sigue vigente, no vuelve a abrir la ventana.
 */
export async function calendarAccessToken(force = false): Promise<string> {
  const { auth } = getAdminFirebase(), user = auth.currentUser;
  if (!user?.email) throw new Error("Tu sesión ha vencido. Vuelve a iniciar sesión.");
  const email = user.email.toLowerCase();
  if (!force && cached && cached.email === email && cached.expires > Date.now()) return cached.token;
  const provider = new GoogleAuthProvider();
  provider.addScope(calendarScope);
  provider.setCustomParameters({ login_hint: email });
  const result = await reauthenticateWithPopup(user, provider);
  const token = GoogleAuthProvider.credentialFromResult(result)?.accessToken;
  if (!token) throw new Error("Google no devolvió el permiso de Calendar. Inténtalo de nuevo.");
  cached = { token, email, expires: Date.now() + 50 * 60000 };
  return token;
}

export function calendarErrorMessage(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  if (code === "auth/user-mismatch") return "Elige la misma cuenta de Google con la que entraste al admin.";
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return "Se cerró la ventana de Google. Puedes intentarlo de nuevo.";
  if (code === "auth/popup-blocked") return "Permite las ventanas emergentes para conectar Google Calendar.";
  if (error instanceof Error && !("code" in error)) return error.message;
  return "No se pudo conectar con Google Calendar. Inténtalo de nuevo.";
}
