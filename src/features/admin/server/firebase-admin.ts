import "server-only";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export function getAdminAuth() {
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error("El admin requiere tokens firmados por Firebase Authentication.");
  }
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("Falta configurar el proyecto Firebase.");
  const app = getApps().find((app) => app.name === "daury-wiki-server") ??
    initializeApp({ projectId }, "daury-wiki-server");
  // La verificación usa certificados públicos; no necesita una clave de servicio.
  return getAuth(app);
}
