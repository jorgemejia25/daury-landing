"use client";

import { createAdminSession, deleteAdminSession } from "@/features/admin/actions/session";

export function navigateAdmin(path: "/admin" | "/admin/login") {
  window.location.replace(path);
}

/** Intercambia el ID token de Firebase por la cookie de sesión (Server Action). */
export async function saveAdminSession(idToken: string) {
  const result = await createAdminSession(idToken);
  if (!result.ok) {
    throw new Error(result.error === "access-denied" ? "access-denied" : "session-failed");
  }
}

/** Elimina la cookie de sesión (Server Action). */
export async function clearAdminSession() {
  await deleteAdminSession();
}

export function authErrorMessage(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  if (error instanceof Error && error.message === "access-denied") {
    return "Esta cuenta no tiene acceso a Daury Admin. Elige una cuenta autorizada.";
  }
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "Se cerró el inicio de sesión. Puedes intentarlo de nuevo.";
  }
  if (code === "auth/popup-blocked") return "Permite las ventanas emergentes para iniciar sesión con Google.";
  if (code === "auth/network-request-failed") return "Revisa tu conexión e inténtalo de nuevo.";
  return "No se pudo iniciar sesión. Inténtalo de nuevo.";
}
