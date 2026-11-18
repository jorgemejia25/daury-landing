"use client";

import { useState } from "react";
import Link from "next/link";
import { GoogleAuthProvider, browserSessionPersistence, setPersistence, signInWithPopup, signOut } from "firebase/auth";
import { ArrowUpRight } from "lucide-react";
import { AppLogo } from "@/ui/atoms/AppLogo";
import { Button } from "@/ui/atoms/Button";
import { GoogleLogo } from "@/ui/atoms/GoogleLogo";
import { getAdminFirebase } from "@/features/admin/lib/firebase-client";
import { authErrorMessage, navigateAdmin, saveAdminSession } from "@/features/admin/lib/auth-client";
import "@/features/admin/lib/agent";
import styles from "./LoginPanel.styles";

/**
 * Inicio de sesión con Google. El token se valida en el servidor mediante una
 * Server Action antes de entrar al admin.
 */
export function LoginPanel() {
  const [error, setError] = useState("");

  async function login() {
    setError("");
    try {
      const { auth } = getAdminFirebase();
      await setPersistence(auth, browserSessionPersistence);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credential = await signInWithPopup(auth, provider);
      try {
        await saveAdminSession(await credential.user.getIdToken());
      } catch (error) {
        await signOut(auth);
        throw error;
      }
      navigateAdmin("/admin");
    } catch (error) {
      setError(authErrorMessage(error));
    }
  }

  return (
    <main className={styles.screen}>
      <div className={styles.content}>
        <div className={styles.hero}>
          <Link href="/es" className={styles.logo} aria-label="Daury, ir a la landing">
            <AppLogo size={112} word="" />
          </Link>
          <h1 className={styles.title}>Daury Admin</h1>
        </div>
        <div className={styles.actions}>
          <Button
            variant="surface"
            size="lg"
            fullWidth
            icon={<GoogleLogo size={24} />}
            onClick={login}
            pendingAnnouncement="Iniciando sesión con Google"
          >
            Continuar con Google
          </Button>
          <p className={styles.error} role="alert">{error}</p>
          <Button
            variant="text"
            size="md"
            render={<Link href="/es" />}
            icon={<ArrowUpRight size={18} strokeWidth={2.2} aria-hidden="true" />}
            iconPosition="trailing"
          >
            Volver a la landing
          </Button>
        </div>
      </div>
    </main>
  );
}
