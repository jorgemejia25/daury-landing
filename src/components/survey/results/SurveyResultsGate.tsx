"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCareSurveyResults,
  type CareSurveyResultRecord,
} from "@/actions/get-survey-results";

const STORAGE_KEY = "daury.survey.adminKey";

type Status =
  | { kind: "loading" }
  | { kind: "gate"; error?: string }
  | { kind: "not-configured" }
  | { kind: "server-error" }
  | { kind: "ready"; records: CareSurveyResultRecord[] };

function readStoredKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, key);
  } catch {
    /* localStorage puede estar bloqueado (modo privado); ignoramos. */
  }
}

function clearStoredKey(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}

export default function SurveyResultsGate({
  children,
}: {
  children: (args: {
    records: CareSurveyResultRecord[];
    onReset: () => void;
  }) => React.ReactNode;
}) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [inputKey, setInputKey] = useState("");

  const authorize = useCallback(async (key: string) => {
    setStatus({ kind: "loading" });
    const result = await getCareSurveyResults(key);
    if (result.ok) {
      setStatus({ kind: "ready", records: result.records });
      return;
    }
    if (result.reason === "not-configured") {
      setStatus({ kind: "not-configured" });
    } else if (result.reason === "unauthorized") {
      clearStoredKey();
      setStatus({ kind: "gate", error: "La clave no es válida." });
    } else {
      setStatus({ kind: "server-error" });
    }
  }, []);

  useEffect(() => {
    const stored = readStoredKey();
    if (!stored) {
      setStatus({ kind: "gate" });
      return;
    }
    void authorize(stored);
  }, [authorize]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputKey.trim();
    if (!trimmed) return;
    writeStoredKey(trimmed);
    setInputKey("");
    void authorize(trimmed);
  };

  const handleReset = () => {
    clearStoredKey();
    setStatus({ kind: "gate" });
    setInputKey("");
  };

  if (status.kind === "ready") {
    return (
      <>
        {children({
          records: status.records,
          onReset: handleReset,
        })}
      </>
    );
  }

  return (
    <main className="sr-gate relative min-h-screen flex items-center justify-center p-[var(--pad)] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_50%_at_80%_0%,rgba(110,59,214,0.10),transparent_70%),radial-gradient(50%_40%_at_10%_100%,rgba(35,88,232,0.08),transparent_70%)]"
      />
      <div className="container relative z-[1] w-full max-w-[520px] mx-auto">
        {status.kind === "loading" && (
          <GateCard>
            <span className="eyebrow mb-5">Acceso</span>
            <h1 className="display m-0 text-[clamp(28px,4vw,40px)] text-[var(--survey-ink)] tracking-[-0.03em] leading-none">
              Verificando…
            </h1>
            <p className="m-0 text-[var(--survey-soft)] text-[15px]">Confirmando tu clave en este navegador.</p>
          </GateCard>
        )}

        {status.kind === "not-configured" && (
          <GateCard>
            <span className="eyebrow mb-5">Pendiente</span>
            <h1 className="display m-0 text-[clamp(28px,4vw,40px)] text-[var(--survey-ink)] tracking-[-0.03em] leading-none">
              Configura el acceso
            </h1>
            <p className="m-0 text-[var(--survey-soft)] text-[15px] leading-[1.6]">
              Este panel muestra respuestas sensibles, por eso está cerrado por defecto. Define la
              variable de entorno <Code>SURVEY_ADMIN_KEY</Code> (por ejemplo en <Code>.env.local</Code>)
              para habilitar el acceso con API key.
            </p>
          </GateCard>
        )}

        {status.kind === "server-error" && (
          <GateCard>
            <span className="eyebrow mb-5">Error</span>
            <h1 className="display m-0 text-[clamp(28px,4vw,40px)] text-[var(--survey-ink)] tracking-[-0.03em] leading-none">
              No se pudieron cargar los resultados
            </h1>
            <p className="m-0 text-[var(--survey-soft)] text-[15px] leading-[1.6]">
              Revisa que <Code>NEXT_PUBLIC_CONVEX_URL</Code> esté configurada y que Convex esté disponible.
            </p>
            <button type="button" className="btn btn-ghost self-start px-[14px] py-3.5" onClick={handleReset}>
              Reintentar
              <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </GateCard>
        )}

        {status.kind === "gate" && (
          <form onSubmit={handleSubmit} className="sr-gate-card flex flex-col gap-[18px] p-[clamp(36px,5vw,64px)] rounded-[var(--radius-xl)] bg-[var(--survey-surface)] border border-[var(--survey-border)] backdrop-blur-xl shadow-[0_30px_80px_-48px_rgba(61,58,80,0.5)]">
            <h1 className="display m-0 text-[clamp(28px,4vw,40px)] text-[var(--survey-ink)] tracking-[-0.03em] leading-none">
              Resultados
            </h1>
            <p className="m-[-4px_0_8px] text-[var(--survey-soft)] text-base leading-[1.5]">
              Ingresa tu API key para continuar.
            </p>
            <input
              type="password"
              name="key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="API key"
              autoComplete="off"
              autoFocus
              className="w-full px-[22px] py-[18px] rounded-[14px] border border-[var(--survey-border-strong)] bg-[var(--bg-elev)] text-[var(--survey-ink)] font-['Geist',system-ui,sans-serif] text-base transition-[border-color,box-shadow] duration-200 ease-[var(--ease)] placeholder:text-[var(--survey-faint)] focus:outline-none focus:border-[var(--violet)] focus:shadow-[0_0_0_4px_rgba(110,59,214,0.16)]"
            />
            <button type="submit" className="btn btn-primary w-full px-7 py-[18px] rounded-[14px] justify-center text-base">
              Entrar
            </button>
            {status.error && (
              <p className="m-0 text-[var(--coral)] text-[13px] font-medium text-center">{status.error}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}

function GateCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="sr-gate-card flex flex-col gap-[18px] p-[clamp(36px,5vw,64px)] rounded-[var(--radius-xl)] bg-[var(--survey-surface)] border border-[var(--survey-border)] backdrop-blur-xl shadow-[0_30px_80px_-48px_rgba(61,58,80,0.5)]">
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-['Geist_Mono',ui-monospace,monospace] text-[13px] text-[var(--survey-ink)] bg-[color-mix(in_oklab,var(--survey-ink)_6%,transparent)] px-1.5 py-0.5 rounded-[6px]">
      {children}
    </code>
  );
}