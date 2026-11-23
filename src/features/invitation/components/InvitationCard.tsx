"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowUpRight, Copy } from "lucide-react";
import { invitationAppLink } from "../lib/invitation-link";

const messages = {
  es: {
    title: "Te invitaron a cuidar en familia",
    body: "Abre Daury para unirte y ver la rutina compartida.",
    open: "Abrir Daury",
    copy: "Copiar código",
    copied: "Código copiado",
    manual: "Si la app no se abre, copia el código y pégalo en Familia → Unirme con un código.",
    copyError: "Selecciona el código para copiarlo.",
    missing: "Este enlace no contiene un código válido. Pide a quien te invitó que vuelva a compartirlo.",
  },
  en: {
    title: "You’re invited to care together",
    body: "Open Daury to join the care circle and see its shared routine.",
    open: "Open Daury",
    copy: "Copy code",
    copied: "Code copied",
    manual: "If the app doesn’t open, copy the code and paste it in Family → Join with a code.",
    copyError: "Select the code to copy it.",
    missing: "This link doesn’t have a valid code. Ask the person who invited you to share it again.",
  },
} as const;

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const readFragment = () => window.location.hash;
const beforeHydration = () => null;
const browserLanguage = () => navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
const defaultLanguage = () => "es" as const;

export function InvitationCard() {
  const fragment = useSyncExternalStore(subscribe, readFragment, beforeHydration);
  const lang = useSyncExternalStore(subscribe, browserLanguage, defaultLanguage);
  const t = messages[lang];
  const [copied, setCopied] = useState<{ code: string; status: "done" | "unavailable" }>();
  const invitation = invitationAppLink(fragment);
  const code = invitation?.code;
  const status = copied?.code === code ? copied?.status : undefined;

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied({ code, status: "done" });
    } catch {
      setCopied({ code, status: "unavailable" });
    }
  };

  return (
    <section lang={lang} aria-labelledby="invitation-title" className="w-full max-w-lg rounded-[32px] border border-rule bg-surface p-7 text-ink shadow-[0_14px_50px_rgba(23,25,33,0.08)] sm:p-10">
      <div className="mb-6 grid size-20 place-items-center overflow-hidden rounded-[24px] bg-brand-soft">
        <Image src="/images/daury-mascot.svg" width={58} height={58} alt="" priority />
      </div>
      <h1 id="invitation-title" className="m-0 font-display text-[clamp(2rem,6vw,3.25rem)] leading-[0.98] font-extrabold tracking-[-0.045em]">{t.title}</h1>
      <p className="mt-4 text-base leading-relaxed text-ink-soft">{fragment !== null && !code ? t.missing : t.body}</p>
      {invitation && (
        <div className="mt-7 grid gap-3">
          <a href={invitation.href} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-center font-bold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
            {t.open}<ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <div className="mt-3 grid gap-3 rounded-[20px] border border-rule p-4">
            <p className="m-0 text-sm leading-relaxed text-ink-soft">{t.manual}</p>
            <code className="font-mono text-sm leading-relaxed break-words select-all">{invitation.code.match(/.{4}/g)?.join(" ")}</code>
            <button type="button" onClick={() => void copy()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-rule bg-surface px-4 py-2 font-sans text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
              <Copy size={16} aria-hidden="true" />{t.copy}
            </button>
            {status && <p aria-live="polite" className="m-0 text-sm text-ink-soft">{status === "done" ? t.copied : t.copyError}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
