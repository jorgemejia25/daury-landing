"use client";

import { useEffect, useRef, useState } from "react";
import { onIdTokenChanged, signOut } from "firebase/auth";
import { getAdminFirebase } from "@/features/admin/lib/firebase-client";
import { clearAdminSession, navigateAdmin, saveAdminSession } from "@/features/admin/lib/auth-client";

export function useAdminSession(uid: string) {
  const [error, setError] = useState("");
  const stopped = useRef(false);
  const queue = useRef(Promise.resolve());

  useEffect(() => {
    stopped.current = false;
    const { auth } = getAdminFirebase();
    let active = true;
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (!active || stopped.current) return;
      queue.current = queue.current.catch(() => {}).then(async () => {
        if (!active || stopped.current) return;
        if (!user || user.uid !== uid) {
          await clearAdminSession();
          navigateAdmin("/admin/login");
          return;
        }
        try {
          await saveAdminSession(await user.getIdToken());
          if (active) setError("");
        } catch (error) {
          if (error instanceof Error && error.message === "access-denied") {
            await clearAdminSession();
            await signOut(auth);
            navigateAdmin("/admin/login");
          } else if (active) {
            setError("No se pudo renovar la sesión. Revisa tu conexión.");
          }
        }
      }).catch(() => {
        if (active) setError("No se pudo comprobar la sesión. Revisa tu conexión.");
      });
    });
    const refresh = window.setInterval(() => {
      if (!stopped.current) void auth.currentUser?.getIdToken().catch(() => {
        if (active) setError("No se pudo renovar la sesión. Revisa tu conexión.");
      });
    }, 5 * 60 * 1000);
    return () => { active = false; unsubscribe(); window.clearInterval(refresh); };
  }, [uid]);

  async function logout() {
    stopped.current = true;
    setError("");
    try {
      await queue.current;
      await clearAdminSession();
      await signOut(getAdminFirebase().auth);
      navigateAdmin("/admin/login");
    } catch {
      stopped.current = false;
      setError("No se pudo cerrar la sesión. Inténtalo de nuevo.");
    }
  }

  return { error, logout };
}
