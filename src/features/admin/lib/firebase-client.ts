"use client";

import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export function getAdminFirebase() {
  const config: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  };
  const required = ["apiKey", "authDomain", "projectId", "appId"] as const;
  const missing = required.filter((key) => !config[key]?.trim());
  if (missing.length) {
    throw new Error(`Falta configurar Firebase para el admin: ${missing.join(", ")}. Revisa docs/firebase-setup.md.`);
  }
  const app = getApps().find((existing) => existing.name === "daury-admin") ?? initializeApp(config, "daury-admin");
  return { app, auth: getAuth(app), db: getFirestore(app) };
}
