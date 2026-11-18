import type { ReactNode } from "react";

/** Tecla de atajo ("⌘ K", "esc"). */
export function Kbd({ children, hidden = false }: { children: ReactNode; hidden?: boolean }) {
  return <kbd className="inline-flex items-center h-[22px] px-[7px] rounded-[5px] bg-surface text-ink-soft font-mono text-[11px] font-semibold leading-none whitespace-nowrap shadow-[inset_0_0_0_1px_var(--rule-strong),inset_0_-1px_0_var(--rule-strong)]" aria-hidden={hidden || undefined}>{children}</kbd>;
}
